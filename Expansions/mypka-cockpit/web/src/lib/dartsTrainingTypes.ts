// dartsTrainingTypes.ts — the wire types for the Darts Training dashboard.
//
// Mirrors the payload shaped by server/dartsTrainingApi.js. Two sources feed it:
// the exercise DEFINITIONS come from mypka.db (`darts_exercises`), the LOGS are
// parsed straight out of each note's `## Logboek` section on disk, so a session
// logged from this surface is visible before the next regen has run.
//
// Nullability is deliberate everywhere. A logged session with no score is a
// perfectly valid record ("I did it" is the fact), and the schema says so:
// darts_exercise_logs.score is nullable by design. Nothing here may render a
// missing number as 0 — an em-dash is the honest answer.

/** One performed session, from a `### YYYY-MM-DD` block in the note. */
export interface DartsExerciseLog {
  /** ISO date from the block's heading. Always present — it IS the record. */
  logDate: string;
  /** 0-based order of this block WITHIN its date. Two sessions on one day are
   *  two results, not a correction of one another (unlike a habit check-in). */
  seq: number;
  /** Numeric result, or null when the session was logged without one. */
  score: number | null;
  /** Free-text unit for `score` ('punten', 'darts', 'legs', …). Per session,
   *  because different exercises — and different days — score differently. */
  unit: string | null;
  /** Short textual outcome for the cases one number cannot carry. */
  result: string | null;
  /** Provenance ('cockpit', 'chat', 'close-session', …). Server-owned. */
  trigger: string | null;
  note: string | null;
}

/** One exercise: its definition plus every session logged against it. */
export interface DartsTrainingExercise {
  slug: string;
  title: string | null;
  exerciseName: string | null;
  status: string | null;
  course: string | null;
  courseModule: string | null;
  /** Day within the course (1..4). Null for anything unnumbered. */
  trainingDay: number | null;
  /** Order within that day. Null for lessons without a number. */
  exerciseNumber: number | null;
  keyElement: string | null;
  /** False when the mirror knows the exercise but its note is gone from disk.
   *  Such a row still shows (it is part of the course) but cannot be logged to. */
  noteAvailable: boolean;

  // ---- derived, computed server-side from `logs` ----
  sessions: number;
  firstLogged: string | null;
  lastLogged: string | null;
  lastScore: number | null;
  lastUnit: string | null;
  bestScore: number | null;
  /** Whole days since the last session; null when never logged. */
  daysSinceLastLog: number | null;

  /** Oldest first — the order the chart plots and the file already implies. */
  logs: DartsExerciseLog[];
}

export interface DartsTrainingResponse {
  /** False on a mirror without a `darts_exercises` table (bare scaffold). */
  available: boolean;
  exercises: DartsTrainingExercise[];
  /** Whether WORKBENCH_WRITE_ENABLED is on. When false the log form is replaced
   *  by a calm read-only notice instead of a button that would always 503. */
  writeEnabled: boolean;
  /** Server-local today, so "days ago" math matches the server's. */
  today?: string;
}

/** 201 response of POST /api/cockpit/darts-training/:slug/log. `logs` is read
 *  back FROM THE FILE that was just written — never an optimistic guess. */
export interface LogSessionResponse {
  ok: true;
  slug: string;
  title: string | null;
  date: string;
  mtime: number;
  logs: DartsExerciseLog[];
}

/** The composer's payload. `trigger` is absent on purpose: it is provenance and
 *  the server owns it, which also keeps it off the injection surface. */
export interface LogSessionInput {
  date?: string;
  score?: string;
  unit?: string;
  result?: string;
  note?: string;
}
