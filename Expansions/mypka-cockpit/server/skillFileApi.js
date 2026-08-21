// skillFileApi.js — the SIXTH jail, and the ONLY route in the cockpit that reads
// outside REPO_ROOT.
//
//   GET /api/cockpit/skill-file?skill=<slug>   ->  ~/.claude/skills/<slug>/SKILL.md
//
// Built to the security design Argus signed off on 2026-08-21
// (Deliverables/2026-08-21-cockpit-skills-jail-security-ontwerp.md, verdict GEEL,
// restrisico's R-1 + R-2 explicitly accepted by Sander). Checks C0..C10 below are
// NOT NEGOTIABLE and their ORDER is normative: every FS-free check runs BEFORE the
// first filesystem call, so hostile input never touches the disk.
//
// ---------------------------------------------------------------------------
// WHY THIS IS ITS OWN ROUTE IN ITS OWN MODULE (design §4 — do not "simplify")
// ---------------------------------------------------------------------------
// /api/cockpit/file dispatches on a path PREFIX and its else-branch means "treat
// as PKM-relative". Adding a fourth branch there would put the one jail that
// knows $HOME in the same if/else chain as the jails that stay inside the repo —
// one typo away from a home-directory blast radius. On its own route, the repo
// dispatcher has literally no code path to $HOME. Same call the codebase already
// made twice: /api/cockpit/inbox-file and /api/cockpit/avatar.
//
// ---------------------------------------------------------------------------
// THE CORE IDEA: THE REQUEST CARRIES NO PATH (design §3)
// ---------------------------------------------------------------------------
// Every other jail receives a path and then tries to prove the path is well
// behaved — a blacklist posture where a forgotten case is a hole. This route
// receives a SLUG: one segment out of a closed alphabet (no dot, no slash), and
// the server builds the path itself with a hardcoded filename. `..` is
// impossible (the dot is not in the alphabet), nesting is impossible (no slash),
// and a sibling file such as ~/.claude/skills/transcribeer/config.json is
// impossible (the filename is not caller-settable). The shape of the allowed
// path is not TESTED, it is CONSTRUCTED.
//
// ---------------------------------------------------------------------------
// POSTURE
// ---------------------------------------------------------------------------
//   * READ-ONLY. GET only (C9). No writeFileSync/rename/unlink in this file.
//   * NEVER THROWS, never leaks: every rejection is the SAME generic 404 with no
//     path, no slug, no err.message (C8). This route deliberately does NOT ride
//     server.js's safe() helper, which answers 500 { error: err.message } — an
//     fs error carries the absolute path in that message (finding B-2).
//   * Kill switch: COCKPIT_SKILL_FILES_ENABLED=0 does not register the route at
//     all, so it 404s from the generic /api handler as if it never existed (§8).
import fs from 'node:fs';
import path from 'node:path';
import { SKILL_SOURCES } from './skillSources.js';

// The file part is a SERVER CONSTANT. It never comes from the request — that is
// the whole point of C4. ~/.claude/skills/transcribeer/ also holds config.json
// (with a whisper_host SSH hint), .py files and two .backup-* files; a jail that
// allowed "any file, one level deep" would serve those.
const SKILL_FILENAME = 'SKILL.md';

// Ample: the biggest real SKILL.md is 27 kB. Guards against pulling a
// pathological file into memory.
const MAX_SKILL_BYTES = 1_000_000;

// C2's closed alphabet. No `.` (so no `..`, no dotdir, no second extension), no
// `/` or `\` (no traversal, no nesting, no absolute path), no NUL / control
// chars / whitespace / `~` / `$` (they simply are not in the positive set).
// Max 64 chars, no leading or trailing hyphen. All 7 skill folders match.
const SLUG_RE = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{0,62}[A-Za-z0-9])?$/;

// C7 — inert headers. Deliberately STRICTER than /api/cockpit/file, which
// relaxes img-src/object-src/style-src for PDF and image embeds; this route
// serves markdown TEXT only, so bare `default-src 'none'` + `sandbox` is enough.
// No MIME table exists here on purpose: the extension does not come from the
// request, so there is nothing to look up.
export const SKILL_FILE_HEADERS = Object.freeze({
  'Content-Type': 'text/markdown; charset=utf-8',
  'Content-Disposition': 'inline',
  'Content-Security-Policy': "default-src 'none'; sandbox",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store',
});

/**
 * Is the route enabled? (§8)
 *
 * ON unless explicitly switched OFF with COCKPIT_SKILL_FILES_ENABLED=0, and the
 * launcher additionally sets =1 explicitly so the intent is visible in the
 * process env. `0` means the route is never registered — no 403 branch, no
 * route, just the generic /api 404.
 */
export function skillFilesEnabled() {
  return process.env.COCKPIT_SKILL_FILES_ENABLED !== '0';
}

/**
 * The jail root, from the SINGLE source of truth (§6).
 *
 * NEVER recompute this with a local os.homedir() call: skillSources.js is by its
 * own contract the one place a skill path is declared, and two independent
 * computations can drift — at which point the jail you check is not the jail the
 * list is built from.
 *
 * Two hard preconditions, both fail-closed:
 *   - bind on id === 'user-skills', NOT on kind === 'domain-skill' (a future
 *     second source of the same kind, living elsewhere, must not inherit this
 *     route);
 *   - refuse when repoRelative is true (flipping that flag would reinterpret
 *     `base` against REPO_ROOT and the jail would no longer mean what it says).
 *
 * Resolved per call, not cached at boot, for the same reason C5 resolves the
 * realpath per request.
 */
export function skillsJailRoot() {
  const source = SKILL_SOURCES.find((s) => s && s.id === 'user-skills');
  if (!source) return null;
  if (source.repoRelative === true) return null;            // fail closed
  if (typeof source.base !== 'string' || source.base === '') return null; // no HOME
  if (!path.isAbsolute(source.base)) return null;
  return source.base;
}

/**
 * Resolve + read one skill file, or return null.
 *
 * `null` is the ONLY failure signal: wrong argument type, slug outside the
 * alphabet, unknown slug, symlinked folder, missing SKILL.md, realpath mismatch,
 * oversized file, unreadable file — all indistinguishable to the caller (C8).
 *
 * @param {unknown} raw  the untrusted `skill` query parameter
 * @returns {{ slug: string, bytes: Buffer } | null}
 */
export function readSkillFile(raw) {
  // -- C1: argument type ----------------------------------------------------
  // NOT String(req.query.skill): Express hands back an ARRAY for ?skill=a&skill=b
  // and String([...]) would quietly become "a,b".
  if (typeof raw !== 'string' || raw === '') return null;

  // -- C2: slug whitelist, BEFORE any filesystem call -----------------------
  if (!SLUG_RE.test(raw)) return null;
  const slug = raw;

  const jail = skillsJailRoot();
  if (!jail) return null;

  // -- C3: membership in the REAL, non-symlinked directory listing ----------
  // Stronger than a pattern: a CLOSED SET. The servable set becomes exactly the
  // set /api/cockpit/skills already lists — nothing more. Dirent.isDirectory()
  // has lstat semantics (d_type), so a symlink is already false here; the
  // explicit isSymbolicLink() states the intent, as skillsApi.js does.
  //
  // This route may NEVER degrade to C2 alone: without C3 every folder that ever
  // appears under skills/ is automatically servable.
  let entries;
  try {
    entries = fs.readdirSync(jail, { withFileTypes: true });
  } catch {
    return null;
  }
  const hit = entries.find((e) => e.name === slug && e.isDirectory() && !e.isSymbolicLink());
  if (!hit) return null;

  // -- C4: construct the path, then assert its EXACT shape ------------------
  // Note the difference with the existing jails: they ask "does this escape?"
  // (a blacklist). This asks "is this exactly the one form we allow?" — an
  // equality test, so no escape variant has to be anticipated.
  const abs = path.resolve(jail, slug, SKILL_FILENAME);
  const relLex = path.relative(jail, abs);
  if (relLex !== path.join(slug, SKILL_FILENAME)) return null;

  // -- C5: realpath-anchored containment (the symlink defence) --------------
  // The check the other five jails lack. Both sides are resolved: the JAIL ROOT
  // itself too, because ~/.claude(/skills) may be a symlink (or macOS may add a
  // /private prefix) and a lexical root would then falsely reject a legitimate
  // skill. Same precedent as workbench.js / journalEntries.js.
  //
  // This is what stops a real folder whose SKILL.md is a symlink to
  // ~/.claude/history.jsonl or ~/.claude/settings.json.
  let jailReal;
  let real;
  try {
    jailReal = fs.realpathSync(jail);
    real = fs.realpathSync(abs);
  } catch {
    return null;
  }
  if (path.relative(jailReal, real) !== path.join(slug, SKILL_FILENAME)) return null;

  // -- C6: read what was verified; res.sendFile() is NOT used ---------------
  // sendFile re-resolves the path independently of what we just checked, follows
  // symlinks (send does stat, not lstat), and only serves a path containing a
  // dot-segment (.claude) thanks to a deprecated legacy branch in `send`
  // (finding B-5). Reading `real` ourselves means the bytes we return are the
  // bytes the checks approved.
  try {
    const st = fs.statSync(real);
    if (!st.isFile()) return null;
    if (st.size > MAX_SKILL_BYTES) return null;
    return { slug, bytes: fs.readFileSync(real) };
  } catch {
    return null;
  }
}

// C8 — one rejection response for every failure mode. Never the resolved path,
// never the slug, never the jail root, never err.message.
function notFound(res) {
  return res.status(404).json({ error: 'not found' });
}

/**
 * Register the route. Returns whether it was mounted (for the boot log).
 *
 * C0: it lives under /api/, so it automatically inherits server.js's read gate
 * (PIN/session, or the loopback-without-PIN convenience WITH its DNS-rebinding
 * guard). It is NOT in AUTH_PUBLIC and NOT wrapped in safe().
 * C9: GET only — no POST/PUT/DELETE/PATCH twin exists anywhere.
 * C10: no listing route. Without ?skill= this answers 404, never an index.
 */
export function registerSkillFileRoutes(app) {
  if (!skillFilesEnabled()) return false;

  app.get('/api/cockpit/skill-file', (req, res) => {
    const found = readSkillFile(req.query.skill);
    if (!found) return notFound(res);
    for (const [header, value] of Object.entries(SKILL_FILE_HEADERS)) {
      res.set(header, value);
    }
    return res.status(200).send(found.bytes);
  });

  return true;
}

export default registerSkillFileRoutes;
