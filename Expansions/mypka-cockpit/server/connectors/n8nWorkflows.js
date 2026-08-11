// connectors/n8nWorkflows.js — n8n workflow-health connector (Daedalus, 2026-08-10).
//
// Surfaces every workflow on an n8n instance as a status card: name, active /
// inactive, and the last run (timestamp + success / failure). Built to the same
// contract as todoistTasks.js / jorttTasks.js — read-only, secret-free,
// never-throw, one catalog entry away from activating.
//
// Keys (both required; the registry only activates the entry when BOTH resolve):
//   N8N_API_KEY   — n8n → Settings → n8n API → "Create an API key".
//                   Sent as the `X-N8N-API-KEY` header. This is a DIFFERENT
//                   credential from the Settings → MCP bearer token used by
//                   `.mcp.json`; the two are not interchangeable.
//   N8N_BASE_URL  — instance root, e.g. https://<name>.app.n8n.cloud
//                   (no trailing slash needed, no /api/v1 suffix).
//
// POSTURE
//   * READ-ONLY. Only GET /api/v1/workflows and GET /api/v1/executions are
//     called. No POST/PUT/PATCH/DELETE exists in this file — activating,
//     deactivating or running a workflow stays a job for the n8n UI, reached via
//     each card's deep link.
//   * SECRET-FREE. The API key is resolved in-process via readEnvKey() and only
//     ever flows into a request header. It never appears in an emitted item, a
//     log line or an error message. The base URL is a hostname, not a secret —
//     it is marked `secret: false` in catalog.json and does appear in the card's
//     deep link (that is the whole point of the deep link).
//   * NEVER THROWS. Every failure path returns degraded(...) so the planner
//     renders a quiet "not connected" line instead of a crash.
//
// WHY THIS CONNECTOR IGNORES `weekStart`
//   The connector contract is week-scoped because it was designed for tasks with
//   due dates. A workflow-health overview is NOT week-scoped: an automation that
//   has been broken since last month is exactly the one you must see, and an
//   inactive workflow that never ran has no date at all. So every workflow is
//   emitted every week, with `due` deliberately left null for healthy runs. The
//   one exception: when the LAST run FAILED, `due` is set to the day of that
//   failure, which makes the card bucket as overdue/today and stand out — a
//   broken automation is genuinely actionable, an ok one is just information.
//
// RATE LIMITS / IDEMPOTENCY
//   Two to five GETs per cockpit read, 250 items per page, hard-capped at
//   MAX_WORKFLOW_PAGES / MAX_EXECUTION_PAGES so a chatty instance can never turn
//   one card refresh into an unbounded crawl. Execution paging stops early once
//   every known workflow has a last run. One retry with backoff on 429/5xx
//   (honouring Retry-After). All calls are GETs, so retrying is idempotent by
//   construction.

import { degraded, ok, DISPLAY_TZ } from './types.js';
import { readEnvKey } from './env.js';

const SOURCE = 'n8n:workflows';
const TIMEOUT_MS = 12_000;
const PAGE_SIZE = 250;              // n8n public API maximum
const MAX_WORKFLOW_PAGES = 4;       // ≤ 1000 workflows
const MAX_EXECUTION_PAGES = 4;      // ≤ 1000 executions scanned for "last run"
const MAX_RETRIES = 1;              // one retry on 429 / 5xx, then degrade

/** n8n execution.status values that mean "this run did not end well". */
const FAILED_STATUSES = new Set(['error', 'crashed', 'canceled']);
/** …and the ones that mean "still going". */
const PENDING_STATUSES = new Set(['running', 'waiting', 'new']);

// ---- small helpers -----------------------------------------------------------

function displayToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: DISPLAY_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

/** 'YYYY-MM-DD' in the planner's display tz for an ISO instant, or null. */
function isoToDisplayDay(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: DISPLAY_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
}

/** 'do 10-08 07:15' style label in the display tz, or null. */
function isoToDisplayStamp(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('nl-NL', {
      timeZone: DISPLAY_TZ, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(d).map((x) => [x.type, x.value])
  );
  return `${p.day}-${p.month} ${p.hour}:${p.minute}`;
}

function dueBucketOf(day, todayDay) {
  if (!day) return 'none';
  if (day < todayDay) return 'overdue';
  if (day === todayDay) return 'today';
  return 'upcoming';
}

/**
 * Strip a trailing slash and any accidental /api/v1 suffix off the configured
 * base URL, and refuse anything that is not http(s). Returns null when unusable,
 * which the caller turns into a `misconfigured` degrade.
 */
export function normalizeBaseUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let v = raw.trim().replace(/\/+$/, '');
  v = v.replace(/\/api\/v1$/i, '');
  if (!/^https?:\/\/[^\s/]+/i.test(v)) return null;
  return v;
}

/** fetch with an AbortController timeout — the abort actually cancels the socket. */
async function fetchWithTimeout(url, init, ms, label) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ac.signal });
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error(`${label} timed out after ${ms}ms`);
    throw new Error(`${label} failed`); // message intentionally generic — never echo the URL/key
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One authenticated GET against the public API, with a single backoff retry on
 * 429/5xx. Throws an Error carrying `.httpStatus` on a non-retryable failure;
 * the caller maps that onto a degrade reason. Never includes the key in an error.
 */
async function apiGet(base, apiKey, pathAndQuery, label) {
  const url = `${base}/api/v1${pathAndQuery}`;
  const init = { method: 'GET', headers: { 'X-N8N-API-KEY': apiKey, Accept: 'application/json' } };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetchWithTimeout(url, init, TIMEOUT_MS, label);
    if (res.ok) return res.json();

    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 5_000)
        : 500 * 2 ** attempt;
      await sleep(waitMs);
      continue;
    }
    throw Object.assign(new Error(`${label} returned HTTP ${res.status}`), { httpStatus: res.status });
  }
  throw Object.assign(new Error(`${label} exhausted retries`), { httpStatus: 429 });
}

/** GET /workflows, paginated, capped. Returns the raw workflow objects. */
async function fetchWorkflows(base, apiKey) {
  const out = [];
  let cursor = null;
  for (let page = 0; page < MAX_WORKFLOW_PAGES; page++) {
    const q = `/workflows?limit=${PAGE_SIZE}&excludePinnedData=true${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
    const body = await apiGet(base, apiKey, q, `n8n workflows p${page + 1}`);
    if (Array.isArray(body?.data)) out.push(...body.data);
    cursor = body?.nextCursor || null;
    if (!cursor) break;
  }
  return out;
}

/**
 * GET /executions, newest first, paginated until every workflow id in `wanted`
 * has a last run (or the page cap is hit). Returns Map<workflowId, execution>
 * holding only the NEWEST execution per workflow.
 *
 * Executions are the cheapest way to answer "when did this last run and did it
 * work" in bulk: one call covers the whole instance, versus one call per
 * workflow. Capped so a high-volume instance degrades to "unknown last run" for
 * its quietest workflows instead of hammering the API.
 */
async function fetchLastRuns(base, apiKey, wanted) {
  const lastRun = new Map();
  let cursor = null;
  for (let page = 0; page < MAX_EXECUTION_PAGES; page++) {
    const q = `/executions?limit=${PAGE_SIZE}&includeData=false${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
    const body = await apiGet(base, apiKey, q, `n8n executions p${page + 1}`);
    const batch = Array.isArray(body?.data) ? body.data : [];
    for (const ex of batch) {
      const wid = ex?.workflowId != null ? String(ex.workflowId) : null;
      if (!wid || lastRun.has(wid)) continue; // newest-first ⇒ first hit wins
      lastRun.set(wid, ex);
    }
    cursor = body?.nextCursor || null;
    // Early exit: nothing left to learn.
    if (!cursor) break;
    if ([...wanted].every((wid) => lastRun.has(wid))) break;
  }
  return lastRun;
}

// ---- normalization -----------------------------------------------------------

/** Human status line: 'actief · laatste run 10-08 07:15 · gelukt'. */
function statusLabel(wf, ex) {
  const state = wf.active ? 'actief' : 'inactief';
  if (!ex) return `${state} · nog niet gedraaid`;
  const stamp = isoToDisplayStamp(ex.stoppedAt || ex.startedAt);
  const verdict = FAILED_STATUSES.has(ex.status)
    ? (ex.status === 'canceled' ? 'afgebroken' : 'MISLUKT')
    : PENDING_STATUSES.has(ex.status)
      ? 'loopt nog'
      : ex.status === 'success' ? 'gelukt' : String(ex.status || 'onbekend');
  return `${state} · laatste run ${stamp ?? '?'} · ${verdict}`;
}

function describe(wf, ex, lastRunKnown) {
  const lines = [statusLabel(wf, ex)];
  if (!ex && lastRunKnown === false) {
    lines.push('Laatste run onbekend — buiten het gescande uitvoeringsvenster.');
  }
  if (ex && FAILED_STATUSES.has(ex.status)) {
    lines.push(`Uitvoering #${ex.id} eindigde met status "${ex.status}". Open de workflow in n8n voor het foutdetail.`);
  }
  if (wf.triggerCount === 0 && wf.active) {
    lines.push('Actief maar zonder trigger-node — deze workflow start nooit vanzelf.');
  }
  return lines.join('\n');
}

function priorityOf(wf, ex) {
  if (ex && FAILED_STATUSES.has(ex.status)) return 1; // broken automation — top of the list
  if (ex && PENDING_STATUSES.has(ex.status)) return 3;
  if (wf.active) return 4;
  return 5;                                          // inactive — informational only
}

// ---- the connector -----------------------------------------------------------

export function makeN8nWorkflowsConnector(opts = {}) {
  const id = opts.id || SOURCE;
  return {
    id,
    kind: 'task',
    label: opts.label || 'n8n workflows',

    /**
     * fetchWeek(weekStart) → ConnectorResult<NormalizedTask>. Never throws.
     * `weekStart` is accepted for contract compatibility and deliberately unused
     * — see the "WHY THIS CONNECTOR IGNORES weekStart" note at the top.
     */
    async fetchWeek(_weekStart) {
      const todayDay = displayToday();

      const apiKey = readEnvKey('N8N_API_KEY');
      const baseRaw = readEnvKey('N8N_BASE_URL');
      if (!apiKey || !baseRaw) {
        return degraded(id, 'no-token', 'n8n is niet verbonden — N8N_API_KEY of N8N_BASE_URL ontbreekt.');
      }
      const base = normalizeBaseUrl(baseRaw);
      if (!base) {
        return degraded(id, 'misconfigured', 'n8n: N8N_BASE_URL is geen geldige http(s)-URL.');
      }

      let workflows;
      try {
        workflows = await fetchWorkflows(base, apiKey);
      } catch (err) {
        if (err.httpStatus === 401 || err.httpStatus === 403) {
          return degraded(id, 'misconfigured', 'n8n weigert de API-key (401/403) — sleutel verlopen of ingetrokken?');
        }
        return degraded(id, 'unreachable', 'n8n is momenteel niet bereikbaar.');
      }

      const live = workflows.filter((wf) => wf && wf.isArchived !== true);
      const wanted = new Set(live.map((wf) => String(wf.id)));

      // Last runs are a NICE-TO-HAVE: if the executions endpoint fails (e.g. the
      // key lacks the execution:list scope) we still render the workflow roster
      // rather than degrading the whole card group to "not connected".
      let lastRun = new Map();
      let lastRunKnown = true;
      try {
        lastRun = await fetchLastRuns(base, apiKey, wanted);
      } catch {
        lastRunKnown = false;
      }

      const items = live.map((wf) => {
        const wid = String(wf.id);
        const ex = lastRun.get(wid) || null;
        const failed = !!ex && FAILED_STATUSES.has(ex.status);
        // Only a FAILED last run gets a date — that is what turns the card red.
        const due = failed ? isoToDisplayDay(ex.stoppedAt || ex.startedAt) : null;
        const tagNames = Array.isArray(wf.tags)
          ? wf.tags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean)
          : [];
        return {
          kind: 'task',
          source: id,
          id: wid,
          title: wf.name || `Workflow ${wid}`,
          description: describe(wf, ex, lastRunKnown),
          due,
          dueBucket: dueBucketOf(due, todayDay),
          priorityRank: priorityOf(wf, ex),
          url: `${base}/workflow/${encodeURIComponent(wid)}`,
          tags: ['n8n', wf.active ? 'actief' : 'inactief', ...tagNames],
          status: statusLabel(wf, ex),
          assignedToMe: true,
          editableFields: [], // read-only contract — edit in n8n via the deep link
        };
      });

      // Broken first, then still-running, then active, then inactive; stable by
      // name inside a rank so the card order does not jitter between refreshes.
      items.sort((a, b) => a.priorityRank - b.priorityRank || a.title.localeCompare(b.title, 'nl'));
      return ok(id, items);
    },
  };
}

export default makeN8nWorkflowsConnector;
