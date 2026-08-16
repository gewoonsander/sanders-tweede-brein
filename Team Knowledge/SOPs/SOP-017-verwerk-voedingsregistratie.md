---
id: SOP-017
title: Verwerk een voedingsregistratie
owner: penn
status: active
triggers: [voedingsfoto, maaltijdspraak, eten loggen, voedingsdagboek]
references: [GL-001-file-naming-conventions, WS-001-daily-journaling, gewicht-aanpakken]
---

# SOP-017 — Verwerk een voedingsregistratie

**Default owner:** Penn, met Daedalus voor capture. De mirror-regeneratie loopt automatisch mee in `food_log.py`, geen aparte eigenaar meer nodig. **Reusable by any agent.**

## Doel

Zet een foto, gesproken invoer of tekst om in één append-only maaltijdregistratie in `PKM/Journal/YYYY/MM/YYYY-MM-DD-voedingslogboek.md`.

## Procedure

1. Bewaar de ruwe bron en bepaal een stabiele `source_id` (content-hash of opname-ID).
2. Kies exact één categorie:
   - `breakfast` — ontbijt
   - `lunch` — lunch
   - `dinner` — avondeten
   - `snack` — tussendoor
3. Prioriteit voor categorie: expliciet genoemd → inhoud/context → tijdstip als voorstel. Bij twijfel: één gerichte vraag; niet gokken.
4. Leg omschrijving, tijd, bronsoort en optionele foto vast.
5. Schat kcal, eiwit, koolhydraten en vet als `min–max`, plus `confidence` (`low`, `medium`, `high`). Nooit één exact AI-getal opslaan.
6. Calorische dranken tellen mee. Water, zwarte koffie en ongezoete thee zijn optioneel.
7. Append de entry via `Expansions/mypka-cockpit/scripts/food_log.py` (`append_meal`/CLI `append-meal`, zonder expliciete `vault`). Een bestaande `source_id` wordt niet opnieuw toegevoegd.
8. Correctie nodig? Append een nieuwe entry met `supersedes_entry_id`; verwijder of herschrijf de oude entry niet.
9. Lage confidence blokkeert vastlegging niet. Bewaar een ruime range en stel maximaal één concrete vervolgvraag.

De mirror-regeneratie is sinds 2026-08-16 geen handmatige stap meer — `food_log.py` roept `regen-mypka-db.py` automatisch aan na elke `append_meal`/`append_audit` (alleen wanneer geen expliciete `vault` is meegegeven, dus nooit tijdens tests). Ontdekt doordat een handmatig via deze SOP gelogd ontbijt niet in de Cockpit verscheen: de markdown klopte, maar niemand had de mirror ververst. Zie [[Team Knowledge/Guidelines/GL-018-integratie-en-software-register]] voor de achtergrond.

## Close-session

- `J` op “Heb je vandaag alles wat je hebt gegeten gelogd?” appendt een completion-audit met `complete: yes`; geen inhoudelijke vervolgvraag.
- `N` start één open herinneringsvraag. Verwerk het antwoord volgens deze SOP en vraag daarna opnieuw `J/N`.
- De nieuwste auditregel is leidend.

## Kwaliteitsregels

- Markdown is canoniek; SQLite is afgeleid.
- Geen goed/fout-score of beschamende taal.
- Foto's staan in `PKM/Images/YYYY/MM/` en worden met een wikilink opgenomen.
- API-keys en ruwe base64-data komen nooit in markdown of logs.
