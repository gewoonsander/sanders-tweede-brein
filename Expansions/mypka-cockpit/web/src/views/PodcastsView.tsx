// PodcastsView.tsx — the PODCASTS surface (DATA-CONTRACT §18).
//
//   #/podcasts                 → the SHOWS overview: one card per podcast, plus a
//                                lead card into "all episodes".
//   #/podcasts/all             → every episode, paginated + filterable.
//   #/podcasts/show/:slug      → one show's episodes, same list, pre-filtered.
//   #/podcasts/episode/:slug   → one episode in the large detail view.
//
// Reads server/podcastsApi.js. Follows the Library surface's shape (picker →
// list → detail-large, one route name, deep-linkable) and reuses its shared
// chrome (.filter-bar, .library-empty, .back-button, .note-*), so this lands as
// another library rather than a new dialect.
//
// TWO THINGS THIS VIEW WILL NOT DO
//
// 1. IT NEVER DERIVES A LISTENING STATE. `effective_play_state`,
//    `effective_is_finished`, `effective_watch_source` and
//    `effective_percent_complete` come pre-computed from
//    `v_podcast_episodes_effective` and are rendered verbatim. Re-implementing
//    that CASE here would be a second truth that rots on the next sync (§18.9).
//    It DOES read `play_state` in one place — to say "Apple already has this as
//    played, your tick records where, not whether" — which is the provenance
//    itself, not a re-derivation.
//
// 2. IT NEVER LOADS EVERYTHING. There are 4732 episodes and the number grows
//    every 45 minutes. Filtering and paging are SERVER-side (state / q / limit /
//    offset); the client holds one page. The Library grid's client-side facets
//    are the right tool for a 40-row recipe library and the wrong one here.
//
// Degrades honestly at every level: `available:false` → a calm empty state; a
// 404 from a server started before this module existed → "restart the cockpit";
// `write.available:false` → read-only checkboxes with the reason named once.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowLeft, ChevronRight, ExternalLink, FileText, Info, Podcast as PodcastIcon,
  Search,
} from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { hrefFor, useRoute } from '../lib/router';
import { intlLocale, useLocale, useT } from '../lib/i18n';
import type { TFunction } from '../lib/i18n';
import { PageHeader } from '../components/PageHeader';
import { WikiMarkdown } from '../components/WikiMarkdown';
import { ModuleEmptyState } from '../components/ui';
import { EpisodeWatchToggle } from '../components/podcasts/EpisodeWatchToggle';
import {
  PODCAST_DEFAULT_PLATFORM, PODCAST_EPISODE_STATES, PODCAST_PAGE_SIZE,
  artworkUrl, episodesUrl, episodeUrl, formatDate, formatDuration,
  formatSeasonEpisode, isArtworkRenderable, isProbableTranscriptMatch,
  transcriptFileSrc,
} from '../lib/podcasts';
import type {
  PodcastEpisode, PodcastEpisodeDetail, PodcastEpisodeState,
  PodcastEpisodesResponse, PodcastEpisodeResponse, PodcastShow,
  PodcastWatchPlatform, PodcastWriteStatus, PodcastsOverviewResponse,
} from '../lib/cockpitTypes';
import './podcasts.css';

// The id every disabled checkbox points at with aria-describedby, so the "why is
// this read-only" sentence is announced once per page instead of 50 times.
const WRITE_NOTICE_ID = 'pod-write-notice';

// The server's platform vocabulary is authoritative; this is only the pre-flight
// fallback for a payload that predates the `platforms` field.
const FALLBACK_PLATFORMS: readonly PodcastWatchPlatform[] = [PODCAST_DEFAULT_PLATFORM];

// The state dropdown's labels, keyed by the value the server understands.
const STATE_LABEL_KEY = {
  listened: 'podcasts.stateListened',
  played: 'podcasts.statePlayed',
  'in-progress': 'podcasts.stateInProgress',
  unplayed: 'podcasts.stateUnplayed',
  manual: 'podcasts.stateManual',
  all: 'podcasts.stateAll',
} as const satisfies Record<PodcastEpisodeState, string>;

/** The cockpit server currently running may have been started before the podcast
 *  routes existed, in which case every read 404s. That is a DEPLOY state, not a
 *  data state, and it deserves its own sentence ("restart the server") instead of
 *  the generic red error strip. useFetch only hands back the message, so this
 *  matches on the status it embeds. */
function isRouteMissing(error: string | null): boolean {
  return !!error && /\b404\b/.test(error);
}

// A show's title is NULLABLE and, on the live mirror, empty for at least one row
// (apple-podcast-1658765213). Never render an empty heading: fall back to a
// labelled placeholder and keep the slug visible so the row stays identifiable.
function showLabel(show: Pick<PodcastShow, 'title' | 'slug'>, t: TFunction): string {
  const title = show.title?.trim();
  return title || t('podcasts.untitledShow');
}

function hasFallbackLabel(show: Pick<PodcastShow, 'title'>): boolean {
  return !show.title?.trim();
}

// =============================================================================
// Shared bits
// =============================================================================

/** The rendered pixel size per artwork slot. Doubled from the CSS box so the art
 *  stays sharp on a 2× display; Apple serves any size the template asks for. */
const ART_PX = { sm: 80, lg: 112 } as const;

/** Artwork, or the glyph mark standing in for it.
 *
 *  TODAY IT IS ALWAYS THE GLYPH: the mirror stores Apple CDN URLs and the app's
 *  CSP (`img-src 'self' data:`) refuses them, so attempting the fetch would only
 *  buy a page of blocked requests and console violations. `isArtworkRenderable`
 *  is the single seam that turns real covers back on — see lib/podcasts.ts.
 *
 *  `alt=""` throughout: the art always sits beside the title it depicts, so a
 *  description would be a duplicate announcement for a screen reader, not extra
 *  information. The glyph branch is `aria-hidden` for the same reason. */
function Artwork({ src, alt, size }: { src: string | null; alt: string; size: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const cls = `pod-art pod-art--${size}`;
  // Apple stores TEMPLATE urls ({w}x{h}bb.{f}); resolve before deciding.
  const resolved = artworkUrl(src, ART_PX[size]);
  if (!resolved || failed || !isArtworkRenderable(resolved)) {
    return (
      <span className={`${cls} pod-art--fallback`} aria-hidden="true">
        <PodcastIcon size={size === 'lg' ? 26 : 18} strokeWidth={1.5} />
      </span>
    );
  }
  return (
    <img
      className={cls}
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/** The effective listening state, rendered exactly as the view computed it.
 *  The watch SOURCE is a separate, visually distinct mark — "Apple says played"
 *  and "I ticked this myself" must never look identical. */
function StatusBadge({ episode }: { episode: PodcastEpisode }) {
  const t = useT();
  const state = episode.effective_play_state;
  const source = episode.effective_watch_source;

  const label =
    state === 'played' ? t('podcasts.badgePlayed')
      : state === 'in-progress' ? t('podcasts.badgeInProgress')
        : state === 'unplayed' ? t('podcasts.badgeUnplayed')
          : t('podcasts.badgeUnknown');

  // `null` is a legal state (the view passes Apple's NULL straight through), so
  // it gets its own tone rather than being coerced into "unplayed".
  const tone = state ?? 'unknown';
  const platform = episode.manual_watched_platform ?? PODCAST_DEFAULT_PLATFORM;
  const sourceTitle =
    source === 'both' ? t('podcasts.sourceBothTitle', { platform })
      : source === 'manual' ? t('podcasts.sourceManualTitle', { platform })
        : source === 'apple' ? t('podcasts.sourceAppleTitle')
          : '';
  const sourceLabel =
    source === 'both' ? t('podcasts.sourceBoth')
      : source === 'manual' ? t('podcasts.sourceManual')
        : source === 'apple' ? t('podcasts.sourceApple')
          : null;

  return (
    <span className="pod-status">
      <span className={`pod-badge pod-badge--${tone}`}>{label}</span>
      {sourceLabel && (
        <span className={`pod-source pod-source--${source}`} title={sourceTitle}>
          {sourceLabel}
        </span>
      )}
    </span>
  );
}

/** In-progress episodes get a progress bar off `effective_percent_complete`.
 *  Nothing renders for the other states — a 0% or 100% bar is noise. */
function ProgressBar({ episode }: { episode: PodcastEpisode }) {
  const t = useT();
  if (episode.effective_play_state !== 'in-progress') return null;
  const raw = episode.effective_percent_complete;
  if (raw == null) return null;
  const value = Math.min(100, Math.max(0, Math.round(raw)));
  return (
    <span
      className="pod-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t('podcasts.progressAria', { percent: value })}
    >
      <span className="pod-progress-fill" style={{ width: `${value}%` }} />
    </span>
  );
}

/** The transcript bridge. Today 0 of 4732 episodes carry a `transcript_path`, so
 *  the ABSENT branch is the one that renders — it has to read as a calm fact, not
 *  as a failure. The link appears on its own the moment the matcher links one.
 *  A sub-threshold match score is labelled as an inference, never as a fact. */
function TranscriptLink({ episode }: { episode: PodcastEpisode }) {
  const t = useT();
  const src = transcriptFileSrc(episode.transcript_path);
  if (!src) {
    return <span className="pod-transcript pod-transcript--none">{t('podcasts.transcriptNone')}</span>;
  }
  const probable = isProbableTranscriptMatch(episode.transcript_match_score);
  const score = episode.transcript_match_score?.toFixed(2) ?? '';
  return (
    <span className="pod-transcript">
      <a className="pod-transcript-link" href={hrefFor({ name: 'file', src })}>
        <FileText size={13} strokeWidth={1.5} aria-hidden="true" />
        {t('podcasts.transcriptOpen')}
      </a>
      {probable && (
        <span
          className="pod-transcript-caveat"
          title={t('podcasts.transcriptProbableTitle', {
            method: episode.transcript_match_method ?? '—',
            score,
          })}
        >
          {t('podcasts.transcriptProbable', { score })}
        </span>
      )}
    </span>
  );
}

/** Named ONCE per page, not once per row: why the checkboxes are read-only.
 *  Every disabled checkbox references this element with aria-describedby. */
function WriteNotice({ write }: { write: PodcastWriteStatus | undefined }) {
  const t = useT();
  if (!write || write.available) return null;
  const body =
    write.reason === 'write-disabled' ? t('podcasts.watchDisabledWrite')
      : write.reason === 'module-absent' ? t('podcasts.watchDisabledModule')
        : t('podcasts.watchDisabledOther', { reason: write.reason ?? '—' });
  return (
    <div className="pod-write-notice" id={WRITE_NOTICE_ID} role="status">
      <strong className="pod-write-notice-title">{t('podcasts.watchDisabledTitle')}</strong>
      <span className="pod-write-notice-body">{body}</span>
    </div>
  );
}

// =============================================================================
// (1) SHOWS OVERVIEW
// =============================================================================
function PodcastShows() {
  const t = useT();
  const { locale } = useLocale();
  const { data, loading, error } = useFetch<PodcastsOverviewResponse>('/api/cockpit/podcasts');
  const topRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, []);

  if (loading) return <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>;

  if (isRouteMissing(error)) {
    return (
      <section className="pod-view">
        <PageHeader title={t('podcasts.title')} icon={PodcastIcon} />
        <ModuleEmptyState title={t('podcasts.notLoadedTitle')} icon={PodcastIcon}>
          {t('podcasts.notLoadedSub')}
        </ModuleEmptyState>
      </section>
    );
  }
  if (error) {
    return <div role="alert" className="view-error">{t('podcasts.loadError', { error })}</div>;
  }

  const shows = data?.shows ?? [];
  const totals = data?.totals ?? null;

  if (!data?.available) {
    return (
      <section className="pod-view">
        <PageHeader title={t('podcasts.title')} icon={PodcastIcon} />
        <ModuleEmptyState title={t('podcasts.unavailableTitle')} icon={PodcastIcon}>
          {t('podcasts.unavailableSub')}
        </ModuleEmptyState>
      </section>
    );
  }

  // The subtitle is the page's one honest summary line. Every SUM() in the
  // overview query is NULL on an empty table, so each part is guarded rather than
  // coerced to 0 — "0 met transcript" and "unknown" are different claims.
  const subtitleParts: string[] = [
    t(shows.length === 1 ? 'podcasts.showsCountOne' : 'podcasts.showsCountOther', { count: shows.length }),
  ];
  if (totals) {
    subtitleParts.push(t(
      totals.episode_count === 1 ? 'podcasts.episodesCountOne' : 'podcasts.episodesCountOther',
      { count: totals.episode_count },
    ));
    if (totals.played_count != null) subtitleParts.push(t('podcasts.playedCount', { count: totals.played_count }));
    if (totals.manual_count) subtitleParts.push(t('podcasts.manualCount', { count: totals.manual_count }));
    if (totals.transcript_count != null) {
      subtitleParts.push(totals.transcript_count > 0
        ? t('podcasts.transcriptCount', { count: totals.transcript_count })
        : t('podcasts.transcriptCountNone'));
    }
  }

  return (
    <section ref={topRef} className="pod-view animate-fade-rise">
      <PageHeader
        title={t('podcasts.title')}
        icon={PodcastIcon}
        subtitle={subtitleParts.join(' · ')}
      />

      <WriteNotice write={data.write} />

      {shows.length === 0 ? (
        <div className="library-empty">
          <span className="library-empty-mark" aria-hidden="true">
            <PodcastIcon size={28} strokeWidth={1.5} />
          </span>
          <p className="library-empty-title">{t('podcasts.emptyTitle')}</p>
          <p className="library-empty-sub">{t('podcasts.emptySub')}</p>
        </div>
      ) : (
        <ul className="pod-show-grid">
          {/* The cross-show entry point. It leads because the state filters —
              "mee bezig", "handmatig gemarkeerd" — are questions about the whole
              library, not about one feed. */}
          <li className="pod-show-li">
            <a className="pod-show-card pod-show-card--all" href={hrefFor({ name: 'podcasts', pane: 'episodes' })}>
              <span className="pod-art pod-art--lg pod-art--fallback" aria-hidden="true">
                <PodcastIcon size={26} strokeWidth={1.5} />
              </span>
              <span className="pod-show-body">
                <span className="pod-show-title">{t('podcasts.allEpisodes')}</span>
                <span className="pod-show-sub">{t('podcasts.allEpisodesSub')}</span>
              </span>
              <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" className="pod-show-chevron" />
            </a>
          </li>

          {shows.map((show) => (
            <ShowCard key={show.slug} show={show} intlTag={intlLocale(locale)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ShowCard({ show, intlTag }: { show: PodcastShow; intlTag: string }) {
  const t = useT();
  const label = showLabel(show, t);
  const lastPlayed = formatDate(show.last_played_date, intlTag);

  const metaParts: string[] = [
    t(show.episode_count === 1 ? 'podcasts.episodesCountOne' : 'podcasts.episodesCountOther',
      { count: show.episode_count }),
  ];
  if (show.played_count) metaParts.push(t('podcasts.playedCount', { count: show.played_count }));
  if (show.manual_count) metaParts.push(t('podcasts.manualCount', { count: show.manual_count }));

  return (
    <li className="pod-show-li">
      <a
        className="pod-show-card"
        href={hrefFor({ name: 'podcasts', pane: 'episodes', show: show.slug })}
        aria-label={t('podcasts.openShow', { show: label })}
      >
        <Artwork src={show.artwork_url} alt="" size="lg" />
        <span className="pod-show-body">
          <span className={`pod-show-title ${hasFallbackLabel(show) ? 'pod-show-title--fallback' : ''}`}>
            {label}
          </span>
          {/* A title-less show is only identifiable by its slug, so the slug
              takes the author's place there instead of leaving the row blank. */}
          {hasFallbackLabel(show)
            ? <span className="pod-show-sub font-mono">{show.slug}</span>
            : show.author && <span className="pod-show-sub">{show.author}</span>}
          <span className="pod-show-meta">{metaParts.join(' · ')}</span>
          {lastPlayed && <span className="pod-show-meta pod-show-meta--quiet">{lastPlayed}</span>}
        </span>
        <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" className="pod-show-chevron" />
      </a>
    </li>
  );
}

// =============================================================================
// (2) EPISODE LIST — server-filtered, server-paginated
// =============================================================================

/** Debounce a fast-changing value (the search box) so a filter keystroke does not
 *  fire a query per character against a 4732-row table. Local because the
 *  codebase has no shared debounce hook and one caller does not justify one. */
function useDebounced<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return settled;
}

function PodcastEpisodes({ show }: { show: string | null }) {
  const t = useT();
  const { locale } = useLocale();
  const intlTag = intlLocale(locale);
  const topRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<PodcastEpisodeState>('listened');
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const debouncedQuery = useDebounced(query, 250);

  // Any filter change invalidates the current page — staying on offset 800 of a
  // result set that just shrank to 12 rows is an empty page, not a filter.
  useEffect(() => { setOffset(0); }, [show, state, debouncedQuery]);

  const url = useMemo(
    () => episodesUrl({ show, state, q: debouncedQuery, limit: PODCAST_PAGE_SIZE, offset }),
    [show, state, debouncedQuery, offset],
  );
  const { data, loading, error } = useFetch<PodcastEpisodesResponse>(url);

  // The page lives in local state so the ONE write can replace a row in place
  // with the server's echo, without refetching the page (which would also lose
  // scroll position and, under the 'manual' filter, make the row vanish
  // mid-interaction).
  const [rows, setRows] = useState<PodcastEpisode[]>([]);
  useEffect(() => { setRows(data?.episodes ?? []); }, [data]);

  const onUpdated = useCallback((updated: PodcastEpisodeDetail) => {
    // The echo IS the full row (SELECT * from the view), so it replaces rather
    // than merges — a merge would keep stale copies of any column the write
    // touched indirectly.
    setRows((prev) => prev.map((r) => (r.slug === updated.slug ? updated : r)));
  }, []);

  // The overview is fetched alongside for two things the list payload cannot
  // give: the SHOW's own title for the header, and the platform vocabulary on a
  // payload that predates `platforms`.
  const { data: overview } = useFetch<PodcastsOverviewResponse>('/api/cockpit/podcasts');
  const currentShow = useMemo(
    () => (show ? overview?.shows.find((s) => s.slug === show) ?? null : null),
    [overview, show],
  );

  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, [show]);

  if (isRouteMissing(error)) {
    return (
      <section className="pod-view">
        <PageHeader title={t('podcasts.title')} icon={PodcastIcon} />
        <ModuleEmptyState title={t('podcasts.notLoadedTitle')} icon={PodcastIcon}>
          {t('podcasts.notLoadedSub')}
        </ModuleEmptyState>
      </section>
    );
  }
  if (error) {
    return <div role="alert" className="view-error">{t('podcasts.loadError', { error })}</div>;
  }

  const total = data?.total ?? 0;
  const write = data?.write;
  const platforms = overview?.platforms ?? FALLBACK_PLATFORMS;
  // While the overview is still in flight on a deep-linked #/podcasts/show/:slug
  // there is no title yet. Falling back to the SLUG keeps the header truthful;
  // falling back to "all episodes" would name a page this is not.
  const heading = show
    ? (currentShow ? showLabel(currentShow, t) : show)
    : t('podcasts.allEpisodes');
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + rows.length, total);
  const canPrev = offset > 0;
  const canNext = !!data?.hasMore;
  // The pager stays MOUNTED across a page load. Unmounting it would destroy the
  // button the user just pressed, dropping keyboard focus to <body> on every
  // page turn — the whole list becomes un-pageable from the keyboard.
  // `offset > 0` keeps the pager present on an over-shot offset (a hand-typed or
  // stale one), so an empty page is never a dead end with no way back.
  const showPager = loading || rows.length > 0 || offset > 0;

  return (
    <section ref={topRef} className="pod-view animate-fade-rise">
      <a className="back-button" href={hrefFor({ name: 'podcasts' })}>
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> {t('podcasts.backToShows')}
      </a>
      <PageHeader
        title={heading}
        icon={PodcastIcon}
        subtitle={t(total === 1 ? 'podcasts.episodesCountOne' : 'podcasts.episodesCountOther', { count: total })}
      />

      <WriteNotice write={write} />

      <div className="filter-bar" role="search">
        <label className="filter-search">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" className="filter-search-icon" />
          <input
            type="search"
            className="filter-search-input"
            placeholder={t('podcasts.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('podcasts.searchAria')}
          />
        </label>
        <label className="filter-facet">
          <span className="filter-facet-label">{t('podcasts.stateLabel')}</span>
          <select
            className="filter-select"
            value={state}
            aria-label={t('podcasts.stateAria')}
            onChange={(e) => setState(e.target.value as PodcastEpisodeState)}
          >
            {PODCAST_EPISODE_STATES.map((s) => (
              <option key={s} value={s}>{t(STATE_LABEL_KEY[s])}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>
      ) : rows.length === 0 ? (
        <div className="library-noresults" role="status">{t('podcasts.noResults')}</div>
      ) : (
        <ul className="pod-episode-list">
          {rows.map((ep) => (
            <EpisodeRow
              key={ep.slug}
              episode={ep}
              showShowName={!show}
              intlTag={intlTag}
              platforms={platforms}
              writeAvailable={!!write?.available}
              onUpdated={onUpdated}
            />
          ))}
        </ul>
      )}

      {showPager && (
        // aria-disabled, NOT the `disabled` attribute. A disabled button is
        // removed from the tab order, so the moment "Vorige" becomes unusable at
        // offset 0 — or either button greys out mid-load — the browser drops
        // focus to <body> and the keyboard user loses their place. aria-disabled
        // keeps both buttons focusable and announced as unavailable; the click
        // handlers refuse the action instead.
        <nav className="pod-pager" aria-label={t('podcasts.pagerAria')}>
          <button
            type="button"
            className="pod-pager-btn"
            aria-disabled={loading || !canPrev}
            onClick={() => {
              if (loading || !canPrev) return;
              setOffset((o) => Math.max(0, o - PODCAST_PAGE_SIZE));
            }}
          >
            {t('podcasts.prevPage')}
          </button>
          {/* role="status" (which implies aria-live="polite") so a page turn is
              announced — the range is the only cue that anything moved when 50
              rows look alike. */}
          <span className="pod-pager-range" role="status">
            {loading ? '…' : t('podcasts.pageRange', { from, to, total })}
          </span>
          <button
            type="button"
            className="pod-pager-btn"
            aria-disabled={loading || !canNext}
            onClick={() => {
              if (loading || !canNext) return;
              setOffset((o) => o + PODCAST_PAGE_SIZE);
            }}
          >
            {t('podcasts.nextPage')}
          </button>
        </nav>
      )}
    </section>
  );
}

function EpisodeRow({
  episode, showShowName, intlTag, platforms, writeAvailable, onUpdated,
}: {
  episode: PodcastEpisode;
  showShowName: boolean;
  intlTag: string;
  platforms: readonly PodcastWatchPlatform[];
  writeAvailable: boolean;
  onUpdated: (episode: PodcastEpisodeDetail) => void;
}) {
  const metaParts: string[] = [];
  if (showShowName && episode.show_title?.trim()) metaParts.push(episode.show_title.trim());
  const numbering = formatSeasonEpisode(episode.season_number, episode.episode_number);
  if (numbering) metaParts.push(numbering);
  const published = formatDate(episode.pubdate, intlTag);
  if (published) metaParts.push(published);
  const duration = formatDuration(episode.duration_seconds);
  if (duration) metaParts.push(duration);

  return (
    <li className="pod-episode">
      <Artwork src={episode.artwork_url} alt="" size="sm" />
      <div className="pod-episode-main">
        <a className="pod-episode-title" href={hrefFor({ name: 'podcasts', episode: episode.slug })}>
          {episode.title?.trim() || episode.slug}
        </a>
        {metaParts.length > 0 && <p className="pod-episode-meta">{metaParts.join(' · ')}</p>}
        <div className="pod-episode-state">
          <StatusBadge episode={episode} />
          <ProgressBar episode={episode} />
        </div>
        <TranscriptLink episode={episode} />
      </div>
      <div className="pod-episode-actions">
        <EpisodeWatchToggle
          episode={episode}
          platforms={platforms}
          writeAvailable={writeAvailable}
          disabledDescriptionId={WRITE_NOTICE_ID}
          onUpdated={onUpdated}
          compact
        />
      </div>
    </li>
  );
}

// =============================================================================
// (3) EPISODE DETAIL — the large view
// =============================================================================
function PodcastEpisodeView({ slug }: { slug: string }) {
  const t = useT();
  const { locale } = useLocale();
  const intlTag = intlLocale(locale);
  const { data, loading, error } = useFetch<PodcastEpisodeResponse>(episodeUrl(slug));
  const topRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, [slug]);

  // Local copy so the write's echo lands here too, exactly like the list.
  const [episode, setEpisode] = useState<PodcastEpisodeDetail | null>(null);
  useEffect(() => { setEpisode(data?.episode ?? null); }, [data]);
  const onUpdated = useCallback((updated: PodcastEpisodeDetail) => setEpisode(updated), []);

  if (loading) return <ViewSkeleton />;
  if (isRouteMissing(error)) {
    return (
      <section className="pod-view">
        <PageHeader title={t('podcasts.title')} icon={PodcastIcon} />
        <ModuleEmptyState title={t('podcasts.notLoadedTitle')} icon={PodcastIcon}>
          {t('podcasts.notLoadedSub')}
        </ModuleEmptyState>
      </section>
    );
  }
  if (error) return <div role="alert" className="view-error">{t('podcasts.loadError', { error })}</div>;

  if (!data?.found || !episode) {
    return (
      <div className="note-view">
        <a className="back-button" href={hrefFor({ name: 'podcasts' })}>
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> {t('podcasts.backToShows')}
        </a>
        <p className="note-empty">{t('podcasts.detailNotFound', { slug })}</p>
      </div>
    );
  }

  const platforms = data.platforms ?? FALLBACK_PLATFORMS;
  const write = data.write;
  const body = episode.body?.trim() ?? '';
  const transcriptSrc = transcriptFileSrc(episode.transcript_path);

  // Only fields that actually carry a value are listed; a dl full of "—" tells
  // the reader nothing about which of them are genuinely unknown.
  const metaRows: Array<[string, ReactNode]> = [];
  if (episode.show_title?.trim() || episode.podcast_slug) {
    metaRows.push([t('podcasts.fieldShow'), episode.podcast_slug
      ? (
        <a href={hrefFor({ name: 'podcasts', pane: 'episodes', show: episode.podcast_slug })}>
          {episode.show_title?.trim() || episode.podcast_slug}
        </a>
      )
      : episode.show_title]);
  }
  const published = formatDate(episode.pubdate, intlTag);
  if (published) metaRows.push([t('podcasts.fieldPublished'), published]);
  const duration = formatDuration(episode.duration_seconds);
  if (duration) metaRows.push([t('podcasts.fieldDuration'), duration]);
  const numbering = formatSeasonEpisode(episode.season_number, episode.episode_number);
  if (numbering) metaRows.push([t('podcasts.fieldNumbering'), numbering]);
  const lastPlayed = formatDate(episode.last_played_date, intlTag);
  if (lastPlayed) metaRows.push([t('podcasts.fieldLastPlayed'), lastPlayed]);
  const markedAt = formatDate(episode.manual_watched_at, intlTag);
  if (markedAt) metaRows.push([t('podcasts.fieldMarkedAt'), markedAt]);
  // Apple's raw state, shown as PROVENANCE beside the effective badge — so the
  // difference between "Apple has it" and "I ticked it" stays inspectable.
  if (episode.play_state) metaRows.push([t('podcasts.fieldApple'), episode.play_state]);

  return (
    <article ref={topRef} className="note-view pod-detail animate-fade-rise">
      <a
        className="back-button"
        href={hrefFor(episode.podcast_slug
          ? { name: 'podcasts', pane: 'episodes', show: episode.podcast_slug }
          : { name: 'podcasts' })}
      >
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> {t('podcasts.backToEpisodes')}
      </a>

      <header className="note-header">
        <div className="note-header-row">
          <span className="note-type-pill">{t('podcasts.title')}</span>
          <StatusBadge episode={episode} />
        </div>
        <h1 className="note-title">{episode.title?.trim() || episode.slug}</h1>
        <ProgressBar episode={episode} />
      </header>

      <WriteNotice write={write} />

      <div className="note-grid">
        <div className="note-body-col">
          <h2 className="pod-detail-subhead">{t('podcasts.showNotes')}</h2>
          {body ? <WikiMarkdown body={body} /> : <p className="note-empty">{t('podcasts.noShowNotes')}</p>}
        </div>

        <aside className="note-side">
          <section className="side-panel">
            <h2 className="side-panel-title">
              <Info size={15} strokeWidth={1.5} aria-hidden="true" /> {t('podcasts.details')}
            </h2>
            {metaRows.length > 0 && (
              <dl className="meta-list">
                {metaRows.map(([k, v]) => (
                  <div key={k} className="meta-row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="pod-detail-watch">
              <EpisodeWatchToggle
                episode={episode}
                platforms={platforms}
                writeAvailable={!!write?.available}
                disabledDescriptionId={WRITE_NOTICE_ID}
                onUpdated={onUpdated}
              />
            </div>
          </section>

          <section className="side-panel">
            <h2 className="side-panel-title">
              <FileText size={15} strokeWidth={1.5} aria-hidden="true" /> {t('podcasts.transcript')}
            </h2>
            {transcriptSrc
              ? <TranscriptLink episode={episode} />
              : <p className="side-empty">{t('podcasts.transcriptNoneHint')}</p>}
          </section>

          {(episode.web_page_url || episode.show_web_page_url) && (
            <section className="side-panel">
              <ul className="pod-links">
                {episode.web_page_url && (
                  <li>
                    <a className="pod-ext-link" href={episode.web_page_url} target="_blank" rel="noreferrer noopener">
                      <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                      {t('podcasts.openWebPage')}
                      <span className="sr-only"> — {t('podcasts.newTab')}</span>
                    </a>
                  </li>
                )}
                {episode.show_web_page_url && (
                  <li>
                    <a className="pod-ext-link" href={episode.show_web_page_url} target="_blank" rel="noreferrer noopener">
                      <ExternalLink size={13} strokeWidth={1.5} aria-hidden="true" />
                      {t('podcasts.openShowPage')}
                      <span className="sr-only"> — {t('podcasts.newTab')}</span>
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}

// =============================================================================
// Router shell
// =============================================================================
export function PodcastsView() {
  const route = useRoute();
  if (route.name !== 'podcasts') return null; // defensive; App only mounts on 'podcasts'
  if (route.episode) return <PodcastEpisodeView slug={route.episode} />;
  if (route.pane === 'episodes') return <PodcastEpisodes show={route.show ?? null} />;
  return <PodcastShows />;
}

function ViewSkeleton() {
  return (
    <div className="note-view" aria-busy="true">
      <div className="skeleton-line w-half" />
      <div className="skeleton-block" />
      <div className="skeleton-block" />
    </div>
  );
}
