---
# Identity
id: tsk-2026-08-16-002
title: "Dranken apart registreren in het voedings- en gewoontedashboard"

# Ownership & priority
assignee: daedalus
priority: 2

# Status (mirrors folder location)
status: cancelled
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-16T13:46:53Z
updated: 2026-08-19T20:06:07Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-16
parent: null

# Cross-references
linked_sops: [SOP-017-verwerk-voedingsregistratie]
linked_workstreams: [WS-001-daily-journaling]
linked_guidelines: [GL-018-integratie-en-software-register]
linked_my_life: [dagelijks-voldoende-drinken]
linked_session_logs: [2026-08-16-15-46_hermes_second-brain-adc-gezondheid-en-transcriptie]
linked_journal_entries: []

# Tagging
tags: [voeding, dranken, water, cockpit, tracking]
---

# Dranken apart registreren in het voedings- en gewoontedashboard

## What this is

Breid de voedingsregistratie uit zodat dranken niet meer tussen de maaltijden verdwijnen. Registreer per drank minimaal soort en volume in milliliters. Toon water apart, toon daarnaast het totale drankvolume en spiegel de dagvoortgang naar [[dagelijks-voldoende-drinken]]. Het persoonlijke waterdoel is 2.000 ml; de interface moet daarnaast uitleggen dat de officiële normale minimumrichtlijn voor volwassen mannen 1,4 tot 1,8 liter totaal drinken betreft.

## Context one click away

- Procedure: [[SOP-017-verwerk-voedingsregistratie]]
- Workstream: [[WS-001-daily-journaling]]
- Guideline: [[GL-018-integratie-en-software-register]]
- Sanders context: [[dagelijks-voldoende-drinken]]
- Birthed in: [[2026-08-16-15-46_hermes_second-brain-adc-gezondheid-en-transcriptie]]

## Success criteria

- Voedingsregistraties onderscheiden `meal` en `beverage` zonder bestaande registraties te breken.
- Een drank legt soort, volume in ml en zo nodig voedingswaarden vast.
- Het voedingsdashboard toont maaltijden en dranken in aparte onderdelen.
- Water en totaal gedronken volume worden afzonderlijk opgeteld.
- Het gewoontedashboard toont de voortgang richting 2.000 ml water.
- Markdown blijft canoniek, de SQLite-mirror wordt automatisch bijgewerkt en parser-, API- en UI-tests slagen.

## Updates

- 2026-08-16 15:46 (hermes) — created after Sander requested separate beverage tracking and an evidence-based daily drinking target.
- 2026-08-19 20:06 (hermes) — Sander asked "dit is toch al af?"; audit against the literal success criteria showed the task was never picked up, but a simpler, different feature (the hydration habit-tracker) shipped in the meantime and covers the practical need. Sander chose to cancel rather than finish the original scope.

## Outcome (cancelled)

Reden: op 2026-08-17/18 is een losstaande, eenvoudigere oplossing gebouwd — de gewoonte [[dagelijks-voldoende-drinken]] met de `HydrationGauge`-component in het gewoontedashboard (`Expansions/mypka-cockpit/web/src/components/HydrationGauge.tsx`, getoond via `Tracking.tsx`). Sander logt een slok via de chat ("kop koffie"), Hermes voegt een `- drink: 250 ml`-regel toe aan het Habit-bestand, en de meter vult zich richting het dagdoel van 2.000 ml.

Dat dekt het praktische doel (zichtbare voortgang naar een dagdoel), maar niet de letterlijke scope van deze taak:
- Geen `meal`/`beverage`-onderscheid in `food_log.py` (`MEAL_TYPES` blijft breakfast/lunch/dinner/snack).
- Geen dranken als structured food-log-entry met eigen kcal/eiwit/koolhydraten/vet.
- Water wordt bewust **niet** apart van het totaal bijgehouden — Sander koos op 2026-08-18 expliciet het tegenovergestelde van succescriterium "Water en totaal gedronken volume worden afzonderlijk opgeteld", omdat een aparte watermeter bij hem structureel op nul zou blijven staan.
- Dranken staan niet naast de maaltijden in het voedingsdashboard; het is een generieke Habit-widget, los van de maaltijdenlijst.

Superseded by: geen apart taakbestand — gebouwd tijdens sessie [[2026-08-17-17-30_hermes_adc-arnhem-hydratatiemeter-voedingspijplijn]], vastgelegd in [[dagelijks-voldoende-drinken]] en [[feedback_drankjes_loggen_via_chat]].

Follow-ups: geen. Mocht Sander later alsnog per-drank voedingswaarden of een echte `beverage`-entry in het voedingslogboek willen, dan is dat een nieuwe taak met `parent: tsk-2026-08-16-002`, niet een heropening van deze.
