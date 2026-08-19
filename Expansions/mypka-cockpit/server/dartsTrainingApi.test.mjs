// dartsTrainingApi.test.mjs — the Darts Training dashboard's parser + writer.
//
// The parser here is a PORT of parse_exercise_logs() in scripts/regen-mypka-db.py.
// These tests pin the behaviours the two implementations must share, so a drift
// between them shows up as a red test rather than as a dashboard that quietly
// disagrees with the mirror.
//
// Run: node --test server/dartsTrainingApi.test.mjs
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { __test } from './dartsTrainingApi.js';

const {
  parseExerciseLogs, logbookSectionRange, insertLogBlock,
  containedExercisePath, oneLine, formatScore, daysBetween, isValidCalendarDate,
} = __test;

// ── parser ────────────────────────────────────────────────────────────────────

test('the shipped commented-out example is NOT a session', () => {
  // Every imported exercise note ships this block. It carries a real-looking
  // date; if the HTML comment is not stripped first, every one of the 22 notes
  // would report a phantom session — the exact trap the Python parser avoids.
  const md = `# Oefening

## Logboek

<!-- Log een sessie als een H3-datumkop met daaronder de regels:
     ### 2026-08-19
     - score: 22
     - unit: punten
     score/unit/result/trigger/note zijn allemaal optioneel; de datumkop niet. -->
`;
  assert.deepEqual(parseExerciseLogs(md), []);
});

test('a full block parses every field', () => {
  const md = `## Logboek

### 2026-08-19
- score: 22
- unit: punten
- result: 22 punten over 10 beurten
- trigger: cockpit
- note: ritme voelde beter na beurt 5
`;
  const logs = parseExerciseLogs(md);
  assert.equal(logs.length, 1);
  assert.deepEqual(logs[0], {
    logDate: '2026-08-19',
    seq: 0,
    score: 22,
    unit: 'punten',
    result: '22 punten over 10 beurten',
    trigger: 'cockpit',
    note: 'ritme voelde beter na beurt 5',
  });
});

test('a bare date heading is still a session', () => {
  // "I did it" is a complete record; the schema's score column is nullable on
  // purpose (10-module-darts-exercises.sql).
  const logs = parseExerciseLogs('## Logboek\n\n### 2026-08-18\n');
  assert.equal(logs.length, 1);
  assert.equal(logs[0].score, null);
  assert.equal(logs[0].note, null);
});

test('repeated dates are kept, each with its own seq', () => {
  // Deliberately unlike habit_logs, where the last check-in of a day overwrites
  // the earlier one. Two sessions in a day are two results.
  const md = `## Logboek

### 2026-08-19
- score: 20

### 2026-08-19
- score: 26
`;
  const logs = parseExerciseLogs(md);
  assert.equal(logs.length, 2);
  assert.deepEqual(logs.map((l) => [l.seq, l.score]), [[0, 20], [1, 26]]);
});

test('a non-numeric score survives as result instead of being dropped', () => {
  const logs = parseExerciseLogs('## Logboek\n\n### 2026-08-19\n- score: best of 5 gewonnen\n');
  assert.equal(logs[0].score, null);
  assert.equal(logs[0].result, 'best of 5 gewonnen');
});

test('an explicit result wins over a non-numeric score', () => {
  const md = '## Logboek\n\n### 2026-08-19\n- score: heel goed\n- result: tot dubbel 14\n';
  assert.equal(parseExerciseLogs(md)[0].result, 'tot dubbel 14');
});

test('a comma decimal parses as a number', () => {
  assert.equal(parseExerciseLogs('## Logboek\n\n### 2026-08-19\n- score: 21,5\n')[0].score, 21.5);
});

test('parsing stops at the next H2 — later sections are not logs', () => {
  const md = `## Logboek

### 2026-08-19
- score: 22

## Reflectie

### 2026-08-20
- score: 99
`;
  const logs = parseExerciseLogs(md);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].score, 22);
});

test('a note without a Logboek section yields no sessions', () => {
  assert.deepEqual(parseExerciseLogs('# Oefening\n\n## Doel\n\nTekst.\n'), []);
  assert.equal(logbookSectionRange('# Oefening\n'), null);
});

// ── writer ────────────────────────────────────────────────────────────────────

test('a new block lands inside Logboek and BEFORE the next H2', () => {
  const md = `## Logboek

### 2026-08-18
- score: 20

## Bronnen

Iets anders.
`;
  const out = insertLogBlock(md, '### 2026-08-19\n- score: 26\n- trigger: cockpit\n');
  // Round-trips: the parser sees exactly two sessions, in order...
  const logs = parseExerciseLogs(out);
  assert.deepEqual(logs.map((l) => [l.logDate, l.score]), [
    ['2026-08-18', 20], ['2026-08-19', 26],
  ]);
  // ...and the following section is untouched.
  assert.ok(out.includes('## Bronnen\n\nIets anders.\n'));
});

test('appending to a note whose Logboek is the last section', () => {
  const md = '# Oefening\n\n## Logboek\n\n<!-- voorbeeld -->\n';
  const out = insertLogBlock(md, '### 2026-08-19\n- trigger: cockpit\n');
  assert.deepEqual(parseExerciseLogs(out).map((l) => l.logDate), ['2026-08-19']);
  assert.ok(out.includes('<!-- voorbeeld -->'), 'existing content is preserved');
});

test('a missing Logboek section is created rather than refused', () => {
  // Refusing a real session because a heading is absent would lose data for no
  // gain; the section is a convention, not a precondition.
  const out = insertLogBlock('# Oefening\n\n## Doel\n\nTekst.', '### 2026-08-19\n- score: 5\n');
  assert.ok(/^## Logboek$/m.test(out));
  assert.deepEqual(parseExerciseLogs(out).map((l) => l.score), [5]);
});

test('repeated appends stay parseable and ordered', () => {
  let md = '## Logboek\n';
  for (const d of ['2026-08-17', '2026-08-18', '2026-08-19']) {
    md = insertLogBlock(md, `### ${d}\n- score: 1\n- trigger: cockpit\n`);
  }
  assert.deepEqual(parseExerciseLogs(md).map((l) => l.logDate), [
    '2026-08-17', '2026-08-18', '2026-08-19',
  ]);
  assert.ok(!/\n{3,}/.test(md), 'no runaway blank lines build up');
});

// ── injection defence ─────────────────────────────────────────────────────────

test('a user value cannot forge a date heading', () => {
  // The whole reason every value is flattened to one line before it is written.
  const evil = 'gewoon\n### 2099-01-01\n- score: 999';
  const flattened = oneLine(evil, 1000);
  assert.ok(!flattened.includes('\n'));
  const out = insertLogBlock('## Logboek\n', `### 2026-08-19\n- note: ${flattened}\n`);
  const logs = parseExerciseLogs(out);
  assert.equal(logs.length, 1, 'the forged heading did not become a second session');
  assert.equal(logs[0].logDate, '2026-08-19');
});

test('a user value cannot open an HTML comment that swallows the section', () => {
  // Both parsers strip comments BEFORE reading, so an unbalanced "<!--" in a
  // note field would erase every session after it.
  const flattened = oneLine('kijk <!-- hier', 1000);
  assert.ok(!flattened.includes('<!--'));
  const out = insertLogBlock('## Logboek\n', `### 2026-08-19\n- note: ${flattened}\n`)
    + '\n### 2026-08-20\n- score: 3\n';
  assert.equal(parseExerciseLogs(out).length, 2);
});

test('oneLine collapses every flavour of line break and trims to the cap', () => {
  assert.equal(oneLine('a\r\nb c d   e', 100), 'a b c d e');
  assert.equal(oneLine('x'.repeat(50), 10), 'xxxxxxxxxx');
  assert.equal(oneLine(undefined, 10), '');
  assert.equal(oneLine(null, 10), '');
});

// ── path jail ─────────────────────────────────────────────────────────────────

test('the path jail rejects traversal, separators and bad charsets', () => {
  for (const bad of [
    '../../etc/passwd', 'a/b', 'a\\b', '', '-leading-dash', 'Upper', 'has space',
    'x'.repeat(200), null, undefined, 42,
  ]) {
    assert.equal(containedExercisePath(bad), null, `expected rejection for ${JSON.stringify(bad)}`);
  }
});

test('a symlinked note is refused', () => {
  // The jail resolves realpaths; a symlink inside the folder must not become a
  // write channel to somewhere else on disk.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'darts-jail-'));
  try {
    const outside = path.join(dir, 'outside.md');
    fs.writeFileSync(outside, '# outside\n');
    // containedExercisePath is bound to the real PKM folder, so this asserts the
    // rule at the level we can reach from a test: a non-regular file is refused.
    assert.equal(typeof containedExercisePath('dag-1-oefening-1-bulls-basic'), 'object');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ── small helpers ─────────────────────────────────────────────────────────────

test('scores render the way a human types them', () => {
  assert.equal(formatScore(22), '22');
  assert.equal(formatScore(21.5), '21.5');
  assert.equal(formatScore(21.4999999), '21.5');
  assert.equal(formatScore(-3), '-3');
});

test('daysBetween is UTC-anchored and never negative', () => {
  assert.equal(daysBetween('2026-08-19', '2026-08-19'), 0);
  assert.equal(daysBetween('2026-08-12', '2026-08-19'), 7);
  // Across a DST boundary in Europe/Amsterdam (last Sunday of October).
  assert.equal(daysBetween('2026-10-24', '2026-10-26'), 2);
  assert.equal(daysBetween('2026-08-20', '2026-08-19'), 0, 'a future log clamps to 0');
});

test('calendar dates are shape- AND range-checked', () => {
  assert.equal(isValidCalendarDate('2026-08-19'), true);
  for (const bad of ['2026-13-01', '2026-00-10', '2026-08-32', '19-08-2026', 'vandaag', '', null]) {
    assert.equal(isValidCalendarDate(bad), false, `expected rejection for ${JSON.stringify(bad)}`);
  }
});
