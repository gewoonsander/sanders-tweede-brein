---
id: tsk-2026-08-16-001
title: "Activeer gewoontetracking in de myPKA-cockpit"
assignee: daedalus
priority: 2
status: done
blocked_reason: null
blocked_by: null
created: 2026-08-16T12:00:31Z
updated: 2026-08-16T12:12:00Z
due: null
created_by: hermes
source: hermes-session-2026-08-16
parent: null
linked_sops:
  - SOP-002-convert-mypka-to-sqlite
linked_workstreams: []
linked_guidelines:
  - GL-002-frontmatter-conventions
  - GL-020-informatie-invoer-uitvoer-en-levenscyclusregister
linked_my_life:
  - dagelijks-opdrukken
  - dagelijks-bewegen
  - bodylotion-aanbrengen
  - schimmelcreme-gebruiken
  - gezondheid
linked_session_logs: []
linked_journal_entries: []
tags:
  - cockpit
  - gewoontes
  - tracking
  - sqlite
---

# Activeer gewoontetracking in de myPKA-cockpit

## What this is

Maak de bestaande read-only Tracking-pagina werkelijk bruikbaar door gestructureerde dagelijkse check-ins uit de `## Reflection`-secties van Habit-bestanden naar `habit_logs` te spiegelen. Opdrukken moet naast gedaan/niet gedaan ook het werkelijke aantal kunnen tonen. Het goed te keuren ontwerp staat in [[2026-08-16-gewoontetracking-dashboard-design]].

## Context one click away

- Procedure: [[SOP-002-convert-mypka-to-sqlite]]
- Richtlijnen: [[GL-002-frontmatter-conventions]], [[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]]
- Sanders context: [[dagelijks-opdrukken]], [[dagelijks-bewegen]], [[bodylotion-aanbrengen]], [[schimmelcreme-gebruiken]], [[gezondheid]]
- Ontwerp: [[2026-08-16-gewoontetracking-dashboard-design]]

## Success criteria

- Actieve dagelijkse gewoontes verschijnen na een check-in op de Tracking-pagina.
- Opdrukken toont het laatst geregistreerde aantal herhalingen.
- Markdown blijft canoniek en de database blijft een idempotent regenereerbare spiegel.
- Bestaande crème-check-ins worden waar betrouwbaar mogelijk teruggevuld.
- Parser-, database- en API-tests slagen.

## Updates

- 2026-08-16 14:00 (hermes) — aangemaakt; wacht op Sanders goedkeuring van het ontwerp
- 2026-08-16 14:04 (daedalus) — opgepakt na Sanders ontwerpgoedkeuring; geen eerdere Daedalus-priors van toepassing
- 2026-08-16 14:12 (daedalus) — afgerond: Markdown-extractor, kwantitatieve API/UI, legacy-backfill en regressietests geleverd

## Outcome

De cockpitspiegel leest nu gedateerde check-ins uit de `## Reflection`-secties van Habit-bestanden. Actieve dagelijkse gewoontes verschijnen ook zonder check-in; opdrukken kan het laatst behaalde aantal en de eenheid tonen. Zeventien bestaande crème-check-ins zijn conservatief teruggevuld. De SQLite-regeneratie is tweemaal met dezelfde 17 logregels uitgevoerd; parser-, API-, voedingsregressie- en productiebuildtests slagen.

Waar het leeft: [[2026-08-16-gewoontetracking-dashboard-design]], [[GL-002-frontmatter-conventions]], [[dagelijks-opdrukken]], [[dagelijks-bewegen]], [[bodylotion-aanbrengen]], [[schimmelcreme-gebruiken]].

Vervolgwerk: geen. Apple Health/GPX blijft bewust buiten deze versie.
