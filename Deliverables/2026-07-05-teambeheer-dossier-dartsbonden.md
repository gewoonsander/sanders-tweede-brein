
# Startdossier: Teambeheer — competitiebeheersysteem Nederlandse dartsbonden

**Onderzoeker:** Athena · **Datum:** 2026-07-05 · **Voor:** Sander (D.T. Irritant / RDB, ADC Regio Oost, DartsCoaching.nl)
**Aard:** puur inventarisatie-onderzoek. Geen scraping-scripts, geen n8n-workflows, geen code gebouwd.
**Harde afbakening gerespecteerd:** geen systematische ID-enumeratie op `feeds.teambeheer.nl`. Alleen bronnen die bonden of de leverancier zelf publiceren.

---

## Executive summary

Teambeheer (leverancier: teambeheer.nl, Nijmegen, contact Sjef Cantelberg / Robert Bloemendaal) is een landelijk gebruikt competitiebeheersysteem voor Nederlandse (en enkele Belgische) dartsbonden. De leverancier publiceert zelf een klantenlijst van **47 aangesloten bonden** (2003–2026). Naast RDB (bekend, `d=8`) kon ik via de **eigen websites van vier andere bonden** een publiek zelf-gepubliceerde Teambeheer-ID bevestigen: DBBR (`d=15`), SDC (`d=11`), FDB (`d=25`) en Darts Bond Almere (`d=26`). Alle geteste feeds blijken **server-gerenderde HTML te zijn, geen JSON/XML** — de term "feed" is marketingtaal, geen machine-API. `feeds.teambeheer.nl` sluit via `robots.txt` (`Disallow: /`) expliciet alle geautomatiseerde toegang uit — dit is de belangrijkste bevinding voor de n8n-vraag. "ADC Regio Oost" is niet terug te vinden op de Teambeheer-klantenlijst, niet op de officiële NDB-ledenlijst, en er is geen eigen website gevonden — onopgelost, niet negatief geduid.

---

## Per bond

### 1. Rivierenland Darts Bond (RDB) — uitgangspunt, reeds bekend

- **Website:** rivierenlanddartsbond.nl
- **Regio:** Rivierenland / Nijmegen e.o. (Gelderland)
- **Klant sinds:** 2003 (oudste klant op Teambeheers eigen lijst) — bron: teambeheer.nl
- **NDB-lidorganisatie:** ja — bevestigd op ndbdarts.nl/over-ndb/lidorganisaties (24-koppige officiële ledenlijst van de Nederlandse Darts Bond)
- **Teambeheer-ID's:** niet één vast ID, maar meerdere naast elkaar:
  - `d=8` — hoofd-competitiefeeds: stand, stand-allepoules, speelgelegenheden, teamlijst, teams-vrijespeelweek, speler, spelerzoeken, wedstrijdformulier, walloffame, strafpunten, pouleindeling, jaarkalender, jaarprogramma, teams-ingeschreven, poulekampioenen, scorelijst-pk, toernooiagenda, toernooi-aanmelden
  - `d=1` — nacompetitie, scorelijst-svhz (Speler van het Seizoen, RDB-specifiek), scorelijst-specialtiescup (RDB-specifiek)
  - `d=7` — inschrijven/uitschrijven (individuele leden)
  - `d=17` — scorelijst-bijzres (snelste leg, `t=3`), ranking-stand
  - `d=26` — beker, verzettewedstrijden
- **Live geverifieerd (Confidence: High — direct getest, 2026-07-05):** `feeds.teambeheer.nl/web/team?d=8&t=2498` rendert een echte teampagina ("Red Alert!", Eredivisie, wedstrijdschema, spelersroster, locatiegegevens). `feeds.teambeheer.nl/web/speler?d=8&l=7287` rendert een echte spelerpagina met carrièrestatistieken per seizoen. `feeds.teambeheer.nl/web/stand/?d=8&div=1A` rendert een standenpagina met seizoensnavigatie.
- **Bijzonderheid:** RDB is het enige bond waarvoor we vijf verschillende `d`-waarden zien voor dezelfde organisatie — belangrijk voor de ID-structuuranalyse hieronder.

### 2. Dartbond Bollenstreek Rijnland (DBBR)

- **Website:** dbbr.nl (pagina: dbbr.nl/teambeheer/)
- **Regio:** Bollenstreek/Rijnland, Zuid-Holland (Leiden e.o.)
- **Klant sinds:** 2016 (teambeheer.nl)
- **NDB-lidorganisatie:** ja
- **Teambeheer-ID:** `d=15` — zelf gepubliceerd, consistent over drie feedtypes: `stand-allepoules`, `beker`, `jaarkalender?...&s=26-27`
- **Confidence:** Medium-High (single source = eigen site, maar intern consistent over meerdere feed-URL's op dezelfde pagina)

### 3. Sallandse Dart(s) Competitie (SDC)

- **Website:** sdcdarts.nl (pagina: sdcdarts.nl/teambeheer-informatie/)
- **Regio:** Salland, Overijssel (Zwolle e.o.)
- **Klant sinds:** 2014
- **NDB-lidorganisatie:** ja
- **Teambeheer-ID:** `d=11` — zelf gepubliceerd, consistent over zes URL's (inschrijven, stand Ere/1A/1B, toernooi-aanmelden, `webcontent/oi-inschrijvingen`)
- **Bijzonderheid:** enige gevonden bond met een `webcontent/`-pad naast `web/` — mogelijk een ouder of alternatief feed-namespace. Niet verder onderzocht (zou vereisen dat we buiten de bekende, zelf-gepubliceerde URL's gaan zoeken).
- **Confidence:** Medium-High

### 4. Friese Darts Bond (FDB)

- **Website:** fdbdarts.nl (pagina: fdbdarts.nl/nieuwe-functionaliteit-in-teambeheer/)
- **Regio:** Friesland
- **Klant sinds:** 2018
- **NDB-lidorganisatie:** ja
- **Teambeheer-ID:** `d=25` — via `teambeheer.nl/teamadm/?d=25` en `.../inschrijven/?d=25`. Let op: dit zijn URL's op het `teambeheer.nl`-hoofddomein (adminportaal), niet op `feeds.teambeheer.nl` zelf — geen directe feed-URL van FDB gevonden, alleen het ID.
- **Confidence:** Medium (ID bevestigd, maar geen eigen feed-URL zoals bij DBBR/SDC)

### 5. Darts Bond Almere (DBA)

- **Website:** dartsbondalmere.nl (pagina: dartsbondalmere.nl/inlog-captain/)
- **Regio:** Almere, Flevoland
- **Klant sinds:** 2018
- **NDB-lidorganisatie:** ja
- **Teambeheer-ID:** `d=26` — via `teambeheer.nl/teamadm/?d=26`
- **Bijzonderheid — belangrijk, zie technische analyse:** dit is hetzelfde nummer als RDB's eigen `beker`/`verzettewedstrijden`-feed (`d=26`). Dit is **geen fout in dit dossier maar een sterke aanwijzing** dat `d` geen 1-op-1 "bond-ID" is (zie hieronder).
- **Confidence:** Medium (single source, niet verder gekruist)

### Overige 42 bonden op Teambeheers eigen klantenlijst (geen ID gevonden, geen enumeratie geprobeerd)

Bron: teambeheer.nl (leverancier, primaire bron, High confidence voor "is klant", niet voor een ID). Volledige lijst inclusief jaartal staat in de Technische bijlage hieronder. Voorbeelden: Kempense Darts Organisatie Eindhoven (2005), Darts Vereniging Oost-Nederland (2009, NDB-lid), Darts Organisatie Threant (2022, NDB-lid), Zeeuwse Darts Federatie (2023, NDB-lid), Nederlandse Darts Bond zelf (2017 — landelijke overkoepelende bond, apart van de 24 regionale lidorganisaties), Peelland Dart Bond (2024, NDB-lid), tot en met Haarlemse Dart Vereniging (2026, nieuwste klant). Voor géén van deze 42 is een `d`-waarde gevonden via een legitieme, publieke bronverwijzing — dit is een geldig resultaat, geen tekortkoming.

### ADC Regio Oost — niet gevonden

Niet aanwezig op Teambeheers eigen 47-klantenlijst, niet op NDB's officiële 24-ledenlijst (ndbdarts.nl), geen eigen website gevonden via zoekopdrachten. Mogelijk gaat het om een informele of kleinere structuur, een subonderdeel van een grotere bond, of een andere officiële naam dan de gangbare afkorting. **Open vraag, geen negatieve conclusie over Teambeheer.**

---

## Technische analyse

### URL- en parameterstructuur

Patroon: `https://feeds.teambeheer.nl/web/<feed-type>/?d=<id>&<extra-parameters>`

| Parameter | Betekenis (afgeleid) | Voorbeeld |
|---|---|---|
| `d` | Numeriek ID — zie hieronder, blijkt géén stabiel 1-op-1 bond-ID | `d=8`, `d=15` |
| `div` | Divisie/poule-code, alfanumeriek, niet puur numeriek | `div=1A`, `div=Ere` |
| `s` | Seizoencode | `s=25-26`, `s=17-18` |
| `t` | **Dubbel gebruikt** — bij `scorelijst-bijzres` is het een resultaattype (1=180's, 2=hoogste finish, 3=snelste leg); bij `team` is het een team-ID (`t=2498`). Zelfde letter, andere semantiek per feed-type — inconsistent binnen het systeem zelf. |
| `l` | Speler/lid-ID | `l=7287` |
| `w` | Wedstrijd-ID | `w=1239644` |
| `filter` | Speler-statusfilter (onduidelijke encoding) | `filter=ADEB` |
| `rp` | Onduidelijk, verschijnt alleen bij `ranking-stand` | `rp=102` |

### Dataformaat: HTML, geen JSON/XML (Confidence: High, direct getest)

Drie RDB-feeds (`stand`, `speler`, `team`) zijn live opgevraagd op 2026-07-05. Alle drie retourneren **server-gerenderde HTML**: navigatie met seizoensselectie, tabellen met standen/wedstrijden/statistieken, geen `Content-Type: application/json` of XML-structuur. Dit is bevestigd door de daadwerkelijke inhoud (echte teamnaam, echte speler, echte wedstrijddata) — geen placeholder of foutpagina. Conclusie: de term "feed" bij Teambeheer betekent een **embeddable HTML-widget** (bedoeld om in een iframe op een bondswebsite te tonen), geen machine-leesbare API.

### ID-structuur: geen bevestigd bond-ID-schema (Confidence: Medium, met expliciete onzekerheid)

Twee waarnemingen samen leveren een belangrijk, maar niet volledig bewezen inzicht op:

1. RDB gebruikt zelf **vijf verschillende `d`-waarden** (1, 7, 8, 17, 26) voor verschillende onderdelen van dezelfde bond.
2. `d=26`, door RDB gebruikt voor "Beker" en "Verzette wedstrijden", is **hetzelfde nummer** dat Darts Bond Almere zelf publiceert als hún hoofd-ID.

Dit is **geen fout in dit onderzoek** — beide waarden komen uit onafhankelijke, door de bond zelf gepubliceerde bronnen. De meest waarschijnlijke verklaring: `d` is een **platformbrede, vlakke teller over losse "instanties"** (competitie-context, formulier, of hoofdrecord) die Teambeheer intern uitgeeft bij het aanmaken van een nieuw onderdeel — niet een uniek, stabiel ID per bond. Dit is een **inferentie, geen bevestigd feit** (Teambeheer publiceert geen eigen documentatie hierover), maar het verklaart zowel waarom RDB meerdere ID's heeft als waarom twee bonden hetzelfde nummer kunnen "delen" voor verschillende doeleinden. Dit ondersteunt ook waarom we bewust niet zijn gaan enumereren (zie Anti-patterns): zelfs als je alle nummers 1–100 zou aflopen, zou je geen betrouwbare 1-op-1 lijst "nummer → bond" krijgen, omdat hetzelfde nummer meerdere, ongerelateerde dingen kan zijn.

**Data-kwaliteitswaarschuwing:** één automatische paginafetch (Tilburgse Darts Vereniging) leverde `d=8` op — identiek aan RDB's bevestigde ID. Dit is zeer waarschijnlijk een fout van de geautomatiseerde samenvattingsstap, niet een echte collision, en is daarom **niet** opgenomen als bevestigd resultaat. Vermeld hier expliciet als waarschuwing: automatische single-pass fetches van dit soort pagina's verdienen een menselijke steekproefcontrole voor je ze operationeel gebruikt.

### Documentatie / reverse-engineering door derden

Geen publieke documentatie, developer-portal, forumdiscussie of GitHub-repository gevonden die het Teambeheer-feedsysteem beschrijft of reverse-engineert (meerdere zoekopdrachten, 2026-07-05). Confidence: Medium — afwezigheid van bewijs is geen bewijs van afwezigheid, maar er is geen enkele aanwijzing gevonden in twee onafhankelijke zoekrondes.

### API's naast de feeds

Er bestaat een officiële Teambeheer Darts-app (iOS App Store, Google Play — `nl.teambeheer.darts`) die kennelijk met een eigen backend praat. Geen publieke API-documentatie gevonden voor die backend. Het onderzoeken van de app zelf (netwerkverkeer onderscheppen) zou een andere, indringender grens overschrijden dan het lezen van gepubliceerde webpagina's — dat is hier bewust niet gedaan en blijft een open vraag.

### robots.txt — kritieke bevinding voor automatisering

| Domein | robots.txt | Betekenis |
|---|---|---|
| `teambeheer.nl` (marketing) | Sluit alleen `/cgi-bin`, `/assets/`, `/docs/`, `/img/` uit | Marketingpagina's mogen gecrawld worden |
| `app.teambeheer.nl` (login) | Leeg — alles toegestaan | Geen restrictie, maar hier staat geen databronnen, alleen loginschermen |
| `feeds.teambeheer.nl` (de eigenlijke standen/uitslagen-feeds) | **`Disallow: /` voor alle user-agents** | De leverancier sluit **expliciet alle geautomatiseerde toegang** tot precies het domein uit waar de data staat die je zou willen ophalen |

Dit is de belangrijkste technische bevinding van dit dossier voor elke vervolgstap richting automatisering.

---

## Is n8n geschikt voor periodieke verzameling?

**Technisch: ja, met kanttekeningen. Praktisch/ethisch: nee, niet zonder toestemming.**

- **Technisch haalbaar:** een `Schedule Trigger` + `HTTP Request`-node kan de bekende, al-gepubliceerde feed-URL's ophalen. Omdat de output HTML is (geen JSON), is een extra parse-stap nodig — n8n's `HTML Extract`-node (CSS-selectors) of een `Code`-node met een HTML-parser, om tabellen om te zetten naar gestructureerde velden.
- **Wijzigingsdetectie:** geen ETags of Last-Modified headers zijn getest (dat zou herhaalde requests tegen een `robots.txt`-uitgesloten domein vereisen, bewust vermeden). Onbekend of Teambeheer caching-headers gebruikt. Veiligste aanname: geen betrouwbaar changedetectie-mechanisme beschikbaar; content-hashing na parsing, met een bescheiden interval (bijv. eenmaal per dag, niet per minuut), zou de enige praktische optie zijn — mocht dit ooit gebouwd worden.
- **De harde blocker:** `feeds.teambeheer.nl/robots.txt` bevat `Disallow: /` voor alle user-agents. Dat is een expliciete, door de leverancier zelf uitgesproken wens om **geen** geautomatiseerde toegang toe te staan tot precies dit domein. Een n8n-workflow die dit domein op een schema bevraagt, is per definitie het soort geautomatiseerde toegang dat hier wordt uitgesloten — ongeacht dat de individuele URL's zelf onbeveiligd/publiek zijn.
- **Aanbeveling:** bouw dit niet zonder eerst expliciet (schriftelijk) toestemming te vragen aan Teambeheer (info@teambeheer.nl, contactpersonen Sjef Cantelberg / Robert Bloemendaal) en/of RDB als bond. Dat is een gesprek van vijf minuten met een tweemansbedrijf dat vrijwilligersbonden bedient — een verzoek om een leesrechtenuitzondering voor een specifieke, laagfrequente polling is redelijk en waarschijnlijk snel te regelen, en voorkomt dat een geautomatiseerde workflow überhaupt tegen hun expliciete `robots.txt`-richtlijn ingaat.

---

## Voorstel: modulaire dossierstructuur (niet gebouwd, alleen voorgesteld)

Voor toekomstige uitbreiding met meer bonden/feeds, zonder herstructurering:

```
Team Knowledge/Guidelines/Reference/Teambeheer/
  GL-0XX-teambeheer-feedtypes.md        ← eenmalige glossary: elk feed-type-pad (stand, team, speler, ...) 
                                           + zijn bekende parameters, EENMAAL gedocumenteerd (SSOT)
  bond-rdb.md                            ← per bond: YAML-frontmatter (naam, website, regio, 
  bond-dbbr.md                             teambeheer_id, ndb_lid, klant_sinds) + body met 
  bond-sdc.md                              gevonden feed-URL's + bijzonderheden
  bond-fdb.md
  bond-dba.md
  INDEX.md                               ← tabel met alle bonden + link, groeit met elke nieuwe vondst
```

Elke bond-file wikilinkt naar de gedeelde glossary in plaats van parameters te herhalen (voorkomt SSOT-schending). Nieuwe bond toevoegen = nieuw bestand + regel in `INDEX.md`. Dit past in de bestaande Team Knowledge-taxonomie (Guideline, niet SOP of Workstream, want het is statische naslaginformatie).

---

## Anti-patterns om te vermijden

1. **ID-enumeratie (`?d=1,2,3,...`) om bonden te "ontdekken"** — bewust niet gedaan. Redenen: (a) `feeds.teambeheer.nl` sluit via `robots.txt` alle geautomatiseerde toegang expliciet uit — systematisch aflopen is een duidelijke, aanhoudende overtreding daarvan, wezenlijk anders dan een paar losse, al-bekende URL's opvragen; (b) Teambeheer is een tweemansbedrijf dat vrijwilligersbonden bedient — systematisch scannen oogt als probing en kan een blokkade of klacht opleveren; (c) zoals hierboven aangetoond is `d` vermoedelijk geen stabiel bond-ID maar een vlakke teller over losse instanties — een enumeratiesweep zou dus sowieso een ruisige, moeilijk te interpreteren lijst opleveren, niet de schone "bond-catalogus" die je ervan zou verwachten; (d) scope creep — de opdracht was inventarisatie, geen bouw van een scraper voor andermans systeem.
2. **"Feed" verwarren met "API"** — leidt tot verkeerde technische aannames stroomafwaarts (bijv. Daedalus die een n8n-workflow bouwt in de veronderstelling dat JSON geparsed moet worden, terwijl het feitelijk HTML-scraping is).
3. **Overclaiming van dekking** ("waarschijnlijk gebruiken ook bonden X en Y dit systeem") zonder citaat — in dit domein extra verleidelijk gezien het duidelijke patroon, maar hier vermeden: alleen bonden met een directe bronverwijzing zijn opgenomen.
4. **Hoogfrequent pollen van een vrijwilligersproject** — zelfs mét toestemming zou een schema van elke paar minuten disproportioneel zijn tegenover de schaal van de infrastructuur.
5. **Bouwen voor valideren** — eerst een scraper/parser bouwen voordat is vastgesteld of de data uberhaupt bruikbaar/toegestaan is, in plaats van eerst (zoals hier) het landschap en de grenzen in kaart brengen.

---

## Limitations (expliciet, om overclaiming te voorkomen)

- Van de 47 officiële Teambeheer-klanten is voor slechts **5** een concreet `d`-ID publiek bevestigd (RDB, DBBR, SDC, FDB, DBA). Voor de overige 42 is alleen "is klant sinds jaar X" bevestigd (bron: teambeheer.nl) — geen ID, bewust niet via enumeratie achterhaald.
- "ADC Regio Oost" kon niet bevestigd worden als Teambeheer-gebruiker via enige publieke bron — genuinely onopgelost, geen conclusie getrokken.
- De TDV-bevinding (`d=8`, identiek aan RDB) is zeer waarschijnlijk een artefact van geautomatiseerde paginasamenvatting en is **niet** als feit opgenomen — wel als waarschuwing over de betrouwbaarheid van single-pass automatische fetches.
- HTML-als-dataformaat is alleen **direct getest** voor RDB (drie feed-types). Voor DBBR/SDC/FDB/DBA is dit een redelijke maar onbewezen aanname (zelfde leverancier, zelfde domein, zelfde URL-schema), geen directe test.
- Geen enkele caching-header (ETag/Last-Modified) is getest — dat zou herhaalde requests tegen een `robots.txt`-uitgesloten domein hebben vereist.
- De mobiele-app-API is niet onderzocht; dat vereist het onderscheppen van app-netwerkverkeer, een andere en indringender grens dan het lezen van gepubliceerde webpagina's.
- De "d is een vlakke, platformbrede teller"-theorie is een **inferentie** op basis van twee waarnemingen, geen door Teambeheer bevestigd feit.

---

## Bijlage: volledige Teambeheer-klantenlijst (bron: teambeheer.nl, eigen marketingpagina)

| Bond | Klant sinds |
|---|---|
| Rivierenland Dartsbond | 2003 |
| Kempense Darts Organisatie Eindhoven | 2005 |
| Darts Organisatie Groningen Drenthe | 2005 |
| Darts Vereniging Oost-Nederland | 2009 |
| Bossche Darts Competitie | 2010 |
| Tilburgse Dart Vereniging | 2011 |
| Darts Competitie Achterhoek | 2013 |
| Sallandse Dart Competitie | 2014 |
| Darts Sport West Nederland | 2015 |
| Halderbergse Darts Bond | 2015 |
| Dartbond Bollenstreek Rijnland | 2016 |
| Roosendaalse Darts Federatie | 2016 |
| Darts Organisatie Noord Holland Noord | 2016 |
| Flevo Divisie Dartcompetities | 2017 |
| Dart Vereniging Kennemerland | 2017 |
| Nederlandse Darts Bond | 2017 |
| Onafhankelijke Darts Federatie | 2018 |
| Dart Federatie Het Groene Hart | 2018 |
| Friese Darts Bond | 2018 |
| Darts Bond Almere | 2018 |
| Darts in Delft | 2018 |
| Dartbond Zaanstreek Purmerend | 2019 |
| Darts Organisatie Regio Amsterdam | 2019 |
| Darts '88 | 2019 |
| Arnhem Centrum Dart Competitie | 2019 |
| Polder Dart Competitie - Noord Oost Polder | 2019 |
| Darts Vereniging Steenwijk | 2020 |
| Darts Vereniging Stedendriehoek | 2021 |
| Brugse Darts Federatie | 2021 |
| Darts Organisatie Threant | 2022 |
| Venlose Darts Organisatie | 2022 |
| Darts Bond Midden Nederland | 2023 |
| Brabantboel Dartsbond | 2023 |
| Osse Horeca Darts Competitie | 2023 |
| West Brabantse Dart Federatie | 2023 |
| Roermondse Winteravond Dart Competitie | 2023 |
| Zeeuwse Darts Federatie | 2023 |
| Antwerpse Darts Organisatie | 2024 |
| Peelland Dart Bond | 2024 |
| Dartsfed. Provincie Antwerpen | 2024 |
| Arnhemse Dart Organisatie | 2024 |
| Hoekse Waard Darts Orgaan | 2024 |
| Rijnmond Darts Organisatie | 2025 |
| Kapelse Darts Spelers | 2025 |
| Dartsfederatie Puurs en Omgeving | 2026 |
| Zunderts-Rijsbergse Dart Federatie | 2026 |
| Haarlemse Dart Vereniging | 2026 |

*(Enkele namen wijken licht af in spelling van de officiële NDB-ledenlijst — bijv. "Sallandse Dart Competitie" vs. NDB's "Sallandse Darts Competitie" — beide bronnen zijn los geciteerd zoals gepubliceerd.)*
