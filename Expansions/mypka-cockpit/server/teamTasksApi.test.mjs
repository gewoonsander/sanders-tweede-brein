import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readAllSources } from './teamTasksApi.js';
import { TASK_SOURCES } from './taskSources.js';
import { REPO_ROOT } from './repoRoot.js';

const envelope = readAllSources();
const team = envelope.sources.find((s) => s.id === 'team');

// Ground truth straight off the filesystem, computed the SAME way
// SOP-rebuild-task-index does it (`find ... -name 'tsk-*.md'`). If the reader and
// this disagree, the reader is wrong — not the folder.
function countOnDisk(dir, maxdepth) {
  const abs = path.join(REPO_ROOT, 'Team Knowledge/tasks', dir);
  const args = [abs];
  if (maxdepth) args.push('-maxdepth', String(maxdepth));
  args.push('-name', 'tsk-*.md');
  try {
    const out = execFileSync('find', args, { encoding: 'utf8' });
    return out.split('\n').filter((l) => l.trim() !== '').length;
  } catch {
    return 0;
  }
}

test('the envelope carries a sources ARRAY (the scope-B shape)', () => {
  assert.ok(Array.isArray(envelope.sources), 'sources must be an array');
  assert.equal(envelope.items, undefined, 'no flat top-level items list');
  assert.equal(envelope.available, true);
  assert.equal(envelope.sources.length, TASK_SOURCES.length);
  assert.equal(team.available, true);
  assert.equal(team.root, 'Team Knowledge/tasks');
});

test('counts match what find() sees on disk', () => {
  assert.equal(team.counts.open, countOnDisk('open', 1), 'open');
  assert.equal(team.counts['in-progress'], countOnDisk('in-progress', 1), 'in-progress');
  assert.equal(team.counts.done, countOnDisk('done'), 'done (recursive, YYYY/MM)');
  assert.equal(team.counts.cancelled, countOnDisk('cancelled'), 'cancelled (recursive)');
});

test('the EXAMPLE task and the template are excluded', () => {
  assert.equal(team.items.filter((i) => i.slug.startsWith('EXAMPLE')).length, 0);
  assert.equal(team.items.filter((i) => i.slug.startsWith('_')).length, 0);
  // …and the file genuinely is there, so the exclusion is doing real work.
  assert.ok(fs.existsSync(path.join(
    REPO_ROOT, 'Team Knowledge/tasks/open/EXAMPLE-tsk-2026-05-10-001-welcome-to-tasks.md',
  )), 'the EXAMPLE file must exist for this test to mean anything');
});

test('every filePath stays inside the jail and points at a real file', () => {
  assert.ok(team.items.length > 0);
  for (const item of team.items) {
    assert.ok(
      item.filePath.startsWith('Team Knowledge/tasks/'),
      `escaped the jail: ${item.filePath}`,
    );
    assert.equal(item.filePath.includes('..'), false);
    assert.ok(fs.existsSync(path.join(REPO_ROOT, item.filePath)), `missing: ${item.filePath}`);
  }
});

test('blocked is derived from blocked_reason, never from a folder', () => {
  // There is no blocked/ folder and there must never be one.
  assert.equal(fs.existsSync(path.join(REPO_ROOT, 'Team Knowledge/tasks/blocked')), false);

  // BLOCKED IS ORTHOGONAL TO STATUS. An earlier version of this test asserted
  // that a blocked task must sit in in-progress/ — that read SOP-rebuild-task-
  // index's prose ("blocked tasks live in in-progress/ with blocked_reason set")
  // as an invariant. It is not one: tsk-2026-08-12-001-build-portable-dropbox-mcp
  // sits in open/ with a filled blocked_reason, and INDEX.md renders it exactly
  // that way — in the Open section with a BLOCKED suffix. The real invariant is
  // that the flag comes from the FIELD, and that closed work is never "blocked".
  for (const item of team.items.filter((i) => i.blocked)) {
    assert.equal(typeof item.blockedReason, 'string');
    assert.ok(item.blockedReason.length > 0, `${item.slug} is blocked without a reason`);
    assert.equal(['done', 'cancelled'].includes(item.status), false,
      `${item.slug}: closed work cannot be blocked`);
  }
  // and the inverse: nothing is flagged blocked without a reason behind it
  for (const item of team.items.filter((i) => !i.blocked)) {
    assert.equal(item.blockedReason, null, `${item.slug} has a reason but is not flagged`);
  }
  assert.equal(team.counts.blocked, team.items.filter((i) => i.blocked).length);
});

test('the folder wins over the status: field (SOP-rebuild-task-index drift rule)', () => {
  for (const item of team.items) {
    const onDisk = item.filePath.split('/')[2]; // Team Knowledge/tasks/<statusdir>/...
    assert.equal(item.status, onDisk,
      `${item.slug} reports status "${item.status}" but sits in ${onDisk}/`);
    assert.equal(typeof item.statusFieldDrift, 'boolean');
  }
});

test('rows are shaped for the view: no undefined, sane types', () => {
  for (const item of team.items) {
    assert.equal(typeof item.slug, 'string');
    assert.equal(typeof item.id, 'string');
    assert.equal(typeof item.title, 'string');
    assert.ok(item.title.length > 0);
    assert.equal(typeof item.assignee, 'string'); // never null — 'unassigned'
    assert.ok(item.priority === null || (item.priority >= 1 && item.priority <= 4));
    assert.ok(Array.isArray(item.tags));
    assert.equal(typeof item.blocked, 'boolean');
    for (const key of ['due', 'created', 'updated', 'summary', 'blockedReason']) {
      assert.notEqual(item[key], undefined, `${item.slug}.${key} is undefined`);
    }
  }
});

test('open items sort by priority, most urgent first', () => {
  const open = team.items.filter((i) => i.status === 'open').map((i) => i.priority ?? 99);
  for (let i = 1; i < open.length; i += 1) {
    assert.ok(open[i - 1] <= open[i], `priority order broke at index ${i}: ${open.join(',')}`);
  }
});

test('a source whose root does not exist degrades instead of throwing', () => {
  const original = TASK_SOURCES[0].root;
  try {
    TASK_SOURCES[0].root = 'Team Knowledge/tasks-does-not-exist';
    const out = readAllSources();
    assert.equal(out.sources[0].available, false);
    assert.deepEqual(out.sources[0].items, []);
    assert.equal(out.available, false);
  } finally {
    TASK_SOURCES[0].root = original;
  }
});
