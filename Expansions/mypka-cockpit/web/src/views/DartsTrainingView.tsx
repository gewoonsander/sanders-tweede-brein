// DartsTrainingView.tsx — the Darts TRAINING dashboard (#/darts-training).
//
// A sibling of DartsView (Darts Atlas rankings), and deliberately a separate
// surface from the generic Library grid. The Library browses `darts_exercises`
// as a collection; this page answers the questions a collection browser cannot:
//   * which exercise have I not touched in the longest time?
//   * how is my score on THIS exercise moving over the sessions?
//   * what belongs to day 1, 2, 3, 4 of the course?
//   * and: log the session I just did, right here.
//
// ── DATA + THE SSOT RULE ──────────────────────────────────────────────────────
// Definitions come from mypka.db; the SESSIONS are parsed off the markdown notes
// themselves (server/dartsTrainingApi.js). Logging writes a `### YYYY-MM-DD`
// block into the note's `## Logboek` section — never an INSERT into
// `darts_exercise_logs`, which is regen-owned and would lose the row on the next
// regen. So markdown stays canonical and a session logged here is visible
// IMMEDIATELY, without waiting for regen-mypka-db.py to run.
//
// ── PERFORMANCE ───────────────────────────────────────────────────────────────
// 22 exercises are on screen at once. A Recharts <ResponsiveContainer> per card
// would mount 22 ResizeObservers on first paint, so the card carries a hand-
// rolled SVG sparkline (no observer, no library) and the full Recharts chart
// mounts only when a card's "Voortgang" panel is actually opened.
//
// ── HONESTY RULE (inherited from DartsView) ───────────────────────────────────
// A session logged without a score is a real session — the schema makes `score`
// nullable on purpose. Nothing here renders a missing number as 0; absent values
// are em-dashes. The unit is per session and free-text, so when a series mixes
// units the chart says so rather than implying one scale.
import {
  useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent,
} from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  AlertCircle, CalendarClock, ChevronDown, PenLine, Target, TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, Section, ModuleEmptyState, Chip } from '../components/ui';
import { useCollapsed } from '../lib/useCollapsed';
import { verifyThenSignalAuthExpired } from '../lib/auth';
import { cockpitWrite } from '../lib/useCockpitWrite';
import { intlLocale } from '../lib/i18n';
import type {
  DartsExerciseLog, DartsTrainingExercise, DartsTrainingResponse, LogSessionInput,
  LogSessionResponse,
} from '../lib/dartsTrainingTypes';
import './darts-training.css';

const ENDPOINT = '/api/cockpit/darts-training';

// How many rows the "langst niet gedaan" panel surfaces. Enough to pick tonight's
// session from, short enough to stay a prompt rather than a second full list.
const NEGLECTED_LIMIT = 6;

// Chart tokens — the same four Trends.tsx uses. No hardcoded colour anywhere.
const MARKER = 'var(--accent-marker)';
const MUTED = 'var(--fg-subtle)';
const GRID = 'var(--border)';
const axisTick = { fontSize: 11, fill: MUTED } as const;

// =============================================================================
// Data hook — like useFetch, but with an explicit reload().
// =============================================================================
// After a successful log the whole payload is re-fetched rather than patched in
// place. That keeps EVERY derived number (sessions, best, days-since) computed
// in exactly one place — the server — instead of duplicating the derivation
// here, where it could silently drift. The request is local and mtime-cached
// server-side, so the round trip is cheap.
interface DashboardState {
  data: DartsTrainingResponse | null;
  loading: boolean;
  error: string | null;
}

function useTrainingDashboard(): DashboardState & { reload: () => Promise<void> } {
  const [state, setState] = useState<DashboardState>({ data: null, loading: true, error: null });
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(ENDPOINT, { credentials: 'same-origin' });
      // A 401 on a background read is not proof the session is gone (same
      // reasoning as useFetch): re-verify, and surface this read's failure
      // inline rather than tearing the app down.
      if (res.status === 401) {
        void verifyThenSignalAuthExpired();
        throw new Error('Sessiecontrole mislukt — probeer het opnieuw.');
      }
      if (!res.ok) throw new Error(`Server antwoordde ${res.status}`);
      const data = (await res.json()) as DartsTrainingResponse;
      if (aliveRef.current) setState({ data, loading: false, error: null });
    } catch (err) {
      if (aliveRef.current) {
        setState({ data: null, loading: false, error: (err as Error).message });
      }
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { ...state, reload: load };
}

// =============================================================================
// Helpers
// =============================================================================
function fmtNumber(n: number): string {
  return n.toLocaleString(intlLocale(), { maximumFractionDigits: 2 });
}

function fmtDate(iso: string): string {
  const ms = Date.parse(`${iso}T00:00:00`);
  if (!Number.isFinite(ms)) return iso;
  return new Date(ms).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short' });
}

// "vandaag" / "gisteren" / "12 dagen geleden" / "nog nooit gedaan".
function fmtSince(days: number | null): string {
  if (days === null) return 'nog nooit gedaan';
  if (days === 0) return 'vandaag';
  if (days === 1) return 'gisteren';
  return `${days} dagen geleden`;
}

function shortDay(iso: string): string {
  return iso.slice(5); // MM-DD
}

// The scored subset, in plot order. A session without a score is still a real
// session — it just cannot be a point on a score axis.
function scoredLogs(logs: DartsExerciseLog[]): Array<DartsExerciseLog & { score: number }> {
  return logs.filter((l): l is DartsExerciseLog & { score: number } => typeof l.score === 'number');
}

// The distinct units actually used across a series. More than one means the
// numbers do not share a scale, and the chart has to say so.
function unitsUsed(logs: DartsExerciseLog[]): string[] {
  const set = new Set<string>();
  for (const l of scoredLogs(logs)) if (l.unit) set.add(l.unit);
  return Array.from(set);
}

// =============================================================================
// Sparkline — hand-rolled SVG, no chart library, no ResizeObserver.
// =============================================================================
// Decorative by contract: every number it draws is also present as text in the
// card's stats row, so it is aria-hidden and screen readers lose nothing.
function Sparkline({ logs }: { logs: DartsExerciseLog[] }) {
  const points = scoredLogs(logs);
  if (points.length < 2) return null;

  const W = 120;
  const H = 28;
  const PAD = 2;
  const values = points.map((p) => p.score);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const coords = values.map((v, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (values.length - 1);
    const y = H - PAD - ((v - min) / span) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const lastX = PAD + (W - PAD * 2);
  const lastY = H - PAD - ((values[values.length - 1] - min) / span) * (H - PAD * 2);

  return (
    <svg className="dt-spark" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">
      <polyline className="dt-spark-line" points={coords.join(' ')} />
      <circle className="dt-spark-dot" cx={lastX} cy={lastY} r={2.5} />
    </svg>
  );
}

// =============================================================================
// Progress chart — Recharts, mounted only when its panel is open.
// =============================================================================
function ProgressChart({ exercise }: { exercise: DartsTrainingExercise }) {
  const points = scoredLogs(exercise.logs);
  const units = unitsUsed(exercise.logs);
  const mixedUnits = units.length > 1;

  if (points.length === 0) {
    return (
      <p className="dt-chart-empty">
        Nog geen sessie met een score. Zodra je er een logt, verschijnt hier de lijn.
      </p>
    );
  }

  const data = points.map((p, i) => ({
    key: `${p.logDate}#${p.seq}`,
    label: shortDay(p.logDate),
    date: p.logDate,
    score: p.score,
    unit: p.unit,
    index: i,
  }));
  const values = points.map((p) => p.score);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(1, Math.round((max - min) * 0.15));
  const unitLabel = units.length === 1 ? units[0] : null;

  // The whole series as one sentence, for the role="img" label. Below it, the
  // same numbers as a real table for anyone navigating cell by cell.
  const summary =
    `Scoreverloop over ${points.length} ${points.length === 1 ? 'sessie' : 'sessies'}, ` +
    `van ${fmtNumber(values[0])} op ${fmtDate(points[0].logDate)} ` +
    `tot ${fmtNumber(values[values.length - 1])} op ${fmtDate(points[points.length - 1].logDate)}. ` +
    `Laagste ${fmtNumber(min)}, hoogste ${fmtNumber(max)}${unitLabel ? ` ${unitLabel}` : ''}.`;

  return (
    <div className="dt-chart">
      <div className="dt-chart-canvas" role="img" aria-label={summary}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -14 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="label" tick={axisTick} stroke={MUTED} minTickGap={24} />
            <YAxis
              tick={axisTick}
              stroke={MUTED}
              width={42}
              domain={[Math.floor(min - pad), Math.ceil(max + pad)]}
              tickFormatter={(v: number) => fmtNumber(v)}
            />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              labelStyle={{ color: MUTED }}
              formatter={(v: number, _n, item) => {
                const u = (item?.payload as { unit?: string | null } | undefined)?.unit;
                return [`${fmtNumber(v)}${u ? ` ${u}` : ''}`, 'Score'];
              }}
              labelFormatter={(_l, payload) => {
                const d = (payload?.[0]?.payload as { date?: string } | undefined)?.date;
                return d ? fmtDate(d) : '';
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={MARKER}
              strokeWidth={1.75}
              dot={{ r: 2.5, strokeWidth: 0, fill: MARKER }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {mixedUnits && (
        <p className="dt-chart-note">
          Let op: deze sessies zijn in verschillende eenheden gelogd ({units.join(', ')}).
          De lijn zet ze op één as, dus vergelijk ze met die kanttekening.
        </p>
      )}

      {/* The same data, navigable. Visually hidden, fully in the a11y tree. */}
      <table className="sr-only">
        <caption>{`Gelogde sessies van ${exercise.title ?? exercise.slug}`}</caption>
        <thead>
          <tr><th scope="col">Datum</th><th scope="col">Score</th><th scope="col">Eenheid</th></tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={`${p.logDate}#${p.seq}`}>
              <td>{fmtDate(p.logDate)}</td>
              <td>{fmtNumber(p.score)}</td>
              <td>{p.unit ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// Log form — the write.
// =============================================================================
type SubmitPhase =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'error'; message: string };

function LogForm({
  exercise,
  today,
  onLogged,
  onCancel,
}: {
  exercise: DartsTrainingExercise;
  today: string;
  onLogged: (date: string) => void;
  onCancel: () => void;
}) {
  const uid = useId();
  const [date, setDate] = useState(today);
  const [score, setScore] = useState('');
  const [unit, setUnit] = useState(exercise.lastUnit ?? '');
  const [result, setResult] = useState('');
  const [note, setNote] = useState('');
  const [phase, setPhase] = useState<SubmitPhase>({ kind: 'idle' });
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Opening the form moves focus into it, so a keyboard user is not left behind
  // on the trigger while the fields appear below.
  useEffect(() => { firstFieldRef.current?.focus(); }, []);

  // Units this exercise has actually been logged in — a suggestion list built
  // from real data, so it grows on its own and never invents a unit.
  const unitSuggestions = useMemo(() => unitsUsed(exercise.logs), [exercise.logs]);

  const busy = phase.kind === 'saving';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setPhase({ kind: 'saving' });

    const payload: LogSessionInput = { date };
    if (score.trim()) payload.score = score.trim();
    if (unit.trim()) payload.unit = unit.trim();
    if (result.trim()) payload.result = result.trim();
    if (note.trim()) payload.note = note.trim();

    const res = await cockpitWrite<LogSessionResponse>(
      `${ENDPOINT}/${encodeURIComponent(exercise.slug)}/log`,
      'POST',
      payload,
    );

    switch (res.kind) {
      case 'ok':
        onLogged(date);
        return;
      case 'disabled':
        setPhase({
          kind: 'error',
          message: 'Schrijven staat uit in deze Cockpit (WORKBENCH_WRITE_ENABLED is niet 1).',
        });
        return;
      case 'not-found':
        setPhase({ kind: 'error', message: 'Deze oefening of de notitie is niet gevonden op schijf.' });
        return;
      case 'auth':
        setPhase({ kind: 'error', message: 'Je sessie is verlopen — log opnieuw in en probeer het nogmaals.' });
        return;
      case 'too-large':
        setPhase({ kind: 'error', message: 'De notitie is te lang.' });
        return;
      default:
        setPhase({
          kind: 'error',
          message: 'message' in res && res.message ? res.message : 'Opslaan is niet gelukt.',
        });
    }
  };

  return (
    <form className="dt-form" onSubmit={(e) => void submit(e)} noValidate>
      <fieldset className="dt-form-fields" disabled={busy}>
        <legend className="sr-only">{`Sessie loggen voor ${exercise.title ?? exercise.slug}`}</legend>

        <div className="dt-field dt-field--date">
          <label htmlFor={`${uid}-date`}>Datum</label>
          <input
            id={`${uid}-date`}
            ref={firstFieldRef}
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="dt-field dt-field--score">
          <label htmlFor={`${uid}-score`}>Score</label>
          <input
            id={`${uid}-score`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="22"
            aria-describedby={`${uid}-score-hint`}
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          <p className="dt-hint" id={`${uid}-score-hint`}>Mag leeg blijven — de datum alleen is ook een sessie.</p>
        </div>

        <div className="dt-field dt-field--unit">
          <label htmlFor={`${uid}-unit`}>Eenheid</label>
          <input
            id={`${uid}-unit`}
            type="text"
            autoComplete="off"
            list={unitSuggestions.length ? `${uid}-units` : undefined}
            placeholder="punten"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          {unitSuggestions.length > 0 && (
            <datalist id={`${uid}-units`}>
              {unitSuggestions.map((u) => <option key={u} value={u} />)}
            </datalist>
          )}
        </div>

        <div className="dt-field dt-field--wide">
          <label htmlFor={`${uid}-result`}>Uitslag</label>
          <input
            id={`${uid}-result`}
            type="text"
            autoComplete="off"
            placeholder="22 punten over 10 beurten"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </div>

        <div className="dt-field dt-field--wide">
          <label htmlFor={`${uid}-note`}>Notitie</label>
          <textarea
            id={`${uid}-note`}
            rows={2}
            placeholder="Wat viel je op?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </fieldset>

      {phase.kind === 'error' && (
        <p className="dt-form-error" role="alert">
          <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
          {phase.message}
        </p>
      )}

      <div className="dt-form-actions">
        <span className="dt-hint">Wordt weggeschreven naar de notitie zelf.</span>
        <button type="button" className="dt-btn" onClick={onCancel} disabled={busy}>
          Annuleren
        </button>
        <button type="submit" className="dt-btn dt-btn--primary" disabled={busy}>
          {busy ? 'Opslaan…' : 'Sessie loggen'}
        </button>
      </div>
    </form>
  );
}

// =============================================================================
// Exercise card
// =============================================================================
function ExerciseCard({
  exercise,
  today,
  writeEnabled,
  onLogged,
}: {
  exercise: DartsTrainingExercise;
  today: string;
  writeEnabled: boolean;
  onLogged: () => void;
}) {
  const uid = useId();
  const [formOpen, setFormOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const logButtonRef = useRef<HTMLButtonElement | null>(null);

  const name = exercise.exerciseName || exercise.title || exercise.slug;
  const scored = scoredLogs(exercise.logs);

  const handleLogged = (date: string) => {
    setFormOpen(false);
    setFlash(`Sessie van ${fmtDate(date)} gelogd in de notitie.`);
    // Focus returns to the control that opened the form — never stranded on a
    // node that just unmounted.
    window.setTimeout(() => logButtonRef.current?.focus(), 0);
    onLogged();
  };

  return (
    <li className="dt-card-li">
      <Card as="article" className="dt-card">
        <div className="dt-card-head">
          {exercise.exerciseNumber !== null && (
            <span className="dt-card-num" aria-hidden="true">{exercise.exerciseNumber}</span>
          )}
          <h3 className="dt-card-title">
            {exercise.exerciseNumber !== null && (
              <span className="sr-only">{`Oefening ${exercise.exerciseNumber}: `}</span>
            )}
            {name}
          </h3>
          <Sparkline logs={exercise.logs} />
        </div>

        <dl className="dt-stats">
          <div className="dt-stat">
            <dt>Sessies</dt>
            <dd className="font-mono tabular-nums">{exercise.sessions}</dd>
          </div>
          <div className="dt-stat">
            <dt>Laatste</dt>
            <dd className="font-mono tabular-nums">
              {exercise.lastScore !== null
                ? `${fmtNumber(exercise.lastScore)}${exercise.lastUnit ? ` ${exercise.lastUnit}` : ''}`
                : '—'}
            </dd>
          </div>
          <div className="dt-stat">
            <dt>Beste</dt>
            <dd className="font-mono tabular-nums">
              {exercise.bestScore !== null ? fmtNumber(exercise.bestScore) : '—'}
            </dd>
          </div>
          <div className="dt-stat">
            <dt>Gedaan</dt>
            <dd>{fmtSince(exercise.daysSinceLastLog)}</dd>
          </div>
        </dl>

        {exercise.keyElement && (
          <div className="dt-card-tags">
            <Chip title="Key element">{exercise.keyElement}</Chip>
          </div>
        )}

        {flash && <p className="dt-flash" role="status">{flash}</p>}

        <div className="dt-card-actions">
          {writeEnabled && exercise.noteAvailable ? (
            <button
              type="button"
              ref={logButtonRef}
              className="dt-btn dt-btn--primary"
              aria-expanded={formOpen}
              aria-controls={`${uid}-form`}
              onClick={() => { setFlash(null); setFormOpen((v) => !v); }}
            >
              <PenLine size={14} strokeWidth={1.75} aria-hidden="true" />
              {formOpen ? 'Sluiten' : 'Sessie loggen'}
            </button>
          ) : (
            <span className="dt-hint">
              {exercise.noteAvailable
                ? 'Loggen staat uit in deze Cockpit.'
                : 'De notitie van deze oefening staat niet op schijf.'}
            </span>
          )}

          <button
            type="button"
            className="dt-btn"
            aria-expanded={chartOpen}
            aria-controls={`${uid}-chart`}
            onClick={() => setChartOpen((v) => !v)}
          >
            <TrendingUp size={14} strokeWidth={1.75} aria-hidden="true" />
            Voortgang
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              aria-hidden="true"
              className={`dt-btn-chevron ${chartOpen ? 'is-open' : ''}`}
            />
          </button>

          <a className="dt-card-link" href={`#/library/darts_exercises/${encodeURIComponent(exercise.slug)}`}>
            Oefening lezen
          </a>
        </div>

        {/* Both panels stay in the DOM only while open — the Recharts container
            (and its ResizeObserver) never mounts for a card nobody expanded. */}
        <div id={`${uid}-form`} hidden={!formOpen}>
          {formOpen && (
            <LogForm
              exercise={exercise}
              today={today}
              onLogged={handleLogged}
              onCancel={() => {
                setFormOpen(false);
                window.setTimeout(() => logButtonRef.current?.focus(), 0);
              }}
            />
          )}
        </div>

        <div id={`${uid}-chart`} hidden={!chartOpen}>
          {chartOpen && <ProgressChart exercise={exercise} />}
        </div>

        {scored.length === 1 && chartOpen && (
          <p className="dt-chart-note">Eén scorepunt — een lijn ontstaat vanaf de tweede sessie.</p>
        )}
      </Card>
    </li>
  );
}

// =============================================================================
// "Langst niet gedaan"
// =============================================================================
function NeglectedPanel({
  exercises,
  open,
  onToggle,
}: {
  exercises: DartsTrainingExercise[];
  open: boolean;
  onToggle: () => void;
}) {
  // Never-logged first (they are the biggest gap there is), then longest-ago.
  const ranked = useMemo(() => {
    return [...exercises]
      .sort((a, b) => {
        const aNever = a.daysSinceLastLog === null;
        const bNever = b.daysSinceLastLog === null;
        if (aNever !== bNever) return aNever ? -1 : 1;
        if (aNever && bNever) {
          return (a.trainingDay ?? 99) - (b.trainingDay ?? 99)
            || (a.exerciseNumber ?? 99) - (b.exerciseNumber ?? 99);
        }
        return (b.daysSinceLastLog ?? 0) - (a.daysSinceLastLog ?? 0);
      })
      .slice(0, NEGLECTED_LIMIT);
  }, [exercises]);

  const neverCount = exercises.filter((e) => e.daysSinceLastLog === null).length;

  return (
    <Section
      id="darts-neglected"
      icon={<CalendarClock size={22} strokeWidth={1.5} />}
      title="Langst niet gedaan"
      hint="waar de meeste winst ligt"
      summary={
        neverCount > 0
          ? `${neverCount} van ${exercises.length} nog nooit gelogd`
          : 'alles is een keer gedaan'
      }
      open={open}
      onToggle={onToggle}
    >
      {ranked.length === 0 ? (
        <p className="dt-hint">Nog geen oefeningen om te tonen.</p>
      ) : (
        <ul className="dt-neglected">
          {ranked.map((e) => (
            <li key={e.slug} className="dt-neglected-row">
              <span className="dt-neglected-day">
                {e.trainingDay !== null ? `Dag ${e.trainingDay}` : '—'}
              </span>
              <span className="dt-neglected-name">{e.exerciseName || e.title || e.slug}</span>
              <span
                className={`dt-neglected-since ${e.daysSinceLastLog === null ? 'is-never' : ''}`}
              >
                {fmtSince(e.daysSinceLastLog)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

// =============================================================================
// One training day
// =============================================================================
function DayGroup({
  day,
  moduleLabel,
  exercises,
  today,
  writeEnabled,
  onLogged,
}: {
  day: number | null;
  moduleLabel: string | null;
  exercises: DartsTrainingExercise[];
  today: string;
  writeEnabled: boolean;
  onLogged: () => void;
}) {
  const id = `darts-day-${day ?? 'overig'}`;
  const [open, toggle] = useCollapsed(id, true);

  const logged = exercises.filter((e) => e.sessions > 0).length;
  const title = day !== null ? `Dag ${day}` : 'Overige oefeningen';

  return (
    <Section
      id={id}
      icon={<Target size={22} strokeWidth={1.5} />}
      title={title}
      hint={moduleLabel ?? undefined}
      summary={`${logged}/${exercises.length} gelogd`}
      open={open}
      onToggle={toggle}
    >
      <ul className="dt-grid">
        {exercises.map((e) => (
          <ExerciseCard
            key={e.slug}
            exercise={e}
            today={today}
            writeEnabled={writeEnabled}
            onLogged={onLogged}
          />
        ))}
      </ul>
    </Section>
  );
}

// =============================================================================
// The view
// =============================================================================
export function DartsTrainingView() {
  const { data, loading, error, reload } = useTrainingDashboard();
  const [neglectedOpen, toggleNeglected] = useCollapsed('darts-neglected', true);

  const exercises = useMemo(() => data?.exercises ?? [], [data]);

  // Group by training day, days ascending, unnumbered exercises last.
  const days = useMemo(() => {
    const byDay = new Map<number | null, DartsTrainingExercise[]>();
    for (const e of exercises) {
      const key = e.trainingDay ?? null;
      const bucket = byDay.get(key);
      if (bucket) bucket.push(e);
      else byDay.set(key, [e]);
    }
    return Array.from(byDay.entries())
      .sort((a, b) => {
        if (a[0] === null) return 1;
        if (b[0] === null) return -1;
        return a[0] - b[0];
      })
      .map(([day, list]) => ({
        day,
        // The module name is a label on every exercise of the day; take the
        // first one that actually carries it rather than assuming they all do.
        moduleLabel: list.find((e) => e.courseModule)?.courseModule ?? null,
        exercises: list,
      }));
  }, [exercises]);

  const totals = useMemo(() => {
    const sessions = exercises.reduce((sum, e) => sum + e.sessions, 0);
    const lastDates = exercises.map((e) => e.lastLogged).filter((d): d is string => !!d).sort();
    return { sessions, lastTrained: lastDates.length ? lastDates[lastDates.length - 1] : null };
  }, [exercises]);

  if (loading && !data) {
    return (
      <div className="list-skeleton" aria-busy="true">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="animate-fade-rise">
        <PageHeader title="Trainingsdashboard" icon={Target} />
        <Card>
          <p className="text-body font-[520] text-fg">Het trainingsdashboard kon niet laden</p>
          <p className="mt-sm text-caption text-fg-muted">{error}</p>
          <button type="button" className="dt-btn mt-md" onClick={() => void reload()}>
            Opnieuw proberen
          </button>
        </Card>
      </section>
    );
  }

  if (!data?.available) {
    return (
      <section className="animate-fade-rise">
        <PageHeader title="Trainingsdashboard" icon={Target} />
        <ModuleEmptyState title="Dartsoefeningen staan nog niet in je mirror" icon={Target}>
          De tabel <span className="font-mono">darts_exercises</span> ontbreekt. Draai{' '}
          <span className="font-mono">scripts/regen-mypka-db.py</span> om de oefeningen uit{' '}
          <span className="font-mono">PKM/My Life/Darts Exercises/</span> in te lezen.
        </ModuleEmptyState>
      </section>
    );
  }

  if (exercises.length === 0) {
    return (
      <section className="animate-fade-rise">
        <PageHeader title="Trainingsdashboard" icon={Target} />
        <ModuleEmptyState title="Nog geen oefeningen" icon={Target}>
          De tabel bestaat, maar bevat nog geen oefeningen.
        </ModuleEmptyState>
      </section>
    );
  }

  const today = data.today ?? new Date().toISOString().slice(0, 10);

  return (
    <section className="dt-view animate-fade-rise">
      <PageHeader
        title="Trainingsdashboard"
        icon={Target}
        subtitle={
          `${exercises.length} oefeningen · ${totals.sessions} ${totals.sessions === 1 ? 'sessie' : 'sessies'} gelogd` +
          (totals.lastTrained ? ` · laatst getraind ${fmtDate(totals.lastTrained)}` : '')
        }
      />

      {!data.writeEnabled && (
        <p className="dt-readonly-note" role="status">
          Deze Cockpit draait zonder schrijfrechten, dus loggen is uitgeschakeld.
          Zet <span className="font-mono">WORKBENCH_WRITE_ENABLED=1</span> om sessies vanaf hier te loggen.
        </p>
      )}

      <div className="dt-sections">
        <NeglectedPanel exercises={exercises} open={neglectedOpen} onToggle={toggleNeglected} />

        {days.map(({ day, moduleLabel, exercises: list }) => (
          <DayGroup
            key={day ?? 'overig'}
            day={day}
            moduleLabel={moduleLabel}
            exercises={list}
            today={today}
            writeEnabled={data.writeEnabled}
            onLogged={() => void reload()}
          />
        ))}
      </div>
    </section>
  );
}
