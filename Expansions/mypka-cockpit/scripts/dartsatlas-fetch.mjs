#!/usr/bin/env node
// dartsatlas-fetch.mjs — live fetcher for a Darts Atlas player's rankings and
// tournament history. Standalone CLI: no cron, no cockpit route, no UI. Nothing
// in server/ or web/ imports this yet.
//
// USAGE
//   node scripts/dartsatlas-fetch.mjs                     # default player, write snapshot
//   node scripts/dartsatlas-fetch.mjs --player <ID>       # another player id
//   node scripts/dartsatlas-fetch.mjs --stdout            # print JSON, write nothing
//   node scripts/dartsatlas-fetch.mjs --summary           # human-readable table
//   node scripts/dartsatlas-fetch.mjs --max-pages 4       # tournament pagination cap
//   node scripts/dartsatlas-fetch.mjs --no-history        # skip finished-season rankings
//
// OUTPUT (default)
//   data/dartsatlas/<player>/latest.json                       — always overwritten
//   data/dartsatlas/<player>/snapshots/<ISO>.json              — only when content changed
//
// POLITENESS / RELIABILITY CONTRACT
//   - Normal desktop-browser User-Agent (the site's robots.txt blocks AI-crawler
//     UAs specifically; this is the same UA string a browser sends).
//   - One request at a time, 1200 ms delay between requests.
//   - 10 s timeout per request, 3 attempts with exponential backoff (1s/2s/4s)
//     + jitter. 4xx other than 429 are NOT retried.
//   - Idempotent: re-running overwrites latest.json and skips writing a new
//     snapshot when nothing changed. Safe to run repeatedly.
//   - Structured JSON log lines to stderr; the payload goes to stdout/disk.
//
// LEGAL NOTE (read before scheduling this)
//   dartsatlas.com's Terms of Use restrict automated access. Sander is running
//   this against his OWN player profile and has a permission request pending
//   with Darts Atlas support. Do not widen this beyond his own player id, and
//   do not schedule it, without that permission in hand.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRankings, parseTournaments, BASE } from './lib/dartsatlas-parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPANSION_ROOT = path.resolve(__dirname, '..');

const DEFAULT_PLAYER = 'n6oeItIbK1vl'; // Sander van Ockenburg - Zwaan
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const REQUEST_TIMEOUT_MS = 10_000;
const REQUEST_DELAY_MS = 1_200;
const MAX_ATTEMPTS = 3;
const DEFAULT_MAX_PAGES = 10;

// ------------------------------------------------------------------ logging

function log(level, event, fields = {}) {
  process.stderr.write(JSON.stringify({
    ts: new Date().toISOString(),
    service: 'dartsatlas-fetch',
    level,
    event,
    ...fields,
  }) + '\n');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// -------------------------------------------------------------------- fetch

class HttpError extends Error {
  constructor(status, url) {
    super(`HTTP ${status} for ${url}`);
    this.status = status;
    this.url = url;
  }
}

async function fetchOnce(url) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
      },
    });
    if (!res.ok) throw new HttpError(res.status, url);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** GET with exponential backoff. Retries network errors, 429 and 5xx only. */
async function fetchHtml(url) {
  let lastErr;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const t0 = Date.now();
    try {
      const html = await fetchOnce(url);
      log('info', 'fetch.ok', { url, attempt, ms: Date.now() - t0, bytes: html.length });
      return html;
    } catch (err) {
      lastErr = err;
      const status = err instanceof HttpError ? err.status : null;
      const retryable = status === null || status === 429 || status >= 500;
      log('warn', 'fetch.fail', {
        url, attempt, status, retryable, error: String(err.message || err),
      });
      if (!retryable || attempt === MAX_ATTEMPTS) break;
      const backoff = 1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

// ------------------------------------------------------------------ collect

async function collect(playerId, { maxPages, withHistory }) {
  const rankingsUrl = `${BASE}/players/${playerId}/rankings`;
  const tournamentsUrl = `${BASE}/players/${playerId}/tournaments`;
  const pagesFetched = [];

  // 1) Active rankings
  const rankingsHtml = await fetchHtml(rankingsUrl);
  pagesFetched.push(rankingsUrl);
  const rankings = parseRankings(rankingsHtml);
  const standings = rankings.standings.map((s) => ({ ...s, scope: 'active' }));

  // 2) Optional: historic (finished) season standings
  if (withHistory) {
    await sleep(REQUEST_DELAY_MS);
    const historyUrl = `${rankingsUrl}?status=history`;
    const historyHtml = await fetchHtml(historyUrl);
    pagesFetched.push(historyUrl);
    for (const s of parseRankings(historyHtml).standings) {
      // The history page carries no status class on the card — the page itself
      // IS the status. Normalize here, where the scope is known, rather than
      // guessing inside the pure parser.
      const status = s.status === 'unknown' ? 'concluded' : s.status;
      standings.push({ ...s, status, scope: 'history' });
    }
  }

  // 3) Tournaments, following rel="next" up to maxPages
  const tournaments = [];
  let nextPath = `/players/${playerId}/tournaments`;
  let page = 0;
  const seenPaths = new Set();
  while (nextPath && page < maxPages) {
    if (seenPaths.has(nextPath)) {
      log('warn', 'pagination.loop', { path: nextPath });
      break;
    }
    seenPaths.add(nextPath);
    await sleep(REQUEST_DELAY_MS);
    const url = nextPath.startsWith('http') ? nextPath : BASE + nextPath;
    const html = await fetchHtml(url);
    pagesFetched.push(url);
    const parsed = parseTournaments(html);
    tournaments.push(...parsed.tournaments);
    nextPath = parsed.nextPagePath;
    page += 1;
  }
  if (nextPath) log('warn', 'pagination.capped', { maxPages, nextPath });

  // De-dupe on tournament id (a page boundary can repeat an entry).
  const byId = new Map();
  for (const t of tournaments) {
    if (t.id && byId.has(t.id)) continue;
    byId.set(t.id ?? `${t.date}-${t.name}`, t);
  }
  const uniqueTournaments = [...byId.values()]
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));

  return {
    source: 'dartsatlas',
    schemaVersion: 1,
    fetchedAt: new Date().toISOString(),
    player: rankings.player.id ? rankings.player : { id: playerId, name: null, url: `${BASE}/players/${playerId}` },
    standings,
    tournaments: uniqueTournaments,
    meta: {
      rankingsUrl,
      tournamentsUrl,
      pagesFetched,
      tournamentPages: page,
      standingsCount: standings.length,
      tournamentsCount: uniqueTournaments.length,
    },
  };
}

// -------------------------------------------------------------------- store

/** Everything except the volatile timestamp — used for change detection. */
function fingerprint(payload) {
  const { fetchedAt, meta, ...rest } = payload;
  return JSON.stringify(rest);
}

function store(payload) {
  const dir = path.join(EXPANSION_ROOT, 'data', 'dartsatlas', payload.player.id);
  const snapDir = path.join(dir, 'snapshots');
  fs.mkdirSync(snapDir, { recursive: true });

  const latestPath = path.join(dir, 'latest.json');
  let changed = true;
  if (fs.existsSync(latestPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
      changed = fingerprint(prev) !== fingerprint(payload);
    } catch {
      changed = true;
    }
  }

  fs.writeFileSync(latestPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  let snapshotPath = null;
  if (changed) {
    const stamp = payload.fetchedAt.replace(/[:.]/g, '-');
    snapshotPath = path.join(snapDir, `${stamp}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  }
  return { latestPath, snapshotPath, changed };
}

// ------------------------------------------------------------------ summary

function summary(p) {
  const L = [];
  L.push(`Darts Atlas — ${p.player.name ?? p.player.id}  (fetched ${p.fetchedAt})`);
  L.push('');
  L.push('RANKINGS');
  for (const s of p.standings) {
    const head = `  [${s.type}/${s.status}] ${s.title ?? '—'}`;
    L.push(head);
    const bits = [
      s.rank != null ? `rank #${s.rank}` : null,
      s.region ? `${s.region.name} #${s.region.rank}` : null,
      s.points != null ? `${s.points} pts` : null,
      s.average != null ? `avg ${s.average}` : null,
      s.first9 != null ? `first9 ${s.first9}` : null,
      s.wins != null ? `W${s.wins}-L${s.losses}` : null,
      s.titles != null ? `titles ${s.titles}` : null,
      s.finals != null ? `finals ${s.finals}` : null,
      s.semiFinals != null ? `SF ${s.semiFinals}` : null,
      s.scores100plus != null ? `100+ ${s.scores100plus}` : null,
      s.scores140plus != null ? `140+ ${s.scores140plus}` : null,
      s.scores180 != null ? `180 ${s.scores180}` : null,
    ].filter(Boolean);
    L.push(`      ${bits.join(' · ')}`);
  }
  L.push('');
  L.push(`TOURNAMENTS (${p.tournaments.length})`);
  L.push(`  ${'date'.padEnd(11)}${'result'.padEnd(15)}${'pts'.padStart(4)}  ${'avg'.padStart(6)} ${'first9'.padStart(6)}  name`);
  for (const t of p.tournaments) {
    L.push(
      `  ${String(t.date ?? '—').padEnd(11)}` +
      `${String(t.result ?? '—').padEnd(15)}` +
      `${String(t.points ?? '-').padStart(4)}  ` +
      `${String(t.average ?? '—').padStart(6)} ` +
      `${String(t.first9 ?? '—').padStart(6)}  ` +
      `${t.name ?? '—'}`
    );
  }
  return L.join('\n');
}

// ---------------------------------------------------------------------- CLI

function parseArgs(argv) {
  const args = {
    player: DEFAULT_PLAYER,
    maxPages: DEFAULT_MAX_PAGES,
    stdout: false,
    summaryOnly: false,
    // History is ON by default: it is one extra request, and it keeps
    // latest.json a COMPLETE picture. With it optional, latest.json would
    // shrink/grow depending on the flag and churn a snapshot every run.
    withHistory: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--player') args.player = argv[++i];
    else if (a === '--max-pages') args.maxPages = Number.parseInt(argv[++i], 10) || DEFAULT_MAX_PAGES;
    else if (a === '--stdout') args.stdout = true;
    else if (a === '--summary') args.summaryOnly = true;
    else if (a === '--history') args.withHistory = true;
    else if (a === '--no-history') args.withHistory = false;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

const HELP = `dartsatlas-fetch — live fetch a Darts Atlas player's rankings + tournaments

  node scripts/dartsatlas-fetch.mjs [options]

  --player <ID>      Darts Atlas player id (default: ${DEFAULT_PLAYER})
  --no-history       skip the ?status=history rankings page (on by default)
  --max-pages <n>    tournament pagination cap (default: ${DEFAULT_MAX_PAGES})
  --stdout           print the JSON payload, write nothing to disk
  --summary          print a human-readable summary instead of JSON
  --help             this text

  Default run writes data/dartsatlas/<player>/latest.json and, when the content
  changed, data/dartsatlas/<player>/snapshots/<timestamp>.json
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }
  if (!/^[A-Za-z0-9_-]+$/.test(args.player)) {
    log('error', 'args.invalid', { reason: 'player id must be alphanumeric' });
    process.exitCode = 2;
    return;
  }

  log('info', 'run.start', { player: args.player, maxPages: args.maxPages, history: args.withHistory });

  let payload;
  try {
    payload = await collect(args.player, { maxPages: args.maxPages, withHistory: args.withHistory });
  } catch (err) {
    log('error', 'run.failed', { error: String(err.message || err) });
    process.exitCode = 1;
    return;
  }

  if (args.summaryOnly) {
    process.stdout.write(summary(payload) + '\n');
  } else if (args.stdout) {
    process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
  }

  if (!args.stdout) {
    const { latestPath, snapshotPath, changed } = store(payload);
    log('info', 'run.stored', {
      latest: path.relative(EXPANSION_ROOT, latestPath),
      snapshot: snapshotPath ? path.relative(EXPANSION_ROOT, snapshotPath) : null,
      changed,
    });
  }

  log('info', 'run.done', {
    standings: payload.standings.length,
    tournaments: payload.tournaments.length,
    pages: payload.meta.pagesFetched.length,
  });
}

// Only auto-run when invoked directly, so tests (and a future cockpit route)
// can import collect()/store() without firing a live fetch on import.
const invokedDirectly = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) main();

export { collect, store, summary, fingerprint };
