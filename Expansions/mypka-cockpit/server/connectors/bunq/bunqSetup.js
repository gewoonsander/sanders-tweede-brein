// bunqSetup.js — the ONE-TIME device registration. Never imported by the server.
//
// ============================================================================
// WHY THIS FILE IS SEPARATE FROM bunqClient.js
// ============================================================================
// bunq's setup endpoints sit in a bucket documented as "as low as 10 requests /
// day" (doc.bunq.com/basics/rate-limits.md). A cockpit server that crash-loops
// under launchd could burn that bucket in seconds and lock Sander out of his own
// bank API for the rest of the day.
//
// The audit (Deliverables/2026-08-17-argus-bunq-connector-audit.md §5) requires a
// guard that checks for existing tokens before calling these endpoints. We go one
// step further: these two calls do not exist anywhere the server can reach them.
// server.js imports bunqBalance.js → bunqClient.js, and neither imports this
// file. Only scripts/setup-bunq.mjs does, and a human runs that by hand.
//
// A guard can be bypassed by a future edit. An absent code path cannot.
//
// ============================================================================
// VERIFIED AGAINST doc.bunq.com ON 2026-08-21
// ============================================================================
//   POST /v1/installation
//     body     : { client_public_key: "<PEM public key>" }
//     response : Response[] carrying { Id }, { Token: { token } },
//                { ServerPublicKey: { server_public_key } }
//     auth     : none — this is the only call without X-Bunq-Client-Authentication
//   POST /v1/device-server
//     header   : X-Bunq-Client-Authentication: <installation token>
//     body     : { description, secret: "<api key>", permitted_ips: [...] }
//   Sources: doc.bunq.com/installation.md,
//            doc.bunq.com/tutorials/.../device-registration.md,
//            doc.bunq.com/basics/headers.md

import crypto from 'node:crypto';

const BASE_URLS = {
  sandbox: 'https://public-api.sandbox.bunq.com',
  production: 'https://api.bunq.com',
};

const USER_AGENT = 'myPKA-Cockpit-bunq-balance/1.0';

export function setupBaseUrl(env) {
  return BASE_URLS[env === 'production' ? 'production' : 'sandbox'];
}

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

function pickFromResponse(payload, key) {
  const arr = payload?.Response;
  if (!Array.isArray(arr)) return null;
  for (const entry of arr) {
    if (entry && typeof entry === 'object' && key in entry) return entry[key];
  }
  return null;
}

async function readOrThrow(res, what) {
  const text = await res.text();
  if (!res.ok) {
    // bunq error bodies describe the problem and never echo our secrets.
    throw new Error(`${what} failed — bunq HTTP ${res.status}: ${String(text).slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

/**
 * Generate the RSA keypair bunq signs requests with. 2048-bit, PKCS#8 private /
 * SPKI public — the shapes bunq's own SDKs use.
 *
 * The private key is returned as PEM. The caller base64-encodes it into
 * Team Knowledge/.env; it is never printed to the terminal.
 */
export function generateKeypair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKeyPem: publicKey, privateKeyPem: privateKey };
}

/**
 * POST /v1/installation — exchanges our public key for an installation token.
 * Counts against the ~10/day setup bucket. Call once, ever.
 */
export async function createInstallation({ env, publicKeyPem }) {
  const body = JSON.stringify({ client_public_key: publicKeyPem });
  const res = await fetch(`${setupBaseUrl(env)}/v1/installation`, {
    method: 'POST',
    headers: { ...baseHeaders(null), 'Content-Type': 'application/json' },
    body,
  });
  const payload = await readOrThrow(res, 'installation');

  const token = pickFromResponse(payload, 'Token')?.token || null;
  const serverPublicKey =
    pickFromResponse(payload, 'ServerPublicKey')?.server_public_key || null;
  if (!token) throw new Error('installation returned no token');

  return { installationToken: token, serverPublicKey };
}

/**
 * POST /v1/device-server — binds the API key to this machine and to a concrete
 * set of IP addresses.
 *
 * permitted_ips is REQUIRED to be concrete here: the audit (§3) forbids the
 * wildcard, and this function enforces that rather than trusting the caller.
 * bunq only allows '*' to be set from inside the app anyway, deliberately, "to
 * prevent accidental security risks through API misuse".
 *
 * Counts against the ~10/day setup bucket. Call once, ever.
 */
export async function registerDevice({ env, apiKey, installationToken, description, permittedIps }) {
  if (!Array.isArray(permittedIps) || permittedIps.length === 0) {
    throw new Error('permitted_ips must be a non-empty list of concrete IP addresses');
  }
  if (permittedIps.some((ip) => String(ip).trim() === '*')) {
    // Audit §3.1: "Geen wildcard, punt."
    throw new Error(
      'the permitted_ips wildcard "*" is refused by policy — ' +
      'see Deliverables/2026-08-17-argus-bunq-connector-audit.md §3',
    );
  }

  const body = JSON.stringify({
    description,
    secret: apiKey,
    permitted_ips: permittedIps,
  });

  const res = await fetch(`${setupBaseUrl(env)}/v1/device-server`, {
    method: 'POST',
    headers: {
      ...baseHeaders(installationToken),
      'Content-Type': 'application/json',
    },
    body,
  });
  const payload = await readOrThrow(res, 'device-server');
  const id = pickFromResponse(payload, 'Id')?.id ?? null;
  return { deviceServerId: id };
}

/**
 * POST /v1/session-server — run once during setup purely to learn the user id,
 * which the balance path needs. At runtime bunqClient.js does its own session
 * handling; this is the setup-time equivalent.
 *
 * Session initiation is signature-validated by bunq, so the body is signed here
 * exactly as bunqClient.js signs it.
 */
export async function openSetupSession({ env, apiKey, installationToken, privateKeyPem }) {
  const body = JSON.stringify({ secret: apiKey });
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(body);
  signer.end();
  const signature = signer.sign(privateKeyPem, 'base64');

  const res = await fetch(`${setupBaseUrl(env)}/v1/session-server`, {
    method: 'POST',
    headers: {
      ...baseHeaders(installationToken),
      'Content-Type': 'application/json',
      'X-Bunq-Client-Signature': signature,
    },
    body,
  });
  const payload = await readOrThrow(res, 'session-server');

  const user =
    pickFromResponse(payload, 'UserPerson') ||
    pickFromResponse(payload, 'UserCompany') ||
    pickFromResponse(payload, 'UserApiKey');
  const userId = user?.id ?? null;
  if (!userId) throw new Error('session-server returned no user id');
  return { userId };
}
