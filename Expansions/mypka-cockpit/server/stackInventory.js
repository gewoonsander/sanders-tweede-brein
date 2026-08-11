// stackInventory.js — the READ-ONLY, SECRET-FREE inventory behind the
// "Software-stack" tab (GET /api/cockpit/stack).
//
// WHY THIS EXISTS (and why it is NOT the connector contract)
//   server/connectors/ is deliberately narrow: it only knows tools that emit
//   NormalizedTask / NormalizedEvent items for the planner (see its README).
//   Firecrawl, Perplexity, an n8n MCP endpoint — none of those have a "my tasks"
//   list, so they can never appear on the Connections page, yet they ARE part of
//   the software this myPKA is wired to. This module answers the broader
//   question ("what is my brain connected to?") from its OWN two sources:
//
//     1. `Team Knowledge/.env`  → every stored key NAME (never a value),
//        cross-referenced against the connector registry so each name reads as
//        "used by <connector>", "cockpit setting", or "not wired to the planner".
//     2. `<repo root>/.mcp.json` → the MCP servers this repo declares, with the
//        ${VAR} placeholder NAMES they reference (whitelist-extracted).
//
// SECRET DISCIPLINE (identical posture to connectorAdmin.js / env.js)
//   * A VALUE never leaves this module. We parse .env for line NAMES only and
//     never call readEnvKey() for content — only hasEnv() for a boolean.
//   * .mcp.json values are never echoed. From `env`/`headers` we extract ONLY
//     the `${NAME}` placeholder identifiers via a whitelist regex; a literal
//     value in those objects is dropped on the floor, never forwarded.
//   * A stdio server's command/args are shown so the user can recognise the
//     tool, with token-shaped args masked as defence in depth (see maskArg).
//   * An http server's URL is stripped of userinfo, query and fragment before
//     it is exposed — those are the only places a URL can hide a credential.
//
// NEVER THROWS. A missing/unreadable .env or .mcp.json degrades to an empty
// section, exactly like a not-connected connector — never a crash, never a 500.
//
// READ SCOPE: this module reads TWO files, both inside the myPKA root
// (REPO_ROOT). It never reaches into a global app config (e.g. Claude Desktop's
// claude_desktop_config.json), which lives outside the jail and may hold
// literal secrets.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './repoRoot.js';
import { ENV_PATH, hasEnv } from './connectors/env.js';
import { PROTECTED_KEYS } from './connectorAdmin.js';
import { describeRegistry, connectorsEnabled } from './connectors/registry.js';

const MCP_PATH = path.resolve(REPO_ROOT, '.mcp.json');

/** Repo-relative display paths — shown in the UI, never absolute (no home dir). */
const ENV_DISPLAY_PATH = 'Team Knowledge/.env';
const MCP_DISPLAY_PATH = '.mcp.json';

// An .env line name: the same SCREAMING_SNAKE shape connectorAdmin.js stores.
const ENV_LINE_RE = /^\s*([A-Z][A-Z0-9_]{2,63})\s*=/;

// A ${PLACEHOLDER} reference inside .mcp.json's env/headers. The capture group is
// the ONLY thing we ever read out of those objects.
const PLACEHOLDER_RE = /\$\{([A-Z0-9_]+)\}/g;

// Cockpit-operational variables that configure the cockpit itself rather than
// connecting a tool. PROTECTED_KEYS (connectorAdmin.js) is the SSOT for the ones
// the key-vault UI refuses to write; these are the remaining launch-time knobs
// documented in .env.example. Prefix rules cover the COCKPIT_*/VITE_* families.
const SYSTEM_KEYS = new Set(['CONNECTORS_ENABLED', 'MYPKA_ROOT', 'PORT']);

function isSystemKey(key) {
  return PROTECTED_KEYS.has(key)
    || SYSTEM_KEYS.has(key)
    || key.startsWith('COCKPIT_')
    || key.startsWith('VITE_');
}

/**
 * Every key NAME stored in Team Knowledge/.env, in file order, de-duplicated.
 * NAMES ONLY — this function never looks at the right-hand side of a line.
 *
 * Deliberately a SEPARATE function from connectorAdmin.js#listStoredKeyNames,
 * which filters down to "stored but not claimed by a connector" for the
 * Connections page. This tab needs the complete picture, so it must not inherit
 * that filter — and the Connections page must not inherit this one.
 */
export function listAllEnvKeyNames() {
  let raw = '';
  try {
    raw = fs.readFileSync(ENV_PATH, 'utf8');
  } catch {
    return []; // absent or unreadable — an empty section, never an error
  }
  const seen = new Set();
  const names = [];
  for (const line of raw.split('\n')) {
    const m = line.match(ENV_LINE_RE);
    if (!m || seen.has(m[1])) continue;
    seen.add(m[1]);
    names.push(m[1]);
  }
  return names;
}

/**
 * Env keys enriched with their role + which registered connector claims them.
 * Shape: { key, role, configured, connectors: [{id,label}], mcpRefs: [serverId] }
 *
 * `mcpRefs` is a pure NAME MATCH against .mcp.json's ${VAR} placeholders — it
 * says "a server in .mcp.json names this same variable", NOT "the MCP server
 * reads its value from Team Knowledge/.env". Those placeholders resolve in the
 * shell/launcher environment, which this server cannot inspect, so the UI must
 * present the match as an observation and never as a configured/verified state.
 */
function describeEnvKeys(mcpServers) {
  const mcpRefsFor = new Map(); // key name -> [server id]
  for (const s of mcpServers) {
    for (const name of s.envRefs) {
      if (!mcpRefsFor.has(name)) mcpRefsFor.set(name, []);
      mcpRefsFor.get(name).push(s.id);
    }
  }

  // describeRegistry() is itself secret-free (names + booleans). It returns [] while
  // the master gate (CONNECTORS_ENABLED=1) is off — the response carries that flag
  // so the UI can say "gate off" instead of implying nothing is wired.
  const claimedBy = new Map(); // key name -> [{ id, label }]
  for (const c of describeRegistry()) {
    for (const k of c.keys) {
      if (!claimedBy.has(k.key)) claimedBy.set(k.key, []);
      claimedBy.get(k.key).push({ id: c.id, label: c.label });
    }
  }
  return listAllEnvKeyNames().map((key) => {
    const connectors = claimedBy.get(key) ?? [];
    return {
      key,
      role: connectors.length ? 'connector' : isSystemKey(key) ? 'system' : 'unlinked',
      configured: hasEnv(key), // boolean only — the value is never read out
      connectors,
      mcpRefs: mcpRefsFor.get(key) ?? [],
    };
  });
}

/**
 * Mask an mcp arg that LOOKS like a bare credential. .mcp.json is supposed to use
 * ${VAR} placeholders (this repo's does), but this module must stay safe for a
 * hand-edited file too: a long unbroken token-shaped word is never something a
 * user needs to read on a dashboard, so it renders as dots. Package names,
 * flags, paths and versions all keep their `/`, `.`, `@` or short length and
 * pass through untouched.
 */
function maskArg(arg) {
  const s = String(arg);
  if (s.includes('${')) return s;                 // an explicit placeholder — safe
  if (/^[A-Za-z0-9_-]{24,}$/.test(s)) return '••••';
  // --flag=<long-opaque-value> → keep the flag, mask the value.
  return s.replace(/^(--?[A-Za-z0-9-]+=)([A-Za-z0-9_-]{16,})$/, (_m, flag) => `${flag}••••`);
}

/**
 * Strip everything a URL can hide a credential in (userinfo, query, fragment),
 * keeping the part a human recognises. Returns null for a non-http(s) or
 * unparseable URL rather than echoing an unknown string.
 */
function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const u = new URL(value.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return { display: `${u.origin}${u.pathname}`.replace(/\/$/, '') || u.origin, origin: u.origin };
  } catch {
    return null;
  }
}

/** Placeholder NAMES referenced anywhere in the given objects. Names only. */
function placeholderNames(...objects) {
  const out = new Set();
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue;
    let serialized = '';
    try {
      serialized = JSON.stringify(obj);
    } catch {
      continue; // exotic/cyclic value — skip it rather than risk echoing anything
    }
    for (const m of serialized.matchAll(PLACEHOLDER_RE)) out.add(m[1]);
  }
  return [...out].sort().slice(0, 20);
}

const MAX_SERVERS = 50;
const MAX_ARGS = 12;

/**
 * The MCP servers declared in <repo root>/.mcp.json.
 * Returns { available, servers } — `available: false` means the file is absent
 * or unreadable, which renders as a calm empty section (never an error).
 */
export function describeMcpServers() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(MCP_PATH, 'utf8'));
  } catch {
    return { available: false, servers: [] };
  }
  const map = parsed && typeof parsed === 'object' ? parsed.mcpServers : null;
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    return { available: false, servers: [] };
  }

  const servers = [];
  for (const [id, cfg] of Object.entries(map).slice(0, MAX_SERVERS)) {
    if (!cfg || typeof cfg !== 'object') continue;
    const envRefs = placeholderNames(cfg.env, cfg.headers);

    const declared = typeof cfg.type === 'string' ? cfg.type.toLowerCase() : '';
    if (declared === 'http' || declared === 'sse') {
      const url = safeUrl(cfg.url);
      servers.push({
        id: String(id).slice(0, 64),
        transport: declared,
        target: url ? url.display : '',
        // The tool's own origin — the only deep link derivable from this file
        // without inventing a name→URL table. Null when the URL isn't http(s).
        link: url ? url.origin : null,
        envRefs,
      });
      continue;
    }

    // Everything else is a locally spawned (stdio) server.
    const command = typeof cfg.command === 'string' ? cfg.command.trim() : '';
    const args = Array.isArray(cfg.args) ? cfg.args.slice(0, MAX_ARGS).map(maskArg) : [];
    servers.push({
      id: String(id).slice(0, 64),
      transport: 'stdio',
      target: [command, ...args].filter(Boolean).join(' ').slice(0, 200),
      link: null,
      envRefs,
    });
  }
  return { available: true, servers };
}

/**
 * The whole tab in one read. Secret-free BY CONSTRUCTION: every field is a name,
 * a boolean, a transport label, or a sanitised path/URL. Never throws.
 */
export function describeStack() {
  const mcp = describeMcpServers();
  return {
    envPath: ENV_DISPLAY_PATH,
    mcpPath: MCP_DISPLAY_PATH,
    connectorsEnabled: connectorsEnabled(),
    envKeys: describeEnvKeys(mcp.servers),
    mcp,
  };
}

export { MCP_PATH };
