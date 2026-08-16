---
# Identity
id: tsk-2026-08-16-002
title: "Dranken apart registreren in het voedings- en gewoontedashboard"

# Ownership & priority
assignee: daedalus
priority: 2

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-16T13:46:53Z
updated: 2026-08-16T13:46:53Z
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

## Outcome

_(filled when status flips to done — see SOP-close-task)_
