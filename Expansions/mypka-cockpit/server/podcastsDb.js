// podcastsDb.js — the cockpit's ONLY read-write channel into mypka.db.
//
// SCOPE (hard, not conventional): this module may write exactly three columns of
// exactly one table:
//
//     podcast_episodes.manual_watched
//     podcast_episodes.manual_watched_platform
//     podcast_episodes.manual_watched_at
//
// Nothing else. Not another column, not another table, not another database.
//
// ── WHY A WRITE CHANNEL EXISTS AT ALL (the documented carve-out) ───────────────
// server/db.js opens mypka.db {readonly:true} + `query_only = true` on the ground
// that "markdown is canonical; mypka.db is a derived mirror" — a write to a
// derived table is destroyed by the next regen, so forbidding it is correct.
//
// That rationale does NOT reach `podcast_episodes`. Per DATA-CONTRACT §18.2 the
// podcasts tables are NOT derived from markdown and are NOT in the regen's
// OWNED_TABLES / OWNED_VIEWS — `regen-mypka-db.py` drops only what it owns and
// leaves foreign tables untouched. The three columns above are, by construction,
// facts NOTHING else can produce: Apple's store has no knowledge of an episode
// Sander watched on YouTube, so no sync will ever refill them. They are the Inner
// World ANNOTATION layer of DATA-CONTRACT §18.9 (the same layering §14.1 already
// established for the Outer World), and this file is their one home. Sander chose
// this over a cockpit-owned side table (route A over route B, 2026-08-19)
// precisely so one fact keeps one home and the OR stays in SQL.
//
// This is a CARVE-OUT, not a repeal. db.js stays readonly for everything else.
// Extending this module to a fourth column or a second table is a DATA-CONTRACT
// change, not a code change — and the boot-time guard below will refuse to load
// until the contract and the SQL agree again.
//
// ── HOW THE SCOPE IS ENFORCED (four independent layers) ───────────────────────
//   1. NO SQL EVER CROSSES THE MODULE BOUNDARY. Every exported function takes
//      typed scalars (slug, guid, platform). There is no exported function that
//      accepts SQL, a table name, a column name, or a WHERE fragment. A client
//      literally cannot express a statement this module has not pre-written.
//   2. TWO FROZEN SQL LITERALS. Both UPDATEs are constants, prepared once, never
//      string-built at call time. All values bind as parameters.
//   3. A BOOT-TIME PROOF over those literals: assertScopedUpdate() parses each
//      one and throws at module load unless it is a single statement, targets
//      `podcast_episodes`, keys on `guid = @guid`, and assigns ONLY the three
//      whitelisted columns. Edit the SQL to touch a fourth column and the server
//      refuses to start — loudly, at boot, not silently at 3am.
//   4. The schema's own CHECK constraints (§18.9) as the last net — a second
//      belt, never a substitute for layers 1–3.
//
// ── CONNECTION DISCIPLINE ─────────────────────────────────────────────────────
//   * Its OWN connection, opened LAZILY on the first write. This module never
//     imports db.js and never borrows the readonly handle. Until Sander ticks his
//     first checkbox, no read-write file handle onto mypka.db exists at all.
//   * `journal_mode` is deliberately NOT changed. mypka.db runs in `delete` mode;
//     flipping it to WAL would persist in the file and change conditions for
//     regen-mypka-db.py and for db.js's readonly handle. Not our call to make
//     from a three-column write path.
//   * Reads for display stay on the readonly connection (podcastsApi.js → db.js).
//     This module reads only what it must to write correctly: the slug→guid
//     resolution, and the row it just wrote (so the UI gets the new effective
//     state without a refetch).
//
// Consumed by server/podcastsApi.js. Nothing else should import this file.

import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { REPO_ROOT } from './repoRoot.js';

const DB_PATH = path.resolve(REPO_ROOT, 'mypka.db');
const TABLE = 'podcast_episodes';
const VIEW = 'v_podcast_episodes_effective';

// ── The whitelist. This array IS the scope of this module. ────────────────────
export const WRITABLE_COLUMNS = Object.freeze([
  'manual_watched',
  'manual_watched_platform',
  'manual_watched_at',
]);

// The platform vocabulary, mirroring the CHECK in
// sqlite-extension/schema/09-module-podcasts.sql. Extending it means editing the
// CHECK, install-extensions.py, DATA-CONTRACT §18.9 and this line — together.
export const ALLOWED_PLATFORMS = Object.freeze(['youtube', 'spotify', 'web', 'other']);

// ── The two statements. Frozen literals; values bind as parameters. ───────────
// Set the tick. All three columns move together — the coherence CHECKs in §18.9
// make any partial combination illegal by design.
const SQL_SET = `
UPDATE podcast_episodes
   SET manual_watched          = 1,
       manual_watched_platform = @platform,
       manual_watched_at       = @now
 WHERE guid = @guid
`;

// Clear the tick. ONE statement nulling all three — clearing only manual_watched
// raises a CHECK failure by design (§18.9), rather than leaving a ghost platform
// on an unticked row.
const SQL_CLEAR = `
UPDATE podcast_episodes
   SET manual_watched          = 0,
       manual_watched_platform = NULL,
       manual_watched_at       = NULL
 WHERE guid = @guid
`;

// ── Layer 3: the boot-time proof ──────────────────────────────────────────────
// Parses a literal and throws unless it is a single UPDATE on `podcast_episodes`,
// keyed on `guid = @guid`, assigning ONLY whitelisted columns. Runs at module
// load (pure string analysis, no database needed), so a scope violation is a
// startup crash with a named column — never a silent write.
function assertScopedUpdate(sql, label) {
  const fail = (why) => {
    throw new Error(
      `podcastsDb.js scope violation in ${label}: ${why}\n` +
      `  This module may only UPDATE ${WRITABLE_COLUMNS.join(', ')} on ${TABLE}, keyed on guid.\n` +
      `  Widening it is a DATA-CONTRACT §18.9 change, not a code change.`,
    );
  };

  const trimmed = sql.trim();
  // Single statement only — no piggybacked second statement in the literal.
  if (trimmed.slice(0, -1).includes(';')) fail('contains more than one statement');
  if (!/^UPDATE\s+podcast_episodes\s+SET\b/i.test(trimmed)) {
    fail(`does not start with "UPDATE ${TABLE} SET"`);
  }

  const m = /\bSET\b([\s\S]*?)\bWHERE\b([\s\S]*)$/i.exec(trimmed);
  if (!m) fail('has no parseable SET … WHERE');

  // Every assignment target must be whitelisted.
  const assigned = m[1]
    .split(',')
    .map((frag) => frag.split('=')[0].trim())
    .filter(Boolean);
  if (assigned.length === 0) fail('assigns no columns');
  for (const col of assigned) {
    if (!WRITABLE_COLUMNS.includes(col)) fail(`assigns non-whitelisted column "${col}"`);
  }

  // Identity key only. `slug` is derived and may be regenerated by a future sync,
  // so a tick keyed on slug can follow the wrong row (§18.9).
  if (!/^\s*guid\s*=\s*@guid\s*$/i.test(m[2])) {
    fail(`WHERE clause is "${m[2].trim()}", expected "guid = @guid"`);
  }
}

assertScopedUpdate(SQL_SET, 'SQL_SET');
assertScopedUpdate(SQL_CLEAR, 'SQL_CLEAR');

// ── Kill switch ───────────────────────────────────────────────────────────────
// Default ON: a checkbox that silently does nothing is worse than no checkbox.
// Set PODCAST_WATCH_WRITE_ENABLED=0 to make this module refuse every write and
// report { available:false, reason:'write-disabled' } — the read side keeps
// working, so the UI degrades to a read-only badge instead of breaking.
function writeEnabled() {
  return process.env.PODCAST_WATCH_WRITE_ENABLED !== '0';
}

// ── Lazy read-write connection ────────────────────────────────────────────────
let rwDb = null;

function connect() {
  if (rwDb) return rwDb;
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`mypka.db not found at ${DB_PATH}`);
  }
  // No `readonly` flag; journal_mode deliberately left as-is (see header).
  const conn = new Database(DB_PATH, { fileMustExist: true });
  conn.pragma('foreign_keys = ON');

  // Structural preflight: the table, the three columns, and the UNIQUE index on
  // guid must all exist before this connection is allowed to be used. A missing
  // unique index would make "one tick, one row" an assumption instead of a fact.
  const cols = new Set(conn.prepare(`PRAGMA table_info(${TABLE})`).all().map((c) => c.name));
  const missing = WRITABLE_COLUMNS.filter((c) => !cols.has(c));
  if (missing.length) {
    conn.close();
    throw new Error(
      `${TABLE} in mypka.db is missing column(s): ${missing.join(', ')}.\n` +
      `  Install the override layer: python3 "Expansions/mypka-cockpit/sqlite-extension/install-extensions.py"`,
    );
  }
  const guidIndexed = conn
    .prepare(`SELECT name FROM sqlite_master WHERE type='index' AND tbl_name=? AND sql LIKE '%UNIQUE%' AND sql LIKE '%guid%'`)
    .all(TABLE).length > 0;
  if (!guidIndexed) {
    conn.close();
    throw new Error(`${TABLE}.guid has no UNIQUE index — refusing to write on a non-unique identity key.`);
  }

  rwDb = conn;
  return rwDb;
}

// ISO-8601 UTC, computed app-side (same posture as plannerDb.js: explicit and
// consistent rather than leaning on SQLite defaults).
function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// ── Availability probe (used by the API layer to degrade calmly) ──────────────
// Never throws. Returns why writing is impossible, in the client's words.
export function watchWriteStatus() {
  if (!writeEnabled()) return { available: false, reason: 'write-disabled' };
  try {
    connect();
    return { available: true, reason: null };
  } catch (err) {
    return { available: false, reason: err.message };
  }
}

// ── The one shape both writes share ───────────────────────────────────────────
// Resolve → update → read back, in ONE transaction on ONE connection, so a
// concurrent regen or a double-click can't interleave a resolve from before with
// an update from after.
function applyTick(conn, { slug, guid, expectGuid, set, platform }) {
  const resolveBySlug = conn.prepare(`SELECT guid FROM ${TABLE} WHERE slug = ? LIMIT 1`);
  const resolveByGuid = conn.prepare(`SELECT guid FROM ${TABLE} WHERE guid = ? LIMIT 1`);
  const readBack = conn.prepare(`SELECT * FROM ${VIEW} WHERE guid = ? LIMIT 1`);
  const stmt = set ? conn.prepare(SQL_SET) : conn.prepare(SQL_CLEAR);

  const txn = conn.transaction(() => {
    // Identity resolution. The UI route key IS slug (§18.9), so resolve it to the
    // immutable guid first; a caller may also address the row by guid directly.
    let identity = null;
    if (guid) identity = resolveByGuid.get(guid)?.guid ?? null;
    else if (slug) identity = resolveBySlug.get(slug)?.guid ?? null;
    if (!identity) return { found: false };

    // Optional stale-client check: the caller may pin the guid it believes the
    // slug maps to. A mismatch means the row moved under the client — refuse
    // rather than tick the wrong episode.
    if (expectGuid && expectGuid !== identity) {
      return { found: true, conflict: true, guid: identity };
    }

    const info = set
      ? stmt.run({ guid: identity, platform, now: nowIso() })
      : stmt.run({ guid: identity });

    return { found: true, changed: info.changes, episode: readBack.get(identity) ?? null };
  });

  return txn();
}

/**
 * Set the tick: "ook gezien via een ander platform".
 *
 * @param {{slug?: string, guid?: string, expectGuid?: string, platform: string}} args
 *   Address the row by `slug` (the UI route key) or `guid` (identity). `platform`
 *   must be one of ALLOWED_PLATFORMS.
 * @returns {{ok: boolean, error?: string, found?: boolean, conflict?: boolean, episode?: object}}
 *   Never throws for caller error; throws only on a genuine database fault.
 */
export function setManualWatched({ slug, guid, expectGuid, platform } = {}) {
  if (!writeEnabled()) return { ok: false, error: 'write-disabled' };
  if (!slug && !guid) return { ok: false, error: 'slug or guid required' };
  if (typeof platform !== 'string' || !ALLOWED_PLATFORMS.includes(platform)) {
    return { ok: false, error: `platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}` };
  }
  const conn = connect();
  const r = applyTick(conn, { slug, guid, expectGuid, set: true, platform });
  if (!r.found) return { ok: false, error: 'episode not found', found: false };
  if (r.conflict) return { ok: false, error: 'guid mismatch for this slug', conflict: true, guid: r.guid };
  return { ok: true, found: true, episode: r.episode };
}

/**
 * Clear the tick. One statement, all three columns (§18.9).
 *
 * @param {{slug?: string, guid?: string, expectGuid?: string}} args
 * @returns {{ok: boolean, error?: string, found?: boolean, conflict?: boolean, episode?: object}}
 */
export function clearManualWatched({ slug, guid, expectGuid } = {}) {
  if (!writeEnabled()) return { ok: false, error: 'write-disabled' };
  if (!slug && !guid) return { ok: false, error: 'slug or guid required' };
  const conn = connect();
  const r = applyTick(conn, { slug, guid, expectGuid, set: false });
  if (!r.found) return { ok: false, error: 'episode not found', found: false };
  if (r.conflict) return { ok: false, error: 'guid mismatch for this slug', conflict: true, guid: r.guid };
  return { ok: true, found: true, episode: r.episode };
}

// Exported for the scope test (podcastsDb.test.mjs) — the SQL literals are part
// of the contract, so they get asserted, not just executed.
export const __sql = Object.freeze({ SQL_SET, SQL_CLEAR, assertScopedUpdate });
export { DB_PATH as MYPKA_DB_PATH };
