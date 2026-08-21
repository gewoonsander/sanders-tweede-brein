---
agent_id: hermes
session_id: wdf-regels-kennisskill-2026-08-21
timestamp: 2026-08-21T14:15:00Z
type: mid-session-insight
linked_sops: [SOP-create-task, SOP-claim-task, SOP-close-task]
linked_workstreams: []
linked_guidelines: []
---

# Twee peer-sessies bouwden onafhankelijk overlappende dartsreglementen-archieven; schema-drift alleen ontdekt via git status bij oplevering

## Context

Sander vroeg Hermes om een `/wdf-regels`-kennisskill (World Darts Federation) te bouwen, vastgelegd als [[tsk-2026-08-21-002]] en uitgevoerd door Daedalus. Onafhankelijk daarvan draaide een andere, al 3 uur actieve peer-sessie een veel groter project: alle NDB-reglementen (Nederlandse Dartsbond) importeren via Athena → Atlas → Daedalus naar `PKM/Documents/NDB-Kennis/`. Hermes wist niets van die sessie tot `git status` bij het afronden van de WDF-taak onverwachte wijzigingen toonde buiten het eigen taakbestand.

## What I learned

`ListAgents` vóór het delegeren checken is niet genoeg als de trigger alleen "gedeelde config of de Cockpit" is (de huidige lezing van hard rule 11 in AGENTS.md). Twee sessies die aan **inhoudelijk verwante maar technisch losstaande bestanden** werken (andere map, andere bestanden, geen file-conflict) kunnen alsnog **schema-drift** veroorzaken: de andere sessie's Atlas had voor NDB-Kennis al een GL-002-conform frontmatter-schema vastgesteld, terwijl Daedalus voor WDF-Kennis (zonder van dat precedent te weten) een eigen ad-hoc Nederlandse sleutel-set verzon. Geen dataverlies, geen git-conflict — maar wel twee inconsistente schema's naast elkaar in dezelfde `PKM/Documents/`-map, ontdekt pas ná oplevering in plaats van vooraf voorkomen.

De eigenlijke fout zat niet bij Daedalus (die had geen enkele reden om een NDB-project te vermoeden), maar bij Hermes: bij het opstarten van een taak die **nieuwe conventies verzint** (een nieuw kennisarchief-type, een nieuwe frontmatter-vorm) had een `ListAgents`-check gestandaardiseerd moeten zijn, ongeacht of het doelbestand gedeeld leek. Thematische overlap (twee taken over "dartsreglementen" binnen dezelfde dag) is net zo'n signaal als een gedeeld bestand.

## When this applies

- Voor het delegeren van een taak die een **nieuw archief-type of nieuwe conventie** introduceert in een gedeelde structuur (`PKM/Documents/`, een nieuw GL-schema, een nieuwe Skills-categorie) — ook als het doelpad zelf uniek lijkt.
- Wanneer twee taken op dezelfde dag **thematisch overlappen**, ook zonder dat iemand dat expliciet heeft gemeld.
- Bij elke taak die een subagent opdraagt zelf schema- of structuurkeuzes te maken (in plaats van een al bestaand template te volgen) — dat is precies het moment waarop twee sessies uiteenlopende keuzes maken.

## When this does NOT apply

- Taken die strikt een bestaand, al gedocumenteerd schema volgen (dan is er niets te verzinnen, dus niets om over te divergeren).
- Eenmalige, geïsoleerde bestandsbewerkingen zonder precedentwaarde voor toekomstig werk.

## Evidence

- [[tsk-2026-08-21-002]] — de WDF-taak waarin dit speelde; Updates-sectie bevat de volledige tijdlijn.
- `2026-08-21-14-36_atlas_ndb-reglementen-kennisarchief-structureren` — sessielog van de andere sessie, met hun eigen constatering van de drift.
- `2026-08-21-15-57_atlas_wdf-kennis-migratie-gl002` — Atlas' herstelactie (WDF-Kennis alsnog naar GL-002 gemigreerd, nadat Sander koos voor "migreer").
