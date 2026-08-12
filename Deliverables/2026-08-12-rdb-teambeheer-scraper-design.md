---
title: "Design — RDB Teambeheer scraper en Google Sheets-prototype"
date: 2026-08-12
status: approved
owner: daedalus
reviewer: hermes
linked_task: tsk-2026-08-12-001-teambeheer-scraper-database-onderzoek
---

# Design — RDB Teambeheer scraper en Google Sheets-prototype

## Besluiten

- Scope: alleen Rivierenland Darts Bond, Teambeheer bond-ID `d=1`.
- Persoonsgegevens: openbare spelersprofielen, prestaties en historische teamrelaties; geen contactgegevens of niet-openbare ledenadministratie.
- Opslag: eerst een aparte Google Sheet, later migreerbaar naar een relationele database.
- Oplevering: onderzoeksrapport plus werkend proof-of-concept.
- De bestaande spreadsheets `Feeds teambeheer` en `dartbonden` blijven read-only.

## Doel

Een herhaalbare n8n-workflow haalt openbare RDB-competitiegegevens op uit `feeds.teambeheer.nl`, normaliseert die naar stabiele tabellen en werkt een nieuwe Google Sheet `RDB Teambeheer Database` idempotent bij. De proef bewijst zowel actuele synchronisatie als het behoud van historische relaties.

## Feiten uit de bronverkenning

- Teambeheer levert server-rendered HTML; een headless browser is voor de kernfeeds niet nodig.
- `d=1` identificeert RDB. Andere zichtbare identifiers zijn `s` (seizoen), `div` (divisie/poule), `t` (team), `l` (speler), `w` (wedstrijd) en `cn` (speellocatie).
- De openbare seizoensnavigatie bevat `05-06` tot en met `26-27`.
- De speellocatie-index toont naam, adres, plaats en telefoon en linkt via `cn` naar detailpagina's.
- Standen linken naar teams en jaarprogramma's. Teampagina's kunnen wedstrijden, spelers, resultaten, prestaties en seizoenshistorie bevatten. Spelerspagina's kunnen wedstrijden, singles, koppels, 180'ers, finishes en teamhistorie bevatten.
- Hardgecodeerde voorbeeld-ID's uit het bronblad kunnen verouderd zijn. De workflow moet daarom identifiers ontdekken vanuit actuele indexpagina's.

## Drie aanpakken

### Aanpak A — Eén monolithische n8n-workflow

Eén Schedule Trigger doorloopt seizoenen, poules, teams, spelers, locaties en wedstrijden en schrijft alles naar Sheets.

Voordelen:
- Snelste eerste bouw.
- Eén workflow om te openen en te exporteren.

Nadelen:
- Moeilijk gericht opnieuw te draaien.
- Eén parserfout kan de hele synchronisatie stoppen.
- Slechte observability en lastiger later naar een database te migreren.

### Aanpak B — Gelaagde discovery- en synchronisatieworkflows

Een controller start afzonderlijke subworkflows voor discovery, ophalen/parsen en upsert. Elke entiteit heeft een stabiele sleutel, bron-URL, inhoudshash en synchronisatietijd.

Voordelen:
- Idempotent en gericht herstelbaar.
- Goed te testen per entiteit.
- Eenvoudig later Google Sheets te vervangen door PostgreSQL/Supabase.
- Beleefde throttling en foutregistratie zijn centraal af te dwingen.

Nadelen:
- Meer workflows en iets meer initiële inrichting.
- Google Sheets blijft bij veel historische data een tijdelijke opslaglaag.

### Aanpak C — Eerst lokale scrapercode, n8n alleen als planner

Een losse TypeScript/Python-service parseert de feeds; n8n plant runs en schrijft resultaten door.

Voordelen:
- Beste testbaarheid en versiebeheer van parsers.
- Efficiënt bij grote historische imports.

Nadelen:
- Extra runtime, deployment en onderhoud.
- Te zwaar voor de eerste RDB-proof-of-concept.

## Aanbeveling

Kies aanpak B. Het is de kleinste opzet die de kernvereisten — betrouwbaarheid, herstartbaarheid, historisch bereik en latere databasemigratie — serieus afdekt. Aanpak A levert sneller een demo maar creëert direct technische schuld; aanpak C is pas zinvol als de RDB-proef aantoont dat volume of parsercomplexiteit dat vereist.

## Voorgestelde Google Sheet

De nieuwe Sheet krijgt deze tabbladen:

| Tabblad | Primaire/samengestelde sleutel | Kerninhoud |
|---|---|---|
| `config` | `config_key` | bond-ID, actieve seizoenen, vertraging, runmodus |
| `seasons` | `bond_id + season_id` | ontdekte seizoenen en status |
| `divisions` | `bond_id + season_id + division_id` | poules/divisies |
| `venues` | `bond_id + season_id + venue_id` | naam, adres, plaats, openbaar telefoonveld, bron-URL |
| `teams` | `bond_id + season_id + team_id` | team, divisie, locatie, positie |
| `players` | `bond_id + player_id` | openbare naam/profiel-URL, eerste/laatste waarneming |
| `team_memberships` | `bond_id + season_id + team_id + player_id` | historische speler-teamrelatie |
| `matches` | `bond_id + match_id` | datum, seizoen, divisie, thuis/uit, score, status |
| `player_results` | `bond_id + match_id + player_id + result_type` | singles, koppels en spelerprestaties |
| `achievements` | `bond_id + season_id + player_id + achievement_type + source_key` | 180, finish, snelste leg en andere openbare prestaties |
| `tournaments` | `bond_id + tournament_source_key` | agenda, speltype, locatie en openbare inschrijflink |
| `sync_runs` | `run_id` | start/einde, aantallen, fouten en workflowversie |
| `data_quality` | `issue_key` | ontbrekende sleutels, parserdrift, duplicaten en verweesde relaties |

Alle datatabbladen krijgen minimaal `source_url`, `source_hash`, `first_seen_at`, `last_seen_at`, `last_scraped_at` en `is_active`. Een record wordt niet fysiek verwijderd wanneer het uit een feed verdwijnt; het wordt na herbevestiging in een latere run inactief gemaakt.

## n8n-ontwerp

1. `RDB TB — Controller`
   - Handmatige en geplande trigger.
   - Leest `config`.
   - Maakt `run_id` en start een sync-audit.
   - Roept subworkflows in vaste volgorde aan.

2. `RDB TB — Discover`
   - Ontdekt seizoenen vanuit de navigatie.
   - Ontdekt divisies, teams en locaties vanuit indexfeeds.
   - Gebruikt nooit uitsluitend hardgecodeerde team-, speler- of wedstrijd-ID's.

3. `RDB TB — Fetch and Parse`
   - Haalt HTML op met een herkenbare User-Agent en begrensde requestfrequentie.
   - Parseert op tabelkoppen en URL-parameters, niet op rijpositie alleen.
   - Geeft genormaliseerde objecten terug plus bronhash.

4. `RDB TB — Sheets Upsert`
   - Zoekt op de samengestelde sleutel.
   - Werkt alleen gewijzigde records bij; voegt nieuwe records toe.
   - Beschermt handmatige configuratievelden.

5. `RDB TB — Quality and Audit`
   - Controleert unieke sleutels en vreemde sleutels.
   - Signaleert plotselinge dalingen, lege parsers en gewijzigde tabelkoppen.
   - Sluit `sync_runs` af met aantallen per entiteit.

## Synchronisatiestrategie

- Proof-of-concept: huidig seizoen plus één historisch seizoen, handmatig gestart.
- Na validatie: actuele competitiegegevens dagelijks; uitslagen tijdens speelweken vaker indien gewenst; locaties en historie wekelijks/maandelijks.
- Requests lopen sequentieel of met zeer beperkte concurrency en een instelbare pauze.
- HTTP 429 en 5xx krijgen begrensde exponential backoff. Permanente parsefouten gaan naar `data_quality`.
- Een volledige historische backfill is een afzonderlijke handmatige modus en staat standaard uit.

## Privacy en publicatiegrenzen

- Alleen gegevens van openbare feedpagina's worden verwerkt.
- Geen scraping achter login, geen sessiecookies hergebruiken en geen omzeiling van toegangscontroles.
- Geen e-mailadressen, privételefoonnummers, geboortedata of adressen van spelers.
- Een openbaar telefoonnummer van een speellocatie blijft een locatieveld en wordt niet aan een speler gekoppeld.
- Spelergegevens worden niet gebruikt voor geautomatiseerde commerciële benadering.
- Het onderzoeksrapport controleert vóór livegang robots.txt, toepasselijke voorwaarden, doelbinding en een verwijder-/correctieprocedure.

## Acceptatiecriteria voor de proof-of-concept

- Een nieuwe Google Sheet met alle voorgestelde tabbladen bestaat en de bronspreadsheets zijn ongewijzigd.
- Een handmatige n8n-run ontdekt de gekozen seizoenen en vult minimaal divisies, locaties, teams, spelers en teamrelaties.
- Een tweede identieke run creëert geen duplicaten.
- Een gewijzigde bronwaarde wordt bij een volgende run bijgewerkt met behoud van `first_seen_at`.
- Elke rij is herleidbaar tot een openbare bron-URL en synchronisatierun.
- Een ongeldige of gewijzigde feed wordt gelogd zonder stille datavervuiling.
- Contactgegevens van spelers en niet-openbare gegevens komen niet in het bestand voor.

## Buiten scope van deze proef

- Andere bonden dan RDB.
- Facebookscraping, bondsnieuws en externe websiteagenda's.
- Een productieklare PostgreSQL/Supabase-database.
- Commerciële verrijking of contactprofielen van spelers.
- Volledige historische backfill van alle seizoenen voordat de actuele parser is gevalideerd.

## Goedkeuringspoort

Goedgekeurd door Sander op 2026-08-12. Fase 2 van [[SOP-development-workflow]] is gestart: een uitvoerbaar implementatieplan met exacte n8n-workflows, Google Sheet-structuur, verificatiestappen en rollbackgrenzen. Er wordt vóór de tweede goedkeuring niets in Google Drive of n8n aangemaakt.
