import test from 'node:test';
import assert from 'node:assert/strict';
import { loadIntegrationRegistry } from './integrationRegistry.js';
import { runPassiveProbe } from './integrationChecks.js';

const byId = new Map(loadIntegrationRegistry().integrations.map((x) => [x.integrationId, x]));

test('a probe outside the record allowlist never runs', () => {
  assert.deepEqual(runPassiveProbe(byId.get('lastpass'), 'config-present'), {
    status: 'not_applicable', evidenceCode: 'probe-not-allowed', errorCategory: null,
  });
});

test('cockpit config and process probes are passive and green', () => {
  assert.equal(runPassiveProbe(byId.get('mypka-cockpit'), 'config-present').status, 'pass');
  assert.equal(runPassiveProbe(byId.get('mypka-cockpit'), 'process-health').evidenceCode, 'current-process-active');
});

test('manual and network connector checks stay not_checked in v1', () => {
  assert.equal(runPassiveProbe(byId.get('formflow'), 'manual').status, 'not_checked');
  assert.equal(runPassiveProbe(byId.get('todoist-api'), 'connector-readonly').status, 'not_checked');
});

test('probe output contains bounded codes only', () => {
  for (const integration of byId.values()) for (const probe of integration.verificationProfile) {
    const out = runPassiveProbe(integration, probe);
    assert.match(out.evidenceCode, /^[a-z0-9][a-z0-9:_-]{0,79}$/);
    assert.ok(out.errorCategory == null || /^[a-z0-9][a-z0-9:_-]{0,79}$/.test(out.errorCategory));
    assert.equal(JSON.stringify(out).includes('Bearer '), false);
  }
});
