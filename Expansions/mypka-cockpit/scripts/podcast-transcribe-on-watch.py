#!/usr/bin/env python3
"""podcast-transcribe-on-watch.py — transcribe a podcast episode ONLY after
Sander has actually listened to / watched it.

THE RULE THIS SCRIPT EXISTS TO ENFORCE
    Sander does not want blanket transcription of podcast archives. Being
    subscribed to a show is NOT consent to pull its whole back catalogue into
    the second brain. His own words (2026-08-19): a blanket import would be
    "allemaal onzin in mijn tweede brein waarvan ik niet eens weet dat het
    erin zit". Captured in the memory note
    `feedback_transcriptie_alleen_bij_gezien`.

    So the trigger is CONSUMPTION, not availability:
        effective_watch_source IS NOT NULL   (Apple play_state = 'played',
                                              or manual_watched = 1)
      AND transcript_path IS NULL
      AND the episode became seen AFTER this trigger was armed.

    That last clause is the whole ballgame and is why this script keeps state.

HOW THE NO-BACKFILL GUARANTEE WORKS (four independent guards)
    1. SEED-ON-FIRST-RUN. The first invocation that finds no watermark file
       writes one containing every guid that is seen RIGHT NOW, and transcribes
       exactly zero episodes. At the moment of arming, 14 episodes were already
       marked played (verified 2026-08-19). Those are history, not events, and
       are frozen into the watermark instead of being queued.
       Losing the watermark file therefore fails SAFE: the next run re-seeds and
       transcribes nothing. It can never fail OPEN into a bulk run.

    2. DELTA, NOT PREDICATE. A run never queues "everything that is seen". It
       queues `seen_now - watermark`. The 2 954 unseen episodes (verified
       2026-08-19) are not in the delta by construction, and the 14 historical
       ones are in the watermark. There is no code path that selects on the
       seen-predicate alone.

    3. EXPLICIT SHOW ROUTING. Only shows listed in YOUTUBE_SOURCES are ever
       executed. Same philosophy as lib/podcast_transcript_match.py: no feed is
       guessed into a route. A newly-seen episode of an unrouted show is
       detected, reported, and left alone — never force-fitted.

    4. HARD CAP PER RUN (--max, default 3). A belt-and-braces bound on blast
       radius if the watermark is ever corrupted by hand. Three episodes is well
       above Sander's real listening rate and far below "an archive".

    Additionally: the default mode is --report, which writes NOTHING. Execution
    requires --run. The launchd wiring is announced, never auto-installed.

HOW AN EPISODE BECOMES TEXT
    Apple's store has no YouTube link, so the video has to be identified. Rather
    than invent a second matcher, this script REUSES lib/podcast_transcript_match:
    it lists the show's newest YouTube videos (metadata only, no download),
    wraps each in a Transcript object, and runs the same match_all() cascade
    (SxxEyy → ordinal → normalized title → fuzzy, with the same tiebreakers).
    A queued episode is only transcribed when that cascade names exactly one
    video for it.

    The transcription itself is the existing /transcribeer skill, called
    non-interactively on a SINGLE video URL:

        uv run ~/.claude/skills/transcribeer/transcribeer.py \
            "https://www.youtube.com/watch?v=<id>" --max 1 --out "<show folder>"

    VERIFIED 2026-08-19, not assumed: transcribeer.py has no input() anywhere
    and its list_latest() accepts a plain watch?v= URL — a live run printed
    "1 video's gevonden" and the correct episode title. One caveat, also
    verified: channel_label() cannot resolve a channel name from a single-video
    URL (it printed "kanaal"), so --out is MANDATORY on this call path.

    After a successful fetch, the file's leading index is renumbered to the next
    free slot in the show folder, because write_transcript() always numbers a
    single-video run "01".

    transcript_path is then set by running the real matcher over the real files
    on disk (apply_matches). This script never writes transcript_* itself —
    those columns stay the property of lib/podcast_transcript_match.py, per the
    sync script's data contract.

SHOWS WITHOUT A USABLE YOUTUBE ROUTE (verified 2026-08-19, see the session log)
    * Marketingpraat — the show now publishes on the Plug&Pay channel
      (UCPs-cufrOTA750BNqNHkuww), but YouTube serves those titles in ENGLISH
      ("Marketing with AI: Simple Addiction or Quality Output?") while the RSS
      titles are Dutch ("Zijn we verslaafd aan AI?"), and the channel is mostly
      non-podcast content. Title matching across two languages is not a thing
      this cascade does. Left unrouted deliberately.
    * De Universiteit van Nederland Podcast — a YouTube playlist DOES exist
      (PLZ0df6wQ5oO-pqAvCvd5Kc3-kc9p942qW, 866 entries, podcast items prefixed
      with a 🎧) and its titles DO match the RSS titles. Routable in principle;
      left unrouted until Sander says he wants that show transcribed at all.

    For both, the honest alternative is the RSS audio enclosure (present on
    every row in podcast_episodes) transcribed with Whisper — no YouTube, no IP
    blocking, and a deterministic 1:1 link instead of an inference. That route
    needs (a) a decision from Sander and (b) Atlas, because the
    transcript_match_method CHECK constraint has no value for "transcribed
    directly from the feed". Not built here on purpose.

Read-only by default. --run is the only writing path.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import podcast_transcript_match as ptm  # noqa: E402

ROOT = Path(os.environ.get("MYPKA_ROOT") or Path(__file__).resolve().parents[3])
DB_PATH = Path(os.environ.get("MYPKA_DB") or (ROOT / "mypka.db"))

STATE_PATH = Path(os.environ.get("PODCAST_WATCH_STATE") or (
    Path.home() / "Library/Application Support/nl.gewoonsander.mypka"
    / "podcast-transcribe-watermark.json"))

TRANSCRIBEER = Path.home() / ".claude/skills/transcribeer/transcribeer.py"

STATE_VERSION = 1
MAX_ATTEMPTS = 5          # a guid that fails this often is parked, not retried forever
DEFAULT_MAX_PER_RUN = 3
YT_LIST_DEPTH = 40        # how deep into the channel to look for the episode's video

# ── show routing ─────────────────────────────────────────────────────────────
# podcast slug → where its videos live and which transcript folder they belong
# in. EXPLICIT ON PURPOSE (guard 3). The folder MUST also appear in
# ptm.TRANSCRIPT_SOURCES, otherwise the matcher will never scan it and
# transcript_path stays NULL after a successful fetch.
YOUTUBE_SOURCES: dict[str, dict[str, str]] = {
    "dartpraat": {
        # @Dartpraat = UCvlZuJtGY4ZExkZ660WNlnA, resolved from an existing
        # transcript's video id (verified 2026-08-19).
        "channel_url": "https://www.youtube.com/@Dartpraat/videos",
        "folder": "Dartpraat Podcast",
    },
}

LEADING_INDEX_RE = re.compile(r"^(\d{1,4})\s*-\s*")


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ── state ────────────────────────────────────────────────────────────────────
@dataclass
class State:
    armed_at: str
    seen_guids: set[str]
    pending: dict[str, dict]      # guid → {attempts, last_error, first_seen_at}
    transcribed: dict[str, dict]  # guid → {video_id, at, file}
    abandoned: dict[str, dict]
    last_run_at: str | None = None

    @classmethod
    def load(cls, path: Path) -> "State | None":
        if not path.exists():
            return None
        try:
            d = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise SystemExit(
                f"watermark unreadable ({path}): {exc}\n"
                "Refusing to continue: a run without a trustworthy watermark is\n"
                "exactly the bulk-backfill this script exists to prevent.\n"
                "Delete the file to re-arm (that transcribes nothing).")
        return cls(armed_at=d.get("armed_at", ""),
                   seen_guids=set(d.get("seen_guids") or []),
                   pending=d.get("pending") or {},
                   transcribed=d.get("transcribed") or {},
                   abandoned=d.get("abandoned") or {},
                   last_run_at=d.get("last_run_at"))

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "version": STATE_VERSION,
            "armed_at": self.armed_at,
            "last_run_at": self.last_run_at,
            "seen_guids": sorted(self.seen_guids),
            "pending": self.pending,
            "transcribed": self.transcribed,
            "abandoned": self.abandoned,
        }
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(payload, indent=2, ensure_ascii=False),
                       encoding="utf-8")
        tmp.replace(path)


# ── the mirror ───────────────────────────────────────────────────────────────
def seen_now(db_path: Path) -> dict[str, dict]:
    """guid → row, for every episode that is seen and has no transcript yet.

    Reads the view Atlas built, so Apple's play state and Sander's manual
    YouTube tick are treated identically — that is what the view is for.
    """
    if not db_path.exists():
        raise SystemExit(f"mypka.db not found at {db_path}")
    con = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    try:
        have = {r[0] for r in con.execute(
            "SELECT name FROM sqlite_master WHERE name='v_podcast_episodes_effective'")}
        if not have:
            raise SystemExit(
                "v_podcast_episodes_effective is absent — that view is Atlas's; "
                "run the podcast extension installer first.")
        rows = con.execute(
            "SELECT guid, title, podcast_slug, pubdate, season_number, "
            "       episode_number, effective_watch_source, transcript_path "
            "FROM v_podcast_episodes_effective "
            "WHERE effective_watch_source IS NOT NULL").fetchall()
    finally:
        con.close()
    return {r["guid"]: dict(r) for r in rows}


def show_titles(db_path: Path) -> dict[str, str]:
    con = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    try:
        return {s: t for s, t in con.execute("SELECT slug, title FROM podcasts")}
    finally:
        con.close()


# ── YouTube side ─────────────────────────────────────────────────────────────
def list_channel(channel_url: str, depth: int) -> list[dict]:
    """The channel's newest videos, metadata only — no download, no captions."""
    for runner in (["uvx", "yt-dlp"], ["yt-dlp"],
                   [sys.executable, "-m", "yt_dlp"]):
        if shutil.which(runner[0]) is None:
            continue
        cmd = runner + ["--flat-playlist", "--dump-json", "--no-warnings",
                        "--playlist-end", str(depth), channel_url]
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        except (subprocess.TimeoutExpired, OSError):
            continue
        if proc.returncode != 0 or not proc.stdout.strip():
            continue
        out = []
        for line in proc.stdout.splitlines():
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            if d.get("id") and d.get("title"):
                out.append({"id": d["id"], "title": d["title"]})
        if out:
            return out
    return []


def identify_videos(episodes: list[ptm.Episode], videos: list[dict],
                    folder: str, slug: str) -> dict[str, str]:
    """episode guid → youtube video id, via the EXISTING match cascade.

    Videos are wrapped in Transcript objects purely so match_all() can score
    them; nothing is read from disk here. Reusing the cascade means SxxEyy still
    beats a fuzzy title, ambiguity is still refused rather than coin-flipped,
    and there is only one place where matching rules live.
    """
    fake = [ptm.Transcript(path=f"youtube:{v['id']}", title=v["title"],
                           channel=folder, podcast_slug=slug, video_id=v["id"],
                           published_on=ptm.date_from_title(v["title"]))
            for v in videos]
    res = ptm.match_all(fake, episodes, [])
    return {m.guid: m.transcript_path.split(":", 1)[1] for m in res.matches}


# ── transcription ────────────────────────────────────────────────────────────
def next_index(folder: Path) -> int:
    best = 0
    for f in folder.glob("*.md"):
        m = LEADING_INDEX_RE.match(f.name)
        if m:
            best = max(best, int(m.group(1)))
    return best + 1


def existing_file(folder: Path, video_id: str) -> Path | None:
    hits = list(folder.glob(f"*[[]{video_id}[]].md"))
    return hits[0] if hits else None


def transcribe_one(video_id: str, folder: Path, verbose: bool) -> tuple[bool, str]:
    """Run the /transcribeer skill on exactly one video. Returns (ok, detail)."""
    if not TRANSCRIBEER.exists():
        return False, f"transcribeer.py not installed at {TRANSCRIBEER}"
    if shutil.which("uv") is None:
        return False, "uv not on PATH — the skill needs it to resolve its deps"
    already = existing_file(folder, video_id)
    if already:
        return True, f"already on disk: {already.name}"

    folder.mkdir(parents=True, exist_ok=True)
    want = next_index(folder)
    cmd = ["uv", "run", str(TRANSCRIBEER),
           f"https://www.youtube.com/watch?v={video_id}",
           "--max", "1", "--out", str(folder), "--geen-preflight"]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=3600)
    except subprocess.TimeoutExpired:
        return False, "transcribeer timed out after 60 min"
    if verbose:
        print("      " + "\n      ".join(proc.stdout.strip().splitlines()[-6:]))

    produced = existing_file(folder, video_id)
    if produced is None:
        tail = (proc.stdout or proc.stderr).strip().splitlines()
        why = next((l.strip() for l in reversed(tail)
                    if "overslaan" in l or "mislukt" in l or "ERROR" in l),
                   f"exit {proc.returncode}, no file written")
        return False, why

    # write_transcript() always numbers a single-video run "01"; give it the
    # next free slot so the folder keeps one coherent sequence.
    m = LEADING_INDEX_RE.match(produced.name)
    if m and int(m.group(1)) != want:
        target = folder / LEADING_INDEX_RE.sub(f"{want:02d} - ", produced.name)
        if not target.exists():
            produced.rename(target)
            produced = target
    return True, produced.name


def link_transcripts(db_path: Path) -> tuple[int, str | None]:
    """Set transcript_path via the real matcher over the real files on disk.

    Deliberately a FULL match, not a partial one: apply_matches() clears every
    non-manual link before re-setting, so feeding it a subset would drop the
    other 67 links.

    NEVER fatal. A schema problem on the mirror must not cost us a transcript we
    already fetched — the file on disk is the durable artifact, the column is a
    derived convenience that the next run recomputes. Known live example
    (2026-08-19): the transcript_match_method CHECK constraint has no value for
    'episode_ordinal', which the matcher legitimately produces for 14 Dartpraat
    rows, so apply_matches() raises IntegrityError and rolls back. That is
    Atlas's constraint to widen; this script only reports it.
    """
    try:
        transcripts, skipped = ptm.scan_transcripts()
        slugs = sorted({t.podcast_slug for t in transcripts})
        episodes = ptm.load_episodes_from_mirror(db_path, podcast_slugs=slugs)
        result = ptm.match_all(transcripts, episodes, skipped)
        return ptm.apply_matches(result, db_path), None
    except sqlite3.IntegrityError as exc:
        return 0, (f"transcript_path NOT written — mypka.db rejected the link "
                   f"({exc}). The transcript file itself is safe on disk. "
                   f"Hand this to Atlas: the CHECK on transcript_match_method "
                   f"is missing 'episode_ordinal'.")
    except Exception as exc:                     # noqa: BLE001 — never fatal
        return 0, f"transcript_path NOT written — {type(exc).__name__}: {exc}"


# ── the run ──────────────────────────────────────────────────────────────────
def build_queue(state: State, seen: dict[str, dict]) -> tuple[list[str], list[str]]:
    """(queue, newly_seen). GUARD 2 lives here: the queue is a DELTA against the
    watermark plus earlier failures — never a select on the seen-predicate."""
    newly = [g for g in seen if g not in state.seen_guids]
    retry = [g for g in state.pending
             if g in seen and not seen[g]["transcript_path"]]
    queue = [g for g in newly + retry
             if not seen[g]["transcript_path"] and g not in state.abandoned]
    # de-dupe, preserve order
    seen_once: set[str] = set()
    return ([g for g in queue if not (g in seen_once or seen_once.add(g))], newly)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--run", action="store_true",
                    help="actually transcribe (default is report-only)")
    ap.add_argument("--seed", action="store_true",
                    help="(re)arm the watermark and transcribe nothing")
    ap.add_argument("--max", type=int, default=DEFAULT_MAX_PER_RUN, metavar="N",
                    help=f"hard cap on episodes per run (default {DEFAULT_MAX_PER_RUN})")
    ap.add_argument("--db", default=str(DB_PATH))
    ap.add_argument("--state", default=str(STATE_PATH))
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args(argv)

    db_path, state_path = Path(args.db), Path(args.state)
    seen = seen_now(db_path)
    titles = show_titles(db_path)
    state = State.load(state_path)

    # ── GUARD 1: seed-on-first-run ───────────────────────────────────────────
    if state is None or args.seed:
        fresh = State(armed_at=now_iso(), seen_guids=set(seen),
                      pending={}, transcribed={}, abandoned={},
                      last_run_at=now_iso())
        if state is not None:               # --seed on an existing watermark
            fresh.armed_at = state.armed_at
            fresh.transcribed = state.transcribed
            fresh.abandoned = state.abandoned
        if args.run or args.seed:
            fresh.save(state_path)
        out = {"mode": "seed", "armed_at": fresh.armed_at,
               "frozen_as_history": len(seen), "queued": 0,
               "state": str(state_path),
               "written": bool(args.run or args.seed)}
        if args.json:
            print(json.dumps(out, indent=2))
        else:
            print(f"\n  ARMED — watermark written to {state_path}"
                  if out["written"] else
                  f"\n  ARMED (dry) — watermark would be {state_path}")
            print(f"  {len(seen)} already-seen episodes frozen as history "
                  f"(transcribed: 0, by design)")
            print("  From here on, only episodes that BECOME seen are queued.\n")
        return 0

    queue, newly = build_queue(state, seen)
    capped = queue[:max(0, args.max)]

    rows = []
    for guid in capped:
        r = seen[guid]
        slug = r["podcast_slug"] or ""
        route = YOUTUBE_SOURCES.get(slug)
        rows.append({"guid": guid, "title": r["title"], "show": slug,
                     "source": r["effective_watch_source"],
                     "routed": bool(route)})

    # ── report ───────────────────────────────────────────────────────────────
    if not args.run:
        out = {"mode": "report", "armed_at": state.armed_at,
               "watermark_size": len(state.seen_guids),
               "seen_now": len(seen), "newly_seen": len(newly),
               "queue": len(queue), "would_process": len(capped),
               "pending": len(state.pending), "abandoned": len(state.abandoned),
               "transcribed_total": len(state.transcribed),
               "episodes": rows, "state": str(state_path)}
        if args.json:
            print(json.dumps(out, indent=2, ensure_ascii=False))
        else:
            print(f"\n  armed at          : {state.armed_at}")
            print(f"  watermark holds   : {len(state.seen_guids)} guids")
            print(f"  seen now          : {len(seen)}")
            print(f"  newly seen        : {len(newly)}")
            print(f"  queue             : {len(queue)} "
                  f"(cap {args.max} → {len(capped)} this run)")
            print(f"  transcribed so far: {len(state.transcribed)}"
                  f"  pending: {len(state.pending)}"
                  f"  abandoned: {len(state.abandoned)}")
            for r in rows:
                flag = "→ transcribe" if r["routed"] else "· no YouTube route"
                print(f"    {flag}  [{r['show']}] {r['title'][:60]}")
            print("\n  report-only. Nothing was written. Use --run to execute.\n")
        return 0

    # ── execute ──────────────────────────────────────────────────────────────
    done, failed, unrouted = [], [], []
    by_show: dict[str, list[str]] = {}
    for guid in capped:
        by_show.setdefault(seen[guid]["podcast_slug"] or "", []).append(guid)

    for slug, guids in by_show.items():
        route = YOUTUBE_SOURCES.get(slug)
        if not route:
            unrouted.extend(guids)
            continue
        eps = [ptm.Episode(guid=g, title=seen[g]["title"] or "", podcast_slug=slug,
                           show_title=titles.get(slug), pubdate=seen[g]["pubdate"],
                           season_number=seen[g]["season_number"],
                           episode_number=seen[g]["episode_number"])
               for g in guids]
        videos = list_channel(route["channel_url"], YT_LIST_DEPTH)
        if not videos:
            for g in guids:
                failed.append((g, "channel listing empty (yt-dlp blocked or URL wrong)"))
            continue
        picks = identify_videos(eps, videos, route["folder"], slug)
        folder = ROOT / ptm.TRANSCRIPT_ROOT / route["folder"]
        for g in guids:
            vid = picks.get(g)
            if not vid:
                failed.append((g, f"no video identified in the newest {YT_LIST_DEPTH}"))
                continue
            print(f"  [{slug}] {seen[g]['title'][:55]} → {vid}")
            ok, detail = transcribe_one(vid, folder, args.verbose)
            (done if ok else failed).append(
                (g, detail) if ok else (g, detail))
            if ok:
                state.transcribed[g] = {"video_id": vid, "at": now_iso(),
                                        "file": detail}

    # ── state bookkeeping ────────────────────────────────────────────────────
    state.seen_guids |= set(seen)          # the delta closes, whatever happened
    for g, _ in done:
        state.pending.pop(g, None)
    for g, why in failed:
        rec = state.pending.get(g, {"attempts": 0, "first_seen_at": now_iso()})
        rec["attempts"] += 1
        rec["last_error"] = why
        rec["last_at"] = now_iso()
        if rec["attempts"] >= MAX_ATTEMPTS:
            state.abandoned[g] = rec
            state.pending.pop(g, None)
        else:
            state.pending[g] = rec
    for g in unrouted:
        state.pending.setdefault(g, {"attempts": 0, "first_seen_at": now_iso(),
                                     "last_error": "no YouTube route for this show"})
    state.last_run_at = now_iso()

    linked, link_error = link_transcripts(db_path) if done else (0, None)
    state.save(state_path)

    out = {"mode": "run", "processed": len(capped), "transcribed": len(done),
           "failed": len(failed), "unrouted": len(unrouted),
           "transcript_links_applied": linked, "link_error": link_error,
           "details": {"done": done, "failed": failed}}
    if args.json:
        print(json.dumps(out, indent=2, ensure_ascii=False))
    else:
        print(f"\n  transcribed : {len(done)}")
        for g, d in done:
            print(f"      + {d}")
        print(f"  failed      : {len(failed)}")
        for g, d in failed:
            print(f"      ! {seen[g]['title'][:50]} — {d}")
        print(f"  no route    : {len(unrouted)}")
        print(f"  transcript_path rows applied: {linked}")
        if link_error:
            print(f"  [LET OP] {link_error}")
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
