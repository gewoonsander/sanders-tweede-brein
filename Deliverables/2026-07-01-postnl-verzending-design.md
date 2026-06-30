# Design: PostNL Verzending Automatisering

**Datum:** 2026-07-01
**Status:** Wacht op goedkeuring Sander
**Auteur:** Mack (Automation Specialist)
**Open variabele:** Bron van bestelmails — zie §1

---

## Context

Sander verkoopt het boek "Darttactiek – van beginner tot professional" via Plug&Pay (`gewoonsander.plugandpay.com`). Bij een bestelling moet hij een verzendlabel genereren bij PostNL. Het doel is dit proces te automatiseren.

**Bestaande infrastructuur die we kunnen hergebruiken:**
- n8n.cloud actief op `gewoonsander.app.n8n.cloud`
- Gmail credential (Google Workspace, `sander@gewoonsander.nl`) al gekoppeld in n8n
- Google Cloud project `tweede-brein-integraties` bestaat
- Webhook endpoint patroon al bewezen (Contacten Beheer workflow)

**PostNL-wegen:**
1. CSV-import in Mijn PostNL Business (handmatige upload, maar geen API-account nodig)
2. PostNL Shipping REST API v2 (programmatisch, vereist API-key via PostNL Business Portal)

---

## §1 — Open variabele: Email bron

De architecturale keuze hangt af van de bron van de bestelmails:

| Scenario | Impact |
|---|---|
| **(A)** Plug&Pay automated emails | Consistent formaat → eenvoudige regex/field extract. Plug&Pay kan ook webhooks sturen (betere trigger). |
| **(B)** Directe klantmails | Wisselend formaat → AI-node nodig voor address-extractie. Hogere kans op parseerfout. |
| **(C)** Beide | Twee aparte trigger-branches in dezelfde workflow. |

De aanpakken hieronder werken voor alle drie scenario's, maar de parsing-stap verschilt. Bij scenario A is Aanpak C (Plug&Pay webhook) beschikbaar als verbetering.

---

## §2 — Drie aanpakken

### Aanpak A — n8n Gmail Trigger + CSV generatie

**Samenvatting:** n8n bewaakt Gmail, parseert de bestelmail, genereert een PostNL-conform CSV-bestand, en stuurt dat als bijlage naar Sander. Sander uploadt het CSV handmatig in Mijn PostNL Business en print het label daar.

**Flow:**
```
Gmail (IMAP trigger, filter op onderwerp/afzender)
  → n8n Code/AI-node (extract naam, adres, postcode, woonplaats, land)
  → n8n Code-node (genereer CSV-rij conform PostNL-formaat)
  → Gmail Send (stuur CSV als bijlage naar sander@gewoonsander.nl)
```

**PostNL CSV-formaat (minimale kolommen):**
```
Naam, Bedrijfsnaam, Adres, Huisnummer, Postcode, Woonplaats, Landcode, Productcode
```
Productcode voor standaard brievenbuspakje: `2928` (Brievenbuspakket), of `3085` (Pakket Nederland). Te vinden in Mijn PostNL Business onder Producten.

**Voordelen:**
- Geen PostNL API-account of contract nodig
- Direct inzetbaar met bestaande credentials
- Sander beheert de upload zelf → controle behouden
- Bouwt op bewezen n8n Gmail credential

**Nadelen:**
- Handmatige stap blijft: inloggen in Mijn PostNL Business, CSV uploaden, labels printen
- Geschat 2–3 minuten handmatig werk per bestelling (i.p.v. ~5–10 min nu)
- Parseerfout in de mail → verkeerd CSV → foute zending

**Complexiteit:** Laag
**Automatiseringsgraad:** ~70% (manuele upload blijft)
**Benodigde credentials:** Gmail (aanwezig)
**Implementatietijd:** 1–2 uur

---

### Aanpak B — n8n Gmail Trigger + PostNL Shipping API

**Samenvatting:** Zelfde Gmail trigger als A, maar n8n roept de PostNL REST Shipping API aan om de zending direct aan te maken en het label als PDF op te halen. Label wordt als bijlage per mail naar Sander gestuurd of gedownload via link — directe print.

**Flow:**
```
Gmail (IMAP trigger, filter op onderwerp/afzender)
  → n8n Code/AI-node (extract adresdata)
  → n8n HTTP Request node (POST /shipment naar PostNL Shipping API v2)
  → n8n HTTP Request node (GET label PDF via barcode uit response)
  → Gmail Send (stuur label PDF als bijlage naar sander@gewoonsander.nl)
```

**PostNL Shipping API-details (bron: developer.postnl.nl):**
- Sandbox endpoint: `https://api-sandbox.postnl.nl/v1/shipment`
- Productie endpoint: `https://api.postnl.nl/v1/shipment` (zelfde pad, andere host)
- Auth: HTTP header `apikey: <jouw-key>` — API key aanvragen via [developer.postnl.nl](https://developer.postnl.nl)
- De Shipping API combineert Labelling + Confirming + Barcode in één call
- **Verplichte request-velden:** `Shipments` (array, max 4), `PrinterType`, `Addresses` (type `01` = ontvanger, type `02` = afzender)
- **Optioneel:** `Barcode` (PostNL genereert automatisch als je het weglaat), `Confirm` (boolean — true = aanmaken + bevestigen in één call)
- **Label-formaten:** `GraphicFile|PDF` (A4/A6, meest bruikbaar voor thuisprinter), `Zebra|Generic ZPL II` (voor labelprinter), ook GIF/JPG beschikbaar
- **Max request size:** 200KB — bij overschrijding retourneert de API HTTP 404
- **Max per request:** 4 zendingen tegelijk
- **Response:** `GenerateLabelResponse` → `ResponseShipments` array → label als base64-encoded string in het gekozen formaat

**Voordelen:**
- Volledig geautomatiseerd — mail binnenkomt, label in inbox
- Geen handmatige stap in PostNL portal
- Schaalbaar bij meer bestellingen

**Nadelen:**
- PostNL API-account aanvragen is een drempel (formulier + goedkeuring, PostNL hanteert soms 1–3 werkdagen doorlooptijd)
- API-key beheer (secret in n8n credential store)
- Complexere n8n workflow — request body bouwen, barcode ophalen
- PostNL Shipping API v2 heeft eigen specificaties voor CustomerCode en CustomerNumber (staan in Mijn PostNL Business onder Mijn account)

**Complexiteit:** Hoog
**Automatiseringsgraad:** ~95% (alleen label printen rest)
**Benodigde credentials:** Gmail (aanwezig) + PostNL API key (nieuw aan te vragen)
**Implementatietijd:** 3–5 uur (na API-key ontvangst)

---

### Aanpak C — Plug&Pay Webhook + PostNL CSV of API

**Samenvatting:** In plaats van Gmail als trigger gebruikt n8n een Plug&Pay webhook. Plug&Pay stuurt bij elke nieuwe bestelling gestructureerde JSON met alle besteldata naar een n8n webhook URL. Dit elimineert email-parsing volledig. Vervolgens genereer je CSV (zoals A) of roep je de PostNL API aan (zoals B).

**Flow:**
```
Plug&Pay (order.paid of order.created event → webhook)
  → n8n Webhook node (ontvangt JSON met naam, adres, postcode, woonplaats, etc.)
  → n8n Set-node (mappen van Plug&Pay velden naar PostNL velden)
  → CSV generatie (Aanpak A) OF PostNL API (Aanpak B)
```

**Plug&Pay webhook:**
- Plug&Pay ondersteunt webhooks (te configureren onder Instellingen → Webhooks in het Plug&Pay dashboard)
- Events: `order.paid`, `order.cancelled`, etc.
- Payload bevat: klantgegevens (naam, adres, email), producten, bestelreferentie

**Voordelen:**
- Gestructureerde data — geen parsing, geen AI-node, geen parseerfout
- Trigger op betaling (niet op email) — betrouwbaarder dan mailfilter
- Alle besteldata aanwezig als JSON-velden
- Gemakkelijk uitbreidbaar (bijv. ook factuur aanmaken via e-Boekhouden)

**Nadelen:**
- Vereist verificatie of Plug&Pay webhooks ondersteunt en welk formaat ze sturen (nog niet onderzocht)
- Webhook endpoint in n8n moet publiek bereikbaar zijn (dit is al zo op n8n.cloud)
- Als Sander ook directe bestellingen krijgt (niet via Plug&Pay), dekt dit die niet

**Complexiteit:** Middel
**Automatiseringsgraad:** 95%+ (met PostNL API) of 70% (met CSV)
**Benodigde credentials:** Plug&Pay webhook secret (HMAC verificatie) + evt. PostNL API key
**Implementatietijd:** 2–3 uur (na bevestiging Plug&Pay webhook support)

---

## §3 — Vergelijkingstabel

| Criterium | A: Gmail + CSV | B: Gmail + PostNL API | C: Plug&Pay webhook |
|---|---|---|---|
| Handmatige stap | Upload CSV in portal | Alleen printen | Alleen printen |
| Externe API nodig | Nee | PostNL API key | Plug&Pay webhook (free) |
| Parseergevoeligheid | Middel | Middel | Geen (JSON) |
| Implementatietijd | 1–2 uur | 3–5 uur + wachttijd API | 2–3 uur |
| Uitbreidbaarheid | Laag | Middel | Hoog |
| Complexiteit n8n workflow | Laag | Hoog | Middel |

---

## §4 — Aanbeveling

**Geadviseerde aanpak: C (Plug&Pay webhook) + A (CSV), met B als fase 2.**

Redenering:
1. Plug&Pay is de primaire verkoopkanaal. Een webhook geeft gestructureerde data zonder parsing-risico. Dit is de juiste trigger ongeacht welke PostNL-stap je kiest.
2. Start met CSV-output (fase 1) — direct inzetbaar, geen PostNL API-account drempel, en al 70% van het handmatige werk weg.
3. Vraag ondertussen de PostNL API-key aan (developer.postnl.nl) en voeg fase 2 toe: vervang de CSV-stap door een directe API-aanroep. Dan is het proces end-to-end geautomatiseerd.

**Als Plug&Pay geen webhooks ondersteunt:** val terug op Aanpak A (Gmail trigger + CSV) als direct bruikbare oplossing.

---

## §5 — Technische randvoorwaarden

- **n8n webhook URL format:** `https://gewoonsander.app.n8n.cloud/webhook/<slug>` (zoals de bestaande contacten-beheer webhook)
- **PostNL CSV kolommen** (conform Mijn PostNL Business import): Naam, Bedrijf, Straat, Huisnummer, Postcode, Stad, Land (ISO 2-letter), Email, Telefoon, Referentie, Productcode
- **PostNL Shipping API auth:** header `apikey: <jouw-key>` — nooit in de workflow-code, altijd als n8n Credential (Header Auth type)
- **Plug&Pay webhook verificatie:** webhook stuurt een HMAC-SHA256 signature in de header — n8n moet dit verifiëren voor productie. n8n heeft hier geen native node voor; een Code-node met `crypto` doet het.
- **Idempotency:** sla de Plug&Pay `order_id` op (bijv. in n8n Static Data of een Google Sheet) om dubbele verzendingen bij webhook-retries te voorkomen.

---

## §6 — Openstaande vragen

1. Ondersteunt Plug&Pay webhooks, en wat is het event-payload formaat? (Te controleren via Plug&Pay dashboard → Instellingen → Webhooks of via support)
2. Wil Sander de PostNL Shipping API aanvragen (developer.postnl.nl), of wil hij de CSV-route houden?
3. Welke PostNL productcode gebruikt Sander? Brievenbuspakket (2928) of regulier pakket (3085)?

---

## §7 — Uit scope (YAGNI)

- Automatisch printen van het label (printserver/Cloud Print) — aparte complexiteit, bewust buiten scope
- Write-operaties naar e-Boekhouden (facturatie koppeling) — volgende fase
- Multi-product bestellingen met variabele gewichten — fase 2
- Retourservice — buiten scope voor nu
