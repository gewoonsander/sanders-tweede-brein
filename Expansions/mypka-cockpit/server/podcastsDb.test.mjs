// podcastsDb.test.mjs — the scope guard is the contract, so it gets asserted.
//
// These tests do NOT open mypka.db. They prove the two things that make the
// write channel safe independently of any data: (1) the SQL literals this module
// ships assign only the three whitelisted columns and key on guid, and (2) the
// boot-time proof actually rejects a widened statement rather than waving it
// through. Plus the body validator's scope-lock.
//
// Run: node --test server/podcastsDb.test.mjs server/podcastsApi.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { WRITABLE_COLUMNS, ALLOWED_PLATFORMS, __sql } from './podcastsDb.js';

const { SQL_SET, SQL_CLEAR, assertScopedUpdate } = __sql;

test('the whitelist is exactly the three §18.9 columns', () => {
  assert.deepEqual([...WRITABLE_COLUMNS].sort(), [
    'manual_watched',
    'manual_watched_at',
    'manual_watched_platform',
  ]);
});

test('the platform vocabulary matches the schema CHECK', () => {
  assert.deepEqual([...ALLOWED_PLATFORMS], ['youtube', 'spotify', 'web', 'other']);
});

test('the shipped SQL literals pass their own scope proof', () => {
  assert.doesNotThrow(() => assertScopedUpdate(SQL_SET, 'SQL_SET'));
  assert.doesNotThrow(() => assertScopedUpdate(SQL_CLEAR, 'SQL_CLEAR'));
});

test('clearing nulls all three columns in one statement (§18.9 coherence CHECKs)', () => {
  // Clearing only manual_watched would raise a CHECK failure by design; the
  // statement must therefore null the platform and the timestamp too.
  assert.match(SQL_CLEAR, /manual_watched\s*=\s*0/);
  assert.match(SQL_CLEAR, /manual_watched_platform\s*=\s*NULL/);
  assert.match(SQL_CLEAR, /manual_watched_at\s*=\s*NULL/);
});

test('both statements key on guid, never on slug', () => {
  for (const sql of [SQL_SET, SQL_CLEAR]) {
    assert.match(sql, /WHERE\s+guid\s*=\s*@guid/);
    assert.doesNotMatch(sql, /WHERE[\s\S]*\bslug\b/);
  }
});

test('a fourth column is rejected at load time, by name', () => {
  assert.throws(
    () => assertScopedUpdate(
      'UPDATE podcast_episodes SET manual_watched = 1, play_state = @p WHERE guid = @guid',
      'widened',
    ),
    /non-whitelisted column "play_state"/,
  );
});

test('another table is rejected', () => {
  assert.throws(
    () => assertScopedUpdate('UPDATE podcasts SET manual_watched = 1 WHERE guid = @guid', 'wrong-table'),
    /does not start with "UPDATE podcast_episodes SET"/,
  );
});

test('keying on slug is rejected — slug is derived and may be regenerated', () => {
  assert.throws(
    () => assertScopedUpdate('UPDATE podcast_episodes SET manual_watched = 1 WHERE slug = @slug', 'slug-keyed'),
    /expected "guid = @guid"/,
  );
});

test('a piggybacked second statement is rejected', () => {
  assert.throws(
    () => assertScopedUpdate(
      'UPDATE podcast_episodes SET manual_watched = 1 WHERE guid = @guid; DROP TABLE podcasts',
      'two-statements',
    ),
    /more than one statement/,
  );
});

test('an unbounded UPDATE (no WHERE) is rejected', () => {
  assert.throws(
    () => assertScopedUpdate('UPDATE podcast_episodes SET manual_watched = 1', 'no-where'),
    /no parseable SET … WHERE/,
  );
});
