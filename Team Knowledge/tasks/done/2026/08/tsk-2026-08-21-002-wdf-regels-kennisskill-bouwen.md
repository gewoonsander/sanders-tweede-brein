---
# Identity
id: tsk-2026-08-21-002
title: "WDF-regels kennis-skill bouwen vanaf dartswdf.com"

# Ownership & priority
assignee: daedalus
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-21T11:39:00Z
updated: 2026-08-21T11:39:00Z
due: null

# Provenance
created_by: hermes
source: sander-chat-2026-08-21
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: []
linked_workstreams: []
linked_guidelines: []
linked_my_life: [darts-coaching]
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [darts, wdf, skill, knowledge-base, dartscoaching]
---

# WDF-regels kennis-skill bouwen vanaf dartswdf.com

## What this is
Sander wil een callable skill (zoals de bestaande `/dartpraat`, `/dartsdraaitdoor`, `/spellman-outshots`) die grondig weet hoe de World Darts Federation (WDF, dartswdf.com) in elkaar zit: officiële spelregels, alle kwalificatiecriteria en het ranking-systeem. De Nederlandse Dartsbond (NDB) valt onder de WDF — dat lidmaatschapsverband hoort bij de organisatiestructuur die de skill moet kennen. Doel: als Sander een vraag heeft over de WDF, weet de skill het antwoord óf weet het waar het moet zoeken (grounded in de officiële bronnen, niet uit het geheugen verzonnen).

**Scope zoals Sander het zelf formuleerde (2026-08-21):** "Ik wil dat je in ieder geval weet hoe de WDF in elkaar zit, wat de regels zijn, dus officiële spelregels en hoe alle kwalificatiecriteria werken, de ranking etcetera." — dus kern: spelregels + kwalificatie + ranking + organisatiestructuur. Geen expliciete vraag om de volledige bestuurlijke/juridische laag (Constitution, Bye-Laws, Disciplinary Code, Anti-Corruption, Code of Ethics, Conflict of Interest, commissie-chartes, regionale council-statuten) — die zijn tijdens de verkenning wel gevonden maar vielen buiten wat Sander vroeg. Neem ze niet automatisch mee; vraag het aan Sander als er twijfel is of iets erbij moet, in plaats van zelf te beslissen dat het "logisch" is.

**Waarom als taak vastgelegd i.p.v. nu gebouwd:** Sander koos expliciet voor "vastleggen als taak voor terminal-sessie" toen Hermes de keuze voorlegde — past bij zijn eerdere, herhaalde voorkeur om omvangrijke klussen met meerdere documenten te bewaren voor een sessie waarin hij echt in Claude Code/terminal werkt (zie feedback-memory `feedback_grotere_klussen_naar_terminal_sessie`, buiten deze myPKA).

## Document-inventaris (al verkend door Hermes, 2026-08-21 — hoeft niet opnieuw)
Alles staat gebundeld op **https://dartswdf.com/rules**. Relevant voor de gekozen scope:

**WDF Playing And Tournament Rules** (het kernreglement — hoe het spel gespeeld wordt, checkout, oche, boards, toernooiformats)
- https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-02-28_WDF_Playing_and_Tournament_Rules_rev20.pdf

**WDF Majors Qualification Criteria** (World Championship + World Masters, Senior en Youth apart)
- https://dartswdf.com/storage/uploads/dc1d2527-99b5-4df7-9375-6ef75d776403/2026-06-02_WDF_World_Champs_Qualification_Criteria-Senior.pdf
- https://dartswdf.com/storage/uploads/dc1d2527-99b5-4df7-9375-6ef75d776403/2026-06-02_WDF_World_Champs_Qualification_Criteria-Youth.pdf
- https://dartswdf.com/storage/uploads/d68f3c8b-9b86-4e10-a992-ac2efd3c5fe7/2026-08-06_World_Masters_2027_Qualification_Criteria-Seniors.pdf
- https://dartswdf.com/storage/uploads/d68f3c8b-9b86-4e10-a992-ac2efd3c5fe7/2026-08-06_World_Masters_2027_Qualification_Criteria-Youth.pdf

**WDF Ranking System Criteria** (Senior, Youth, Under 23 — hoe punten/ranglijsten werken)
- https://dartswdf.com/storage/uploads/38d5fbd0-8bd7-417c-9bf2-c165c88677e9/2026-03-05_World_Ranking_Systems_Criteria_Seniors_49.pdf
- https://dartswdf.com/storage/uploads/9edf2e32-61f5-4ca8-888b-197e7034acef/2026-03-05_World_Ranking_Systems_Criteria_Youth_18.pdf
- https://dartswdf.com/storage/uploads/0f7ddfcd-0c13-42b3-aa5b-c8ca3f95c7dd/2026-03-05_World_Ranking_Systems_Criteria_U23_4.pdf

**WDF Cup Rules** (World Cup, World Cup Youth, Americas Cup, Asia-Pacific Cup, Europe Cup, Europe Cup Youth)
- https://dartswdf.com/storage/uploads/637e0855-6dcb-4e8d-95aa-6f4f54ee4e5e/2025-08-12_WDF_World_Cup_Rules_rev_28.pdf
- https://dartswdf.com/storage/uploads/637e0855-6dcb-4e8d-95aa-6f4f54ee4e5e/2025-08-12_WDF_World_Cup_Youth_Rules_rev_8.pdf
- https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-07-20_WDF_Americas_Cup_Rules_rev_4.pdf
- https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-10-09_WDF_Asia-Pacific_Cup_Rules_rev3.pdf
- https://dartswdf.com/storage/uploads/b7f75d39-2eab-46c8-b6d2-a1bbb6b7009f/2024-01-20_WDF_Europe_Cup_Rules_rev_19.pdf
- https://dartswdf.com/storage/uploads/0f17c4d6-5ff5-46a6-b06f-d85d45997966/2026-04-08_WDF_Europe_Cup_Youth_Rules_rev_15.pdf

**Organisatiestructuur** (voor "hoe de WDF in elkaar zit" — leden incl. NDB, opzet)
- https://dartswdf.com/members (ledenlijst — hier moet de Nederlandse Dartsbond tussen staan)
- https://dartswdf.com/organisation (executives/officials)
- https://dartswdf.com/wdf-cups, https://dartswdf.com/wdf-majors, https://dartswdf.com/tournaments (overzicht van het toernooienlandschap)

**Gevonden maar buiten de gekozen scope (niet meenemen tenzij Sander alsnog akkoord geeft):** WDF Constitution, Bye-Laws, Special Officers and Delegates, Anti-Corruption Code, Anti-Doping Rules, Code of Ethics, Conflict of Interest Policy, Disciplinary Code, Transgender Athlete Policy, de vijf commissie-chartes (Athletes/Athletes Entourage/Sport for All/Women in Sport/Youth in Sport), International Youth Challenge Rules, en de drie regionale council-statuten (Europe/Africa/Asia-Pacific Darts Council). Volledige lijst met links staat in de rauwe scrape-output van deze sessie (Hermes, 2026-08-21) — bij twijfel opnieuw https://dartswdf.com/rules ophalen, de lijst kan wijzigen (revisienummers in bestandsnamen).

## Context one click away
- Vergelijkbaar precedent (zelfde soort werk, andere bron): `/transcribeer`-skill, eigenaar Daedalus, gedocumenteerd in [[AGENTS]] §Skills Register — bouwt ook een kennis-skill van een externe bron (YouTube i.p.v. een reglementensite). Kennis komt daar in `PKM/Documents/YouTube-Kennis/`; overweeg een analoge `PKM/Documents/WDF-Kennis/` als opslaglocatie, tenzij een andere structuur beter past bij PDF-bronnen.
- Bestaande kennis-skills als stijlvoorbeeld: `.claude/skills/dartpraat/`, `.claude/skills/dartsdraaitdoor/`, `.claude/skills/spellman-outshots/` (alle drie lokaal/globaal geïnstalleerd, niet in deze repo — zie hun beschrijving in de skills-listing van de sessie).
- Sanders context: [[PKM/My Life/Topics/darts-coaching]] — DartsCoaching.nl, 20% mede-eigenschap, content/coaching is waar WDF-regelkennis voor gebruikt gaat worden.
- Team-registratieplicht: zodra de skill bestaat, direct een rij toevoegen aan de Skills Register-tabel in [[AGENTS]] (regel "Hoe de register bij te houden") — dit is geen los eindje, het hoort bij "klaar".

## Success criteria
- Een callable skill bestaat (bv. `/wdf-regels` of vergelijkbare naam — kies in lijn met de bestaande naamgeving) die vragen kan beantwoorden over: officiële spelregels, kwalificatiecriteria (World Championship + World Masters, Senior/Youth), ranking-systeem (Senior/Youth/U23), en de organisatiestructuur van de WDF inclusief het lidmaatschap van de Nederlandse Dartsbond.
- Antwoorden zijn gegrond in de daadwerkelijke brondocumenten (PDF's + relevante site-pagina's hierboven), niet uit het model-geheugen verzonnen — bij twijfel citeert de skill de bron of geeft aan dat iets nagezocht moet worden.
- Kennis is lokaal vastgelegd (net als bij `/transcribeer`) zodat de skill niet bij elke vraag opnieuw hoeft te scrapen; revisiedatums/versienummers van de bronnen worden vastgelegd zodat een latere herziening (WDF publiceert regelmatig nieuwe revisies, zie bestandsnamen) gedetecteerd kan worden.
- Skill staat geregistreerd in de Skills Register-tabel in [[AGENTS]].
- Steekproef: Sander stelt na oplevering minimaal 2-3 echte WDF-vragen (bv. over checkout-regels, hoe World Masters-kwalificatie werkt, wat de NDB's relatie tot de WDF is) en krijgt een correct, bronverwijzend antwoord.

## Updates
- 2026-08-21 11:39 (hermes) — created, na Sanders verzoek om een WDF-kennis-skill. Scope en document-inventaris verkend tijdens dit gesprek (firecrawl_map + firecrawl_scrape op dartswdf.com en /rules); Sander koos expliciet voor "vastleggen als taak" i.p.v. nu bouwen in deze Cowork-sessie.

## Outcome
_(filled when status flips to done — see SOP-close-task)_
