-- Machine-local, secret-free integration observations. Canonical intent stays
-- in GL-018; this database contains only derived runtime evidence.
CREATE TABLE IF NOT EXISTS integration_machine (
  machine_id    TEXT PRIMARY KEY,
  label         TEXT NOT NULL,
  platform      TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS integration_observation (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  integration_id  TEXT NOT NULL,
  machine_id      TEXT NOT NULL REFERENCES integration_machine(machine_id) ON DELETE CASCADE,
  probe_id        TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('pass','warn','fail','not_applicable','not_checked')),
  checked_at      TEXT NOT NULL,
  duration_ms     INTEGER NOT NULL CHECK (duration_ms >= 0 AND duration_ms <= 120000),
  evidence_code   TEXT NOT NULL,
  error_category  TEXT,
  profile_version INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_integration_observation_latest
ON integration_observation(integration_id, machine_id, probe_id, checked_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_integration_observation_history
ON integration_observation(integration_id, machine_id, checked_at DESC, id DESC);
