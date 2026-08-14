---
# Identity
id: tsk-2026-08-08-001
title: "Vanilla-scaffold-laag opschonen van oude teamnamen (Larry/Nolan/Pax/Mack/Silas/Iris)"

# Ownership & priority
assignee: Hermes
priority: 4

# Status (mirrors folder location)
status: done
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-08T00:00:00Z
updated: 2026-08-12T00:00:00Z
due: null

# Provenance
created_by: Hermes
source: manual
parent: null

# Cross-references
linked_sops:
  - SOP-001-how-to-add-a-new-specialist
  - SOP-create-task
linked_workstreams: []
linked_guidelines:
  - GL-001-file-naming-conventions
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags:
  - librarian
  - naamgeving
  - terminal-sessie
---

# Vanilla-scaffold-laag opschonen van oude teamnamen

## What this is

Sander merkte op (2026-08-08) dat er nog verwijzingen naar "Larry" (de oude
naam voor Hermes) in de repo staan. Uitgezocht: de 5 actief-gebruikte
bestanden (`CLAUDE.md`, `.claude/agents/jethro.md`, `pixel.md`, `penn.md`,
`charta.md`) zijn dezelfde sessie al gefixt — die bevatten ook nog "Nolan"
(→ Jethro), "Pax" (→ Athena), "Mack" (→ Daedalus) en "Iris" (→ Harmonia)
naast "Larry" (→ Hermes), allemaal vervangen.

Wat overblijft is de bredere vanilla-scaffold-documentatielaag die de
originele basis-zes (Larry, Nolan, Pax, Penn, Mack, Silas) nog bij naam
noemt: `README.md`, `github/README.md`, `ADAPTER-PROMPT.md`,
`CHANGELOG-MIGRATION.md`, `WAY-FORWARD.md`,
`Expansions/docs/expansion-spec.md`, en de `Team Knowledge/SOPs/SOP-001`
(en mogelijk SOP-004, SOP-create-task, SOP-close-task, SOP-list-open-tasks,
SOP-write-session-log, SOP-claim-task, SOP-rebuild-task-index,
SOP-read-own-journal, diverse INDEX.md-bestanden) en
`Team Knowledge/Workstreams/WS-002` t/m `WS-006`.

Bij de vorige opschoonklus (`tsk-2026-07-02-001`, PKM-laag) is deze
scaffold-laag bewust buiten scope gehouden ("scaffold-templatebestanden
blijven bewust ongewijzigd"). Nu blijkt dat sommige van deze bestanden
(zoals SOP-001, dat Jethro effectief als operating contract leest) toch
actief in gebruik zijn — niet louter marketing-tekst over het
basisproduct. Elke treffer moet dus individueel beoordeeld worden:
- **Bewust generiek scaffold-referentiepunt** (bijv. README.md's
  productbeschrijving van "de basis-zes") → met opzet ongewijzigd laten.
- **Actief geraadpleegde instructie/SOP-tekst** die per ongeluk nog de
  oude naam gebruikt → hernoemen naar de huidige naam
  (Larry→Hermes, Nolan→Jethro, Pax→Athena, Mack→Daedalus, Silas→Atlas,
  Iris→Harmonia, Felix→Bezalel, Vex→Argus, Vera→Nemesis).

Geen blinde zoek-vervang: eerst per bestand vaststellen in welke categorie
het valt.

**Expliciete gebruikersvoorkeur:** dit soort grotere/langere opschoonklus
(meerdere bestanden, individuele beoordeling nodig) bewaart Sander voor
een sessie waarin hij echt in Claude Code/terminal werkt, niet in
Cowork/desktop-app.

## Context one click away

- [[SOP-001-how-to-add-a-new-specialist]] — kandidaat voor hernoeming, ook zelf de bron van de "basis-zes ship pre-hired"-conventie
- [[GL-001-file-naming-conventions]]
- Vorige klus: `Team Knowledge/tasks/done/2026/07/tsk-2026-07-02-001-pkm-oude-teamnamen-opruimen.md` — bevat de volledige oud→nieuw naam-mapping en de precedent-afweging tussen "scaffold-artefact" en "actieve instructie"
- Birthed in: sessie 2026-08-08 (Sander signaleerde resterende "Larry"-verwijzingen; de 5 actieve bugbestanden zijn in diezelfde sessie al gefixt)

## Success criteria

- Elke prose-vermelding van Larry/Nolan/Pax/Mack/Silas/Iris/Felix/Vex/Vera
  buiten `PKM/` (al gedaan) en buiten de 5 al-gefixte agent-bestanden is
  individueel beoordeeld: hernoemd, of bevestigd als bewust
  scaffold-referentiepunt / false positive (andere naam/woord).
- Geen wijzigingen aan historische session-logs of Deliverables-transcripties.

## Outcome

What shipped: alle resterende levende oude-naam-referenties (Larry/Nolan/Pax/Mack/Silas/Iris/Felix/Vex/Vera)
individueel beoordeeld en waar terecht hernoemd, in één pass — geen stukjeswerk meer. Dit gebeurde na
`tsk-2026-08-08-002` (de 6-maands sessielog-audit), die "team-rename cleanup incomplete" als terugkerende
onafgeronde draad had blootgelegd; Sander koos expliciet optie B ("rond nu in één keer af").

In deze pass gefixt (bovenop wat al eerder in de sessie was gedaan): alle 6 resterende
`.claude/agents/*.md`-shims (argus, atlas, bezalel, athena, daedalus, nemesis), `SOP-001`, `SOP-004`,
`SOP-002`, `SOP-005`, `SOP-009`, `SOP-010`, `SOP-011`, `SOP-012`, alle 6 `Workstreams/WS-00{1..6}`,
`SOPs/INDEX.md`, `Workstreams/INDEX.md`, `Team/Jethro - HR/AGENTS.md` (stale bestandsverwijzing
`silas.md` → `atlas.md`, want silas.md bestaat niet meer), `GL-002`, `GL-005`, en de volledige
`Expansions/mypka-cockpit/`-engineeringdocumentatie.

Bevestigd bewust buiten scope (individueel beoordeeld, niet aangeraakt): `GL-015` (bewuste
"Nieuwe naam (Oude naam)"-mappingtabel), historische `Deliverables/*.md` en `Deliverables/Audio-opname *.md`
(gedateerde point-in-time documenten, append-only zoals sessielogs), verbatim YouTube-transcripties in
`PKM/Documents/YouTube-Kennis/ICOR met Tom AI Productivity/` (citaat van de bronmaker, niet Sanders content),
losse persoonsnaam-overlaps (`iris landeweer` in ADC-verslagen, `Larry` in `verbouwing-huismanstraat-34.md`),
twee bewuste provenance-verwijzingen in `Team/Athena - Researcher/AGENTS.md`, en de al eerder bevestigde
scaffold-templatebestanden (`README.md`, `WAY-FORWARD.md`, `CHANGELOG.md`, `ADAPTER-PROMPT.md`,
`Expansions/docs/expansion-spec.md`, de illustratieve worked-examples in de task-SOP's).

Where it lives: [[Team Knowledge/INDEX.md]] (entry 2026-08-12), repo-brede commit met alle bestandswijzigingen.

Follow-ups: none.

Lessons: de 2026-07-02 pass markeerde zichzelf als compleet terwijl WS-001 en andere bestanden nog treffers
hadden — bevestigt het sessielog-audit-patroon "fixes die niet beklijfden." Reden hier: de vorige pass
beoordeelde per categorie ("scaffold vs actief"), maar checkte niet exhaustief elk bestand binnen de
"actief"-categorie. Deze pass deed een volledige repo-brede grep-sweep vooraf én achteraf ter verificatie,
in plaats van te vertrouwen op de eerder opgestelde bestandslijst.

## Updates

- 2026-08-08 (Hermes) — aangemaakt, na het fixen van de 5 actieve
  bugbestanden (CLAUDE.md + 4 agent-shims) in dezelfde sessie.
- 2026-08-12 (Hermes) — done: teamnaam-opschoning in één pass afgerond, repo-brede grep bevestigt 0
  resterende treffers buiten bevestigde uitzonderingen.
