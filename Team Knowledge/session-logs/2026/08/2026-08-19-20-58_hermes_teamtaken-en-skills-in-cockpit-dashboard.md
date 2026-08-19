---
agent_id: hermes
session_id: teamtaken-en-skills-in-cockpit-dashboard
timestamp: 2026-08-19T18:58:00Z
type: close-session
linked_sops: ["SOP-development-workflow", "SOP-005-nemesis-quality-gate", "SOP-close-task", "SOP-rebuild-task-index"]
linked_workstreams: []
linked_guidelines: ["GL-003-design-system", "GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Teamtaken en Skills zichtbaar maken in het myPKA Cockpit-dashboard

## Context

Sander wilde weten of de teamtaken (`Team Knowledge/tasks/`) ergens in zijn Cockpit-dashboard terechtkomen, naast zijn eigen Todoist-taken in "Actions & Planning". Onderzoek wees uit: nee, nergens — teamtaken waren volledig onzichtbaar in de UI. Dat groeide uit tot een volledige SOP-development-workflow: brainstorm → design → plan → coördinatie met een botsende taak van Bezalel → gecombineerde bouw → Nemesis-QA → afsluiting.

## Wat we deden

- Onderzocht de bestaande "Actions & Planning"-architectuur; ontdekt dat `actionSlots.ts` dode code is en dat de sectie nu een tool-blinde weekplanner is (`PlannerView`), niet het PPM/BPM/Calendar-slotmodel.
- **Daedalus** schreef het design ([[2026-08-19-teamtaken-in-cockpit-dashboard-design]]) en plan ([[2026-08-19-teamtaken-in-cockpit-dashboard-plan]]): Aanpak 2 (eigen "Taken"-familie in de "Mijn AI-team"-flyout, live gelezen, geen SQLite-mirror), Scope B (team nu, `PKM/Tasks/` later inplugbaar).
- Botsing ontdekt met Bezalels openstaande `tsk-2026-08-19-001` (Skills-overzicht) — beide raakten dezelfde vijf frontendbestanden. Bezalel en Daedalus stemden af (via Hermes, want subagent-naar-subagent `SendMessage` stond uit) op één gecombineerde bouwronde: server gescheiden, gedeelde bestanden onder Bezalels eigenaarschap.
- **Daedalus** bouwde blok A (server-lezer `teamTasksApi.js`, `taskFrontmatter.js`, `taskSources.js` + tests, 14/14 groen).
- **Bezalel** bouwde de gecombineerde frontend-diff: `TeamTasksView.tsx`, `SkillsView.tsx`, gedeelde bedrading (`Sidebar.tsx`, `router.ts`, `App.tsx`, i18n).
- **Nemesis** gaf eerst FAIL (horizontale overflow op 320–414px, een al langer bestaand defect in gedeelde `team.css`-klassen, geraakt door de verplichte 375px-breakpoint-check). Bezalel fixte `min-width: 0` op klasseniveau — repareerde meteen ook Workstreams/SOP's/Guidelines. Nemesis herinspecteerde: **definitief PASS**.
- Nemesis legde een methodologie-valkuil vast in `SOP-005-nemesis-quality-gate.md` (headless-Chrome `--virtual-time-budget` gaf een vals-positieve overflow-bevinding; CDP-metingen zijn betrouwbaar gebleken).
- Bezalel rondde `tsk-2026-08-19-001` af volgens SOP-close-task, verplaatst naar `done/`, index herbouwd.
- Ik heb het resultaat zelf in de browser geverifieerd (Taken: 17 entries, Skills: 16 entries, beide live en klikbaar).
- Cockpit-code bleek al gecommit via een automatische backup-commit van een parallelle sessie (`a7737b7`); ik heb zelf nog de herbouwde `INDEX.md` gecommit (`8f1363d`).

## Decisions made

- **Vraag:** Hoe teamtaken tonen — als vierde slot in Actions & Planning, als losse Hub-kaart, of in de "Mijn AI-team"-flyout?
  **Beslissing:** Flyout, naast Workstreams/SOP's/Guidelines — conceptueel is het werk van het AI-team, niet van Sander zelf. Hub-kaart is een losse, nog niet goedgekeurde fase 2.
- **Vraag:** Mirror (SQLite) of live van schijf lezen?
  **Beslissing:** Live lezen, geen mirror — zelfde architectuurkeuze als eerder die dag voor het Skills-overzicht. Mirror-versheid was gemeten ruim een halve dag achter.
- **Vraag:** Botsende bestanden tussen twee taken — combineren of sequentieel?
  **Beslissing:** Combineren, gedeelde bestanden onder één eigenaar (Bezalel), server gescheiden. 2 herstarts + 1 QA-ronde i.p.v. 4 + 2.
- **Vraag:** Generieke Anthropic-skills (docx/pdf/pptx/xlsx) in het Skills-overzicht?
  **Beslissing:** Weglaten — geen stabiele, machine-leesbare bron gevonden (zitten alleen kortstondig uitgepakt in een willekeurig genoemde tempmap). Hardcoderen zou verzonnen data zijn.

## Insights

- Meerdere sessies kunnen tegelijk in dezelfde repo werken zonder branch-isolatie — een gedeeld bestand (`server.js`, `Sidebar.tsx`, `router.ts`, i18n) kan halverwege een sessie al de wijzigingen van een andere sessie bevatten. Vóór het committen van "alleen mijn wijzigingen" op zo'n bestand eerst de diff zelf controleren op vermenging.
- De close-session "Session backup"-routine van een andere sessie kan tussentijds al werk van deze sessie meecommitten — controleer `git log -- <bestand>` voordat je aanneemt dat er nog iets te committen valt.

## Realignments

- _(geen — Sander volgde het voorgestelde traject door de hele sessie)_

## Open threads

- [ ] Hub-kaart "Teamtaken" (fase 2 uit Daedalus' design, §4.2) — losse goedkeuring nodig.
- [ ] `PKM/Tasks/` als tweede bron aansluiten in `taskSources.js` (Scope C) — architectuur staat al klaar, nog niet uitgevoerd.
- [ ] Teamtaken drag-and-drop in de weekplanner (Aanpak 1 uit design) — blijft beschikbaar, raakt geen bestanden van deze oplevering.
- [ ] Dubbel taak-ID `tsk-2026-08-12-001` (twee taken, verschillende slugs, één in `open/` één in `in-progress/`) — als achtergrondtaak voor Atlas neergezet (`task_7d6e81ce`), nog niet opgepakt.
- [ ] Security-signaal van Daedalus: `launchctl print` toont API-keys in platte tekst in de inherited environment van de Cockpit-LaunchAgent — als achtergrondtaak voor Argus neergezet (`task_38124e6a`), nog niet opgepakt.

## Next steps

- Zodra Sander de Hub-kaart of Scope C wil, kan dat direct starten — het ontwerp ligt al klaar in [[2026-08-19-teamtaken-in-cockpit-dashboard-design]].
- De twee achtergrondtaken (dubbel taak-ID, plaintext API-keys) staan als chips klaar om op te pakken.

## Cross-links

- [[2026-08-19-teamtaken-in-cockpit-dashboard-design]] — Daedalus' design-doc
- [[2026-08-19-teamtaken-in-cockpit-dashboard-plan]] — Daedalus' uitvoerbaar plan
- [[2026-08-19-1507_daedalus_teamtaken-cockpit-view]] — Daedalus' technische oplevering blok A
- [[2026-08-19-13-08_bezalel_skills-en-taken-cockpit-views]] — Bezalels technische oplevering van de gecombineerde bouwronde
- [[tsk-2026-08-19-001-skills-overzicht-mypka-cockpit]] — afgesloten taak
