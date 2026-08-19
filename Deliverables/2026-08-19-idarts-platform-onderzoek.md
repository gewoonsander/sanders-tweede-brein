---
title: "iDarts (stats.idarts.nl) — wat het is en wat het kan"
date: 2026-08-19
author: Hermes
type: research-brief
status: final
---

# iDarts (stats.idarts.nl) — wat het is en wat het kan

## Executive summary

**iDarts** is een Nederlands, commercieel dartsstatistiekenplatform (`www.idarts.nl` als marketingsite, `stats.idarts.nl` als het eigenlijke dashboard) dat zichzelf positioneert als **"THE place to find darts results and statistics"**. Het is géén live-scoring-app en géén automatisch dartbord-systeem (dat is een ander product met een vergelijkbare naam, zie de kanttekening onderaan de summary) — het is een database met historische en actuele resultaten, spelersprofielen, rankings en rapportages, gevoed vanuit **PDC, WDF en BDO**-toernooidata plus (sinds medio 2024, al vastgesteld in het eerdere [DartConnect-onderzoek](2026-08-18-dartconnect-data-dashboard-onderzoek.md)) een import vanuit de officiële **DartConnect-API**.

Het platform is opgericht door/rond **Jacques Nieuwlaat**, Nederlandse dartscommentator (RTL 7/Sport1, bijnaam "The Human Calculator") — dit was al bevestigd in het DartConnect-onderzoek van gisteren en is in dit onderzoek niet opnieuw apart geverifieerd, alleen herbevestigd via de "About us"-pagina. De site claimt (About us-pagina, ongekruist cijfer, zie Beperkingen) **1000+ competities, 27.000+ spelers en 420.000+ wedstrijden**. Klanten zijn tv-commentatoren, analisten, media, wedkantoren en toernooiorganisatoren. **Nieuw gevonden in dit onderzoek** (stond niet in het DartConnect-rapport van gisteren): een concrete prijs voor de **database-toegang** — **€275 per jaar (excl. btw)**, lopend tot het einde van het eerstvolgende PDC WK met automatische verlenging, uitsluitend voor de database (dus niet de Web API — die blijft prijsloos/op-aanvraag, zoals gisteren al vastgesteld).

Voor de functionaliteit zelf heb ik alle 11 tutorial-video's van iDarts getranscribeerd (zie hieronder) — dat geeft een gedetailleerd, uit de bron zelf afkomstig beeld van wat het dashboard kan, functie voor functie.

**Kanttekening vooraf — de "How it works"-pagina op de live site is kapot.** Elke tutorial-tegel op `idarts.nl/how-it-works` toont dezelfde eerste video ("Head2Head 2Players"), ongeacht welke tegel je aanklikt — een technisch mankement in hun Webflow-tabcomponent (bevestigd door de pagina's eigen broncode te inspecteren: er zijn wél 11 losse `<iframe>`-elementen met elk een eigen YouTube-video aanwezig in de HTML, maar de front-end wisselt niet naar het juiste paneel). Ik heb de 11 echte video-URL's daarom niet via de live site gevonden, maar via een **Wayback Machine-snapshot** van dezelfde pagina (12 juni 2026) waarin de broncode nog wel alle 11 iframe-src's in de juiste volgorde bevatte.

## Wat is iDarts — kernprofiel

| Aspect | Bevinding | Bron |
|---|---|---|
| Type platform | Dartsstatistieken-database + dashboard (geen live-scoring, geen hardware) | `idarts.nl`, `stats.idarts.nl` |
| Databronnen | PDC, WDF, BDO + (recent) DartConnect-API-import | `idarts.nl`, changelog (al vastgesteld gisteren) |
| Oprichter/gezicht | Jacques Nieuwlaat (dartscommentator) | `idarts.nl/about-us`, herbevestigd t.o.v. gisteren |
| Omvang database | 1000+ competities, 27.000+ spelers, 420.000+ wedstrijden | `idarts.nl` (ongekruist, zie Beperkingen) |
| Doelgroep | Tv-commentatoren, analisten, media, wedkantoren, toernooiorganisatoren | `idarts.nl/services`, `stats.idarts.nl/Dashboard/Introduction` |
| Prijs database | €275/jaar excl. btw, loopt tot einde eerstvolgende PDC WK, automatische verlenging | `idarts.nl/services` (nieuw t.o.v. gisteren) |
| Prijs Web API v2 | Op aanvraag/custom quote, geen vaste prijs gevonden | `idarts.nl/services`; bevestigt het "geen pricing gevonden"-punt uit gisteren |
| Bekende afnemers/partners | Bulls Netherlands, RTL7 Darts, Mastercaller.com | `stats.idarts.nl/Dashboard/Introduction` |
| Talen | Engels en Nederlands (taalknop op de homepage) | tutorial "iDarts Homepage" |

### Relatie met Mastercaller

De ene, wél werkende video op de live site staat op het YouTube-kanaal **"Mastercaller"** (@Mastercaller180, 698 abonnees, 184 video's — een Nederlands dartsnieuwskanaal van Koert Westerman en Jacques Nieuwlaat). `mastercaller.com` is een aparte, publiek zonder login te bezoeken resultatensite die zelf **"Stats by iDarts"** vermeldt — dus Mastercaller is een tweede, publieksgerichte frontend bovenop dezelfde iDarts-database, geen aparte database. Dit bevestigt en verduidelijkt wat het DartConnect-onderzoek van gisteren (sectie 9) al concludeerde over Jacques Nieuwlaat/iDarts/Mastercaller.

## Functionaliteit, per onderdeel (uit de 11 tutorial-video's)

Elke video is letterlijk getranscribeerd (Firecrawl, Engelstalige ondertitels — YouTube blokkeerde tijdens dit onderzoek automatisch ophalen via de gewone route, zie Methodologie). Hieronder een samenvatting per functie; de volledige transcripten staan lokaal, zie "Bronbestanden" onderaan.

### 1. Homepage
Na inloggen: een korte statusregel (aantal spelers/wedstrijden in de database), actieve toernooien, toernooien die binnen 7 dagen starten, en toernooien die de afgelopen week zijn afgelopen (met winnaar en doorklik-link). Bovenin: taalkeuze (EN/NL), accountnaam, en een link naar de handleiding (2x per jaar bijgewerkt). Hoofdmenu: Competition (1113 competities, genoemd in de video), Season, Players, Pairs, Venue, Reports, Rankings (PDC/WDF, deels "in development"). Een globale zoekfunctie doorzoekt alles tegelijk (voorbeeld in de video: zoeken op "world championship" geeft alle varianten inclusief kwalificatietoernooien).

### 2. Head2Head — 2 spelers
Volgens de presentator **de meest gebruikte functie van iDarts**. Zoek twee spelers op (bv. Michael van Gerwen vs. Peter Wright), en krijg: totaal aantal onderlinge wedstrijden, winst/verlies/gelijkspel, gemiddelde-van-gemiddelden, winstpercentage, +/- in sets en legs, en een volledige wedstrijdlijst (sorteerbaar op datum, met walkovers apart gemarkeerd). Filters: startdatum/einddatum, ronde (bv. alleen finales), competitie(s) of competitiegroep (bv. "alle PDC Majors", "alle tv-competities"), nationaliteit, seizoensschema (knockout vs. groepen), en gender. Filters zijn combineerbaar — het voorbeeld in de video bouwt stapsgewijs op tot "Van Gerwen–Wright, alleen Majors, alleen knockout-fase, sinds 1 januari 2022".

### 3. Head2Head — 1 speler
Zelfde onderliggende functie, maar met één speler in plaats van twee, waardoor extra filtercombinaties zinvol worden: prestaties dit jaar, alleen in een specifiek toernooi (bv. "World Matchplay"), tegen een specifieke nationaliteit, tegen vrouwelijke tegenstanders, of in een specifieke locatie (voorbeeld: Michael Smith in de 3Arena Dublin, alleen Premier League).

### 4. iDarts Reports — deel 1
Vijf rapporten:
- **All-time participants** — alle spelers die ooit in een gekozen competitie/combinatie van competities speelden, met aantal deelnames, jaren, wedstrijden, W/L/gelijk, en winstpercentage. Sorteerbaar per kolom (voorbeeld: Phil Taylor met 25 PDC WK-deelnames tussen 1994–2018; Steve Beaton met 31 deelnames aan alle WK's samen sinds 1992).
- **Finals** — overzicht van wie in hoeveel finales heeft gestaan/gewonnen in een gekozen competitie (voorbeeld: Phil Taylor met 56 Players Championship-finales, 45 titels).
- **Number one seeds** — hoe de nummer-1-reekshoofden het deden per toernooi-editie.
- **High finishes** — hoogste uitworpen per competitie, met aantal keer bereikt.
- **Nine dart finishes** — alle geregistreerde 9-darters, apart gesplitst in "op tv" (69 stuks op moment van opname) en "online/overig" — expliciet gemarkeerd als **niet-compleet** door de presentator zelf ("we by no means think this list is complete").

### 5. iDarts Reports — deel 2
Nog vijf rapporten:
- **Head to Country** — één speler tegen alle spelers van één land (voorbeeld: Gary Anderson vs. Duitse spelers: 35 wedstrijden, 32 gewonnen).
- **Country to Country** — twee landen tegen elkaar (voorbeeld: Nederland–Denemarken, 425 wedstrijden).
- **Couple to Couple** — hetzelfde maar voor paren/teams (bv. WK Darts-koppels).
- **Averages** — top-lijsten van hoogste/laagste gemiddelden, filterbaar op winnaar/verliezer, competitie(s), speler, gender en datum (voorbeeld: hoogste gemiddelde van een verliezer ooit op het PDC WK was Raymond van Barneveld, 109,34 in de halve finale van 2017 tegen Van Gerwen).

### 6. Rankings
PDC en WDF orders of merit, inclusief sub-rankings (Pro Tour, Euro Tour, Players Championship, World Series, Challenge/Development/Women's Series, Q School EU/UK, aangesloten tours zoals CDC/Nordic&Baltic/DPA). Elke ranking-regel is uit te klappen om te zien waar de punten/het prijzengeld vandaan komen. Kolommen zijn aan/uit te zetten. Sommige rankings staan expliciet gemarkeerd als "in development" — de presentator waarschuwt daar zelf voor.

### 7. Competition
De lijst van alle competities, met filters (bv. "PDC Majors") en zoekfunctie. Per competitie twee knoppen: een info-knop (achtergrondverhaal + lijst van alle gespeelde seizoenen) en een rekenmachine-knop (statistieken, samengevoegd over alle edities of per los seizoen): finalisten, landenstatistieken, 9-darters, hoogste gemiddeldes, meest-deelnames, hoogste uitworpen per jaar, en 180-tellingen (voorbeeld: Phil Taylor met 688 180's op het PDC WK, ooit). Tv-toernooien worden live bijgewerkt zodra een wedstrijd is afgelopen.

### 8. Player Page (spelersprofiel)
20.000+ spelers in de lijst, met foto (indien beschikbaar), voornaam/achternaam, nationaliteit, gender. Een spelersprofiel bevat: persoonlijke info (tot en met nationaliteit gegarandeerd actueel; daarna — burgerlijke staat e.d. — expliciet met een disclaimer dat dit kan verouderen), materiaal (gewicht dartpijlen, sponsor), walk-on music, links naar eigen website/social media, en een vermelding als iemand ook op Mastercaller.com staat. Zes subtabbladen: titels (per categorie: Majors, World Series, andere tv-events, Euro Tour, WDF Cups, overig), wedstrijddetails per toernooi, specials (9-darters/hoogste uitworpen), laatste 20 wedstrijden, live ranking-positie (dagelijks bijgewerkt) en opgeslagen rankings (3x per jaar bewaard: start seizoen, na World Matchplay, einde seizoen — historie beschikbaar vanaf ca. 2010).

### 9. Player Stats
Dieper statistiekenoverzicht per speler: totaal prijzengeld (uitgesplitst, alleen tv-toernooien voor WDF, alle PDC-toernooien), aantal titels/finales per categorie, hoogste gemiddelde (tv/Majors), laatste 20 wedstrijden én laatste 20 toernooiresultaten, top-10 hoogste/laagste gemiddeldes (algemeen, tv, Majors), en twee grafieken: gemiddelde-verdeling over de carrière en gemiddelde-trend door de tijd heen.

### 10. Player Pairs
Lijst van alle paren/teamevenementen. Zoekfunctie op combinatie van voornaam- en achternaamfragmenten. Per paar: alle gespeelde toernooien met resultaat en datum, plus een doorklik naar de losse spelersprofielen.

### 11. Venue
Lijst van locaties (naam, adres, plaats, land, evt. foto en opmerkingen zoals een vroegere naam). Per locatie: alle toernooien die er ooit gespeeld zijn of gepland staan, met doorklik naar het seizoen.

## Kanttekening: naamsverwarring met een ander product

Tijdens het zoeken kwam ook **"RadikalDarts iDarts®"** naar boven — een Spaans automatisch dartbord-scoresysteem met camera's en laserafstandsmeting (`radikaldarts.com`). Dit is een **volledig ander product van een ander bedrijf**, met dezelfde naam maar geen enkele relatie tot het Nederlandse `idarts.nl`/`stats.idarts.nl` uit dit rapport. Vermeld hier alleen om verwarring te voorkomen — verder niet onderzocht, want niet relevant voor het gevraagde platform.

## Bronbestanden

De 11 volledige transcripten (Engels, via Firecrawl) staan lokaal in [PKM/Documents/YouTube-Kennis/iDarts (Mastercaller)/](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/):

1. [iDarts Head2Head 2Players](https://www.youtube.com/watch?v=qHsfqaXt-iA) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Head2Head%202Players%20%5BqHsfqaXt-iA%5D.md)
2. [iDarts Head2Head 1Player](https://www.youtube.com/watch?v=1xIoDUABFXE) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Head2Head%201Player%20%5B1xIoDUABFXE%5D.md)
3. [iDarts Homepage](https://www.youtube.com/watch?v=p6c16tBH_HA) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Homepage%20%5Bp6c16tBH_HA%5D.md)
4. [iDarts Reports I](https://www.youtube.com/watch?v=T01POjTblYw) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Reports%20I%20%5BT01POjTblYw%5D.md)
5. [iDarts Reports II](https://www.youtube.com/watch?v=hYXlaL3Lb8Y) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Reports%20II%20%5BhYXlaL3Lb8Y%5D.md)
6. [iDarts Rankings](https://www.youtube.com/watch?v=KFuvJOM4uYw) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Rankings%20%5BKFuvJOM4uYw%5D.md)
7. [iDarts Competition](https://www.youtube.com/watch?v=xsGLAf4zgNw) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Competition%20%5BxsGLAf4zgNw%5D.md)
8. [iDarts Player Page](https://www.youtube.com/watch?v=SXPRw-DVQu4) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Player%20Page%20%5BSXPRw-DVQu4%5D.md)
9. [iDarts Player Stats](https://www.youtube.com/watch?v=bQkv_tFw2xI) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Player%20Stats%20%5BbQkv_tFw2xI%5D.md)
10. [iDarts Pairs](https://www.youtube.com/watch?v=KwNEsfxyHUY) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Pairs%20%5BKwNEsfxyHUY%5D.md)
11. [iDarts Venue](https://www.youtube.com/watch?v=aohHEv76Asw) — [transcript](file:///Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM/Documents/YouTube-Kennis/iDarts%20(Mastercaller)/01%20-%20iDarts%20Venue%20%5BaohHEv76Asw%5D.md)

Alle 11 video's zijn **"verborgen" (unlisted)** op YouTube — ze verschijnen niet in het kanaaloverzicht of de zoekfunctie van Mastercaller, alleen bereikbaar via de directe link (zoals ingebed op de kapotte iDarts-pagina).

## Methodologie

- Marketingsite `idarts.nl` (Home, About us, How it works, Services) en dashboard-introductiepagina `stats.idarts.nl/Dashboard/Introduction` rechtstreeks gefetcht.
- De 11 echte video-ID's zijn achterhaald doordat de live "How it works"-pagina niet correct wisselde tussen tutorials; een Wayback Machine-snapshot (12 juni 2026) van dezelfde pagina bevatte de broncode nog wél met alle 11 losse iframe-src's in de juiste volgorde, gecontroleerd via directe DOM-inspectie (JavaScript in de browser-tool) in plaats van aangenomen.
- Elke video is opgehaald met de `/transcribeer`-skill. Tijdens het draaien bleek het IP van deze sessie al door YouTube geblokkeerd (`IpBlocked`) voor de reguliere ondertitel-route; de skill schakelde daardoor automatisch over op de Firecrawl-terugval (bevestigd in elke skill-uitvoer als "via Firecrawl"). Dit betekent: de tekst komt van Firecrawls YouTube-verwerker, niet rechtstreeks van YouTube's ondertitel-API — functioneel gelijkwaardig, maar hier expliciet vermeld voor transparantie.
- Prijs- en bedrijfsinformatie (About us, Services) is via WebFetch samengevat door een tussenliggend AI-model (niet letterlijk uit de bron gekopieerd) — behandel exacte bewoording als parafrase, de cijfers (€275, 1000+/27k+/420k+) zijn wel als zodanig overgenomen uit die samenvattingen.
- Voortbouwend op en waar mogelijk gekruist met het [DartConnect-dashboardonderzoek van 2026-08-18](2026-08-18-dartconnect-data-dashboard-onderzoek.md), dat iDarts al gedeeltelijk had onderzocht (Web API v2-structuur, DartConnect-importrelatie, oprichter). Dit rapport dupliceert die eerdere bevindingen niet, maar verwijst ernaar.

## Beperkingen

- Het cijfer "1000+ competities, 27.000+ spelers, 420.000+ wedstrijden" komt uit één bron (de About us-pagina, via AI-samenvatting) en is niet elders gekruist — zelfde beperking als in het DartConnect-rapport van gisteren al genoteerd.
- De prijs van €275/jaar geldt specifiek voor **databasetoegang** (het web-dashboard); de prijs van de **Web API v2** blijft onbekend (bevestigt, herhaalt niet opnieuw hard, het punt uit gisteren).
- Ik heb **niet ingelogd** op `stats.idarts.nl` en dus geen enkele functie zelf live getest — alles in de sectie "Functionaliteit" komt uit de tutorial-transcripten zelf (die dateren van rond 2022, te zien aan voorbeelden als "we zijn nu medio 2022"), dus recente UI-wijzigingen zijn niet uitgesloten.
- De tutorial-video's zijn **onvermeld gedateerd** door iDarts zelf, maar interne verwijzingen in de transcripten (bv. "we are end of June at the moment in 2022", "World Matchplay 2022") wijzen op **medio 2022** als opnamejaar — dat is een afleiding uit de inhoud, geen elders bevestigd feit.
- Geen zelfstandig onderzoek gedaan naar of iDarts specifiek NDB LaCo/SuperLeague-teamwedstrijden dekt — dat punt staat al (met "geen bevestigd feit"-markering) in het DartConnect-rapport van gisteren, sectie 8b, en is hier niet opnieuw getest.
