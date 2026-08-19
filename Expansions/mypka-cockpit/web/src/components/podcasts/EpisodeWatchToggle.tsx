// EpisodeWatchToggle.tsx — the Podcasts module's ONE write affordance.
//
// WHAT IT IS
// A real <input type="checkbox"> that PATCHes …/watched. Ticking sends
// { watched:true, platform }; unticking sends { watched:false } with NO platform
// — the server 400s on a platform there, because unticking nulls all three
// columns and a platform on an unticked row would be a lie.
//
// WHY A CHECKBOX AND NOT A STYLED DIV
// Keyboard operation (Space), the checked semantics and the screen-reader role
// all come free and correct from the native element. Styling rides accent-color
// plus a token focus ring, so nothing is reimplemented.
//
// TWO SHAPES, ONE RULE FOR THE PLATFORM
//   compact (a list row)  — checkbox only. Ticking records the default platform.
//                           50 rows × (checkbox + dropdown) would be 100 tab
//                           stops and a platform decision per row for what is
//                           almost always the same answer.
//   roomy (the detail)    — checkbox plus a platform <select>, shown only while
//                           the episode is UNTICKED, because that is the only
//                           moment the choice is still open.
// Once an episode IS ticked, BOTH shapes show the recorded platform as a plain
// read-only chip. Changing it means untick → re-tick.
//
// WHY NOT AN EDITABLE DROPDOWN ON A TICKED ROW: it would have to fire a write on
// every `change`. A native select fires `change` per step while arrowing with
// the keyboard, so that is a burst of writes; dropping the ones that arrive
// mid-flight leaves the control showing one platform while the database holds
// another. Read-only-once-set has no such race and never lies about what is
// stored.
//
// NO OPTIMISTIC STATE
// The server echoes the updated row back FROM `v_podcast_episodes_effective`.
// The caller replaces its row with that echo, so the checkbox and the status
// badge can never disagree with the database — not even for one frame. A local
// guess would also have to re-derive the effective state, which is exactly the
// second-truth JS copy DATA-CONTRACT §18.9 forbids.
//
// THE APPLE NO-OP IS SURFACED, NOT HIDDEN
// When Apple already says 'played' the tick changes no status at all (the view's
// CASE short-circuits on Apple). The control stays usable — recording WHERE he
// watched it is still meaningful — but it says so, rather than pretending the
// checkbox drove the badge.
//
// Tokens only; styling lives in views/podcasts.css (.pod-watch*).
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useT } from '../../lib/i18n';
import type { TFunction } from '../../lib/i18n';
import {
  PODCAST_DEFAULT_PLATFORM,
  clearEpisodeWatched,
  markEpisodeWatched,
} from '../../lib/podcasts';
import type {
  PodcastEpisode,
  PodcastEpisodeDetail,
  PodcastWatchPlatform,
} from '../../lib/cockpitTypes';

/** Proper nouns stay verbatim in both locales (the i18n scope note); only the
 *  two generic buckets get a translation key. */
const PLATFORM_PROPER_NOUN: Partial<Record<PodcastWatchPlatform, string>> = {
  youtube: 'YouTube',
  spotify: 'Spotify',
};

function platformLabel(p: PodcastWatchPlatform, t: TFunction): string {
  const proper = PLATFORM_PROPER_NOUN[p];
  if (proper) return proper;
  return p === 'web' ? t('podcasts.platformWeb') : t('podcasts.platformOther');
}

export interface EpisodeWatchToggleProps {
  episode: PodcastEpisode;
  /** The server's own platform vocabulary. Falls back to a single-platform list
   *  when the payload predates it, so the control is never platform-less. */
  platforms: readonly PodcastWatchPlatform[];
  /** From the payload's `write` envelope. False => read-only, never broken. */
  writeAvailable: boolean;
  /** The id of the page-level "marking is off" notice, wired to every disabled
   *  checkbox with aria-describedby so the reason is announced once, not 50x. */
  disabledDescriptionId?: string;
  /** Hand back the row the SERVER echoed, so the caller can replace its copy. */
  onUpdated: (episode: PodcastEpisodeDetail) => void;
  /** Compact rendering for the list rows; the detail view uses the roomy one. */
  compact?: boolean;
}

export function EpisodeWatchToggle({
  episode,
  platforms,
  writeAvailable,
  disabledDescriptionId,
  onUpdated,
  compact = false,
}: EpisodeWatchToggleProps) {
  const t = useT();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The platform the NEXT tick will use. Only ever read while the episode is
  // unticked, so it can never disagree with a stored value.
  const [platform, setPlatform] = useState<PodcastWatchPlatform>(
    platforms.includes(PODCAST_DEFAULT_PLATFORM)
      ? PODCAST_DEFAULT_PLATFORM
      : (platforms[0] ?? PODCAST_DEFAULT_PLATFORM),
  );

  const title = episode.title?.trim() || episode.slug;
  const inputId = `pod-watch-${episode.slug}`;
  const selectId = `pod-platform-${episode.slug}`;
  const errorId = `pod-watch-err-${episode.slug}`;
  // Apple already owns this one: the tick records provenance, not status.
  const appleAlreadyPlayed = episode.play_state === 'played';
  // Only offer the choice where there IS one, and only while it is still open.
  const showPlatformSelect = !compact && !episode.manual_watched && platforms.length > 1;

  async function onToggle(next: boolean) {
    if (pending) return;
    setPending(true);
    setError(null);
    const result = next
      ? await markEpisodeWatched(episode.slug, platform)
      : await clearEpisodeWatched(episode.slug);
    setPending(false);

    // Exhaustive branch on the discriminated WriteResult — every failure gets a
    // sentence a human can act on, never a bare status code.
    switch (result.kind) {
      case 'ok':
        onUpdated(result.data.episode);
        return;
      case 'disabled':
        setError(t('podcasts.watchErrorDisabled'));
        return;
      case 'not-found':
        setError(t('podcasts.watchErrorNotFound'));
        return;
      case 'conflict':
        setError(t('podcasts.watchErrorConflict'));
        return;
      case 'auth':
        setError(t('podcasts.watchErrorAuth'));
        return;
      case 'stale':
      case 'too-large':
      case 'error':
      default:
        setError(t('podcasts.watchError', {
          message: result.kind === 'error' ? result.message : result.kind,
        }));
    }
  }

  const describedBy = [
    error ? errorId : null,
    !writeAvailable && disabledDescriptionId ? disabledDescriptionId : null,
  ].filter(Boolean).join(' ');

  return (
    <div className={`pod-watch ${compact ? 'pod-watch--compact' : ''}`}>
      <div className="pod-watch-row">
        <input
          type="checkbox"
          id={inputId}
          className="pod-watch-check"
          checked={episode.manual_watched}
          // `disabled` ONLY for the stable page-level condition. The IN-FLIGHT
          // state uses aria-disabled instead: disabling a focused checkbox drops
          // keyboard focus to <body> mid-interaction, so ticking a row with
          // Space would throw the user out of the list every single time. The
          // input is controlled, so a click that `onToggle` refuses simply
          // re-renders back to the stored value.
          disabled={!writeAvailable}
          aria-disabled={pending || undefined}
          aria-describedby={describedBy || undefined}
          // WCAG 2.5.3 (Label in Name): the accessible name OPENS with the exact
          // visible label text, then disambiguates with the episode title — so a
          // speech-input user can say "Ook elders gezien" and hit this control.
          aria-label={t('podcasts.watchAria', { title })}
          onChange={(e) => { void onToggle(e.target.checked); }}
        />
        <label className="pod-watch-label" htmlFor={inputId}>
          {t('podcasts.watchLabel')}
        </label>

        {showPlatformSelect && (
          <>
            <label className="sr-only" htmlFor={selectId}>
              {t('podcasts.watchPlatformAria', { title })}
            </label>
            <select
              id={selectId}
              className="pod-watch-platform"
              value={platform}
              disabled={!writeAvailable}
              onChange={(e) => setPlatform(e.target.value as PodcastWatchPlatform)}
            >
              {platforms.map((p) => (
                <option key={p} value={p}>{platformLabel(p, t)}</option>
              ))}
            </select>
          </>
        )}

        {/* Where it was recorded — a read-only fact once the tick is set, in both
            shapes, so the platform is never hidden behind a control. */}
        {episode.manual_watched && episode.manual_watched_platform && (
          <span className="pod-watch-platform-chip" title={t('podcasts.watchPlatformLocked')}>
            {platformLabel(episode.manual_watched_platform, t)}
          </span>
        )}

        {pending && (
          <span className="pod-watch-pending" role="status">
            <Loader2 size={13} strokeWidth={1.75} aria-hidden="true" className="pod-spin" />
            <span className="sr-only">{t('podcasts.watchSaving')}</span>
          </span>
        )}
      </div>

      {appleAlreadyPlayed && episode.manual_watched && !compact && (
        <p className="pod-watch-note">{t('podcasts.watchNoop')}</p>
      )}

      {error && (
        <p className="pod-watch-error" id={errorId} role="alert">{error}</p>
      )}
    </div>
  );
}
