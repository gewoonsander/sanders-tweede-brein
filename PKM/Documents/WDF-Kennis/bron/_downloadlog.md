# Downloadlog WDF-reglementen

- **Opgehaald door:** Daedalus (Automation Specialist), op 2026-08-21, in het kader van [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]].
- **Downloaddatum:** 2026-08-21
- **Bronpagina:** <https://dartswdf.com/rules> (het verzamelblad waarop de WDF al haar reglementen publiceert)
- **Stagingmap:** `PKM/Documents/WDF-Kennis/bron/`
- **Auth-model:** publieke, niet-geauthenticeerde HTTPS-URL's op `dartswdf.com/storage/uploads/...`. Er is geen login of API-sleutel bij betrokken.
- **Methode:** `curl`. Volgens het taakverslag waren de firecrawl-tools in die subagent-context niet beschikbaar; directe download plus eigen parsing is toen als route gekozen. Tekstextractie daarna met `pypdf`.

> **Herkomst van dit logboek.** Dit bestand is op 2026-08-21 achteraf samengesteld door Atlas tijdens de migratie van dit archief naar het GL-002 Documents-schema. De bron-URL's, revisienummers, revisiedatums en paginatellingen komen letterlijk uit de oorspronkelijke frontmatter die Daedalus per kennisbestand had vastgelegd; de bestandsgroottes zijn gemeten op schijf; de procedurele regels hierboven komen uit de `## Updates`-regels van het taakbestand. Er is niets bijgeschat. Waar het taakverslag geen uitsluitsel geeft, staat dat er expliciet bij.
>
> **Naschrift 2026-08-21, 16:03 (Daedalus).** Document 16 (WDF Bye-Laws rev 34) is ná die migratie toegevoegd, na een expliciete scopeverruiming door Sander. Voor dat document zijn de gegevens hieronder **niet** gereconstrueerd maar direct gemeten tijdens de download: `curl` met `--retry 3 --retry-delay 2` en een browser-User-Agent, HTTP 200, 245.381 bytes ontvangen, `Content-Type: application/pdf`, magicbytes gecontroleerd (`%PDF-1.3`), SHA-256 `3d3c3cf751a3f438e56885a5ce8258ed2c0fc015c8e778605228daff5b3f5c6f`, paginatelling via `pdfinfo` (10). Tekstextractie met `pdftotext -layout`; de bepalingen die zijn overgenomen zaten volledig in de tekstlaag, dus geen visuele uitlezing nodig.

## Samenvatting

| | Aantal |
|---|---|
| In scope gestelde documenten op de bronpagina | 15 PDF's + 6 websitepagina's |
| Succesvol gedownload | 15 PDF's (14 op 2026-08-21 in de eerste ronde, 1 na scopeverruiming) |
| Mislukt | 0 |
| Websitepagina's uitgelezen (geen bestand op schijf) | 6 |
| Bewust buiten scope gelaten | zie §Scopekeuzes |

Totale omvang van `bron/` op schijf: 4.572.642 bytes (4,6 MB) over 15 PDF's; vóór toevoeging van document 16 was dat 4.327.261 bytes over 14. Alle 15 bestanden zijn echte PDF's met een tekstlaag — geen scans.

## Gedownloade documenten

| # | Titel | Categorie | Bron-URL | Lokaal bestand | Revisie | Documentdatum | Omvang | Grootte | Kennisbestand |
|---|---|---|---|---|---|---|---|---|---|
| 01 | WDF Playing and Tournament Rules | Spelregels | [bron](https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-02-28_WDF_Playing_and_Tournament_Rules_rev20.pdf) | `01-playing-and-tournament-rules-rev20.pdf` | rev 20 | 2018-02-28 | 15 p. | 409 kB | [[01-spelregels-en-toernooireglement]] |
| 02 | WDF World Champs Qualification Criteria — Senior | Kwalificatiecriteria | [bron](https://dartswdf.com/storage/uploads/dc1d2527-99b5-4df7-9375-6ef75d776403/2026-06-02_WDF_World_Champs_Qualification_Criteria-Senior.pdf) | `02-world-champs-qualification-senior.pdf` | geen rev-nr in de bron | 2026-06-02 | 3 p. | 303 kB | [[02-kwalificatie-world-championship-senior]] |
| 03 | WDF World Champs Qualification Criteria — Youth | Kwalificatiecriteria | [bron](https://dartswdf.com/storage/uploads/dc1d2527-99b5-4df7-9375-6ef75d776403/2026-06-02_WDF_World_Champs_Qualification_Criteria-Youth.pdf) | `03-world-champs-qualification-youth.pdf` | geen rev-nr in de bron | 2026-06-02 | 2 p. | 246 kB | [[03-kwalificatie-world-championship-youth]] |
| 04 | World Masters 2027 Qualification Criteria — Seniors | Kwalificatiecriteria | [bron](https://dartswdf.com/storage/uploads/d68f3c8b-9b86-4e10-a992-ac2efd3c5fe7/2026-08-06_World_Masters_2027_Qualification_Criteria-Seniors.pdf) | `04-world-masters-2027-qualification-senior.pdf` | geen rev-nr in de bron | 2026-08-06 | 2 p. | 261 kB | [[04-kwalificatie-world-masters-2027-senior]] |
| 05 | World Masters 2027 Qualification Criteria — Youth | Kwalificatiecriteria | [bron](https://dartswdf.com/storage/uploads/d68f3c8b-9b86-4e10-a992-ac2efd3c5fe7/2026-08-06_World_Masters_2027_Qualification_Criteria-Youth.pdf) | `05-world-masters-2027-qualification-youth.pdf` | geen rev-nr in de bron | 2026-08-06 | 2 p. | 274 kB | [[05-kwalificatie-world-masters-2027-youth]] |
| 06 | World Ranking Systems Criteria — Seniors | Ranking-systeem | [bron](https://dartswdf.com/storage/uploads/38d5fbd0-8bd7-417c-9bf2-c165c88677e9/2026-03-05_World_Ranking_Systems_Criteria_Seniors_49.pdf) | `06-ranking-criteria-seniors-49.pdf` | rev 49 | 2026-03-05 | 12 p. | 329 kB | [[06-ranking-systeem-senior]] |
| 07 | World Ranking Systems Criteria — Youth | Ranking-systeem | [bron](https://dartswdf.com/storage/uploads/9edf2e32-61f5-4ca8-888b-197e7034acef/2026-03-05_World_Ranking_Systems_Criteria_Youth_18.pdf) | `07-ranking-criteria-youth-18.pdf` | rev 18 | 2026-03-05 | 10 p. | 281 kB | [[07-ranking-systeem-youth]] |
| 08 | World Ranking Systems Criteria — U23 | Ranking-systeem | [bron](https://dartswdf.com/storage/uploads/0f7ddfcd-0c13-42b3-aa5b-c8ca3f95c7dd/2026-03-05_World_Ranking_Systems_Criteria_U23_4.pdf) | `08-ranking-criteria-u23-4.pdf` | rev 4 | 2026-03-05 | 10 p. | 283 kB | [[08-ranking-systeem-u23]] |
| 09 | WDF World Cup Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/637e0855-6dcb-4e8d-95aa-6f4f54ee4e5e/2025-08-12_WDF_World_Cup_Rules_rev_28.pdf) | `09-world-cup-rules-rev28.pdf` | rev 28 | 2025-08-12 | 12 p. | 362 kB | [[09-cup-world-cup]] |
| 10 | WDF World Cup Youth Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/637e0855-6dcb-4e8d-95aa-6f4f54ee4e5e/2025-08-12_WDF_World_Cup_Youth_Rules_rev_8.pdf) | `10-world-cup-youth-rules-rev8.pdf` | rev 8 | 2025-08-12 | 12 p. | 297 kB | [[10-cup-world-cup-youth]] |
| 11 | WDF Americas Cup Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-07-20_WDF_Americas_Cup_Rules_rev_4.pdf) | `11-americas-cup-rules-rev4.pdf` | rev 4 | 2018-07-20 | 17 p. | 436 kB | [[11-cup-americas]] |
| 12 | WDF Asia-Pacific Cup Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/fb05b306-c92c-4f08-b512-affb092a1b3d/2018-10-09_WDF_Asia-Pacific_Cup_Rules_rev3.pdf) | `12-asia-pacific-cup-rules-rev3.pdf` | rev 3 | 2018-10-09 | 10 p. | 301 kB | [[12-cup-asia-pacific]] |
| 13 | WDF Europe Cup Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/b7f75d39-2eab-46c8-b6d2-a1bbb6b7009f/2024-01-20_WDF_Europe_Cup_Rules_rev_19.pdf) | `13-europe-cup-rules-rev19.pdf` | rev 19 | 2024-01-20 | 13 p. | 236 kB | [[13-cup-europe]] |
| 14 | WDF Europe Cup Youth Rules | Cup-reglementen | [bron](https://dartswdf.com/storage/uploads/0f17c4d6-5ff5-46a6-b06f-d85d45997966/2026-04-08_WDF_Europe_Cup_Youth_Rules_rev_15.pdf) | `14-europe-cup-youth-rules-rev15.pdf` | rev 15 | 2026-03-10 *(zie §Aandachtspunten)* | 12 p. | 310 kB | [[14-cup-europe-youth]] |
| 16 | WDF Bye-Laws | Bestuurlijk *(alleen deelnamegerechtigdheid)* | [bron](https://dartswdf.com/storage/uploads/1272e6a8-8146-4ca8-b0a8-14bd9670170a/2024-09-24-_Bye-Laws_rev_34.pdf) | `16-bye-laws-rev34.pdf` | rev 34 | 2024-09-24 | 10 p. | 245 kB | [[16-bye-laws-deelnamegerechtigdheid]] |

*(Nummer 15 ontbreekt in deze tabel omdat kennisbestand [[15-organisatiestructuur-en-leden]] op websitepagina's berust en geen PDF in `bron/` heeft. De nummering van de kennisbestanden loopt wel door, dus het Bye-Laws-bestand is nummer 16.)*

**Document 16 is op 2026-08-21 om 16:03 apart opgehaald**, ná de eerste ronde en ná de schema-migratie, op grond van een expliciete scopeverruiming door Sander: alleen de eligibility-bepalingen erbij, niet de volledige Bye-Laws. Het kennisbestand neemt daarom **niet het hele reglement** samen maar clausule 2.01 en 7.05 plus de direct ondersteunende bepalingen (2.02, 3.04/3.05, 6.01–6.03, 7.01, 7.04, 7.08/7.09). Wat bewust is weggelaten, staat opgesomd in het kennisbestand zelf.

## Uitgelezen websitepagina's (geen bestand in `bron/`)

Kennisbestand [[15-organisatiestructuur-en-leden]] is niet op een PDF gebaseerd maar op zes pagina's van dartswdf.com, uitgelezen op 2026-08-21. Er is dus geen revisienummer en geen lokale bronkopie; de ophaaldatum is de peildatum.

| Pagina | URL |
|---|---|
| Organisatie / bestuur | <https://dartswdf.com/organisation> |
| Ledenlijst | <https://dartswdf.com/members> |
| WDF Cups | <https://dartswdf.com/wdf-cups> |
| WDF Majors | <https://dartswdf.com/wdf-majors> |
| Toernooien | <https://dartswdf.com/tournaments> |
| Reglementenoverzicht | <https://dartswdf.com/rules> |

De ledenlijst vermeldt volgens de oorspronkelijke vastlegging april 2026 als laatste actualisering.

## Mislukte downloads

Geen. Alle 15 in scope gestelde PDF's zijn opgehaald en bevatten een leesbare tekstlaag; nul documenten waren onleesbaar.

## Scopekeuzes (expliciet, niet stilzwijgend overgeslagen)

1. **De bestuurlijke en juridische laag is bewust niet opgehaald** — met één uitzondering sinds 2026-08-21 16:03: de **Bye-Laws (rev 34)** zijn wél opgehaald, maar uitsluitend voor de eligibility-bepalingen (zie punt 2 hieronder). Op <https://dartswdf.com/rules> staan daarnaast: WDF Constitution (rev 31, 2024-09-24), Special Officers and Delegates (rev 1, 2019-10-07), Anti-Corruption Code of Practice (rev 2, 2018-10-01), Anti-Doping Rules (2022-05-01) plus Player Consent Form, Code of Ethics (rev 1, 2018-12-02), Conflict of Interest Policy (rev 1, 2018-12-02), Disciplinary Code of Practice (rev 13, 2024-09-24), Transgender Athlete Policy (rev 2, 2025-07-25), de vijf commissie-chartes (Athletes, Athletes Entourage, Sport for All, Women in Sport, Youth in Sport — alle 2019-10-07), International Youth Challenge Rules (rev 2, 2025-02-09) en de drie regionale council-statuten (European, African, Asia/Pacific Darts Council, alle rev 1, 2024). Reden: Sander bakende de opdracht af tot spelregels, kwalificatie, ranking en organisatiestructuur. Zie ook §Bewust buiten scope in [[PKM/Documents/WDF-Kennis/INDEX|INDEX]].

2. **De Bye-Laws: alleen de eligibility-bepalingen, bewust smal.** Meerdere in-scope documenten verwijzen naar Bye-Law 2.01 en 7.05. Op 2026-08-21 koos Sander ervoor die alsnog toe te voegen — maar **niet** het volledige reglement. Opgenomen in [[16-bye-laws-deelnamegerechtigdheid]]: clausule 2.01 (definitie Playing Member), clausule 7.05 (Eligibility Rule voor World Cup en Area Cups) en de bepalingen die nodig zijn om die twee toe te passen (2.02, 3.04/3.05, 6.01–6.03, 7.01, 7.04, 7.08/7.09). **Niet** opgenomen: 1.00, 3.01–3.03, 3.06–3.07, 4.00, 5.00, 7.02, 7.03, 7.06, 7.07, 7.10 en 7.11. De volledige PDF staat wel in `bron/`, dus wie het hele reglement nodig heeft kan het daar nalezen.

3. **Voor de Africa Cup, de Americas Cup Youth en de Pacific Cup bestaat geen gepubliceerd reglement** op de bronpagina, terwijl die toernooien wel in het sitemenu staan. Er viel dus niets te downloaden.

4. **Actuele ranglijststanden zijn bewust niet gearchiveerd.** Die veranderen wekelijks; <https://dartswdf.com/tables> is daarvoor de levende bron.

## Aandachtspunten voor een volgende ophaalronde

- **Twee data bij document 14.** De bestandsnaam en de `/rules`-pagina noemen 08-04-2026; het document zelf draagt op elke pagina 10 March 2026. `issued_on` in het kennisbestand staat op 2026-03-10 (de datum in het document). Let bij versiecontrole op beide.
- **Revisienummers zitten in de bestandsnamen** van de WDF-PDF's (`..._rev20.pdf`, `..._Seniors_49.pdf`). Dat maakt detectie van een herziening goedkoop: vergelijk de bestandsnamen op `/rules` met het revisieregister in [[PKM/Documents/WDF-Kennis/INDEX|INDEX]].
- **Vier documenten zijn seizoensgebonden** (02, 03 voor het WK 2026; 04, 05 voor het World Masters 2027) en verlopen vanzelf.
- **Negen pagina's bevatten tabellen als ingesloten afbeelding**, zonder tekstlaag — onder meer de puntentabellen, de prijzengeld-gradingtabel en de regionale-indelingstabel. Die zijn op 165–170 dpi gerenderd en visueel uitgelezen. Eén diagram (bordopstelling/oche, Playing Rules p. 8) is niet overgenomen; het bevat geen maten die niet al in de tekst staan.
- **Niet in het taakverslag vastgelegd**, en dus hier niet als feit opgevoerd: of `curl` bij de **eerste veertien** documenten met retries/backoff werkte, of de PDF-magicbytes vóór plaatsing zijn geverifieerd, en welke User-Agent is gebruikt. Wie de download herhaalbaar wil maken zoals bij het NDB-archief, moet dat alsnog vastleggen. Voor **document 16** is dat wél vastgelegd — zie het naschrift bovenaan.
- **Document 16 draagt geen auteursrechtclausule.** In de tekstlaag van `16-bye-laws-rev34.pdf` komt geen enkele vermelding van copyright, reprint, reproduction of duplication voor, anders dan bij de overige WDF-reglementen. Dezelfde parafraseernorm is er niettemin op toegepast, zodat het hele archief één lijn houdt.
- **Revisiedetectie bij document 16:** het revisienummer staat zowel in de bestandsnaam (`..._Bye-Laws_rev_34.pdf`) als in de voettekst van elke pagina ("34th revised edition"). De revisienotities (§8.00) noemen bovendien welke clausules per editie zijn gewijzigd — de eerste plek om te kijken of een nieuwe editie 2.01 of 7.05 raakt.

## Auteursrecht

De WDF-reglementen dragen een expliciete clausule dat de inhoud niet mag worden herdrukt, gekopieerd of anderszins gereproduceerd, geheel of gedeeltelijk. De PDF's in `bron/` zijn daarom uitsluitend een privé-bronkopie ter verificatie; de kennisbestanden bevatten Nederlandstalige samenvattingen met behoud van de feitelijke getallen, geen woordelijke kopie.

Uitzondering op de constatering, niet op de norm: in `16-bye-laws-rev34.pdf` staat **geen** auteursrechtclausule. Dat document is desondanks op dezelfde manier behandeld — samengevat en geparafraseerd, niet woordelijk overgenomen.

## Verwant

- [[PKM/Documents/WDF-Kennis/INDEX|WDF-kennisbasis]] — de index en het revisieregister van dit archief
- [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]] — de taak waaronder dit archief is opgebouwd
