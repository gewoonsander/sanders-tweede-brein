---
key_element: financien
title: "Jortt API voor een geldstatus-overzicht in myPKA Cockpit — onderzoek"
date: 2026-08-09
author: Athena
type: research-brief
status: final
---

# Jortt API voor een geldstatus-overzicht in myPKA Cockpit

## Executive summary

De Jortt API heeft wél de endpoints voor een geldstatus-overzicht — méér dan alleen facturatie. Er is een `/v1/reports/summaries/cash_and_bank`-endpoint dat expliciet omschreven staat als "summaries of all organization bank accounts, liquid assets and cash balances intended for dashboard display" — precies wat de Cockpit nodig heeft. Deze endpoints (net als de bestaande facturen-connector) zitten achter de scope `financing:read` en zijn pas beschikbaar vanaf het **Jortt MKB-abonnement** (€24,95/mnd retail), niet op Starter of ZZP. Een boekhouder kan via het Jortt Boekhoudersportaal het abonnement van een klant zelf upgraden — tegen een gereduceerd kantoortarief in plaats van het klanttarief — wat Bart's rol praktisch en goedkoper kan maken dan Sander zelf laten upgraden.

## Key findings

1. **Jortt is geen kale facturatie-API — er zijn dedicated bank/cashflow-endpoints.** Naast `/v3/invoices` bestaan `/v3/bank-accounts`, `/v3/bank-accounts/{id}/bank-transactions`, en onder Reports: `/v1/reports/summaries/cash_and_bank`, `/v1/reports/summaries/balance` (balans) en `/v1/reports/summaries/profit_and_loss`. De `cash_and_bank`-summary is letterlijk bedoeld voor dashboard-weergave. **Confidence: Medium** — bevestigd uit de live Swagger/OpenAPI-spec op `api.jortt.nl/swagger_doc` (primaire bron, endpoint-paden en scope rechtstreeks uit de spec gehaald), maar de volledige veldenlijst (exacte JSON-schema per resource) kon ik niet volledig uitlezen — de tool die de spec ophaalde gaf getrunceerde content terug. Geen tweede, mechanisch onafhankelijk zoekpad kunnen inzetten (zie Beperkingen) voor dit specifieke punt, dus dit blijft technisch single-path ondanks dat het een primaire bron is.
2. **API-toegang vereist minimaal het MKB-plan; ZZP en Starter hebben geen API.** Dit is nu drievoudig bevestigd, onafhankelijk van elkaar: (a) Jortt's eigen FAQ-pagina over API-koppeling zegt letterlijk "de API-koppeling is beschikbaar vanaf jortt MKB"; (b) de officiële prijzenpagina (`jortt.nl/prijs`) vermeldt "API-toegang" expliciet bij MKB en Plus, niet bij Starter/ZZP; (c) de bestaande connector-code (`Expansions/mypka-cockpit/server/connectors/jorttTasks.js`, regel 68) vangt empirisch al een specifieke Jortt-foutcode af: `organization.requires_mkb_plan`. Dit is een runtime-observatie van Daedalus, niet giswerk. **Confidence: High.** Bevestigt het teamgeheugen van 4 dagen oud.
3. **De Boekhoudersportaal geeft een boekhouder de mogelijkheid om namens de klant het abonnement te upgraden, tegen kantoortarief.** Volgens Jortt's eigen stappeninstructie (URL: `jortt.nl/boekhouder/administratiekantoor/abonnement-upgraden-voor-je-klant/`) kan een boekhouder via "Gebruik als" inloggen in de administratie van de klant en daar zelf upgraden naar Plus/MKB; de boekhouder betaalt dan het boekhouderstarief (goedkoper dan het klanttarief) in plaats van dat de klant zelf de retailprijs betaalt. De klant hoeft dus niet per se zelf plan-eigenaar te blijven van het upgrade-moment — de boekhouder kan het uitvoeren zolang zijn kantoor is aangesloten bij het Jortt Boekhoudersportaal. **Confidence: Medium** — de kernbewering (boekhouder kan namens klant upgraden) komt uit een zoekresultaat dat de officiële Jortt-pagina samenvat; directe WebFetch op die pagina liep vast op een client-side redirect, dus ik heb de brontekst niet zelf woord-voor-woord kunnen inzien. Geen tweede onafhankelijk pad ingezet (zie Beperkingen).
4. **Onopgeloste discrepantie (gemarkeerd, niet opgelost):** `Team Knowledge/.env` bevat al een `JORTT_GEWOON_SANDER_CLIENT_ID`/`_SECRET`-paar, terwijl Sander zegt nu geen API-toegang te hebben. Eén plausibele verklaring die aansluit bij bevinding 2: Jortt laat je in Instellingen → Koppelingen mogelijk wél credentials aanmaken op elk plan, maar de daadwerkelijke API-calls falen dan met `organization.requires_mkb_plan` — dat zou verklaren waarom er credentials bestaan zonder werkende toegang. Dit is een **aanname**, niet geverifieerd; kan ook een oude/ongeldige sleutel van een eerdere poging zijn.

## Evidence

- Jortt FAQ "De jortt API en koppelingen bouwen" — `www.jortt.nl/uitleg/faq/api-koppeling/` (officieel, primair)
- Jortt prijzenpagina — `www.jortt.nl/prijs/` (officieel, primair)
- Jortt developer docs / OpenAPI-spec — `developer.jortt.nl` en `api.jortt.nl/swagger_doc` (officieel, primair)
- Jortt Boekhoudersportaal-instructiepagina — `www.jortt.nl/boekhouder/administratiekantoor/abonnement-upgraden-voor-je-klant/` (officieel, via zoekresultaat-samenvatting; directe fetch mislukte)
- `Expansions/mypka-cockpit/server/connectors/jorttTasks.js` (interne code, empirische runtime-observatie van Daedalus)
- `Team Knowledge/.env` (interne, voor de discrepantie-check)

## Methodology

WebSearch (meerdere queries) + WebFetch op de officiële Jortt-domeinen (`jortt.nl`, `developer.jortt.nl`, `api.jortt.nl`) als primair pad. De geplande tweede, mechanisch onafhankelijke zoekweg (`perplexity_search.py`, conform de dual-path-escalatie in mijn protocol — dit is een high-stakes financiële/beslissings-vraag) kon ik dit keer niet uitvoeren: deze sessie had geen Bash-toegang. Ik heb dat deels gecompenseerd met meerdere losse WebSearch-queries en directe fetches van drie verschillende officiële Jortt-pagina's die elkaar bevestigen, maar dat zijn geen twee mechanisch onafhankelijke engines. Zie Beperkingen.

## Limitations

- **Geen tweede zoekmachine ingezet** (Perplexity-script niet beschikbaar zonder Bash-tool deze sessie) ondanks dat dit een high-stakes financiële vraag is die volgens mijn eigen protocol dual-path verdient. De MKB-plan-vereiste (bevinding 2) is desondanks High confidence dankzij drie inhoudelijk onafhankelijke bronnen (FAQ, prijspagina, empirische code). Bevindingen 1 en 3 blijven Medium — vraag hierover gerust een her-check met Perplexity in een volgende sessie met shell-toegang.
- Het exacte JSON-schema van `/v3/bank-accounts` en `/v1/reports/summaries/cash_and_bank` (welke velden precies — saldo, valuta, per-rekening of geaggregeerd) kon ik niet volledig uitlezen; de spec-pagina gaf getrunceerde content terug bij herhaalde pogingen.
- Niet geverifieerd: of Bart's kantoor daadwerkelijk is aangesloten bij het Jortt Boekhoudersportaal — dat zit achter een login en is puur een vraag voor Bart zelf.
- Niet geverifieerd: of AKP Gezinshuis een aparte Jortt-administratie is of meeloopt onder dezelfde. Er staan in `.env` alleen Gewoon Sander-sleutels, geen AKP-sleutels — dat is een indirecte aanwijzing dat AKP nog niet is aangesloten, geen bevestiging.
- Prijsgetallen voor het boekhouderstarief (bijv. €14,50 MKB-tarief voor kantoren) komen uit een geaggregeerd zoekresultaat, niet rechtstreeks van Jortt zelf ingezien — behandel als indicatief, niet als citeerbaar feit richting Bart.

## Recommendations — wat aan Bart vragen

Concrete vraag aan Bart, in twee delen:

1. **"Is jouw kantoor aangesloten bij Jortt's Boekhoudersportaal, en zo ja: kun je de Gewoon Sander-administratie (en eventueel AKP Gezinshuis, als die ook op Jortt zit) upgraden naar het MKB-plan via jullie kantoortarief?"** Dat is vermoedelijk goedkoper dan dat Sander zelf naar MKB upgrade tegen het reguliere tarief.
2. **"Kun je daarna in Instellingen → Koppelingen een nieuwe API-koppeling (client credentials) aanmaken met scope `financing:read` (naast het al gebruikte `invoices:read`), en de client ID + secret aan mij doorgeven?"** — die twee waardes vervangen dan de huidige (mogelijk verouderde/ongeldige) sleutels in `Team Knowledge/.env`.

Als Bart niet bij het Boekhoudersportaal is aangesloten, is de alternatieve route dat Sander zelf via Instellingen → Mijn abonnement upgrade naar MKB (€24,95/mnd retail, eerste 3 maanden mogelijk €9,95 per de huidige actie op de prijspagina).

Vervolgvraag voor Sander zelf (geen onderzoeksvraag, een keuze): wil je dit oppakken als Bart bevestigt dat hij kan upgraden, of wacht je tot je zelf naar MKB wilt?
