---
# Identity
id: tsk-2026-08-19-002
title: "YouTube als eigen library-categorie toevoegen aan mypka-cockpit dashboard"

# Ownership & priority
assignee: unassigned
priority: 4

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-19T11:35:00Z
updated: 2026-08-19T11:35:00Z
due: null

# Provenance
created_by: hermes
source: sander-chat-2026-08-19
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: []
linked_workstreams: []
linked_guidelines: []
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [mypka-cockpit, dashboard, library, youtube, podcasts]
---

# YouTube als eigen library-categorie toevoegen aan mypka-cockpit dashboard

## What this is
Tijdens het bouwen van de podcast-integratie (zie de podcasts-library die Atlas op 2026-08-19 heeft opgeleverd, `Expansions/mypka-cockpit/sqlite-extension/schema/09-module-podcasts.sql`) merkte Sander op dat het dashboard nu al recepten, boeken en films als library-categorie toont, maar **YouTube nog niet** — terwijl hij bepaalde content (bv. Dartpraat) soms via YouTube bekijkt in plaats van via de Podcasts-app.

Sander noemde dit expliciet als iets voor later: niet urgent, maar wel iets waar het systeem naartoe zou moeten groeien als "compleet" het doel is. Geen beslissing genomen over aanpak — alleen vastgelegd dat het bestaat als open vraag.

Losstaand maar gerelateerd: de bestaande `/transcribeer`-skill haalt al YouTube-transcripten binnen naar `PKM/Documents/YouTube-Kennis/<kanaalnaam>/`, maar dat is puur tekstarchief, geen "kijkgeschiedenis"-library met status (gezien/niet gezien) zoals recepten/boeken/films/podcasts die nu wel hebben.

## Context one click away
- Podcasts-library (net gebouwd, vergelijkbaar patroon): `Expansions/mypka-cockpit/sqlite-extension/schema/09-module-podcasts.sql`
- Bestaand library-foundation-patroon: `Expansions/mypka-cockpit/sqlite-extension/schema/07-library-foundation.sql`, `Expansions/mypka-cockpit/sqlite-extension/DATA-CONTRACT.md` (§11 Library foundation, §14 Outer World)
- Sjabloon voor een nieuwe library-module: `Expansions/mypka-cockpit/examples/library-module/`
- Bestaande YouTube-transcripten (geen library-status, puur tekst): `PKM/Documents/YouTube-Kennis/`

## Open vragen (nog niet beantwoord, bewust niet ingevuld met een aanname)
- Wat betekent "gezien" voor YouTube hier — alleen kanalen die al getranscribeerd worden, of breder al Sanders YouTube-kijkgeschiedenis?
- Hoe kom je aan Sanders YouTube-kijkgeschiedenis/watch-status (YouTube Data API vraagt OAuth — vergelijkbare complexiteit als de eerder overwogen, maar afgewezen, volledige YouTube-integratie voor de podcast-luisterstatus)?
- Overlapt dit met de podcast-library (zelfde aflevering, twee platforms) — hoe voorkom je dubbele/verwarrende status tussen de podcast-library en een toekomstige YouTube-library?

## Success criteria
_(nog niet gedefinieerd — eerst scopegesprek met Sander nodig voordat dit wordt opgepakt)_

## Updates
- 2026-08-19 11:35 (hermes) — created, tijdens podcast-integratiesessie; expliciet als "kan later" gemarkeerd door Sander

## Outcome
_(filled when status flips to done — see SOP-close-task)_
