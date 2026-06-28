// connectors/jorttTasks.js — Jortt invoice connector (Gewoon Sander).
//
// Surfaces SENT + OVERDUE invoices as plannable task cards. Read-only — no
// write calls to Jortt. OAuth 2.0 Client Credentials flow: a fresh token is
// fetched per call (no caching needed at cockpit polling cadence; Jortt rate
// limit is 10 req/s). Pagination via _links.next, up to 3 pages (300 invoices).
//
// Keys: JORTT_GEWOON_SANDER_CLIENT_ID_API_KEY (client ID)
//       JORTT_GEWOON_SANDER_CLIENT_SECRET_API_KEY (client secret)
// — both resolved in-process via readEnvKey(); values never emitted.

import { weekWindow, dayInWeek, degraded, ok, DISPLAY_TZ } from './types.js';
import { readEnvKey } from './env.js';

const SOURCE = 'jortt:gewoon-sander';
const TIMEOUT_MS = 10_000;
const TOKEN_URL = 'https://app.jortt.nl/oauth-provider/oauth/token';
const API_BASE  = 'https://api.jortt.nl';

function displayToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: DISPLAY_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function fetchToken(clientId, clientSecret) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await withTimeout(
    fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&scope=invoices:read',
    }),
    TIMEOUT_MS,
    'Jortt token'
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Jortt token ${res.status}: ${text.slice(0, 80)}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error('Jortt token response missing access_token');
  return data.access_token;
}

// Fetch all SENT + OVERDUE invoices with pagination (max 3 pages = 300 items).
async function fetchInvoices(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const invoices = [];
  let nextUrl = `${API_BASE}/v3/invoices?per_page=100&invoice_status[]=SENT&invoice_status[]=OVERDUE`;
  let page = 0;
  while (nextUrl && page < 3) {
    const res = await withTimeout(fetch(nextUrl, { headers }), TIMEOUT_MS, `Jortt invoices p${page + 1}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const key = body?.error?.key ?? '';
      if (key === 'organization.requires_mkb_plan') {
        throw Object.assign(new Error('Jortt MKB/Plus plan required for API access'), { jorttKey: key });
      }
      throw new Error(`Jortt invoices ${res.status}`);
    }
    const data = await res.json();
    const batch = Array.isArray(data.data) ? data.data
      : (Array.isArray(data.invoices) ? data.invoices
      : (Array.isArray(data) ? data : []));
    invoices.push(...batch);
    nextUrl = data._links?.next ?? null;
    page++;
  }
  return invoices;
}

function dueBucketOf(dueDay, todayDay) {
  if (!dueDay) return 'none';
  if (dueDay < todayDay) return 'overdue';
  if (dueDay === todayDay) return 'today';
  return 'upcoming';
}

function invoiceDeepLink(inv) {
  // Jortt app links: https://app.jortt.nl/invoices/<id>
  if (inv.url) return inv.url;
  if (inv.id) return `https://app.jortt.nl/invoices/${inv.id}`;
  return null;
}

function invoiceTitle(inv) {
  const num = inv.invoice_number ?? inv.number ?? inv.id ?? '?';
  const customer =
    inv.recipient?.name ??
    inv.customer?.name ??
    inv.organization_name ??
    inv.customer_name ??
    '';
  return customer ? `${num} — ${customer}` : `Factuur ${num}`;
}

function invoiceDescription(inv) {
  const parts = [];
  if (inv.total_amount != null) parts.push(`€ ${Number(inv.total_amount).toFixed(2)}`);
  if (inv.amount_due != null && String(inv.amount_due) !== String(inv.total_amount)) {
    parts.push(`open: € ${Number(inv.amount_due).toFixed(2)}`);
  }
  if (inv.invoice_date) parts.push(`factuurdatum: ${String(inv.invoice_date).slice(0, 10)}`);
  return parts.join(' · ');
}

export function makeJorttGewoonSanderConnector(opts = {}) {
  const id = opts.id || SOURCE;
  return {
    id,
    kind: 'task',
    label: opts.label || 'Jortt (Gewoon Sander)',

    /** fetchWeek(weekStart) → ConnectorResult<NormalizedTask>. Never throws. */
    async fetchWeek(weekStart) {
      const todayDay = displayToday();
      const window = weekWindow(weekStart, DISPLAY_TZ);

      const clientId     = readEnvKey('JORTT_GEWOON_SANDER_CLIENT_ID_API_KEY');
      const clientSecret = readEnvKey('JORTT_GEWOON_SANDER_CLIENT_SECRET_API_KEY');
      if (!clientId || !clientSecret) {
        return degraded(id, 'no-token', 'Jortt (Gewoon Sander) is not connected — client ID or secret missing.');
      }

      let token;
      try {
        token = await fetchToken(clientId, clientSecret);
      } catch (err) {
        return degraded(id, 'unreachable', `Jortt token error: ${err.message.slice(0, 120)}`);
      }

      let invoices;
      try {
        invoices = await fetchInvoices(token);
      } catch (err) {
        const reason = err.jorttKey === 'organization.requires_mkb_plan' ? 'misconfigured' : 'unreachable';
        return degraded(id, reason, `Jortt invoices error: ${err.message.slice(0, 120)}`);
      }

      const items = [];
      for (const inv of invoices) {
        const dueDay = inv.due_date ? String(inv.due_date).slice(0, 10) : null;
        if (!dueDay) continue;
        const bucket = dueBucketOf(dueDay, todayDay);
        // Keep all overdue; keep upcoming only when it falls inside the planner week.
        if (bucket !== 'overdue' && !dayInWeek(dueDay, window.startDay, window.endDay)) continue;

        items.push({
          kind: 'task',
          source: id,
          id: String(inv.id),
          title: invoiceTitle(inv),
          description: invoiceDescription(inv),
          due: dueDay,
          dueBucket: bucket,
          priorityRank: bucket === 'overdue' ? 1 : bucket === 'today' ? 2 : 4,
          url: invoiceDeepLink(inv),
          tags: ['factuur'],
          status: inv.invoice_status ?? null,
          assignedToMe: true,
          editableFields: [],
        });
      }
      return ok(id, items);
    },
  };
}

export default makeJorttGewoonSanderConnector;
