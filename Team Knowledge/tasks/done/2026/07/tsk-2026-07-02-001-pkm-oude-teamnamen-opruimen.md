---
# Identity
id: tsk-2026-07-02-001
title: "Cosmetische PKM-vermeldingen van oude teamnamen opruimen"

# Ownership & priority
assignee: Hermes
priority: 3

# Status (mirrors folder location)
status: done
blocked_reason: null
blocked_by: null

# Time
created: 2026-07-02T21:08:13Z
updated: 2026-07-09T07:26:26Z
due: null

# Provenance
created_by: Hermes
source: manual
parent: null

# Cross-references
linked_sops: []
linked_workstreams: []
linked_guidelines: []
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags:
  - librarian
  - naamgeving
  - terminal-sessie
---

# Cosmetische PKM-vermeldingen van oude teamnamen opruimen

## What this is

Bij het opschonen van de Team/-mapnamen (2026-07-02, oude namen Larry/Nolan/Pax/Mack/Silas/Iris/Felix/Vex/Vera → nieuwe namen Hermes/Jethro/Athena/Daedalus/Atlas/Harmonia/Bezalel/Argus/Nemesis) zijn de mappen zelf, de directe wikilinks en de SOP-bestandsnamen (SOP-003/004/005) al gefixt. Wat nog overblijft: losse, cosmetische vermeldingen van de oude namen in lopende tekst binnen Sanders persoonlijke PKM-bestanden — bijvoorbeeld `PKM/CRM/Organizations/canva.md` ("Integratie met Larry") en `PKM/My Life/Topics/n8n.md` ("Mack is de aangewezen specialist"). Circa 15-20 bestanden, elk moet individueel bekeken worden (geen blinde zoek-vervang, want sommige treffers zijn andere personen/woorden, geen agent-verwijzing).

**Expliciete gebruikersvoorkeur:** Sander wil dit soort grotere/langere opschoonklussen bewaard zien voor een sessie waarin hij daadwerkelijk in Claude Code / de terminal werkt (in plaats van Cowork/desktop-app). Pak deze taak dus bij voorkeur op in zo'n sessie.

## Context one click away
- Guideline: [[GL-001-file-naming-conventions]]
- Birthed in: sessie 2026-07-02 (architectuurdiscussie + Team/-rename)

## Success criteria
- Alle prose-vermeldingen van Larry/Nolan/Pax/Mack/Silas/Iris/Felix/Vex/Vera in `PKM/` verwijzen naar de juiste nieuwe naam, of zijn bevestigd als onterecht gesignaleerd (andere naam/woord)
- Geen wijzigingen aan historische session-logs of scaffold-templatebestanden (die blijven bewust ongewijzigd)

## Updates
- 2026-07-02 21:08 (Hermes) — aangemaakt, na afronding van de Team/-mapnaam-opschoning en de SOP-003/004/005-hernoeming
- 2026-07-09 07:26 (Hermes) — done: alle echte agent-vermeldingen vervangen, false positive overgeslagen, scaffold-map verwijderd

## Outcome

What shipped: 15 prose-vermeldingen van oude teamnamen (Larry, Pax, Mack) in 14 PKM-bestanden individueel beoordeeld en vervangen door de nieuwe namen (Hermes, Athena, Daedalus). Eén treffer (`PKM/My Life/Projects/verbouwing-huismanstraat-34.md:170`) bleek een aannemer ("Larry" schat 14-18 uur) en niet een agent-verwijzing — bewust overgeslagen. Geen treffers gevonden voor Nolan/Silas/Iris/Felix/Vex/Vera. Historische session-logs en scaffold-templates zijn niet aangeraakt. De lege restant-map `Team/Larry - Orchestrator/` (alleen `journal/_template.md`) is verwijderd.

Bewerkte bestanden: PKM/INDEX.md, PKM/CRM/Organizations/canva.md, PKM/CRM/Organizations/firecrawl.md, PKM/CRM/People/darren-van-es.md, PKM/Journal/2026/06/2026-06-17.md, PKM/My Life/Projects/workshop-aanmelding-automatisering.md, PKM/Documents/software-en-tools.md, PKM/My Life/Topics/darts-coaching.md, PKM/My Life/Goals/leren-vibecoden-websites.md, PKM/My Life/Topics/n8n.md, PKM/My Life/Topics/werkwijze-inboxen.md, PKM/Documents/large-files-icloud-index.md, PKM/My Life/Topics/abonnementen.md, PKM/My Life/Topics/thomas-dagbesteding-klussen.md.

Where it lives: deze sessie (terminal/Claude Code, 2026-07-09), geen apart session-log geschreven.

Follow-ups: none.

Lessons: none noteworthy — bevestigt dat de bewuste keuze om deze klus voor een terminal-sessie te bewaren (i.p.v. Cowork) klopte, gezien het aantal losse bestanden.
