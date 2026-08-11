// Strict, read-only parser for GL-018's marked JSON block. Markdown is the SSOT;
// no executable YAML tags or dynamic paths are accepted.
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './repoRoot.js';

export const INTEGRATION_REGISTER_PATH = path.resolve(
  REPO_ROOT,
  'Team Knowledge/Guidelines/GL-018-integratie-en-software-register.md',
);

const START = '<!-- integration-register:start -->';
const END = '<!-- integration-register:end -->';
const KINDS = new Set(['mcp', 'api', 'webhook', 'data-source', 'software']);
const LIFECYCLES = new Set(['idea', 'planned', 'configured', 'active', 'paused', 'retired']);
const COSTS = new Set(['free', 'paid', 'lifetime', 'included', 'usage-based', 'unknown']);
const DATA_ROLES = new Set(['source', 'destination', 'processor', 'presentation', 'vault']);
const SYNC_DIRECTIONS = new Set(['none', 'import', 'export', 'bidirectional']);
const CONFLICT_POLICIES = new Set(['canonical-wins', 'manual-review']);
const PROBES = new Set([
  'config-present', 'secret-present', 'mcp-registration', 'connector-readonly',
  'process-health', 'manual',
]);
const ID_RE = /^[a-z][a-z0-9-]{1,63}$/;
const SECRET_NAME_RE = /^[A-Z][A-Z0-9_]{2,63}$/;

function string(value, field, max = 500) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new Error(`invalid-${field}`);
  }
  return value.trim();
}

function strings(value, field, { maxItems = 20, pattern = null } = {}) {
  if (!Array.isArray(value) || value.length > maxItems) throw new Error(`invalid-${field}`);
  return value.map((item) => {
    const out = string(item, field, 128);
    if (pattern && !pattern.test(out)) throw new Error(`invalid-${field}`);
    return out;
  });
}

export function validateIntegration(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('invalid-record');
  const integrationId = string(raw.integration_id, 'integration-id', 64);
  if (!ID_RE.test(integrationId)) throw new Error('invalid-integration-id');
  if (!KINDS.has(raw.kind)) throw new Error('invalid-kind');
  if (!LIFECYCLES.has(raw.lifecycle)) throw new Error('invalid-lifecycle');
  if (!COSTS.has(raw.cost_model)) throw new Error('invalid-cost-model');
  if (!DATA_ROLES.has(raw.data_role)) throw new Error('invalid-data-role');
  if (!SYNC_DIRECTIONS.has(raw.sync_direction)) throw new Error('invalid-sync-direction');
  if (!CONFLICT_POLICIES.has(raw.conflict_policy)) throw new Error('invalid-conflict-policy');
  const profile = strings(raw.verification_profile, 'verification-profile');
  if (profile.some((probe) => !PROBES.has(probe))) throw new Error('invalid-verification-profile');

  return Object.freeze({
    integrationId,
    name: string(raw.name, 'name', 120),
    kind: raw.kind,
    purpose: string(raw.purpose, 'purpose'),
    lifecycle: raw.lifecycle,
    owner: string(raw.owner, 'owner', 64),
    expectedDevices: strings(raw.expected_devices, 'expected-devices'),
    expectedRuntimes: strings(raw.expected_runtimes, 'expected-runtimes'),
    authMethod: string(raw.auth_method, 'auth-method', 64),
    secretNames: strings(raw.secret_names, 'secret-names', { pattern: SECRET_NAME_RE }),
    costModel: raw.cost_model,
    dataRole: raw.data_role,
    syncDirection: raw.sync_direction,
    canonicalRecords: strings(raw.canonical_records, 'canonical-records', { pattern: ID_RE }),
    adapterRefs: strings(raw.adapter_refs, 'adapter-refs'),
    conflictPolicy: raw.conflict_policy,
    verificationProfile: profile,
    dependencies: strings(raw.dependencies, 'dependencies', { pattern: ID_RE }),
    canonicalReference: string(raw.canonical_reference, 'canonical-reference', 160),
    nextAction: string(raw.next_action, 'next-action'),
  });
}

export function parseIntegrationRegistryText(markdown) {
  if (typeof markdown !== 'string') throw new Error('invalid-register-text');
  const start = markdown.indexOf(START);
  const end = markdown.indexOf(END);
  if (start < 0 || end <= start) throw new Error('register-markers-missing');
  const region = markdown.slice(start + START.length, end);
  const match = region.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error('register-json-block-missing');
  let parsed;
  try { parsed = JSON.parse(match[1]); } catch { throw new Error('register-json-invalid'); }
  if (parsed?.schema_version !== 2 || !Array.isArray(parsed.integrations)) {
    throw new Error('register-schema-invalid');
  }
  const integrations = parsed.integrations.map(validateIntegration);
  const ids = new Set();
  for (const item of integrations) {
    if (ids.has(item.integrationId)) throw new Error(`duplicate-integration-id:${item.integrationId}`);
    ids.add(item.integrationId);
  }
  for (const item of integrations) {
    for (const dependency of item.dependencies) {
      if (!ids.has(dependency)) throw new Error(`unknown-dependency:${dependency}`);
    }
    if (item.canonicalRecords.length && item.dataRole !== 'source') {
      throw new Error(`canonical-records-require-source:${item.integrationId}`);
    }
    if (item.dataRole === 'source' && !['import', 'bidirectional'].includes(item.syncDirection)) {
      throw new Error(`source-requires-import:${item.integrationId}`);
    }
    if (item.syncDirection === 'bidirectional' && item.conflictPolicy !== 'manual-review') {
      throw new Error(`bidirectional-requires-manual-review:${item.integrationId}`);
    }
  }
  const recordOwners = new Map();
  for (const item of integrations) for (const record of item.canonicalRecords) {
    if (recordOwners.has(record)) throw new Error(`duplicate-canonical-record:${record}`);
    recordOwners.set(record, item.integrationId);
  }
  return Object.freeze({ schemaVersion: 2, integrations: Object.freeze(integrations) });
}

export function loadIntegrationRegistry() {
  return parseIntegrationRegistryText(fs.readFileSync(INTEGRATION_REGISTER_PATH, 'utf8'));
}
