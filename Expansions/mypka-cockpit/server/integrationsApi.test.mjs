import test from 'node:test';
import assert from 'node:assert/strict';
import { getIntegrations, getIntegrationHistory, runIntegrationChecks, recordManualProbe } from './integrationsApi.js';

function keysDeep(value, out = []) {
  if (Array.isArray(value)) for (const item of value) keysDeep(item, out);
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) { out.push(key); keysDeep(item, out); }
  }
  return out;
}

test('integration inventory has summary, machine and unique records', () => {
  const data = getIntegrations();
  assert.equal(data.schemaVersion, 2);
  assert.ok(data.machine.machineId);
  assert.ok(data.integrations.length >= 10);
  assert.equal(new Set(data.integrations.map((x) => x.integrationId)).size, data.integrations.length);
});

test('passive check records bounded observations', () => {
  const data = runIntegrationChecks({ integrationIds: ['mypka-cockpit'] });
  const item = data.integrations.find((x) => x.integrationId === 'mypka-cockpit');
  assert.equal(item.overallStatus, 'working');
  assert.ok(item.observations.length >= 2);
});

test('unknown and malformed ids are rejected', () => {
  assert.throws(() => runIntegrationChecks({ integrationIds: ['not-in-register'] }), /unknown-integration/);
  assert.throws(() => runIntegrationChecks({ integrationIds: ['../../etc'] }), /invalid-integration-ids/);
  assert.throws(() => getIntegrationHistory('missing'), /unknown-integration/);
});

test('manual probe reports are scoped to integrations that declare the manual probe', () => {
  assert.throws(() => recordManualProbe({ integrationId: 'not-in-register', ok: true }), /unknown-integration/);
  assert.throws(() => recordManualProbe({ integrationId: 'todoist-api', ok: true }), /probe-not-allowed/);
  assert.throws(() => recordManualProbe({ integrationId: 'perplexity-api', ok: 'yes' }), /invalid-ok/);

  const data = recordManualProbe({ integrationId: 'perplexity-api', ok: true });
  const item = data.integrations.find((x) => x.integrationId === 'perplexity-api');
  assert.equal(item.overallStatus, 'working');
  assert.ok(item.observations.some((o) => o.probe_id === 'manual' && o.status === 'pass'));
});

test('API shapes never contain credential payload fields', () => {
  const keys = new Set(keysDeep(getIntegrations()).map((x) => x.toLowerCase()));
  for (const forbidden of ['token', 'secretvalue', 'authorization', 'headers', 'responsebody', 'password']) {
    assert.equal(keys.has(forbidden), false, `forbidden field: ${forbidden}`);
  }
});
