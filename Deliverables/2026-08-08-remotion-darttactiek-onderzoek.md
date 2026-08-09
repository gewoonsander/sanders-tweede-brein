---
id: 2026-08-08-remotion-darttactiek-onderzoek
title: Remotion voor Darttactiek-content — verkenning
status: onderzoek
owner: athena
datum: 2026-08-08
---

# Remotion voor Darttactiek-content — verkenning

## Verdict (kort)

**Nog niet — blijft "Later" per de bestaande beslissing in [[Deliverables/2026-06-30-video-systeem-design]].** Er is één kandidaat die dicht bij "rijp" zit (quote/tip-cards uit het boekmanuscript), maar zelfs die rechtvaardigt geen tooling-investering vóórdat het format handmatig is gevalideerd. De rest (toernooi-recaps, ledenvoortgang, ranking-updates) mist nog de onderliggende data — dat is het echte knelpunt, niet het gereedschap.

Twee dingen zijn wél veranderd sinds 30 juni die het herbeoordelen waard maken over ~2-3 maanden: Remotion heeft in januari 2026 een Claude Code Agent Skill uitgebracht (in gewone taal een video beschrijven, Claude genereert de React-componenten) wat de instapdrempel verlaagt voor een team dat al Claude-Code-native werkt, en het team heeft inmiddels Bezalel (Frontend Developer, React-vaardig) in huis — de "wie bouwt dit"-vraag is dus makkelijker te beantwoorden dan in juni. *(Medium confidence — de Skill-claim komt uit secundaire bronnen, niet rechtstreeks van remotion.dev/changelog; niet geverifieerd als primaire bron.)*

## 1. Concrete formatkandidaten

| Idee | Data komt van | Repeterend? | Klaar nu? |
|---|---|---|---|
| **Tip-cards uit het boek**: elke tip/paragraaf uit het 160-pagina manuscript als korte (15-30s) verticale video — tekst animeert in, dartbord-graphic, DartsCoaching-huisstijl | Bestaand manuscript-PDF, handmatig of AI-geëxtraheerd naar tip-lijst (JSON/CSV) | Ja — vaste vorm, wisselende tekst, tientallen instanties mogelijk | **Dichtst bij rijp.** Data bestaat al, geen nieuwe pipeline nodig |
| **Toernooi-recap clips**: Spotify-Wrapped-stijl persoonlijke video per lid na een toernooi (checkout-%, gemiddelde, resultaat) | Huddle "Dartstoernooi reflectietool" (2 lessen, Tips & Tools-cursus) | Ja, mits data exporteerbaar | **Nee** — onbekend of de reflectietool gestructureerde, exporteerbare data levert (Martonny's domein, niet geverifieerd) |
| **Ledenvoortgang-clips**: periodieke "jouw ontwikkeling"-video per Dart Buddies-lid | Zou longitudinale ledendata vereisen (checkout-% over tijd etc.) | Ja, in theorie | **Nee** — dit dataset bestaat nog niet |
| **Finish-route/bogey-uitleg-shorts**: vaste template (dartbord-diagram + score), alleen het target-getal/de route wisselt | Bestaande finish-tabellen die al in coaching gebruikt worden | Ja | Grotendeels klaar, klein format — twijfelachtig of dit Remotion nodig heeft t.o.v. een vaste Canva-template met 20 varianten |
| **ADC-ranking-updates**: leaderboard/bar-chart-race-stijl standenupdate | Zou structured ranking-feed vereisen | Ja, mits data | **Nee** — geen bekende structured feed |

De rode draad: Remotion's sterke punt is *data → vaste template → batch-render*, exact het "Spotify Wrapped"-patroon dat in meerdere onafhankelijke bronnen als het canonieke gebruiksgeval terugkomt ([Knightli](https://knightli.com/en/2026/05/27/remotion-react-programmatic-video-generation/), [YUV.AI](https://yuv.ai/blog/remotion) — *medium confidence, aggregator-bronnen, geen primaire Remotion-caseload*). Van de vijf ideeën hierboven is alleen de tip-cards-optie vandaag al data-compleet; de rest wacht op een dataprobleem dat niets met Remotion te maken heeft.

## 2. Technische fit (geverifieerd)

- **Skillset:** React + Node.js, TypeScript-ondersteund. Geen visuele editor — alles is code. Vereist Node 16+ (of Bun 1.0.3+), Chrome headless voor rendering, ffmpeg. macOS 15+ vereist op recente versies. *(High confidence — officiële docs, [remotion.dev/docs](https://www.remotion.dev/docs).)*
- **Rendering:** lokaal renderen is gratis (alleen compute-tijd); Remotion Lambda (AWS) is optioneel voor snelheid/schaal — "vanaf $0,01 per minuut", 200x concurrency, excl. S3/data-transfer. Voor Sander's volumes (tientallen, geen duizenden video's) is lokaal renderen ruim voldoende — Lambda is pas relevant bij écht grote batches. *(Medium-high confidence — officiële remotion.dev/lambda pagina.)*
- **Output:** MP4/video, GIF, en losse stills (PNG) — dus ook bruikbaar voor geautomatiseerde quote-images, niet alleen video.

## 3. Licentie — belangrijk, niet MIT

Remotion is **source-available, geen open source in OSI-zin**. Bevestigd via drie onafhankelijke bronnen die overeenstemmen:

- **GitHub LICENSE.md** (primair): gratis voor individuen, non-profits, en for-profit organisaties **tot en met 3 mensen**. Grotere for-profit organisaties hebben een betaalde Company License nodig.
- **remotion.pro/license** (primair, prijzen): Company License vanaf **$25/maand per seat** ("Creators"), of usage-based **$0,01/render met $100/maand minimum** ("Automators"); Enterprise vanaf **$500/maand**.
- **Onafhankelijke bevestiging**: de maker van Revideo (een open-source Remotion-alternatief, gebouwd als reactie hierop) noemt Remotion expliciet "not FOSS" op Hacker News — externe bron die hetzelfde 3-personen-omslagpunt bevestigt.

**Confidence: High** — twee primaire bronnen (GitHub + remotion.pro) plus een onafhankelijke derde partij komen overeen op exact dezelfde drempel (3 personen) en licentiestructuur.

**Relevant voor DartsCoaching.nl:** het team achter DartsCoaching.nl bestaat uit meer dan 3 personen (Sander, Joppe, Rik, plus minstens Darren als genoemd in de strategie-overleggen) — als video's onder de DartsCoaching.nl-bedrijfsnaam geproduceerd worden, is de kans reëel dat de gratis licentie **niet** van toepassing is en een betaalde Company License nodig is. Dit is niet geverifieerd (geen officiële headcount-bron geraadpleegd) en moet gecheckt worden vóórdat er ook maar één Remotion-project wordt opgezet.

## 4. Anti-patronen om te vermijden

- **Tooling vóór validatie bouwen.** De verleiding is een hele Remotion-pipeline optuigen voor "tip van de dag" voordat is bewezen dat het format (kort, tekst-gedreven, geen talking head) publiek aanslaat. Test eerst 5-10 tip-cards handmatig in Canva/DaVinci — kost een middag, geen developer-tijd.
- **Remotion zien als DaVinci-vervanger.** Het is geen editor voor talking-head- of schermopnames — dat blijft OBS + DaVinci. Remotion is uitsluitend zinvol voor het templated/data-gedreven segment.
- **"Het staat op GitHub dus het is gratis" aannemen.** Zoals hierboven: bij 4+ mensen in de organisatie is een betaalde licentie vereist. Niet checken = licentierisico voor een bedrijf, niet alleen een privéproject.

## 5. Open vragen (niet opgelost)

1. Levert de Huddle "Dartstoernooi reflectietool" exporteerbare, gestructureerde data (API of export)? — vraag voor Martonny.
2. Hoeveel mensen werken feitelijk (betaald of onbetaald, structureel) voor/bij DartsCoaching.nl? Bepaalt of de gratis Remotion-licentie nog geldt.
3. Is de Remotion Claude Code Agent Skill (genoemd in secundaire bronnen, jan. 2026) daadwerkelijk uitgebracht en hoe volwassen is die? Niet bij de primaire bron (remotion.dev) geverifieerd — alleen via aggregator-artikelen.

## Bronnen

- [remotion.dev/docs](https://www.remotion.dev/docs) — officieel, technische requirements
- [remotion.dev/docs/license](https://www.remotion.dev/docs/license) / [github.com/remotion-dev/remotion/blob/main/LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) — officieel, licentietekst
- [remotion.pro/license](https://www.remotion.pro/license) — officieel, prijzen Company/Enterprise License
- [remotion.dev/lambda](https://www.remotion.dev/lambda) — officieel, Lambda-rendering en kosten
- Hacker News (Revideo-maker over Remotion's licentie) — onafhankelijke derde partij
- [knightli.com](https://knightli.com/en/2026/05/27/remotion-react-programmatic-video-generation/), [yuv.ai/blog/remotion](https://yuv.ai/blog/remotion) — secundair, gebruikscases (medium confidence)
- Interne context: [[Deliverables/2026-06-30-video-systeem-design]], [[PKM/Documents/2025-09-01-boek-darttactiek-van-beginner-tot-professional]], [[PKM/My Life/Topics/darts-coaching]], [[PKM/My Life/Topics/dart-buddies]]

## Methodologie & beperkingen

WebSearch + WebFetch op officiële Remotion-bronnen (docs, license, pro/license, lambda) plus onafhankelijke derde partijen ter triangulatie van de licentieclaim. Geen toegang tot Huddle-reflectietool-data of DartsCoaching.nl-teamgrootte — die twee gaten bepalen het meest of dit ooit een "nu"-project wordt in plaats van "later".
