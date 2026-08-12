import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './repoRoot.js';
import { hasEnv } from './connectors/env.js';
import { loadIntegrationRegistry } from './integrationRegistry.js';
import { integrationStatusStore, localMachine } from './integrationStatusDb.js';

const MCP_PATH = path.resolve(REPO_ROOT, '.mcp.json');
const CONFIG_PATHS = new Map([
  ['mypka-cockpit', path.resolve(REPO_ROOT, 'Expansions/mypka-cockpit/package.json')],
  ['n8n-mcp', MCP_PATH],
  ['firecrawl-mcp', MCP_PATH],
]);

function mcpDeclared(id) {
  try {
    const parsed = JSON.parse(fs.readFileSync(MCP_PATH, 'utf8'));
    return Boolean(parsed?.mcpServers?.[id]);
  } catch { return false; }
}

function result(status, evidenceCode, errorCategory = null) {
  return { status, evidenceCode, errorCategory };
}

export function runPassiveProbe(integration, probeId) {
  if (!integration.verificationProfile.includes(probeId)) return result('not_applicable', 'probe-not-allowed');
  switch (probeId) {
    case 'config-present': {
      const target = CONFIG_PATHS.get(integration.integrationId);
      return target && fs.existsSync(target) ? result('pass', 'config-present') : result('fail', 'config-missing', 'configuration');
    }
    case 'secret-present': {
      if (!integration.secretNames.length) return result('not_applicable', 'no-secret-required');
      const present = integration.secretNames.every((name) => hasEnv(name));
      return present ? result('pass', 'secret-present') : result('fail', 'secret-missing', 'authentication');
    }
    case 'mcp-registration':
      return mcpDeclared(integration.integrationId)
        ? result('pass', 'mcp-declared') : result('fail', 'mcp-not-declared', 'configuration');
    case 'process-health':
      return integration.integrationId === 'mypka-cockpit'
        ? result('pass', 'current-process-active') : result('not_checked', 'process-probe-unavailable');
    case 'connector-readonly':
      return result('not_checked', 'manual-network-check-required');
    case 'manual':
      return result('not_checked', 'manual-verification-required');
    default:
      return result('not_applicable', 'unknown-probe');
  }
}

// A connector's `source` id (registry.js / catalog.json) → the GL-018 register's
// integration_id, for the connectors that have BOTH. A real, successful fetch
// through the connector is the "geldige probe" GL-018 requires to turn a
// `configured` integration `active` — it is read-only by the connector's own
// contract (types.js), so recording it here adds no new network behaviour, it
// just reports what already happened.
const CONNECTOR_INTEGRATION_MAP = {
  'todoist': 'todoist-api',
  'jortt:gewoon-sander': 'jortt-api',
  'n8n:workflows': 'n8n-public-api',
  'ical:primary': 'calendar-ical',
};

/**
 * Record a live connector fetch outcome as its integration's `connector-readonly`
 * observation, iff that connector id is mapped to a GL-018 integration. No-op for
 * every other source (custom keys, unmapped connectors) — never throws.
 */
export function recordConnectorProbe(sourceId, ok) {
  const integrationId = CONNECTOR_INTEGRATION_MAP[sourceId];
  if (!integrationId) return;
  try {
    integrationStatusStore.record({
      integrationId,
      machine: localMachine(),
      probeId: 'connector-readonly',
      status: ok ? 'pass' : 'fail',
      evidenceCode: ok ? 'live-fetch-ok' : 'live-fetch-failed',
      errorCategory: ok ? null : 'connectivity',
      profileVersion: 1,
    });
  } catch {
    // best-effort bookkeeping — a malformed/unknown row must never break the
    // agenda/sources read it is piggybacking on.
  }
}

export function checkIntegrations({ integrationIds = null, probeIds = null } = {}) {
  const { integrations } = loadIntegrationRegistry();
  const requested = integrationIds ? new Set(integrationIds) : null;
  const probes = probeIds ? new Set(probeIds) : null;
  if (requested) {
    const known = new Set(integrations.map((x) => x.integrationId));
    for (const id of requested) if (!known.has(id)) throw new Error(`unknown-integration:${id}`);
  }
  const machine = localMachine();
  const observations = [];
  for (const integration of integrations) {
    if (requested && !requested.has(integration.integrationId)) continue;
    for (const probeId of integration.verificationProfile) {
      if (probes && !probes.has(probeId)) continue;
      const started = performance.now();
      const out = runPassiveProbe(integration, probeId);
      observations.push(integrationStatusStore.record({
        integrationId: integration.integrationId,
        machine, probeId, ...out, durationMs: performance.now() - started,
      }));
    }
  }
  return { machine, observations };
}
