// podcastsApi.test.mjs — the write body validator is the first line of defense
// on the request side, so it gets asserted independently of any database.
//
// Run: node --test server/podcastsApi.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWatchBody } from './podcastsApi.js';

test('ticking requires a platform from the vocabulary', () => {
  assert.deepEqual(validateWatchBody({ watched: true, platform: 'youtube' }), {
    watched: true, platform: 'youtube', expectGuid: undefined,
  });
  assert.match(validateWatchBody({ watched: true }).error, /platform must be one of/);
  assert.match(validateWatchBody({ watched: true, platform: 'tiktok' }).error, /platform must be one of/);
});

test('unticking must NOT carry a platform — all three columns go to NULL', () => {
  assert.deepEqual(validateWatchBody({ watched: false }), {
    watched: false, platform: null, expectGuid: undefined,
  });
  assert.match(
    validateWatchBody({ watched: false, platform: 'youtube' }).error,
    /platform must be omitted when watched is false/,
  );
});

test('watched must be a real boolean, not a truthy string', () => {
  assert.match(validateWatchBody({ watched: 'true', platform: 'youtube' }).error, /watched must be a boolean/);
  assert.match(validateWatchBody({}).error, /watched must be a boolean/);
});

test('unknown fields are a 400, never silently dropped', () => {
  const r = validateWatchBody({ watched: true, platform: 'web', play_state: 'played' });
  assert.match(r.error, /unexpected field\(s\): play_state/);
});

test('a non-object body is rejected', () => {
  assert.match(validateWatchBody(null).error, /body must be a JSON object/);
  assert.match(validateWatchBody([1, 2]).error, /body must be a JSON object/);
});

test('the optional guid pin is trimmed and passed through', () => {
  const r = validateWatchBody({ watched: true, platform: 'spotify', guid: '  abc-123  ' });
  assert.equal(r.expectGuid, 'abc-123');
  assert.match(validateWatchBody({ watched: false, guid: '   ' }).error, /non-empty string/);
});
