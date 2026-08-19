import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { parseTaskFrontmatter } from './taskFrontmatter.js';
import fs from 'fs';
import path from 'path';

test('Scalars and quoted strings', () => {
  const input = `---
title: My Task
priority: 2
assignee: "alice"
---
Body text`;
  const { fm } = parseTaskFrontmatter(input);
  assert.equal(fm.title, 'My Task');
  assert.equal(fm.priority, 2);
  assert.equal(fm.assignee, 'alice');
});

test('Array parsing', () => {
  const input = `---
linked_sops: [SOP-004-argus-security-audit]
tags: [urgent, backend]
---
Body`;
  const { fm } = parseTaskFrontmatter(input);
  assert.deepEqual(fm.linked_sops, ['SOP-004-argus-security-audit']);
  assert.deepEqual(fm.tags, ['urgent', 'backend']);
});

test('Null values', () => {
  const input = `---
blocked_reason: null
due: null
---
Body`;
  const { fm } = parseTaskFrontmatter(input);
  assert.equal(fm.blocked_reason, null);
  assert.equal(fm.due, null);
});

test('Missing frontmatter', () => {
  const input = 'No frontmatter here\nJust body';
  const { fm, body } = parseTaskFrontmatter(input);
  assert.deepEqual(fm, {});
  assert.equal(body, input);
});

test('Real task file: tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector.md', () => {
  const filePath = '/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Knowledge/tasks/open/tsk-2026-08-17-001-bouw-bunq-saldo-cockpit-connector.md';
  const content = fs.readFileSync(filePath, 'utf-8');
  const { fm } = parseTaskFrontmatter(content);
  assert.equal(fm.assignee, 'daedalus');
  assert.equal(fm.priority, 3);
});
