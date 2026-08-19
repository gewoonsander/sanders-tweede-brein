import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseTaskFrontmatter } from './taskFrontmatter.js';
import { REPO_ROOT } from './repoRoot.js';

test('scalars, quotes and comments', () => {
  const { fm, body } = parseTaskFrontmatter(
    ['---',
      '# Identity',
      'id: tsk-2026-08-19-001',
      'title: "Een titel: met een dubbele punt"',
      '',
      'priority: 3',
      'quoted_number: "3"',
      '---',
      '# De body',
      'tekst'].join('\n'),
  );
  assert.equal(fm.id, 'tsk-2026-08-19-001');
  assert.equal(fm.title, 'Een titel: met een dubbele punt');
  assert.equal(fm.priority, 3);          // unquoted integer -> number
  assert.equal(fm.quoted_number, '3');   // quoted -> stays a string
  assert.equal(fm.Identity, undefined);  // the '# Identity' comment is not a key
  assert.match(body, /^# De body/);
});

test('inline arrays', () => {
  const { fm } = parseTaskFrontmatter(
    ['---',
      'linked_sops: [SOP-004-argus-security-audit]',
      'linked_workstreams: []',
      'tags: [bunq, financien, "kaart, met komma"]',
      '---',
      ''].join('\n'),
  );
  assert.deepEqual(fm.linked_sops, ['SOP-004-argus-security-audit']);
  assert.deepEqual(fm.linked_workstreams, []);
  assert.deepEqual(fm.tags, ['bunq', 'financien', 'kaart, met komma']);
});

test('null and empty values become JS null, not the string "null"', () => {
  const { fm } = parseTaskFrontmatter(
    ['---',
      'blocked_reason: null',
      'blocked_by: null',
      'due:',
      '---',
      ''].join('\n'),
  );
  assert.equal(fm.blocked_reason, null);
  assert.equal(fm.blocked_by, null);
  assert.equal(fm.due, null);
  assert.equal(typeof fm.blocked_reason, 'object'); // null is an object, not 'string'
});

test('a file without frontmatter reads honestly instead of throwing', () => {
  const raw = '# Gewoon een markdown-bestand\n\nzonder frontmatter.';
  const { fm, body } = parseTaskFrontmatter(raw);
  assert.deepEqual(fm, {});
  assert.equal(body, raw);
  // and the pathological inputs never throw either
  assert.deepEqual(parseTaskFrontmatter('').fm, {});
  assert.deepEqual(parseTaskFrontmatter(undefined).fm, {});
  assert.deepEqual(parseTaskFrontmatter('---\nid: x\nnever closed').fm, {});
});

test('parses a REAL task file from Team Knowledge/tasks', () => {
  const file = path.join(
    REPO_ROOT,
    'Team Knowledge/tasks/open/tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector.md',
  );
  const { fm } = parseTaskFrontmatter(fs.readFileSync(file, 'utf8'));
  assert.equal(fm.assignee, 'daedalus');
  assert.equal(fm.priority, 3);
  assert.equal(fm.status, 'open');
  assert.equal(fm.blocked_reason, null);
  assert.equal(fm.created_by, 'hermes');
  assert.ok(Array.isArray(fm.tags) && fm.tags.includes('bunq'));
  assert.deepEqual(fm.linked_sops, ['SOP-004-argus-security-audit']);
});
