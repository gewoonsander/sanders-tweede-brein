// DartsView.tsx — the Darts page (Darts Atlas rankings + tournament history).
//
// A sibling of TrackingView / WorkoutsView: same page chrome (PageHeader), same
// loading/error states, same collapsible Section model, same read-only useFetch.
//
// WHAT MAKES THIS ONE DIFFERENT
//   Its data does NOT come from mypka.db. The Darts Atlas profile is scraped by
//   scripts/dartsatlas-fetch.mjs (weekly LaunchAgent on the Mac mini, also
//   runnable by hand) into data/dartsatlas/<player>/latest.json; the server just
//   reads that file. So the FRESHNESS of the file is a first-class thing on this
//   page, not a footnote: the top strip answers "did the refresh actually
//   happen?" — including when another machine did the refreshing and synced the
//   file over (hence both `fetchedAt` and the local `fileMtime`).
//
// HONESTY RULE
//   Only fields Darts Atlas actually publishes are rendered. There is NO checkout
//   percentage anywhere on this page: the source payload has no such field, and a
//   made-up number is worse than a missing one. Every genuinely-absent value
//   renders as an em-dash, never as a zero.
import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle, Clock, ExternalLink, ListOrdered, Target, Trophy,
} from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { useCollapsed } from '../lib/useCollapsed';
import { Card, Section, ModuleEmptyState } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { intlLocale } from '../lib/i18n';
import type { DartsProfile, DartsStanding, DartsTournament } from '../lib/dartsTypes';

// How many tournaments are shown before the first "Show more". 63 rows today and
// growing, so the list is paged rather than dumped.
const TOURNAMENTS_FIRST_PAGE = 20;
const TOURNAMENTS_PAGE_STEP = 25;

// The scraper runs weekly. Past this many days the file is stale enough that the
// page should say so out loud rather than present old numbers as current.
const STALE_AFTER_DAYS = 8;

export function DartsView() {
  const { data, loading, error } = useFetch<DartsProfile>('/api/cockpit/darts');

  const [rankingsOpen, toggleRankings] = useCollapsed('darts-rankings', true);
  const [tournamentsOpen, toggleTournaments] = useCollapsed('darts-tournaments', true);

  return (
    <div className="dashboard-view">
      <PageHeader
        title="Darts"
        icon={Target}
        subtitle={
          data && data.available
            ? `${data.player.name ?? 'Player'} · Darts Atlas · ${data.counts.standings} rankings, ${data.counts.tournaments} tournaments`
            : 'Rankings and tournament history from Darts Atlas.'
        }
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {data && !data.available && (
        <main className="dashboard-main">
          <UnavailableState profile={data} />
        </main>
      )}

      {data && data.available && (
        <main className="dashboard-main">
          <FreshnessStrip fetchedAt={data.fetchedAt} fileMtime={data.fileMtime} />
          <KeyFigures standings={data.standings} />

          <Section
            id="darts-rankings"
            icon={<Trophy size={18} strokeWidth={1.5} />}
            title="Rankings"
            hint="league + seasons"
            summary={rankingsSummary(data.standings)}
            open={rankingsOpen}
            onToggle={toggleRankings}
          >
            <StandingsTable standings={data.standings} />
          </Section>

          <Section
            id="darts-tournaments"
            icon={<ListOrdered size={18} strokeWidth={1.5} />}
            title="Tournaments"
            hint="most recent first"
            summary={tournamentsSummary(data.tournaments)}
            open={tournamentsOpen}
            onToggle={toggleTournaments}
          >
            <TournamentsTable tournaments={data.tournaments} />
          </Section>

          <footer className="dashboard-footer">
            <p className="dashboard-footer-note">
              Read-only from{' '}
              <span className="font-mono">data/dartsatlas/{data.playerId}/latest.json</span> · scraped
              by <span className="font-mono">scripts/dartsatlas-fetch.mjs</span>. This view writes
              nothing.
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}

// ── Freshness ────────────────────────────────────────────────────────────────
// The explicit requirement: it must be visible whether the refresh landed, even
// when another Mac did the fetching and the file arrived by sync. So both clocks
// are shown — the scrape time (travels inside the file) and, when it differs
// meaningfully, when this machine's copy last changed.
function FreshnessStrip({ fetchedAt, fileMtime }: { fetchedAt: string | null; fileMtime: string | null }) {
  const days = daysSince(fetchedAt);
  const stale = days != null && days > STALE_AFTER_DAYS;
  const syncedSeparately =
    fetchedAt != null && fileMtime != null && Math.abs(+new Date(fileMtime) - +new Date(fetchedAt)) > 60 * 60 * 1000;

  return (
    <div className="flex flex-wrap items-center gap-x-sm gap-y-xs rounded-panel border border-border bg-surface-1 px-md py-sm">
      <Clock
        size={15}
        strokeWidth={1.5}
        aria-hidden="true"
        className={stale ? 'shrink-0 text-warning' : 'shrink-0 text-marker-text'}
      />
      <span className="text-caption text-fg-muted">Last fetched</span>
      {fetchedAt ? (
        <>
          <time dateTime={fetchedAt} className="font-mono tabular-nums text-caption text-fg">
            {formatDateTime(fetchedAt)}
          </time>
          <span className={`text-caption ${stale ? 'text-warning' : 'text-fg-subtle'}`}>
            ({relativeFromNow(fetchedAt)}
            {stale ? ' — the weekly refresh looks overdue' : ''})
          </span>
        </>
      ) : (
        <span className="text-caption text-fg-subtle">unknown — the file carries no timestamp</span>
      )}
      {syncedSeparately && fileMtime && (
        <span className="text-caption text-fg-subtle">
          · file on this Mac updated{' '}
          <time dateTime={fileMtime} className="font-mono tabular-nums">
            {formatDateTime(fileMtime)}
          </time>
        </span>
      )}
    </div>
  );
}

// ── Key figures ──────────────────────────────────────────────────────────────
// Average, first 9 and rank for the two standings that answer "how am I doing
// right now": the overall circuit (league) standing and the season in progress.
function KeyFigures({ standings }: { standings: DartsStanding[] }) {
  const overall = useMemo(() => standings.find((s) => s.type === 'league') ?? null, [standings]);
  const currentSeason = useMemo(
    () => standings.find((s) => s.type === 'season' && s.scope === 'active') ?? null,
    [standings],
  );

  if (!overall && !currentSeason) return null;

  return (
    <div className="grid gap-md lg:grid-cols-2">
      {overall && <FiguresCard standing={overall} kicker="Overall" />}
      {currentSeason && <FiguresCard standing={currentSeason} kicker="Current season" />}
    </div>
  );
}

function FiguresCard({ standing, kicker }: { standing: DartsStanding; kicker: string }) {
  return (
    <Card as="article" className="flex flex-col gap-md">
      <div className="flex flex-col gap-[2px]">
        <span className="text-caption uppercase tracking-wide text-marker-text">{kicker}</span>
        <h3 className="text-h3 font-[520] leading-snug text-fg">{standing.title ?? '—'}</h3>
        <p className="text-caption text-fg-subtle">{periodLabel(standing)}</p>
      </div>

      <dl className="grid grid-cols-3 gap-sm">
        <Figure label="Average" value={formatAvg(standing.average)} />
        <Figure label="First 9" value={formatAvg(standing.first9)} />
        <Figure
          label="Rank"
          value={formatRank(standing.rank)}
          hint={
            standing.region?.rank != null && standing.region.name
              ? `#${standing.region.rank} in ${standing.region.name}`
              : undefined
          }
        />
      </dl>

      <p className="flex flex-wrap items-center gap-x-md gap-y-xs text-caption text-fg-muted">
        <span>
          <span className="font-mono tabular-nums text-fg">{formatWL(standing)}</span> W–L
        </span>
        {standing.points != null && (
          <span>
            <span className="font-mono tabular-nums text-fg">{standing.points}</span> pts
          </span>
        )}
        {standing.titles != null && (
          <span>
            <span className="font-mono tabular-nums text-fg">{standing.titles}</span>{' '}
            {standing.titles === 1 ? 'title' : 'titles'}
          </span>
        )}
        {standing.scores180 != null && (
          <span>
            <span className="font-mono tabular-nums text-fg">{standing.scores180}</span> × 180
          </span>
        )}
      </p>
    </Card>
  );
}

function Figure({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <dt className="text-caption text-fg-subtle">{label}</dt>
      <dd className="font-mono text-h2 font-[520] tabular-nums text-fg">
        {value}
        {hint && <span className="mt-[2px] block font-sans text-caption font-[400] text-fg-muted">{hint}</span>}
      </dd>
    </div>
  );
}

// ── Rankings table ───────────────────────────────────────────────────────────
// Wide by nature (11 columns). The wrapper is a focusable, labelled scroll region
// so a keyboard user can reach the overflow — the WAI practice for a horizontally
// scrollable box.
function StandingsTable({ standings }: { standings: DartsStanding[] }) {
  if (standings.length === 0) {
    return <p className="text-caption text-fg-subtle">No ranking rows in the last fetch.</p>;
  }
  return (
    <div
      className="overflow-x-auto rounded-panel border border-border-subtle"
      tabIndex={0}
      role="group"
      aria-label="Rankings table, scrollable horizontally"
    >
      <table className="w-full border-collapse text-caption">
        <caption className="sr-only">
          Darts Atlas rankings — the overall circuit standing plus every season, newest first.
        </caption>
        <thead>
          <tr>
            <Th className="min-w-[220px] text-left">Competition</Th>
            <Th>Rank</Th>
            <Th>Pts</Th>
            <Th>Avg</Th>
            <Th>First 9</Th>
            <Th>W–L</Th>
            <Th>Titles</Th>
            <Th>100+</Th>
            <Th>140+</Th>
            <Th>180</Th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={`${s.seasonId ?? s.title ?? 'row'}-${i}`} className="align-top">
              <td className="border-b border-border-subtle px-sm py-xs">
                <span className="flex flex-col gap-[2px]">
                  <span className="flex flex-wrap items-center gap-xs">
                    <ExternalLinkText href={s.url} label={s.title ?? '—'} />
                    {s.scope === 'active' && <LiveChip status={s.status} />}
                  </span>
                  <span className="text-caption text-fg-subtle">{periodLabel(s)}</span>
                </span>
              </td>
              <Td emphasis>{formatRank(s.rank)}</Td>
              <Td>{formatNum(s.points)}</Td>
              <Td emphasis>{formatAvg(s.average)}</Td>
              <Td>{formatAvg(s.first9)}</Td>
              <Td>{formatWL(s)}</Td>
              <Td>{formatNum(s.titles)}</Td>
              <Td>{formatNum(s.scores100plus)}</Td>
              <Td>{formatNum(s.scores140plus)}</Td>
              <Td>{formatNum(s.scores180)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tournaments table ────────────────────────────────────────────────────────
function TournamentsTable({ tournaments }: { tournaments: DartsTournament[] }) {
  const [visible, setVisible] = useState(TOURNAMENTS_FIRST_PAGE);
  const shown = tournaments.slice(0, visible);
  const remaining = tournaments.length - shown.length;

  if (tournaments.length === 0) {
    return <p className="text-caption text-fg-subtle">No tournaments in the last fetch.</p>;
  }

  return (
    <div className="flex flex-col gap-sm">
      <div
        className="overflow-x-auto rounded-panel border border-border-subtle"
        tabIndex={0}
        role="group"
        aria-label="Tournament history table, scrollable horizontally"
      >
        <table className="w-full border-collapse text-caption">
          <caption className="sr-only">
            Tournament history, most recent first. Showing {shown.length} of {tournaments.length}.
          </caption>
          <thead>
            <tr>
              <Th className="text-left">Date</Th>
              <Th className="min-w-[240px] text-left">Tournament</Th>
              <Th className="text-left">Result</Th>
              <Th>Avg</Th>
              <Th>First 9</Th>
              <Th>Pts</Th>
            </tr>
          </thead>
          <tbody>
            {shown.map((t, i) => (
              <tr key={t.id ?? `${t.date}-${i}`} className="align-top">
                <td className="whitespace-nowrap border-b border-border-subtle px-sm py-xs font-mono tabular-nums text-fg-muted">
                  {t.date ? (
                    <time dateTime={t.date}>{formatDate(t.date)}</time>
                  ) : (
                    <span aria-hidden="true">—</span>
                  )}
                </td>
                <td className="border-b border-border-subtle px-sm py-xs">
                  <span className="flex flex-col gap-[2px]">
                    <ExternalLinkText
                      href={t.statsUrl ?? t.url}
                      label={t.name ?? '—'}
                      title="Open your stats for this tournament on Darts Atlas"
                    />
                    {t.circuit?.name && <span className="text-caption text-fg-subtle">{t.circuit.name}</span>}
                  </span>
                </td>
                <td className="border-b border-border-subtle px-sm py-xs">
                  <ResultChip result={t.result} />
                </td>
                <Td emphasis>{formatAvg(t.average)}</Td>
                <Td>{formatAvg(t.first9)}</Td>
                <Td>{formatNum(t.points)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-sm">
        <p className="text-caption text-fg-subtle" aria-live="polite">
          Showing {shown.length} of {tournaments.length}
        </p>
        {remaining > 0 && (
          <>
            <button
              type="button"
              onClick={() => setVisible((v) => v + TOURNAMENTS_PAGE_STEP)}
              className="rounded-card border border-border bg-surface-1 px-sm py-xs text-caption text-fg-muted transition-colors hover:border-marker hover:text-fg focus-visible:border-marker focus-visible:text-fg"
            >
              Show {Math.min(remaining, TOURNAMENTS_PAGE_STEP)} more
            </button>
            <button
              type="button"
              onClick={() => setVisible(tournaments.length)}
              className="rounded-card px-sm py-xs text-caption text-marker-text transition-colors hover:underline focus-visible:underline"
            >
              Show all {tournaments.length}
            </button>
          </>
        )}
        {remaining === 0 && tournaments.length > TOURNAMENTS_FIRST_PAGE && (
          <button
            type="button"
            onClick={() => setVisible(TOURNAMENTS_FIRST_PAGE)}
            className="rounded-card px-sm py-xs text-caption text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
          >
            Collapse the list
          </button>
        )}
      </div>
    </div>
  );
}

// ── Small shared bits ────────────────────────────────────────────────────────

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-border-subtle bg-surface-2 px-sm py-xs text-right font-[460] text-fg-muted ${className}`}
    >
      {children}
    </th>
  );
}

/** A numeric cell. Genuinely-absent values render as an em-dash, never a zero. */
function Td({ children, emphasis = false }: { children: ReactNode; emphasis?: boolean }) {
  return (
    <td
      className={`whitespace-nowrap border-b border-border-subtle px-sm py-xs text-right font-mono tabular-nums ${
        emphasis ? 'text-fg' : 'text-fg-muted'
      }`}
    >
      {children}
    </td>
  );
}

/** External link to Darts Atlas. Always rel=noopener noreferrer; the icon is
 *  decorative and the destination is announced in the accessible name. */
function ExternalLinkText({ href, label, title }: { href: string | null; label: string; title?: string }) {
  if (!href) return <span className="text-body font-[520] text-fg">{label}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="group inline-flex items-center gap-xs text-body font-[520] text-fg transition-colors hover:text-marker-text focus-visible:text-marker-text"
    >
      <span>{label}</span>
      <ExternalLink
        size={12}
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0 text-fg-subtle transition-colors group-hover:text-marker-text"
      />
      <span className="sr-only">(opens Darts Atlas in a new tab)</span>
    </a>
  );
}

/** Marks the standings rows that are still running. */
function LiveChip({ status }: { status: string | null }) {
  return (
    <span className="inline-flex items-center gap-xs rounded-full bg-[var(--accent-marker-soft)] px-sm py-[3px] text-caption font-[500] text-marker-text">
      {status === 'in-progress' ? 'In progress' : 'Active'}
    </span>
  );
}

// A podium finish gets the marker tint; everything else stays a neutral chip.
// Deliberately not status colours — a "Last 64" is a result, not a fault.
const PODIUM = new Set(['Champion', 'Runner-Up', 'Semi-Final']);

function ResultChip({ result }: { result: string | null }) {
  if (!result) return <span className="text-fg-subtle" aria-hidden="true">—</span>;
  const podium = PODIUM.has(result);
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full px-sm py-[3px] text-caption font-[460] ${
        podium
          ? 'bg-[var(--accent-marker-soft)] text-marker-text'
          : 'border border-border bg-surface-2 text-fg-muted'
      }`}
    >
      {result}
    </span>
  );
}

// ── States ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col gap-md" aria-busy="true" aria-live="polite">
      <div className="h-[44px] animate-pulse rounded-panel bg-surface-1" />
      <div className="grid gap-md lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-[170px] animate-pulse rounded-panel bg-surface-1" />
        ))}
      </div>
      <div className="h-[220px] animate-pulse rounded-panel bg-surface-1" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-sm rounded-panel border border-border bg-surface-1 px-md py-md">
      <AlertCircle size={20} strokeWidth={1.5} className="mt-[2px] shrink-0 text-warning" aria-hidden="true" />
      <div>
        <p className="text-body font-[520] text-fg">Could not load your Darts Atlas data</p>
        <p className="mt-xs text-caption leading-relaxed text-fg-muted">
          {message}. Is the local server running? Start it with the{' '}
          <span className="font-mono">start-cockpit.command</span> script.
        </p>
      </div>
    </div>
  );
}

/** The server answered, but there is nothing on disk to show yet. Names the exact
 *  command that fills the gap instead of leaving a blank page. */
function UnavailableState({ profile }: { profile: Extract<DartsProfile, { available: false }> }) {
  if (profile.reason === 'unreadable-json') {
    return (
      <ModuleEmptyState title="The Darts Atlas file could not be read" icon={Target}>
        <span className="font-mono">data/dartsatlas/{profile.playerId}/latest.json</span> exists but
        is not valid JSON — most likely a fetch was interrupted halfway. Re-run{' '}
        <span className="font-mono">node scripts/dartsatlas-fetch.mjs</span> to rewrite it.
      </ModuleEmptyState>
    );
  }
  if (profile.reason === 'invalid-player-id') {
    return (
      <ModuleEmptyState title="Unknown player profile" icon={Target}>
        That Darts Atlas player id is not a valid id. Drop the{' '}
        <span className="font-mono">?player=</span> parameter to fall back to the profile that is
        actually on disk.
      </ModuleEmptyState>
    );
  }
  return (
    <ModuleEmptyState title="No Darts Atlas data yet" icon={Target}>
      Nothing has been scraped into{' '}
      <span className="font-mono">data/dartsatlas/{profile.playerId ?? '<player>'}/latest.json</span>{' '}
      on this machine yet. Run{' '}
      <span className="font-mono">node scripts/dartsatlas-fetch.mjs</span> from the cockpit folder
      (or wait for the weekly LaunchAgent on the Mac mini), then reload this page.
    </ModuleEmptyState>
  );
}

// ── Formatting helpers ───────────────────────────────────────────────────────
// Every helper renders a missing value as an em-dash. A dash is honest; a 0 is a
// claim the source never made.

const DASH = '—';

function formatAvg(v: number | null): string {
  return v == null ? DASH : v.toFixed(2);
}

function formatNum(v: number | null): string {
  return v == null ? DASH : String(v);
}

function formatRank(v: number | null): string {
  return v == null ? DASH : `#${v}`;
}

function formatWL(s: DartsStanding): string {
  if (s.wins == null && s.losses == null) return DASH;
  return `${s.wins ?? 0}–${s.losses ?? 0}`;
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString(intlLocale(), { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

function formatDateTime(d: string): string {
  try {
    return new Date(d).toLocaleString(intlLocale(), {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return d;
  }
}

/** Season/league period as a short readable range. Leagues carry no period. */
function periodLabel(s: DartsStanding): string {
  const league = s.league?.name ?? null;
  if (!s.periodStart && !s.periodEnd) return league ?? (s.type === 'league' ? 'Overall standing' : '');
  const from = s.periodStart ? formatDate(s.periodStart) : '?';
  const to = s.periodEnd ? formatDate(s.periodEnd) : 'now';
  return league ? `${league} · ${from} – ${to}` : `${from} – ${to}`;
}

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return (Date.now() - then) / 86_400_000;
}

/** "3 days ago" / "in 2 hours", via Intl so it follows the cockpit's locale. */
function relativeFromNow(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.round((then - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: 'auto' });
  for (const [unit, sec] of units) {
    if (Math.abs(diffSec) >= sec) return rtf.format(Math.round(diffSec / sec), unit);
  }
  return rtf.format(diffSec, 'second');
}

// ── Section summary lines (visible whether the section is open or collapsed) ──

function rankingsSummary(standings: DartsStanding[]): string {
  const seasons = standings.filter((s) => s.type === 'season').length;
  const active = standings.filter((s) => s.scope === 'active').length;
  return `${standings.length} rows · ${seasons} seasons · ${active} active`;
}

function tournamentsSummary(tournaments: DartsTournament[]): string {
  const titles = tournaments.filter((t) => t.result === 'Champion').length;
  const finals = tournaments.filter((t) => t.result === 'Runner-Up').length;
  const latest = tournaments[0]?.date ? formatDate(tournaments[0].date) : null;
  const parts = [`${tournaments.length} played`, `${titles} won`, `${finals} runner-up`];
  if (latest) parts.push(`last ${latest}`);
  return parts.join(' · ');
}
