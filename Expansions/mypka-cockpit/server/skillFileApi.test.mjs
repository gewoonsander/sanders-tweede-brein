// skillFileApi.test.mjs - Argus's re-gate on the SIXTH jail.
//
// This is the section-12 test matrix from
// Deliverables/2026-08-21-cockpit-skills-jail-security-ontwerp.md, written
// independently of the implementer's own verification harness. Case numbers in
// the test titles map 1:1 to that matrix.
//
// WHY THE FIXTURE HOME
// skillsJailRoot() derives from skillSources.js, which computes its base from
// os.homedir() AT MODULE LOAD. Node's os.homedir() honours $HOME on POSIX, so
// setting HOME to a throwaway directory BEFORE the first import of
// skillFileApi.js gives us a jail we fully control - the only honest way to
// plant hostile symlinks (a symlinked SKILL.md pointing at settings.json or
// history.jsonl) without vandalising the user's real ~/.claude.
//
// A bonus that matters: mkdtemp() lands in /var/folders/... and on macOS /var is
// itself a symlink to /private/var. So this fixture exercises, for free, the
// requirement that C5 realpaths the JAIL ROOT as well as the target. A build
// that only realpaths the target would 404 every legitimate skill here.
//
// Two cases (15 and 19) must run against the machine's REAL ~/.claude, so they
// run in a child process with the untouched HOME. Case 20 shells out to the
// existing skillsApi test.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import express from 'express';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SELF = fileURLToPath(import.meta.url);
// Captured BEFORE the HOME override, so child processes get the real one.
const REAL_HOME = process.env.HOME;

// Canaries. If any of these ever appears in a response body, the jail leaked.
// They stand in for ~/.claude/settings.json (the permission allowlist) and
// ~/.claude/history.jsonl (mode 600, full prompt history).
const CANARY_SETTINGS = 'ARGUS-CANARY-SETTINGS-MUST-NEVER-BE-SERVED';
const CANARY_HISTORY = 'ARGUS-CANARY-HISTORY-MUST-NEVER-BE-SERVED';
const CANARY_CONFIG = 'ARGUS-CANARY-CONFIG-JSON-MUST-NEVER-BE-SERVED';

// ---------------------------------------------------------------------------
// REAL-HOME MODE (cases 15 + 19). Plain script, no node:test registration.
// ---------------------------------------------------------------------------
if (process.env.ARGUS_SKILLFILE_REALHOME === '1') {
  const { readSkillFile, skillsJailRoot } = await import('./skillFileApi.js');
  const { readAllSkills } = await import('./skillsApi.js');

  const jail = skillsJailRoot();
  assert.ok(typeof jail === 'string' && path.isAbsolute(jail), 'jail root must be absolute');
  assert.equal(path.basename(jail), 'skills');
  assert.equal(path.basename(path.dirname(jail)), '.claude');

  // Case 15 - every real skill folder on this machine returns its exact bytes.
  const dirs = fs
    .readdirSync(jail, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.isSymbolicLink())
    .map((e) => e.name);
  let served = 0;
  for (const slug of dirs) {
    const onDisk = path.join(jail, slug, 'SKILL.md');
    const got = readSkillFile(slug);
    if (!fs.existsSync(onDisk)) {
      assert.equal(got, null, slug + ' has no SKILL.md and must not be servable');
      continue;
    }
    assert.ok(got, slug + ' must be servable');
    assert.equal(got.slug, slug);
    assert.deepEqual(got.bytes, fs.readFileSync(onDisk), slug + ' bytes must match disk');
    served += 1;
  }
  assert.ok(served >= 1, 'expected at least one real skill to serve');

  // Case 11 on real data - the sibling config.json is never reachable.
  const cfg = path.join(jail, 'transcribeer', 'config.json');
  if (fs.existsSync(cfg)) {
    const got = readSkillFile('transcribeer');
    assert.ok(got);
    assert.notDeepEqual(got.bytes, fs.readFileSync(cfg));
    assert.deepEqual(got.bytes, fs.readFileSync(path.join(jail, 'transcribeer', 'SKILL.md')));
  }

  // Case 19 - only ~/.claude/skills rows carry a slug; plugin skills and repo
  // commands stay null, so the view cannot link them.
  const data = readAllSkills();
  const rows = data.groups.flatMap((g) => g.items);
  let userRows = 0;
  let pluginRows = 0;
  for (const row of rows) {
    assert.ok('skillSlug' in row, 'row ' + row.key + ' missing skillSlug field');
    if (row.sourceId === 'user-skills') {
      assert.equal(typeof row.skillSlug, 'string', row.key + ' must carry a slug');
      userRows += 1;
    } else {
      assert.equal(row.skillSlug, null, row.key + ' (' + row.sourceId + ') must be null');
      if (row.kind === 'plugin-skill') pluginRows += 1;
    }
  }
  console.log(JSON.stringify({ ok: true, servedRealSkills: served, userRows, pluginRows, totalRows: rows.length }));
  process.exit(0);
}

// ---------------------------------------------------------------------------
// FIXTURE MODE - everything else.
// ---------------------------------------------------------------------------
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'argus-skilljail-'));
const HOME = path.join(TMP, 'home');
const CLAUDE = path.join(HOME, '.claude');
const SKILLS = path.join(CLAUDE, 'skills');
fs.mkdirSync(SKILLS, { recursive: true });

// The two crown-jewel files this jail exists to keep unreachable.
fs.writeFileSync(path.join(CLAUDE, 'settings.json'), '{"canary":"' + CANARY_SETTINGS + '"}');
fs.writeFileSync(path.join(CLAUDE, 'history.jsonl'), '{"canary":"' + CANARY_HISTORY + '"}');

const mkSkill = (slug, body) => {
  fs.mkdirSync(path.join(SKILLS, slug), { recursive: true });
  fs.writeFileSync(path.join(SKILLS, slug, 'SKILL.md'), body);
};

mkSkill('wdf-regels', '# WDF-regels -- legitimate skill body');
mkSkill('transcribeer', '# transcribeer -- legitimate skill body');
// The sibling file a "one level deep, any file" jail would have served.
fs.writeFileSync(path.join(SKILLS, 'transcribeer', 'config.json'), '{"canary":"' + CANARY_CONFIG + '"}');
mkSkill('Mixed_Case-99', '# mixed case, exactly as spelled on disk');

// A folder with no SKILL.md, and a plain FILE sitting directly in skills/.
fs.mkdirSync(path.join(SKILLS, 'nomd'), { recursive: true });
fs.writeFileSync(path.join(SKILLS, 'loose-file.md'), '# loose');
// Size boundary: exactly MAX_SKILL_BYTES passes, one byte more does not.
mkSkill('limit-exact', 'x'.repeat(1000000));
mkSkill('limit-over', 'x'.repeat(1000001));

// Hostile symlinks. These are the whole point of the exercise.
fs.symlinkSync(CLAUDE, path.join(SKILLS, 'evil-root'), 'dir'); // case 9
const evilLink = (slug, target) => {
  fs.mkdirSync(path.join(SKILLS, slug), { recursive: true });
  fs.symlinkSync(target, path.join(SKILLS, slug, 'SKILL.md'));
};
evilLink('evil-settings', path.join(CLAUDE, 'settings.json'));                  // case 10a
evilLink('evil-history', path.join(CLAUDE, 'history.jsonl'));                   // case 10b
evilLink('evil-neighbour', path.join(SKILLS, 'transcribeer', 'config.json'));   // case 10c
evilLink('evil-dir', path.join(SKILLS, 'wdf-regels'));                          // case 10d
evilLink('evil-relative', '../../settings.json');                               // case 10e
evilLink('evil-dangling', path.join(CLAUDE, 'does-not-exist.json'));

// Point the module graph at the fixture BEFORE the first import.
process.env.HOME = HOME;
process.env.USERPROFILE = HOME;
// The gate is FAIL-CLOSED since the B-9 fix: unset means OFF, so the suite has to
// arm it explicitly or every serving test would 404 for the wrong reason.
// Setting it in process.env also short-circuits readEnvKey BEFORE it reaches
// Team Knowledge/.env, which keeps this suite hermetic — it must not depend on
// (or read) the real user's .env. The .env leg is covered separately, in a child
// process against a throwaway scaffold, at the bottom of case 18.
process.env.COCKPIT_SKILL_FILES_ENABLED = '1';

const { readSkillFile, skillsJailRoot, skillFilesEnabled, registerSkillFileRoutes, SKILL_FILE_HEADERS } =
  await import('./skillFileApi.js');

assert.equal(skillsJailRoot(), SKILLS, 'fixture HOME did not take effect - the rest of this suite would be a lie');

// Live server, so headers, methods and error bodies are tested over real HTTP.
const app = express();
assert.equal(registerSkillFileRoutes(app), true, 'route must mount when the kill switch is explicitly 1');
const server = app.listen(0, '127.0.0.1');
await new Promise((r) => server.once('listening', r));
const BASE = 'http://127.0.0.1:' + server.address().port;
const URL_ROUTE = BASE + '/api/cockpit/skill-file';

// A second app with the kill switch OFF (case 18).
//
// NOTE the restore to '1' rather than a delete: with the key absent, readEnvKey
// falls through to the REAL Team Knowledge/.env, and this suite must neither
// depend on nor read that file. The "key absent" and ".env-driven" legs are
// therefore asserted in a child process against a throwaway scaffold — see the
// end of case 18.
process.env.COCKPIT_SKILL_FILES_ENABLED = '0';
const offApp = express();
const offMounted = registerSkillFileRoutes(offApp);
const offEnabled = skillFilesEnabled();
process.env.COCKPIT_SKILL_FILES_ENABLED = '1';
const offServer = offApp.listen(0, '127.0.0.1');
await new Promise((r) => offServer.once('listening', r));
const OFF_BASE = 'http://127.0.0.1:' + offServer.address().port;

after(() => {
  server.close();
  offServer.close();
  fs.rmSync(TMP, { recursive: true, force: true });
});

/** Raw query string, so we can send things a URL builder would sanitise. */
async function get(query, init) {
  const res = await fetch(URL_ROUTE + query, init);
  return { status: res.status, headers: res.headers, body: await res.text() };
}

/**
 * Strip comments before scanning source for forbidden tokens.
 *
 * skillFileApi.js DOCUMENTS what it refuses to do ("No writeFileSync/rename/
 * unlink in this file", "NEVER recompute this with a local os.homedir() call"),
 * so a naive substring scan flags the prose that proves the point. Scan the code.
 */
function codeOf(file) {
  return fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split(/\r?\n/)
    .map((line) => line.replace(/(^|\s)\/\/.*$/, ''))
    .join('\n');
}

/** Every rejection must be byte-identical and structure-free (C8). */
function assertGeneric404(r, label) {
  assert.equal(r.status, 404, label + ': expected 404');
  assert.equal(r.body, '{"error":"not found"}', label + ': body must be the generic 404');
  for (const canary of [CANARY_SETTINGS, CANARY_HISTORY, CANARY_CONFIG]) {
    assert.ok(!r.body.includes(canary), label + ': LEAK - canary in body');
  }
  for (const leak of [HOME, CLAUDE, SKILLS, 'ENOENT', 'EACCES', '.claude', os.tmpdir()]) {
    assert.ok(!r.body.includes(leak), label + ': body leaks "' + leak + '"');
  }
}

// ---------------------------------------------------------------------------
// Case 1-2 - traversal, raw and percent-encoded (C2)
// ---------------------------------------------------------------------------
test('case 1: ?skill=../../settings.json is refused', async () => {
  assertGeneric404(await get('?skill=../../settings.json'), 'raw traversal');
});

test('case 2: percent-encoded traversal is refused after decoding', async () => {
  assertGeneric404(await get('?skill=..%2F..%2Fsettings.json'), 'encoded traversal');
  assertGeneric404(await get('?skill=%2e%2e%2f%2e%2e%2fsettings.json'), 'fully encoded traversal');
  assertGeneric404(await get('?skill=..%252F..%252Fsettings.json'), 'double-encoded traversal');
  assertGeneric404(await get('?skill=wdf-regels%2F..%2F..%2Fsettings.json'), 'valid-prefix traversal');
});

// ---------------------------------------------------------------------------
// Case 3 - the dot is not in the alphabet (C2)
// ---------------------------------------------------------------------------
test('case 3: dot segments are refused', async () => {
  for (const q of ['?skill=.', '?skill=..', '?skill=%2e', '?skill=%2e%2e', '?skill=...']) {
    assertGeneric404(await get(q), q);
  }
  // A dot ANYWHERE kills it: no second extension, no dotfile, no dotdir.
  for (const q of ['?skill=wdf-regels.md', '?skill=.ssh', '?skill=a.b']) {
    assertGeneric404(await get(q), q);
  }
});

// ---------------------------------------------------------------------------
// Case 4 - empty or absent parameter (C1)
// ---------------------------------------------------------------------------
test('case 4: empty and absent skill parameters are refused', async () => {
  assertGeneric404(await get('?skill='), 'empty value');
  assertGeneric404(await get(''), 'no parameter at all');
  assertGeneric404(await get('?skill'), 'valueless parameter');
  assertGeneric404(await get('?other=wdf-regels'), 'wrong parameter name');
});

// ---------------------------------------------------------------------------
// Case 5 - repeated or structured parameters must not collapse to a string (C1)
// ---------------------------------------------------------------------------
test('case 5: array and object query shapes are refused, never stringified', async () => {
  assertGeneric404(await get('?skill=a&skill=b'), 'repeated param');
  // The one that would actually hurt: a real slug smuggled in as an array.
  assertGeneric404(await get('?skill=wdf-regels&skill=wdf-regels'), 'repeated real slug');
  assertGeneric404(await get('?skill[]=wdf-regels'), 'bracket array');
  assertGeneric404(await get('?skill[0]=wdf-regels'), 'indexed array');
  assertGeneric404(await get('?skill[x]=wdf-regels'), 'nested object');
  // Straight at the function seam, so the guard is proven independent of Express.
  assert.equal(readSkillFile(['wdf-regels']), null);
  assert.equal(readSkillFile({ toString: () => 'wdf-regels' }), null);
  assert.equal(readSkillFile(null), null);
  assert.equal(readSkillFile(undefined), null);
  assert.equal(readSkillFile(0), null);
});

// ---------------------------------------------------------------------------
// Case 6 - NUL and other control characters (C2)
// ---------------------------------------------------------------------------
test('case 6: NUL-byte and control-character slugs are refused', async () => {
  assertGeneric404(await get('?skill=wdf-regels%00'), 'trailing NUL');
  assertGeneric404(await get('?skill=wdf-regels%00.json'), 'NUL truncation attempt');
  assertGeneric404(await get('?skill=%00wdf-regels'), 'leading NUL');
  assertGeneric404(await get('?skill=wdf%0aregels'), 'newline');
  assertGeneric404(await get('?skill=wdf%20regels'), 'space');
  assertGeneric404(await get('?skill=wdf%09regels'), 'tab');
  assert.equal(readSkillFile('wdf-regels '), null);
});

// ---------------------------------------------------------------------------
// Case 7 - absolute paths, tilde, shell metacharacters (C2)
// ---------------------------------------------------------------------------
test('case 7: absolute paths, tilde and metacharacters are refused', async () => {
  for (const q of [
    '?skill=/etc/passwd',
    '?skill=%2Fetc%2Fpasswd',
    '?skill=~',
    '?skill=~%2F.claude%2Fsettings.json',
    '?skill=%24HOME',
    '?skill=..%5C..%5Csettings.json',
    '?skill=%C0%AE%C0%AE%2Fsettings.json',
    '?skill=wdf-regels%2FSKILL.md',
  ]) {
    assertGeneric404(await get(q), q);
  }
  // Alphabet edges: no leading or trailing hyphen, max 64 characters.
  assertGeneric404(await get('?skill=-wdf'), 'leading hyphen');
  assertGeneric404(await get('?skill=wdf-'), 'trailing hyphen');
  assertGeneric404(await get('?skill=' + 'a'.repeat(65)), '65 chars');
});

// ---------------------------------------------------------------------------
// Case 8 - membership in the real listing (C3)
// ---------------------------------------------------------------------------
test('case 8: an unknown but well-formed slug is refused', async () => {
  assertGeneric404(await get('?skill=nonexistent-skill'), 'unknown slug');
  assertGeneric404(await get('?skill=nomd'), 'folder without SKILL.md');
  assertGeneric404(await get('?skill=loose-file'), 'plain file in skills/');
  assertGeneric404(await get('?skill=loose-file.md'), 'plain file with extension');
});

// ---------------------------------------------------------------------------
// Case 9 - a symlinked skill FOLDER pointing at ~/.claude (C3 + C5)
// ---------------------------------------------------------------------------
test('case 9: a symlinked folder in skills/ is not a member', async () => {
  assertGeneric404(await get('?skill=evil-root'), 'folder symlink to ~/.claude');
  // Prove the fixture is real: the symlink genuinely resolves.
  assert.equal(fs.realpathSync(path.join(SKILLS, 'evil-root')), fs.realpathSync(CLAUDE));
  assert.equal(readSkillFile('evil-root'), null);
});

// ---------------------------------------------------------------------------
// Case 10 - THE decisive test: a real folder whose SKILL.md is a symlink (C5)
// ---------------------------------------------------------------------------
test('case 10: a symlinked SKILL.md cannot reach outside its own folder', async () => {
  const variants = [
    ['evil-settings', CANARY_SETTINGS, '~/.claude/settings.json'],
    ['evil-history', CANARY_HISTORY, '~/.claude/history.jsonl'],
    ['evil-neighbour', CANARY_CONFIG, 'sibling config.json'],
    ['evil-relative', CANARY_SETTINGS, 'relative ../../settings.json'],
  ];
  for (const [slug, canary, what] of variants) {
    // The symlink must be genuinely live, otherwise this test proves nothing.
    assert.ok(
      fs.readFileSync(path.join(SKILLS, slug, 'SKILL.md'), 'utf8').includes(canary),
      'fixture broken: ' + slug + ' does not actually read ' + what,
    );
    const r = await get('?skill=' + slug);
    assertGeneric404(r, 'symlink to ' + what);
    assert.equal(readSkillFile(slug), null, 'readSkillFile must refuse ' + slug);
  }
  // A SKILL.md that is a symlink to a whole directory, and a dangling one.
  assertGeneric404(await get('?skill=evil-dir'), 'symlink to a directory');
  assertGeneric404(await get('?skill=evil-dangling'), 'dangling symlink');
});

// ---------------------------------------------------------------------------
// Case 11 - the filename is a server constant (C4)
// ---------------------------------------------------------------------------
test('case 11: a legitimate skill serves SKILL.md and never a sibling file', async () => {
  const r = await get('?skill=transcribeer');
  assert.equal(r.status, 200);
  assert.equal(r.body, fs.readFileSync(path.join(SKILLS, 'transcribeer', 'SKILL.md'), 'utf8'));
  assert.ok(!r.body.includes(CANARY_CONFIG), 'LEAK - config.json content served');
});

// ---------------------------------------------------------------------------
// Case 12 - no case-folding bypass on a case-insensitive filesystem
// ---------------------------------------------------------------------------
test('case 12: a case-variant slug fails closed', async () => {
  assertGeneric404(await get('?skill=WDF-REGELS'), 'uppercase variant');
  assertGeneric404(await get('?skill=Wdf-Regels'), 'mixed-case variant');
  // Capitals are allowed by the alphabet when they ARE the on-disk spelling.
  assert.equal((await get('?skill=Mixed_Case-99')).status, 200, 'exact on-disk spelling must work');
});

// ---------------------------------------------------------------------------
// Case 13 - no listing, ever (C10)
// ---------------------------------------------------------------------------
test('case 13: the bare route never returns an index', async () => {
  const r = await get('');
  assertGeneric404(r, 'bare route');
  for (const slug of ['wdf-regels', 'transcribeer', 'Mixed_Case-99']) {
    assert.ok(!r.body.includes(slug), 'bare route enumerates ' + slug);
  }
  const listing = await fetch(BASE + '/api/cockpit/skill-files');
  assert.notEqual(listing.status, 200, 'no plural listing route may exist');
});

// ---------------------------------------------------------------------------
// Case 14 - read-only (C9)
// ---------------------------------------------------------------------------
test('case 14: no write verb is served', async () => {
  const before = fs.readFileSync(path.join(SKILLS, 'wdf-regels', 'SKILL.md'), 'utf8');
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
    const r = await get('?skill=wdf-regels', {
      method,
      headers: { 'Content-Type': 'text/markdown' },
      body: method === 'DELETE' ? undefined : 'overwritten by Argus',
    });
    assert.notEqual(r.status, 200, method + ' must not be served');
    assert.ok(!r.body.includes('legitimate skill body'), method + ' returned file bytes');
  }
  assert.equal(fs.readFileSync(path.join(SKILLS, 'wdf-regels', 'SKILL.md'), 'utf8'), before, 'file was modified');
  // Source-level guard: this module must never grow a write call or sendFile.
  const code = codeOf(path.join(HERE, 'skillFileApi.js'));
  const forbidden = ['writeFile', 'appendFile', 'renameSync', 'unlink', 'rmSync', 'mkdir',
    'app.post', 'app.put', 'app.delete', 'app.patch', 'sendFile'];
  for (const token of forbidden) {
    assert.ok(!code.includes(token), 'skillFileApi.js contains "' + token + '"');
  }
});

// ---------------------------------------------------------------------------
// Cases 15 + 19 - against the machine's REAL ~/.claude, in a child process
// ---------------------------------------------------------------------------
test('cases 15 + 19: real skills serve exact bytes; only user-skills rows carry a slug', () => {
  const r = spawnSync(process.execPath, [SELF], {
    cwd: HERE,
    encoding: 'utf8',
    env: { ...process.env, HOME: REAL_HOME, USERPROFILE: REAL_HOME, ARGUS_SKILLFILE_REALHOME: '1' },
  });
  assert.equal(r.status, 0, 'real-home suite failed: ' + r.stdout + ' ' + r.stderr);
  const lines = r.stdout.trim().split(/\r?\n/);
  const out = JSON.parse(lines[lines.length - 1]);
  assert.equal(out.ok, true);
  assert.ok(out.servedRealSkills >= 1, 'no real skill served');
  console.log('      real machine: ' + out.servedRealSkills + ' skills served, ' +
    out.totalRows + ' skill rows, ' + out.pluginRows + ' plugin rows all skillSlug:null');
});

// ---------------------------------------------------------------------------
// Case 16 - inert headers (C7)
// ---------------------------------------------------------------------------
test('case 16: the response carries the six inert headers and nothing that re-arms it', async () => {
  const r = await get('?skill=wdf-regels');
  assert.equal(r.status, 200);
  // "Contains the six", not "exactly six": Express adds ETag and X-Powered-By of
  // its own accord (verified empirically). What matters is that all six are
  // present with their designed values and nothing loosens them.
  for (const [name, value] of Object.entries(SKILL_FILE_HEADERS)) {
    assert.equal(r.headers.get(name), value, 'header ' + name);
  }
  assert.equal(r.headers.get('content-type'), 'text/markdown; charset=utf-8', 'must never be text/html');
  assert.equal(r.headers.get('content-security-policy'), "default-src 'none'; sandbox");
  assert.equal(r.headers.get('cache-control'), 'no-store');
  for (const h of ['access-control-allow-origin', 'access-control-allow-credentials']) {
    assert.equal(r.headers.get(h), null, 'unexpected header ' + h);
  }
  const own = Object.keys(SKILL_FILE_HEADERS).map((x) => x.toLowerCase());
  const boring = ['content-length', 'date', 'connection', 'keep-alive'];
  const extras = [...r.headers.keys()].filter((k) => !own.includes(k) && !boring.includes(k));
  console.log('      extra headers Express adds: ' + (extras.join(', ') || '(none)'));
});

// ---------------------------------------------------------------------------
// Case 17 - no rejection body leaks structure (C8)
// ---------------------------------------------------------------------------
test('case 17: every rejection is byte-identical and leaks nothing', async () => {
  const inputs = [
    '?skill=../../settings.json', '?skill=.', '?skill=', '', '?skill=a&skill=b',
    '?skill=wdf-regels%00', '?skill=%2Fetc%2Fpasswd', '?skill=~', '?skill=nonexistent-skill',
    '?skill=evil-root', '?skill=evil-settings', '?skill=evil-history', '?skill=evil-neighbour',
    '?skill=evil-dir', '?skill=evil-dangling', '?skill=nomd', '?skill=WDF-REGELS',
    '?skill=limit-over', '?skill=-wdf', '?skill=' + 'a'.repeat(65),
  ];
  const bodies = new Set();
  for (const q of inputs) {
    const r = await get(q);
    assertGeneric404(r, q);
    bodies.add(r.body);
  }
  assert.equal(bodies.size, 1, 'rejection bodies must be indistinguishable from one another');
});

// ---------------------------------------------------------------------------
// Case 18 - the kill switch (section 8)
// ---------------------------------------------------------------------------
test('case 18: COCKPIT_SKILL_FILES_ENABLED=0 leaves the route unmounted', async () => {
  assert.equal(offEnabled, false, 'skillFilesEnabled() must be false when the switch is 0');
  assert.equal(offMounted, false, 'registerSkillFileRoutes must report it did not mount');
  const r = await fetch(OFF_BASE + '/api/cockpit/skill-file?skill=wdf-regels');
  assert.equal(r.status, 404);
  const body = await r.text();
  assert.ok(!body.includes('legitimate skill body'), 'file served while the switch was off');
  // Switch semantics AS BUILT: ON unless process.env holds exactly the string '0'.
  //
  // ARGUS 2026-08-21, OPEN FINDING B-9: this reads process.env ONLY, while
  // .env.example and SECURITY.md tell the user to put the key in
  // `Team Knowledge/.env` — a file the cockpit never loads into process.env
  // (connectors/env.js: "We never load the whole .env into process.env"). So the
  // documented off-switch does nothing and the gate fails OPEN. The fix is the
  // CONNECTORS_ENABLED idiom of connectors/registry.js:46 plus the
  // WORKBENCH_WRITE_ENABLED default direction:
  //
  //   return readEnvKey('COCKPIT_SKILL_FILES_ENABLED') === '1';
  //
  // WHEN THAT LANDS, this table flips to [['1', true], everything-else false]
  // and COCKPIT_SKILL_FILES_ENABLED must join PROTECTED_KEYS in connectorAdmin.js
  // (otherwise the Connections page can write the key and re-arm the gate).
  // Until then this asserts what is actually shipped, not what should ship.
  const cases = [['0', false], ['1', true], ['', true], ['false', true], ['no', true], ['00', true], ['off', true]];
  for (const [value, expected] of cases) {
    process.env.COCKPIT_SKILL_FILES_ENABLED = value;
    assert.equal(skillFilesEnabled(), expected, 'COCKPIT_SKILL_FILES_ENABLED=' + JSON.stringify(value));
  }
  delete process.env.COCKPIT_SKILL_FILES_ENABLED;
  assert.equal(skillFilesEnabled(), true, 'unset must be ON (the documented default)');
});

// ---------------------------------------------------------------------------
// Case 20 - the existing skills reader stays green
// ---------------------------------------------------------------------------
test('case 20: skillsApi.test.mjs still passes', () => {
  const r = spawnSync(process.execPath, ['--test', 'skillsApi.test.mjs'], {
    cwd: HERE,
    encoding: 'utf8',
    env: { ...process.env, HOME: REAL_HOME, USERPROFILE: REAL_HOME },
  });
  assert.equal(r.status, 0, 'skillsApi.test.mjs failed: ' + r.stdout + ' ' + r.stderr);
});

// ---------------------------------------------------------------------------
// Beyond the matrix - checks the design implies but section 12 did not list.
// ---------------------------------------------------------------------------
test('extra: the size ceiling holds at the boundary (C6)', async () => {
  assert.equal((await get('?skill=limit-exact')).status, 200, 'exactly 1 MB must still serve');
  assertGeneric404(await get('?skill=limit-over'), '1 MB + 1 byte');
});

test('extra: C5 realpaths the JAIL ROOT, not just the target', () => {
  // /var -> /private/var on macOS, so this fixture jail root is itself behind a
  // symlink. A build that only resolved the target would 404 everything here.
  if (SKILLS === fs.realpathSync(SKILLS)) {
    console.log('      (jail root is not symlinked on this filesystem - check is vacuous here)');
    return;
  }
  assert.ok(readSkillFile('wdf-regels'), 'legitimate skill must serve through a symlinked jail root');
});

test('extra: server.js mounts it under /api, outside AUTH_PUBLIC and outside safe()', () => {
  const src = fs.readFileSync(path.join(HERE, 'server.js'), 'utf8');
  assert.ok(src.includes('registerSkillFileRoutes(app)'), 'route must be registered');
  assert.ok(!/registerSkillFileRoutes\(app,\s*\{[^}]*safe/.test(src), 'must not be handed safe()');
  const authPublic = src.match(/const AUTH_PUBLIC = new Set\(\[(.*?)\]\)/s);
  assert.ok(authPublic, 'AUTH_PUBLIC not found');
  assert.ok(!authPublic[1].includes('skill-file'), 'route must not be in AUTH_PUBLIC');
  // The boot log must not print a resolved absolute path.
  const logLine = src.split(/\r?\n/).find((l) => l.includes('SKILL.md preview enabled'));
  assert.ok(logLine, 'boot log line not found');
  assert.ok(!logLine.includes('${'), 'boot log must not interpolate a resolved path');
});

test('extra: the jail root binds to id user-skills and fails closed', async () => {
  const mod = await import('./skillSources.js');
  const src = mod.SKILL_SOURCES.find((s) => s.id === 'user-skills');
  assert.ok(src, 'user-skills source must exist');
  assert.equal(src.repoRelative, false);
  assert.equal(skillsJailRoot(), src.base, 'jail must come from skillSources.js, not a local homedir call');
  const code = codeOf(path.join(HERE, 'skillFileApi.js'));
  assert.ok(!code.includes('homedir'), 'must not recompute HOME locally');
  assert.ok(!code.includes("process.env.HOME"), 'must not read HOME directly');
  assert.ok(code.includes("id === 'user-skills'"), 'must bind on the id, not the kind');
  assert.ok(code.includes('repoRelative === true'), 'must fail closed on a repo-relative base');
});
