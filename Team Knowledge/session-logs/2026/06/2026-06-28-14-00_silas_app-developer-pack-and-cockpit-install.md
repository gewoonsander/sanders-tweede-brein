---
agent_id: silas
session_id: 2026-06-28-app-developer-pack-cockpit
timestamp: 2026-06-28T14:00:00Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# App Developer Pack (Felix, Vex, Vera) installed; Cockpit UI folder placed

## What I did

### App Developer Pack

Installed Felix (Frontend Developer), Vex (Security Engineer), and Vera (QA Specialist) from the scaffold at `/Users/sandervanockenburg-zwaan/Downloads/mypka-scaffold-latest/`.

Files written — all new, no overwrites:

**Agent shims** (`.claude/agents/`):
- `felix.md`
- `vex.md`
- `vera.md`

**SOPs** (`Team Knowledge/SOPs/`):
- `SOP-003-felix-build-a-component.md`
- `SOP-004-vex-security-audit.md`
- `SOP-005-vera-quality-gate.md`

**Team folders** (each with `journal/` and `_template.md` + `README.md`):
- `Team/Felix - Frontend Developer/`
- `Team/Vex - Security Engineer/`
- `Team/Vera - QA Specialist/`

**AGENTS.md** — team table updated: "9 specialists" → "12 specialists"; Felix, Vex, Vera rows added.

**Team Knowledge/SOPs/INDEX.md** — SOP-003/004/005 rows added; reserved-slots note updated (next free: SOP-011+).

### Cockpit UI

Copied `Expansions/mypka-cockpit/` from scaffold into `Expansions/mypka-cockpit/` in the myPKA. Cockpit version: 1.2.1.

**The Cockpit is NOT yet active.** INSTALL.md mandates a multi-step consent/backup/SQLite/launcher flow that requires explicit user approval at each gate. The folder is in place; a full WS-003 install run is the next step.

## What the Cockpit needs to go live

1. User reads `DISCLAIMER.md` and says "yes, proceed" (Step 0 — consent gate).
2. Git backup confirmed (Step 1).
3. `detect-gaps.py` run against `mypka.db` to report which modules will be empty (Step 3).
4. User approves SQLite upgrade: `install-extensions.py` (Step 4) — requires Python 3 + PyYAML.
5. Launcher generated per OS from `launcher/GENERATE-LAUNCHER.md` (Step 5).
6. `npm run install:all && npm run build` (Step 6) — requires Node.js v20+.
7. User double-clicks the launcher; cockpit binds `127.0.0.1:4317`.

Prerequisites: Node.js v20+, Python 3, `pip3 install --user pyyaml`.

## Anomalies / notes

- The scaffold's SOPs INDEX had SOP-003/004/005 listed as "Reserved (genuinely open for future agents)" — the App Developer Pack is exactly the intended fill for those slots. No number conflict.
- The Cockpit `expansion.yaml` lists `requires_agents: [Larry, Mack, Silas]` — all three are present.
- No existing files were overwritten; conflict policy: skip (nothing to skip — all targets were new).
