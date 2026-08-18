// integrationUsage.js — live tegoed/verbruik per integratie, secretvrij naar de browser.
//
// Waarom apart van integrationChecks.js: die probes zijn passief en secretvrij
// (bestaat de sleutel, draait het proces). Dit doet WEL een uitgaande call met de
// sleutel, maar uitsluitend naar het account-endpoint van de leverancier — dat
// kost zelf geen credits en leest alleen de stand. De sleutel verlaat de server
// nooit; de browser krijgt kale getallen terug.
//
// Fail-soft by design: dit mag NOOIT de koppelingenpagina laten omvallen. Elke
// fout wordt een { ok:false, reason } veld, geen throw.
import { readEnvKey } from './connectors/env.js';

const TIMEOUT_MS = 8000;
const CACHE_MS = 5 * 60 * 1000;

const cache = new Map(); // integrationId -> { at:number, value:object }

async function getJson(url, token) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: ac.signal,
    });
    if (!res.ok) return { error: res.status === 401 || res.status === 403 ? 'unauthorized' : `http-${res.status}` };
    const body = await res.json();
    if (!body || body.success !== true || !body.data) return { error: 'unexpected-response' };
    return { data: body.data };
  } catch (err) {
    return { error: err?.name === 'AbortError' ? 'timeout' : 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}

function meter(remaining, plan) {
  const rem = Number.isFinite(remaining) ? remaining : null;
  const total = Number.isFinite(plan) && plan > 0 ? plan : null;
  if (rem === null) return null;
  // Percentage t.o.v. het pakket. Firecrawl kan meer resterend dan pakket
  // rapporteren (rollover/extra credits), dus de balk wordt gecapt op 100.
  const pct = total ? Math.round((rem / total) * 100) : null;
  return { remaining: rem, plan: total, pct };
}

async function firecrawlUsage() {
  const token = readEnvKey('FIRECRAWL_API_KEY');
  if (!token) return { ok: false, reason: 'no-key' };
  const [credits, tokens] = await Promise.all([
    getJson('https://api.firecrawl.dev/v2/team/credit-usage', token),
    getJson('https://api.firecrawl.dev/v2/team/token-usage', token),
  ]);
  if (credits.error) return { ok: false, reason: credits.error };
  return {
    ok: true,
    provider: 'Firecrawl',
    unit: 'credits',
    credits: meter(credits.data.remainingCredits, credits.data.planCredits),
    tokens: tokens.error ? null : meter(tokens.data.remainingTokens, tokens.data.planTokens),
    periodEnd: typeof credits.data.billingPeriodEnd === 'string' ? credits.data.billingPeriodEnd : null,
    fetchedAt: new Date().toISOString(),
  };
}

const PROVIDERS = { 'firecrawl-mcp': firecrawlUsage };

/** Map van integrationId -> tegoedstand. `refresh` omzeilt de cache van 5 minuten. */
export async function getIntegrationUsage({ refresh = false } = {}) {
  const now = Date.now();
  const out = {};
  await Promise.all(Object.entries(PROVIDERS).map(async ([id, load]) => {
    const hit = cache.get(id);
    if (!refresh && hit && now - hit.at < CACHE_MS) {
      out[id] = { ...hit.value, cached: true };
      return;
    }
    let value;
    try {
      value = await load();
    } catch {
      value = { ok: false, reason: 'unreachable' };
    }
    if (value.ok) cache.set(id, { at: now, value });
    out[id] = { ...value, cached: false };
  }));
  return { usage: out };
}
