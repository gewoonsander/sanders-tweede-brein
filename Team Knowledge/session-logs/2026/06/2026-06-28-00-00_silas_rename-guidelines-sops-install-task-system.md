---
agent_id: silas
session_id: rename-guidelines-sops-install-task-system
timestamp: 2026-06-28T00:00:00Z
type: end-of-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-004-task-resource-linking"]
---

# Taak 1 + 2: Custom GL/SOP hernummering + Taaksysteem v1.10.0 installatie

## Wat ik deed

### Taak 1 — Hernummering (conflictvrijmaking)

Hernoemd om ruimte te maken voor scaffold-nummers GL-003 en GL-004:

- `GL-003-pka-modeling-principles.md` → `GL-010-pka-modeling-principles.md`
- `GL-004-contactenbeheer.md` → `GL-011-contactenbeheer.md`
- `GL-005-pkm-vs-todoist.md` → `GL-012-pkm-vs-todoist.md`
- `SOP-003-adc-inschrijvingen-opvragen.md` → `SOP-010-adc-inschrijvingen-opvragen.md`

Wikilinks bijgewerkt in 8 bestanden:
- `PKM/My Life/mission.md` — GL-003 → GL-010
- `PKM/My Life/Topics/adc.md` — SOP-003 → SOP-010
- `Team Knowledge/SOPs/INDEX.md` — SOP-003 → SOP-010, reserved-slot tekst bijgewerkt
- `Team Knowledge/Guidelines/INDEX.md` — GL-004/GL-005 → GL-011/GL-012, GL-010 toegevoegd, GL-004 task-resource-linking toegevoegd
- `Team Knowledge/Workstreams/WS-004-facebook-toernooi-verslag.md` — SOP-003 → SOP-010 (3 occurrences)
- `Team Knowledge/Workstreams/INDEX.md` — SOP-003 → SOP-010
- `Team Knowledge/session-logs/2026/06/2026-06-21-11-44_larry_...md` — frontmatter SOP-003 → SOP-010
- `Team Knowledge/session-logs/2026/06/2026-06-21-00-14_larry_...md` — frontmatter + body SOP-003 → SOP-010 (2 occurrences)

### Taak 2 — Taaksysteem v1.10.0 installatie

**Overgeslagen (al aanwezig):**
- `Team Knowledge/tasks/open/` — bestond al
- `Team Knowledge/tasks/in-progress/` — bestond al
- `Team Knowledge/tasks/done/` — bestond al
- `Team Knowledge/tasks/cancelled/` — bestond al
- `Team Knowledge/tasks/INDEX.md` — bestond al (rijkere versie dan template)
- Alle 8 task-SOPs — bestonden al in `Team Knowledge/SOPs/`
- Alle 6 journal-mappen (`Team/<Agent>/journal/`) — bestonden al
- `Team discipline` blok in 5 van 6 AGENTS.md-bestanden — bestond al

**Aangemaakt:**
- `Team Knowledge/tasks/templates/` (map)
- 6x `Team/<Agent>/journal/README.md`
- `Team Knowledge/Guidelines/GL-004-task-resource-linking.md` (gekopieerd van scaffold)
- Task discipline sectie toegevoegd aan `Team/Larry - Orchestrator/AGENTS.md` (enige ontbrekende)

## Anomalieën

- GL-003 is nu vrij voor het Designer Expansion Pack (design-system guideline). GL-010/011/012 zijn de custom-nummers voor Sander's eigen guidelines.
- SOP-003 is nu vrij. SOP-004–009 ook. SOP-010 is de ADC-SOP.
- `Team Knowledge/tasks/INDEX.md` had al een rijkere inhoud dan de minimale template — niet overschreven.
