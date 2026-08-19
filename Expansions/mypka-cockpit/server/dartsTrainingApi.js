// dartsTrainingApi.js — the DARTS TRAINING dashboard: read surface + the one
// write that logs a session.
//
// The library foundation (libraryApi.js) already browses `darts_exercises` as a
// generic collection. This module is the TRACKING half the generic surface
// cannot express: progress per exercise over time, a day-by-day course overview,
// and a form that records a session.
//
// ── WHERE EACH HALF OF THE DATA COMES FROM (the whole design in one place) ────
//
//   DEFINITIONS  ← mypka.db (`darts_exercises`, read-only via db.js)
//       Static content: title, exercise_name, training_day, exercise_number,
//       key_element, course_module. These change only when the course is
//       re-imported, so the mirror is a perfectly good source for them.
//
//   LOGS         ← THE MARKDOWN FILES THEMSELVES (PKM/My Life/Darts Exercises/)
//       NOT from `darts_exercise_logs`. That table is regen-owned (it is in
//       OWNED_TABLES of scripts/regen-mypka-db.py): it is dropped and rebuilt on
//       every regen, which means between a log and the next regen the mirror is
//       BEHIND the truth. Reading the `## Logboek` sections straight off disk
//       makes a session that was just written visible immediately — the exact
//       problem journalEntries.js already solves for fresh journal entries, and
//       the same established file-layer answer.
//
//       Consequence, stated plainly: this surface can be AHEAD of the mirror,
//       never behind it. After a regen the two agree exactly, because the parser
//       below is a line-for-line port of parse_exercise_logs() in
//       regen-mypka-db.py — same section extraction, same HTML-comment strip
//       (every note ships a commented-out worked example carrying a real-looking
//       date; both parsers must ignore it), same field regex, same seq rule.
//
// ── WHY THE WRITE GOES TO MARKDOWN AND NOT TO THE DATABASE ───────────────────
// An INSERT into `darts_exercise_logs` does not survive the next regen. The
// podcasts carve-out (podcastsDb.js) is allowed precisely BECAUSE the podcast
// tables are not regen-owned; that argument does not reach this module. So the
// write appends a `### YYYY-MM-DD` block to the note's `## Logboek` section.
// Markdown stays canonical, the mirror stays derived, and the regen picks the
// session up on its next run without anything to reconcile.
//
// ── SECURITY POSTURE (mirrors journalEntries.js / workbench.js) ──────────────
//   * Path JAIL: every read and the write are realpath-anchored to
//     PKM/My Life/Darts Exercises/ and must sit FLAT inside it (no subfolder, no
//     traversal, no symlink escape).
//   * The write target is derived SERVER-SIDE from a slug that must (a) match a
//     strict slug charset and (b) be a slug the mirror actually knows. The
//     `file_path` column is never fed back into the filesystem.
//   * Every user string is flattened to a single line before it is written, so a
//     value can never forge a `### date` heading, a `- score:` field, or an HTML
//     comment inside someone else's log block.
//   * Writes are gated by the same WORKBENCH_WRITE_ENABLED + session + CSRF
//     stack as the Fleeting-Notes and journal write paths (wired in server.js).
//   * The file is replaced atomically (temp in the same dir → fsync → rename),
//     so a failed write leaves the note untouched.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import db from './db.js';
import { REPO_ROOT } from './repoRoot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The jail root. The exercise notes live FLAT in this one folder.
const EXERCISES_DIR = path.resolve(REPO_ROOT, 'PKM', 'My Life', 'Darts Exercises');

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,120}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TMP_PREFIX = '.dttmp-';

// Field caps. Generous for a note, bounded enough that a runaway client cannot
// grow a note without limit.
const MAX_UNIT = 40;
const MAX_RESULT = 300;
const MAX_NOTE = 1000;
const MAX_SCORE_ABS = 1e9;

// ── audit log (same shape + location as workbench.js / journalEntries.js) ─────
const AUDIT_DIR = path.resolve(__dirname, '..', 'workbench-audit');
function appendAuditRecord(record) {
  try {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(AUDIT_DIR, `darts-training-writes-${ym}.log`),
      JSON.stringify(record) + '\n',
      { mode: 0o600 },
    );
  } catch (err) {
    console.error('[darts-training audit] failed to append record:', err.message);
  }
}

// ── availability (calm degrade on a bare scaffold) ────────────────────────────
function tableExists(name) {
  try {
    return !!db
      .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1`)
      .get(name);
  } catch {
    return false;
  }
}

// =============================================================================
// LOGBOOK PARSER — a line-for-line port of parse_exercise_logs() in
// scripts/regen-mypka-db.py. Any change here is a change there; they are one
// contract with two implementations, and they must not drift.
// =============================================================================
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;
const LOGBOOK_HEADING_RE = /^##[ \t]+Logboek[ \t]*$/m;
const NEXT_H2_RE = /^##[ \t]+/m;
const DATE_HEADING_RE = /^###[ \t]+(\d{4}-\d{2}-\d{2})[ \t]*$/gm;
const LOG_FIELD_RE = /^[ \t]*-[ \t]*(score|unit|result|trigger|note)[ \t]*:[ \t]*(.*?)[ \t]*$/gim;

// Returns { start, end } character offsets of the `## Logboek` section's BODY
// (everything after the heading line, up to the next `## ` heading or EOF), or
// null when the note has no Logboek section at all.
function logbookSectionRange(md) {
  const heading = LOGBOOK_HEADING_RE.exec(md);
  if (!heading) return null;
  const start = heading.index + heading[0].length;
  const rest = md.slice(start);
  const next = NEXT_H2_RE.exec(rest);
  return { start, end: next ? start + next.index : md.length };
}

// Parse one note's logged sessions. Mirrors the Python exactly:
//   * HTML comments are stripped FIRST (the shipped worked example carries a
//     real-looking date and must never read as a session).
//   * A bare date heading with no bullets still yields a session — writing the
//     date down IS the record that you did it.
//   * Repeated dates are KEPT, each with its own `seq`. Two sessions in a day
//     are two results, not a correction of one another.
//   * A non-numeric `score:` is not dropped; it survives as `result`.
function parseExerciseLogs(md) {
  const range = logbookSectionRange(md);
  if (!range) return [];
  const section = md.slice(range.start, range.end).replace(HTML_COMMENT_RE, '');

  const headings = [];
  DATE_HEADING_RE.lastIndex = 0;
  let h;
  while ((h = DATE_HEADING_RE.exec(section)) !== null) {
    headings.push({ date: h[1], start: h.index, end: h.index + h[0].length });
  }

  const out = [];
  const seenPerDate = new Map();
  for (let i = 0; i < headings.length; i += 1) {
    const blockEnd = i + 1 < headings.length ? headings[i + 1].start : section.length;
    const block = section.slice(headings[i].end, blockEnd);

    const fields = {};
    LOG_FIELD_RE.lastIndex = 0;
    let f;
    while ((f = LOG_FIELD_RE.exec(block)) !== null) {
      fields[f[1].toLowerCase()] = f[2].trim();
    }

    let score = null;
    if (fields.score) {
      const n = Number.parseFloat(fields.score.replace(',', '.'));
      if (Number.isFinite(n)) score = n;
      else if (fields.result === undefined) fields.result = fields.score;
    }

    const logDate = headings[i].date;
    const seq = seenPerDate.get(logDate) ?? 0;
    seenPerDate.set(logDate, seq + 1);

    out.push({
      logDate,
      seq,
      score,
      unit: fields.unit || null,
      result: fields.result || null,
      trigger: fields.trigger || null,
      note: fields.note || null,
    });
  }
  return out;
}

// ── file-layer read, mtime-cached ─────────────────────────────────────────────
// 22 small notes today; re-parsing them per request is cheap, but the dashboard
// polls after every write, so cache on (mtimeMs, size) and re-read only what
// actually changed on disk.
const logCache = new Map(); // abs -> { mtimeMs, size, logs }

function readLogsForFile(abs) {
  let stat;
  try {
    stat = fs.statSync(abs);
    if (!stat.isFile()) return [];
  } catch {
    return [];
  }
  const hit = logCache.get(abs);
  if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit.logs;

  let md;
  try {
    md = fs.readFileSync(abs, 'utf8');
  } catch {
    return [];
  }
  const logs = parseExerciseLogs(md);
  logCache.set(abs, { mtimeMs: stat.mtimeMs, size: stat.size, logs });
  return logs;
}

// ── path jail ─────────────────────────────────────────────────────────────────
// Resolve "<slug>.md" INSIDE the exercises folder. The candidate must land flat
// in the realpath'd jail (path.relative containment, exactly one segment), and —
// when it already exists — be a plain regular file, never a symlink.
function containedExercisePath(slug) {
  if (typeof slug !== 'string' || !SLUG_RE.test(slug)) return null;
  const filename = `${slug}.md`;
  if (filename.includes('/') || filename.includes('\\') || filename.includes('\0') || filename.includes(path.sep)) {
    return null;
  }
  let jailReal;
  try {
    jailReal = fs.realpathSync(EXERCISES_DIR);
  } catch {
    return null; // no exercises folder → nothing to read or write
  }
  const abs = path.resolve(jailReal, filename);
  const rel = path.relative(jailReal, abs);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel) || rel !== filename) return null;

  if (fs.existsSync(abs)) {
    let lst;
    try { lst = fs.lstatSync(abs); } catch { return null; }
    if (lst.isSymbolicLink() || !lst.isFile()) return null;
    let real;
    try { real = fs.realpathSync(abs); } catch { return null; }
    const relReal = path.relative(jailReal, real);
    if (relReal === '' || relReal.startsWith('..') || path.isAbsolute(relReal) || relReal.includes(path.sep)) {
      return null;
    }
  }
  return { abs, jailReal, filename };
}

// =============================================================================
// READ — the dashboard payload
// =============================================================================
// Definitions from the mirror, logs from disk, joined here. Returns a calm
// `{ available: false }` envelope when the mirror has no darts_exercises table
// (bare scaffold / libraries not installed) — never a 500.
export function getTrainingDashboard() {
  if (!tableExists('darts_exercises')) {
    return { available: false, exercises: [], writeEnabled: isWriteEnabled() };
  }

  const rows = db
    .prepare(
      `SELECT slug, title, exercise_name, status, course, course_module,
              training_day, exercise_number, key_element
       FROM darts_exercises
       ORDER BY training_day IS NULL, training_day ASC,
                exercise_number IS NULL, exercise_number ASC,
                title COLLATE NOCASE ASC`,
    )
    .all();

  const today = todayLocalDate();
  const exercises = rows.map((r) => {
    const contained = containedExercisePath(r.slug);
    // A definition whose note is missing on disk is honest about it: the row
    // stays visible (it is still part of the course) but carries no logs and
    // cannot be logged to.
    const logs = contained ? readLogsForFile(contained.abs) : [];
    const sorted = [...logs].sort((a, b) =>
      a.logDate === b.logDate ? a.seq - b.seq : a.logDate < b.logDate ? -1 : 1,
    );
    const scored = sorted.filter((l) => typeof l.score === 'number');
    const last = sorted.length ? sorted[sorted.length - 1] : null;

    return {
      slug: r.slug,
      title: r.title,
      exerciseName: r.exercise_name,
      status: r.status,
      course: r.course,
      courseModule: r.course_module,
      trainingDay: r.training_day,
      exerciseNumber: r.exercise_number,
      keyElement: r.key_element,
      noteAvailable: !!contained && fs.existsSync(contained.abs),
      sessions: sorted.length,
      firstLogged: sorted.length ? sorted[0].logDate : null,
      lastLogged: last ? last.logDate : null,
      lastScore: last ? last.score : null,
      lastUnit: last ? last.unit : null,
      bestScore: scored.length ? Math.max(...scored.map((l) => l.score)) : null,
      daysSinceLastLog: last ? daysBetween(last.logDate, today) : null,
      logs: sorted,
    };
  });

  return { available: true, exercises, writeEnabled: isWriteEnabled(), today };
}

// =============================================================================
// WRITE — append one session to a note's ## Logboek
// =============================================================================
// Result contract (the route maps these to status codes):
//   { ok:'unavailable' }      — mirror has no darts_exercises table   → 503
//   { ok:'bad-slug' }         — slug charset / jail rejection         → 400
//   { ok:'unknown' }          — slug is not a known exercise          → 404
//   { ok:'missing-note' }     — known slug, note absent on disk       → 404
//   { ok:'bad-date' }         — date not a valid YYYY-MM-DD           → 400
//   { ok:'bad-score' }        — score present but not a finite number → 400
//   { ok:'logged', ... }      — success                               → 201
export function logExerciseSession(slug, input = {}) {
  if (!tableExists('darts_exercises')) return { ok: 'unavailable' };

  // (a) The slug must be one the mirror knows. This is what keeps an arbitrary
  //     in-charset slug from ever reaching the filesystem.
  const known = db
    .prepare(`SELECT slug, title FROM darts_exercises WHERE slug = ? LIMIT 1`)
    .get(slug);
  if (!known) {
    // Distinguish "not a slug at all" from "a slug we don't have", so the client
    // can say something useful.
    return SLUG_RE.test(String(slug)) ? { ok: 'unknown' } : { ok: 'bad-slug' };
  }

  const contained = containedExercisePath(known.slug);
  if (!contained) return { ok: 'bad-slug' };
  if (!fs.existsSync(contained.abs)) return { ok: 'missing-note' };

  // (b) Date: absent → server-local today. Present → must be a real calendar
  //     date. Never taken into a path (the file is keyed on slug alone), but a
  //     bad date would still poison the log and the next regen.
  const hasDate = typeof input.date === 'string' && input.date.trim() !== '';
  const date = hasDate ? input.date.trim() : todayLocalDate();
  if (!isValidCalendarDate(date)) return { ok: 'bad-date' };

  // (c) Score: optional. When present it must be a finite, bounded number. A
  //     comma decimal is accepted (Dutch keyboards) and normalised to a dot.
  let score = null;
  if (input.score !== undefined && input.score !== null && String(input.score).trim() !== '') {
    const n = typeof input.score === 'number'
      ? input.score
      : Number.parseFloat(String(input.score).replace(',', '.'));
    if (!Number.isFinite(n) || Math.abs(n) > MAX_SCORE_ABS) return { ok: 'bad-score' };
    score = n;
  }

  const unit = oneLine(input.unit, MAX_UNIT);
  const result = oneLine(input.result, MAX_RESULT);
  const note = oneLine(input.note, MAX_NOTE);

  // (d) Build the block. `trigger` is PROVENANCE, not user input — the client
  //     never supplies it, so it is not an injection surface and a log written
  //     here is always traceable back to the cockpit.
  const lines = [`### ${date}`];
  if (score !== null) lines.push(`- score: ${formatScore(score)}`);
  if (unit) lines.push(`- unit: ${unit}`);
  if (result) lines.push(`- result: ${result}`);
  lines.push('- trigger: cockpit');
  if (note) lines.push(`- note: ${note}`);
  const block = `${lines.join('\n')}\n`;

  // (e) Read → splice → atomic replace. The read happens as late as possible so
  //     the window in which another writer could slip in is as small as we can
  //     make it without a lock the rest of the cockpit does not have either.
  let md;
  try {
    md = fs.readFileSync(contained.abs, 'utf8');
  } catch (err) {
    if (err && err.code === 'ENOENT') return { ok: 'missing-note' };
    throw err;
  }
  const normalised = md.replace(/\r\n?/g, '\n');
  const updated = insertLogBlock(normalised, block);

  const stat = atomicWrite(contained.abs, updated);
  logCache.delete(contained.abs); // force a re-parse on the next read

  appendAuditRecord({
    op: 'log-session',
    slug: known.slug,
    date,
    hasScore: score !== null,
    bytes: Buffer.byteLength(updated, 'utf8'),
    sha256: crypto.createHash('sha256').update(updated, 'utf8').digest('hex'),
    ts: new Date().toISOString(),
    source: 'cockpit',
  });

  return {
    ok: 'logged',
    slug: known.slug,
    title: known.title,
    date,
    mtime: Math.floor(stat.mtimeMs),
    // Echo the sessions back FROM THE FILE we just wrote, so the UI takes its
    // new state from canon rather than from an optimistic guess (the same rule
    // the podcasts watch-toggle follows against its view).
    logs: readLogsForFile(contained.abs).sort((a, b) =>
      a.logDate === b.logDate ? a.seq - b.seq : a.logDate < b.logDate ? -1 : 1,
    ),
  };
}

// Splice a block into the note's `## Logboek` section, at the END of it (logs
// read chronologically, oldest first — the same order the file already implies).
// A note WITHOUT a Logboek section gets one appended rather than an error: the
// section is a convention, and refusing to record a real session because a
// heading is missing would lose data for no gain.
function insertLogBlock(md, block) {
  const range = logbookSectionRange(md);
  if (!range) {
    const tail = md.endsWith('\n') ? '' : '\n';
    return `${md}${tail}\n## Logboek\n\n${block}`;
  }
  const before = md.slice(0, range.end).replace(/\n+$/, '\n');
  const after = md.slice(range.end);
  // One blank line between the previous content and the new block; exactly one
  // trailing newline before whatever section follows.
  const separator = before.endsWith('\n') ? '\n' : '\n\n';
  return `${before}${separator}${block}${after ? `\n${after}` : ''}`;
}

// Temp-in-same-dir → fsync → rename. Lifted from workbench.js atomicWrite (save
// variant): a partial or failed write leaves the note byte-for-byte untouched.
function atomicWrite(targetAbs, content) {
  const dir = path.dirname(targetAbs);
  const rand = crypto.randomBytes(6).toString('hex');
  const tmpAbs = path.join(dir, `${TMP_PREFIX}${process.pid}-${rand}.tmp`);

  let fd;
  try {
    fd = fs.openSync(tmpAbs, 'wx', 0o644);
    fs.writeFileSync(fd, content, 'utf8');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.renameSync(tmpAbs, targetAbs);
    return fs.statSync(targetAbs);
  } finally {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch { /* noop */ } }
    try { if (fs.existsSync(tmpAbs)) fs.unlinkSync(tmpAbs); } catch { /* noop */ }
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

// Flatten any user string to ONE line of plain text. This is the whole
// injection defence for the write path: with every newline gone, a value can
// never forge a `### 2026-01-01` heading or a `- score:` field in the log, and
// with the HTML-comment delimiters gone it can never open a comment that would
// swallow the rest of the section (which BOTH parsers strip before reading).
function oneLine(v, max) {
  if (v === undefined || v === null) return '';
  return String(v)
    .replace(/<!--|-->/g, ' ')
    .replace(/[\r\n  ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

// Render a score the way a human would type it: no trailing ".0" on a whole
// number, no exponent notation, at most 3 decimals.
function formatScore(n) {
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toFixed(3)));
}

function todayLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Shape + coarse calendar-range check, same discipline as journalEntries.js.
function isValidCalendarDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map((n) => Number.parseInt(n, 10));
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  return Number.isInteger(y);
}

// Whole days between two YYYY-MM-DD dates, UTC-anchored so DST never shifts the
// count by one. Negative (a future date) clamps to 0.
function daysBetween(fromDate, toDate) {
  const a = Date.parse(`${fromDate}T00:00:00Z`);
  const b = Date.parse(`${toDate}T00:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, Math.round((b - a) / 86400000));
}

function isWriteEnabled() {
  return process.env.WORKBENCH_WRITE_ENABLED === '1';
}

// =============================================================================
// Route registration
// =============================================================================
// The READ is a plain safe() GET (global /api auth gate + loopback bind, no CSRF
// needed — it never writes). The WRITE reuses the cockpit's standard write stack
// verbatim, passed in from server.js so this module cannot weaken it.
export function registerDartsTrainingRoutes(app, deps) {
  const { safe, writeStack } = deps;

  app.get('/api/cockpit/darts-training', safe(() => getTrainingDashboard()));

  app.post('/api/cockpit/darts-training/:slug/log', ...writeStack, (req, res) => {
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ ok: false, error: 'body must be a JSON object' });
    }
    // Strict key allow-list. `trigger` is deliberately NOT accepted — the server
    // owns that field (see the write path above).
    const allowed = new Set(['date', 'score', 'unit', 'result', 'note']);
    const extras = Object.keys(body).filter((k) => !allowed.has(k));
    if (extras.length) {
      return res.status(400).json({ ok: false, error: `unexpected field(s): ${extras.join(', ')}` });
    }
    for (const k of ['date', 'unit', 'result', 'note']) {
      if (k in body && body[k] !== null && typeof body[k] !== 'string') {
        return res.status(400).json({ ok: false, error: `${k} must be a string when present` });
      }
    }
    if ('score' in body && body.score !== null
        && typeof body.score !== 'number' && typeof body.score !== 'string') {
      return res.status(400).json({ ok: false, error: 'score must be a number or numeric string when present' });
    }

    let out;
    try {
      out = logExerciseSession(req.params.slug, body);
    } catch (err) {
      console.error(`[POST /api/cockpit/darts-training/${req.params.slug}/log]`, err.message);
      return res.status(500).json({ ok: false, error: 'session log failed' });
    }

    switch (out.ok) {
      case 'unavailable':
        return res.status(503).json({ ok: false, error: 'darts exercises are not in your mirror yet' });
      case 'bad-slug':
        return res.status(400).json({ ok: false, error: 'invalid exercise slug' });
      case 'unknown':
        return res.status(404).json({ ok: false, error: 'no such exercise' });
      case 'missing-note':
        return res.status(404).json({ ok: false, error: 'the exercise note is missing on disk' });
      case 'bad-date':
        return res.status(400).json({ ok: false, error: 'date must be a valid YYYY-MM-DD' });
      case 'bad-score':
        return res.status(400).json({ ok: false, error: 'score must be a finite number' });
      case 'logged':
        return res.status(201).json({
          ok: true, slug: out.slug, title: out.title, date: out.date,
          mtime: out.mtime, logs: out.logs,
        });
      default:
        return res.status(500).json({ ok: false, error: 'unexpected log result' });
    }
  });
}

export const __test = {
  parseExerciseLogs,
  logbookSectionRange,
  insertLogBlock,
  containedExercisePath,
  oneLine,
  formatScore,
  daysBetween,
  isValidCalendarDate,
  EXERCISES_DIR,
};
