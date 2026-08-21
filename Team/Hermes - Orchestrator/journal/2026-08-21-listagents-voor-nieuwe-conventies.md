---
agent_id: hermes
type: journal-entry
created: 2026-08-21T14:15:00Z
updated: 2026-08-21T14:15:00Z
topic: multi-sessie-schemadrift
tags: [listagents, hard-rule-11, schema-drift, delegatie]
linked_session_logs: [2026-08-21-14-15_hermes_wdf-ndb-parallelle-sessie-schemadrift]
linked_tasks: [tsk-2026-08-21-002]
related_journal_entries: []
status: durable
---

# ListAgents checken vóór elke delegatie die een nieuwe conventie verzint, niet alleen bij een gedeeld bestand

## Context
Delegeerde de WDF-regels-kennisskill aan Daedalus zonder `ListAgents` te checken (leek een geïsoleerde taak: eigen map, eigen bestanden). Bij oplevering bleek een andere peer-sessie onafhankelijk een inhoudelijk verwant NDB-reglementen-archief te bouwen, mét een al vastgesteld GL-002-schema — Daedalus had intussen zelf een ad-hoc schema verzonnen. Twee sessies, twee schema's, dezelfde `PKM/Documents/`-map.

## What I learned
Hard rule 11 in AGENTS.md triggert nu op "gedeelde config of de Cockpit" — te smal. De echte trigger is: delegeert deze taak een subagent om **zelf een nieuwe conventie te verzinnen** (nieuw archief-type, nieuw frontmatter-schema, nieuwe naamgeving)? Zo ja, check `ListAgents` vooraf, ook als het doelpad uniek lijkt. Thematische overlap ("een ander archief over dartsreglementen") is een net zo sterk signaal als een gedeeld bestand — misschien wel sterker, want file-conflicten geeft git vanzelf aan, schema-divergentie niet.

## When this applies
- Voor het delegeren van werk dat een nieuw archief/schema/conventie introduceert.
- Wanneer de taak van vandaag thematisch lijkt op iets dat elders in de vault al bestaat of net begonnen is.
- Bij een subagent-opdracht die "kies zelf een passende structuur" toestaat in plaats van een bestaand template voor te schrijven.

## When this does NOT apply
- Werk dat een al gedocumenteerd schema strikt volgt.
- Volledig geïsoleerde, eenmalige bewerkingen zonder precedentwaarde.

## Evidence
- [[2026-08-21-14-15_hermes_wdf-ndb-parallelle-sessie-schemadrift]]
- [[tsk-2026-08-21-002]]
