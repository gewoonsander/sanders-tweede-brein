-- ============================================================================
-- 09-module-podcasts.sql — the Podcasts library (Apple Podcasts listening history)
-- ----------------------------------------------------------------------------
-- Two tables: `podcasts` (the SHOW dimension, one row per followed/known feed)
-- and `podcast_episodes` (the EPISODE fact + library mirror, one row per episode).
-- Source of record: Apple Podcasts' local CoreData store, which iCloud syncs from
-- the iPhone to the Mac:
--
--   ~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Documents/
--     MTLibrary.sqlite      (tables ZMTPODCAST / ZMTEPISODE)
--
-- ⚠️  SOURCE RISK — READ THIS BEFORE TRUSTING THESE TABLES.
--   MTLibrary.sqlite is an UNDOCUMENTED, UNOFFICIAL, PRIVATE Apple CoreData store.
--   There is no published contract for it. Apple can rename a table, renumber
--   ZPLAYSTATE, or move the file in any macOS/Podcasts update, with no notice and
--   no deprecation window. The column semantics below were established EMPIRICALLY
--   on 2026-08-19 against a live store (Podcasts on macOS 25.5.0), not from docs.
--   Consequences that are designed for, not hoped away:
--     * the sync MUST open the source read-only (`file:<path>?mode=ro`) — the
--       Podcasts app holds it open and writes to it;
--     * these tables carry `source_*` provenance columns so a stale/half-broken
--       sync is visible in the data instead of silently rotting;
--     * `apple_play_state_raw` keeps Apple's ORIGINAL integer next to our
--       normalized token, so a future renumbering is diagnosable from the mirror
--       alone, without re-reading a store that may have already changed.
--
-- DESIGN DECISION 1 — SOURCE-DERIVED, NOT MD-FIRST.
--   Every other cockpit table mirrors markdown (md is canonical). These two do
--   NOT: their canonical source is an external application database, exactly like
--   `audiobooks` (Audible export → `scripts/sync-audible.sh`). Sander does not
--   hand-author 4.7k episode notes, and a mirror of somebody else's database is
--   not knowledge he owns — it is a feed. So:
--     * the regen (`scripts/regen-mypka-db.py`) does NOT own these tables. They
--       are absent from OWNED_TABLES and therefore PRESERVED across every regen,
--       the same way `audiobooks` is preserved today.
--     * a separate periodic sync (owned by Daedalus) upserts them from
--       MTLibrary.sqlite keyed on `guid` / `apple_pk`.
--   The `transcript_path` column is the bridge BACK to canonical markdown: it
--   points at a real file under PKM/, and that file stays the knowledge artifact.
--
-- DESIGN DECISION 2 — REGISTERED AS A LIBRARY ANYWAY.
--   `podcast_episodes` carries the full library-foundation invariant column set
--   (slug/title/status/tags/body/file_path/raw_frontmatter — DATA-CONTRACT §11.2)
--   and gets a `library_registry` row. That buys the generic, already-shipped read
--   surface for free: `/api/cockpit/libraries`, `/api/cockpit/library/:slug` and
--   `/api/cockpit/library/:slug/item/:itemSlug` in `server/libraryApi.js` are fully
--   data-driven off the registry and need ZERO new server code to serve podcasts.
--   (`audiobooks` chose the opposite — its own PK `asin`, its own endpoint family,
--   no registry row. That is the precedent we deliberately do NOT repeat: it cost
--   a bespoke API module for what the registry already generalizes.)
--
--   Consequence to know: `library_slug` MUST equal the mirror table name, because
--   libraryApi.js interpolates it as an identifier (guarded by SAFE_IDENT +
--   tableExists). So the registry slug — and hence the cockpit route — is
--   `#/podcast_episodes`, not `#/podcasts`. `podcasts` is the SHOW dimension table
--   and is intentionally NOT registered: it is a join target, not a browsable grid.
--
-- DESIGN DECISION 3 — `status` IS `play_state`, enforced by CHECK.
--   The library foundation mandates an invariant `status` column; for this library
--   the lifecycle token IS the listening state. Rather than let the two drift, the
--   table carries both names and a `CHECK (status IS play_state)` constraint that
--   makes the aliasing a database-enforced invariant instead of a convention a
--   sync script might forget. Write them from ONE source value, always.
--
-- DESIGN DECISION 4 — THE MANUAL OVERRIDE IS AN ANNOTATION LAYER, NOT A PATCH TO
--                     APPLE'S STATE (added 2026-08-19).
--   Sander consumes some shows (Dartpraat) partly through the Apple Podcasts app
--   and partly through YouTube. Apple's store therefore SYSTEMATICALLY under-
--   reports: an episode watched on YouTube stays `ZPLAYSTATE = 0` forever. The fix
--   is a hand-set "ook gezien via een ander platform" flag.
--
--   It is implemented with the SAME layering the Outer World already uses
--   (DATA-CONTRACT §14.1): an immutable SOURCE record with an Inner-World
--   ANNOTATION layer laid ON TOP of it, in the same row, in separately-named
--   columns. Concretely:
--     * `play_state` / `apple_play_state_raw` / `status` / `is_finished` /
--       `percent_complete` remain a PURE mirror of Apple. Nothing ever writes a
--       human decision into them. That keeps `apple_play_state_raw` honest as
--       provenance and keeps `CHECK (status IS play_state)` untouched.
--     * `manual_watched*` is the layer Sander owns. Like `tags` here and
--       `linked_*` on `podcasts`, the sync MUST NOT write or clear it on upsert.
--     * the OR of the two is computed ONCE, in the database, by the view
--       `v_podcast_episodes_effective` — never re-implemented per consumer.
--
--   BOOLEAN, not an enum, for the flag itself — deliberately:
--     * the override is MONOTONE by requirement: it may only ADD "gezien", never
--       remove it. A boolean has no value that can contradict Apple. A
--       `manual_play_state` enum would immediately admit `'unplayed'`, a state a
--       checkbox cannot express, and would force a precedence rule ("who wins when
--       Apple says played and the human says unplayed?") that the requirement
--       explicitly rules out. Do not model states you have already decided are
--       illegal.
--     * the control Sander asked for is literally one checkbox. One bit of truth,
--       one bit of storage.
--     * a future DOWNGRADING override ("Apple says played but it ran in the
--       background") is a different requirement and gets its own column. The
--       boolean does not block that; a prematurely-general enum would already have
--       baked in the wrong precedence.
--   ENUM for the PLATFORM, though: `manual_watched_platform` is a small
--   CHECK-constrained vocabulary rather than a `watched_on_youtube` boolean,
--   because WHERE he watched it is genuinely multi-valued and will grow. Hard-
--   coding YouTube costs a schema migration on the first Spotify episode.
--   Boolean for the fact, vocabulary for the dimension.
-- ============================================================================

-- ── podcasts — the SHOW dimension (one row per feed) ─────────────────────────
-- Source: ZMTPODCAST. One row per show Apple knows about, whether explicitly
-- followed or merely touched.
--   slug                  GL-001 kebab-case of the show title; the FK target that
--                         podcast_episodes.podcast_slug stores (GL-002 §4: foreign
--                         keys store the SLUG of the target, never the title).
--   apple_pk              ZMTPODCAST.Z_PK — the source row id. Provenance only;
--                         NOT stable across a Podcasts library rebuild, so it is
--                         never the upsert key. `feed_url` is.
--   apple_uuid            ZMTPODCAST.ZUUID — Apple's own stable-ish show uuid.
--   title                 ZTITLE. CAN BE NULL/empty in the source — verified: one
--                         row (Z_PK 17) has an empty title and zero episodes. The
--                         sync must tolerate that, not crash on it.
--   author                ZAUTHOR (publisher / host billing).                [display]
--   feed_url              ZFEEDURL — the RSS feed. THE UPSERT KEY: stable across
--                         library rebuilds and the only cross-source join handle
--                         (it is what an RSS enclosure match ultimately hangs off).
--   store_collection_id   ZSTORECOLLECTIONID — Apple Podcasts catalog id; lets a
--                         row be resolved via the public iTunes lookup API.
--   web_page_url          ZWEBPAGEURL — the show's own site.                 [display]
--   artwork_url           ZIMAGEURL (fall back to ZARTWORKTEMPLATEURL).      [display]
--   category              ZCATEGORY.                                          [facet]
--   is_subscribed         1 when ZSUBSCRIBED = 1 — an EXPLICIT follow.        [facet]
--   is_implicitly_followed 1 when ZISIMPLICITLYFOLLOWED = 1 — Apple created the
--                         row as a side effect (a single episode played, a share
--                         link opened) WITHOUT Sander following the show. Verified
--                         2026-08-19: 13 of 20 rows are subscribed, 7 are
--                         implicitly followed. Collapsing the two into one
--                         "subscriptions" number overstates the subscription list
--                         by 7, so they are kept as two honest flags.
--   episode_count         ZLIBRARYEPISODESCOUNT — Apple's own count for the show.
--   added_on              ISO date from ZADDEDDATE.
--   last_played_date      ISO datetime from ZLASTDATEPLAYED (NULL = never).   [sort]
--   linked_topics / linked_key_elements / linked_projects / linked_people
--                         JSON-array TEXT of myPKA slugs — the Capturing-Beast
--                         bucket lanes (same projection contract as `outer_world`).
--                         Hand-curated, NOT written by the sync: this is the one
--                         layer of the row Sander owns, so the sync must never
--                         clobber it on upsert.
--   source_synced_at      ISO datetime of the sync run that last wrote this row.
--   source_db_path        absolute path of the MTLibrary.sqlite that fed it.
CREATE TABLE IF NOT EXISTS podcasts (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL,
  apple_pk INTEGER,
  apple_uuid TEXT,
  title TEXT,
  author TEXT,
  feed_url TEXT,
  store_collection_id INTEGER,
  web_page_url TEXT,
  artwork_url TEXT,
  category TEXT,
  is_subscribed INTEGER DEFAULT 0,
  is_implicitly_followed INTEGER DEFAULT 0,
  episode_count INTEGER,
  added_on TEXT,
  last_played_date TEXT,
  linked_topics TEXT,
  linked_key_elements TEXT,
  linked_projects TEXT,
  linked_people TEXT,
  source_synced_at TEXT,
  source_db_path TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_podcasts_slug ON podcasts (slug);
-- feed_url is the upsert key. UNIQUE-but-nullable: SQLite treats every NULL as
-- distinct, so feed-less rows (an Apple stub) still insert instead of colliding.
CREATE UNIQUE INDEX IF NOT EXISTS idx_podcasts_feed_url ON podcasts (feed_url);

-- ── podcast_episodes — the EPISODE fact + the library mirror ─────────────────
-- Source: ZMTEPISODE. One row per episode Apple has in the local store.
--
--   ── library-foundation invariant columns (DATA-CONTRACT §11.2) ──
--   slug              URL/display key: slugify(show title) + '-' + slugify(episode
--                     title), truncated, '-2'/'-3' on collision. DERIVED and
--                     therefore NOT the identity key — `guid` is. Regenerating a
--                     slug is safe; regenerating a guid is not possible.
--   title             ZTITLE (fall back to ZITUNESTITLE, then ZCLEANEDTITLE).
--   status            the library lifecycle token == `play_state` (CHECK-enforced).
--   tags              JSON-array TEXT — hand-curated, never written by the sync.
--   body              ZITEMDESCRIPTIONWITHOUTHTML — the show-notes text. Populated
--                     on 4730 of 4732 source rows (verified 2026-08-19).
--   file_path         the canonical markdown file for this episode, when one
--                     exists. TODAY this is exactly `transcript_path` (the only
--                     markdown an episode has). Kept as its own column because the
--                     generic library viewer reads `file_path` by contract, and a
--                     future hand-written episode note would land here while
--                     `transcript_path` kept pointing at the raw transcript.
--   raw_frontmatter   NULL for source-derived rows (there is no frontmatter to
--                     mirror). Present so the row satisfies the §11.2 contract.
--
--   ── identity + source provenance ──
--   guid              ZGUID — the RSS <guid>. THE identity/upsert key: immutable
--                     per episode, populated on 4732/4732 rows (verified). UNIQUE.
--   apple_pk          ZMTEPISODE.Z_PK — provenance only, not an upsert key.
--   podcast_slug      FK → podcasts.slug (GL-002 §4: FKs store the target SLUG).
--   apple_podcast_pk  ZPODCAST — the raw FK, kept so a sync can re-derive the join
--                     without a title round-trip.
--   apple_podcast_uuid ZPODCASTUUID.
--   enclosure_url     ZENTITLEDENCLOSUREURL (fall back to ZENCLOSUREURL). The audio
--                     URL; the join handle against an RSS feed's <enclosure url>.
--                     Populated on 4732/4732 rows (verified).
--   web_page_url      ZWEBPAGEURL — episode page (4030/4732 populated).
--   artwork_url       ZARTWORKTEMPLATEURL (2131/4732 populated → often NULL; the
--                     client falls back to the show artwork, never renders a gap).
--
--   ── episode metadata ──
--   season_number     ZSEASONNUMBER. ONLY 986/4732 populated — do NOT treat a NULL
--                     as "season 1". For Dartpraat specifically the season/episode
--                     numbers live in the TITLE ("S03E27 - …") and the structured
--                     columns are NULL on some rows, which is exactly why the
--                     transcript matcher parses the title token rather than
--                     trusting these two columns.
--   episode_number    ZEPISODENUMBER (2865/4732 populated — same caveat).
--   episode_type      ZEPISODETYPE ('full' | 'trailer' | 'bonus').            [facet]
--   duration_seconds  ZDURATION (REAL seconds).
--   pubdate           ISO datetime from ZPUBDATE. Apple stores CoreData epoch
--                     (seconds since 2001-01-01), so the sync converts with
--                     datetime(ZPUBDATE + 978307200, 'unixepoch'). Storing the
--                     CONVERTED ISO string, never the raw offset — a raw CoreData
--                     float in a mirror is a foot-gun for every downstream query.
--
--   ── listening state ──
--   play_state        NORMALIZED token, never Apple's raw integer:
--                       'unplayed'    ← ZPLAYSTATE 0
--                       'in-progress' ← ZPLAYSTATE 1
--                       'played'      ← ZPLAYSTATE 2
--                     Verified distribution 2026-08-19: 4665 / 46 / 21.
--   apple_play_state_raw  ZPLAYSTATE verbatim (0/1/2). Provenance: if Apple ever
--                     adds a state 3 or renumbers, the mirror shows it instead of
--                     silently normalizing it into a lie.
--   playhead_seconds  ZPLAYHEAD (REAL seconds). NOTE the verified quirk: a FULLY
--                     played episode usually has playhead 0.0 (Apple resets it on
--                     completion), so playhead alone must never be read as
--                     progress — see percent_complete.
--   percent_complete  REAL 0..100, computed by the sync from play_state, NOT from
--                     playhead alone:
--                       'played'      → 100.0
--                       'in-progress' → round(playhead/duration*100, 1), or NULL
--                                       when duration is NULL/0
--                       'unplayed'    → 0.0
--   is_finished       INTEGER 0/1, 1 when play_state = 'played'. (Deliberately
--                     INTEGER, not the TEXT 'True'/'False' that `audiobooks`
--                     inherited from the Audible TSV and that audiobooksApi.js has
--                     to defensively coerce on every read.)
--   play_count        ZPLAYCOUNT.
--   last_played_date  ISO datetime from ZLASTDATEPLAYED. ONLY 77/4732 rows carry
--                     one — it is a sparse signal, good for "recently listened"
--                     but useless as a primary sort for the full grid.
--   is_saved / is_bookmarked / is_downloaded  ZSAVED / ZISBOOKMARKED /
--                     (ZDOWNLOADPATH IS NOT NULL) as 0/1.                     [facet]
--
--   ── Inner-World ANNOTATION layer — HAND-OWNED, THE SYNC NEVER WRITES THESE ──
--   (Design decision 4 above. Same posture as `tags` here and `linked_*` on
--   `podcasts`: Daedalus's upsert lists source columns only, so a re-sync can
--   never clobber a decision Sander made.)
--   manual_watched    INTEGER 0/1, NOT NULL DEFAULT 0. Sander's "ook gezien via
--                     een ander platform" tick. MONOTONE: it can only ever ADD
--                     "gezien" on top of Apple's state, never take it away — see
--                     the view below. When Apple already says 'played' the tick is
--                     a harmless no-op, exactly as intended.
--   manual_watched_platform  WHERE he watched it. Closed vocabulary
--                     'youtube' | 'spotify' | 'web' | 'other', NULL when the tick
--                     is off. Extending the list is a one-line CHECK edit here
--                     plus the same line in install-extensions.py.
--   manual_watched_at ISO-8601 UTC datetime the tick was SET. NULL when off.
--                     CHECK-bound both ways to `manual_watched`, so a tick always
--                     carries a timestamp and an untick always clears it. That
--                     makes "untick" ONE statement that nulls all three columns —
--                     a partial untick fails loudly instead of leaving a ghost
--                     platform on an unticked row.
--
--   ── the bridge back to canonical markdown ──
--   transcript_path   root-relative path of an existing transcript under
--                     PKM/Documents/YouTube-Kennis/<Channel>/, or NULL. NULLABLE BY
--                     DESIGN: most episodes have no transcript and never will.
--   transcript_match_method  HOW the link was established — the match is an
--                     INFERENCE and is stored as one, never as a bare fact.
--                     The vocabulary IS the matcher's tier list in
--                     `scripts/lib/podcast_transcript_match.py`; the two must be
--                     kept in lockstep (see the note under the CHECK below):
--                       'season_episode'         SxxEyy token equal on both sides
--                       'episode_ordinal'        bare episode ordinal equal on both
--                                                sides ("Dartpraat 33" vs
--                                                "Aflevering 33"), accepted only
--                                                when corroborated by pubdate or
--                                                token overlap
--                       'normalized_title_exact' normalized titles equal
--                       'fuzzy_title'            similarity above threshold
--                       'manual'                 a human asserted it
--                     NULL when transcript_path is NULL.
--   transcript_match_score   REAL 0..1 confidence for that method. 1.0 for
--                     season_episode and manual; 0.90 for episode_ordinal; the
--                     similarity ratio for fuzzy.
--                     A UI that shows a transcript link SHOULD show anything below
--                     0.95 as "probable match", not as a certainty.
--   transcript_matched_at    ISO datetime the match was last computed.
--
--   source_synced_at / source_db_path  same provenance contract as `podcasts`.
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id INTEGER PRIMARY KEY,
  -- library-foundation invariants
  slug TEXT NOT NULL,
  title TEXT,
  status TEXT,
  tags TEXT,
  body TEXT,
  file_path TEXT,
  raw_frontmatter TEXT,
  -- identity + provenance
  guid TEXT NOT NULL,
  apple_pk INTEGER,
  podcast_slug TEXT,
  apple_podcast_pk INTEGER,
  apple_podcast_uuid TEXT,
  enclosure_url TEXT,
  web_page_url TEXT,
  artwork_url TEXT,
  -- episode metadata
  season_number INTEGER,
  episode_number INTEGER,
  episode_type TEXT,
  duration_seconds REAL,
  pubdate TEXT,
  -- listening state
  play_state TEXT,
  apple_play_state_raw INTEGER,
  playhead_seconds REAL,
  percent_complete REAL,
  is_finished INTEGER DEFAULT 0,
  play_count INTEGER,
  last_played_date TEXT,
  is_saved INTEGER DEFAULT 0,
  is_bookmarked INTEGER DEFAULT 0,
  is_downloaded INTEGER DEFAULT 0,
  -- Inner-World annotation layer (hand-owned; never written by the sync).
  -- The CHECKs are written as COLUMN constraints, not table constraints, on
  -- purpose: `ALTER TABLE ADD COLUMN` can carry a column-level CHECK but cannot
  -- add a table-level one. Keeping them here means an EXISTING installation gets
  -- byte-identical constraints from the ALTER upgrade path as a fresh install
  -- does from this CREATE. Verified on SQLite 2026-08-19.
  manual_watched INTEGER NOT NULL DEFAULT 0
    CHECK (manual_watched IN (0, 1)),
  manual_watched_platform TEXT
    CHECK (manual_watched_platform IS NULL OR manual_watched = 1)
    CHECK (manual_watched_platform IS NULL OR manual_watched_platform IN
           ('youtube', 'spotify', 'web', 'other')),
  manual_watched_at TEXT
    CHECK ((manual_watched = 1) = (manual_watched_at IS NOT NULL)),
  -- transcript bridge
  transcript_path TEXT,
  transcript_match_method TEXT,
  transcript_match_score REAL,
  transcript_matched_at TEXT,
  -- sync provenance
  source_synced_at TEXT,
  source_db_path TEXT,
  -- The library-foundation `status` IS this library's play_state. Enforced here so
  -- the aliasing cannot drift: `IS` (not `=`) so NULL/NULL passes.
  CHECK (status IS play_state),
  -- Closed vocabulary. A future Apple state lands in apple_play_state_raw and
  -- fails LOUDLY here rather than entering the mirror as an unknown token.
  CHECK (play_state IS NULL OR play_state IN ('unplayed', 'in-progress', 'played')),
  -- Closed vocabulary, and it MUST list every method the matcher can emit.
  -- ⚠️  BUG HISTORY (fixed 2026-08-19): 'episode_ordinal' was missing here while
  --   podcast_transcript_match.py had been emitting it since day one (tier 2, 14
  --   of 67 Dartpraat matches). Because apply_matches() writes all links in ONE
  --   transaction, a single rejected row raised IntegrityError and rolled back
  --   ALL of them — so `transcript_path` stayed NULL on every one of the 2968
  --   live rows while the matcher's own report kept saying 67/67. A too-narrow
  --   CHECK does not fail on the rows it rejects; it fails on the whole batch.
  --   Lesson to carry forward: when a writer's vocabulary lives in code, this
  --   list is a COPY of it. Extend both in the same change, or don't extend.
  CHECK (transcript_match_method IS NULL OR transcript_match_method IN
         ('season_episode', 'episode_ordinal', 'normalized_title_exact',
          'fuzzy_title', 'manual'))
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
-- guid is the upsert key of a ~5k-row table synced on a schedule: it earns a
-- UNIQUE index outright (it is both the identity constraint and the hot lookup).
CREATE UNIQUE INDEX IF NOT EXISTS idx_podcast_episodes_guid ON podcast_episodes (guid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_podcast_episodes_slug ON podcast_episodes (slug);
-- The three measured hot paths of the dashboard's actual questions:
--   "what did I listen to" (play_state), "…for this show" (podcast_slug),
--   "…most recently" (last_played_date DESC).
-- This table is ~5k rows and GROWING with every sync — an order of magnitude
-- above the tens-to-hundreds the library foundation assumed when it argued
-- against per-axis indexes (07-library-foundation.sql, closing note). That
-- argument does not transfer here, so these three are added deliberately, not
-- reflexively.
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_play_state ON podcast_episodes (play_state);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_podcast_slug ON podcast_episodes (podcast_slug);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_last_played ON podcast_episodes (last_played_date);
-- Partial index: "episodes that have a transcript" is the dashboard's headline
-- join and matches a low-single-digit % of rows.
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_transcript
  ON podcast_episodes (transcript_path) WHERE transcript_path IS NOT NULL;
-- Partial index, same reasoning as the transcript one: the manual tick is set on a
-- handful of rows out of ~4700, so "which episodes did Sander hand-mark" is a
-- tiny, highly-selective slice. A full index on a column that is 0 on >99% of rows
-- would be dead weight; the partial index is ~the size of the answer.
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_manual_watched
  ON podcast_episodes (manual_watched) WHERE manual_watched = 1;

-- ── v_podcast_episodes_effective — THE one place the OR is computed ──────────
-- Requirement (Sander, 2026-08-19): the displayed status is Apple's state OR the
-- manual tick, and the tick may NEVER work against Apple — if Apple already says
-- 'played', the tick changes nothing.
--
-- Why a VIEW and not a stored column: the effective status is a pure function of
-- two stored facts. Storing it would create a third copy that can go stale the
-- moment either input changes (a re-sync flipping play_state, a tick flipping
-- manual_watched) and would need trigger machinery to stay honest. A view is
-- always correct by construction, costs nothing at rest, and gives every consumer
-- — podcastsApi.js, an ad-hoc `sqlite3 mypka.db` query, a future export — the
-- SAME answer. Do not re-implement this CASE in JavaScript.
--
-- `SELECT e.*` is deliberate: SQLite stores the view's SQL text and re-expands the
-- star at prepare time, so any column a later sync version adds to the table flows
-- into the view automatically with no view migration. Verified 2026-08-19.
--
-- Regen posture: the regen owns only the views in its OWNED_VIEWS list. This one is
-- absent from it, so it is PRESERVED across every regen — same as the tables.
--
-- Truth table (verified against a scratch db, 2026-08-19):
--   play_state    manual_watched | effective_play_state  is_finished  watch_source
--   'unplayed'    1              | 'played'              1            'manual'
--   'played'      1              | 'played'              1            'both'
--   'in-progress' 1              | 'played'              1            'manual'
--   'in-progress' 0              | 'in-progress'         0            NULL
--   NULL          0              | NULL                  0            NULL
CREATE VIEW IF NOT EXISTS v_podcast_episodes_effective AS
SELECT
  e.*,
  -- The displayed listening state. Apple wins when it already says 'played'
  -- (the tick is then a no-op); otherwise the tick promotes the row to 'played';
  -- otherwise Apple's token passes through unchanged, NULL included.
  CASE
    WHEN e.play_state = 'played' THEN 'played'
    WHEN e.manual_watched = 1    THEN 'played'
    ELSE e.play_state
  END AS effective_play_state,
  -- The 0/1 the UI filters and counts on. Same shape as `is_finished`, which stays
  -- a pure Apple mirror — read THIS one anywhere a human-visible "gezien" is meant.
  CASE
    WHEN e.play_state = 'played' OR e.manual_watched = 1 THEN 1
    ELSE 0
  END AS effective_is_finished,
  -- WHY it counts as watched, so the UI can badge it honestly ("ook via YouTube")
  -- instead of silently presenting a hand-set flag as Apple telemetry.
  -- NULL when the episode is not watched at all.
  CASE
    WHEN e.play_state = 'played' AND e.manual_watched = 1 THEN 'both'
    WHEN e.play_state = 'played'                          THEN 'apple'
    WHEN e.manual_watched = 1                             THEN 'manual'
    ELSE NULL
  END AS effective_watch_source,
  -- A manually-ticked episode reads as 100% complete; Apple's own number is left
  -- untouched in `percent_complete` for anyone auditing the mirror.
  CASE
    WHEN e.play_state = 'played' THEN e.percent_complete
    WHEN e.manual_watched = 1    THEN 100.0
    ELSE e.percent_complete
  END AS effective_percent_complete
FROM podcast_episodes e;

-- ── library_registry row ─────────────────────────────────────────────────────
-- Makes the library appear in the cockpit's data-driven Library nav with no UI
-- change. `pkm_folder` names the transcript folder rather than a folder of
-- episode notes, because that IS the only PKM-side folder this library touches;
-- `doc_type` is NULL because these rows are not mirrored from markdown and no
-- frontmatter discriminator applies.
--
-- ⚠️  REGEN INTERACTION — the reason this INSERT is guarded:
--   `library_registry` IS in the regen's OWNED_TABLES, so it is DROPPED and
--   REBUILT on every `regen-mypka-db.py` run from the md-first LIBRARIES config.
--   A row inserted only here would silently vanish on the next regen. The durable
--   registration therefore ALSO lives in the regen's EXTERNAL_LIBRARIES block,
--   which re-seeds registry rows for source-derived libraries whose TABLES the
--   regen does not own. This statement is the non-regen path (bare install);
--   the regen block is the one that survives.
INSERT INTO library_registry (library_slug, nav_label, nav_icon, pkm_folder,
                              doc_type, title_field, sort_order)
SELECT 'podcast_episodes', 'Podcasts', 'Podcast',
       'PKM/Documents/YouTube-Kennis', NULL, 'title', 30
WHERE NOT EXISTS (
  SELECT 1 FROM library_registry WHERE library_slug = 'podcast_episodes'
);
