// skillSources.js — THE SOURCE CONFIGURATION for the cockpit's skills reader.
//
// WHY THIS FILE EXISTS
// Skills are the one Team-Knowledge surface that does NOT live in the myPKA
// scaffold. They sit in the Claude client's own config tree (~/.claude) and in
// this repo's .claude/ folder. There are several such folders, they have
// different shapes, and more will appear. Each one is ONE entry below; the reader
// never hard-codes a path. This mirrors taskSources.js deliberately — same seam,
// same contract, so the two live-from-disk readers stay recognisably one pattern.
//
// WHY LIVE, NOT THE mypka.db MIRROR
// Sander's explicit architecture choice on 2026-08-19 (recorded in
// tsk-2026-08-19-001): no SQLite mirror, no regen step. Skills change whenever a
// skill is authored or a slash-command is added; a mirrored list would be stale
// the moment it mattered. Same reasoning as teamTasksApi.js.
//
// ---------------------------------------------------------------------------
// WHAT IS DELIBERATELY EXCLUDED — and why. Read this before adding a source.
// ---------------------------------------------------------------------------
//
// 1. ~/.claude/scheduled-tasks/*/SKILL.md  — THREE files, excluded BY DECISION.
//    These are cron-style routines (alex-spellman-watchlist,
//    controle-ontbrekende-model-velden, gemma-4-heroverwegen). They carry a
//    SKILL.md and would match a naive ~/.claude/**/SKILL.md glob, but Sander
//    ruled them out of scope explicitly: they are scheduled jobs, not
//    capabilities the team can invoke. The `roots` below are therefore scoped to
//    `skills/` exactly, never to ~/.claude as a whole. DO NOT widen them.
//
// 2. ~/.claude/plugins/marketplaces/**  — THIRTY-TWO SKILL.md files, excluded
//    because a marketplace is a CATALOGUE OF INSTALLABLE plugins, not a list of
//    what is installed. Listing them would answer "what could Sander install?"
//    while the page claims to answer "what does the team have?". That is a lie by
//    inclusion, and the more convincing for being 32 items long. Installed
//    plugins are discovered from installed_plugins.json instead — see
//    PLUGIN_REGISTRY below.
//
// ---------------------------------------------------------------------------
// KNOWN GAP (flagged to Hermes/Harmonia 2026-08-19, deliberately NOT faked)
// ---------------------------------------------------------------------------
// tsk-2026-08-19-001 also asks for the generic Anthropic skills (docx, pdf,
// pptx, xlsx, and similar). Those ship INSIDE the Claude client binary and have
// NO on-disk representation on this machine — verified: the only SKILL.md files
// under ~/.claude are the five user skills, the three scheduled tasks, and the
// marketplace catalogue. Hard-coding a list of them would be inventing data the
// server cannot verify, which is exactly what this codebase's "never assert what
// you cannot read" posture forbids. They are therefore ABSENT rather than
// fabricated. If a future client version writes them to disk, they become one
// more entry here and appear automatically.

import os from 'node:os';
import path from 'node:path';

const HOME = os.homedir();

// FIELD CONTRACT
//   id           stable key, used in the API envelope and as a React key.
//   kind         the origin category the view groups + labels by:
//                'domain-skill' | 'slash-command' | 'plugin-skill'
//   label        display name. Data, not UI chrome — deliberately NOT translated,
//                the same call taskSources.js makes for connector-style labels.
//   base         ABSOLUTE folder. Every resolved path is jailed under this; a
//                path that escapes it is skipped, never read. `null` means the
//                source is not resolvable on this machine (no home dir) and is
//                reported unavailable rather than crashing the response.
//   repoRelative true when `base` sits inside the myPKA scaffold, which means the
//                cockpit's existing #/file route can open the file in-app. Files
//                OUTSIDE the scaffold (everything under ~/.claude) are NOT
//                reachable by that jailed endpoint, so their rows render as
//                non-navigable cards rather than dead links.
//   layout       'dir-with-skill-md' → <base>/<slug>/SKILL.md  (one folder per skill)
//                'flat-md'           → <base>/<slug>.md        (one file per command)
export const SKILL_SOURCES = [
  {
    id: 'user-skills',
    kind: 'domain-skill',
    label: 'Domeinskills',
    base: HOME ? path.join(HOME, '.claude', 'skills') : null,
    repoRelative: false,
    layout: 'dir-with-skill-md',
  },
  {
    id: 'repo-commands',
    kind: 'slash-command',
    label: 'Slash-commands',
    // Repo-relative: resolved against REPO_ROOT by the reader, so this one entry
    // keeps working if the scaffold folder is renamed (see repoRoot.js).
    base: '.claude/commands',
    repoRelative: true,
    layout: 'flat-md',
  },
];

// Installed plugins are discovered, not configured: the client writes an install
// registry and we read it. That keeps the list honest when Sander installs or
// removes a plugin, and it is what lets us exclude the marketplace catalogue
// (see note 2 above) without excluding genuinely installed plugin skills.
//
// Shape (v2): { version, plugins: { "<name>@<marketplace>": [ { installPath, version, ... } ] } }
// A plugin's skills live at <installPath>/skills/<slug>/SKILL.md.
export const PLUGIN_REGISTRY = HOME
  ? path.join(HOME, '.claude', 'plugins', 'installed_plugins.json')
  : null;

// Where the client records which installed plugins are switched ON. A plugin can
// be installed but disabled — superwhisper is, deliberately and permanently, and
// showing it as an available capability would be wrong. The reader carries an
// `enabled` flag per plugin skill rather than hiding it, so the page tells the
// truth in both directions.
export const USER_SETTINGS = HOME
  ? path.join(HOME, '.claude', 'settings.json')
  : null;

export default SKILL_SOURCES;
