---
key_element: bijdrage
title: "Implementatieplan — RDB Teambeheer scraper en Google Sheets-prototype"
date: 2026-08-12
status: implemented
owner: daedalus
reviewer: hermes
linked_task: tsk-2026-08-12-001-teambeheer-scraper-database-onderzoek
linked_design: 2026-08-12-rdb-teambeheer-scraper-design
---

# Implementatieplan — RDB Teambeheer scraper en Google Sheets-prototype

## Doel en constraints

Doel is een verifieerbaar RDB-proof-of-concept dat openbare Teambeheer-data uit het actuele seizoen en één historisch seizoen idempotent synchroniseert naar een afzonderlijke native Google Sheet `RDB Teambeheer Database`.

Constraints:

- Alleen RDB (`d=1`).
- De spreadsheets `Feeds teambeheer` en `dartbonden` blijven ongewijzigd.
- Geen scraping achter login en geen spelercontactgegevens.
- Geen landelijke of volledige historische backfill in deze fase.
- Geen code of databasebestanden in de markdown-only myPKA-repository.
- Geen publicatie of automatische planning voordat handmatige tests slagen.
- Een tweede gelijke run mag geen duplicaten maken.
- Iedere geschreven rij bevat bron-URL, bronhash en synchronisatietijd.

## Bestands- en objectkaart

| Object | Actie | Waarom |
|---|---|---|
| `Deliverables/2026-08-12-rdb-teambeheer-scraper-research.md` | aanmaken | Athena's brononderzoek, feedmatrix, risico's en aanbevelingen |
| gespreksspecifieke visualisatiewerkmap | tijdelijke builder en previews | workbook bouwen zonder code in myPKA op te slaan |
| lokale `rdb-teambeheer-database.xlsx` | tijdelijk aanmaken | gecontroleerde en visueel geverifieerde bron voor native import |
| Google Sheet `RDB Teambeheer Database` | nieuw aanmaken via native import | afgesproken prototype en gebruikersinterface |
| n8n `RDB TB — Discover and Sync POC` | nieuw, ongepubliceerd | proof-of-concept voor discovery, parsing en idempotente upsert |
| n8n `RDB TB — Error Handler` | alleen na expliciete keuze | optionele centrale foutmelding; niet stil activeren |
| `tsk-2026-08-12-001-teambeheer-scraper-database-onderzoek` | bijwerken/sluiten | beslissingen, verificatie en uitkomst vastleggen |

Voor YAGNI wordt de goedgekeurde gelaagde architectuur in de proef als één overzichtelijke, modulaire workflow gebouwd met duidelijk gescheiden secties. Opsplitsing naar meerdere productie-workflows gebeurt pas na bewezen werking; de logische grenzen blijven al zichtbaar zodat die splitsing later mechanisch kan.

## Uitvoeringsstappen

### 1. Onderzoeksbasis afronden — 5 minuten

- Lees de 31 feedtypen uit `Feeds teambeheer!feeds_teambeheer` en groepeer ze in discovery-, kern-, prestatie-, agenda- en mutatiefeeds.
- Controleer voor RDB de actuele indexpagina's voor seizoenen, divisies, locaties, teams en toernooien.
- Controleer `robots.txt`, Teambeheer-privacydocumenten en eventuele openbare gebruiksvoorwaarden.
- Voer Athena's onafhankelijke tweede zoekpad uit voor juridische/technische claims die in het rapport als feit komen.
- Schrijf het rapport naar `Deliverables/2026-08-12-rdb-teambeheer-scraper-research.md` met confidence-labels.

Verificatie:

- Het rapport bevat executive summary, feedmatrix, datavelden, identifiers, beperkingen, methodologie en aanbevelingen.
- Elke belangrijke claim heeft een bron-URL en confidence-label.
- Geen aanname over een feed wordt als bevestigd gemarkeerd wanneer de pagina leeg, verlopen of niet bereikbaar was.

### 2. n8n-capaciteiten en credentials inventariseren — 3 minuten

- Gebruik `list_n8n_connect_services`, `list_credentials`, `search_workflows` en `search_projects` read-only.
- Bepaal het juiste project en beschikbare Google Sheets-credential zonder geheimen te tonen.
- Controleer of een bestaande gedeelde error-handler bestaat, maar wijzig niets.

Verificatie:

- Een geschikt n8n-project en Google Sheets-credential-ID zijn bekend.
- Er zijn geen workflows aangemaakt of gewijzigd.

### 3. Workbookstructuur bouwen — 5 minuten

- Laad de gebundelde workspace-dependencies.
- Maak in de gespreksspecifieke visualisatiewerkmap één `.mjs`-builder met `@oai/artifact-tool`.
- Bouw de tabbladen `config`, `seasons`, `divisions`, `venues`, `teams`, `players`, `team_memberships`, `matches`, `player_results`, `achievements`, `tournaments`, `sync_runs` en `data_quality`.
- Gebruik vaste headers conform het design, reserveer één voorbeeld-/seedrij per datatabel en leg samengestelde sleutels expliciet vast.
- Stel `config` in op `bond_id=1`, `current_season=26-27`, `historical_season=25-26`, `mode=manual_poc`, begrensde requestvertraging en `historical_backfill=false`.

Verificatie:

- `workbook.inspect` toont exact dertien tabbladen en de bedoelde headers.
- De formulefoutscan retourneert nul fouten.
- Elke tabel heeft `source_url`, `source_hash`, `first_seen_at`, `last_seen_at`, `last_scraped_at` en `is_active` waar van toepassing.

### 4. Workbook visueel verifiëren — 3 minuten

- Render alle dertien gevulde header-/configgebieden.
- Controleer leesbaarheid, kolombreedtes, bevroren headerregels, filters, datumformaten en onderscheid tussen configuratie en gesynchroniseerde data.
- Herstel alleen aantoonbare clipping of structurele fouten en exporteer daarna één definitieve `.xlsx`.

Verificatie:

- Alle renders zijn leesbaar zonder afgekapte kernheaders.
- De definitieve inspect en formulefoutscan blijven schoon.
- Er bestaat exact één definitieve `.xlsx` voor import.

### 5. Native Google Sheet importeren — 3 minuten

- Importeer de definitieve `.xlsx` met `google_drive_import_spreadsheet`, titel `RDB Teambeheer Database` en `upload_mode: native_google_sheets`.
- Controleer dat `converted=true` en het MIME-type een native Google Spreadsheet is.
- Lees metadata terug en bevestig spreadsheet-ID, URL en alle tabnamen.
- Upgrade alleen bedoelde dataranges naar native Sheets-tabellen wanneer de import voldoende seeddata bevat; behoud de config-layout als normaal bereik.

Verificatie:

- De nieuwe spreadsheet-ID verschilt van beide bronspreadsheets.
- Metadata toont exact de dertien verwachte tabbladen.
- De bronspreadsheets zijn niet gewijzigd.

Rollback:

- Bij mislukte import wordt geen tweede bestand gemaakt voordat de foutoorzaak bekend is.
- Een foutief geïmporteerd nieuw bestand mag alleen gericht worden verwijderd/gearchiveerd nadat het exacte spreadsheet-ID is bevestigd.

### 6. n8n-SDK en nodecontracten ophalen — 5 minuten

- Lees `get_sdk_reference` voor `essentials`, `guidelines` en `design`.
- Lees `get_workflow_best_practices` voor `data-processing`, `error-handling`, `reliability` en zo nodig `list`.
- Zoek nodes voor Manual Trigger, HTTP Request, HTML Extract/Code, Google Sheets, Split/Loop, Wait en Merge.
- Haal voor alle gekozen node-ID's de exacte types op met `get_node_types`.
- Gebruik `explore_node_resources` voor het echte spreadsheet-ID, tabnamen en credentialgebonden opties.

Verificatie:

- Alle gebruikte nodes en discriminatorwaarden komen uit actuele tooluitvoer.
- Geen parameternaam, operation mode, sheet-ID of credential-ID is gegokt.

### 7. Workflowcode opstellen en nodes afzonderlijk valideren — 5 minuten per sectie

Bouw één ongepubliceerde workflow met deze modulaire secties:

1. Manual Trigger en runcontext.
2. Lees `config` en valideer `bond_id=1` en precies twee toegestane seizoenen.
3. Discovery van seizoenen, divisies, locaties en teams.
4. Begrensde HTTP-ophaling met herkenbare User-Agent, pauze en retries.
5. HTML-parsing op tabelkoppen plus URL-parameters.
6. Normalisatie naar entiteitsobjecten en samengestelde `record_key`.
7. Sheets lookup/upsert per entiteit.
8. Sync-audit en datakwaliteitsuitvoer.

- Valideer iedere nodeconfiguratie met `validate_node_config` voordat deze wordt verbonden.
- Gebruik geen hardgecodeerde team-, speler-, locatie- of wedstrijd-ID's behalve bond-ID `1` en de twee goedgekeurde seizoenen in `config`.

Verificatie:

- Iedere nodeconfiguratie valideert zonder errors.
- Parserfixtures leveren minimaal één geldige divisie, locatie, team en bron-URL op.
- Een lege of afwijkende tabel levert een `data_quality`-record, geen lege succesvolle run.

### 8. Volledige workflow valideren en ongepubliceerd aanmaken — 3 minuten

- Valideer de volledige workflowcode met `validate_workflow` en herstel errors totdat `valid=true`.
- Maak de workflow aan met `create_workflow_from_code`, beschrijving en duidelijke nodeposities.
- Publiceer of activeer de workflow niet.

Verificatie:

- `validate_workflow` retourneert `valid=true` en nul errors.
- `get_workflow_details` bevestigt de workflownaam, nodecount en ongepubliceerde status.

Rollback:

- Bij een mislukte create wordt eerst gezocht of een gedeeltelijke workflow bestaat; geen tweede workflow met dezelfde functie creëren.
- Een aantoonbaar foutieve nieuwe workflow kan via `archive_workflow` worden gearchiveerd.

### 9. Fixtures en beperkte handmatige test — 5 minuten

- Pin of gebruik een kleine actuele RDB-fixture voor de discovery- en parsersecties.
- Test eerst zonder Sheets-write of met een begrensde dry-runuitvoer.
- Controleer aantallen en relaties handmatig tegen de openbare bronpagina's.

Verificatie:

- Minimaal één divisie, locatie, team en speler/teamrelatie is naar de juiste bron terug te leiden.
- Geen data buiten `d=1`, `26-27` en `25-26` komt door de scopefilter.
- Geen spelercontactgegevens verschijnen in node-output.

### 10. Eerste write-run uitvoeren — 5 minuten

- Start de workflow handmatig met testmodus en een begrensde hoeveelheid records.
- Controleer `sync_runs`, geschreven `record_key`s en bronvelden.
- Lees de doelranges direct terug uit Google Sheets.

Verificatie:

- Minimaal `divisions`, `venues`, `teams`, `players` en `team_memberships` bevatten geldige RDB-rijen.
- Elke rij heeft bron-URL, bronhash en tijdvelden.
- Er zijn geen dubbele `record_key`s.

### 11. Idempotentietest uitvoeren — 5 minuten

- Start exact dezelfde begrensde run nogmaals.
- Vergelijk rijaantallen, sleutels en `first_seen_at` vóór en na de tweede run.

Verificatie:

- Rijaantallen en unieke sleutels blijven gelijk.
- `first_seen_at` blijft behouden.
- Alleen `last_seen_at`, `last_scraped_at` en indien nodig bronhash/gewijzigde waarden veranderen.

### 12. Foutpad testen — 3 minuten

- Test met één bewust ongeldige feed-URL of fixture met gewijzigde tabelkop.
- Controleer dat de run niet stil als volledig succesvol eindigt.

Verificatie:

- `data_quality` bevat een specifieke fout met bron, parsersectie en run-ID.
- Bestaande geldige datarijen worden niet verwijderd of overschreven.

### 13. Keuze voor productiefoutmeldingen voorleggen — 2 minuten

Na bewezen handmatige werking wordt Sander gevraagd te kiezen:

- Een gedeelde/dedicated Error Trigger-workflow koppelen.
- Een Error Trigger in dezelfde workflow opnemen.
- Voor de proof-of-concept nog geen externe melding activeren en alleen `sync_runs`/`data_quality` gebruiken.

Er wordt geen foutmeldingskanaal stil gekozen of geactiveerd.

### 14. Visuele en inhoudelijke eindcontrole — 5 minuten

- Inspecteer alle relevante Google Sheet-tabbladen en representatieve rijen.
- Controleer clipping, filters, datumtypen, sleutels en privacygrenzen.
- Vergelijk steekproeven met de Teambeheer-bronpagina's.

Verificatie:

- Alle dertien tabbladen zijn aanwezig en bruikbaar.
- Geen formulefouten, dubbele sleutels of ongeoorloofde persoonsgegevens zijn aangetroffen.
- De twee bronspreadsheets zijn ongewijzigd.

### 15. Documenteren en taak afronden — 3 minuten

- Vul het onderzoeksrapport aan met de bewezen technische resultaten en beperkingen.
- Leg Google Sheet-URL, workflow-ID, testresultaten en bekende vervolgpunten vast in de taakuitkomst.
- Volg [[SOP-close-task]] en schrijf bij duurzame technische lessen een Daedalus-journalentry.

Verificatie:

- De taakuitkomst noemt wat is gebouwd, exacte verificatiebewijzen en wat bewust buiten scope bleef.
- De taak is pas `done` nadat alle acceptatiecriteria met verse uitvoer zijn bevestigd.

## Stopvoorwaarden

- Na drie mislukte pogingen met dezelfde fout stopt de uitvoering en rapporteert Daedalus de bewezen root cause.
- Bij onduidelijke toestemming/voorwaarden voor de openbare feeds stopt de live scraper vóór massale of geplande requests.
- Bij ontbrekende n8n- of Google Sheets-credentials stopt de uitvoering zonder credentials te vervangen of nieuwe accounts te koppelen.
- Bij parserdrift worden bestaande rijen nooit massaal inactief gemaakt op basis van één mislukte run.

## Implementatiestatus

- 2026-08-12 — Native Google Sheet met dertien tabbladen aangemaakt en geconfigureerd.
- 2026-08-12 — Handmatige kernworkflow gekoppeld aan de werkende Google Sheets-credential.
- 2026-08-12 — Locaties, teams en afgeleide divisies geïmplementeerd en tweemaal succesvol uitgevoerd.
- 2026-08-12 — Bewezen aantallen na de tweede run: 58 locaties, 100 teams (POC-limiet) en 12 divisies; alle `record_key`s uniek en niet leeg.
- 2026-08-12 — Voltooid: read-before-write behoudt `first_seen_at`; deltafilters voorkomen onnodige writes; spelers, lidmaatschappen, wedstrijden, sync-audit en foutpad zijn getest.
- 2026-08-12 — Uitvoeringen `1040` en `1041` bewijzen respectievelijk de prestatiesfeed en idempotente herhaling; de actuele toernooibron was leeg.
- 2026-08-12 — Workflow gepubliceerd en gepland voor iedere maandag 04:00 (`Europe/Amsterdam`), met centrale Gmail-foutmelding.

## Goedkeuringspoort

Na goedkeuring begint fase 3 van [[SOP-development-workflow]]. Dat autoriseert het aanmaken van één nieuwe native Google Sheet en één ongepubliceerde n8n-proof-of-conceptworkflow binnen de hierboven beschreven scope. Publicatie, scheduling, landelijke uitbreiding en externe foutmeldingen blijven afzonderlijke beslissingen.
