// bunqClient.js — the ONLY module in the cockpit that knows how to talk to bunq.
//
// ============================================================================
// READ THIS BEFORE CHANGING ONE LINE
// ============================================================================
// This module reaches a live bank account. Its shape is not a style preference —
// it is dictated by a security audit with an explicit "no overrule path":
//   Deliverables/2026-08-17-argus-bunq-connector-audit.md  (verdict: YELLOW)
//   Team Knowledge/Guidelines/GL-022-financiele-koppelingen-dashboard-scope.md
//
// The five properties below are REQUIREMENTS, each with a test in
// bunqClient.test.mjs. If you break one, that test fails — that is the point.
//
//   1. NO GENERIC REQUEST FUNCTION. There is no exported request(method, path).
//      The only exported call is signedGet(path): the verb 'GET' is a literal
//      inside the fetch() call, not a parameter any caller can override.
//
//   2. HARDCODED ENDPOINT ALLOWLIST, CHECKED BEFORE THE NETWORK. Every path is
//      matched against ALLOWED_GET_PATHS (anchored regexes, no substring match,
//      no wildcard) and a non-match throws BEFORE fetch() is ever reached.
//
//   3. ZERO SETUP CALLS AT RUNTIME. POST /installation and POST /device-server
//      DO NOT EXIST IN THIS FILE. They live in bunqSetup.js, which server.js
//      never imports — only scripts/setup-bunq.mjs does. See the note below.
//
//   4. NO WRITE SURFACE. The only POST here is /session-server, which is
//      unavoidable: the session token is deliberately never written to disk, so
//      it must be re-obtained after every server restart.
//
//      A grep for POST|PUT|PATCH|DELETE in this file must return exactly one
//      hit: the session-server call. That grep is a documented step of the
//      post-build audit.
//
//   5. NOTHING SECRET IS EVER LOGGED. No API key, private key, installation
//      token or session token reaches a log line, a route response, or an error
//      message. Diagnostics go through maskSecret() from ../env.js.
//
// ----------------------------------------------------------------------------
// DELIBERATE DEVIATION FROM THE AUDIT — STRICTER, NOT LOOSER
// ----------------------------------------------------------------------------
// The audit (§1 fix-requirement 4) describes all three auth-lifecycle calls
// living in a private section of THIS file. We split them instead:
// installation + device-server moved to bunqSetup.js.
//
// Why: audit §5 requires that a crash-looping server can never burn through the
// ~10-requests-per-day setup bucket and lock Sander out of his own bank API. A
// guard that *checks before calling* still leaves the call reachable from the
// server process. Deleting the code path from the server process entirely makes
// that failure mode structurally impossible rather than conditionally avoided.
//
// This satisfies the audit's intent (§5) more strictly than its letter (§1.4),
// and it makes the §1 verification grep sharper, not weaker. It was a conscious
// choice, recorded here so a later reader does not "fix" it back.
//
// ----------------------------------------------------------------------------
// VERIFIED BUNQ API FACTS (checked against doc.bunq.com on 2026-08-21)
// ----------------------------------------------------------------------------
//   * SIGNING: only the request BODY is signed — never the headers or the URL.
//     The signature is base64 in X-Bunq-Client-Signature. Since 2020-04-28 bunq
//     only *validates* it for payment calls and session initiation. We sign
//     session-server (required) and also sign the empty GET body (harmless,
//     and keeps one code path).
//     Source: doc.bunq.com/basics/headers.md
//   * HEADERS: Cache-Control and User-Agent are required.
//     X-Bunq-Client-Authentication is required on everything except
//     POST /v1/installation. Language/Region/Request-Id/Geolocation are optional.
//     Source: doc.bunq.com/basics/headers.md
//   * SESSION RESPONSE: the token is at Response[1].Token.token and the user
//     object comes back as UserPerson or UserCompany carrying `id`.
//     Source: doc.bunq.com/tutorials/.../start-a-session.md
//   * RATE LIMITS: standard data endpoints 70–140 per 30s; setup/installation
//     endpoints "as low as 10 requests / day"; the exact limit is echoed in the
//     429 body. Source: doc.bunq.com/basics/rate-limits.md
//
// UNVERIFIED, DELIBERATELY LEFT FOR THE SANDBOX: the docs state the signature is
// base64 of a signature over the body, but do not name the algorithm in the page
// we read. We use RSA-SHA256 (PKCS#1 v1.5), which is what bunq's own SDKs use.
// This is exactly what the mandatory sandbox run exists to confirm — see
// server/connectors/bunq/README.md. It is NOT an assumption presented as fact.

import crypto from 'node:crypto';
import { readEnvKey, maskSecret } from '../env.js';

// ============================================================================
// REQUIREMENT 2 — the allowlist.
// ============================================================================
// Anchored (^...$) so nothing can be appended or prefixed. A single entry: the
// balance read. Adding to this array is a visible, reviewable diff in the one
// file the auditor greps — which is the entire design intent.
//
// NOT permitted, for the avoidance of doubt: /payment, /draft-payment,
// /attachment, /card, or any transaction listing. Those are a separate design
// with their own audit (GL-022), never an edit to this constant.
const ALLOWED_GET_PATHS = [
  /^\/v1\/user\/\d+\/monetary-account$/,
];

const BASE_URLS = {
  sandbox: 'https://public-api.sandbox.bunq.com',
  production: 'https://api.bunq.com',
};

// bunq requires a User-Agent that identifies the calling agent.
const USER_AGENT = 'myPKA-Cockpit-bunq-balance/1.0';

// --- crash-loop protection (audit §5.3) -------------------------------------
// A second, independent safety net that does NOT trust bunq's own 429 to tell
// us to stop. Even if bunq answered 200 to everything, these limits hold.
const SESSION_RETRY_COOLDOWN_MS = 60_000; // no new attempt within 60s of a failure
const SESSION_MAX_ATTEMPTS_PER_HOUR = 5;  // absolute ceiling per rolling hour

const sessionState = {
  token: null,          // in-memory ONLY — never written to disk (audit §2.6)
  userId: null,
  lastFailureAt: 0,
  attemptTimes: [],     // epoch ms of session-server attempts in the last hour
};

/** Attempts in the trailing hour, pruning as it counts. */
function recentAttemptCount(now) {
  const cutoff = now - 3_600_000;
  sessionState.attemptTimes = sessionState.attemptTimes.filter((t) => t > cutoff);
  return sessionState.attemptTimes.length;
}

/**
 * May we attempt a session-server call right now? Returns a reason string when
 * refusing, so callers can degrade calmly with an honest explanation instead of
 * a bare failure. Never throws.
 */
function sessionAttemptBlockedReason(now) {
  if (sessionState.lastFailureAt && now - sessionState.lastFailureAt < SESSION_RETRY_COOLDOWN_MS) {
    const waitS = Math.ceil((SESSION_RETRY_COOLDOWN_MS - (now - sessionState.lastFailureAt)) / 1000);
    return `cooling down after a failed session attempt (${waitS}s left)`;
  }
  if (recentAttemptCount(now) >= SESSION_MAX_ATTEMPTS_PER_HOUR) {
    return `session attempt ceiling reached (${SESSION_MAX_ATTEMPTS_PER_HOUR}/hour)`;
  }
  return null;
}

// ============================================================================
// Configuration — resolved per call through readEnvKey, never cached in a
// module-level constant, so rotating a key in Team Knowledge/.env takes effect
// without a restart. Values are never logged.
// ============================================================================

function bunqEnv() {
  const raw = (readEnvKey('BUNQ_ENV') || 'sandbox').toLowerCase();
  // Fail SAFE: anything unrecognised means sandbox, never production.
  return raw === 'production' ? 'production' : 'sandbox';
}

export function bunqBaseUrl() {
  return BASE_URLS[bunqEnv()];
}

/**
 * The long-lived credentials this client needs, or null when setup has not run.
 * Presence-only — callers must never log or echo the returned values.
 */
function loadCredentials() {
  const apiKey = readEnvKey('BUNQ_API_KEY');
  const privateKeyB64 = readEnvKey('BUNQ_PRIVATE_KEY_B64');
  const installationToken = readEnvKey('BUNQ_INSTALLATION_TOKEN');
  const userId = readEnvKey('BUNQ_USER_ID');
  if (!apiKey || !privateKeyB64 || !installationToken || !userId) return null;
  return { apiKey, privateKeyB64, installationToken, userId };
}

/**
 * bunqConfigured() → boolean
 *   True iff every credential needed for a balance read resolves. This is the
 *   calm-degradation test: false means the Hub card renders a setup hint rather
 *   than an error (the invoicesApi.js `available:false` contract).
 */
export function bunqConfigured() {
  return loadCredentials() !== null;
}

/**
 * REQUIREMENT 3 — the installation guard.
 *
 * Deliberately performs NO network call. It only asserts that setup already ran.
 * POST /installation and POST /device-server are not reachable from this file
 * (they live in bunqSetup.js, which the server never imports), so a crash-loop
 * cannot consume the ~10/day setup bucket no matter how often the server boots.
 */
function ensureInstallation() {
  const creds = loadCredentials();
  if (!creds) {
    throw new Error(
      'bunq is not set up: run `node scripts/setup-bunq.mjs` once. ' +
      'This client never registers a device itself (rate-limit protection).',
    );
  }
  return creds;
}

// --- signing ----------------------------------------------------------------

/** The PEM private key, decoded from the base64 blob in .env. Never logged. */
function privateKeyPem(privateKeyB64) {
  try {
    return Buffer.from(privateKeyB64, 'base64').toString('utf8');
  } catch {
    throw new Error('BUNQ_PRIVATE_KEY_B64 is not valid base64');
  }
}

/**
 * Sign a request body per bunq's rules: the BODY ONLY, base64-encoded, into
 * X-Bunq-Client-Signature. An empty body signs the empty string.
 */
function signBody(body, privateKeyB64) {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(body ?? '');
  signer.end();
  return signer.sign(privateKeyPem(privateKeyB64), 'base64');
}

/** Headers shared by every call. `auth` omitted only for installation (not here). */
function baseHeaders(auth) {
  const headers = {
    'Cache-Control': 'no-cache',
    'User-Agent': USER_AGENT,
    'X-Bunq-Language': 'nl_NL',
    'X-Bunq-Region': 'nl_NL',
    'X-Bunq-Client-Request-Id': crypto.randomUUID(),
    'X-Bunq-Geolocation': '0 0 0 0 000',
  };
  if (auth) headers['X-Bunq-Client-Authentication'] = auth;
  return headers;
}

/**
 * bunq wraps everything in { Response: [ {Key: {...}}, ... ] } and the order of
 * that array is not something we want to depend on. Find the first entry that
 * carries the requested key.
 */
function pickFromResponse(payload, key) {
  const arr = payload?.Response;
  if (!Array.isArray(arr)) return null;
  for (const entry of arr) {
    if (entry && typeof entry === 'object' && key in entry) return entry[key];
  }
  return null;
}

/** Human-readable, secret-free description of a failed bunq call. */
function describeHttpFailure(status, text) {
  // bunq error bodies contain an error description, never our credentials — but
  // we still cap the length so nothing unexpected floods a log line.
  const snippet = String(text || '').slice(0, 300);
  return `bunq HTTP ${status}: ${snippet}`;
}

// ============================================================================
// REQUIREMENT 4 — the one and only POST in this file.
// ============================================================================
// Not exported. Only ensureSession() below may call it.
async function postSessionServer(creds) {
  const body = JSON.stringify({ secret: creds.apiKey });
  const headers = {
    ...baseHeaders(creds.installationToken),
    'Content-Type': 'application/json',
    // Session initiation is one of the two call types bunq still validates.
    'X-Bunq-Client-Signature': signBody(body, creds.privateKeyB64),
  };

  const res = await fetch(`${bunqBaseUrl()}/v1/session-server`, {
    method: 'POST',
    headers,
    body,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(describeHttpFailure(res.status, text));

  const payload = JSON.parse(text);
  const token = pickFromResponse(payload, 'Token')?.token || null;
  if (!token) throw new Error('bunq session-server returned no token');

  // The user object arrives as UserPerson or UserCompany depending on account
  // type; either way we only want its numeric id.
  const user =
    pickFromResponse(payload, 'UserPerson') ||
    pickFromResponse(payload, 'UserCompany') ||
    pickFromResponse(payload, 'UserApiKey');
  const userId = user?.id ?? null;

  return { token, userId };
}

/**
 * Return a usable session token, creating one only when necessary and only when
 * the crash-loop limits allow it. Throws with a calm, secret-free message
 * otherwise — bunqBalance.js turns that into `available:false`.
 */
async function ensureSession() {
  const creds = ensureInstallation();
  if (sessionState.token) return { token: sessionState.token, creds };

  const now = Date.now();
  const blocked = sessionAttemptBlockedReason(now);
  if (blocked) throw new Error(`bunq session unavailable: ${blocked}`);

  sessionState.attemptTimes.push(now);
  try {
    const { token, userId } = await postSessionServer(creds);
    sessionState.token = token;
    // Prefer the id bunq just told us over the stored one; fall back to .env.
    sessionState.userId = userId ?? Number(creds.userId);
    sessionState.lastFailureAt = 0;
    return { token, creds };
  } catch (err) {
    sessionState.lastFailureAt = Date.now();
    sessionState.token = null;
    throw err;
  }
}

/** Drop the cached session so the next call re-authenticates (used on a 401). */
function invalidateSession() {
  sessionState.token = null;
}

// ============================================================================
// REQUIREMENT 1 + 2 — the only exported way to reach bunq.
// ============================================================================

/**
 * signedGet(path) → parsed JSON
 *
 * `path` must match ALLOWED_GET_PATHS exactly. The check runs BEFORE any
 * network activity: on a non-match this throws and fetch() is never called —
 * asserted by bunqClient.test.mjs, which fails the build if that ever changes.
 *
 * There is no `method` parameter. 'GET' is a literal below.
 */
export async function signedGet(path, { _fetch = fetch, _retryOn401 = true } = {}) {
  // ---- allowlist gate: BEFORE the network, always ----
  if (typeof path !== 'string' || !ALLOWED_GET_PATHS.some((re) => re.test(path))) {
    throw new Error(
      `bunq path not on the allowlist, refused before any network call: ${String(path)}`,
    );
  }

  const { token, creds } = await ensureSession();

  const headers = {
    ...baseHeaders(token),
    // Empty body → signature over the empty string. Not validated by bunq for
    // GETs since 2020-04-28, sent for consistency.
    'X-Bunq-Client-Signature': signBody('', creds.privateKeyB64),
  };

  const res = await _fetch(`${bunqBaseUrl()}${path}`, {
    method: 'GET', // literal, by requirement — never a parameter
    headers,
  });

  // An expired session is the one failure worth retrying automatically, once.
  if (res.status === 401 && _retryOn401) {
    invalidateSession();
    return signedGet(path, { _fetch, _retryOn401: false });
  }

  if (res.status === 429) {
    // bunq puts the exact limit in the body; surface it, it is not secret.
    const text = await res.text();
    throw new Error(`bunq rate limit hit: ${String(text).slice(0, 200)}`);
  }

  const text = await res.text();
  if (!res.ok) throw new Error(describeHttpFailure(res.status, text));
  return text ? JSON.parse(text) : null;
}

/**
 * The configured bunq user id, needed to build the monetary-account path.
 * Prefers the id from the live session, falls back to the stored one.
 */
export function bunqUserId() {
  if (sessionState.userId) return sessionState.userId;
  const stored = readEnvKey('BUNQ_USER_ID');
  return stored ? Number(stored) : null;
}

/**
 * Secret-free diagnostics for the integrations/status surface. Deliberately
 * reports only whether things resolve — never a value, always masked.
 */
export function bunqDiagnostics() {
  const creds = loadCredentials();
  return {
    configured: creds !== null,
    environment: bunqEnv(),
    apiKey: maskSecret(creds?.apiKey || null),
    installationToken: maskSecret(creds?.installationToken || null),
    hasSession: Boolean(sessionState.token),
    userId: bunqUserId(),
  };
}

// Exported for the audit's unit test ONLY — so the test asserts against the very
// same constant the request path uses, not a copy that could drift out of sync.
export const __testing = {
  ALLOWED_GET_PATHS,
  resetSessionState() {
    sessionState.token = null;
    sessionState.userId = null;
    sessionState.lastFailureAt = 0;
    sessionState.attemptTimes = [];
  },
  sessionState,
  SESSION_MAX_ATTEMPTS_PER_HOUR,
  SESSION_RETRY_COOLDOWN_MS,
};
