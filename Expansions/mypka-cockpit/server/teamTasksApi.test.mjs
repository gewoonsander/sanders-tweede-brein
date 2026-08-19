import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readAllTasks } from './teamTasksApi.js';

test('Open task count matches nulmeting', () => {
  const data = readAllTasks();
  const teamSource = data.sources.find(s => s.id === 'team');
  assert.ok(teamSource, 'team source exists');
  assert.equal(teamSource.counts.open, 11, 'open count is 11 (nulmeting 2026-08-19)');
});

test('No EXAMPLE tasks included', () => {
  const data = readAllTasks();
  const teamSource = data.sources.find(s => s.id === 'team');
  const exampleIds = teamSource.items.filter(i => i.id.startsWith('EXAMPLE'));
  assert.equal(exampleIds.length, 0, 'no EXAMPLE tasks found');
});

test('All filePaths start with Team Knowledge/tasks/', () => {
  const data = readAllTasks();
  const teamSource = data.sources.find(s => s.id === 'team');
  const badPaths = teamSource.items.filter(i => !i.filePath.startsWith('Team Knowledge/tasks/'));
  assert.equal(badPaths.length, 0, 'all paths are within Team Knowledge/tasks/');
});

test('All blocked items have blockedReason', () => {
  const data = readAllTasks();
  const teamSource = data.sources.find(s => s.id === 'team');
  const blockedNoReason = teamSource.items.filter(i => i.blocked && !i.blockedReason);
  assert.equal(blockedNoReason.length, 0, 'all blocked items have a reason');
});

test('Response has sources array (scope B format)', () => {
  const data = readAllTasks();
  assert.ok(Array.isArray(data.sources), 'sources is an array');
  assert.ok(data.sources.length > 0, 'sources array has at least one entry');
  const firstSource = data.sources[0];
  assert.ok(firstSource.id, 'source has id');
  assert.ok(firstSource.counts, 'source has counts');
  assert.ok(Array.isArray(firstSource.items), 'source has items array');
});
