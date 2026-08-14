---
# Identity
id: tsk-2026-08-13-001
title: "Onderzoek Workstream Guardian-achtige check en Tom's sessie-orkestratie (\"Orchestration 2.0\") toepassen op eigen structuur"

# Ownership & priority
assignee: unassigned
priority: 4

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-13T00:00:00Z
updated: 2026-08-13T00:00:00Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-13
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: []
linked_workstreams: [WS-008-deliverables-en-projecten-audit, WS-005-team-retro-and-self-improvement-loop]
linked_guidelines: []
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [orchestratie, sessies, ideeen, later]
---

# Onderzoek Workstream Guardian-achtige check en Tom's sessie-orkestratie ("Orchestration 2.0") toepassen op eigen structuur

## What this is

Sander keek een video van Tom (i-Core) waarin die live een proof-of-concept bouwt: één hoofdsessie ("Larry", orchestrator) die per deliverable een échte, losstaande achtergrond-Claude-sessie start (géén subagent) als project manager, met sessie-ID's gekoppeld aan taken/deliverables zodat een nieuwe hoofdsessie het werk later kan hervinden. Twee losse ideeën kwamen daaruit naar voren om later te overwegen:

1. **Sessie-orkestratie:** deze host heeft al native tools om met andere lopende Claude Code-sessies te praten (opzoeken, doorzoeken, berichten insturen) — het injectiemechanisme dat Tom zelf moest bouwen bestaat bij Sander dus al. Wat ontbreekt is de mapconventie (status-als-mapnaam, sessie-ID's aan taken/deliverables gekoppeld) en een expliciete PM-rol per deliverable die in een echte achtergrondsessie draait i.p.v. een subagent — relevant zodra Sander grote, dagenlange deliverables heeft die moeten doorlopen terwijl hij iets anders doet.
2. **Workstream Guardian:** Tom heeft een eigen agent die nieuw werk toetst tegen zijn vastgestelde doelen/projecten, om te voorkomen dat losse, ongeplande ideeën tijd opslokken zonder ooit terug te koppelen naar een echt doel. Bij Sander bestaat die poortwachtersfunctie nu niet expliciet — WS-008 (deliverables/projecten-audit) komt er het dichtst bij, maar is periodiek/audit-achtig i.p.v. een check vooraf bij het starten van nieuw werk.

Sander wilde dit expliciet **niet nu implementeren**, alleen vastleggen om later op terug te komen.

## Context one click away
- Workstream: [[WS-008-deliverables-en-projecten-audit]] (audit die o.a. checkt of Deliverables gekoppeld zijn aan Key Elements/Projects — dichtstbijzijnde bestaande analoog voor het guardian-idee)
- Workstream: [[WS-005-team-retro-and-self-improvement-loop]] (dit idee kan hier als een verbeter-voorstel in landen)

## Success criteria
- Sander heeft besloten of (en welk deel van) dit idee de moeite waard is om uit te werken
- Zo ja: een concreet voorstel voor óf de sessie-orkestratie-mapconventie óf een Workstream Guardian-achtige check (of allebei), inclusief hoe dit past binnen de bestaande Deliverables/Workstreams-structuur

## Updates
- 2026-08-13 00:00 (hermes) — created

## Outcome
_(filled when status flips to done — see SOP-close-task)_
