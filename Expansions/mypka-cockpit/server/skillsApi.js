// skillsApi.js — the capabilities the AI team can actually invoke, read LIVE from disk.
//
//   GET /api/cockpit/skills
//       { available, generatedAt, groups: [ { id, kind, label, available, count,
//         reason, items } ] }
//
// WHY LIVE, NOT THE mypka.db MIRROR
// Sander's explicit choice on 2026-08-19 (tsk-2026-08-19-001): no SQLite mirror,
// no regen step, so the list is never stale. Identical posture to teamTasksApi.js
// — the two live readers are deliberately one recognisable pattern.
//
// WHICH FOLDERS, AND WHAT IS EXCLUDED: see skillSources.js. That file is the seam
// AND it carries the reasoning for the two deliberate exclusions (scheduled tasks,
// marketplace catalogue) and the one honest gap (client-builtin skills). Read it
// before adding a source here.
//
// POSTURE
//   * READ-ONLY. Nothing here writes or moves a file.
//   * NEVER THROWS. An unreadable file costs THAT ROW; a missing folder costs
//     THAT GROUP; neither ever costs the response.
//   * JAILED. Every resolved path is checked against its source base before it is
//     read, and symlinks are skipped outright.
//   * Rides the standard `safe(handler)` envelope, inheriting the same
//     loopback/PIN/CSRF read-gate as every other /api/cockpit route.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './repoRoot.js';
import { parseTaskFrontmatter } from './taskFrontmatter.js';
import { SKILL_SOURCES, PLUGIN_REGISTRY, USER_SETTINGS } from './skillSources.js';

// Frontmatter parsing is shared with the task reader on purpose. Despite its
// name, parseTaskFrontmatter is a general scalar+inline-array frontmatter subset
// reader with no task-specific logic, and it is already covered by its own test
// file. Duplicating it here to avoid the name would mean two parsers to keep in
// step — worse than the slightly off-target import.

const SUMMARY_CHARS = 240;

// ---- filesystem helpers ------------------------------------------------------

// True iff `abs` really sits under `base`. Both must already be resolved.
function containedIn(base, abs) {
  const rel = path.relative(base, abs);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function isDir(abs) {
  try {
    return fs.statSync(abs).isDirectory();
  } catch {
    return false;
  }
}

function readTextOrNull(abs) {
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

function readJsonOrNull(abs) {
  if (!abs) return null;
  const raw = readTextOrNull(abs);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ---- shaping -----------------------------------------------------------------

function clamp(text) {
  const flat = String(text)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!flat) return null;
  if (flat.length <= SUMMARY_CHARS) return flat;
  const cut = flat.slice(0, SUMMARY_CHARS);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// First real prose paragraph of the body — skips the H1 and any heading, bullet,
// table, quote or fenced-code line. This is how a slash-command (which has NO
// frontmatter: just `# name` then a paragraph) gets its description, and it is
// the same technique teamTasksApi.js uses for a task summary.
function summaryFromBody(body) {
  if (!body) return null;
  for (const para of String(body).split(/\n\s*\n/)) {
    const p = para.trim();
    if (!p) continue;
    const first = p.split('\n')[0].trimStart();
    if (/^(#|-|\*|\||>|```|_\()/.test(first)) continue;
    const flat = clamp(p);
    if (flat) return flat;
  }
  return null;
}

// The H1 of a slash-command file ("# brainstorm"), used only as a title fallback.
function h1From(body) {
  if (!body) return null;
  for (const line of String(body).split(/\r?\n/)) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1].trim();
  }
  return null;
}

function asText(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

/**
 * Turn one markdown file into a skill row.
 *
 * Two shapes feed this:
 *   SKILL.md          — has frontmatter with `name` + a long trigger-laden
 *                       `description`. The description IS the summary.
 *   <command>.md      — no frontmatter at all; `# title` + a prose paragraph.
 *                       The first paragraph is the summary.
 * Both are handled by the same function so a future source that mixes them needs
 * no special case.
 */
function shape({ abs, slug, source, enabled = true, pluginName = null }) {
  const raw = readTextOrNull(abs);
  if (raw === null) return null;
  const { fm, body } = parseTaskFrontmatter(raw);

  const title = asText(fm.name) || h1From(body) || slug;
  const summary = clamp(asText(fm.description) || '') || summaryFromBody(body);

  // Only files inside the scaffold are reachable by the cockpit's jailed #/file
  // endpoint. Everything under ~/.claude is outside it, so we emit filePath:null
  // and the view routes those rows through skillSlug instead (see below).
  let filePath = null;
  if (source.repoRelative && containedIn(REPO_ROOT, abs)) {
    filePath = path.relative(REPO_ROOT, abs).split(path.sep).join('/');
  }

  // A SEPARATE field, never a second meaning stuffed into filePath. filePath's
  // contract is "repo-relative path servable by /api/cockpit/file"; skillSlug's
  // is "one segment servable by /api/cockpit/skill-file, which hardcodes the
  // SKILL.md filename itself". Mixing them would be the routing confusion of
  // Argus's design §4.1, but in the data model.
  //
  // Bound to id === 'user-skills', NOT to kind === 'domain-skill': PLUGIN skills
  // stay deliberately unlinkable. readPluginSkills() takes installPath from
  // ~/.claude/plugins/installed_plugins.json — arbitrary absolute paths — so
  // serving those would turn that JSON file into an arbitrary-read primitive.
  // Do not "improve" this into a kind check (design §7.2).
  const skillSlug = source.id === 'user-skills' ? slug : null;

  return {
    // Namespaced so a slug collision across sources (a `brainstorm` skill AND a
    // /brainstorm command) cannot produce a duplicate React key.
    key: `${source.id}:${slug}`,
    slug,
    // The token Sander actually types for a command; null where there isn't one.
    invocation: source.kind === 'slash-command' ? `/${slug}` : null,
    title,
    summary,
    kind: source.kind,
    sourceId: source.id,
    pluginName,
    enabled,
    filePath,
    skillSlug,
  };
}

// ---- the readers -------------------------------------------------------------

// A folder-per-skill source: <base>/<slug>/SKILL.md
function readDirWithSkillMd(base, source) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(base, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) continue;
    const dirAbs = path.resolve(base, entry.name);
    if (!containedIn(base, dirAbs)) continue;
    const abs = path.join(dirAbs, 'SKILL.md');
    if (!containedIn(base, abs)) continue;
    try {
      if (fs.lstatSync(abs).isSymbolicLink() || !fs.statSync(abs).isFile()) continue;
    } catch {
      continue;
    }
    const row = shape({ abs, slug: entry.name, source });
    if (row) out.push(row);
  }
  return out;
}

// A file-per-item source: <base>/<slug>.md
function readFlatMd(base, source) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(base, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink() || !entry.isFile()) continue;
    if (!entry.name.endsWith('.md')) continue;
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const abs = path.resolve(base, entry.name);
    if (!containedIn(base, abs)) continue;
    const row = shape({ abs, slug: path.basename(entry.name, '.md'), source });
    if (row) out.push(row);
  }
  return out;
}

function resolveBase(source) {
  if (!source.base) return null;
  return source.repoRelative ? path.resolve(REPO_ROOT, source.base) : source.base;
}

function readSource(source) {
  const base = resolveBase(source);
  if (!base || !isDir(base)) {
    return {
      id: source.id,
      kind: source.kind,
      label: source.label,
      available: false,
      // A machine-readable reason so the view can say WHY a group is empty
      // instead of showing a bare "nothing here".
      reason: 'source-missing',
      count: 0,
      items: [],
    };
  }
  const items = source.layout === 'flat-md'
    ? readFlatMd(base, source)
    : readDirWithSkillMd(base, source);
  items.sort((a, b) => a.title.localeCompare(b.title, 'nl'));
  return {
    id: source.id,
    kind: source.kind,
    label: source.label,
    available: true,
    reason: null,
    count: items.length,
    items,
  };
}

/**
 * Installed plugin skills, discovered from the client's own install registry.
 *
 * Deliberately NOT a folder glob: ~/.claude/plugins/marketplaces/ holds 32
 * SKILL.md files that are merely INSTALLABLE, and listing those would answer a
 * different question than the page asks (see skillSources.js note 2). Reading the
 * registry means the list follows real installs, and the `enabled` flag carries
 * the on/off state so a disabled plugin is shown as disabled rather than silently
 * presented as an available capability.
 */
function readPluginSkills() {
  const group = {
    id: 'plugin-skills',
    kind: 'plugin-skill',
    label: 'Plugin-skills',
    available: false,
    reason: 'source-missing',
    count: 0,
    items: [],
  };

  const registry = readJsonOrNull(PLUGIN_REGISTRY);
  if (!registry || typeof registry.plugins !== 'object' || registry.plugins === null) {
    return group;
  }
  group.available = true;
  group.reason = null;

  const settings = readJsonOrNull(USER_SETTINGS) || {};
  const enabledMap = (settings && typeof settings.enabledPlugins === 'object' && settings.enabledPlugins)
    ? settings.enabledPlugins
    : {};

  for (const [pluginKey, installs] of Object.entries(registry.plugins)) {
    if (!Array.isArray(installs) || installs.length === 0) continue;
    // Newest install wins when the client has kept more than one version.
    const install = installs[installs.length - 1];
    const installPath = asText(install && install.installPath);
    if (!installPath) continue;

    const skillsDir = path.join(installPath, 'skills');
    if (!isDir(skillsDir)) continue;

    // A plugin key is "<name>@<marketplace>"; the bare name is what reads well.
    const pluginName = pluginKey.split('@')[0] || pluginKey;
    // Absent from enabledPlugins means "not explicitly disabled" → treated as on.
    const enabled = enabledMap[pluginKey] !== false;

    const pseudoSource = {
      id: 'plugin-skills',
      kind: 'plugin-skill',
      repoRelative: false,
    };
    for (const row of readDirWithSkillMd(skillsDir, pseudoSource)) {
      group.items.push({ ...row, key: `plugin:${pluginKey}:${row.slug}`, pluginName, enabled });
    }
  }

  group.items.sort((a, b) => a.title.localeCompare(b.title, 'nl'));
  group.count = group.items.length;
  return group;
}

/**
 * readAllSkills() -> the full envelope. Never throws.
 *
 * `groups` is an array for the same reason taskSources.js carries one: adding a
 * source must not change the shape the client already handles.
 */
export function readAllSkills() {
  const groups = [];
  for (const source of SKILL_SOURCES) {
    try {
      groups.push(readSource(source));
    } catch {
      groups.push({
        id: source.id,
        kind: source.kind,
        label: source.label,
        available: false,
        reason: 'read-failed',
        count: 0,
        items: [],
      });
    }
  }
  try {
    groups.push(readPluginSkills());
  } catch {
    groups.push({
      id: 'plugin-skills',
      kind: 'plugin-skill',
      label: 'Plugin-skills',
      available: false,
      reason: 'read-failed',
      count: 0,
      items: [],
    });
  }

  return {
    available: groups.some((g) => g.available && g.count > 0),
    generatedAt: new Date().toISOString(),
    total: groups.reduce((sum, g) => sum + g.count, 0),
    groups,
  };
}

export function registerSkillsRoutes(app, { safe }) {
  app.get('/api/cockpit/skills', safe(() => readAllSkills()));
}

export default registerSkillsRoutes;
