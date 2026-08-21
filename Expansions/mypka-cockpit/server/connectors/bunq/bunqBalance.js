// bunqBalance.js — the Hub's bunq balance read. One route, one bunq endpoint.
//
// ============================================================================
// POSTURE
// ============================================================================
// This is the CONSUMER half of the bunq connector, deliberately kept thin:
//
//   * It never imports fetch. It never builds a URL. It calls exactly one
//     function — signedGet() from bunqClient.js — so adding a write call here is
//     impossible without first editing bunqClient.js's allowlist, which is a
//     visible, reviewable diff in the file the auditor greps.
//     (audit §1 fix-requirement 3)
//
//   * It NEVER throws to the caller. Every failure path — missing setup, a bunq
//     outage, a rate limit, LAN gating — returns { available: false, items: [] }
//     with an honest, secret-free reason. That is the invoicesApi.js contract,
//     and it is why a bank outage can never 500 the Hub.
//
// LAN GATING (audit §4)
// ---------------------
// The audit requires the balance card to be hidden by default when the cockpit
// is reached over the LAN, even while it works fine on loopback: whoever holds
// the PIN (a guest, a house-mate) should not automatically see a bank balance.
//
// We enforce that HERE, server-side, not by hiding a card in the browser —
// hiding a card client-side is cosmetics, not security. Over a non-loopback Host
// the route returns available:false and NO balance data unless BUNQ_ALLOW_LAN=1
// is explicitly set in Team Knowledge/.env.
//
// The audit suggested a `lan_default: false` flag on the KNOWN_MODULES record
// "or equivalent". We chose the .env flag as that equivalent for two reasons:
// it keeps every bunq decision in the one 0600 file that already holds the bunq
// secrets, and it cannot be flipped from the browser — whereas the module_prefs
// table is written by a PUT the LAN client itself can reach.

import { signedGet, bunqUserId, bunqConfigured, bunqDiagnostics } from './bunqClient.js';
import { readEnvKey } from '../env.js';

// A Hub reload costs one bunq call; several tabs reloading must not multiply
// that. 60s is short enough that a balance still reads as "now".
const CACHE_TTL_MS = 60_000;

const cache = { at: 0, payload: null };

/** Statuses we refuse to surface. A cancelled account is noise, not a balance. */
const HIDDEN_STATUSES = new Set(['CANCELLED']);

function lanAllowed() {
  return readEnvKey('BUNQ_ALLOW_LAN') === '1';
}

/**
 * bunq returns [{ MonetaryAccountBank: {...} }, { MonetaryAccountSavings: {...} }]
 * — the subtype is the KEY, and there are several (Bank, Savings, Joint, and
 * more over time). Rather than enumerate them and silently drop an account type
 * bunq adds later, we take whatever single object each entry wraps.
 */
function unwrapAccount(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const keys = Object.keys(entry);
  if (keys.length !== 1) return null;
  const account = entry[keys[0]];
  if (!account || typeof account !== 'object') return null;
  return { type: keys[0], account };
}

/** First IBAN out of the alias array, or null. */
function ibanOf(account) {
  const alias = Array.isArray(account?.alias) ? account.alias : [];
  const hit = alias.find((a) => a && a.type === 'IBAN' && a.value);
  return hit ? hit.value : null;
}

/**
 * Normalise one bunq account to the shape the Hub card renders. Sander chose
 * "every account on its own row" (design §"Eén verduidelijkende vraag", answer
 * A), so there is deliberately no summing here.
 */
function normaliseAccount(entry) {
  const unwrapped = unwrapAccount(entry);
  if (!unwrapped) return null;
  const { type, account } = unwrapped;

  const status = account.status || null;
  if (status && HIDDEN_STATUSES.has(status)) return null;

  // bunq sends amounts as decimal STRINGS ("1234.56"). Number() is right for
  // display; we keep the raw string too so nothing is lost to float rounding if
  // a caller ever needs the exact value.
  const rawValue = account.balance?.value ?? null;
  const parsed = rawValue === null ? null : Number(rawValue);

  return {
    accountId: account.id ?? null,
    accountType: type,
    description: account.description || null,
    iban: ibanOf(account),
    balance: Number.isFinite(parsed) ? parsed : null,
    balanceRaw: rawValue,
    currency: account.balance?.currency || 'EUR',
    status,
  };
}

/** The unavailable shape, used for every failure path. Never carries a secret. */
function unavailable(reason) {
  return { available: false, items: [], total: 0, reason };
}

/**
 * readBalances() → { available, items, total, environment?, reason?, fetchedAt? }
 *
 * The whole failure surface of the bunq connector funnels through here and comes
 * out as data, never as an exception.
 */
export async function readBalances({ force = false } = {}) {
  if (!bunqConfigured()) return unavailable('not-configured');

  const now = Date.now();
  if (!force && cache.payload && now - cache.at < CACHE_TTL_MS) {
    return cache.payload;
  }

  const userId = bunqUserId();
  if (!userId || !Number.isFinite(Number(userId))) {
    return unavailable('no-user-id');
  }

  try {
    // The ONE call. This exact string is what bunqClient's allowlist regex
    // matches; anything else is refused before it reaches the network.
    const payload = await signedGet(`/v1/user/${Number(userId)}/monetary-account`);

    const entries = Array.isArray(payload?.Response) ? payload.Response : [];
    const items = entries.map(normaliseAccount).filter(Boolean);

    const result = {
      available: true,
      items,
      total: items.length,
      environment: bunqDiagnostics().environment,
      fetchedAt: new Date().toISOString(),
    };
    cache.at = now;
    cache.payload = result;
    return result;
  } catch (err) {
    // Calm degradation. bunqClient's messages are written to be secret-free, and
    // we cap the length so an unexpected upstream body cannot flood the response.
    return { ...unavailable('error'), detail: String(err.message || err).slice(0, 200) };
  }
}

/** Drop the cache — used by the setup script's verification step. */
export function clearBalanceCache() {
  cache.at = 0;
  cache.payload = null;
}

/**
 * registerBunqBalanceRoutes(app, { safeAsync, isLoopbackHost })
 *
 * Mirrors registerInvoicesRoutes: server.js hands in its own wrapper so this
 * route gets the identical try/catch → 500 envelope and sits behind the same
 * /api auth middleware as every other cockpit read.
 *
 * `isLoopbackHost` is server.js's own DNS-rebinding-safe Host check, passed in
 * rather than reimplemented, so the LAN gate can never drift from the auth
 * middleware's idea of what "loopback" means.
 */
export function registerBunqBalanceRoutes(app, { safeAsync, isLoopbackHost }) {
  app.get(
    '/api/cockpit/bunq/balance',
    safeAsync(async (req) => {
      // Audit §4: bank data stays off the LAN unless explicitly opted in.
      if (!isLoopbackHost(req) && !lanAllowed()) {
        return unavailable('lan-hidden');
      }
      return readBalances();
    }),
  );
}
