// podcastsApi.js — the Podcasts module's dedicated endpoint family.
//
// WHY THIS EXISTS INSTEAD OF THE GENERIC LIBRARY ENDPOINT (DATA-CONTRACT §18.8/§18.9)
// `podcast_episodes` does have a `library_registry` row, so
// /api/cockpit/library/podcast_episodes technically answers — but it is the wrong
// surface here, for two independent reasons:
//   1. libraryApi.js resolves a library to a TABLE (`sqlite_master WHERE
//      type='table'`) and cannot be pointed at a view. Its grid therefore renders
//      `status`, i.e. Apple's state ONLY, and an episode Sander watched on YouTube
//      reads as `unplayed` there. The override would be invisible.
//   2. listLibraryItems() has no LIMIT. That is fine for a 40-row recipe library
//      and wrong for 4732 episodes that grow with every sync.
// So: every human-visible listening state on this page comes from
// `v_podcast_episodes_effective`, paginated, from here.
//
// READS are read-only SELECTs on the shared readonly connection (db.js:
// {readonly:true} + query_only). The effective OR is computed in SQL by the view
// and is NEVER re-implemented in JavaScript — a JS copy would be a second truth
// that rots on the next sync (§18.9).
//
// THE ONE WRITE is delegated verbatim to podcastsDb.js, which owns the separate
// read-write connection and is structurally bounded to three columns. This file
// contains no UPDATE and no SQL that reaches the write path.
//
// DEGRADES GRACEFULLY: on a mirror without the podcasts module (or without the
// override layer), every endpoint returns a calm { available:false } envelope —
// never a 500, never a crash.
//
// Mounted by server.js via
//   registerPodcastsRoutes(app, { safe, sessionOrLoopback, localWriteGuard, express }).
import db from './db.js';
import {
  ALLOWED_PLATFORMS,
  setManualWatched,
  clearManualWatched,
  watchWriteStatus,
} from './podcastsDb.js';

const EPISODES_VIEW = 'v_podcast_episodes_effective';

function objectExists(name, type) {
  try {
    return !!db
      .prepare(`SELECT name FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1`)
      .get(type, name);
  } catch {
    return false;
  }
}

function moduleAvailable() {
  return objectExists(EPISODES_VIEW, 'view') && objectExists('podcasts', 'table');
}

function parseJsonArray(raw) {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string').map(String) : [];
  } catch {
    return [];
  }
}

// ── Pagination bounds (§18.8: the LIMIT is not optional) ──────────────────────
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

function clampInt(raw, fallback, min, max) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

// ── State filters. Named for what the human sees, mapped to SQL here. ─────────
// `IS NOT` rather than `<>` throughout, so rows with a NULL play_state are not
// silently dropped (§18.9).
const STATE_FILTERS = {
  // Default: everything he has listened to at all, by Apple or by hand.
  listened: `effective_play_state IS NOT 'unplayed' AND effective_play_state IS NOT NULL`,
  played: `effective_play_state = 'played'`,
  'in-progress': `effective_play_state = 'in-progress'`,
  unplayed: `(effective_play_state = 'unplayed' OR effective_play_state IS NULL)`,
  // Only the hand-set rows — the audit view for the override itself.
  manual: `manual_watched = 1`,
  all: `1 = 1`,
};

// Columns the grid needs. Explicit projection: no SELECT * over a 43-column view,
// and `body` / `raw_frontmatter` stay out of the list payload entirely.
const LIST_COLUMNS = `
  e.slug, e.guid, e.title, e.podcast_slug, e.pubdate, e.duration_seconds,
  e.season_number, e.episode_number, e.artwork_url, e.web_page_url,
  e.play_state, e.percent_complete, e.last_played_date,
  e.manual_watched, e.manual_watched_platform, e.manual_watched_at,
  e.effective_play_state, e.effective_is_finished, e.effective_watch_source,
  e.effective_percent_complete,
  e.transcript_path, e.transcript_match_method, e.transcript_match_score,
  e.tags,
  p.title AS show_title, p.artwork_url AS show_artwork_url, p.author AS show_author
`;

function shapeEpisode(row) {
  if (!row) return null;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === 'tags') out.tags = parseJsonArray(v);
    else out[k] = v === undefined ? null : v;
  }
  // Booleans arrive as INTEGER 0/1 from SQLite; hand the client real booleans for
  // the two flags it renders as such. Everything else passes through verbatim.
  out.manual_watched = row.manual_watched === 1 || row.manual_watched === true;
  out.effective_is_finished = row.effective_is_finished === 1 || row.effective_is_finished === true;
  // Artwork falls back to the show's (only 2131/4732 episodes carry their own, §18.5).
  out.artwork_url = row.artwork_url ?? row.show_artwork_url ?? null;
  return out;
}

// ── (a) Overview: the shows + the write-channel status ────────────────────────
// One fetch gives the page its filter rail and tells it whether the checkbox is
// live. `write.available:false` means render the badge read-only, not broken.
export function getPodcastsOverview() {
  if (!moduleAvailable()) {
    return { available: false, shows: [], totals: null, write: { available: false, reason: 'module-absent' } };
  }
  const shows = db
    .prepare(
      `SELECT p.slug, p.title, p.author, p.artwork_url, p.web_page_url, p.category,
              p.is_subscribed, p.last_played_date,
              COUNT(e.slug)                                             AS episode_count,
              SUM(CASE WHEN e.effective_play_state = 'played' THEN 1 ELSE 0 END)      AS played_count,
              SUM(CASE WHEN e.effective_play_state = 'in-progress' THEN 1 ELSE 0 END) AS in_progress_count,
              SUM(CASE WHEN e.manual_watched = 1 THEN 1 ELSE 0 END)                   AS manual_count
         FROM podcasts p
         LEFT JOIN ${EPISODES_VIEW} e ON e.podcast_slug = p.slug
        GROUP BY p.slug
        ORDER BY p.title COLLATE NOCASE ASC`,
    )
    .all();

  const totals = db
    .prepare(
      `SELECT COUNT(*)                                                          AS episode_count,
              SUM(CASE WHEN effective_play_state = 'played' THEN 1 ELSE 0 END)  AS played_count,
              SUM(CASE WHEN manual_watched = 1 THEN 1 ELSE 0 END)               AS manual_count,
              SUM(CASE WHEN transcript_path IS NOT NULL THEN 1 ELSE 0 END)      AS transcript_count
         FROM ${EPISODES_VIEW}`,
    )
    .get();

  return {
    available: true,
    shows,
    totals,
    platforms: ALLOWED_PLATFORMS,
    write: watchWriteStatus(),
  };
}

// ── (b) The episode grid — the §18.9 read query, paginated ────────────────────
export function listEpisodes({ show, state, q, limit, offset } = {}) {
  if (!moduleAvailable()) return { available: false, episodes: [], total: 0 };

  const stateKey = STATE_FILTERS[state] ? state : 'listened';
  const where = [STATE_FILTERS[stateKey]];
  const params = {};

  if (show && String(show).trim()) {
    where.push('e.podcast_slug = @show');
    params.show = String(show).trim();
  }
  if (q && String(q).trim()) {
    where.push('LOWER(e.title) LIKE @q');
    params.q = `%${String(q).trim().toLowerCase()}%`;
  }
  // The state predicates reference bare column names; qualify them for the join.
  const whereSql = where
    .map((w) => w.replace(/\b(effective_play_state|manual_watched)\b/g, 'e.$1'))
    .join(' AND ');

  const lim = clampInt(limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const off = clampInt(offset, 0, 0, Number.MAX_SAFE_INTEGER);

  const total = db
    .prepare(`SELECT COUNT(*) AS n FROM ${EPISODES_VIEW} e WHERE ${whereSql}`)
    .get(params).n;

  const episodes = db
    .prepare(
      `SELECT ${LIST_COLUMNS}
         FROM ${EPISODES_VIEW} e
         LEFT JOIN podcasts p ON p.slug = e.podcast_slug
        WHERE ${whereSql}
        ORDER BY COALESCE(e.manual_watched_at, e.last_played_date, e.pubdate) DESC
        LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit: lim, offset: off })
    .map(shapeEpisode);

  return {
    available: true,
    state: stateKey,
    show: params.show ?? null,
    total,
    limit: lim,
    offset: off,
    hasMore: off + episodes.length < total,
    episodes,
    write: watchWriteStatus(),
  };
}

// ── (c) One episode by slug — the card → detail-large fetch ───────────────────
// Full row INCLUDING body (rendered show notes) and the transcript inference.
export function getEpisode(slug) {
  if (!moduleAvailable()) return { available: false, found: false };
  const row = db
    .prepare(
      `SELECT e.*, p.title AS show_title, p.artwork_url AS show_artwork_url,
              p.author AS show_author, p.web_page_url AS show_web_page_url
         FROM ${EPISODES_VIEW} e
         LEFT JOIN podcasts p ON p.slug = e.podcast_slug
        WHERE e.slug = ? LIMIT 1`,
    )
    .get(slug);
  if (!row) return { available: true, found: false };
  return {
    available: true,
    found: true,
    episode: shapeEpisode(row),
    platforms: ALLOWED_PLATFORMS,
    write: watchWriteStatus(),
  };
}

// ── The write body validator — scope-locked, mirrors cockpitSettingsRoutes ────
// Unknown fields are a 400, never silently dropped: a malformed client surfaces
// its own bug instead of half-writing.
export function validateWatchBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'body must be a JSON object' };
  }
  const allowed = new Set(['watched', 'platform', 'guid']);
  const extras = Object.keys(body).filter((k) => !allowed.has(k));
  if (extras.length) return { error: `unexpected field(s): ${extras.join(', ')}` };

  if (typeof body.watched !== 'boolean') return { error: 'watched must be a boolean' };

  if (body.watched) {
    if (typeof body.platform !== 'string' || !ALLOWED_PLATFORMS.includes(body.platform)) {
      return { error: `platform must be one of: ${ALLOWED_PLATFORMS.join(', ')}` };
    }
  } else if (body.platform !== undefined && body.platform !== null) {
    // Unticking nulls all three columns (§18.9) — a platform here would be a lie.
    return { error: 'platform must be omitted when watched is false' };
  }

  if (body.guid !== undefined && (typeof body.guid !== 'string' || !body.guid.trim())) {
    return { error: 'guid, when present, must be a non-empty string' };
  }

  return {
    watched: body.watched,
    platform: body.watched ? body.platform : null,
    expectGuid: typeof body.guid === 'string' ? body.guid.trim() : undefined,
  };
}

// ── Route registration ────────────────────────────────────────────────────────
export function registerPodcastsRoutes(app, deps) {
  const { safe, sessionOrLoopback, localWriteGuard } = deps;
  // Tiny body ({ watched, platform?, guid? }) — cap hard.
  const watchJson = deps.express.json({ limit: '4kb' });

  // READS — same posture as every other cockpit read endpoint (global /api auth
  // gate, loopback bind, no CSRF token needed because they never write).
  app.get('/api/cockpit/podcasts', safe(() => getPodcastsOverview()));

  app.get('/api/cockpit/podcasts/episodes', safe((req) =>
    listEpisodes({
      show: req.query.show,
      state: req.query.state,
      q: req.query.q,
      limit: req.query.limit,
      offset: req.query.offset,
    }),
  ));

  app.get('/api/cockpit/podcasts/episodes/:slug', safe((req) => getEpisode(req.params.slug)));

  // WRITE — the ONE mutating endpoint. Guard stack is the cockpit's standard,
  // reused verbatim from server.js: sessionOrLoopback → localWriteGuard (X-Cockpit
  // header + origin check) → scoped JSON parser → scope-locked validator →
  // podcastsDb.js's three-column channel.
  //
  // The route key is the episode SLUG (that is what the UI routes on), resolved
  // to `guid` inside podcastsDb.js's transaction before anything is written.
  app.patch(
    '/api/cockpit/podcasts/episodes/:slug/watched',
    sessionOrLoopback,
    localWriteGuard,
    watchJson,
    (req, res) => {
      const v = validateWatchBody(req.body);
      if (v.error) return res.status(400).json({ ok: false, error: v.error });

      const slug = req.params.slug;
      try {
        const result = v.watched
          ? setManualWatched({ slug, platform: v.platform, expectGuid: v.expectGuid })
          : clearManualWatched({ slug, expectGuid: v.expectGuid });

        if (!result.ok) {
          if (result.found === false) return res.status(404).json({ ok: false, error: 'episode not found' });
          if (result.conflict) return res.status(409).json({ ok: false, error: result.error, guid: result.guid });
          if (result.error === 'write-disabled') {
            return res.status(503).json({
              ok: false,
              error: 'podcast watch-writes are disabled (PODCAST_WATCH_WRITE_ENABLED=0)',
            });
          }
          return res.status(400).json({ ok: false, error: result.error });
        }
        // Echo the row back FROM THE VIEW so the UI takes its new effective state
        // from the database, not from an optimistic guess.
        return res.json({ ok: true, episode: shapeEpisode(result.episode) });
      } catch (err) {
        console.error(`[PATCH /api/cockpit/podcasts/episodes/${slug}/watched]`, err.message);
        // A CHECK-constraint failure lands here: the schema's last net held.
        return res.status(500).json({ ok: false, error: 'watch write failed' });
      }
    },
  );
}
