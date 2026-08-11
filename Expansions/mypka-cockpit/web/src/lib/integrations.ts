export type IntegrationKind = 'mcp' | 'api' | 'webhook' | 'data-source' | 'software';
export type OverallStatus = 'working' | 'action_needed' | 'broken' | 'planned' | 'not_checked' | 'paused' | 'retired';

export interface IntegrationObservation {
  integration_id: string;
  machine_id: string;
  probe_id: string;
  status: 'pass' | 'warn' | 'fail' | 'not_applicable' | 'not_checked';
  checked_at: string;
  duration_ms: number;
  evidence_code: string;
  error_category: string | null;
  profile_version: number;
}

export interface IntegrationItem {
  integrationId: string;
  name: string;
  kind: IntegrationKind;
  purpose: string;
  lifecycle: string;
  owner: string;
  expectedDevices: string[];
  expectedRuntimes: string[];
  authMethod: string;
  secretNames: string[];
  costModel: string;
  dataRole: 'source' | 'destination' | 'processor' | 'presentation' | 'vault';
  syncDirection: 'none' | 'import' | 'export' | 'bidirectional';
  canonicalRecords: string[];
  adapterRefs: string[];
  conflictPolicy: 'canonical-wins' | 'manual-review';
  verificationProfile: string[];
  dependencies: string[];
  canonicalReference: string;
  nextAction: string;
  overallStatus: OverallStatus;
  observations: IntegrationObservation[];
}

export interface IntegrationsResponse {
  schemaVersion: number;
  machine: { machineId: string; label: string; platform: string };
  summary: Partial<Record<OverallStatus, number>>;
  integrations: IntegrationItem[];
}
