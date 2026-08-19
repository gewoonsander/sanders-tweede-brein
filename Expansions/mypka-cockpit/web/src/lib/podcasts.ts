// podcasts.ts — the Podcasts module's client-side API seam + display helpers.
//
// Same split as lib/fleeting.ts / lib/connectors.ts: URL building and the write
// call live here, the view files stay about rendering. The ONE write rides the
// shared cockpitWrite envelope (X-Cockpit CSRF belt + same-origin session
// cookie) so it inherits the localWriteGuard contract without restating it.
//
// WHAT THIS FILE DELIBERATELY DOES NOT DO
// It never derives a listening state. `effective_play_state`,
// `effective_is_finished`, `effective_watch_source` and
// `effective_percent_complete` arrive pre-computed from
// `v_podcast_episodes_effective` and are read verbatim. A JS re-implementation
// of that CASE would be a second truth that silently rots the next time either
// input changes (DATA-CONTRACT §18.9).
import { cockpitWrite, type WriteResult } from './useCockpitWrite';
import type {
  PodcastEpisodeState,
  PodcastWatchPlatform,
  PodcastWatchWriteResult,
} from './cockpitTypes';

// ── The state filter, in the order the dropdown lists it ─────────────────────
// 'listened' is the server default and the one Sander actually opens the page
// for; 'manual' is the audit view over the override itself.
export const PODCAST_EPISODE_STATES: readonly PodcastEpisodeState[] = [
  'listened', 'played', 'in-progress', 'unplayed', 'manual', 'all',
];

/** Rows per page. Well under the server's 500 hard cap and its 100 default: a
 *  page has to stay scannable AND keyboard-traversable, and every row carries an
 *  interactive checkbox — 50 tab stops is already the ceiling of reasonable. */
export const PODCAST_PAGE_SIZE = 50;

/** Platforms the UI offers when the server hasn't told us its own list yet.
 *  The server's `platforms` array always wins when present — this is only the
 *  pre-flight default so the checkbox is never platform-less. */
export const PODCAST_DEFAULT_PLATFORM: PodcastWatchPlatform = 'youtube';

export interface EpisodeQuery {
  /** A podcast slug, or null for "across all shows". */
  show: string | null;
  state: PodcastEpisodeState;
  /** Free-text over the episode title. Empty string = no filter. */
  q: string;
  limit: number;
  offset: number;
}

/** Build the paginated episode-list URL. Empty parameters are OMITTED rather
 *  than sent blank, so the server's own defaults stay in charge of them. */
export function episodesUrl({ show, state, q, limit, offset }: EpisodeQuery): string {
  const params = new URLSearchParams();
  if (show) params.set('show', show);
  params.set('state', state);
  const trimmed = q.trim();
  if (trimmed) params.set('q', trimmed);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return `/api/cockpit/podcasts/episodes?${params.toString()}`;
}

export function episodeUrl(slug: string): string {
  return `/api/cockpit/podcasts/episodes/${encodeURIComponent(slug)}`;
}

// ── The ONE write ─────────────────────────────────────────────────────────────
// Scope-locked by the server to three columns. The response echoes the row back
// from the view; callers replace their local row with THAT, never with a guess.

/** Tick "ook gezien via <platform>". Monotone by design: it can only ever ADD
 *  "gezien" on top of Apple's state, never take it away. */
export function markEpisodeWatched(
  slug: string,
  platform: PodcastWatchPlatform,
): Promise<WriteResult<PodcastWatchWriteResult>> {
  return cockpitWrite<PodcastWatchWriteResult>(
    `${episodeUrl(slug)}/watched`,
    'PATCH',
    { watched: true, platform },
  );
}

/** Untick. `platform` MUST be omitted — the server 400s on a platform here,
 *  because unticking nulls all three columns and a platform would be a lie. */
export function clearEpisodeWatched(
  slug: string,
): Promise<WriteResult<PodcastWatchWriteResult>> {
  return cockpitWrite<PodcastWatchWriteResult>(
    `${episodeUrl(slug)}/watched`,
    'PATCH',
    { watched: false },
  );
}

// ── Transcript bridge ─────────────────────────────────────────────────────────

/**
 * Turn a `transcript_path` into the `src` of a { name: 'file' } route.
 *
 * WHY THE PREFIX SURGERY: `transcript_path` is REPO-ROOT-relative
 * ("PKM/Documents/YouTube-Kennis/<Channel>/<file>.md" — see
 * scripts/lib/podcast_transcript_match.py, which stores `path.relative_to(ROOT)`).
 * The cockpit's /api/cockpit/file route resolves anything that is not a
 * Deliverables/ or Team Knowledge/ path against PKM_DIR, so handing it the
 * root-relative form would resolve to PKM/PKM/Documents/… and 404. Stripping the
 * leading "PKM/" is the whole adaptation; every other root passes through
 * untouched so the route's own jail routing still applies.
 *
 * Returns null for an absent path so the caller renders "no transcript" instead
 * of a link that goes nowhere.
 */
export function transcriptFileSrc(transcriptPath: string | null): string | null {
  if (!transcriptPath) return null;
  const norm = transcriptPath.replace(/\\/g, '/').trim();
  if (!norm) return null;
  return norm.startsWith('PKM/') ? norm.slice('PKM/'.length) : norm;
}

/** A fuzzy/normalised-title match is an inference, not a fact. Anything under
 *  this threshold is labelled "probable match" in the UI rather than presented
 *  as a certainty (schema/09-module-podcasts.sql, transcript_match_score). */
export const TRANSCRIPT_CERTAIN_SCORE = 0.95;

export function isProbableTranscriptMatch(score: number | null): boolean {
  return score != null && score < TRANSCRIPT_CERTAIN_SCORE;
}

// ── Artwork ───────────────────────────────────────────────────────────────────

/**
 * Whether the app is allowed to fetch artwork from Apple's CDN.
 *
 * IT IS NOT, TODAY — and this constant exists so that is a documented decision
 * instead of a page full of silently blocked requests. server/server.js's
 * APP_CSP sets `img-src 'self' data:`, so every https://*.mzstatic.com image the
 * mirror stores is refused by the browser before it leaves the page. Rendering
 * the <img> anyway would mean ~20 blocked requests and ~20 console CSP
 * violations per page load, all resolving to the same fallback glyph we can
 * render for free.
 *
 * WHY THIS IS NOT FIXED HERE: widening `img-src` to a third-party CDN is a
 * security-posture change on the server, which is Argus's call, not the
 * frontend's. The alternative — proxying artwork through a jailed cockpit route
 * — is backend work. Flip this to `true` (or make it read a real capability) the
 * moment either lands; nothing else in the view has to change.
 */
export const ARTWORK_REMOTE_ALLOWED = false;

/** Same-origin and data: URLs are always renderable under the current CSP. */
export function isArtworkRenderable(url: string | null): boolean {
  if (!url) return false;
  if (ARTWORK_REMOTE_ALLOWED) return true;
  return url.startsWith('/') || url.startsWith('data:');
}

/**
 * Resolve an Apple artwork URL to a concrete image of `px` pixels.
 *
 * WHY THIS IS NEEDED: the mirror stores Apple's URL VERBATIM, and Apple's URLs
 * are TEMPLATES — they end in `/{w}x{h}bb.{f}`. Verified against the live mirror
 * on 2026-08-19: the raw template returns 404, the substituted form returns a
 * 200 image/jpeg. Handing the template straight to <img src> would silently blank
 * most of the artwork on the page.
 *
 * The size belongs HERE and not in the database: which pixel dimensions a card
 * needs is a rendering decision, and storing one baked size would freeze the
 * layout into the mirror. Rows that already carry a substituted URL (a minority
 * do) pass through untouched, so this is a no-op for them.
 */
export function artworkUrl(raw: string | null, px: number): string | null {
  if (!raw) return null;
  if (!raw.includes('{')) return raw;
  return raw
    .replace('{w}', String(px))
    .replace('{h}', String(px))
    // Apple serves jpg for every template we have seen; png is only ever present
    // in already-substituted URLs, which never reach this branch.
    .replace('{f}', 'jpg');
}

// ── Display helpers (pure, no state derivation) ───────────────────────────────

/** Seconds → "1u 04m" / "42m" / "38s". Returns null when there is no duration,
 *  so the caller omits the field instead of printing a fake zero. */
export function formatDuration(seconds: number | null): string | null {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return null;
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return m > 0 ? `${h}u ${String(m).padStart(2, '0')}m` : `${h}u`;
  if (m > 0) return `${m}m`;
  return `${total}s`;
}

/** An ISO date(-time) → a short, locale-aware date. `intlTag` is the BCP-47 tag
 *  from i18n's `intlLocale()`, so the whole app formats dates one way. Invalid or
 *  absent input returns null (never "Invalid Date"), so a sparse column — and
 *  `last_played_date` is sparse: 77 of 4732 rows carry one — simply doesn't
 *  render rather than printing a broken string. */
export function formatDate(iso: string | null, intlTag: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(intlTag, {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** "S02E14" when both numbers are present, "E14" when only the episode is.
 *  Null when neither — plenty of feeds carry no numbering at all. */
export function formatSeasonEpisode(
  season: number | null,
  episode: number | null,
): string | null {
  if (season != null && episode != null) {
    return `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
  }
  if (episode != null) return `E${String(episode).padStart(2, '0')}`;
  if (season != null) return `S${String(season).padStart(2, '0')}`;
  return null;
}
