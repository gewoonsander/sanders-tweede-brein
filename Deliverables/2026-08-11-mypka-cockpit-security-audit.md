---
title: "Argus securityaudit — myPKA Cockpit lokale adaptatie"
date: 2026-08-11
status: yellow
scope: Expansions/mypka-cockpit
---

# Argus securityaudit — myPKA Cockpit lokale adaptatie

## Verdict

**YELLOW — alleen doorgaan na expliciete acceptatie door Sander en na herstel van de manifestclaims.**

Er zijn geen meegeleverde credentials of direct aangetoonde kritieke kwetsbaarheden gevonden. Installatie kan echter niet als ongewijzigde, vertrouwde myICOR-Expansion doorgaan: het manifest is ongeldig voor het huidige schema, de trustpin ontbreekt en de gedeclareerde permission surface is smaller dan de werkelijke runtime.

## Bewijs

- Pre-installatieherstelpunt: Git-commit `85a6db6`, gepusht naar `origin/main`.
- Secret-scan: geen tokenvormige literals in de Expansion gevonden.
- `.env.example`: bevat uitsluitend namen en uitleg; geen secretwaarden.
- Productiebouw: `npm run build` geslaagd op 2026-08-11.
- Workbench attachmenttests: 19/19 geslaagd.
- Workbench slugtests: 18/18 geslaagd.
- DartsAtlas-tests: 5 geslaagd, 7 overgeslagen omdat `jsdom` niet lokaal geïnstalleerd is.
- Food Python-tests: 8/8 geslaagd.
- Food API-test: gefaald doordat de test exact 3 records verwachtte terwijl de actuele dataset 5 records bevat. Dit is testisolatiedrift, geen aangetoonde securityfout.

## Bevindingen

### Y-01 — manifest ongeldig en niet compatibel verklaard

`expansion.yaml` mist het verplichte `requires_scaffold_version` en verwijst naar oude rollen `Larry`, `Mack` en `Silas`. Scaffoldversie is `2.1.2`.

**Vereiste maatregel:** pas het manifest pas na expliciete acceptatie aan als lokale SanderCo-adaptatie, met actuele rolvereisten en een aantoonbaar geteste scaffoldrange.

### Y-02 — ontbrekende trustpin

Voor `mypka-cockpit` versie `1.5.2` bestaat geen match in `Expansions/.trusted-sources`. De claim `author: myICOR` kan lokaal niet cryptografisch worden bevestigd.

**Vereiste maatregel:** bewaar herkomst en oorspronkelijke hash, maar presenteer de gewijzigde versie niet als ongewijzigd myICOR-artefact. Behandel hem als lokale fork/community-tier.

### Y-03 — manifest onderschat de permission surface

De runtime kan, achter afzonderlijke gates en gebruikersacties:

- Fleeting Notes, journaalitems, uploads en connectorsecrets lokaal schrijven;
- Terminal via `osascript` openen;
- Google/andere iCal, Todoist, ClickUp, Jortt, n8n en IMAP benaderen;
- Anthropic aanroepen voor optionele food-capture;
- een LaunchAgent voor food-capture installeren;
- DartsAtlas-data ophalen en lokale datafiles wijzigen.

Deze functies zijn grotendeels gedocumenteerd en gated, maar niet volledig zichtbaar in het manifest.

**Vereiste maatregel:** `LOCAL-ADAPTATION.md` moet de volledige permission surface beschrijven. Nieuwe integratieprobes blijven server-side allowlisted en read-only.

### Y-04 — bestaand food-API-test is data-afhankelijk

`server/tracking.food.test.mjs` gebruikt de actuele voedingsdataset en verwacht een vast aantal records. Daardoor faalt de suite zodra echte data groeit.

**Vereiste maatregel:** isoleer de test met een fixture of toets op stabiele eigenschappen in plaats van exact drie actuele records. Geen productiegegevens verwijderen om de test groen te maken.

### Y-05 — runtime-archivering in WS-003 zou installatie breken

De generieke workstream verplaatst de Expansionfolder na installatie, terwijl de Cockpit vanuit die folder draait.

**Vereiste maatregel:** wijzig WS-003 voor runtime-Expansions zodat de uitvoerbare folder blijft staan en alleen een manifestsnapshot naar `_installed/` gaat.

## Positieve controls

- Server bindt standaard aan loopback.
- LAN-modus vereist een PIN.
- API-routes hebben session/loopback-, CSRF- en write gates.
- `mypka.db` wordt read-only en met `query_only` geopend.
- Schrijfoppervlakken gebruiken padjails en bestandsvalidatie.
- De Stack-inventaris retourneert uitsluitend secretnamen en gesaniteerde targets.
- Connectoren degraderen rustig bij ontbrekende keys of netwerkfouten.
- De productiebuild slaagt zonder nieuwe dependency-installatie.

## Niet uitgevoerd

- Geen live dependency-vulnerabilityquery tegen een externe registry; daarvoor zou netwerktoegang en actuele advisories nodig zijn.
- Geen live externe connectorcalls; credentials worden tijdens de audit niet gelezen of gebruikt.
- Geen runtime gestart, conform het installatiecontract.

## Toegestane vervolgstap na acceptatie

1. Herstel testisolatie zonder echte voedingsdata te wijzigen.
2. Leg lokale herkomst en permission surface vast.
3. Maak het manifest geldig als lokale adaptatie.
4. Corrigeer runtime-archivering in WS-003.
5. Draai manifest-, secret-, test- en buildcontroles opnieuw.

Zonder expliciete acceptatie van dit YELLOW-verdict stopt de installatie hier.
