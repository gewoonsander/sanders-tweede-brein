// dartsatlasApi.js — read-only server endpoints for the Darts module.
//
// WHY THIS IS NOT A DB MODULE
//   Every other module surface in the cockpit reads mypka.db. This one does NOT:
//   the Darts Atlas payload is NOT part of the PKM markdown corpus, so it never
//   enters the SQLite mirror. The scraper (scripts/dartsatlas-fetch.mjs, run
//   weekly by a LaunchAgent on the Mac mini, also runnable by hand) writes plain
//   JSON files to disk:
//
//     data/dartsatlas/<playerId>/latest.json           — always overwritten
//     data/dartsatlas/<playerId>/snapshots/<ISO>.json  — only when content changed
//
//   This module reads latest.json off disk and hands it to the frontend as-is.
//   Read-only: no fs write of any kind lives here, and no query touches mypka.db.
//
// FRESHNESS
//   The payload carries its own `fetchedAt` (set by the scraper). We ALSO return
//   the file's mtime, because the view has to answer "did the refresh actually
//   happen?" even when another machine did the refreshing and synced the file
//   over. Both are surfaced; `fetchedAt` is the truth about the scrape, `fileMtime`
//   the truth about this machine's copy.
//
// DEGRADATION
//   No data dir / no latest.json / unparseable JSON → { available: false } plus a
//   `reason`, never a 500. The view renders a calm empty state that names the
//   command to run.
//
// Mounted by server.js via registerDartsatlasRoutes(app, { safe }).
import fs from 'node:fs';
import path from 'node:path';
import { COCKPIT_ROOT } from './repoRoot.js';

// The scraper anchors its output at the cockpit root (EXPANSION_ROOT in
// scripts/dartsatlas-fetch.mjs = path.resolve(__dirname, '..')), so we resolve
// from exactly the same anchor rather than re-deriving it positionally.
const DARTS_DIR = path.join(COCKPIT_ROOT, 'data', 'dartsatlas');

// Sander's own Darts Atlas id — the same default the scraper ships. Overridable
// per-request (?player=) and per-install (DARTSATLAS_PLAYER_ID).
const DEFAULT_PLAYER = process.env.DARTSATLAS_PLAYER_ID || 'n6oeItIbK1vl';

// Darts Atlas ids are short opaque alphanumerics. Anything else is rejected
// BEFORE it reaches path.join — a player id is the only user-controlled segment
// in this path, so it never gets to carry `..` or a separator.
const PLAYER_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function isValidPlayerId(id) {
  return typeof id === 'string' && PLAYER_ID_RE.test(id);
}

/** Player folders currently present on disk. Lets the view fall back to whatever
 *  profile actually exists instead of 404-ing on a default id that was never
 *  scraped on this machine.
 *
 *  A directory only counts as a PLAYER when it actually holds a latest.json —
 *  data/dartsatlas/ also carries the bookmarklet import staging folder
 *  (`inbox/`), which is a sibling of the player folders, not one of them. */
function listPlayerDirs() {
  try {
    return fs
      .readdirSync(DARTS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory() && isValidPlayerId(e.name))
      .filter((e) => {
        try {
          return fs.statSync(path.join(DARTS_DIR, e.name, 'latest.json')).isFile();
        } catch {
          return false;
        }
      })
      .map((e) => e.name);
  } catch {
    return [];
  }
}

function resolvePlayerId(requested) {
  if (requested != null && String(requested).trim() !== '') {
    const id = String(requested).trim();
    return isValidPlayerId(id) ? id : null; // invalid → caller returns a 4xx-shaped envelope
  }
  const present = listPlayerDirs();
  if (present.includes(DEFAULT_PLAYER)) return DEFAULT_PLAYER;
  return present[0] ?? DEFAULT_PLAYER;
}

// Belt-and-braces: even with the regex above, confirm the resolved file really is
// inside DARTS_DIR before reading it.
function latestPathFor(playerId) {
  const file = path.join(DARTS_DIR, playerId, 'latest.json');
  const rel = path.relative(DARTS_DIR, file);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return file;
}

// Normalise one standings row. The scraper already emits a stable shape; this
// only guarantees every key is present (null, not undefined) so the typed
// frontend never meets a missing field.
function shapeStanding(s) {
  return {
    type: s.type ?? null,
    status: s.status ?? null,
    scope: s.scope ?? null,
    title: s.title ?? null,
    seasonId: s.seasonId ?? null,
    url: s.url ?? null,
    league: s.league ?? null,
    region: s.region ?? null,
    periodStart: s.periodStart ?? null,
    periodEnd: s.periodEnd ?? null,
    rank: s.rank ?? null,
    points: s.points ?? null,
    average: s.average ?? null,
    first9: s.first9 ?? null,
    wins: s.wins ?? null,
    losses: s.losses ?? null,
    titles: s.titles ?? null,
    finals: s.finals ?? null,
    semiFinals: s.semiFinals ?? null,
    scores100plus: s.scores100plus ?? null,
    scores140plus: s.scores140plus ?? null,
    scores180: s.scores180 ?? null,
  };
}

function shapeTournament(t) {
  return {
    id: t.id ?? null,
    date: t.date ?? null,
    status: t.status ?? null,
    name: t.name ?? null,
    url: t.url ?? null,
    circuit: t.circuit ?? null,
    result: t.result ?? null,
    points: t.points ?? null,
    average: t.average ?? null,
    first9: t.first9 ?? null,
    statsUrl: t.statsUrl ?? null,
  };
}

/** The whole Darts Atlas profile for one player, straight off disk. */
export function readDartsProfile(requestedPlayer) {
  const playerId = resolvePlayerId(requestedPlayer);
  if (!playerId) {
    return { available: false, reason: 'invalid-player-id', playerId: null };
  }

  const file = latestPathFor(playerId);
  if (!file) return { available: false, reason: 'invalid-player-id', playerId: null };

  let raw;
  let mtime = null;
  try {
    raw = fs.readFileSync(file, 'utf8');
    mtime = fs.statSync(file).mtime.toISOString();
  } catch {
    return {
      available: false,
      reason: 'no-data-file',
      playerId,
      knownPlayers: listPlayerDirs(),
    };
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return { available: false, reason: 'unreadable-json', playerId };
  }

  const standings = Array.isArray(payload.standings) ? payload.standings.map(shapeStanding) : [];
  const tournaments = Array.isArray(payload.tournaments)
    ? payload.tournaments.map(shapeTournament)
    : [];

  // Newest tournament first — the view's default ordering, decided once here so
  // the client never has to re-sort a 60+ row list on every render.
  tournaments.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));

  return {
    available: true,
    source: payload.source ?? 'dartsatlas',
    schemaVersion: payload.schemaVersion ?? null,
    // When the SCRAPE ran (authored by the scraper, travels with the file).
    fetchedAt: payload.fetchedAt ?? null,
    // When THIS machine's copy of the file last changed — the honest answer to
    // "did the refresh land here?" after a sync from another Mac.
    fileMtime: mtime,
    playerId,
    player: payload.player ?? { id: playerId, name: null, url: null },
    standings,
    tournaments,
    meta: payload.meta ?? null,
    counts: { standings: standings.length, tournaments: tournaments.length },
  };
}

/** Which player profiles exist on disk (for a future profile switcher). */
export function listDartsPlayers() {
  const ids = listPlayerDirs();
  return { available: ids.length > 0, players: ids, defaultPlayer: resolvePlayerId(null) };
}

// ── Route registration ────────────────────────────────────────────────────────
export function registerDartsatlasRoutes(app, { safe }) {
  // The profile. Optional ?player=<dartsAtlasId>; defaults to the scraped profile
  // present on disk. Pure read — this route never writes anything.
  app.get('/api/cockpit/darts', safe((req) => readDartsProfile(req.query.player)));
  // Which profiles exist on disk.
  app.get('/api/cockpit/darts/players', safe(() => listDartsPlayers()));
}
