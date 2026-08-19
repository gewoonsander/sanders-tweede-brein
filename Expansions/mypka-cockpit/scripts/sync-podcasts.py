#!/usr/bin/env python3
"""sync-podcasts.py — mirror Apple Podcasts listening state into mypka.db.

WHAT THIS DOES
  Reads Apple Podcasts' local CoreData store (which iCloud fills from the
  iPhone) READ-ONLY and upserts it into the cockpit's `podcasts` +
  `podcast_episodes` tables. Schema + column contract: Atlas, in
  `sqlite-extension/schema/09-module-podcasts.sql` and DATA-CONTRACT §18.

      ~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/
        Documents/MTLibrary.sqlite      (tables ZMTPODCAST / ZMTEPISODE)

  Identity keys: `podcast_episodes.guid` (= ZGUID) and `podcasts.feed_url`
  (= ZFEEDURL). Never a derived field, never Apple's Z_PK — a Podcasts library
  rebuild renumbers Z_PK.

SCOPE — SUBSCRIBED SHOWS ONLY (2026-08-19, Sander's decision)
  The mirror holds ONLY shows with `ZSUBSCRIBED = 1`. Apple also creates show
  rows as a side effect — play one episode from a share link and the show is
  written with `ZISIMPLICITLYFOLLOWED = 1` and `ZSUBSCRIBED = 0`. Those are not
  a follow list, they are a play-history artefact: on 2026-08-19 they were 7 of
  20 shows and 1764 of 4732 episodes, and Sander recognised none of them.

  So `ZSUBSCRIBED` is the single scope test, applied at READ time:
    * a show with ZSUBSCRIBED = 0 is never read, never inserted, never updated,
      and its episodes are skipped whatever their own state;
    * `ZISIMPLICITLYFOLLOWED` is still MIRRORED for the shows that pass, as
      provenance — it is simply not a membership criterion;
    * because the test runs every tick against live source rows, both directions
      self-heal with no bookkeeping: Apple flipping one of those 7 to
      ZSUBSCRIBED = 1 makes it appear at the next sync, and Sander unfollowing a
      show makes it disappear at the next sync (see PRUNE).

⚠️  SOURCE RISK — READ BEFORE TRUSTING THE OUTPUT
  MTLibrary.sqlite is an UNDOCUMENTED, UNOFFICIAL, PRIVATE Apple CoreData store.
  There is no published contract for it. A macOS or Podcasts update can rename a
  table, drop a column, renumber ZPLAYSTATE, or move the file entirely — with no
  notice and no deprecation window. Every column semantic this script relies on
  was established EMPIRICALLY on 2026-08-19 against a live store, not from
  documentation.

  This script is therefore built to FAIL LOUDLY AND WRITE NOTHING rather than
  degrade quietly. Concretely, it aborts before opening a write transaction when:
    * the source file is missing or unreadable                      → exit 3
    * ZMTPODCAST / ZMTEPISODE is absent                             → exit 4
    * any column it reads is absent (each missing name is printed)  → exit 4
    * the source holds ZERO episodes                                → exit 5
      (this is the normal state during a fresh iCloud sync — the first full sync
       took ~20 minutes on 2026-08-19. An empty source is NOT a reason to empty
       the mirror.)
    * the source holds shows but ZERO of them is ZSUBSCRIBED = 1    → exit 7
      (Sander's library cannot be in that state, so the flag's meaning has
       probably changed. Aborting here is what stops a semantics change in one
       undocumented column from pruning the entire mirror.)

PRUNE — the ONE case in which a mirror row is deleted
  Within a subscribed show the old guarantee is unchanged: an episode Apple has
  pruned keeps its row, keeps Sander's annotations, and simply stops getting a
  fresh `source_synced_at`, so staleness is visible in the data instead of
  silent. Nothing is deleted because it aged out.

  A row is deleted ONLY when its SHOW has left the subscribed set — i.e. it no
  longer matches any ZSUBSCRIBED = 1 source row by `feed_url` or `apple_uuid`.
  Without that, an unfollow would leave the show in the cockpit forever, since
  no UPDATE can express "this should no longer exist".

  Three rails keep that from becoming a data-loss mechanism:
    1. the exit-7 abort above (never prune against a zero-subscription read);
    2. rows carrying HAND-OWNED data are never deleted — a show with any
       `linked_*`, or an episode with `manual_watched = 1`, `tags`, `file_path`,
       `raw_frontmatter` or `transcript_path`. Such a show is kept whole,
       episodes included, and reported. DELETE would clobber a Sander decision
       far more thoroughly than the UPDATE statements already refuse to;
    3. the prune is SKIPPED whenever the source-shrink warning fires (source
       episodes < half the mirror's) — that signature means a library rebuild or
       a half-finished iCloud sync, and a prune against a half-loaded source
       would delete shows that are merely not back yet.
  `--no-prune` disables it outright.

WHAT IT WILL NEVER WRITE (the hand-owned annotation layer — DATA-CONTRACT §18.9)
  podcast_episodes : tags, file_path, raw_frontmatter,
                     manual_watched, manual_watched_platform, manual_watched_at,
                     transcript_path, transcript_match_method,
                     transcript_match_score, transcript_matched_at,
                     and `slug` on an EXISTING row (see SLUG STABILITY below)
  podcasts         : linked_topics, linked_key_elements, linked_projects,
                     linked_people, and `slug` on an existing row
  Those columns are absent from every UPDATE statement in this file. A re-sync
  can therefore never clobber a decision Sander made, and `file_path` /
  `transcript_*` stay the property of `lib/podcast_transcript_match.py`.

SLUG STABILITY
  `slug` is the cockpit's route key but is DERIVED, so it is minted ONCE, on
  insert, and then frozen. Re-deriving it every run would silently move an
  episode's URL whenever Apple edited a title, and the '-2'/'-3' collision
  suffix would depend on row order. The one exception is a show whose title was
  NULL at first sight (verified: Z_PK 17 has no title at all): it gets a
  synthetic `apple-podcast-<storeId>` slug, and if Apple later supplies the real
  title the slug is upgraded ONCE and the rename is cascaded to
  `podcast_episodes.podcast_slug` inside the same transaction.

USAGE
  python3 Expansions/mypka-cockpit/scripts/sync-podcasts.py [options]

    --dry-run          read + diff + report, open no write transaction
    --no-prune         keep shows that have left the subscribed set (see PRUNE)
    --regen            run regen-mypka-db.py afterwards, but ONLY when this sync
                       actually changed something (see REGEN below)
    --regen-always     run the regen unconditionally
    --json             emit the run summary as a single JSON line (launchd mode)
    --quiet            suppress the human-readable report
    --db PATH          override mypka.db          (env: MYPKA_DB)
    --source PATH      override MTLibrary.sqlite  (env: PODCASTS_DB)

REGEN
  `regen-mypka-db.py` does NOT own these two tables — it preserves them
  (DATA-CONTRACT §18.2). The only reason to run it after a sync is to re-seed the
  `library_registry` row, which IS regen-owned. So the regen is deliberately
  CONDITIONAL on this sync having changed something: it drops and rebuilds every
  owned table via `executescript`, which implicitly commits and therefore has a
  window in which those tables do not exist. Firing that window every 45 minutes
  for a library that did not change would hand the running cockpit a periodic
  chance to 500 for no benefit. `--regen-always` is the escape hatch.

CONCURRENCY
  A non-blocking flock guards against two runs overlapping (a slow iCloud read
  plus a 45-minute timer). A second run finds the lock held, logs it, and exits 0
  — a skipped tick is correct behavior, not an error.

EXIT CODES
  0 ok (including "nothing to do" and "lock held")   3 source db missing
  2 mirror db / tables missing                       4 source schema mismatch
  6 write failed (rolled back)                       5 source empty
  7 source has shows but no subscriptions
"""
from __future__ import annotations

import argparse
import fcntl
import json
import os
import sqlite3
import subprocess
import sys
import unicodedata
import re
from datetime import datetime, timezone
from pathlib import Path

# ── repo layout ──────────────────────────────────────────────────────────────
# scripts/<this file> → Expansions/mypka-cockpit/scripts → repo root is 3 up.
ROOT = Path(os.environ.get("MYPKA_ROOT")
            or Path(__file__).resolve().parents[3])
DB_PATH = Path(os.environ.get("MYPKA_DB") or (ROOT / "mypka.db"))
APPLE_DB = Path(os.environ.get("PODCASTS_DB") or (
    Path.home() / "Library/Group Containers"
    / "243LU875E5.groups.com.apple.podcasts/Documents/MTLibrary.sqlite"))
REGEN = Path(__file__).resolve().parent / "regen-mypka-db.py"
LOCK_PATH = Path.home() / "Library/Caches/nl.gewoonsander.podcast-sync.lock"

# Seconds between the Unix epoch (1970-01-01) and the CoreData reference date
# (2001-01-01 UTC). Apple stores every timestamp in this table as a float offset
# from the latter.
COREDATA_EPOCH_OFFSET = 978307200

# Apple's ZPLAYSTATE → the closed vocabulary the schema CHECK enforces.
# Verified distribution 2026-08-19: 0 → 4665, 1 → 46, 2 → 21.
PLAY_STATE = {0: "unplayed", 1: "in-progress", 2: "played"}

# Source columns this script READS. Listed explicitly so a Podcasts update that
# drops one is caught by the preflight with the column named, instead of
# surfacing as an OperationalError halfway through a write transaction.
REQUIRED_SHOW_COLUMNS = [
    "Z_PK", "ZUUID", "ZTITLE", "ZAUTHOR", "ZFEEDURL", "ZSTORECOLLECTIONID",
    "ZWEBPAGEURL", "ZIMAGEURL", "ZARTWORKTEMPLATEURL", "ZCATEGORY",
    "ZSUBSCRIBED", "ZISIMPLICITLYFOLLOWED", "ZLIBRARYEPISODESCOUNT",
    "ZADDEDDATE", "ZLASTDATEPLAYED",
]
REQUIRED_EPISODE_COLUMNS = [
    "Z_PK", "ZGUID", "ZPODCAST", "ZPODCASTUUID", "ZTITLE", "ZITUNESTITLE",
    "ZCLEANEDTITLE", "ZITEMDESCRIPTIONWITHOUTHTML", "ZENTITLEDENCLOSUREURL",
    "ZENCLOSUREURL", "ZWEBPAGEURL", "ZARTWORKTEMPLATEURL", "ZSEASONNUMBER",
    "ZEPISODENUMBER", "ZEPISODETYPE", "ZDURATION", "ZPUBDATE", "ZPLAYSTATE",
    "ZPLAYHEAD", "ZPLAYCOUNT", "ZLASTDATEPLAYED", "ZSAVED", "ZISBOOKMARKED",
    "ZDOWNLOADPATH",
]

# ── the mirror column contract ───────────────────────────────────────────────
# ONE ordered list per table, reused by the INSERT, the UPDATE and the diff, so
# the three can never drift apart. `slug` is handled separately (insert-only).
# Anything absent from these lists is, by construction, never written.
SHOW_COLUMNS = [
    "apple_pk", "apple_uuid", "title", "author", "feed_url",
    "store_collection_id", "web_page_url", "artwork_url", "category",
    "is_subscribed", "is_implicitly_followed", "episode_count", "added_on",
    "last_played_date",
]
EPISODE_COLUMNS = [
    "title", "status", "body", "apple_pk", "podcast_slug", "apple_podcast_pk",
    "apple_podcast_uuid", "enclosure_url", "web_page_url", "artwork_url",
    "season_number", "episode_number", "episode_type", "duration_seconds",
    "pubdate", "play_state", "apple_play_state_raw", "playhead_seconds",
    "percent_complete", "is_finished", "play_count", "last_played_date",
    "is_saved", "is_bookmarked", "is_downloaded",
]

MAX_SLUG = 100

# The hand-owned annotation layer (DATA-CONTRACT §18.9). No UPDATE in this file
# touches these; the PRUNE additionally refuses to DELETE any row that carries
# one. Expressed as SQL predicates rather than a plain name list because "has a
# value" differs per column — `manual_watched` is NOT NULL DEFAULT 0, so an
# `IS NOT NULL` test on it matches every row in the table and would silently
# protect the entire mirror from ever being pruned.
EPISODE_PROTECTED_PREDICATES = {
    "manual_watched": "manual_watched = 1",
    "manual_watched_at": "manual_watched_at IS NOT NULL",
    "tags": "(tags IS NOT NULL AND TRIM(tags) NOT IN ('', '[]'))",
    "file_path": "file_path IS NOT NULL",
    "raw_frontmatter": "raw_frontmatter IS NOT NULL",
    "transcript_path": "transcript_path IS NOT NULL",
}
SHOW_PROTECTED_PREDICATES = {
    "linked_topics": "linked_topics IS NOT NULL",
    "linked_key_elements": "linked_key_elements IS NOT NULL",
    "linked_projects": "linked_projects IS NOT NULL",
    "linked_people": "linked_people IS NOT NULL",
}


# ── helpers ──────────────────────────────────────────────────────────────────
def slugify(text, max_len=80):
    """GL-001 slug: lowercase ASCII kebab-case, no underscores, no doubles.

    Byte-identical to `lib/podcast_transcript_match.py::slugify`; duplicated
    rather than imported so this script has no import-time dependency on the
    matcher (they are deployed and run independently).
    """
    if not text:
        return ""
    s = unicodedata.normalize("NFKD", str(text))
    s = s.encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    if max_len and len(s) > max_len:
        s = s[:max_len].rstrip("-")
    return s


def coredata_to_iso(value, date_only=False):
    """CoreData offset → ISO-8601 UTC string, or None.

    NULL and non-positive offsets both mean "no date": Apple writes 0.0 rather
    than NULL on some never-played rows, and 2001-01-01 is not a real play date.
    Emitted as `YYYY-MM-DDTHH:MM:SSZ` so it sorts lexicographically alongside
    `manual_watched_at` / `transcript_matched_at`, which use the same shape —
    DATA-CONTRACT §18.9's read query ORDERs by a COALESCE across all three.
    """
    if value is None:
        return None
    try:
        offset = float(value)
    except (TypeError, ValueError):
        return None
    if offset <= 0:
        return None
    try:
        dt = datetime.fromtimestamp(offset + COREDATA_EPOCH_OFFSET, tz=timezone.utc)
    except (OverflowError, OSError, ValueError):
        return None
    return dt.strftime("%Y-%m-%d") if date_only else dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def unique_slug(base, taken, fallback):
    """`base`, else `base-2`, `base-3`, … — matching the §18 slug contract."""
    base = (base or "")[:MAX_SLUG].rstrip("-") or fallback
    if base not in taken:
        taken.add(base)
        return base
    n = 2
    while True:
        candidate = "{}-{}".format(base[:MAX_SLUG - len(str(n)) - 1].rstrip("-"), n)
        if candidate not in taken:
            taken.add(candidate)
            return candidate
        n += 1


def synthetic_show_slug(store_id, feed_url, apple_pk):
    """Stable slug for a show Apple gave us no title for (verified: Z_PK 17).

    Derived from the store id first because it is short, stable and resolvable
    via the public iTunes lookup API; then the feed URL, which is the row's
    upsert key and therefore stable by definition; the source Z_PK is the last
    resort and is explicitly NOT stable across a library rebuild.
    """
    if store_id:
        return "apple-podcast-{}".format(store_id)
    if feed_url:
        return "apple-podcast-{}".format(slugify(feed_url, max_len=60)) or None
    return "apple-podcast-pk-{}".format(apple_pk)


def protected_predicate(con, table, predicates):
    """OR of the predicates whose column actually exists in this mirror.

    The override layer of §18.9 is an optional extension: a fase-1 mirror has
    no `manual_watched`. Probing the live schema keeps the prune's safety rail
    working on both, instead of raising OperationalError on the older one.
    Returns None when the table carries none of the columns — i.e. nothing to
    protect, not "protect everything".
    """
    have = {r[1] for r in con.execute("PRAGMA table_info({})".format(table))}
    clauses = [sql for col, sql in predicates.items() if col in have]
    return " OR ".join(clauses) if clauses else None


def log(payload, as_json, quiet=False):
    if as_json:
        print(json.dumps(payload, ensure_ascii=False), flush=True)
    elif not quiet:
        print(payload.get("message", json.dumps(payload, ensure_ascii=False)),
              flush=True)


def die(code, message, as_json):
    """Abort before any write. The message names the cause, not a symptom."""
    payload = {"service": "podcast-sync", "event": "abort",
               "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
               "exit_code": code, "message": message}
    if as_json:
        print(json.dumps(payload, ensure_ascii=False), flush=True)
    print("podcast-sync: {}".format(message), file=sys.stderr, flush=True)
    sys.exit(code)


# ── source reading ───────────────────────────────────────────────────────────
def open_source(path, as_json):
    """Open MTLibrary.sqlite READ-ONLY. Non-negotiable: the Podcasts app holds
    this file open and writes to it (a -wal and a -shm sit next to it right
    now). `mode=ro` makes a write physically impossible rather than merely
    unintended."""
    if not path.is_file():
        die(3, "source database not found at {} — Apple Podcasts may never have "
               "run on this Mac, or the path moved in a macOS update. "
               "Nothing written.".format(path), as_json)
    try:
        con = sqlite3.connect("file:{}?mode=ro".format(path), uri=True)
    except sqlite3.Error as exc:
        die(3, "cannot open source read-only ({}): {}. Nothing written."
               .format(path, exc), as_json)
    con.row_factory = sqlite3.Row
    return con


def preflight_source(con, as_json):
    tables = {r[0] for r in con.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table'")}
    for t in ("ZMTPODCAST", "ZMTEPISODE"):
        if t not in tables:
            die(4, "source table {} is absent — Apple's undocumented schema has "
                   "changed. Nothing written; re-derive the column map before "
                   "re-enabling the sync.".format(t), as_json)
    for table, required in (("ZMTPODCAST", REQUIRED_SHOW_COLUMNS),
                            ("ZMTEPISODE", REQUIRED_EPISODE_COLUMNS)):
        have = {r[1] for r in con.execute("PRAGMA table_info({})".format(table))}
        missing = [c for c in required if c not in have]
        if missing:
            die(4, "source table {} is missing column(s): {} — Apple's "
                   "undocumented schema has changed. Nothing written."
                   .format(table, ", ".join(missing)), as_json)


def read_shows(con):
    return list(con.execute(
        "SELECT Z_PK, ZUUID, ZTITLE, ZAUTHOR, ZFEEDURL, ZSTORECOLLECTIONID,"
        "       ZWEBPAGEURL, ZIMAGEURL, ZARTWORKTEMPLATEURL, ZCATEGORY,"
        "       ZSUBSCRIBED, ZISIMPLICITLYFOLLOWED, ZLIBRARYEPISODESCOUNT,"
        "       ZADDEDDATE, ZLASTDATEPLAYED"
        "  FROM ZMTPODCAST"))


def read_episodes(con):
    return list(con.execute(
        "SELECT Z_PK, ZGUID, ZPODCAST, ZPODCASTUUID, ZTITLE, ZITUNESTITLE,"
        "       ZCLEANEDTITLE, ZITEMDESCRIPTIONWITHOUTHTML,"
        "       ZENTITLEDENCLOSUREURL, ZENCLOSUREURL, ZWEBPAGEURL,"
        "       ZARTWORKTEMPLATEURL, ZSEASONNUMBER, ZEPISODENUMBER,"
        "       ZEPISODETYPE, ZDURATION, ZPUBDATE, ZPLAYSTATE, ZPLAYHEAD,"
        "       ZPLAYCOUNT, ZLASTDATEPLAYED, ZSAVED, ZISBOOKMARKED,"
        "       ZDOWNLOADPATH"
        "  FROM ZMTEPISODE"
        " WHERE ZGUID IS NOT NULL AND ZGUID <> ''"))


# ── row mapping ──────────────────────────────────────────────────────────────
def map_show(row, now, source_path):
    """ZMTPODCAST row → the `podcasts` value dict (slug handled by the caller)."""
    return {
        "apple_pk": row["Z_PK"],
        "apple_uuid": row["ZUUID"],
        "title": row["ZTITLE"],
        "author": row["ZAUTHOR"],
        "feed_url": row["ZFEEDURL"],
        "store_collection_id": row["ZSTORECOLLECTIONID"],
        "web_page_url": row["ZWEBPAGEURL"],
        # ZIMAGEURL is the concrete artwork; ZARTWORKTEMPLATEURL is the
        # size-templated variant Apple falls back to on rows without one.
        "artwork_url": row["ZIMAGEURL"] or row["ZARTWORKTEMPLATEURL"],
        "category": row["ZCATEGORY"],
        # Always 1 by construction — only ZSUBSCRIBED = 1 rows reach this
        # function (see SCOPE). Written from the source anyway rather than
        # hardcoded, so the column keeps meaning "what Apple said", and a future
        # widening of the scope needs no change here.
        "is_subscribed": 1 if row["ZSUBSCRIBED"] else 0,
        # Provenance only, NOT a membership criterion. A genuinely subscribed
        # show can also carry the implicit flag (Apple sets it when an episode
        # was played before the subscribe). The 7 rows that had ONLY this flag
        # set on 2026-08-19 are exactly what the scope filter now excludes.
        "is_implicitly_followed": 1 if row["ZISIMPLICITLYFOLLOWED"] else 0,
        "episode_count": row["ZLIBRARYEPISODESCOUNT"],
        "added_on": coredata_to_iso(row["ZADDEDDATE"], date_only=True),
        "last_played_date": coredata_to_iso(row["ZLASTDATEPLAYED"]),
    }


def map_episode(row, podcast_slug, now, source_path):
    """ZMTEPISODE row → the `podcast_episodes` value dict (slug is caller's)."""
    raw_state = row["ZPLAYSTATE"]
    # An unmapped integer stays NULL rather than being guessed into the closed
    # vocabulary — the raw value survives in apple_play_state_raw, which is
    # exactly what that provenance column is for if Apple ever renumbers.
    play_state = PLAY_STATE.get(raw_state)
    duration = row["ZDURATION"]
    playhead = row["ZPLAYHEAD"]

    # percent_complete is computed from play_state, NOT from playhead: a fully
    # played episode usually has playhead 0.0 because Apple resets it on
    # completion, so reading playhead as progress reports every finished
    # episode as 0%.
    if play_state == "played":
        percent = 100.0
    elif play_state == "in-progress":
        percent = (round(float(playhead) / float(duration) * 100.0, 1)
                   if duration and playhead is not None and float(duration) > 0
                   else None)
    elif play_state == "unplayed":
        percent = 0.0
    else:
        percent = None

    return {
        "title": row["ZTITLE"] or row["ZITUNESTITLE"] or row["ZCLEANEDTITLE"],
        # status IS play_state — a schema CHECK enforces it, so both are written
        # from this one value and can never drift.
        "status": play_state,
        "body": row["ZITEMDESCRIPTIONWITHOUTHTML"],
        "apple_pk": row["Z_PK"],
        "podcast_slug": podcast_slug,
        "apple_podcast_pk": row["ZPODCAST"],
        "apple_podcast_uuid": row["ZPODCASTUUID"],
        "enclosure_url": row["ZENTITLEDENCLOSUREURL"] or row["ZENCLOSUREURL"],
        "web_page_url": row["ZWEBPAGEURL"],
        "artwork_url": row["ZARTWORKTEMPLATEURL"],
        # Sparse AND wrong on real rows (Dartpraat 18 carries 21). Mirrored as
        # provenance only; nothing should sort or match on these two.
        "season_number": row["ZSEASONNUMBER"],
        "episode_number": row["ZEPISODENUMBER"],
        "episode_type": row["ZEPISODETYPE"],
        "duration_seconds": duration,
        "pubdate": coredata_to_iso(row["ZPUBDATE"]),
        "play_state": play_state,
        "apple_play_state_raw": raw_state,
        "playhead_seconds": playhead,
        "percent_complete": percent,
        "is_finished": 1 if play_state == "played" else 0,
        "play_count": row["ZPLAYCOUNT"],
        "last_played_date": coredata_to_iso(row["ZLASTDATEPLAYED"]),
        "is_saved": 1 if row["ZSAVED"] else 0,
        "is_bookmarked": 1 if row["ZISBOOKMARKED"] else 0,
        "is_downloaded": 1 if row["ZDOWNLOADPATH"] else 0,
    }


def differs(existing, incoming, columns):
    """True when any contracted column changed.

    `source_synced_at` / `source_db_path` are deliberately NOT compared: they
    change on every run by definition, and including them would report all ~4700
    rows as changed every time — destroying the signal that decides whether the
    regen needs to fire at all.
    """
    for c in columns:
        a, b = existing[c], incoming[c]
        if isinstance(a, float) or isinstance(b, float):
            if a is None or b is None:
                if a is not b:
                    return True
                continue
            if abs(float(a) - float(b)) > 1e-9:
                return True
            continue
        if a != b:
            return True
    return False


# ── the sync ─────────────────────────────────────────────────────────────────
def sync(args):
    as_json = args.json
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    started = datetime.now(timezone.utc)

    if not DB_PATH.is_file():
        die(2, "mirror database not found at {} — run regen-mypka-db.py first. "
               "Nothing written.".format(DB_PATH), as_json)

    src = open_source(APPLE_DB, as_json)
    preflight_source(src, as_json)
    show_rows = read_shows(src)
    episode_rows = read_episodes(src)
    src.close()

    # An empty source is the NORMAL state while iCloud is still filling the store
    # (the first full sync took ~20 minutes on 2026-08-19). Treating it as data
    # would mean writing nothing useful and, worse, teaching every downstream
    # reader that the library is empty. Abort instead — the mirror keeps what it
    # has, and the next tick picks it up.
    if not episode_rows:
        die(5, "source holds 0 episodes — iCloud has probably not finished "
               "syncing yet (the first sync took ~20 minutes). Mirror left "
               "untouched; the next run will pick it up.", as_json)

    # ── SCOPE: subscribed shows only (see the SCOPE note in the docstring) ────
    subscribed_rows = [r for r in show_rows if r["ZSUBSCRIBED"]]
    if show_rows and not subscribed_rows:
        die(7, "source holds {} show(s) but not one has ZSUBSCRIBED = 1 — "
               "Sander's library cannot be in that state, so the meaning of "
               "that undocumented column has probably changed. Nothing "
               "written, nothing pruned; re-derive the flag before re-enabling "
               "the sync.".format(len(show_rows)), as_json)

    subscribed_pks = {r["Z_PK"] for r in subscribed_rows}
    source_pks = {r["Z_PK"] for r in show_rows}
    # An episode is in scope only if its show is. Counted in two buckets, since
    # they mean different things: "unsubscribed" is the routine, expected case
    # this filter exists for, while "unknown show" means the FK resolves to no
    # source row at all (0 such rows on 2026-08-19) and is worth seeing.
    kept_episode_rows, ep_unsubscribed, ep_orphan = [], 0, 0
    for r in episode_rows:
        pk = r["ZPODCAST"]
        if pk in subscribed_pks:
            kept_episode_rows.append(r)
        elif pk in source_pks:
            ep_unsubscribed += 1
        else:
            ep_orphan += 1

    mirror = sqlite3.connect(str(DB_PATH))
    mirror.row_factory = sqlite3.Row
    mirror.execute("PRAGMA busy_timeout = 10000")
    try:
        tables = {r[0] for r in mirror.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table'")}
        for t in ("podcasts", "podcast_episodes"):
            if t not in tables:
                die(2, "mirror table {} is absent — run:  python3 "
                       "Expansions/mypka-cockpit/sqlite-extension/"
                       "install-extensions.py mypka.db --with-libraries "
                       "--with-podcasts . Nothing written.".format(t), as_json)

        # ── existing state ───────────────────────────────────────────────────
        existing_shows = {}
        existing_by_uuid = {}
        show_slugs = set()
        mirror_show_rows = list(mirror.execute(
            "SELECT slug, {} FROM podcasts".format(", ".join(SHOW_COLUMNS))))
        for r in mirror_show_rows:
            if r["feed_url"]:
                existing_shows[r["feed_url"]] = r
            # Secondary handle for a feed-less stub. `feed_url` is the declared
            # upsert key and is UNIQUE-but-nullable, and SQLite treats every NULL
            # as distinct — so without this fallback a show with no feed URL
            # would insert a fresh duplicate row on every single run.
            if r["apple_uuid"]:
                existing_by_uuid[r["apple_uuid"]] = r
            show_slugs.add(r["slug"])

        existing_eps = {}
        ep_slugs = set()
        for r in mirror.execute(
                "SELECT slug, guid, {} FROM podcast_episodes"
                .format(", ".join(EPISODE_COLUMNS))):
            existing_eps[r["guid"]] = r
            ep_slugs.add(r["slug"])

        mirror_ep_count = len(existing_eps)

        # ── PRUNE: mirror shows that have left the subscribed set ────────────
        # Computed here, BEFORE slug resolution, for two reasons: the dry-run
        # has to be able to report it without opening a transaction, and the
        # slugs being freed have to leave `show_slugs` before `unique_slug`
        # allocates, or a re-subscribed show would needlessly land on `-2`.
        source_shrunk = bool(mirror_ep_count
                             and len(episode_rows) < mirror_ep_count * 0.5)
        kept_guids = {r["ZGUID"] for r in kept_episode_rows}

        prune_skipped_reason = None
        if args.no_prune:
            prune_skipped_reason = "disabled by --no-prune"
        elif source_shrunk:
            prune_skipped_reason = (
                "source shrank to {} episodes against {} in the mirror — that "
                "is the signature of a library rebuild or a half-finished "
                "iCloud sync, not of an unfollow. Pruning against a partial "
                "source would delete shows that are merely not back yet."
                .format(len(episode_rows), mirror_ep_count))

        sub_feeds = {r["ZFEEDURL"] for r in subscribed_rows if r["ZFEEDURL"]}
        sub_uuids = {r["ZUUID"] for r in subscribed_rows if r["ZUUID"]}

        prune_shows, prune_protected, prune_ep_guids = [], [], []
        if prune_skipped_reason is None:
            # The same identity test the upsert lookup uses below — feed_url
            # first, apple_uuid as the fallback handle for a feed-less stub —
            # so a row can never be judged "gone" here and "found" there.
            candidates = sorted(
                r["slug"] for r in mirror_show_rows
                if not ((r["feed_url"] and r["feed_url"] in sub_feeds)
                        or (r["apple_uuid"] and r["apple_uuid"] in sub_uuids)))

            if candidates:
                marks = ", ".join("?" * len(candidates))
                protected = set()
                guard = protected_predicate(mirror, "podcasts",
                                            SHOW_PROTECTED_PREDICATES)
                if guard:
                    protected |= {r[0] for r in mirror.execute(
                        "SELECT slug FROM podcasts WHERE slug IN ({}) AND ({})"
                        .format(marks, guard), candidates)}
                guard = protected_predicate(mirror, "podcast_episodes",
                                            EPISODE_PROTECTED_PREDICATES)
                if guard:
                    # One protected EPISODE protects its whole show: deleting
                    # the show row around a kept episode would strip its title,
                    # artwork and feed and leave an unreadable stub.
                    protected |= {r[0] for r in mirror.execute(
                        "SELECT DISTINCT podcast_slug FROM podcast_episodes"
                        " WHERE podcast_slug IN ({}) AND ({})"
                        .format(marks, guard), candidates)}

                prune_protected = sorted(protected)
                prune_shows = [s for s in candidates if s not in protected]

            # Episodes whose show link is NULL — historically the landing spot
            # for an episode whose show had not synced yet. Under the SCOPE
            # rule they are unattributable, so they go too, EXCEPT any the
            # current source still knows about: their show may have arrived and
            # be subscribed, in which case this run is about to link them up.
            ep_guard = protected_predicate(mirror, "podcast_episodes",
                                           EPISODE_PROTECTED_PREDICATES)
            null_sql = ("SELECT guid FROM podcast_episodes"
                        " WHERE podcast_slug IS NULL")
            if ep_guard:
                null_sql += " AND NOT ({})".format(ep_guard)
            prune_ep_guids = [r[0] for r in mirror.execute(null_sql)
                              if r[0] not in kept_guids]

            # Never let the prune reach a row this very run is about to write.
            for slug in prune_shows:
                show_slugs.discard(slug)
            prune_ep_count = mirror.execute(
                "SELECT COUNT(*) FROM podcast_episodes WHERE podcast_slug IN"
                " ({})".format(", ".join("?" * len(prune_shows)) or "NULL"),
                prune_shows).fetchone()[0] + len(prune_ep_guids)
        else:
            prune_ep_count = 0

        # ── resolve show slugs ───────────────────────────────────────────────
        renames = []               # (old_slug, new_slug) to cascade onto episodes
        slug_by_apple_pk = {}      # ZMTPODCAST.Z_PK → podcasts.slug
        show_values = []           # (slug, values, is_new, is_changed)

        for row in sorted(subscribed_rows, key=lambda r: (r["ZFEEDURL"] or "",
                                                          r["Z_PK"])):
            vals = map_show(row, now, str(APPLE_DB))
            feed = vals["feed_url"]
            synthetic = synthetic_show_slug(vals["store_collection_id"], feed,
                                            vals["apple_pk"])
            prev = (existing_shows.get(feed) if feed else None) \
                or existing_by_uuid.get(vals["apple_uuid"])

            if prev is not None:
                slug = prev["slug"]
                # The ONE case in which a frozen slug is re-minted: the row was
                # first seen without a title, got the synthetic slug, and Apple
                # has since supplied the real title. `podcasts` is a join target,
                # not a browsable route (it has no library_registry row), so the
                # rename breaks no bookmark — and the FK is cascaded below in the
                # same transaction.
                if slug == synthetic and vals["title"]:
                    candidate = slugify(vals["title"])
                    if candidate and candidate != slug:
                        show_slugs.discard(slug)
                        new_slug = unique_slug(candidate, show_slugs, synthetic)
                        renames.append((slug, new_slug))
                        slug = new_slug
                changed = differs(prev, vals, SHOW_COLUMNS)
                show_values.append((slug, vals, False, changed))
            else:
                base = slugify(vals["title"]) or synthetic
                slug = unique_slug(base, show_slugs, synthetic)
                show_values.append((slug, vals, True, True))

            slug_by_apple_pk[row["Z_PK"]] = slug

        # ── resolve episode slugs + values ───────────────────────────────────
        ep_new, ep_changed = [], []
        seen_guids = []

        # `kept_episode_rows`, not `episode_rows`: every row here belongs to a
        # subscribed show, so `slug_by_apple_pk` resolves for all of them and
        # the old NULL-show-link branch is unreachable by construction. The two
        # skip counters computed at read time carry what it used to report.
        for row in sorted(kept_episode_rows, key=lambda r: (r["ZPODCAST"] or 0,
                                                            r["ZPUBDATE"] or 0,
                                                            r["Z_PK"])):
            podcast_slug = slug_by_apple_pk[row["ZPODCAST"]]
            vals = map_episode(row, podcast_slug, now, str(APPLE_DB))
            guid = row["ZGUID"]
            seen_guids.append(guid)
            prev = existing_eps.get(guid)
            if prev is None:
                base = "{}-{}".format(podcast_slug or "podcast",
                                      slugify(vals["title"], max_len=MAX_SLUG))
                slug = unique_slug(base, ep_slugs, "episode-{}".format(
                    slugify(guid, max_len=60) or row["Z_PK"]))
                ep_new.append((slug, guid, vals))
            elif differs(prev, vals, EPISODE_COLUMNS):
                ep_changed.append((guid, vals))

        show_new = [(s, v) for s, v, is_new, _ in show_values if is_new]
        show_changed = [(s, v) for s, v, is_new, ch in show_values
                        if not is_new and ch]

        summary = {
            "service": "podcast-sync",
            "event": "dry-run" if args.dry_run else "sync",
            "ts": now,
            "source_db": str(APPLE_DB),
            "mirror_db": str(DB_PATH),
            "source_shows": len(show_rows),
            "source_shows_subscribed": len(subscribed_rows),
            "source_episodes": len(episode_rows),
            "source_episodes_subscribed": len(kept_episode_rows),
            "episodes_skipped_unsubscribed": ep_unsubscribed,
            "shows_inserted": len(show_new),
            "shows_updated": len(show_changed),
            "shows_renamed": len(renames),
            "episodes_inserted": len(ep_new),
            "episodes_updated": len(ep_changed),
            "episodes_orphaned": ep_orphan,
            "shows_pruned": len(prune_shows),
            "episodes_pruned": prune_ep_count,
            "shows_prune_protected": len(prune_protected),
            "mirror_episodes_before": mirror_ep_count,
        }
        if prune_shows:
            summary["pruned_show_slugs"] = prune_shows
        if prune_protected:
            summary["prune_protected_show_slugs"] = prune_protected
        if prune_skipped_reason:
            summary["prune_skipped"] = prune_skipped_reason

        # A source that lost half its rows is the signature of a Podcasts
        # library rebuild or a half-finished iCloud sync, and the mirror is now
        # a blend of two eras. It is not an abort — no episode is deleted for
        # ageing out — but it DOES disable the prune, because "gone from the
        # source" and "not loaded yet" are indistinguishable in that state.
        if source_shrunk:
            summary["warning"] = (
                "source has {} episodes but the mirror already held {} — the "
                "Podcasts library may have been rebuilt. Prune skipped; no rows "
                "were deleted; stale rows keep their old source_synced_at."
                .format(len(episode_rows), mirror_ep_count))

        if args.dry_run:
            summary["message"] = human_summary(summary, dry_run=True)
            log(summary, as_json, args.quiet)
            return summary

        # ── one transaction, all-or-nothing ──────────────────────────────────
        changed_anything = bool(show_new or show_changed or renames
                                or ep_new or ep_changed
                                or prune_shows or prune_ep_guids)
        try:
            mirror.execute("BEGIN IMMEDIATE")

            # The prune runs FIRST, so the slugs it frees are available to the
            # rename and insert steps below (unique_slug already released them).
            # Episodes before shows: the delete is scoped BY podcast_slug, so
            # removing the show row first would leave nothing to match on.
            if prune_shows:
                marks = ", ".join("?" * len(prune_shows))
                mirror.execute(
                    "DELETE FROM podcast_episodes WHERE podcast_slug IN ({})"
                    .format(marks), prune_shows)
                mirror.execute(
                    "DELETE FROM podcasts WHERE slug IN ({})".format(marks),
                    prune_shows)
            if prune_ep_guids:
                mirror.executemany(
                    "DELETE FROM podcast_episodes WHERE guid = ?",
                    [(g,) for g in prune_ep_guids])

            # ORDER MATTERS, and it is the reverse of the obvious one.
            # Renames run FIRST because every statement below addresses a show by
            # its NEW slug: an update issued before the rename would match zero
            # rows and lose the change silently. Inserts run second because a
            # rename can VACATE a slug that a brand-new show was just allocated
            # (unique_slug already released it), and inserting first would hit
            # the UNIQUE index on podcasts.slug.
            for old_slug, new_slug in renames:
                mirror.execute("UPDATE podcasts SET slug = ? WHERE slug = ?",
                               (new_slug, old_slug))
                mirror.execute("UPDATE podcast_episodes SET podcast_slug = ?"
                               " WHERE podcast_slug = ?", (new_slug, old_slug))

            for slug, vals in show_new:
                cols = ["slug"] + SHOW_COLUMNS + ["source_synced_at",
                                                  "source_db_path"]
                mirror.execute(
                    "INSERT INTO podcasts ({}) VALUES ({})".format(
                        ", ".join(cols), ", ".join("?" * len(cols))),
                    [slug] + [vals[c] for c in SHOW_COLUMNS]
                    + [now, str(APPLE_DB)])

            for slug, vals in show_changed:
                # Keyed on `slug`, not `feed_url`: slug is UNIQUE and NOT NULL,
                # whereas feed_url is nullable and `WHERE feed_url IS NULL` would
                # rewrite every feed-less row at once.
                # linked_* and slug itself are absent from this SET clause by
                # design — that absence is the guarantee, not a comment.
                mirror.execute(
                    "UPDATE podcasts SET {}, source_synced_at = ?,"
                    " source_db_path = ? WHERE slug = ?".format(
                        ", ".join("{} = ?".format(c) for c in SHOW_COLUMNS)),
                    [vals[c] for c in SHOW_COLUMNS] + [now, str(APPLE_DB), slug])

            for slug, guid, vals in ep_new:
                cols = ["slug", "guid"] + EPISODE_COLUMNS + ["source_synced_at",
                                                             "source_db_path"]
                mirror.execute(
                    "INSERT INTO podcast_episodes ({}) VALUES ({})".format(
                        ", ".join(cols), ", ".join("?" * len(cols))),
                    [slug, guid] + [vals[c] for c in EPISODE_COLUMNS]
                    + [now, str(APPLE_DB)])

            # tags / file_path / raw_frontmatter / manual_watched* /
            # transcript_* / slug are absent from this SET clause BY DESIGN.
            # That absence is the whole guarantee of DATA-CONTRACT §18.9.
            mirror.executemany(
                "UPDATE podcast_episodes SET {}, source_synced_at = ?,"
                " source_db_path = ? WHERE guid = ?".format(
                    ", ".join("{} = ?".format(c) for c in EPISODE_COLUMNS)),
                [[vals[c] for c in EPISODE_COLUMNS] + [now, str(APPLE_DB), guid]
                 for guid, vals in ep_changed])

            # Touch the provenance stamp on EVERY row the source still knows
            # about, changed or not. That is what makes "this row has gone stale
            # / Apple pruned it" readable straight from the data, per §18.1 —
            # while the content diff above stays the trigger for the regen.
            mirror.executemany(
                "UPDATE podcast_episodes SET source_synced_at = ?,"
                " source_db_path = ? WHERE guid = ?",
                [(now, str(APPLE_DB), g) for g in seen_guids])
            mirror.executemany(
                "UPDATE podcasts SET source_synced_at = ?, source_db_path = ?"
                " WHERE slug = ?",
                [(now, str(APPLE_DB), s) for s, _, _, _ in show_values])

            mirror.commit()
        except Exception as exc:              # noqa: BLE001 — deliberate catch-all
            mirror.rollback()
            die(6, "write failed and was ROLLED BACK — the mirror is exactly as "
                   "it was before this run: {}: {}".format(
                       type(exc).__name__, exc), as_json)

        summary["mirror_episodes_after"] = mirror.execute(
            "SELECT COUNT(*) FROM podcast_episodes").fetchone()[0]
        # Reported only when the override layer of DATA-CONTRACT §18.9 is
        # actually installed. The sync never WRITES these columns, so it must
        # not require them either: a mirror carrying only the fase-1 schema is a
        # perfectly valid target, and demanding a column the sync does not touch
        # would turn a reporting nicety into a hard dependency.
        mirror_cols = {r[1] for r in mirror.execute(
            "PRAGMA table_info(podcast_episodes)")}
        if "manual_watched" in mirror_cols:
            summary["manual_watched_rows"] = mirror.execute(
                "SELECT COUNT(*) FROM podcast_episodes WHERE manual_watched = 1"
            ).fetchone()[0]
        else:
            summary["manual_watched_layer"] = "not installed"
        summary["changed"] = changed_anything
    finally:
        mirror.close()

    summary["duration_ms"] = int(
        (datetime.now(timezone.utc) - started).total_seconds() * 1000)

    # ── conditional regen (see the REGEN note in the module docstring) ────────
    if args.regen_always or (args.regen and changed_anything):
        summary["regen"] = run_regen()
    elif args.regen:
        summary["regen"] = "skipped (nothing changed)"

    summary["message"] = human_summary(summary)
    log(summary, as_json, args.quiet)
    return summary


def run_regen():
    if not REGEN.is_file():
        return "skipped (regen-mypka-db.py not found at {})".format(REGEN)
    proc = subprocess.run([sys.executable, str(REGEN)],
                          capture_output=True, text=True)
    if proc.returncode != 0:
        # The sync itself is already committed and independent of the regen, so
        # a regen failure is reported, not rolled back into a sync failure.
        return "FAILED (exit {}): {}".format(
            proc.returncode, (proc.stderr or proc.stdout).strip()[:400])
    return "ok"


def human_summary(s, dry_run=False):
    parts = [
        "{}: {} shows / {} episodes in Apple's store, of which {} show(s) / {} "
        "episode(s) are subscribed (the mirror's scope)".format(
            "dry-run" if dry_run else "sync", s["source_shows"],
            s["source_episodes"], s["source_shows_subscribed"],
            s["source_episodes_subscribed"]),
        "  shows     +{} new, {} updated, {} re-slugged".format(
            s["shows_inserted"], s["shows_updated"], s["shows_renamed"]),
        "  episodes  +{} new, {} updated".format(
            s["episodes_inserted"], s["episodes_updated"]),
    ]
    if s.get("episodes_skipped_unsubscribed"):
        parts.append("  {} episode(s) skipped — their show is not subscribed"
                     .format(s["episodes_skipped_unsubscribed"]))
    if s.get("shows_pruned") or s.get("episodes_pruned"):
        parts.append("  pruned    -{} show(s) that left the subscribed set, "
                     "-{} episode(s): {}".format(
                         s["shows_pruned"], s["episodes_pruned"],
                         ", ".join(s.get("pruned_show_slugs") or []) or "—"))
    if s.get("prune_protected_show_slugs"):
        parts.append("  KEPT despite leaving the subscribed set (hand-owned "
                     "data present): {}".format(
                         ", ".join(s["prune_protected_show_slugs"])))
    if s.get("prune_skipped"):
        parts.append("  prune skipped: {}".format(s["prune_skipped"]))
    if s.get("episodes_orphaned"):
        parts.append("  {} episode(s) skipped — no matching show row at all "
                     "in the source".format(s["episodes_orphaned"]))
    if s.get("manual_watched_rows") is not None:
        parts.append("  {} row(s) carry Sander's manual_watched tick "
                     "(untouched)".format(s["manual_watched_rows"]))
    if s.get("manual_watched_layer"):
        parts.append("  note: the manual_watched override layer (DATA-CONTRACT "
                     "§18.9) is not installed in this mirror")
    if s.get("regen"):
        parts.append("  regen: {}".format(s["regen"]))
    if s.get("warning"):
        parts.append("  WARNING: {}".format(s["warning"]))
    return "\n".join(parts)


def main(argv=None):
    p = argparse.ArgumentParser(
        description="Mirror Apple Podcasts listening state into mypka.db.")
    p.add_argument("--dry-run", action="store_true",
                   help="read + diff + report; open no write transaction")
    p.add_argument("--no-prune", action="store_true",
                   help="keep mirror shows that have left the subscribed set "
                        "instead of deleting them (see PRUNE)")
    p.add_argument("--regen", action="store_true",
                   help="run regen-mypka-db.py afterwards, but only if this "
                        "sync changed something")
    p.add_argument("--regen-always", action="store_true",
                   help="run regen-mypka-db.py unconditionally")
    p.add_argument("--json", action="store_true",
                   help="emit the run summary as one JSON line")
    p.add_argument("--quiet", action="store_true",
                   help="suppress the human-readable report")
    p.add_argument("--db", help="override mypka.db path")
    p.add_argument("--source", help="override MTLibrary.sqlite path")
    args = p.parse_args(argv)

    global DB_PATH, APPLE_DB
    if args.db:
        DB_PATH = Path(args.db)
    if args.source:
        APPLE_DB = Path(args.source)

    # Non-blocking lock: overlapping runs are prevented, never queued. A tick
    # that finds the previous one still working should be dropped, not stacked.
    LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
    lock = open(LOCK_PATH, "w")
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        log({"service": "podcast-sync", "event": "skipped",
             "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
             "message": "another sync is already running — tick skipped"},
            args.json, args.quiet)
        return 0
    try:
        sync(args)
    finally:
        fcntl.flock(lock, fcntl.LOCK_UN)
        lock.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
