---
title: "Onderzoek — RDB Teambeheer scraper en levende dartdatabase"
date: 2026-08-12
status: completed
owner: athena
confidence: medium
linked_task: tsk-2026-08-12-001-teambeheer-scraper-database-onderzoek
---

# Onderzoek — RDB Teambeheer scraper en levende dartdatabase

## Executive summary

De openbare Teambeheer-feeds zijn technisch geschikt voor een begrensde RDB-proof-of-concept: de pagina's zijn server-rendered HTML en gebruiken herhaalbare identifiers voor bond, seizoen, divisie, team, speler, wedstrijd en speellocatie. Een discovery-first scraper kan daarmee actuele en historische sportrelaties reconstrueren zonder login of browserautomatisering.

De privacy- en gebruiksgrens is belangrijker dan de techniek. Teambeheer publiceert bepaalde spelersgegevens bewust op internet, maar openbaar betekent volgens de AVG niet vrij herbruikbaar. De proof-of-concept blijft daarom ongepubliceerd, gebruikt dataminimalisatie en vereist vóór periodieke productie een gedocumenteerde belangenafweging, transparantiebericht, bewaartermijn en correctie-/verwijderprocedure.

## Scope en onderzoeksvragen

Dit onderzoek beantwoordt:

1. Welke entiteiten, velden en relaties zijn via de openbare RDB-feeds te ontdekken?
2. Welke identifiers zijn voldoende stabiel voor idempotente synchronisatie?
3. Welke feedgroepen verdienen opname in de eerste proof-of-concept?
4. Welke technische en juridische beperkingen gelden?
5. Hoe moet een Google Sheets-prototype worden ingericht om later naar een relationele database te migreren?

Buiten scope: andere bonden, Facebookscraping, externe bondswebsites, scraping achter login en volledige historische productie-import.

## Belangrijkste bevindingen

### 1. De kernfeeds zijn zonder headless browser uitleesbaar — confidence: hoog

Directe HTTP-opvraging van de openbare RDB-pagina's retourneert HTML met tabellen en gewone links. De teamlijst bevat bijvoorbeeld teamnaam, speellocatie en divisie; de locatielijst bevat naam, adres, plaats en telefoon. Een HTTP-client plus HTML-parser volstaat voor de kernproef.

Bewijs:

- `https://feeds.teambeheer.nl/web/teamlijst?d=1&s=25-26`
- `https://feeds.teambeheer.nl/web/speelgelegenheden/?d=1`
- `https://feeds.teambeheer.nl/web/stand-allepoules/?d=1&s=25-26`
- Teambeheer omschrijft zelf real-time wedstrijdformulieren, statistieken, klassementen en uitslagen als onderdeel van het platform: `https://www.teambeheer.nl/`.

### 2. Discovery moet leidend zijn; voorbeeld-ID's mogen niet worden vertrouwd — confidence: hoog

De spreadsheet bevat nuttige voorbeeldparameters, maar verschillende voorbeeldlinks zijn leeg of verwijzen inmiddels naar een andere pagina. Actuele indexpagina's bevatten daarentegen links waarmee seizoenen, divisies, teams en locaties opnieuw ontdekt kunnen worden. De scraper moet daarom vanaf indexfeeds afdalen en geen vaste team-, speler- of wedstrijd-ID's als inventaris gebruiken.

### 3. Historische relaties zijn beschikbaar — confidence: hoog

De publieke seizoensnavigatie bevat voor RDB seizoenen van `05-06` tot en met `26-27`. Team- en spelerspagina's hebben secties voor seizoenshistorie. Daardoor zijn teamnamen, divisies, teamlidmaatschappen en prestaties door de tijd modelleerbaar. De proof-of-concept beperkt dit bewust tot `26-27` en `25-26`.

### 4. Teambeheer is breed genoeg voor een latere landelijke route — confidence: hoog

Teambeheer meldt 47 aangesloten dartbonden in Nederland en België en noemt RDB als gebruiker sinds 2003. De bestaande spreadsheet `dartbonden!nederland` bevat Teambeheer-ID's voor veel organisaties, maar ook onzekere, dubbele en informele records. Die spreadsheet is daarom een discovery-seed, geen gevalideerde masterlijst.

Bron: `https://www.teambeheer.nl/` en de door Sander verstrekte spreadsheet `dartbonden`.

### 5. Spelersnamen en statistieken blijven persoonsgegevens — confidence: hoog

De privacyverklaring van Teambeheer noemt voor- en achternaam, lidnummer en statistieken als gegevens die op internet kunnen komen. Telefoonnummer, geboortedatum en pasfoto zijn volgens die verklaring beperkt tot bedoelde doelgroepen en horen niet in deze scraper. De verklaring is gedateerd 24 april 2018 en kan verouderd zijn; vóór productie is schriftelijke bevestiging van Teambeheer/RDB verstandig.

Bron: `https://www.teambeheer.nl/docs/privacyverklaring.pdf`.

### 6. Openbaar beschikbare data vereisen nog steeds een AVG-grondslag — confidence: hoog

De Autoriteit Persoonsgegevens stelt in haar scrapinghandreiking dat de AVG vrijwel altijd van toepassing is zodra scraping persoonsgegevens verzamelt, ook wanneer die al openbaar op internet staan. Bij beroep op gerechtvaardigd belang zijn een concreet belang, noodzakelijkheid en een belangenafweging vereist. Het Hof van Justitie benoemt dezelfde drie cumulatieve voorwaarden en benadrukt dat minder ingrijpende alternatieven en dataminimalisatie moeten worden meegewogen.

Bronnen:

- `https://www.autoriteitpersoonsgegevens.nl/documenten/handreiking-scraping-door-particulieren-en-private-organisaties`
- `https://eur-lex.europa.eu/eli/reg/2016/679/art_6/par_1/pnt_f/oj`
- `https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62023CJ0394`

### 7. Robots.txt blokkeert de openbare feeds niet — confidence: hoog

Op 12 augustus 2026 retourneerde `https://feeds.teambeheer.nl/robots.txt`:

```text
User-Agent: *
Disallow:
```

Dit is technisch relevant maar geen juridische toestemming voor herpublicatie of persoonsgegevensverwerking.

## Feedinventaris

De bronspreadsheet noemt 31 feedtypen. Onderstaande matrix onderscheidt bevestigd uit de live RDB-verkenning van verwacht op basis van de feednaam/URL.

| Feed | Belangrijkste data | Sleutels | POC | Verificatie |
|---|---|---|---|---|
| Stand enkele poule | positie, team, wedstrijden, totaal, gemiddelde | `d,s,div,t` | ja | live bevestigd |
| Stand alle poules | divisies en standen | `d,s,div,t` | ja | live bevestigd |
| Beker | bekerpoules/-resultaten | `d,bp` | later | nog te verifiëren |
| Nacompetitie | nacompetitiewedstrijden/-standen | `d` | later | nog te verifiëren |
| Verzette wedstrijden | gewijzigde wedstrijddata | `d,w` | later | feed aanwezig |
| Speelgelegenheden | locatie, adres, plaats, telefoon | `d,s,cn` | ja | live bevestigd |
| 180'ers | speler, aantal/context | `d,s,t,filter,l` | beperkt | tabelstructuur aanwezig |
| Hoogste finishes | speler, finish/context | `d,s,t,filter,l` | beperkt | tabelstructuur aanwezig |
| Snelste leg | speler, leg/context | `d,s,t,filter,l` | later | feed aanwezig |
| Persoonlijk klassement | speler, wedstrijden, score/rang | `d,s,l` | later | feed aanwezig |
| Toernooiagenda | datum, speltype, toernooi, locatie, inschrijflink | `d,ts` | ja | live bevestigd |
| Toernooi aanmelden | invoerformulier | `d` | nee | mutatieformulier |
| Team | team, divisie, locatie, wedstrijden, spelers, prestaties, historie | `d,s,t,cn,l,w` | ja | structuur bevestigd; voorbeeld-ID verouderd |
| Team zoeken | team, locatie, divisie | `d,s,t,cn,div` | ja | live bevestigd |
| Teams vrije speelweek | teams/week | `d` | later | feed aanwezig |
| Speler | wedstrijden, single/koppels, 180, finish, teamhistorie | `d,l,s,t,w` | ja | structuur bevestigd; voorbeeld-ID leeg |
| Speler zoeken | spelerlookup | `d,l` | later | feed aanwezig |
| Wedstrijdformulier | team- en spelersresultaten | `d,w` | ja indien discoverable | voorbeeld-ID ongeldig/redirect |
| Ranking | rankingpositie/-punten | `d,s,rp,l` | later | feed aanwezig |
| 170 club | speler/prestatie | `d,l` | later | feed aanwezig |
| Strafpunten | team, reden/punten | `d,s,t` | later | feed aanwezig |
| Pouleindeling | divisie-teamrelaties | `d,s,div,t` | ja | feed aanwezig |
| Jaarkalender | competitiedata | `d,s` | later | feed aanwezig |
| Jaarprogramma | speeldatum, thuis/uit, wedstrijd | `d,s,div,t,w` | ja | links live bevestigd |
| Teams ingeschreven | inschrijvingen/teams | `d,s,t` | later | feed aanwezig |
| Speler van het seizoen | RDB-specifiek klassement | `d,s,l` | later | custom feed |
| Specialties cup | RDB-specifieke resultaten | `d,s,l` | later | custom feed |
| Teamronde klassement | RDO-specifiek | `d,s,t` | nee | buiten RDB |
| Inschrijfformulier leden | formulier/persoonsgegevens | `d` | nee | mutatie/privé-risico |
| Uitschrijfformulier leden | formulier/persoonsgegevens | `d` | nee | mutatie/privé-risico |
| Poulekampioenen | seizoen, divisie, kampioen | `d,s,div,t` | later | feed aanwezig |

## Identifier- en relatiemodel

Bevestigde/query-identifiers:

| Parameter | Betekenis | Gebruik in sleutel |
|---|---|---|
| `d` | dartbond | altijd opnemen; RDB=`1` |
| `s` | seizoen | opnemen voor seizoensgebonden entiteiten |
| `div` | divisie/poule | opnemen voor divisies; als vreemde sleutel bij teams/wedstrijden |
| `t` | intern Teambeheer-teamnummer | team-ID binnen bond; combineren met seizoen |
| `l` | speler/lid-ID | speler-ID binnen bond |
| `w` | wedstrijd-ID | wedstrijd-ID binnen bond |
| `cn` | speellocatie-/cafenummer | locatie-ID binnen bond; locatiegegevens kunnen per seizoen wijzigen |
| `bp` | bekerpoule | pas in bekerfase modelleren |
| `rp` | rankingparameter | pas in rankingfase modelleren |
| `filter` | queryfilter, geen entiteit | niet als duurzame primaire sleutel gebruiken |

Aanbevolen sleutels:

- `season_key = d|s`
- `division_key = d|s|div`
- `venue_key = d|s|cn`
- `team_key = d|s|t`
- `player_key = d|l`
- `membership_key = d|s|t|l`
- `match_key = d|w`

## Datamodel voor de proof-of-concept

De nieuwe Sheet krijgt genormaliseerde tabbladen voor `seasons`, `divisions`, `venues`, `teams`, `players`, `team_memberships`, `matches`, `player_results`, `achievements`, `tournaments`, `sync_runs` en `data_quality`, plus `config`.

Iedere duurzame rij krijgt herkomstvelden en waarnemingshistorie:

- `record_key`
- `source_url`
- `source_hash`
- `first_seen_at`
- `last_seen_at`
- `last_scraped_at`
- `is_active`

Google Sheets is een prototype en beheerinterface. Wanneer meerdere bonden, volledige historie of analyses over miljoenen resultaatregels nodig worden, verhuist dezelfde structuur naar PostgreSQL/Supabase en blijft Sheets een rapportagelaag.

## Privacy-by-design maatregelen

1. Verwerk alleen openbare feedpagina's; geen account-, captain- of ledenadministratiepagina's.
2. Sta in het spelersmodel alleen publieke naam, Teambeheer-ID, teamrelatie en sportstatistiek toe.
3. Blokkeer velden voor e-mail, spelertelefoon, geboortedatum, geslacht, foto, adres en lidnummer tenzij een latere afzonderlijke juridische beoordeling anders uitwijst.
4. Gebruik bron-URL en correctie-/verwijderstatus om verzoeken uitvoerbaar te maken.
5. Stel voor productie een bewaartermijn en doelomschrijving vast.
6. Publiceer de verzamelde spelersdatabase niet automatisch op internet.
7. Voer vóór landelijke of commerciële inzet een gedocumenteerde legitimate-interest assessment uit en laat deze zo nodig juridisch toetsen.
8. Informeer Teambeheer en RDB over de voorgenomen periodieke verwerking en vraag bij voorkeur schriftelijke toestemming of een officiële datafeed/API.

## Technische risico's en beheersing

| Risico | Impact | Beheersing |
|---|---|---|
| HTML-layout verandert | parser levert lege/onjuiste data | parser op koppen en URL-parameters; schema-drift naar `data_quality` |
| Voorbeeld-ID verloopt | lege detailpagina | discovery-first; geen inventaris op vaste voorbeelden |
| Eén lege run deactiveert alles | dataverlies in afgeleide laag | pas inactiveren na herhaalde succesvolle discovery zonder record |
| Te veel requests | belasting/429/blokkade | sequentieel, instelbare pauze, begrensde retries, handmatige backfill |
| Sheets lookup wordt traag | lange runs/quotafouten | hashes, batches, POC-volume; later database |
| Namen veranderen/dubbel voorkomen | foutieve deduplicatie | Teambeheer-ID leidend; naam nooit primaire sleutel |
| Persoonsgegevens worden verrijkt | AVG-risico | expliciete allowlist en verboden velden |

## Methodologie

- Bronspreadsheets via Google Sheets-metadata en begrensde ranges gelezen.
- Live RDB-pagina's rechtstreeks via HTTPS opgehaald en tabelkoppen/links geïnspecteerd.
- `robots.txt` en de Teambeheer-privacyverklaring opgehaald; de PDF tekstueel én visueel gecontroleerd.
- Juridische conclusies getrianguleerd via de AP, AVG/EUR-Lex, rechtspraak en een mechanisch onafhankelijk Perplexity-zoekpad.
- Claims alleen als hoog gemarkeerd wanneer een primaire bron of direct live bewijs beschikbaar was.

## Beperkingen

- Teambeheer publiceert geen aangetroffen officiële API-documentatie voor deze feeds.
- De privacyverklaring dateert uit 2018; actuele contractvoorwaarden tussen RDB en Teambeheer zijn niet ingezien.
- Niet elk van de 31 feedtypen is in deze eerste pass inhoudelijk gevuld of volledig geparseerd.
- Sommige voorbeeld-ID's uit de spreadsheet zijn verouderd, waardoor detailvelden pas na actuele discovery bevestigd kunnen worden.
- Dit rapport is een technische/privacy-risicoanalyse en geen juridisch advies.

## Aanbevelingen

1. Bouw de afgesproken ongepubliceerde RDB-proof-of-concept met twee seizoenen en lage requestfrequentie.
2. Valideer eerst locaties, divisies, teams en teamrelaties; activeer spelersresultaten pas na gecontroleerde discovery.
3. Vraag Teambeheer/RDB parallel om een officiële export, API of schriftelijke toestemming voor periodiek ophalen.
4. Maak vóór productie een beknopte belangenafweging, privacyinformatie en correctie-/verwijderprocedure.
5. Gebruik de proof-of-concept om volume, parserdrift en Google Sheets-limieten te meten voordat landelijke opschaling wordt ontworpen.

## Bewezen POC-resultaat — 12 augustus 2026

De actieve n8n-workflow `RDB Teambeheer — Discover & Sync` (`DtxHhHvuCJrIi9WB`) schrijft naar de afzonderlijke Google Sheet `RDB Teambeheer Database`.

Verse controlerun `1024` leverde 2 seizoensrecords, 12 divisies, 58 speellocaties, 100 teams (POC-limiet), 78 publieke spelers, 78 teamlidmaatschappen en 100 wedstrijden (POC-limiet uit tien teamdetailpagina's). Alle geschreven entiteitssleutels waren gevuld en uniek. Foutpadtest `1023` met een lege teamparserfixture schreef aantoonbaar een `parser_empty_or_misaligned`-issue naar `data_quality`; na de normale controlerun is dit testissue als opgelost gemarkeerd.

De uitbreidingsrun vulde daarnaast 200 historische prestaties (100 180-scores en 100 hoogste finishes). De toernooiroute is actief en gevalideerd, maar de actuele bron bevatte tijdens de test geen toernooien. `player_results` blijft leeg zolang de huidige competitiewedstrijden nog geen uitslagen hebben; er worden geen resultaten verzonnen.

Read-before-write bewaart `first_seen_at`. Deltafilters schrijven alleen nieuwe of gewijzigde rijen, waarmee de eerder waargenomen Google Sheets-writequota werd opgelost. Uitvoering `1040` vulde de prestaties; de ongewijzigde herhaalrun `1041` slaagde zonder entiteitstimestamps te veranderen.

De workflow is gepubliceerd met actieve versie `d0d1f3d4-7d78-48eb-a23f-c4993a210998` en draait iedere maandag om 04:00 in `Europe/Amsterdam`. Productiefouten gaan naar de gepubliceerde centrale foutworkflow `AP0jYtVaWajQPBfN`, die via Gmail waarschuwt.

Na uitbreiding naar alle honderd teamdetailpagina's slaagde uitvoering `1045` in 3 minuten en 6 seconden zonder quotafout. De limiet van honderd wedstrijden is verwijderd; `matches` bevat nu 1.587 gegevensrijen, waaronder 25 wedstrijden voor D.T. Irritant (`team_id 394`). De actieve workflowversie is `b5f2cd36-a34c-4b3d-beb8-7bafef034a4b`.
