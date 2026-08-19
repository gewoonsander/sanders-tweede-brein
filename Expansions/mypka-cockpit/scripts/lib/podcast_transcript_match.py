#!/usr/bin/env python3
"""podcast_transcript_match.py — link Apple Podcasts episodes to existing myPKA
transcripts.

WHAT PROBLEM THIS SOLVES
    `podcast_episodes` rows come from Apple's store; transcripts come from the
    `/transcribeer` skill and live as markdown under
    PKM/Documents/YouTube-Kennis/<Channel>/. Nothing links them: the two sides
    were produced by unrelated pipelines, the titles differ, and the transcript
    files carry NO YAML frontmatter (verified — an acknowledged GL-002 deviation),
    so there is no id, no date, and no feed reference to join on.

    Example of the actual gap (verified 2026-08-19):
        Apple title       : "S03E15 - WK Darts 2026 Scorito aflevering"
        Transcript filename: "14 - Dartpraat S03E15 - WK Darts 2026 Scorito-aflevering [weLKT6svNJE].md"
    Same episode. Different leading number, an added show name, a hyphen instead
    of a space. A naive equality join scores zero.

MATCH STRATEGY — a cascade, strongest evidence first, one winner per pair.
    Every match records HOW it was made and with what confidence, because a match
    is an INFERENCE. The columns transcript_match_method / transcript_match_score
    exist so a downstream view can render a weak match as "probable", never as a
    fact.

    1. season_episode          score 1.0
       Both sides expose an SxxEyy token (parsed from the TITLE, or from Apple's
       structured season/episode columns when populated). Equal (season, episode)
       within the same show is a deterministic identity — a show does not publish
       two S03E15s. This is the primary path for Dartpraat from season 2 on.
       NOTE the deliberate choice to parse the TITLE rather than trust Apple's
       ZSEASONNUMBER / ZEPISODENUMBER: those are populated on only 986 / 2865 of
       4732 rows respectively (verified), and — worse — they are WRONG on real
       rows: Dartpraat's "Dartpraat 18" carries ZEPISODENUMBER 21 and
       "Dartpraat 28" carries 27. The title token is authoritative; the structured
       columns are a last-resort fallback only.

    2. episode_ordinal         score 0.90
       Neither side has a season token, but both expose a bare episode ordinal
       ("Dartpraat 33 - …" on Apple, "… Aflevering 33 …" on YouTube). This is
       Dartpraat season 1, where the two pipelines number the same episodes with
       different words. An ordinal alone is weaker than SxxEyy, so it is accepted
       ONLY when corroborated by one of:
         * a publication date within ORDINAL_DATE_TOLERANCE_DAYS of the episode's
           pubdate (the strong corroboration), or
         * a token overlap of at least ORDINAL_TOKEN_GUARD on the rest of the
           title (the fallback when the transcript carries no date).
       Uncorroborated ordinal equality is REJECTED, not downgraded.

    3. normalized_title_exact  score 0.95
       Both titles normalized (lowercased, de-accented, show-name prefix and
       leading "NN - " numbering stripped, punctuation collapsed) and equal.
       Not 1.0: two different episodes CAN normalize to the same string
       (a re-release, a two-parter titled identically). Deterministic, but not
       an identity claim.

    4. fuzzy_title             score = similarity ratio (accepted from 0.82)
       difflib.SequenceMatcher over the normalized titles, guarded by a token
       Jaccard overlap of at least 0.50. The guard exists because short titles
       ("De laatste") reach a high character ratio against almost anything;
       requiring half the words in common kills that class of false positive.

    5. tiebreakers — publication date first, then title margin
       When two or more candidates score within TIE_WINDOW of each other:
         a. PUBLICATION DATE. The candidate whose pubdate is closest to the
            transcript's date wins. The date is parsed out of the transcript
            TITLE, which is the only place it exists: these files have no YAML
            frontmatter (a known GL-002 deviation) and no date field, but many
            titles end in a bracketed date — "[02-05-2024]", "[13 juli 2023]",
            "[17/8/23]", "[21 sept 2023]". Dutch month names and three separator
            styles are all handled. Transcripts WITHOUT such a date fall through.
         b. TITLE MARGIN. Full-title similarity, accepted only when the best
            candidate beats the runner-up by at least TIE_MARGIN. This resolves
            the real duplicate-upload case: a show that posts both
            "S02E04 - Met X" and "S02E04 (alleen audio) - Met X" produces two
            perfect SxxEyy candidates, and the video transcript belongs to the
            former.
         c. Otherwise the pair is reported AMBIGUOUS and left UNMATCHED. No link
            is better than a coin-flip link.

    Assignment is one-to-one and greedy by descending score: a transcript links to
    at most one episode and an episode to at most one transcript. Leftovers are
    reported, never force-fitted.

SHOW ROUTING
    A transcript folder is a YOUTUBE CHANNEL, not a podcast feed, and most of them
    are not podcasts at all. Matching is therefore scoped by an EXPLICIT
    channel → podcast-slug map (TRANSCRIPT_SOURCES). No folder is guessed into a
    show: an unmapped folder is skipped and reported. Cross-show matching is never
    attempted — an episode is only ever compared to transcripts of its own show.

READ-ONLY BY DEFAULT
    --report computes and prints; it writes nothing. --apply is the only path that
    updates mypka.db, and it only ever touches the four transcript_* columns.
    The Apple source database is ALWAYS opened read-only (mode=ro): the Podcasts
    app holds it open and writes to it.

Usable both as a CLI and as a module (the periodic sync imports match_all()).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import sys
import unicodedata
from dataclasses import dataclass, field
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

# ── repo layout ──────────────────────────────────────────────────────────────
# scripts/lib/<this file> → Expansions/mypka-cockpit/scripts/lib → repo root is
# four parents up. Overridable with MYPKA_ROOT for tests.
ROOT = Path(os.environ.get("MYPKA_ROOT")
            or Path(__file__).resolve().parents[4])
DB_PATH = ROOT / "mypka.db"

APPLE_DB = (Path.home() / "Library/Group Containers"
            / "243LU875E5.groups.com.apple.podcasts/Documents/MTLibrary.sqlite")

TRANSCRIPT_ROOT = Path("PKM/Documents/YouTube-Kennis")

# CoreData epoch → Unix epoch (seconds between 1970-01-01 and 2001-01-01).
COREDATA_EPOCH_OFFSET = 978307200

# ── show routing ─────────────────────────────────────────────────────────────
# transcript folder (a YouTube channel) → podcast slug (a `podcasts.slug`).
# EXPLICIT ON PURPOSE. Add a line here when a new channel turns out to be a
# podcast Sander also follows in Apple Podcasts. Everything else under
# PKM/Documents/YouTube-Kennis/ is a plain YouTube channel and is skipped.
TRANSCRIPT_SOURCES: dict[str, str] = {
    "Dartpraat Podcast": "dartpraat",
    # "Sportnieuws.nl Darts Draait Door": <no podcast>,
    #   135 transcripts, but there is NO matching show in Apple Podcasts —
    #   verified 2026-08-19: no ZMTPODCAST title matches, and zero ZMTEPISODE
    #   rows match '%draait door%' or a Sportnieuws author. Not a spelling
    #   variant, not an unfollowed leftover: the show is simply absent from the
    #   store. Left unmapped deliberately; see the session log.
}

FUZZY_THRESHOLD = 0.82        # minimum SequenceMatcher ratio to accept
FUZZY_TOKEN_GUARD = 0.50      # minimum Jaccard token overlap alongside the ratio
TIE_WINDOW = 0.02             # scores within this are a tie → tiebreakers
TIE_MARGIN = 0.05             # title-margin a tiebreak winner must clear
ORDINAL_DATE_TOLERANCE_DAYS = 7   # YouTube upload vs RSS publish drift
ORDINAL_TOKEN_GUARD = 0.30    # fallback corroboration when no date is available

SEASON_EPISODE_RE = re.compile(r"\bS(\d{1,2})\s?E(\d{1,3})\b", re.IGNORECASE)
LEADING_INDEX_RE = re.compile(r"^\s*\d{1,4}\s*[-–—]\s*")
VIDEO_ID_RE = re.compile(r"\[([A-Za-z0-9_-]{6,})\]\s*$")
# "Aflevering 33", "Afl. 33", "Episode 12", "Ep 7" — the word-led ordinal.
ORDINAL_WORD_RE = re.compile(
    r"\b(?:aflevering|afl\.?|episode|ep\.?)\s*#?\s*(\d{1,3})\b", re.IGNORECASE)

# ── date extraction from a transcript title ──────────────────────────────────
# These files have NO frontmatter and NO date field. The ONLY date that exists is
# the one the channel put in the video title, in whatever shape it felt like that
# week. All three observed shapes are handled; anything else yields None (and the
# date tiebreaker simply does not fire for that transcript).
NL_MONTHS = {
    "jan": 1, "januari": 1, "feb": 2, "februari": 2, "mrt": 3, "maa": 3,
    "maart": 3, "apr": 4, "april": 4, "mei": 5, "jun": 6, "juni": 6,
    "jul": 7, "juli": 7, "aug": 8, "augustus": 8, "sep": 9, "sept": 9,
    "september": 9, "okt": 10, "oktober": 10, "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}
DATE_NUMERIC_RE = re.compile(r"\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})\b")
DATE_WORD_RE = re.compile(r"\b(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})\b", re.IGNORECASE)


# ── normalization helpers ────────────────────────────────────────────────────
def slugify(text: str, max_len: int = 80) -> str:
    """GL-001 slug: lowercase ASCII kebab-case, no underscores, no doubles."""
    if not text:
        return ""
    s = unicodedata.normalize("NFKD", str(text))
    s = s.encode("ascii", "ignore").decode("ascii").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    if max_len and len(s) > max_len:
        s = s[:max_len].rstrip("-")
    return s


def normalize_title(title: str, show_title: str | None = None,
                    drop_season_token: bool = False) -> str:
    """Comparable form of a title: de-accented lowercase words only.

    Strips, in order: the leading "NN - " index a transcript filename carries, a
    leading show-name prefix ("Dartpraat S03E15 …" → "S03E15 …"), and optionally
    the SxxEyy token itself (for the fuzzy pass, where the token would otherwise
    dominate the character ratio and mask a real title mismatch).
    """
    if not title:
        return ""
    s = unicodedata.normalize("NFKD", str(title))
    s = s.encode("ascii", "ignore").decode("ascii").lower()
    s = LEADING_INDEX_RE.sub("", s)
    if show_title:
        prefix = unicodedata.normalize("NFKD", show_title)
        prefix = prefix.encode("ascii", "ignore").decode("ascii").lower().strip()
        if prefix and s.startswith(prefix):
            s = s[len(prefix):]
    if drop_season_token:
        s = SEASON_EPISODE_RE.sub(" ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def season_episode(title: str, season: int | None = None,
                   episode: int | None = None) -> tuple[int, int] | None:
    """(season, episode) from the title token, falling back to structured fields.

    Title first by design: Apple's structured columns are sparsely populated
    (986 / 2865 of 4732 rows) while the token in the title is present on every
    Dartpraat row.
    """
    m = SEASON_EPISODE_RE.search(title or "")
    if m:
        return int(m.group(1)), int(m.group(2))
    if season is not None and episode is not None:
        return int(season), int(episode)
    return None


def episode_ordinal(title: str, show_title: str | None = None) -> int | None:
    """A bare episode ordinal, for titles WITHOUT an SxxEyy token.

    Two shapes, in order of confidence:
      1. word-led — "Aflevering 33", "Afl. 12", "Episode 7" (the YouTube side);
      2. show-led — "Dartpraat 33 - Met …" (the Apple side): the show name,
         then the number, then a dash. The trailing dash is required, so a title
         like "Dartpraat 2024 preview" cannot be read as episode 2024.
    Returns None when the title carries a season token — that is tier 1's job.
    """
    if not title or SEASON_EPISODE_RE.search(title):
        return None
    m = ORDINAL_WORD_RE.search(title)
    if m:
        return int(m.group(1))
    s = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode().lower()
    prefix = ""
    if show_title:
        prefix = (unicodedata.normalize("NFKD", show_title)
                  .encode("ascii", "ignore").decode().lower().strip())
    pat = (rf"^\s*{re.escape(prefix)}\s*[-–—:]?\s*(\d{{1,3}})\s*[-–—:]"
           if prefix else r"^\s*(\d{1,3})\s*[-–—:]")
    m = re.search(pat, s)
    return int(m.group(1)) if m else None


def date_from_title(title: str) -> str | None:
    """ISO date parsed out of a title, or None.

    Handles "[02-05-2024]" / "[17/8/23]" (day-first — these are Dutch titles, so
    05 is the month, never May 2nd) and "[13 juli 2023]" / "[21 sept 2023]"
    (Dutch month names, abbreviated or not).
    """
    if not title:
        return None
    s = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    m = DATE_WORD_RE.search(s)
    if m:
        month = NL_MONTHS.get(m.group(2).lower())
        if month:
            try:
                return datetime(int(m.group(3)), month, int(m.group(1))).date().isoformat()
            except ValueError:
                return None
    m = DATE_NUMERIC_RE.search(s)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if year < 100:
            year += 2000
        try:
            return datetime(year, month, day).date().isoformat()
        except ValueError:
            return None
    return None


def _tokens(s: str) -> set[str]:
    return {t for t in s.split() if len(t) > 1}


def token_overlap(a: str, b: str) -> float:
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


# ── data shapes ──────────────────────────────────────────────────────────────
@dataclass
class Transcript:
    path: str                       # root-relative, the value for transcript_path
    title: str                      # H1 of the file, else the cleaned filename
    channel: str                    # transcript folder name
    podcast_slug: str               # resolved via TRANSCRIPT_SOURCES
    video_id: str | None = None
    video_url: str | None = None
    published_on: str | None = None  # ISO date when known — today's corpus: None


@dataclass
class Episode:
    guid: str
    title: str
    podcast_slug: str
    show_title: str | None = None
    pubdate: str | None = None       # ISO
    season_number: int | None = None
    episode_number: int | None = None


@dataclass
class Match:
    guid: str
    transcript_path: str
    method: str
    score: float


@dataclass
class MatchResult:
    matches: list[Match] = field(default_factory=list)
    unmatched_transcripts: list[Transcript] = field(default_factory=list)
    unmatched_episodes: list[Episode] = field(default_factory=list)
    ambiguous: list[dict] = field(default_factory=list)
    skipped_channels: list[str] = field(default_factory=list)


# ── transcript scanning ──────────────────────────────────────────────────────
def read_transcript(path: Path, channel: str, podcast_slug: str) -> Transcript:
    """Parse a transcript file's header.

    These files have NO YAML frontmatter (verified). The shape is:
        # <Title>
        - **Video:** https://www.youtube.com/watch?v=<id>
        - **Ondertitel-taal:** …
        - **Bron:** …
    So the title comes from the H1 and the video id from the filename's trailing
    [<id>] (with the **Video:** line as a fallback). No date is present anywhere
    in the file — hence published_on stays None and the date tiebreaker is inert.
    """
    title, video_url = "", None
    try:
        with path.open("r", encoding="utf-8", errors="replace") as fh:
            for _ in range(20):
                line = fh.readline()
                if not line:
                    break
                if not title and line.startswith("# "):
                    title = line[2:].strip()
                if video_url is None and "**Video:**" in line:
                    m = re.search(r"https?://\S+", line)
                    if m:
                        video_url = m.group(0).rstrip(")")
    except OSError:
        pass

    stem = path.stem
    if not title:
        title = LEADING_INDEX_RE.sub("", VIDEO_ID_RE.sub("", stem)).strip()

    m = VIDEO_ID_RE.search(stem)
    video_id = m.group(1) if m else None
    if video_id is None and video_url:
        m = re.search(r"[?&]v=([A-Za-z0-9_-]+)", video_url)
        video_id = m.group(1) if m else None

    return Transcript(
        path=str(path.relative_to(ROOT)),
        title=title,
        channel=channel,
        podcast_slug=podcast_slug,
        video_id=video_id,
        video_url=video_url,
        published_on=date_from_title(title),
    )


def scan_transcripts(root: Path = ROOT,
                     sources: dict[str, str] | None = None
                     ) -> tuple[list[Transcript], list[str]]:
    """All transcripts of MAPPED channels + the list of channels we skipped."""
    sources = TRANSCRIPT_SOURCES if sources is None else sources
    base = root / TRANSCRIPT_ROOT
    out: list[Transcript] = []
    skipped: list[str] = []
    if not base.is_dir():
        return out, skipped
    for folder in sorted(p for p in base.iterdir() if p.is_dir()):
        slug = sources.get(folder.name)
        if not slug:
            skipped.append(folder.name)
            continue
        for f in sorted(folder.glob("*.md")):
            out.append(read_transcript(f, folder.name, slug))
    return out, skipped


# ── the matcher ──────────────────────────────────────────────────────────────
def _candidates(t: Transcript, episodes: list[Episode]) -> list[tuple[float, str, Episode]]:
    """(score, method, episode) for every episode of the transcript's show that
    clears its tier's bar. Never crosses shows."""
    same_show = [e for e in episodes if e.podcast_slug == t.podcast_slug]
    t_se = season_episode(t.title)
    out: list[tuple[float, str, Episode]] = []
    for e in same_show:
        # Two readings of the episode's season/episode, kept apart ON PURPOSE:
        #   e_se_title  — from the title token only. Authoritative when present.
        #   e_se        — title token, falling back to Apple's structured columns.
        # The fallback may ONLY be used to confirm a season token the transcript
        # also has. It must never be allowed to manufacture an (S,E) pair for an
        # episode whose title has none, because that would mask the whole ordinal
        # tier: Apple assigns ZSEASONNUMBER 1 / ZEPISODENUMBER 33 to a title that
        # reads plain "Dartpraat 33 - …", and those columns are demonstrably wrong
        # on real rows ("Dartpraat 18" carries 21, "Dartpraat 28" carries 27).
        e_se_title = season_episode(e.title)
        e_se = e_se_title or season_episode(e.title, e.season_number, e.episode_number)
        # tier 1 — SxxEyy identity
        if t_se and e_se and t_se == e_se:
            out.append((1.0, "season_episode", e))
            continue
        # tier 2 — bare episode ordinal, but only when corroborated
        if not t_se and not e_se_title:
            t_ord = episode_ordinal(t.title)
            e_ord = episode_ordinal(e.title, e.show_title)
            if t_ord is not None and t_ord == e_ord:
                corroborated = False
                if t.published_on and e.pubdate:
                    try:
                        delta = abs((datetime.fromisoformat(e.pubdate[:10])
                                     - datetime.fromisoformat(t.published_on[:10])).days)
                        corroborated = delta <= ORDINAL_DATE_TOLERANCE_DAYS
                    except ValueError:
                        corroborated = False
                if not corroborated:
                    corroborated = token_overlap(
                        normalize_title(t.title, e.show_title, drop_season_token=True),
                        normalize_title(e.title, e.show_title, drop_season_token=True),
                    ) >= ORDINAL_TOKEN_GUARD
                if corroborated:
                    out.append((0.90, "episode_ordinal", e))
                    continue
        # tier 3 — normalized titles equal
        tn = normalize_title(t.title, e.show_title)
        en = normalize_title(e.title, e.show_title)
        if tn and tn == en:
            out.append((0.95, "normalized_title_exact", e))
            continue
        # tier 4 — fuzzy, with the token-overlap guard
        tf = normalize_title(t.title, e.show_title, drop_season_token=True)
        ef = normalize_title(e.title, e.show_title, drop_season_token=True)
        ratio = similarity(tf, ef)
        if ratio >= FUZZY_THRESHOLD and token_overlap(tf, ef) >= FUZZY_TOKEN_GUARD:
            out.append((round(ratio, 4), "fuzzy_title", e))
    out.sort(key=lambda x: -x[0])
    return out


def _date_tiebreak(t: Transcript, tied: list[tuple[float, str, Episode]]):
    """Closest pubdate to the transcript's own publication date.

    Returns None when the transcript has no parseable date, or when two
    candidates are EQUALLY close (a date that does not separate is not a
    tiebreaker — falling through to the title margin is the honest move).
    """
    if not t.published_on:
        return None
    try:
        tdate = datetime.fromisoformat(t.published_on[:10])
    except ValueError:
        return None
    ranked = []
    for cand in tied:
        pub = cand[2].pubdate
        if not pub:
            continue
        try:
            edate = datetime.fromisoformat(pub[:10])
        except ValueError:
            continue
        ranked.append((abs((edate - tdate).days), cand))
    if not ranked:
        return None
    ranked.sort(key=lambda x: x[0])
    if len(ranked) > 1 and ranked[0][0] == ranked[1][0]:
        return None
    return ranked[0][1]


def _title_margin_tiebreak(t: Transcript, tied: list[tuple[float, str, Episode]]):
    """Full-title similarity, accepted only on a clear margin over the runner-up.

    Resolves the duplicate-upload case (a show posting both "S02E04 - Met X" and
    "S02E04 (alleen audio) - Met X"): both are perfect SxxEyy candidates, and the
    video transcript belongs to the one whose title it actually resembles.
    """
    ranked = []
    for cand in tied:
        e = cand[2]
        ranked.append((similarity(normalize_title(t.title, e.show_title),
                                  normalize_title(e.title, e.show_title)), cand))
    ranked.sort(key=lambda x: -x[0])
    if len(ranked) < 2 or (ranked[0][0] - ranked[1][0]) < TIE_MARGIN:
        return None
    return ranked[0][1]


def match_all(transcripts: list[Transcript], episodes: list[Episode],
              skipped_channels: list[str] | None = None) -> MatchResult:
    """One-to-one greedy assignment, strongest evidence first."""
    res = MatchResult(skipped_channels=list(skipped_channels or []))

    scored: list[tuple[float, str, Transcript, Episode]] = []
    for t in transcripts:
        cands = _candidates(t, episodes)
        if not cands:
            continue
        top = cands[0]
        tied = [c for c in cands if abs(c[0] - top[0]) <= TIE_WINDOW]
        if len(tied) > 1:
            winner = _date_tiebreak(t, tied) or _title_margin_tiebreak(t, tied)
            if winner is None:
                res.ambiguous.append({
                    "transcript": t.path,
                    "transcript_title": t.title,
                    "transcript_date": t.published_on,
                    "reason": "neither the publication date nor the title margin "
                              "separates the candidates — left unmatched on purpose",
                    "candidates": [
                        {"guid": c[2].guid, "title": c[2].title,
                         "method": c[1], "score": c[0], "pubdate": c[2].pubdate}
                        for c in tied],
                })
                continue
            top = winner
        scored.append((top[0], top[1], t, top[2]))

    scored.sort(key=lambda x: -x[0])
    used_t: set[str] = set()
    used_e: set[str] = set()
    for score, method, t, e in scored:
        if t.path in used_t or e.guid in used_e:
            continue
        used_t.add(t.path)
        used_e.add(e.guid)
        res.matches.append(Match(guid=e.guid, transcript_path=t.path,
                                 method=method, score=score))

    res.unmatched_transcripts = [t for t in transcripts if t.path not in used_t]
    res.unmatched_episodes = [
        e for e in episodes
        if e.podcast_slug in {t.podcast_slug for t in transcripts}
        and e.guid not in used_e
    ]
    return res


# ── episode loaders ──────────────────────────────────────────────────────────
def load_episodes_from_mirror(db_path: Path = DB_PATH,
                              podcast_slugs: list[str] | None = None) -> list[Episode]:
    """Episodes from the cockpit mirror (`podcast_episodes` + `podcasts`)."""
    if not db_path.exists():
        return []
    con = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    try:
        have = {r[0] for r in con.execute(
            "SELECT name FROM sqlite_master WHERE type='table'")}
        if "podcast_episodes" not in have:
            return []
        sql = ("SELECT e.guid, e.title, e.podcast_slug, e.pubdate, "
               "       e.season_number, e.episode_number, p.title AS show_title "
               "FROM podcast_episodes e "
               "LEFT JOIN podcasts p ON p.slug = e.podcast_slug")
        params: list = []
        if podcast_slugs:
            sql += (" WHERE e.podcast_slug IN (%s)"
                    % ",".join("?" for _ in podcast_slugs))
            params = list(podcast_slugs)
        return [Episode(guid=r["guid"], title=r["title"] or "",
                        podcast_slug=r["podcast_slug"] or "",
                        show_title=r["show_title"], pubdate=r["pubdate"],
                        season_number=r["season_number"],
                        episode_number=r["episode_number"])
                for r in con.execute(sql, params)]
    finally:
        con.close()


def load_episodes_from_apple(apple_db: Path = APPLE_DB,
                             podcast_slugs: list[str] | None = None) -> list[Episode]:
    """Episodes straight from Apple's store — ALWAYS read-only (mode=ro): the
    Podcasts app holds this file open and writes to it.

    Lets the matcher be exercised (and the match rate measured) BEFORE the
    periodic sync exists. The sync itself should prefer load_episodes_from_mirror.
    """
    if not apple_db.exists():
        return []
    con = sqlite3.connect(f"file:{apple_db}?mode=ro", uri=True)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(
            "SELECT e.ZGUID guid, e.ZTITLE title, e.ZSEASONNUMBER season, "
            "       e.ZEPISODENUMBER episode, p.ZTITLE show_title, "
            "       datetime(e.ZPUBDATE + ?, 'unixepoch') pubdate "
            "FROM ZMTEPISODE e LEFT JOIN ZMTPODCAST p ON p.Z_PK = e.ZPODCAST",
            (COREDATA_EPOCH_OFFSET,)).fetchall()
    finally:
        con.close()
    out = []
    for r in rows:
        slug = slugify(r["show_title"] or "")
        if podcast_slugs and slug not in podcast_slugs:
            continue
        out.append(Episode(guid=r["guid"], title=r["title"] or "",
                           podcast_slug=slug, show_title=r["show_title"],
                           pubdate=r["pubdate"], season_number=r["season"],
                           episode_number=r["episode"]))
    return out


# ── apply ────────────────────────────────────────────────────────────────────
def apply_matches(result: MatchResult, db_path: Path = DB_PATH) -> int:
    """Write the four transcript_* columns. Touches NOTHING else.

    Idempotent: re-running with the same corpus writes the same values. Rows that
    lost their match (transcript deleted) are cleared, so a stale link can never
    outlive the file it points at.
    """
    con = sqlite3.connect(str(db_path))
    try:
        have = {r[0] for r in con.execute(
            "SELECT name FROM sqlite_master WHERE type='table'")}
        if "podcast_episodes" not in have:
            raise SystemExit(
                "podcast_episodes is absent — run:\n"
                "  python3 Expansions/mypka-cockpit/sqlite-extension/"
                "install-extensions.py mypka.db --with-libraries --with-podcasts")
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        # Clear first, then set: a transcript that was deleted or renamed must not
        # leave a dangling link behind. 'manual' links are never touched — a human
        # assertion outranks anything this matcher computes.
        con.execute(
            "UPDATE podcast_episodes SET transcript_path = NULL, "
            "transcript_match_method = NULL, transcript_match_score = NULL, "
            "transcript_matched_at = NULL "
            "WHERE transcript_path IS NOT NULL AND transcript_match_method <> 'manual'")
        n = 0
        for m in result.matches:
            cur = con.execute(
                "UPDATE podcast_episodes SET transcript_path = ?, "
                "transcript_match_method = ?, transcript_match_score = ?, "
                "transcript_matched_at = ?, "
                "file_path = COALESCE(file_path, ?) "
                "WHERE guid = ? AND (transcript_match_method IS NULL "
                "                    OR transcript_match_method <> 'manual')",
                (m.transcript_path, m.method, m.score, now, m.transcript_path, m.guid))
            n += cur.rowcount
        con.commit()
        return n
    finally:
        con.close()


# ── CLI ──────────────────────────────────────────────────────────────────────
def _report(result: MatchResult, transcripts: list[Transcript],
            episodes: list[Episode], as_json: bool) -> None:
    per_method: dict[str, int] = {}
    for m in result.matches:
        per_method[m.method] = per_method.get(m.method, 0) + 1
    per_show: dict[str, dict] = {}
    by_guid = {e.guid: e for e in episodes}
    for m in result.matches:
        slug = by_guid[m.guid].podcast_slug
        d = per_show.setdefault(slug, {"matched": 0, "transcripts": 0})
        d["matched"] += 1
    for t in transcripts:
        per_show.setdefault(t.podcast_slug, {"matched": 0, "transcripts": 0})
        per_show[t.podcast_slug]["transcripts"] += 1
    for slug, d in per_show.items():
        d["rate"] = round(d["matched"] / d["transcripts"], 4) if d["transcripts"] else None

    payload = {
        "transcripts_scanned": len(transcripts),
        "episodes_considered": len(episodes),
        "matched": len(result.matches),
        "per_method": per_method,
        "per_show": per_show,
        "ambiguous": result.ambiguous,
        "unmatched_transcripts": [
            {"path": t.path, "title": t.title} for t in result.unmatched_transcripts],
        "skipped_channels": result.skipped_channels,
    }
    if as_json:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return
    print(f"\n  transcripts scanned : {payload['transcripts_scanned']}")
    print(f"  episodes considered : {payload['episodes_considered']}")
    print(f"  matched             : {payload['matched']}")
    for meth, n in sorted(per_method.items(), key=lambda x: -x[1]):
        print(f"      {meth:24s} {n}")
    print("\n  per show:")
    for slug, d in sorted(per_show.items()):
        rate = "n/a" if d["rate"] is None else f"{d['rate'] * 100:.1f}%"
        print(f"      {slug:24s} {d['matched']}/{d['transcripts']} transcripts linked ({rate})")
    if result.ambiguous:
        print(f"\n  AMBIGUOUS (left unmatched): {len(result.ambiguous)}")
        for a in result.ambiguous[:10]:
            print(f"      {a['transcript_title']}  →  "
                  f"{', '.join(c['title'] for c in a['candidates'])}")
    if result.unmatched_transcripts:
        print(f"\n  transcripts without an episode: {len(result.unmatched_transcripts)}")
        for t in result.unmatched_transcripts[:15]:
            print(f"      {t.title}")
        if len(result.unmatched_transcripts) > 15:
            print(f"      … and {len(result.unmatched_transcripts) - 15} more")
    if result.skipped_channels:
        print(f"\n  unmapped transcript channels (not podcasts, or no feed in "
              f"Apple Podcasts): {len(result.skipped_channels)}")
        for c in result.skipped_channels:
            print(f"      {c}")
    print()


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--source", choices=("mirror", "apple"), default="mirror",
                    help="where episodes come from: the cockpit mirror (default) "
                         "or Apple's store read-only (works before the sync exists)")
    ap.add_argument("--db", default=str(DB_PATH), help="path to mypka.db")
    ap.add_argument("--apply", action="store_true",
                    help="write the transcript_* columns (default is report-only)")
    ap.add_argument("--json", action="store_true", help="machine-readable report")
    args = ap.parse_args(argv)

    transcripts, skipped = scan_transcripts()
    slugs = sorted({t.podcast_slug for t in transcripts})
    if args.source == "apple":
        episodes = load_episodes_from_apple(podcast_slugs=slugs)
    else:
        episodes = load_episodes_from_mirror(Path(args.db), podcast_slugs=slugs)
        if not episodes:
            print("  No episodes in the mirror yet — falling back to Apple's store "
                  "(read-only) so the match rate is still measurable.",
                  file=sys.stderr)
            episodes = load_episodes_from_apple(podcast_slugs=slugs)

    result = match_all(transcripts, episodes, skipped)
    _report(result, transcripts, episodes, args.json)

    if args.apply:
        n = apply_matches(result, Path(args.db))
        print(f"  applied: {n} podcast_episodes rows updated\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
