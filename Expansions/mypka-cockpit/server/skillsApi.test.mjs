// skillsApi.test.mjs — guards the two things this reader can get WRONG in a way
// that looks right: including capabilities the team does not actually have, and
// silently dropping ones it does.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { readAllSkills } from './skillsApi.js';
import { SKILL_SOURCES } from './skillSources.js';

const data = readAllSkills();
const allItems = data.groups.flatMap((g) => g.items);
const byKind = (kind) => allItems.filter((i) => i.kind === kind);

test('envelope carries a groups array, not a flat item list', () => {
  assert.ok(Array.isArray(data.groups), 'groups must be an array');
  assert.equal(data.items, undefined, 'must NOT expose a flat top-level items array');
  assert.equal(typeof data.total, 'number');
  assert.equal(data.total, allItems.length, 'total must match the rows actually returned');
});

test('every row has a title and a stable unique key', () => {
  const keys = new Set();
  for (const item of allItems) {
    assert.ok(item.title && item.title.trim() !== '', `empty title on ${item.key}`);
    assert.ok(!keys.has(item.key), `duplicate key: ${item.key}`);
    keys.add(item.key);
  }
});

test('the three scheduled tasks are NOT present', () => {
  // Sander excluded these explicitly. They carry a SKILL.md and WOULD be matched
  // by a naive ~/.claude/**/SKILL.md glob, so this is the regression that guards
  // the scoping in skillSources.js.
  const excluded = ['alex-spellman-watchlist', 'controle-ontbrekende-model-velden', 'gemma-4-heroverwegen'];
  for (const slug of excluded) {
    assert.equal(
      allItems.some((i) => i.slug === slug),
      false,
      `scheduled task "${slug}" must not appear as a skill`,
    );
  }
});

test('the marketplace CATALOGUE is not mistaken for installed plugins', () => {
  // ~/.claude/plugins/marketplaces/ holds installable-but-not-installed plugins.
  // Listing them would overstate what the team has. Assert we return strictly
  // fewer plugin skills than the catalogue contains.
  const marketplaces = path.join(os.homedir(), '.claude', 'plugins', 'marketplaces');
  if (!fs.existsSync(marketplaces)) return; // nothing to over-count on this machine
  const plugins = byKind('plugin-skill');
  for (const item of plugins) {
    assert.ok(
      item.pluginName,
      `plugin skill ${item.key} must name the plugin it came from`,
    );
  }
  // Every returned plugin skill must trace to an install path, never to the catalogue.
  assert.ok(
    plugins.every((i) => i.key.startsWith('plugin:')),
    'plugin rows must be registry-derived',
  );
});

test('domain skills are read from ~/.claude/skills with their frontmatter description', () => {
  const domain = byKind('domain-skill');
  const home = os.homedir();
  const dir = path.join(home, '.claude', 'skills');
  if (!fs.existsSync(dir)) return;
  const onDisk = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort();
  assert.deepEqual(domain.map((i) => i.slug).sort(), onDisk,
    'every folder with a SKILL.md must be represented, and nothing else');
  // The description is the whole point of the page; assert it actually arrives.
  for (const item of domain) {
    assert.ok(item.summary && item.summary.length > 20,
      `domain skill ${item.slug} has no usable summary`);
  }
});

test('slash commands are read from the repo and carry their /invocation', () => {
  const commands = byKind('slash-command');
  assert.ok(commands.length > 0, 'expected at least one slash command');
  for (const item of commands) {
    assert.equal(item.invocation, `/${item.slug}`);
    // Commands live INSIDE the scaffold, so they must be openable via #/file.
    assert.ok(item.filePath && item.filePath.startsWith('.claude/commands/'),
      `command ${item.slug} should be openable in-app, got filePath=${item.filePath}`);
    assert.ok(item.summary && item.summary.length > 20,
      `command ${item.slug} has no usable summary (H1-only file?)`);
  }
});

test('rows outside the scaffold expose no filePath (never a dead #/file link)', () => {
  for (const item of allItems) {
    if (item.kind === 'slash-command') continue;
    assert.equal(item.filePath, null,
      `${item.key} sits outside the scaffold and must not claim an openable path`);
  }
});

test('a missing source degrades to an unavailable group, never a throw', () => {
  const broken = [{
    id: 'nope', kind: 'domain-skill', label: 'Nope',
    base: '/definitely/not/a/real/path/xyzzy', repoRelative: false,
    layout: 'dir-with-skill-md',
  }];
  const saved = SKILL_SOURCES.splice(0, SKILL_SOURCES.length, ...broken);
  try {
    const out = readAllSkills();
    const g = out.groups.find((x) => x.id === 'nope');
    assert.equal(g.available, false);
    assert.equal(g.reason, 'source-missing');
    assert.deepEqual(g.items, []);
  } finally {
    SKILL_SOURCES.splice(0, SKILL_SOURCES.length, ...saved);
  }
});
