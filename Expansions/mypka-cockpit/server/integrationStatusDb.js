import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './plannerDb.js'; // applies ordered migrations before this connection opens

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const INTEGRATION_DB_PATH = path.resolve(__dirname, '..', 'mypka-cockpit.db');
const STATUS = new Set(['pass', 'warn', 'fail', 'not_applicable', 'not_checked']);
const SAFE_CODE = /^[a-z0-9][a-z0-9:_-]{0,79}$/;

function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function boundedCode(value, field, nullable = false) {
  if (nullable && (value == null || value === '')) return null;
  if (typeof value !== 'string' || !SAFE_CODE.test(value)) throw new Error(`invalid-${field}`);
  return value;
}

export function localMachine() {
  const raw = `${os.platform()}\0${os.hostname()}`;
  return {
    machineId: crypto.createHash('sha256').update(raw).digest('hex').slice(0, 20),
    label: String(process.env.MYPKA_DEVICE_LABEL || os.hostname() || 'this-device').slice(0, 80),
    platform: String(os.platform()).slice(0, 32),
  };
}

export function createIntegrationStatusStore(db) {
  db.pragma('foreign_keys = ON');
  const upsertMachine = db.prepare(`
    INSERT INTO integration_machine(machine_id,label,platform,first_seen_at,last_seen_at)
    VALUES (@machineId,@label,@platform,@now,@now)
    ON CONFLICT(machine_id) DO UPDATE SET
      label=excluded.label, platform=excluded.platform, last_seen_at=excluded.last_seen_at
  `);
  const insertObservation = db.prepare(`
    INSERT INTO integration_observation(
      integration_id,machine_id,probe_id,status,checked_at,duration_ms,
      evidence_code,error_category,profile_version
    ) VALUES (
      @integrationId,@machineId,@probeId,@status,@checkedAt,@durationMs,
      @evidenceCode,@errorCategory,@profileVersion
    )
  `);
  const latest = db.prepare(`
    SELECT o.* FROM integration_observation o
    JOIN (
      SELECT integration_id, machine_id, probe_id, MAX(id) AS max_id
      FROM integration_observation GROUP BY integration_id, machine_id, probe_id
    ) x ON x.max_id=o.id
    WHERE o.machine_id=? ORDER BY o.integration_id, o.probe_id
  `);
  const history = db.prepare(`
    SELECT integration_id,machine_id,probe_id,status,checked_at,duration_ms,
           evidence_code,error_category,profile_version
    FROM integration_observation
    WHERE integration_id=? AND machine_id=?
    ORDER BY checked_at DESC,id DESC LIMIT ?
  `);
  const prune = db.prepare(`
    DELETE FROM integration_observation WHERE id IN (
      SELECT id FROM integration_observation
      WHERE integration_id=@integrationId AND machine_id=@machineId AND probe_id=@probeId
      ORDER BY checked_at DESC,id DESC LIMIT -1 OFFSET 100
    )
  `);

  function record(input) {
    const machine = input.machine || localMachine();
    const status = input.status;
    if (!STATUS.has(status)) throw new Error('invalid-status');
    const row = {
      integrationId: boundedCode(input.integrationId, 'integration-id'),
      machineId: boundedCode(machine.machineId, 'machine-id'),
      probeId: boundedCode(input.probeId, 'probe-id'),
      status,
      checkedAt: input.checkedAt || nowIso(),
      durationMs: Math.max(0, Math.min(120000, Math.round(Number(input.durationMs) || 0))),
      evidenceCode: boundedCode(input.evidenceCode, 'evidence-code'),
      errorCategory: boundedCode(input.errorCategory, 'error-category', true),
      profileVersion: Number.isInteger(input.profileVersion) ? input.profileVersion : 1,
    };
    const tx = db.transaction(() => {
      const now = nowIso();
      upsertMachine.run({ ...machine, now });
      insertObservation.run(row);
      prune.run(row);
    });
    tx();
    return row;
  }

  return {
    record,
    latestForMachine(machineId) { return latest.all(machineId); },
    history(integrationId, machineId, limit = 50) {
      return history.all(integrationId, machineId, Math.max(1, Math.min(100, Number(limit) || 50)));
    },
  };
}

const db = new Database(INTEGRATION_DB_PATH);
db.pragma('journal_mode = WAL');
export const integrationStatusStore = createIntegrationStatusStore(db);
