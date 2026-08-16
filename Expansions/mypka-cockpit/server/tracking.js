// tracking.js — read-only data layer for the Tracking panel (habit streaks +
// photo-nutrition gallery). Every statement is a SELECT against Silas's final
// schema (habit_logs / food_logs + the three views). Markdown is canonical; this
// never writes.
//
// Streak philosophy (Atlas): NO shame optics on gaps. Misses are surfaced
// neutrally — the server reports raw done/0/null state and counts; the CLIENT
// paints gaps in a soft neutral, never alarm-red. The message is "how fast back
// on", not "chain broken". So this module deliberately exposes the friendly
// signals (current_streak, days_since_last_log) and leaves the framing to the UI.
//
// Anxiety-free nutrition (hard rule): NO numbers, NO calories, NO scores. The
// food shape carries meal type, context tags, a visible-protein flag, a photo
// path, and the free-text note ONLY. No quantities are computed anywhere here.
//
// SCAFFOLD ADAPTATION (2026-06-11): habit_logs / food_logs / v_habit_streaks /
// v_habit_heatmap are OPTIONAL tables — absent until the tracking ingest is set
// up. All statements ride optionalStmt() (wellnessDb.js): lazy prepare in a
// try/catch, degrade to empty arrays, never crash the boot.
import { optionalStmt } from './wellnessDb.js';

// ---- HABITS ---------------------------------------------------------------

// One row per habit with its committed streak + lifetime tallies. Most-recent
// activity first so the most-alive habit reads at the top.
const streaksStmt = optionalStmt(`
  SELECT habit_slug, habit_name, last_committed_date, current_streak,
         total_done, committed_logs, last_amount, last_unit, days_since_last_log
  FROM v_habit_streaks
  ORDER BY (last_committed_date IS NULL), last_committed_date DESC, habit_name COLLATE NOCASE
`);

// Every heatmap cell (done = 1 hit / 0 miss / NULL pending) for every habit.
// The client buckets these into a per-habit calendar grid.
const heatmapStmt = optionalStmt(`
  SELECT habit_slug, habit_name, log_date, done, amount, unit, note, log_schema
  FROM v_habit_heatmap
  ORDER BY habit_slug, log_date
`);

export function getHabitTracking() {
  const streaks = streaksStmt.all();
  const heatRows = heatmapStmt.all();

  // Group heatmap cells per habit. A habit can appear in the heatmap with logs
  // but NOT in v_habit_streaks (e.g. only NULL-done pending rows) — and vice
  // versa — so we union both keyed sets into one habit list, no row dropped.
  const byHabit = new Map();
  const ensure = (slug, name) => {
    if (!byHabit.has(slug)) {
      byHabit.set(slug, { slug, name: name || slug, streak: null, cells: [] });
    }
    const h = byHabit.get(slug);
    if (name && (!h.name || h.name === slug)) h.name = name;
    return h;
  };

  for (const r of heatRows) {
    const h = ensure(r.habit_slug, r.habit_name);
    h.cells.push({
      date: r.log_date,
      // done is 1 | 0 | null in the mirror — keep that tri-state verbatim so the
      // client can render hit / soft-miss / pending distinctly.
      done: r.done === null ? null : Number(r.done),
      amount: r.amount == null ? null : Number(r.amount),
      unit: r.unit || null,
      note: r.note || null,
      schema: r.log_schema || null,
    });
  }

  for (const s of streaks) {
    const h = ensure(s.habit_slug, s.habit_name);
    h.streak = s.last_committed_date == null ? null : {
      current: s.current_streak ?? 0,
      totalDone: s.total_done ?? 0,
      committedLogs: s.committed_logs ?? 0,
      lastAmount: s.last_amount == null ? null : Number(s.last_amount),
      lastUnit: s.last_unit || null,
      lastDate: s.last_committed_date || null,
      daysSinceLast: s.days_since_last_log == null ? null : Number(s.days_since_last_log),
    };
  }

  // Most-recent activity first; habits with no cells fall to the back calmly.
  const habits = [...byHabit.values()].sort((a, b) => {
    const ad = a.cells.length ? a.cells[a.cells.length - 1].date : '';
    const bd = b.cells.length ? b.cells[b.cells.length - 1].date : '';
    return bd.localeCompare(ad) || a.name.localeCompare(b.name);
  });

  return habits;
}

// ---- FOOD (photo nutrition) -----------------------------------------------

const foodStmt = optionalStmt(`
  SELECT f.id,
         f.log_date,
         f.logged_at,
         f.meal_type,
         f.description,
         f.source_type,
         f.kcal_min, f.kcal_max,
         f.protein_g_min, f.protein_g_max,
         f.carbs_g_min, f.carbs_g_max,
         f.fat_g_min, f.fat_g_max,
         f.confidence,
         f.photo_path,
         f.journal_slug,
         f.supersedes_entry_id
  FROM food_logs f
  WHERE f.is_active = 1
  ORDER BY f.log_date DESC, f.logged_at, f.id
`);

const foodDaysStmt = optionalStmt(`
  SELECT log_date, kcal_min, kcal_max, kcal_mid,
         protein_g_min, protein_g_max, carbs_g_min, carbs_g_max,
         fat_g_min, fat_g_max, day_complete, confirmed_at
  FROM v_food_day_totals ORDER BY log_date DESC
`);

export function getFoodTracking() {
  const rows = foodStmt.all();
  return rows.map((r) => ({
    id: r.id,
    date: r.log_date || null,
    loggedAt: r.logged_at || null,
    mealType: r.meal_type || null,
    description: r.description || null,
    sourceType: r.source_type || null,
    kcal: [r.kcal_min, r.kcal_max],
    proteinG: [r.protein_g_min, r.protein_g_max],
    carbsG: [r.carbs_g_min, r.carbs_g_max],
    fatG: [r.fat_g_min, r.fat_g_max],
    confidence: r.confidence || null,
    photoPath: r.photo_path || null,
    journalSlug: r.journal_slug || null,
    supersedesEntryId: r.supersedes_entry_id || null,
  }));
}

export function getFoodDays() {
  return foodDaysStmt.all().map((r) => ({
    date: r.log_date,
    kcal: [r.kcal_min, r.kcal_max], kcalMid: r.kcal_mid,
    proteinG: [r.protein_g_min, r.protein_g_max],
    carbsG: [r.carbs_g_min, r.carbs_g_max], fatG: [r.fat_g_min, r.fat_g_max],
    complete: r.day_complete == null ? null : Number(r.day_complete) === 1,
    confirmedAt: r.confirmed_at || null,
  }));
}

export function getTracking() {
  return {
    habits: getHabitTracking(),
    food: getFoodTracking(),
    foodDays: getFoodDays(),
  };
}
