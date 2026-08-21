# WDF-kennisbasis

Lokale, brongebaseerde kennis over de **World Darts Federation**. Opgebouwd uit **15 officiële
PDF-reglementen** plus zes pagina's van dartswdf.com, opgehaald op **21 augustus 2026**.

Wordt gebruikt door de skill **`/wdf-regels`**. Het doel is dat een antwoord over WDF-regels
gebaseerd is op wat er daadwerkelijk in de reglementen staat — niet op wat een taalmodel zich meent
te herinneren.

## Hoe dit is opgebouwd

Elk bestand is een **Nederlandstalige samenvatting** van één brondocument, met **behoud van alle
feitelijke getallen**: maten, afstanden, punten, quota, bedragen, termijnen en artikelnummers. Dat is
een bewuste keuze: de WDF-reglementen dragen een expliciete auteursrechtclausule ("may not be
reprinted, copied, duplicated, or otherwise reproduced, wholly, or in part"), dus er staat hier geen
woordelijke kopie van de brontekst. Feiten en getallen zijn niet auteursrechtelijk beschermd; de
formulering wel.

Eén bestand wijkt in opzet af: [[16-bye-laws-deelnamegerechtigdheid]] vat **niet het hele
brondocument** samen, maar alleen de clausules over deelnamegerechtigdheid plus de bepalingen die
nodig zijn om die toe te passen. Wat er bewust níet in staat, somt dat bestand zelf op.

De **originele PDF's staan in `bron/`**, zodat elke bewering te verifiëren is tegen het echte
document en zodat een latere revisie te vergelijken valt. Herkomst, bron-URL's en
downloadverantwoording staan in [[PKM/Documents/WDF-Kennis/bron/_downloadlog|_downloadlog]].

Elk kennisbestand draagt het **Documents-schema uit [[GL-002-frontmatter-conventions]]** (`title`,
`doc_type: other`, `digital_location`, `issued_on`, `tags`) en noemt via `digital_location` het pad
naar zijn eigen brondocument. Revisienummer, revisiedatum, paginatelling en geldigheidsduur staan
narratief in de sectie `## Documentversie` van elk bestand — niet in YAML. Dit bestand zelf is een
index-hub en heeft dus geen frontmatter, net als [[PKM/Documents/NDB-Kennis/INDEX|het NDB-archief]].

## De bestanden

### Spelregels
| Bestand | Onderwerp |
|---|---|
| [[01-spelregels-en-toernooireglement]] | Playing and Tournament Rules — de worp, starten/finishen, scoren, bordspecificatie, verlichting, oche, en alle toernooiregels |

### Kwalificatiecriteria
| Bestand | Onderwerp |
|---|---|
| [[02-kwalificatie-world-championship-senior]] | WK 2026, Open (48) en vrouwen (24) |
| [[03-kwalificatie-world-championship-youth]] | Jeugd-WK 2026, Open Youth (12) en Girls (6) |
| [[04-kwalificatie-world-masters-2027-senior]] | World Masters 2027 senioren, elf routes incl. landeninvitaties |
| [[05-kwalificatie-world-masters-2027-youth]] | Youth World Masters 2027, negen routes |

### Ranking-systeem
| Bestand | Onderwerp |
|---|---|
| [[06-ranking-systeem-senior]] | **Het belangrijkste rankingdocument** — gradering, punten, ranglijsten, regio-indeling, formats, prijzengeld |
| [[07-ranking-systeem-youth]] | Jeugdvariant — gradering op deelnemersaantal, geen levy, alcoholverbod |
| [[08-ranking-systeem-u23]] | Under 23-variant — vrijwel identiek aan de jeugd, leeftijdsband 18–23 |

### Cup-reglementen
| Bestand | Onderwerp |
|---|---|
| [[09-cup-world-cup]] | World Cup — oneven jaren, alle landen |
| [[10-cup-world-cup-youth]] | World Cup Youth — gelijktijdig, vijf onderdelen incl. mixed pairs |
| [[11-cup-americas]] | Americas Cup — eigen regionale raad en eigen afwijkende speelregels |
| [[12-cup-asia-pacific]] | Asia-Pacific Cup — team van 4 mannen + 2 vrouwen, eigen puntenschaal |
| [[13-cup-europe]] | Europe Cup — even jaren, **relevant voor Nederland** |
| [[14-cup-europe-youth]] | Europe Cup Youth — **jaarlijks**, relevant voor Nederland |

### Organisatie
| Bestand | Onderwerp |
|---|---|
| [[15-organisatiestructuur-en-leden]] | Wat de WDF is, bestuur, ledenlijst incl. **Nederland**, Majors, Cups, toernooienlandschap |

### Deelnamegerechtigdheid
| Bestand | Onderwerp |
|---|---|
| [[16-bye-laws-deelnamegerechtigdheid]] | Bye-Laws **2.01** (wie is Playing Member) en **7.05** (Eligibility Rule voor World Cup en Area Cups), plus de bepalingen die nodig zijn om ze toe te passen — *alleen die clausules, niet het hele reglement* |

## Revisieregister — controleer hierop bij een update

De WDF publiceert regelmatig nieuwe revisies. Vergelijk deze tabel met https://dartswdf.com/rules om
te zien of de kennisbasis achterloopt. Wijzigt een revisienummer of -datum, dan moet het betreffende
bestand opnieuw opgebouwd worden.

| # | Document | Revisie | Datum in bron | Bestand |
|---|---|---|---|---|
| 01 | Playing and Tournament Rules | **rev 20** | 28-02-2018 | [[01-spelregels-en-toernooireglement]] |
| 02 | World Champs Qualification — Senior | *(geen rev-nr)* | 02-06-2026 | [[02-kwalificatie-world-championship-senior]] |
| 03 | World Champs Qualification — Youth | *(geen rev-nr)* | 02-06-2026 | [[03-kwalificatie-world-championship-youth]] |
| 04 | World Masters 2027 Qualification — Seniors | *(geen rev-nr)* | 06-08-2026 | [[04-kwalificatie-world-masters-2027-senior]] |
| 05 | World Masters 2027 Qualification — Youth | *(geen rev-nr)* | 06-08-2026 | [[05-kwalificatie-world-masters-2027-youth]] |
| 06 | World Ranking Systems Criteria — Seniors | **rev 49** | 05-03-2026 | [[06-ranking-systeem-senior]] |
| 07 | World Ranking Systems Criteria — Youth | **rev 18** | 05-03-2026 | [[07-ranking-systeem-youth]] |
| 08 | World Ranking Systems Criteria — U23 | **rev 4** | 05-03-2026 | [[08-ranking-systeem-u23]] |
| 09 | World Cup Rules | **rev 28** | 12-08-2025 | [[09-cup-world-cup]] |
| 10 | World Cup Youth Rules | **rev 8** | 12-08-2025 | [[10-cup-world-cup-youth]] |
| 11 | Americas Cup Rules | **rev 4** | 20-07-2018 | [[11-cup-americas]] |
| 12 | Asia-Pacific Cup Rules | **rev 3** | 09-10-2018 | [[12-cup-asia-pacific]] |
| 13 | Europe Cup Rules | **rev 19** | 20-01-2024 | [[13-cup-europe]] |
| 14 | Europe Cup Youth Rules | **rev 15** | bestandsnaam 08-04-2026 / document 10-03-2026 | [[14-cup-europe-youth]] |
| 15 | Organisatiepagina's (geen PDF) | n.v.t. | opgehaald 21-08-2026 | [[15-organisatiestructuur-en-leden]] |
| 16 | Bye-Laws *(alleen 2.01 en 7.05 c.a.)* | **rev 34** | 24-09-2024 | [[16-bye-laws-deelnamegerechtigdheid]] |

**Seizoensgebonden documenten** — deze verlopen vanzelf en moeten elk jaar vervangen worden:
02, 03 (WK 2026), 04, 05 (World Masters 2027).

**Verouderingsrisico** — deze documenten zijn het oudst en het meest kansrijk om intussen herzien te
zijn, of om afgeweken te worden door nieuwere documenten: 01 (2018), 11 (2018), 12 (2018).

## Bewust buiten scope

De volgende documenten staan wél op https://dartswdf.com/rules maar zijn **niet** in deze kennisbasis
opgenomen. Dat is een expliciete keuze van Sander bij de opdracht (bestuurlijke en juridische laag
viel buiten wat hij vroeg), geen omissie. Krijg je een vraag hierover: zeg dat het buiten de
kennisbasis valt en bied aan het alsnog op te halen.

- WDF Constitution (rev 31, 24-09-2024)
- WDF Bye-Laws (rev 34, 24-09-2024) — **gedeeltelijk wél opgenomen sinds 21-08-2026.** De clausules
  over deelnamegerechtigdheid (2.01, 7.05 en wat daarbij hoort) staan in
  [[16-bye-laws-deelnamegerechtigdheid]]; de overige hoofdstukken (federatie, contributieschema voor
  zover niet deelnamerelevant, vergader- en stemprocedures, 7.02, 7.03, 7.06, 7.07, 7.10, 7.11)
  blijven buiten scope. De volledige PDF staat wel in `bron/`.
- WDF Special Officers and Delegates (rev 1, 07-10-2019)
- WDF Anti-Corruption Code of Practice (rev 2, 01-10-2018)
- WDF Anti-Doping Rules (01-05-2022) en het Player Consent Form
- WDF Code of Ethics (rev 1, 02-12-2018)
- WDF Conflict of Interest Policy (rev 1, 02-12-2018)
- WDF Disciplinary Code of Practice (rev 13, 24-09-2024)
- WDF Transgender Athlete Policy (rev 2, 25-07-2025)
- De vijf commissie-chartes (Athletes, Athletes Entourage, Sport for All, Women in Sport, Youth in
  Sport — alle 07-10-2019)
- WDF International Youth Challenge Rules (rev 2, 09-02-2025)
- De drie regionale council-statuten (European, African, Asia/Pacific Darts Council, alle rev 1, 2024)

Daarnaast bestaan er **geen** gepubliceerde reglementen voor de Africa Cup, de Americas Cup Youth en
de Pacific Cup, terwijl die wel in het sitemenu staan.

## Bekende beperkingen van deze kennisbasis

Eerlijk vastgelegd, zodat de skill weet waar hij níet op kan leunen:

1. **Actuele standen ontbreken.** Ranglijsten, Race Tables en uitslagen veranderen wekelijks en zijn
   niet opgenomen. Voor "wie staat er nu eerste" moet https://dartswdf.com/tables geraadpleegd worden.
2. **Negen pagina's met tabellen als afbeelding** zijn visueel uitgelezen in plaats van via de
   tekstlaag: de prijzengeld-gradingtabel en de knock-out-, prijzengeld- en regiotabellen in de
   ranking-documenten, de puntentabellen van World Cup Youth en Europe Cup Youth, en de regiotabellen
   in de jeugd- en U23-documenten. De cijfers zijn overgenomen van een rendering op 165–170 dpi.
   Bij twijfel over één specifiek getal: de PDF in `bron/` openen.
3. **Eén diagram is niet overgenomen**: de schematische tekening van de bordopstelling op pagina 8 van
   de Playing and Tournament Rules. Die bevat geen maten die niet al in de tekst staan.
4. **Interne tegenstrijdigheden in de bron** zijn gemarkeerd waar aangetroffen (o.a. het IDF-lidmaatschap
   en Mauritanië op de ledenpagina, jaartallen in de jeugd-World-Masters-criteria, "Youth" in de
   senioren-Europe Cup, een weekdag in de World Masters-criteria). Ze zijn **niet** stilzwijgend
   opgelost.
5. **Van de Bye-Laws zit alleen de eligibility-laag erin.** Bye-Law 2.01 en 7.05 — de twee clausules
   waar de andere reglementen naar doorverwijzen — zijn sinds 21-08-2026 gedekt door
   [[16-bye-laws-deelnamegerechtigdheid]], samen met de bepalingen die nodig zijn om ze toe te passen.
   De **overige hoofdstukken van de Bye-Laws** zijn nog steeds niet samengevat. Twee concrete gaten die
   daarbij horen: clausule 2.01(d) verwijst voor tuchtschorsingen door naar clausule 11.00 van de
   *WDF Code of Practice on Disciplinary Proceedings*, en clausule 7.05 punt 3 laat lidbonden
   aanvullende eisen stellen — voor Nederland is daarvoor het NDB-reglement nodig
   ([[PKM/Documents/NDB-Kennis/INDEX|NDB-archief]]). Geen van beide zit in dit archief.

## Hoe bij te werken

1. Haal https://dartswdf.com/rules op en vergelijk de revisienummers met het register hierboven.
2. Voor elk gewijzigd document: download de PDF naar `bron/` en bouw het bijbehorende
   kennisbestand opnieuw op.
3. Controleer bij de organisatiepagina's of bestuur en ledenlijst zijn gewijzigd.
4. Werk de datums in dit INDEX-bestand bij.

## Verwant

- [[PKM/My Life/Topics/darts-coaching]] — de context waarin deze kennis gebruikt wordt
- [[PKM/Documents/2018-02-28-wdf-playing-and-tournament-rules]] — bestaande documentnotitie met een
  vergelijking tussen het WDF-reglement en het DRA Rule Book (professioneel niveau)
- [[PKM/Documents/WDF-Kennis/bron/_downloadlog|_downloadlog]] — herkomst, bron-URL's per document, revisienummers en de downloadverantwoording
- [[tsk-2026-08-21-002-wdf-regels-kennisskill-bouwen]] — de taak waaronder deze kennisbasis is gebouwd
