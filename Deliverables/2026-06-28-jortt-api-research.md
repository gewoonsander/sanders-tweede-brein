# Jortt API — Research Brief

**Date:** 2026-06-28
**Prepared by:** Pax (Senior Researcher)
**Decision:** Haalbaarheid van een Jortt-connector in de PKM Cockpit (twee accounts)

---

## Executive Summary

Jortt heeft een publieke, gedocumenteerde REST API (v3 actueel). Authenticatie verloopt via OAuth 2.0. De API dekt facturen, klanten, transacties, grootboekrekeningen en meer. Twee afzonderlijke accounts koppelen is technisch mogelijk maar vereist twee aparte OAuth-registraties. Een read-only connector is haalbaar en relatief laagdrempelig. Er is geen sandbox.

---

## Key Findings

**1. Publieke REST API: ja — Confidence: High**
Jortt biedt een gedocumenteerde publieke REST API aan via `https://api.jortt.nl`. De spec is beschikbaar als OpenAPI 2.0 (Swagger) en er is een Postman-collectie beschikbaar. Primaire bron: `developer.jortt.nl`.

**2. Authenticatie: OAuth 2.0, twee grant types — Confidence: High**
- **Client Credentials** — voor eigen applicaties, zonder user-redirect. Dit is de juiste flow voor een privé PKM-connector.
- **Authorization Code** — voor third-party apps die meerdere Jortt-administraties bedienen.
- Token-endpoint: `https://app.jortt.nl/oauth-provider/oauth/token`
- Credentials worden via Basic Auth meegegeven als HTTP header bij token-aanvraag.

Omdat beide accounts privé-gebruik zijn, volstaat Client Credentials per account. Geen PKCE of browser-redirect nodig.

**3. Beschikbare endpoints (v3) — Confidence: High**
| Categorie | Beschikbaar |
|---|---|
| Klanten (Customers) | Ja |
| Facturen (Invoices) | Ja — incl. status (draft/sent), samenvatting, detail |
| Offertes (Estimates) | Ja |
| Uitgaven (Expenses) | Ja |
| Projecten | Ja |
| Grootboekrekeningen (Ledger Accounts) | Ja |
| Bankkoppelingen (Bank Accounts) | Ja |
| Rapporten / Overzichten | Ja — incl. `GET /v3/reports/summaries/invoices` |
| Inbox | Ja |
| Organisaties / Handelsnamen | Ja |

Voor de Cockpit zijn Invoices, Expenses, en Reports/summaries de meest relevante endpoints voor een read-only dashboard.

**4. Meerdere accounts koppelen — Confidence: High (met kanttekening)**
Elk access_token is gebonden aan één organisatie/administratie. Voor twee aparte Jortt-accounts (Gewoon Sander + AKP Gezinshuis) zijn twee aparte OAuth-client-registraties en twee tokencycli nodig. De API zelf maakt dit technisch mogelijk — de Cockpit moet tokens per account opslaan en beheren.

Kanttekening (single-source, niet door tweede bron bevestigd): het is onduidelijk of één persoon meerdere OAuth-clients op verschillende accounts kan registreren. Dit vereist verificatie via het Jortt-portaal of support.

**5. Rate limits — Confidence: High**
10 requests per seconde. Maximaal 100 objecten per pagina (paginering via `_links`). Voor een PKM-connector die periodiek (bijv. elke uur) facturen of transacties ophaalt, is dit ruim voldoende.

**6. Sandbox/testomgeving — Confidence: High**
Geen sandbox beschikbaar. Alle testen lopen tegen productie. Dit betekent dat integratie-tests met echte data werken — acceptabel voor privé-gebruik, maar vergt voorzichtigheid bij write-operaties (die bij read-only niet aan de orde zijn).

**7. Subscription-vereiste — Confidence: Medium**
API-toegang vereist een Jortt MKB of Jortt Plus abonnement. Of het Gezinshuis-account dit plan heeft, is onbekend. Verificeer dit per account voordat je begint.

---

## Haalbaarheid read-only connector

**Conclusie: haalbaar, lage technische drempel.**

Aanbevolen aanpak voor de Cockpit:

1. Registreer twee OAuth-clients (één per account) via het Jortt-portaal.
2. Sla beide access tokens op in de Node.js server (omgevingsvariabelen of de bestaande SQLite-database, nooit hardcoded).
3. Gebruik Client Credentials flow — tokens verlopen na een vaste TTL en worden automatisch vernieuwd.
4. Poll periodiek (bijv. elke 60 minuten) de endpoints `GET /v3/invoices`, `GET /v3/expenses`, en `GET /v3/reports/summaries/invoices`.
5. Sla de resultaten op in de Cockpit SQLite als lokale cache. Toon beide accounts als aparte secties in de React frontend.

De Ruby SDK (`jorttbv/jortt-ruby`) en een bestaande connector (`te-con/jorttconnector`) op GitHub tonen dat de API in de praktijk goed werkbaar is.

---

## Anti-patterns om te vermijden

- **Tokens hardcoden in code of .env in de repo.** Jortt-tokens geven volledige toegang tot een boekhouding. Gebruik `.gitignore` op het .env-bestand (dit is al ingericht voor Team Knowledge/.env, maar controleer ook de Cockpit server).
- **Write-operaties inbouwen in een eerste versie.** Begin read-only. De API ondersteunt ook POST/PATCH (facturen aanmaken, etc.) — dat is een latere stap na de connector stabiel staat.
- **Één gedeelde OAuth-client voor beide accounts.** Dat werkt niet; tokens zijn per administratie.
- **Geen paginering implementeren.** Bij meer dan 100 facturen retourneert de API een `_links.next` cursor. Zonder paginering mis je historische data.

---

## Methodology

- Primaire bron geraadpleegd: `developer.jortt.nl` (officiële developer portal, OpenAPI-spec beschikbaar).
- Secundaire bronnen: `apitracker.io/a/jortt`, `brixxs.com` (integratiepartner), GitHub repositories `jorttbv/jortt-ruby` en `te-con/jorttconnector`.
- Zoekopdrachten: "Jortt API documentation REST developer", "Jortt API authentication endpoints invoices", "Jortt API rate limits sandbox multiple organizations".

---

## Limitations

- Geen tweede primaire bron bevestigt de multi-client-registratie voor twee accounts onder één gebruiker. Flag: verifieer bij Jortt support of portaal.
- Subscription-vereiste voor AKP Gezinshuis-account niet geverifieerd.
- Exacte token TTL (vervaltijd) niet gedocumenteerd in de publiek beschikbare bronnen.

---

## Aanbevolen volgende stappen

1. Log in op beide Jortt-accounts en controleer of beide een MKB of Plus plan hebben.
2. Registreer per account een OAuth-client (Client Credentials) in het Jortt-portaal.
3. Test de token-aanvraag met curl of Postman (de collectie staat klaar via developer.jortt.nl).
4. Geef Daedalus de opdracht de Node.js connector te bouwen op basis van bovenstaande aanpak.

---

## Bronnen

- [Jortt API — Developer Documentation](https://developer.jortt.nl/)
- [jortt-ruby GitHub (officieel)](https://github.com/jorttbv/jortt-ruby)
- [jorttconnector GitHub](https://github.com/te-con/jorttconnector)
- [jortt API — apitracker.io](https://apitracker.io/a/jortt)
- [Brixxs: Jortt API koppeling](https://brixxs.com/faq/hoe-kan-ik-een-api-koppeling-maken-met-jortt/)
