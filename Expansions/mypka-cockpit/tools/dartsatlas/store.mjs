// store.mjs — the local Darts Atlas store: plain JSON files on disk.
//
// WHY JSON AND NOT mypka-cockpit.db
// ---------------------------------
// mypka-cockpit.db is matched by `*.db` in this Expansion's .gitignore and is
// documented as throwaway runtime state ("can be deleted at any time with zero
// loss of canonical content"). Sander's darts results are NOT throwaway: this
// store is the only local copy, because re-fetching them automatically is off
// the table (Darts Atlas ToU). So they live in git-tracked, human-readable JSON
// that the myPKA close-session backup picks up like any other file.
//
// A later Cockpit UI tab can read these files directly, or an importer can load
// them into SQLite — the shape below is deliberately DB-ready (id-keyed maps).
//
// WRITE POSTURE: every write is atomic (tmp file + rename) and every merge is an
// idempotent upsert keyed on the Darts Atlas id. Re-importing the same export
// twice changes nothing. Records are never deleted — a page that stops listing a
// tournament does not erase it here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** <expansion>/data/dartsatlas */
export const DATA_DIR = path.resolve(__dirname, '..', '..', 'data', 'dartsatlas');
export const INBOX_DIR = path.join(DATA_DIR, 'inbox');
export const PROCESSED_DIR = path.join(INBOX_DIR, 'processed');

export const STORE_SCHEMA = 1;

const FILES = {
  index: 'index.json',
  rankings: 'rankings.json',
  tournaments: 'tournaments.json',
  tournamentStats: 'tournament-stats.json',
  history: 'history.json',
};

const EMPTY = {
  index: () => ({ schema: STORE_SCHEMA, player: null, updatedAt: null, lastChangedAt: null, captures: {}, counts: {} }),
  rankings: () => ({ schema: STORE_SCHEMA, updatedAt: null, leagues: {}, seasons: {} }),
  tournaments: () => ({ schema: STORE_SCHEMA, updatedAt: null, tournaments: {} }),
  tournamentStats: () => ({ schema: STORE_SCHEMA, updatedAt: null, stats: {} }),
  history: () => ({ schema: STORE_SCHEMA, updatedAt: null, snapshots: [] }),
};

// ---------------------------------------------------------------------------
// disk helpers
// ---------------------------------------------------------------------------

export function ensureDirs() {
  for (const dir of [DATA_DIR, INBOX_DIR, PROCESSED_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Recursively sort object keys so a re-write produces a minimal git diff. */
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeys(value[key]);
    return out;
  }
  return value;
}

function readJson(file, fallback) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback();
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') return fallback();
    // A corrupt store must be loud, not silently overwritten.
    throw new Error(`Kan ${file} niet lezen als JSON: ${err.message}`);
  }
}

function writeJsonAtomic(file, data) {
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(sortKeys(data), null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, file);
}

// ---------------------------------------------------------------------------
// load / save
// ---------------------------------------------------------------------------

export function loadStore() {
  ensureDirs();
  const store = {};
  for (const [key, filename] of Object.entries(FILES)) {
    store[key] = readJson(path.join(DATA_DIR, filename), EMPTY[key]);
  }
  return store;
}

function serialize(data) {
  return JSON.stringify(sortKeys(data), null, 2) + '\n';
}

/**
 * saveStore(store) → { counts, written }
 *
 * Writes ONLY the files whose content actually changed. The timestamp fields
 * (`updatedAt`, `lastChangedAt`) are excluded from that comparison and then
 * refreshed on the files that do get written — otherwise every run would
 * rewrite all five files with a new timestamp and show up as a git diff even
 * when Sander re-imported an export he had already imported.
 */
export function saveStore(store) {
  ensureDirs();
  const now = new Date().toISOString();
  const counts = {
    leagues: Object.keys(store.rankings.leagues || {}).length,
    seasons: Object.keys(store.rankings.seasons || {}).length,
    tournaments: Object.keys(store.tournaments.tournaments || {}).length,
    tournamentStats: Object.keys(store.tournamentStats.stats || {}).length,
    historySnapshots: (store.history.snapshots || []).length,
  };
  store.index.counts = counts;

  const written = [];
  for (const part of Object.keys(FILES)) {
    const file = path.join(DATA_DIR, FILES[part]);
    const onDisk = readJson(file, EMPTY[part]);
    // Compare with the timestamps neutralised on both sides.
    const neutral = (data) => ({ ...data, schema: STORE_SCHEMA, updatedAt: null, lastChangedAt: null });
    if (serialize(neutral(store[part])) === serialize(neutral(onDisk))) {
      store[part] = onDisk; // keep the recorded timestamps
      continue;
    }
    store[part].schema = STORE_SCHEMA;
    store[part].updatedAt = now;
    if (part === 'index') store[part].lastChangedAt = now;
    writeJsonAtomic(file, store[part]);
    written.push(FILES[part]);
  }
  return { counts, written };
}

// ---------------------------------------------------------------------------
// merge
// ---------------------------------------------------------------------------

/** Shallow upsert that never lets a newer-but-thinner record erase known fields. */
function upsert(bucket, id, incoming, tally) {
  const existing = bucket[id];
  if (!existing) {
    bucket[id] = incoming;
    tally.added += 1;
    return;
  }
  const merged = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (value === null || value === undefined) continue; // keep what we already knew
    if (Array.isArray(value) && value.length === 0 && Array.isArray(existing[key]) && existing[key].length) continue;
    merged[key] = value;
  }
  const changed = JSON.stringify(sortKeys(merged)) !== JSON.stringify(sortKeys(existing));
  bucket[id] = merged;
  if (changed) tally.updated += 1;
  else tally.unchanged += 1;
}

/**
 * A dated snapshot of a standing, so Sander can see his rank/average move over
 * time. Deduped on date+key: clicking the bookmarklet three times on one day
 * overwrites that day's snapshot instead of piling up.
 */
function pushSnapshot(history, snapshot, tally) {
  const list = history.snapshots;
  const idx = list.findIndex((s) => s.date === snapshot.date && s.key === snapshot.key);
  if (idx === -1) {
    list.push(snapshot);
    tally.added += 1;
  } else if (JSON.stringify(sortKeys(list[idx])) !== JSON.stringify(sortKeys(snapshot))) {
    list[idx] = snapshot;
    tally.updated += 1;
  } else {
    tally.unchanged += 1;
  }
  list.sort((a, b) => (a.date === b.date ? a.key.localeCompare(b.key) : a.date.localeCompare(b.date)));
}

const VALID_PAGE_TYPES = new Set(['rankings', 'tournaments', 'tournament_stats']);

/**
 * validateEnvelope(env) → null when usable, otherwise a human-readable reason.
 * The importer refuses anything it does not fully recognise rather than writing
 * half-understood data into the store.
 */
export function validateEnvelope(env) {
  if (!env || typeof env !== 'object') return 'geen JSON-object';
  if (env.source !== 'dartsatlas') return `onbekende bron "${env.source}"`;
  if (env.schema !== 1) return `onbekend payload-schema ${env.schema} (deze importer kent alleen 1)`;
  if (!VALID_PAGE_TYPES.has(env.pageType)) {
    return `pagina-type "${env.pageType}" wordt niet ondersteund — open een /rankings-, /tournaments- of /player_stats-pagina`;
  }
  if (!Array.isArray(env.records)) return 'records ontbreekt of is geen array';
  if (!env.player || !env.player.id) return 'speler-id ontbreekt in de export';
  if (!env.capturedAt) return 'capturedAt ontbreekt in de export';
  return null;
}

/**
 * mergeEnvelope(store, env) → { added, updated, unchanged, skipped }
 * Pure upsert. Caller is responsible for saveStore().
 */
export function mergeEnvelope(store, env) {
  const tally = { added: 0, updated: 0, unchanged: 0, skipped: 0, snapshots: { added: 0, updated: 0, unchanged: 0 } };
  const capturedAt = env.capturedAt;
  const date = String(capturedAt).slice(0, 10);
  const origin = env.origin || 'https://www.dartsatlas.com';
  const abs = (p) => (p ? (/^https?:/i.test(p) ? p : origin + p) : null);

  for (const rec of env.records) {
    if (!rec || !rec.kind) {
      tally.skipped += 1;
      continue;
    }
    const provenance = { capturedAt, sourceUrl: env.sourceUrl || null };

    if (rec.kind === 'league-standing') {
      upsert(store.rankings.leagues, rec.leagueId, {
        leagueId: rec.leagueId,
        leagueName: rec.leagueName,
        url: abs(rec.leaguePath),
        status: rec.status,
        stats: rec.stats,
        regionRanks: rec.regionRanks,
        ...provenance,
      }, tally);
      pushSnapshot(store.history, {
        date, key: rec.key, kind: rec.kind, name: rec.leagueName,
        stats: rec.stats, regionRanks: rec.regionRanks,
      }, tally.snapshots);
      continue;
    }

    if (rec.kind === 'season-standing') {
      upsert(store.rankings.seasons, rec.seasonId, {
        seasonId: rec.seasonId,
        seasonName: rec.seasonName,
        url: abs(rec.seasonPath),
        leagueId: rec.leagueId,
        leagueName: rec.leagueName,
        leagueUrl: abs(rec.leaguePath),
        period: rec.period,
        status: rec.status,
        stats: rec.stats,
        regionRanks: rec.regionRanks,
        ...provenance,
      }, tally);
      pushSnapshot(store.history, {
        date, key: rec.key, kind: rec.kind, name: rec.seasonName,
        stats: rec.stats, regionRanks: rec.regionRanks,
      }, tally.snapshots);
      continue;
    }

    if (rec.kind === 'tournament') {
      upsert(store.tournaments.tournaments, rec.tournamentId, {
        tournamentId: rec.tournamentId,
        name: rec.name,
        url: abs(rec.tournamentPath),
        date: rec.date,
        leagueId: rec.leagueId,
        leagueName: rec.leagueName,
        leagueUrl: abs(rec.leaguePath),
        result: rec.result,
        points: rec.points,
        status: rec.status,
        stats: rec.stats,
        statsUrl: abs(rec.statsPath),
        ...provenance,
      }, tally);
      continue;
    }

    if (rec.kind === 'tournament-stats') {
      upsert(store.tournamentStats.stats, rec.tournamentId, {
        tournamentId: rec.tournamentId,
        name: rec.name,
        url: abs(rec.tournamentPath),
        stats: rec.stats,
        matches: (rec.matches || []).map((m) => ({ ...m, url: abs(m.matchPath) })),
        ...provenance,
      }, tally);
      continue;
    }

    tally.skipped += 1;
  }

  // --- meta -----------------------------------------------------------------
  if (!store.index.player) store.index.player = { id: env.player.id, name: env.player.name || null };
  else if (env.player.name) store.index.player.name = env.player.name;

  const captureKey = [env.pageType, env.view && env.view.status ? env.view.status : '-', env.view ? env.view.page : 1].join(':');
  store.index.captures[captureKey] = {
    capturedAt,
    sourceUrl: env.sourceUrl || null,
    recordCount: env.records.length,
    totalPages: env.pagination ? env.pagination.totalPages : 1,
  };
  return tally;
}

/**
 * missingPages(store) → [{ pageType, status, have, missing, hintUrl }]
 * Darts Atlas paginates the tournament history (4 pages at the time of writing).
 * The bookmarklet captures ONE page per click — by design, since walking the
 * pager automatically would be exactly the robotic retrieval the ToU forbids.
 * So the importer tells Sander which pages he still has to open himself.
 */
export function missingPages(store, playerId) {
  const byView = new Map();
  for (const [key, cap] of Object.entries(store.index.captures || {})) {
    const [pageType, status, page] = key.split(':');
    if (pageType === 'tournament_stats') continue;
    const viewKey = pageType + ':' + status;
    const entry = byView.get(viewKey) || { pageType, status, totalPages: 1, have: new Set() };
    entry.totalPages = Math.max(entry.totalPages, cap.totalPages || 1);
    entry.have.add(Number(page));
    byView.set(viewKey, entry);
  }
  const pid = playerId || (store.index.player && store.index.player.id);
  const out = [];
  for (const entry of byView.values()) {
    const missing = [];
    for (let p = 1; p <= entry.totalPages; p += 1) if (!entry.have.has(p)) missing.push(p);
    if (!missing.length) continue;
    const base = `https://www.dartsatlas.com/players/${pid}/${entry.pageType}`;
    out.push({
      pageType: entry.pageType,
      status: entry.status === '-' ? null : entry.status,
      have: [...entry.have].sort((a, b) => a - b),
      missing,
      hintUrl: `${base}?page=${missing[0]}${entry.status && entry.status !== '-' ? '&status=' + entry.status : ''}`,
    });
  }
  return out;
}
