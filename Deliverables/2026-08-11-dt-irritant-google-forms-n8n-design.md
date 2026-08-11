# D.T. Irritant — Google Forms via n8n

## Status

Ontwerp ter goedkeuring. Nog niet implementeren.

## Doel

Vanuit het officiële wedstrijdschema van D.T. Irritant in Teambeheer automatisch een Google Form maken waarmee acht spelers hun beschikbaarheid voor het seizoen doorgeven. Antwoorden worden in Google Sheets samengevat per wedstrijd.

## Bron en uitgangspunten

- Teambeheer is de inhoudelijke single source of truth voor wedstrijddata.
- Seizoen 2026–2027 bevat 22 wedstrijden.
- Publiek is geen officiële Teambeheer-API, iCal-feed of gedocumenteerde export gevonden.
- `feeds.teambeheer.nl/robots.txt` sluit geautomatiseerd ophalen uit. Een periodieke n8n-scraper wordt daarom niet gebouwd zonder schriftelijke toestemming van Teambeheer.
- n8n.cloud en een bestaande Google-koppeling zijn aanwezig.
- Google Forms wordt via de officiële REST API aangemaakt: `forms.create`, gevolgd door `forms.batchUpdate`.
- Credentials blijven in n8n; geen OAuth-tokens in workflows, bestanden of myPKA.

## Aanpakken

### A — Officiële Teambeheer-koppeling aanvragen

Vraag Teambeheer om een API, export, agenda-feed of expliciete toestemming voor het geautomatiseerd uitlezen van de teamfeed. n8n haalt daarna rechtstreeks het actuele schema op.

**Voordelen:** volledig automatisch; Teambeheer blijft live bron; verplaatste wedstrijden kunnen automatisch worden verwerkt.

**Nadelen:** afhankelijk van medewerking van Teambeheer; onbekende doorlooptijd; geen publiek gedocumenteerde route gevonden.

### B — Teambeheer als SSOT, handmatig gestarte seizoenssync via n8n (aanbevolen)

Sander start eenmaal per seizoen de n8n-workflow. Die leest de bekende openbare teampagina voor uitsluitend D.T. Irritant uit met de parameters uit het bestaande Google Sheet `Feeds teambeheer`: dartbond `d=1`, intern teamnummer `t=394` en het vastgezette seizoen `s=26-27`. n8n normaliseert en valideert de 22 wedstrijden en toont eerst een controleoverzicht. Na bevestiging maakt n8n het Google Form en gekoppelde Sheet aan.

Het aangeleverde Google Sheet is een parametercatalogus, niet de wedstrijdbron. Teambeheer blijft de SSOT. Een gegenereerd antwoord-Sheet is een afgeleide snapshot. Bij een wedstrijdwijziging start Sander de sync opnieuw en bevestigt hij de voorgestelde wijzigingen.

**Voordelen:** direct uitvoerbaar; Teambeheer blijft bron; nauwelijks handwerk; goedkoop; auditeerbaar; veilig opnieuw uit te voeren; geen periodieke crawler.

**Nadelen:** de openbare HTML-feed heeft geen gedocumenteerd API-contract en kan veranderen; automatische toegang blijft afhankelijk van Teambeheers toestemming en gebruiksvoorwaarden. Daarom alleen handmatig starten, laag volume, duidelijke identificatie en stoppen bij blokkade.

### C — Browsergestuurde eenmalige uitlezing

Een ingelogde browsersessie opent Teambeheer, waarna de zichtbare wedstrijden eenmalig worden uitgelezen en aan n8n worden aangeboden.

**Voordelen:** geen overtypen; Teambeheer blijft bron.

**Nadelen:** fragiel bij UI-wijzigingen; browserlogin vereist; minder geschikt als onbeheerde automatisering; mag geen verborgen API of blokkades omzeilen.

## Aanbevolen ontwerp

Start met **B** en houd **A** als upgradepad.

```text
Google Sheet `Feeds teambeheer`
  ↓ parameters d=1, t=394, s=26-27
n8n Manual Trigger
  ↓ één gerichte Teambeheer-opvraag
Teambeheer (SSOT)
  ↓ normaliseren + valideren + dedupliceren
Controleoverzicht (22 wedstrijden)
  ↓ expliciete bevestiging
Google Forms API
  ├─ formulier aanmaken
  ├─ vragen toevoegen
  └─ publicatielink teruggeven
Google Sheets
  ├─ ruwe antwoorden
  ├─ beschikbaarheid per wedstrijd
  └─ ontbrekende spelers
```

## Formulierontwerp

- Naam speler: verplichte dropdown met de acht vaste spelers.
- Per wedstrijd één multiple-choice-grid of afzonderlijke vraag:
  - Beschikbaar
  - Misschien
  - Niet beschikbaar
- Wedstrijdlabel: datum, thuis/uit en tegenstander.
- Optioneel opmerkingenveld onderaan.
- Eén inzending per speler; spelers mogen hun antwoord later wijzigen wanneer Google-instellingen dit toestaan.

Voor mobiel gebruik wordt tijdens de proef bepaald of één matrix met 22 regels prettig genoeg is. Als die te lang of onoverzichtelijk blijkt, splitst n8n het formulier in secties per maand.

## n8n-workflows

### Workflow 1 — Formulier genereren

1. Manual Trigger.
2. Lees `d` en `t` uit het bestaande parameter-Sheet; gebruik verplicht `d=1`, `t=394` en `s=26-27`.
3. HTTP Request haalt één keer de openbare D.T. Irritant-teampagina op; geen schema-trigger of brede crawl.
4. HTML Extract/Code-node normaliseert datum, tegenstander, thuis/uit en locatie.
5. Validatie: response en alle wedstrijden moeten seizoen `26-27` betreffen; daarnaast unieke wedstrijden, geldige datums en verwacht aantal.
6. Preview; zonder bevestiging geen externe schrijfactie.
7. HTTP Request met Google OAuth2 naar `POST https://forms.googleapis.com/v1/forms`.
8. HTTP Request naar `batchUpdate` om vragen en secties toe te voegen.
9. Google Sheet aanmaken en configureren voor rapportage.
10. Formulier- en Sheet-URL teruggeven.

### Workflow 2 — Reacties verwerken

1. Google Forms Trigger indien geschikt, anders periodiek responses ophalen via Forms API.
2. Antwoord valideren en op spelernaam dedupliceren; nieuwste bevestigde inzending geldt.
3. Overzichtstab bijwerken: per wedstrijd beschikbaar/misschien/niet beschikbaar.
4. Ontbrekende spelers tonen.

### Workflow 3 — Herinnering (latere fase)

Alleen na aparte goedkeuring: herinnering voor spelers zonder inzending. Geen automatische berichten aan derden in de eerste versie.

## Betrouwbaarheid en beveiliging

- OAuth2-scopes minimaal houden: Forms body/responses en Drive/Sheets voor de aangemaakte bestanden.
- Secrets uitsluitend in n8n Credentials.
- Idempotency-key: `dt-irritant:<seizoen>`; opnieuw uitvoeren maakt niet stilzwijgend duplicaten.
- Bestaand formulier alleen wijzigen na expliciete bevestiging.
- Gestructureerde logging zonder OAuth-token of onnodige persoonsgegevens.
- Bij een gedeeltelijke fout blijft het formulier concept en rapporteert n8n exact welke stap faalde.

## Acceptatiecriteria

- De 22 wedstrijden komen correct uit een Teambeheer-kopie/CSV.
- n8n maakt één gepubliceerd Google Form met alle wedstrijden.
- De acht spelers kunnen mobiel invullen.
- Antwoorden verschijnen in een gekoppeld overzicht.
- Per wedstrijd is direct zichtbaar wie beschikbaar, onzeker of afwezig is.
- Een tweede workflow-run veroorzaakt geen dubbel formulier zonder waarschuwing.
- Er zijn geen terugkerende extra abonnementskosten.

## Open upgradepad

Daedalus kan Teambeheer via `info@teambeheer.nl` vragen naar een officiële API, exportfeed of toestemming voor de bestaande teamfeed. Als die route beschikbaar komt, vervangt die alleen de invoerstap; Google Forms, Sheets en de rest van de n8n-workflow blijven gelijk.

## Bronnen

- [Teambeheer — officiële productsite](https://www.teambeheer.nl/)
- [Google Forms API — forms.create](https://developers.google.com/workspace/forms/api/reference/rest/v1/forms/create)
- [Google Forms API — formulieren maken en bijwerken](https://developers.google.com/workspace/forms/api/guides/create-form-quiz)
- [Google Sheet — Feeds teambeheer](https://docs.google.com/spreadsheets/d/1y1DdTzTLeNY_hD4hTo_w6OrpenX4Jsb0RrIzYqc_hPk/edit?gid=469740844#gid=469740844)
