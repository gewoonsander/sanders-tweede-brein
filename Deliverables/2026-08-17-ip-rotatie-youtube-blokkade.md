---
title: "IP-blokkade YouTube-scraping: mechanisme en realistische IP-rotatie-opties"
date: 2026-08-17
author: Athena
type: research-brief
status: final
---

# IP-blokkade YouTube-scraping: mechanisme en realistische IP-rotatie-opties

## Samenvatting

YouTube blokkeert niet "een specifiek IP-adres uit boosheid" — het is een geautomatiseerd verzoeksnelheids- en reputatiesysteem dat vooral kijkt naar *hoe snel* en *hoe machinaal* verzoeken binnenkomen, niet alleen *vanaf welk* IP. Een nieuw IP-adres (via router-herstart, hotspot, VPN of proxy) verandert daardoor niets structureels als het onderliggende gedrag — hard achter elkaar bonken — hetzelfde blijft. Voor Sanders schaal (incidenteel een paar honderd video's, geen continue automatisering) is de goedkoopste en meest solide aanpak: de al gebouwde throttle/circuit-breaker laten werken, de huidige blokkade laten verlopen, en IP-rotatie alleen als aanvulling zien — nooit als vervanging van nette snelheid.

## Kernbevindingen

**1. Detectiemechanisme — Hoog vertrouwen** (3+ onafhankelijke bronnen)
YouTube's anti-bot-laag combineert: (a) verzoekvolume/snelheid per IP binnen een tijdvenster, (b) IP-reputatie — datacenter-, VPN- en gedeelde-proxy-IP's worden sneller gewantrouwd dan "schone" residentiële/mobiele IP's, (c) gedrags- en headerpatronen — identieke of ontbrekende browser-headers, geen JavaScript-uitvoering, geen menselijke timing. Escalatie verloopt trapsgewijs: zachte blokkade (HTTP 429 / "bevestig dat je geen bot bent") → CAPTCHA → (tijdelijke) IP-ban bij aanhoudend misbruik.

**2. Duur van de huidige blokkade — Middelmatig vertrouwen** (community-consensus, geen officiële YouTube-bevestiging)
De 24-48 uur die Sander al aanhield komt overeen met wat community-bronnen en de yt-dlp-projectdocumentatie zelf aanhouden: 429/IP-blokkades worden daar expliciet "zachte" blokkades genoemd die na een wachttijd of een CAPTCHA kunnen opheffen. Geen enkele bron kon een officieel, door YouTube bevestigd getal vinden — blijft anekdotisch.

**3. Router/modem herstarten voor een nieuw WAN-IP — Laag/middelmatig vertrouwen, tegenstrijdige bronnen**
Sommige KPN Community-topics stellen dat herstarten een nieuw WAN-IP oplevert. Algemenere kabel/DOCSIS-bronnen (Cox-forums, SNBForums) zeggen dat een simpele herstart vaak *niet* genoeg is: of je een nieuw IP krijgt hangt af van de DHCP-lease-instellingen van de provider en of het IP aan je MAC-adres gebonden is — soms moet de lease eerst verlopen, soms helpt zelfs herstarten niet zonder MAC-wijziging. **Conclusie: geen garantie, gratis om te proberen, niet iets om op te vertrouwen.**

**4. Mobiele hotspot / 4G-dongle — Middelmatig vertrouwen**
Een ander netwerk levert vrijwel zeker een ander IP dan de vaste lijn. Maar Nederlandse mobiele netwerken draaien vrijwel allemaal achter CGNAT (bevestigd voor KPN mobiel; voor Odido mobiel afhankelijk van de gebruikte APN) — het IP wordt gedeeld met veel andere klanten. Cloudflare's eigen onderzoek (blog.cloudflare.com, 2025) laat zien dat CGNAT-IP's ~3x vaker te maken krijgen met rate-limiting/frictie dan niet-gedeelde IP's, juist omdat andere gebruikers op hetzelfde gedeelde IP meetellen. Tegelijk zijn platforms terughoudender om hele mobiele CGNAT-ranges permanent te blokkeren, omdat dat te veel onschuldige gebruikers zou raken. Netto waarschijnlijk beter dan een VPN, maar geen garantie.

**5. VPN — Hoog vertrouwen** (2+ onafhankelijke bronnen)
Veel VPN-exit-IP's zijn door YouTube al gevlagd of geblokkeerd, precies omdat ze door duizenden gebruikers gedeeld worden en vaak voor scraping/geautomatiseerd verkeer worden misbruikt — de reputatie van de slechtste gebruiker van een exit-node wordt geërfd door iedereen die die node gebruikt. Voor dit specifieke doel (YouTube-scraping) is een gewone consumenten-VPN eerder een risico dan een oplossing.

**6. Residential proxies — Hoog vertrouwen, incl. een directe primaire bron**
Belangrijkste vondst: de maker van `youtube-transcript-api` — de exacte library die Sanders `/transcribeer`-script gebruikt — raadt in de eigen GitHub-README specifiek "rotating residential proxies" aan als meest betrouwbare oplossing, en heeft Webshare's residential-proxy-dienst rechtstreeks in de library geïntegreerd. Dit is dus geen generiek scraping-advies maar een aanbeveling van de tool-auteur zelf. Ethisch/juridisch: legitimiteit hangt af van hoe providers hun IP's verkrijgen. Betrouwbare aanbieders claimen expliciete opt-in-toestemming (bv. via SDK-monetisatie in gratis apps). Er zijn ook recente, grootschalige handhavingszaken tegen providers die IP's zonder toestemming via malware verzamelden (FBI-ontmanteling van 911 S5, mei 2024, destijds mogelijk het grootste botnet ooit met ~19 miljoen IP's; Google/FBI-verstoring van NetNut, juli 2026, ~2 miljoen gekaapte apparaten). Puur feitelijk vermeld, geen oordeel — het punt is: niet elke "residential proxy"-aanbieder is gelijk.

**7. Fysieke "4G-proxy"-apparaatjes — Middelmatig vertrouwen** (prijzen uit 1-2 leveranciers, niet volledig onafhankelijk gekruist)
Bestaan echt en worden gebruikt in groei-/marketing-/scraping-communities (bevestigd op forums als BlackHatWorld en meerdere leveranciers). Twee varianten: (a) zelf een 4G/5G-USB-modem + simkaart thuis aansluiten met software als iProxy Online (vanaf $6-9/maand per apparaat, exclusief simkosten), of (b) kant-en-klare hardware kopen bij leveranciers als Coronium.io (4G-modems rond €79/stuk, 5G rond €180/stuk, plus simkaartkosten). Dit is in essentie een doe-het-zelf-variant van hetzelfde principe als mobiele/residentiële proxies — gebouwd voor continue, grootschalige automatisering, niet voor incidenteel persoonlijk gebruik.

**8. NL/EU-specifiek — Hoog vertrouwen**
CGNAT is de norm op mobiele netwerken in Nederland (bevestigd voor KPN mobiel; Odido afhankelijk van APN — zakelijke APN's zonder CGNAT). Vaste lijnen (glasvezel, kabel) geven doorgaans een eigen dynamisch IP zonder CGNAT. Een mobiele hotspot geeft dus sowieso al een gedeeld IP, zonder dat daar iets voor hoeft te gebeuren of betaald te worden.

## Praktisch advies voor Sanders situatie

Voor een individuele hobbyist/eenmanszaak die incidenteel een paar honderd video's ophaalt (geen continue schaal):

1. **Eerst: gewoon laten verlopen.** Kost niets, geen risico. De throttle/circuit-breaker/pre-flight-check die al gebouwd is, is precies het juiste medicijn tegen herhaling.
2. **Router herstarten mag je proberen** — gratis, twee minuten — maar reken er niet op; de bronnen zijn het onderling niet eens of dit bij Nederlandse providers betrouwbaar werkt.
3. **Mobiele hotspot als tijdelijk tweede kanaal** voor een kleine testbatch is een redelijke, goedkope optie (ander netwerk, ander IP), maar geen structurele gewoonte — het is een gedeeld CGNAT-IP, dus ook niet garantievrij.
4. **VPN afraden** voor dit specifieke doel — juist de gedeelde/misbruikte exit-IP's zijn vaak al door YouTube geblokkeerd.
5. **Residential proxy (bv. Webshare, zoals de library-auteur zelf aanbeveelt)** is de meest betrouwbare technische oplossing als de blokkade blijft terugkomen — lage instapkosten, directe integratie mogelijk in `youtube-transcript-api`.
6. **Fysieke 4G-proxy-hardware: overkill.** Dat gereedschap is gebouwd voor continue, grootschalige marketing-/groei-automatisering, niet voor een persoonlijk kennisarchief van een paar honderd video's per keer.

**Het expliciet gevraagde antwoord:** IP-rotatie lost het probleem **niet structureel** op als zonder de throttle wordt gewerkt. Verzoeksnelheid is in alle onderzochte bronnen het primaire triggersignaal, niet alleen "welk IP". Een nieuw IP zonder vertraging brandt zichzelf net zo snel op als het vorige. IP-rotatie is alleen zinvol **in combinatie met** nette snelheid tussen verzoeken — nooit als vervanging ervoor.

## Methodologie

WebSearch als primair pad, over 11 losse zoekopdrachten, telkens gekruist tegen minimaal twee onafhankelijke websites/leveranciers/community's per claim. Voor de meest relevante en concrete claim (bevinding 6) is een primaire bron geraadpleegd: de eigen GitHub-repository van `youtube-transcript-api` (de library achter Sanders script). Voor CGNAT-gedrag is Cloudflare's eigen onderzoeksblog geraadpleegd als primaire bron. **Beperking:** het tweede, mechanisch onafhankelijke zoekpad (Perplexity Sonar API via `Team Knowledge/scripts/perplexity_search.py`, normaal het standaard tweede pad bij dit type onderzoek) was in deze sessie niet uitvoerbaar omdat er geen shell-toegang beschikbaar was voor deze deelagent. Ter compensatie is extra breed gekruist over meerdere onafhankelijke WebSearch-query's en primaire bronnen per claim.

## Beperkingen

- Geen officiële YouTube-documentatie gevonden over blokkadeduur — alles is community-consensus/anekdotisch, consistent met Sanders eigen 24-48u-inschatting maar niet hard bevestigd.
- Router-herstart-gedrag is niet empirisch getest op Sanders eigen aansluiting (provider/modemtype); de bronnen spreken elkaar tegen, dus dit blijft onzeker totdat hij het zelf uitprobeert.
- Prijzen voor fysieke 4G-proxy-hardware komen uit een beperkt aantal leverancierssites — indicatief, niet als vaste marktprijs te lezen.
- Geen actie ondernomen; dit is puur onderzoek zoals gevraagd.

## Aanbevelingen

- Geen aankoop of implementatie nodig op korte termijn — de blokkade verloopt vanzelf en de throttle staat al.
- Als dit patroon zich herhaalt: overweeg Webshare (of vergelijkbare, transparant-consent-gebaseerde residential-proxy-dienst) rechtstreeks via de bestaande library-integratie, in plaats van fysieke hardware of een VPN.
- Nieuw onderwerp voor `PKM/My Life/Topics/`: geen directe noodzaak, dit is eenmalig incident-gebonden research; bij herhaling kan het zijn eigen topic-notitie verdienen.
