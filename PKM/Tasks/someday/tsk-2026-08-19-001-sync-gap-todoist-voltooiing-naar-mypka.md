---
type: personal-task
task_id: tsk-2026-08-19-001
title: Sluit de sync-gap tussen Todoist-voltooiing en myPKA
status: someday
created: 2026-08-19
updated: 2026-08-19
key_element: groei
project: sanders-tweede-brein-ingericht
goal:
habit:
parent_task:
owner: sander
delegated_to:
gtd_context: computer
eisenhower: important-not-urgent
estimated_minutes:
start_date:
scheduled_date:
due_date:
follow_up_date:
waiting_since:
source_type: conversation
source_url:
linked_documents: []
linked_people: []
linked_organizations: []
todoist_id:
todoist_sync_status: not-synced
---

# Sluit de sync-gap tussen Todoist-voltooiing en myPKA

## Gewenste uitkomst

Een taak die Sander in de Todoist-app afvinkt, sluit ook automatisch (of via een korte
periodieke controle) de bijbehorende canonieke taak in `PKM/Tasks/` volgens SOP-022 —
status op `done`, geschiedenisregel, verplaatsing naar `done/YYYY/MM/`. Geen taak blijft
meer "open" in myPKA terwijl hij in Todoist al is afgerond.

## Eerstvolgende actie

Wachten tot het werk aan de Todoist-integratie in de myPKA Cockpit weer wordt opgepakt. In
[[GL-018-integratie-en-software-register]] staat de huidige `todoist-api`-integratie als
`lifecycle: configured`, `sync_direction: import`, `conflict_policy: canonical-wins` — dus
uitsluitend een eenrichtings-import van open taken, geen voltooiingssync terug. Voeg dan een
reconciliatiestap toe: periodiek (of bij elke `/dagstart`) de open `next`/`scheduled`/
`waiting`-taken met een `todoist_id` langs Todoist' `checked`-status leggen en automatisch
sluiten wat daar al is afgevinkt.

## Context een klik verder

- [[sanders-tweede-brein-ingericht]] — project "Tweede brein v1 afronden"
- [[GL-012-pkm-vs-todoist]] — myPKA is SSOT, Todoist is projectie; beschrijft alleen de
  weg PKM → Todoist (SOP-023), niet de weg terug
- [[SOP-022-verwerk-persoonlijke-taak]] — sluitprocedure, stap 7
- [[SOP-023-synchroniseer-persoonlijke-taak-naar-todoist]]
- [[GL-018-integratie-en-software-register]] — `todoist-api`-integratie-entry

## Wachten op

Todoist-connector-werk in de myPKA Cockpit (zie project-status) — geen zelfstandige
prioriteit zolang dat geblokkeerd is.

## Geschiedenis

- 2026-08-19 — Vastgelegd na een ICOR-Refine-doorloop van het systeem. Concreet
  aangetroffen: `tsk-2026-08-14-002-bel-kpn-pdf-facturen` en
  `tsk-2026-08-14-003-verstuur-factuur-gewoon-thuis-naar-albero` stonden in myPKA nog als
  `scheduled` terwijl beide al op 2026-08-17 in Todoist waren afgevinkt. Beide zijn
  handmatig gesloten en verplaatst naar `done/2026/08/`; deze taak volgt de structurele
  oorzaak op. `PKM/Tasks/done/` en `cancelled/` bevatten sindsdien pas hun eerste bestanden
  ooit (geverifieerd via `git log`, geen enkele eerdere commit raakte die mappen).
