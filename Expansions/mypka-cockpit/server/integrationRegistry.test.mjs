import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  INTEGRATION_REGISTER_PATH, loadIntegrationRegistry, parseIntegrationRegistryText,
} from './integrationRegistry.js';

function doc(data) {
  return `# x\n<!-- integration-register:start -->\n\`\`\`json\n${JSON.stringify(data)}\n\`\`\`\n<!-- integration-register:end -->\n`;
}

const valid = {
  schema_version: 2,
  integrations: [{
    integration_id: 'example-api', name: 'Example', kind: 'api', purpose: 'Test only.',
    lifecycle: 'planned', owner: 'daedalus', expected_devices: [], expected_runtimes: [],
    auth_method: 'none', secret_names: [], cost_model: 'free',
    data_role: 'source', sync_direction: 'import', canonical_records: ['example-records'],
    adapter_refs: [], conflict_policy: 'canonical-wins',
    verification_profile: ['manual'], dependencies: [], canonical_reference: 'example',
    next_action: 'Verify manually.',
  }],
};

test('loads the canonical GL-018 register', () => {
  assert.ok(fs.existsSync(INTEGRATION_REGISTER_PATH));
  const registry = loadIntegrationRegistry();
  assert.equal(registry.schemaVersion, 2);
  assert.ok(registry.integrations.length >= 10);
  assert.equal(new Set(registry.integrations.map((x) => x.integrationId)).size, registry.integrations.length);
});

test('rejects duplicate integration ids', () => {
  const data = structuredClone(valid);
  data.integrations.push(structuredClone(data.integrations[0]));
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /duplicate-integration-id/);
});

test('rejects an unknown probe', () => {
  const data = structuredClone(valid);
  data.integrations[0].verification_profile = ['shell-anything'];
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /invalid-verification-profile/);
});

test('rejects secret values and malformed names in secret_names', () => {
  const data = structuredClone(valid);
  data.integrations[0].secret_names = ['not-a-variable-name'];
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /invalid-secret-names/);
});

test('rejects dependencies outside the register', () => {
  const data = structuredClone(valid);
  data.integrations[0].dependencies = ['missing-service'];
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /unknown-dependency/);
});

test('rejects ambiguous bidirectional ownership metadata', () => {
  const data = structuredClone(valid);
  data.integrations[0].conflict_policy = 'last-write-wins';
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /invalid-conflict-policy/);
});

test('rejects duplicate canonical record ownership', () => {
  const data = structuredClone(valid);
  const second = structuredClone(data.integrations[0]);
  second.integration_id = 'second-api';
  data.integrations.push(second);
  assert.throws(() => parseIntegrationRegistryText(doc(data)), /duplicate-canonical-record/);
});
