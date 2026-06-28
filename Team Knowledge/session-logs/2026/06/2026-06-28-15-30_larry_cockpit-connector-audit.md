---
agent_id: larry
session_id: cockpit-connector-audit
timestamp: 2026-06-28T15:30:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Cockpit Todoist connector audit — master gate bug found and fixed

## Context

Sander asked Larry to execute the `.assistant-request.md` in `Expansions/mypka-cockpit/`. The request was to wire connectors for two stored credential keys (`CONNECTORS_ENABLED`, `TODOIST_API_KEY`). The cockpit was reporting "no active connectors."

## What we did

- Larry read `server/connectors/README.md` (authoring contract), `catalog.json`, `todoistTasks.js`, `types.js`, `env.js`, `registry.js`, and `start-cockpit.command` to get a full picture.
- Determined that the Todoist connector was **already wired**: `todoistTasks.js` exists and the catalog entry is complete. No new module or catalog entry needed.
- Performed a full contract audit of `todoistTasks.js` against the README (read-only, assignedToMe, secrets by reference, never-throw, NormalizedTask shape, catalog completeness) — all passed.
- Identified one intentional divergence: `editableFields: ['due', 'priority']` vs the README template's `[]`. This is documented in the file header and allowed by `types.js`.
- **Found and fixed the root cause** why connectors weren't activating: `registry.js` read `CONNECTORS_ENABLED` directly from `process.env`, but the Connections UI stores it in `Team Knowledge/.env`, which is never loaded into the process environment at startup. The master gate was permanently closed.
- Fixed `registry.js`: imported `readEnvKey` alongside `hasEnv` and changed the gate check to `process.env.CONNECTORS_ENABLED === '1' || readEnvKey('CONNECTORS_ENABLED') === '1'`, so the .env vault path also activates the gate.
- Left Sander with the instruction to double-click `start-cockpit.command` to restart the cockpit and verify.

## Decisions made

- **Question:** How should `CONNECTORS_ENABLED` be read? **Decision:** Check both `process.env` (explicit shell env) and `Team Knowledge/.env` (vault path via `readEnvKey()`), consistent with how every other credential in the system resolves.

## Insights

- The `.env.example` lists `TODOIST_API_TOKEN` but the actual connector and catalog use `TODOIST_API_KEY`. Minor documentation mismatch; functional because the user stored `TODOIST_API_KEY` which the connector reads correctly. Worth noting if the example is ever updated.
- The master gate pattern (`CONNECTORS_ENABLED`) is subtly different from individual connector keys: it was designed to be set in shell env, not the vault. This tension is worth fixing at the source (as done), not by patching the startup script.

## Realignments

- _(none this session)_

## Open threads

- [ ] Sander still needs to restart the cockpit (double-click `start-cockpit.command`) and verify `GET /api/cockpit/agenda` shows Todoist tasks.

## Next steps

- Restart the cockpit and confirm the Todoist connector appears in the Connections page as "configured" and that tasks show up on the planner board.

## Cross-links

- `[[2026-06-28-14-00_silas_app-developer-pack-and-cockpit-install]]` — prior session that scaffolded and installed the cockpit
