// connectors/jorttCustomers.js — Jortt klanten-connector (Gewoon Sander).
//
// Haalt alle klanten op via GET https://api.jortt.nl/v3/customers en normaliseert
// ze naar een vaste shape. Read-only — er worden geen schrijf-calls gedaan.
//
// Authenticatie: OAuth 2.0 Client Credentials tegen
//   https://app.jortt.nl/oauth-provider/oauth/token
// Token wordt 7200 seconden gecacht; bij expiry automatisch vernieuwd.
// Rate limit Jortt: 10 req/s — exponentiële backoff op HTTP 429.
//
// Keys (nooit hardcoded; gelezen via readEnvKey):
//   JORTT_GEWOON_SANDER_CLIENT_ID     — OAuth client ID
//   JORTT_GEWOON_SANDER_CLIENT_SECRET — OAuth client secret
//
// Genormaliseerde output per klant:
//   { id, source, name, email, phone, url }

import { readEnvKey, maskSecret } from './env.js';

const SOURCE = 'jortt:gewoon-sander';
const TOKEN_URL = 'https://app.jortt.nl/oauth-provider/oauth/token';
const API_BASE  = 'https://api.jortt.nl';
const TIMEOUT_MS = 10_000;
const TOKEN_TTL_MS = 7200 * 1000; // Jortt-tokens zijn 7200 seconden geldig

// ---- Token-cache (in-process, per connectorinstantie) -----------------------
// De cache leeft in de module-scope zodat herhaalde /api/cockpit/jortt/customers
// calls binnen het geldigheidsvenster slechts één token-request kosten.
let _cachedToken = null;   // string | null
let _tokenExpiresAt = 0;   // ms-timestamp

function isCacheValid() {
  return _cachedToken !== null && Date.now() < _tokenExpiresAt;
}

function cacheToken(token, expiresInSeconds = 7200) {
  _cachedToken = token;
  // Bouw een buffer van 60s in zodat we nooit een verlopen token sturen.
  _tokenExpiresAt = Date.now() + (expiresInSeconds - 60) * 1000;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout(promise, ms, label) {
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

// ---- OAuth token-fetch -------------------------------------------------------
async function fetchToken(clientId, clientSecret) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await withTimeout(
    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=customers%3Aread',
    }),
    TIMEOUT_MS,
    'Jortt token'
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Jortt token HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error('Jortt token response mist access_token');
  return { token: data.access_token, expiresIn: data.expires_in ?? 7200 };
}

// Retourneert een geldig token; vernieuwt automatisch bij expiry.
// Nooit gelogd of geëchoot.
async function resolveToken(clientId, clientSecret) {
  if (isCacheValid()) return _cachedToken;
  const { token, expiresIn } = await fetchToken(clientId, clientSecret);
  cacheToken(token, expiresIn);
  return token;
}

// ---- API request met retry + exponentiële backoff op 429 --------------------
async function apiGet(token, url, attempt = 1) {
  const MAX_ATTEMPTS = 4;
  let res;
  try {
    res = await withTimeout(
      fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
      TIMEOUT_MS,
      `Jortt GET ${url}`
    );
  } catch (err) {
    if (attempt >= MAX_ATTEMPTS) throw err;
    await sleep(Math.min(2 ** attempt * 500, 8000));
    return apiGet(token, url, attempt + 1);
  }

  if (res.status === 429) {
    // Respecteer Retry-After header indien aanwezig, anders exponentieel.
    const retryAfterMs = Number(res.headers.get('retry-after') || '0') * 1000
      || Math.min(2 ** attempt * 1000, 16000);
    if (attempt >= MAX_ATTEMPTS) throw new Error('Jortt rate limit: retries uitgeput');
    await sleep(retryAfterMs);
    return apiGet(token, url, attempt + 1);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Jortt customers HTTP ${res.status}: ${text.slice(0, 120)}`);
  }

  return res.json();
}

// ---- Paginering via _links.next (Jortt HAL-stijl) ---------------------------
// Haalt alle pagina's op totdat _links.next ontbreekt of de veiligheidslimiet
// van 50 pagina's bereikt is (5.000 klanten per call max).
async function fetchAllCustomers(token) {
  const customers = [];
  let nextUrl = `${API_BASE}/v3/customers`;
  let page = 0;
  const MAX_PAGES = 50;

  while (nextUrl && page < MAX_PAGES) {
    const data = await apiGet(token, nextUrl);
    // Jortt retourneert klanten in data.data of data.customers
    const batch = Array.isArray(data.data) ? data.data
      : (Array.isArray(data.customers) ? data.customers
      : (Array.isArray(data) ? data : []));
    customers.push(...batch);
    nextUrl = data._links?.next ?? null;
    page++;
  }

  return customers;
}

// ---- Normaliseer één Jortt-klant naar de contractshape ----------------------
function normalizeCustomer(raw) {
  // Naam: bedrijf of voor/achternaam
  const name =
    raw.company_name ||
    [raw.first_name, raw.last_name].filter(Boolean).join(' ') ||
    raw.name ||
    '(onbekend)';

  // E-mail: direct op klant of via eerste contact
  const email =
    raw.email_address ??
    raw.email ??
    raw.contacts?.[0]?.email_address ??
    null;

  // Telefoon: direct of via eerste contact
  const phone =
    raw.phone_number ??
    raw.phone ??
    raw.contacts?.[0]?.phone_number ??
    null;

  // Deeplink naar Jortt
  const url = raw.url ?? (raw.id ? `https://app.jortt.nl/customers/${raw.id}` : null);

  return {
    id: String(raw.id),
    source: SOURCE,
    name,
    email: email ?? null,
    phone: phone ?? null,
    url,
  };
}

// ---- Connector-factory -------------------------------------------------------
// Exportnaam waarop catalog.json wijst: makeJorttCustomersConnector
export function makeJorttCustomersConnector(_opts = {}) {
  return {
    id: SOURCE,
    kind: 'customers',
    label: 'Jortt klanten (Gewoon Sander)',

    /**
     * Haalt alle klanten op en retourneert een genormaliseerde array.
     * Gooit NOOIT naar de route — altijd calm degrade naar { ok: false, ... }.
     */
    async fetchCustomers() {
      const clientId     = readEnvKey('JORTT_GEWOON_SANDER_CLIENT_ID');
      const clientSecret = readEnvKey('JORTT_GEWOON_SANDER_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        console.warn('[jorttCustomers] credentials ontbreken — connector inactief');
        return { ok: false, source: SOURCE, reason: 'no-credentials', customers: [] };
      }

      let token;
      try {
        token = await resolveToken(clientId, clientSecret);
      } catch (err) {
        console.error('[jorttCustomers] token-fout:', err.message);
        return { ok: false, source: SOURCE, reason: 'token-error', error: err.message.slice(0, 120), customers: [] };
      }

      let raw;
      try {
        raw = await fetchAllCustomers(token);
      } catch (err) {
        console.error('[jorttCustomers] fetch-fout:', err.message);
        // Ongeldig token-scenario: cache wissen zodat de volgende aanroep een verse token haalt.
        _cachedToken = null;
        _tokenExpiresAt = 0;
        return { ok: false, source: SOURCE, reason: 'fetch-error', error: err.message.slice(0, 120), customers: [] };
      }

      const customers = raw.map(normalizeCustomer);
      return { ok: true, source: SOURCE, count: customers.length, customers };
    },

    /** Geeft alleen de token-fingerprint terug — nooit de volledige waarde. */
    tokenFingerprint() {
      return _cachedToken ? maskSecret(_cachedToken) : '<geen token gecacht>';
    },
  };
}

export default makeJorttCustomersConnector;
