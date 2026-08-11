import { loadIntegrationRegistry } from './integrationRegistry.js';
import { checkIntegrations } from './integrationChecks.js';
import { integrationStatusStore, localMachine } from './integrationStatusDb.js';

const ID_RE = /^[a-z][a-z0-9-]{1,63}$/;

function overall(integration, rows) {
  if (integration.lifecycle === 'paused' || integration.lifecycle === 'retired') return integration.lifecycle;
  if (!rows.length) return integration.lifecycle === 'planned' || integration.lifecycle === 'idea'
    ? 'planned' : 'not_checked';
  if (rows.some((x) => x.status === 'fail')) return 'broken';
  if (rows.some((x) => x.status === 'warn' || x.status === 'not_checked')) return 'action_needed';
  return rows.every((x) => x.status === 'pass' || x.status === 'not_applicable') ? 'working' : 'not_checked';
}

export function getIntegrations() {
  const registry = loadIntegrationRegistry();
  const machine = localMachine();
  const latest = integrationStatusStore.latestForMachine(machine.machineId);
  const byId = new Map();
  for (const row of latest) {
    if (!byId.has(row.integration_id)) byId.set(row.integration_id, []);
    byId.get(row.integration_id).push(row);
  }
  const integrations = registry.integrations.map((item) => {
    const observations = byId.get(item.integrationId) || [];
    return { ...item, overallStatus: overall(item, observations), observations };
  });
  const summary = integrations.reduce((out, item) => {
    out[item.overallStatus] = (out[item.overallStatus] || 0) + 1;
    return out;
  }, {});
  return { schemaVersion: registry.schemaVersion, machine, summary, integrations };
}

export function getIntegrationHistory(id, limit) {
  if (!ID_RE.test(id || '')) throw new Error('invalid-integration-id');
  const registry = loadIntegrationRegistry();
  if (!registry.integrations.some((x) => x.integrationId === id)) throw new Error('unknown-integration');
  const machine = localMachine();
  return { machine, integrationId: id, observations: integrationStatusStore.history(id, machine.machineId, limit) };
}

export function runIntegrationChecks(body) {
  const integrationIds = body?.integrationIds;
  const probeIds = body?.probeIds;
  if (integrationIds != null && (!Array.isArray(integrationIds) || integrationIds.length > 50 || integrationIds.some((x) => !ID_RE.test(x)))) {
    throw new Error('invalid-integration-ids');
  }
  if (probeIds != null && (!Array.isArray(probeIds) || probeIds.length > 20 || probeIds.some((x) => !ID_RE.test(x)))) {
    throw new Error('invalid-probe-ids');
  }
  checkIntegrations({ integrationIds, probeIds });
  return getIntegrations();
}
