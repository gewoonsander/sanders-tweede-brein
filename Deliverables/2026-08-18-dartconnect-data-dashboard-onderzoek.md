---
title: "DartConnect-data ontsluiten voor een persoonlijk dart-dashboard"
date: 2026-08-18
author: Athena
type: research-brief
status: final
---

# DartConnect-data ontsluiten voor een persoonlijk dart-dashboard

## Executive summary

DartConnect heeft een **echte, publieke developer-API** (`public-api.dartconnect.com`), maar toegang vereist een My DartConnect-account plus een handmatig aangevraagde API key bij `customerservice@dartconnect.com` — dit is geen self-service portal, en **er is nergens een harde prijs voor gevonden** (zie sectie 7). Voor persoonlijke statistieken (average, checkout%, 180's, hoogste finish, W/L) is er **geen ruwe CSV-export voor individuele spelers**: CSV-export bestaat alleen voor league-organisatoren op leaderboard-niveau. Spelers krijgen wel een uitgebreid, interactief "Performance Dashboard" en deelbare "Player Cards" binnen `my.dartconnect.com`, maar dat is een viewer, geen exportfunctie. De NDB gebruikt DartConnect **als officiële score-software** voor LaCo en SuperLeague, maar **Teambeheer blijft de officiële competitiesoftware** — DartConnect is een aanvulling, geen vervanging. Geautomatiseerd ophalen van eigen data zonder API-toestemming is expliciet verboden in de DartConnect Terms of Use ("scrape, spider, or crawl the Service or harvest or manipulate data").

**iDarts** (`stats.idarts.nl`) blijft het sterkste precedent voor een werkende integratie: het heeft een eigen, gedocumenteerde Web API v2 (API-key- of basic-auth-toegang, endpoint `findbyname` voor spelerszoekopdrachten), maar is qua herkomst en positionering een **professioneel/ranking-toernooienplatform** (PDC/WDF/BDO, gebouwd door dartscommentator Jacques Nieuwlaat) — het is **niet bevestigd** dat het ook reguliere NDB LaCo/SuperLeague-teamwedstrijden op individueel niveau dekt, alleen dat het rankingtoernooi-data via de DartConnect-API importeert. **Bas Engelen**'s "Premium Dartdata" bleek bij nader onderzoek uitsluitend PDC-gericht en eerder een B2B-databron voor media (Viaplay) dan een publiek raadpleegbare speler-database — niet relevant voor Sanders NDB-statistieken. **"Jaques Nieuwlaat"** uit Sanders vraag is zeer waarschijnlijk dezelfde Jacques Nieuwlaat die iDarts heeft opgericht — geen aparte, derde database, zie sectie 9.

## Bevindingen per vraag

### 1. Heeft DartConnect een publieke/developer-API?

**Confidence: High** (primaire bron + herhaald bevestigd via onafhankelijke zoekopdrachten)

Ja. `https://public-api.dartconnect.com/` is een officiële API-documentatieportal (Redoc/Swagger-stijl) met minstens de endpoints `/tournaments`, `/org-group-members` en `/how-to-register-players`. Er bestaat ook een test-omgeving op `testpublic-api.dartconnect.red`.

Toegangsprocedure (uit meerdere onafhankelijke zoekresultaten, consistent herhaald): maak een My DartConnect-account aan, vraag daarna een API key aan via **customerservice@dartconnect.com**. Een aantekening in de documentatie zelf waarschuwt dat de API nieuw is en dat toernooien niet automatisch aan je account gekoppeld worden.

**Beperking:** de eigenlijke inhoud van de documentatiepagina's kon ik niet volledig uitlezen — de portal is een JavaScript-app die zonder browser-rendering alleen de paginatitel toont ("DartConnect PublicAPI"). Ik kon dus **niet verifiëren** welke velden per endpoint precies terugkomen (bijv. of `/org-group-members` speler-averages of alleen ledenlijsten teruggeeft), of wat de rate limits of kosten zijn (zie ook sectie 7). Dit moet je zelf bevestigen door in te loggen en de portal in een browser te openen, of door de API key aan te vragen en de OpenAPI-spec te bekijken.

Bewijs dat de API operationeel is en gebruikt wordt: **iDarts** (`stats.idarts.nl`), een Nederlands rankings-/statistiekenplatform, meldt in zijn changelog expliciet dat "de DartConnect import nu live is" (juli–aug. 2024) en dat toernooidata via de DartConnect API wordt geladen. Dit is een tweede, onafhankelijke bevestiging dat de API in de praktijk werkt voor tournament-/rankingdata.

### 2. Welke statistieken houdt DartConnect bij, en zijn die zichtbaar/exporteerbaar zonder API?

**Confidence: High** voor welke statistieken bijgehouden worden; **Medium** voor exportmogelijkheden voor individuele spelers.

DartConnect houdt in elk geval bij (bevestigd via zowel `my-dartconnect`-pagina als de DCTV Leaderboard-pagina, twee onafhankelijke DartConnect-eigen bronnen):
- 3-dart average / PPR (Points Per Round) voor 01-spellen, MPR voor Cricket
- Checkout-percentage, checkout-efficiency, aantal checkout-darts en -kansen (CO%, COE, COD, COO)
- Scoring-turns: 100+, 140+, en 180-scores ("180-point turns")
- Hoogste finish
- Leg-winpercentage, match-record, W/L
- "Missed Dart %" en "Triple & Bull Dart %" (accuracy)
- Head-to-head data tegen specifieke tegenstanders ("My Opponents")
- Historie: "My Matches" is een compleet persoonlijk archief van elke gespeelde DartConnect-match

**Zonder API, binnen `my.dartconnect.com`:**
- Een interactief "Performance Dashboard" (filterbaar op periode en spelvorm) — **viewer, geen CSV-export.**
- Deelbare "Player Cards" (Competition & Activity Cards) — downloadbaar/printbaar als **afbeelding**, niet als ruwe data.
- Ruwe **CSV-export bestaat wél**, maar uitsluitend voor league-administrators op leaderboard-niveau (via het league-portaal, "DartConnect Links" → Export Report), niet voor een individuele speler die alleen zijn eigen stats wil.
- **Aanname/onzeker:** individuele match-reports lijken (op basis van één URL-patroon, `recapv1.dartconnect.com/history/report/.../match/<id>`) publiek zonder login te bekijken als je de match-ID kent. Dit is **niet hard bevestigd** — het komt uit één pagina-fetch en niet uit officiële documentatie. Behandel dit als een te verifiëren hypothese, niet als vaststaand gegeven.

### 3. Hoe verhouden NDB en SuperLeague zich tot DartConnect?

**Confidence: High** (primaire bron: NDB's eigen site, twee separate NDB-artikelen die elkaar bevestigen)

Vanaf het lopende seizoen is DartConnect de **officiële score-software** voor alle LaCo- en SuperLeague-wedstrijden, gratis voor teams. Letterlijk citaat van de NDB zelf:

> "Teambeheer blijft de officiële competitiesoftware; DartConnect is een mooie en waardevolle aanvulling."
> — [ndbdarts.nl, "Fantastisch nieuws voor de LaCo én de SuperLeague!"](https://www.ndbdarts.nl/nieuws/fantastisch-nieuws-voor-de-laco-%C3%A9n-de-superleague)

Dat betekent: **Teambeheer** (de bestaande NDB-competitiesoftware, ook als losse Android-app beschikbaar) blijft de bron voor uitslagenregistratie/competitiebeheer; **DartConnect** is ernaast gezet specifiek voor live scoring, statistieken en het volgen van wedstrijden (ook via `tv.dartconnect.com`). Beide systemen bestaan dus naast elkaar — DartConnect is niet de enige backend, maar wel de plek waar de rijke per-worp-statistieken vandaan komen die Teambeheer niet biedt.

Losstaand: alle NDB-rankingtoernooien (waaronder Dutch Open) draaien eveneens volledig op DartConnect.

**Niet gevonden:** de term "SuperLIC" kwam in geen enkele bron voor — waarschijnlijk bedoelde je SuperLeague (SLN) of de LaCo (Landelijke Competitie); ik heb dit niet verder kunnen bevestigen en vul het niet zelf in.

### 4. Bekende voorbeelden van geïntegreerde dashboards/tools

**Confidence: High** — twee concrete, verifieerbare voorbeelden gevonden.

- **iDarts** (`stats.idarts.nl`) — Nederlands rankings-/statistiekenplatform (DartStat.Web v2.0.1) dat expliciet via de officiële DartConnect API tournament-data importeert. Heeft zelf ook een eigen "Web API (v2)" met documentatie. Dit is het sterkste precedent dat een API-integratie in de praktijk haalbaar is voor een Nederlands dartsproject — zie de verdiepende check in sectie 8.
- **dart-connect-scraper** (GitHub, `richardmundyiii/dart-connect-scraper`) — een Node.js-scraper die league-standings van een publieke DartConnect-standings-pagina haalt en in MongoDB opslaat. Dit is een expliciet **anti-pattern-voorbeeld**: het project bevat geen enkele verwijzing naar de Terms of Use en scraped zonder API-toestemming — precies het gedrag dat DartConnect's ToS verbiedt (zie punt 5).
- **archanglmr/darts-connect** (GitHub) — geen cloud-integratie maar een losse klasse die rechtstreeks verbinding maakt met het IP-adres van een DartConnect-dartbord om worpen live uit te lezen. Andere categorie (lokale hardware, geen my.dartconnect.com-data).

DartConnect TV (`tv.dartconnect.com`) zelf bleek bij directe inspectie vooral een compatibiliteitsmelding te tonen voor niet-ondersteunde apparaten ("This device is ONLY compatible with the DartConnect Scoring App..."); ik heb **geen officiële open RSS/datafeed** kunnen vinden voor livescores. Er bestaat wel een publiek "DCTV Leaderboard" (`leaderboard.dartconnect.com`), maar die bleek bij bezoek **login-protected** ("Leaderboard Access Protected").

### 5. Terms of Service — mag je je eigen data automatisch downloaden/scrapen?

**Confidence: High** (letterlijk citaat uit de officiële Terms of Use, primaire bron)

Nee. De DartConnect Terms of Use (`dartconnect.com/members/terms-of-use/`) bevatten een expliciet verbod, geldig voor zowel individuele leden als organisatoren, onder "Use Restrictions":

> "bypass any robot exclusion headers or other measures we take to restrict access to the Service, or use any software, technology, or device to scrape, spider, or crawl the Service or harvest or manipulate data"

en

> "make any automated use of the Site, the Service or the related systems, or take any action that we deem to impose or to potentially impose an unreasonable or disproportionately large load on our servers or network infrastructure"

Dit verbod is **algemeen geformuleerd** — het richt zich niet specifiek tegen "je eigen data ophalen", maar tegen elke vorm van automatisering buiten de officiële API om. De ToS noemt de publieke API zelf niet expliciet als uitzondering, maar het bestaan van een aparte, met-toestemming-verkrijgbare API-key-procedure impliceert dat **geautomatiseerde toegang via de officiële API wél de bedoelde/toegestane weg is**, en scraping/crawling niet. Dit is een interpretatie mijnerzijds, geen letterlijk ToS-citaat — gemarkeerd als zodanig.

De Privacy Policy bevestigt dat DartConnect LLC (Boston, MA) optreedt als Data Controller onder de AVG/GDPR en gegevens bewaart "only as long as necessary" — geen expliciete clausule gevonden over een recht op data-export/portabiliteit (AVG-inzagerecht zou dit overigens los van de ToS wel kunnen ondersteunen, maar dat is niet onderzocht in dit rapport).

### 6. Alternatieve/aanvullende bronnen voor Nederlandse dartsstatistieken

**Confidence: Medium** (functioneel bevestigd, diepte niet volledig doorgemeten)

- **iDarts** (`stats.idarts.nl`) — al genoemd bij punt 4; houdt rankings, toernooiresultaten, matchgeschiedenis en spelerstitels bij, en importeert zelf al via de officiële DartConnect API. Zie sectie 8 voor de verdiepende check — is qua herkomst eerder gericht op ranking-toernooien dan op elke losse teamwedstrijd.
- **Darts Orakel** (`dartsorakel.com`) — internationale data-provider/scoring-app, wordt door professionals en pundits gebruikt; heeft een eigen database waartegen je via de Darts Orakel Play-app kunt vergelijken. Niet specifiek Nederlands, en ik heb geen directe NDB-koppeling gevonden.
- **NDB-website zelf** (`ndbdarts.nl`) — heeft een eigen `Rankings`-pagina (`ndbdarts.nl/ranking`) los van DartConnect; mogelijk eenvoudiger toegankelijk voor ranking-historie, maar waarschijnlijk zonder de gedetailleerde per-worp-statistieken die DartConnect wel biedt.
- **The Darts Database** (`dartsdatabase.co.uk`) — gevonden bij de verdiepende zoektocht naar Jacques Nieuwlaat (sectie 9); dit is waarschijnlijk het platform dat oorspronkelijk bedoeld werd met "Dartsdatabase". Publiek toegankelijk zonder login, "in association with Darts World Group", dekt PDC/WDF/voormalig BDO/World Seniors/ADC met >25.000 spelers en >8.000 events. Geen API of exportfunctie gevonden. Internationaal/Engels georiënteerd, geen zichtbare NDB-koppeling.

## 7. Kosten van de DartConnect publieke API

**Confidence: N.v.t. — expliciet niet gevonden, geen aanname ingevuld.**

Ondanks meerdere, apart geformuleerde zoekopdrachten (algemene pricing-zoekopdrachten, forumzoekopdrachten op TheDartsForum/Reddit, "free of charge"/"no cost"-varianten) heb ik **geen harde prijsinformatie** kunnen vinden voor de DartConnect publieke API zelf. Geen pricing-pagina, geen forumpost van iemand die een key heeft aangevraagd en meldt wat het kostte, geen onderscheid gevonden tussen een gratis basistier en betaalde tiers voor de API specifiek.

Wat ik wél vond, en dat is nadrukkelijk **niet hetzelfde** als API-kosten:
- **Platformlidmaatschap** (los van de API): DartConnect kent een **Free Guest Account** en een **Paid Premium Account** voor het gebruik van de app/website zelf. DartConnectTV is gratis te bekijken voor iedereen, zonder lidmaatschap.
- **League-servicekosten** (ook los van de API): voor organisatoren $5 per speler per seizoen bij singles/doubles/triples-leagues, $20 per team per seizoen bij teamleagues van 4+ spelers — dit is de prijs voor het gebruik van DartConnect als league-beheertool, niet voor API-toegang.
- De documentatieportal zelf (`public-api.dartconnect.com`) bleef bij elke fetch-poging een lege JavaScript-shell zonder zichtbare pricing-tekst.

**Conclusie:** de enige betrouwbare manier om de kosten van de API te achterhalen is rechtstreeks vragen bij `customerservice@dartconnect.com` op het moment dat je een key aanvraagt. Ik geef hier geen schatting — dat zou een gok zijn, geen bevinding.

## 8. iDarts (stats.idarts.nl) — verdiepende check

**Confidence: Medium-High per subvraag, met expliciet gemarkeerde onzekerheden.**

**a) Web API v2 — zelfbediening of op aanvraag, en kosten?**
De officiële API-handleiding (`stats.idarts.nl/manual/api/`) bevestigt: "To use this API the user has to login. This can be done either with basic authentication or via an API key", met de key in de header `X-APIKEY`. Toegang is rolgebonden — de handleiding noemt een "Site Sync Role" en een "Player Sync Role" die bepalen welke calls beschikbaar zijn, en meldt een "fair use policy" voor rate limits. **Niet gevonden:** of je zelf, zonder tussenkomst, een key/rol kunt aanvragen (self-service) of dat dit — net als bij DartConnect zelf — een handmatige aanvraag is. Er is ook **geen pricing-informatie** gevonden op de Developers- of Manual-pagina's. Confidence op dit punt: Medium — de authenticatiemethode is hard bevestigd (letterlijk citaat, primaire bron), maar het self-service-vs-aanvraag-onderscheid en de kosten zijn niet gevonden en dus niet ingevuld.

**b) Welke data biedt iDarts per speler, en dekt dat DartConnect-niveau?**
Gedocumenteerde player-endpoints: `/api/v2/player` (lijst), `/api/v2/player/{id}/basic`, `/api/v2/player/{id}/stats`, `/api/v2/player/{id}/lastmatches`, `/api/v2/player/{id}/titles`, `/api/v2/player/{id}/results`, plus zoek-endpoints `/api/v2/player/findbyname/{text}` en `/api/v2/player/findbykey/{key}`. De losstaande gebruikershandleiding (voor het web-dashboard, niet de API) noemt per speler: persoonlijke gegevens, gemiddelden ("Highest averages (major, tv, etc.)"), prijzengeld, titels, en per toernooi resultaten.

**Dit dekt niet aantoonbaar hetzelfde als DartConnect.** DartConnect's eigen statistieken (checkout%, 180-turns, missed-dart%, etc. — zie sectie 2) zijn gedetailleerder en per-worp; iDarts' gedocumenteerde velden zijn op toernooi-/resultaatniveau (average, titels, prijzengeld), niet expliciet op worp-niveau. Belangrijker: de changelog-vermelding uit sectie 1 spreekt specifiek van "DartConnect import" voor **toernooidata**, niet voor reguliere teamcompetitie-wedstrijden. Gecombineerd met iDarts' herkomst als PDC/WDF/BDO-rankingplatform (zie hieronder, punt d) is mijn **inschatting — geen bevestigd feit** — dat iDarts primair rankingtoernooien dekt (zoals NDB-rankingtoernooien, Dutch Open) en **niet aantoonbaar** elke losse LaCo/SuperLeague-teamwedstrijd waarin Sander speelt. Dit moet je zelf verifiëren door je eigen naam op te zoeken (zie punt c).

**c) Kun je jezelf vinden als speler, publiek zonder login?**
De iDarts-handleiding voor het spelersoverzicht meldt een zoekfunctie ("The search option gives you easy access to a selection of players...") zonder dat een accountvereiste genoemd wordt, en de homepage van `stats.idarts.nl/Dashboard/Home` is zelf publiek te bezoeken (een Login-link is aanwezig maar niet verplicht om de homepage te zien). Dit is echter **niet live getest** met de naam "Sander Vos" — ik heb geen zoekopdracht op stats.idarts.nl uitgevoerd, alleen documentatiepagina's gelezen. **Aanbeveling: test dit zelf** door naar `stats.idarts.nl` te gaan en op je dartsnaam te zoeken — dat kost niets en vereist geen account, voor zover de documentatie aangeeft.

**d) Wie beheert iDarts — hoe stabiel is het als databron?**
iDarts is opgericht/gedreven door **Jacques Nieuwlaat**, een Nederlandse dartscommentator (o.a. RTL 7, Sport1, bijnaam "The Human Calculator") — bevestigd via zowel de eigen "About Us"-pagina van iDarts als de Nederlandse Wikipedia-pagina over Jacques Nieuwlaat, twee onafhankelijke bronnen die elkaar bevestigen. De "About Us"-pagina beschrijft een database van "meer dan 1.000 competities, 27.000 spelers en 420.000 wedstrijden" (dit cijfer komt uit één bron/pagina en is niet elders gekruist — behandel als **Low-Medium confidence cijfer**, niet als hard geverifieerd feit). Het geheel oogt als een kleinschalig, persoonsgebonden commercieel platform (klanten: TV-commentatoren, toernooiorganisatoren, media, wedkantoren) — dus **niet** een grote instelling of NDB-eigen dienst. Dat is relevant voor de stabiliteitsinschatting: het draait op het initiatief van één persoon/klein bedrijf, wat zowel een risico (continuïteit hangt aan één partij) als een kans is (mogelijk laagdrempeliger om rechtstreeks contact te zoeken dan bij een groot Amerikaans bedrijf als DartConnect).

## 9. Bas Engelen en "Jaques Nieuwlaat" — eigen databases?

**Confidence: Medium (Bas Engelen), High (Jacques Nieuwlaat = iDarts-oprichter, al onderzocht in sectie 8)**

**Jacques Nieuwlaat:** dit is zeer waarschijnlijk **geen aparte derde database** — het is dezelfde persoon die in sectie 8 al behandeld is als oprichter/gezicht van **iDarts** (`stats.idarts.nl` / `www.idarts.nl`). Twee onafhankelijke bronnen (iDarts' eigen "About Us"-pagina en de Nederlandse Wikipedia-pagina over Jacques Nieuwlaat) bevestigen dezelfde persoon: Nederlandse dartscommentator, geboren 25 maart 1972 in Den Haag, bijnaam "The Human Calculator", commentator sinds 2001 op RTL 7/Sport1. Daarnaast staat zijn naam ook op **Mastercaller.com**, een apart, publiek zonder login te bezoeken resultatensite ("All results and interesting statistics from the BDO, PDC and WDF tournaments by Jacques Nieuwlaat") die in de footer zelf "Stats by iDarts" vermeldt als databron — dus Mastercaller is een tweede, publieksgerichte frontend bovenop dezelfde iDarts-database, geen aparte database. **Als Sanders "database van Jaques Nieuwlaat" bedoeld is: dat is dus iDarts, al volledig behandeld in sectie 8** — geen nieuwe bron gevonden buiten wat al gerapporteerd is.

**Bas Engelen:** is co-presentator van de podcast Dartpraat (met Jeffrey Noeken) — dat klopt met de context die je gaf. Hij is daarnaast, volgens meerdere onafhankelijke zoekresultaten, **oprichter van "Premium Dartdata"** (opgericht in 2016), een databron die uitsluitend op de **PDC** is gericht (Pro Tour, Majors, Eurotours, World Series, World Cup of Darts, Players Championships, Challenge Tour, Development Tour, Q-School e.d.). Bas Engelen werkt daarnaast ook voor Viaplay. Ik vond **geen eigen publiek toegankelijke website** met een dedicated domeinnaam voor Premium Dartdata (geen `premiumdartdata.com` gevonden) — wel een X/Twitter-account (@PremiumDartData, gevestigd in Eindhoven, actief sinds augustus 2016) en een contactadres `premiumdartdata@outlook.com`. Dat profiel kon ik niet direct uitlezen (HTTP 402-foutmelding bij fetch). Dit patroon (geen publieke website, wel social-media-aanwezigheid en direct e-mailcontact) wijst eerder op een **B2B-databron voor media/uitzendpartijen** (zoals Viaplay) dan op een publiek raadpleegbaar spelersplatform met zoekfunctie.

**Relevantie voor Sanders dashboard:** **laag**. Premium Dartdata is expliciet en uitsluitend PDC-gericht — geen aanwijzing van NDB-, LaCo-, SuperLeague- of amateurdata. Zonder eigen publieke website of gedocumenteerde API kon ik ook niet vaststellen of er sowieso een self-service-toegangsweg bestaat. Voor Sanders eigen NDB-statistieken is dit dus geen bruikbaar spoor, in tegenstelling tot iDarts (sectie 8) dat wél (deels) NDB/DartConnect-toernooidata importeert.

## Methodologie

- Bronnen: officiële DartConnect-pagina's (`dartconnect.com`, `my.dartconnect.com` marketingpagina, `public-api.dartconnect.com`, Terms of Use, Privacy Policy, DCTV Leaderboard, recapv1 match-report, league-/event-pricingpagina's), officiële NDB-pagina's (`ndbdarts.nl`, 2 aparte artikelen), officiële iDarts-pagina's (`stats.idarts.nl` Developers/Manual/API/Home, `www.idarts.nl` About Us), community-/derde-partij-bronnen (iDarts changelog, drie GitHub-repo's, Mastercaller.com, The Darts Database, LinkedIn/Wikipedia voor persoonsverificatie).
- Elke claim is via minstens twee losse zoekopdrachten of een directe fetch van de primaire bron plus een aparte zoekopdracht gecontroleerd, met uitzondering van de punten die hierboven expliciet als "niet hard bevestigd"/aanname/inschatting gemarkeerd zijn.
- **Afwijking van het standaardprotocol:** de gebruikelijke tweede, onafhankelijke zoekmotor (Perplexity Sonar via `Team Knowledge/scripts/perplexity_search.py`) vereist een Bash-tool die in deze sessie niet beschikbaar was. Als vervanging heb ik voor elke kernclaim meerdere, apart geformuleerde WebSearch-queries gecombineerd met directe WebFetch-pulls van de primaire bron zelf — dit is zwakker dan een echte tweede zoekmachine, en ik markeer dit expliciet als beperking.
- De JavaScript-gerenderde API-documentatieportal (`public-api.dartconnect.com`) kon niet volledig inhoudelijk uitgelezen worden zonder browserrendering — alleen paginatitels waren zichtbaar bij fetch.
- Vervolgvragen (secties 7–9) zijn in een tweede onderzoeksronde toegevoegd, zelfde dag, zelfde methodiek.
- Er is **niet** ingelogd op DartConnect, iDarts of enig ander platform, en er zijn geen wachtwoorden gebruikt, conform de opdracht. De speler-naamzoekopdracht op iDarts (punt 8c) is dus **niet** live uitgevoerd — dat is een aanbevolen vervolgstap voor Sander zelf, geen login-actie.

## Beperkingen

- De exacte velden/response-schema van de DartConnect-API-endpoints (`/tournaments`, `/org-group-members`) zijn niet geverifieerd — vereist een browser-sessie of een aangevraagde API-key.
- Het al-dan-niet-publiek-toegankelijk zijn van individuele match-reports (`recapv1.dartconnect.com`) is een niet-hard-bevestigde hypothese.
- **Kosten van de DartConnect-API zijn nergens publiek gevonden** — enige weg is rechtstreeks navragen bij DartConnect zelf (zie sectie 7).
- **Kosten en self-service-status van iDarts' Web API v2 zijn niet gevonden** — enige weg is rechtstreeks navragen bij iDarts (zie sectie 8a).
- Of iDarts reguliere NDB LaCo/SuperLeague-teamwedstrijden dekt (in plaats van alleen rankingtoernooien) is een **inschatting, geen bevestigd feit** (sectie 8b) — vereist een live zoekopdracht op je eigen naam om te bevestigen.
- Het cijfer "27.000 spelers, 420.000 wedstrijden" voor iDarts komt uit één bron en is niet gekruist — Low-Medium confidence.
- Premium Dartdata (Bas Engelen) heeft geen gevonden eigen publieke website — de aard van het aanbod (self-service vs. B2B-only) is een inschatting op basis van het ontbreken van een publieke site, geen bevestigd feit.
- "SuperLIC" kon niet bevestigd worden als bestaande term.
- Het standaard dual-search-protocol (Perplexity als tweede, onafhankelijke zoekmachine) was niet beschikbaar in deze sessie (geen Bash-tool) — gecompenseerd met extra WebSearch-varianten en directe primaire-bronfetches, maar dit is zwakker dan een echte tweede zoekmachine.

## Aanbeveling

Voor een persoonlijk dart-dashboard is de meest haalbare route, in volgorde van voorkeur:

1. **API-aanvraag bij DartConnect** (customerservice@dartconnect.com) — dit is de enige door DartConnect zelf gesanctioneerde geautomatiseerde route. Vraag concreet naar: (a) of de API persoonlijke speler-statistieken (average, checkout%, 180's) teruggeeft of alleen tournament-/organisatiedata, (b) rate limits, (c) of een individuele speler (niet alleen league-organisatoren) toegang kan krijgen, en (d) **wat het kost** — dit laatste is nergens publiek te vinden en moet je gewoon vragen.
2. **iDarts (`stats.idarts.nl`) verkennen** als tussenlaag — zij hebben al een werkende DartConnect-import en een eigen Web API v2 (API-key of basic auth, endpoint `findbyname` voor spelerszoekopdrachten). Test eerst gratis en zonder account of je eigen naam ("Sander Vos") daadwerkelijk in hun spelersdatabase voorkomt en of dat regulier LaCo/SuperLeague-wedstrijden bevat of alleen rankingtoernooien — dat bepaalt of dit spoor voor jouw specifieke situatie (teamcompetitie) bruikbaar is. Vraag daarna, indien relevant, naar hun API-toegang en kosten.
3. **Handmatige export als stopgap**: als league-organisator-toegang niet haalbaar is, blijft de CSV-export voor jezelf beperkt tot wat via `my.dartconnect.com`'s Performance Dashboard/Player Cards zichtbaar is — geen ruwe download, wel handmatig aflezen/overtypen per periode.
4. **Bas Engelen's Premium Dartdata is geen bruikbaar spoor** voor dit specifieke doel — uitsluitend PDC-gericht, geen zichtbare publieke toegangsweg, geen NDB-koppeling gevonden.
5. **Scraping wordt afgeraden.** De ToS verbiedt het expliciet ("scrape, spider, or crawl... harvest or manipulate data"), en het bestaande GitHub-scraper-voorbeeld (`dart-connect-scraper`) illustreert precies het risico: een project zonder ToS-overweging, gebouwd op een publieke pagina die zonder waarschuwing kan wijzigen of geblokkeerd worden. Voor een persoonlijk project is het risico (account-opschorting) niet in verhouding tot de vraag — zeker omdat er wél een officiële, toegestane weg (de API) bestaat.

**Kortom:** API-integratie is haalbaar maar niet triviaal (handmatige key-aanvraag, ongedocumenteerde scope én kosten); iDarts is het meest kansrijke alternatieve spoor maar moet je eerst zelf testen op dekking van je eigen teamcompetitie; handmatige export/aflezen is het meest betrouwbare startpunt met het minste risico; scraping is technisch mogelijk maar expliciet verboden en dus niet aan te raden voor een individueel project.
