// HydrationGauge.tsx — a filling glass for any habit that declares a numeric
// daily goal (daily_target / daily_target_unit in its frontmatter).
//
// Why a gauge and not another streak square: a streak answers "did you?", which
// is only useful once the day is over. A gauge answers "how much is left?",
// which is what you act on while the day is still running.
//
// Framing follows the same no-shame rule as HabitHeatmap: an unfilled glass is
// simply not full yet. It never turns red, and the copy says what remains, not
// what was missed. Overshooting the goal is fine — the fill caps at 100% and the
// surplus is stated plainly rather than flagged.
//
// Zero chart dependency: an inline SVG glass with a clipped fill rect. Tokens
// only (GL-003), no hardcoded hex.
import type { HabitCell, HabitTarget } from '../lib/trackingTypes';

// Local calendar date as YYYY-MM-DD. Deliberately NOT toISOString(), which
// would shift to UTC and show yesterday's glass for anyone east of Greenwich
// during the evening — precisely when Sander logs his last drink of the day.
export function localToday(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Round to at most one decimal, then drop a trailing ".0" so whole millilitres
// read as "250 ml", not "250.0 ml".
function tidy(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function HydrationGauge({
  cells,
  target,
  today = localToday(),
}: {
  cells: HabitCell[];
  target: HabitTarget;
  today?: string;
}) {
  const cell = cells.find((c) => c.date === today);
  const consumed = cell?.amount ?? 0;
  const unit = target.unit || cell?.unit || '';
  const goal = target.amount > 0 ? target.amount : 0;
  const ratio = goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const pct = Math.round(ratio * 100);
  const remaining = Math.max(goal - consumed, 0);
  const surplus = Math.max(consumed - goal, 0);

  // Glass interior in SVG user units. The fill rect grows from the bottom up.
  const TOP = 6;
  const BOTTOM = 62;
  const height = (BOTTOM - TOP) * ratio;

  const label = goal > 0
    ? `${tidy(consumed)} van ${tidy(goal)} ${unit} — ${pct}%`
    : `${tidy(consumed)} ${unit}`;

  return (
    <div className="flex items-center gap-md">
      <svg
        width="44"
        height="70"
        viewBox="0 0 44 70"
        role="img"
        aria-label={label}
        className="shrink-0"
      >
        <defs>
          {/* Clip the fill to the glass interior so it never bleeds over the rim. */}
          <clipPath id="hydration-glass-inner">
            <path d="M8 6 L36 6 L32 62 L12 62 Z" />
          </clipPath>
        </defs>

        {/* Interior backdrop — the empty part of the glass. */}
        <path d="M8 6 L36 6 L32 62 L12 62 Z" fill="var(--surface-2)" />

        {/* The fill itself, growing from the bottom. */}
        <g clipPath="url(#hydration-glass-inner)">
          <rect
            x="0"
            y={BOTTOM - height}
            width="44"
            height={height}
            fill="var(--accent-marker-soft)"
          />
          {/* A denser band at the waterline so the level stays readable at a glance. */}
          {height > 0 && (
            <rect x="0" y={BOTTOM - height} width="44" height="2" fill="var(--accent-marker)" />
          )}
        </g>

        {/* Glass outline last, so it sits on top of the fill. */}
        <path
          d="M8 6 L36 6 L32 62 L12 62 Z"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex flex-col gap-[2px]">
        <span className="text-body font-[520] text-fg">
          {tidy(consumed)}{unit && ` ${unit}`}
          {goal > 0 && (
            <span className="text-fg-subtle font-[400]"> van {tidy(goal)}{unit && ` ${unit}`}</span>
          )}
        </span>
        <span className="text-caption text-fg-muted">
          {goal <= 0
            ? 'geen dagdoel ingesteld'
            : remaining > 0
              ? `nog ${tidy(remaining)}${unit && ` ${unit}`} te gaan`
              : surplus > 0
                ? `dagdoel gehaald · ${tidy(surplus)}${unit && ` ${unit}`} erboven`
                : 'dagdoel precies gehaald'}
        </span>
      </div>
    </div>
  );
}
