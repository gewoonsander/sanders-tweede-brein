---
id: 2026-07-05-bunq-saldo-cockpit-design
title: Design — bunq-saldo op de myPKA Cockpit Hub
owner: daedalus
status: draft — wacht op goedkeuring
applies_to: Expansions/mypka-cockpit
---

# Design: bunq-saldo('s) op de Cockpit Hub

**Fase:** SOP-development-workflow Fase 1 (Brainstorm/design-first). Geen implementatie tot Sander akkoord geeft.

## Context (kort, geen dubbel onderzoek)

- Bron: [[2026-07-05-bonnetjesproces-gezinshuis-onderzoek]] (Athena/Pax) — dat is een apart, nog niet gebouwd onderzoek naar bonnetjes ↔ transactie-koppeling. Dit document hergebruikt alleen de bunq-feiten daaruit; het bouwt niets van de bonnetjes-flow.
- bunq-auth is geen simpele Bearer-token: zelf-gegenereerde **API key** + verplichte **request-signing met een RSA keypair**, via device-registratie (`POST /installation` → `POST /device-server` → `POST /session-server`, sessie-token loopt af en moet vernieuwd worden). Rate limits 3 GET/3s per IP/endpoint. Sandbox bestaat (`public-api.sandbox.bunq.com`). bunq Pro bevestigd aanwezig op de gedeelde Gezinshuis-rekening.
- Relevant endpoint voor dit doel: `GET /user/{userID}/monetary-account` — geeft per rekening (incl. eventuele "potjes"/sub-rekeningen onder dezelfde API-key) de actuele balans terug. Puur read-only.
- Cockpit-architectuur (gelezen: `HOW-IT-WORKS.md`, `server/connectors/README.md`, `SECURITY.md`): `mypka.db` is strikt read-only; cockpit-eigen state hoort in `mypka-cockpit.db`; secrets altijd via `Team Knowledge/.env` (0600, gitignored), nooit gelogd/hardcoded; CSP is strict self-origin, dus elke externe call gebeurt server-side; write-oppervlaktes zijn expres smal (Fleeting Notes is de enige markdown-write-uitzondering).
- Belangrijk gevonden feit tijdens dit ontwerp: de bestaande task/calendar-connector-registry (`server/connectors/registry.js` + `catalog.json`) is **hard getypeerd op `kind: 'task' | 'calendar'`** — een saldo past daar semantisch niet in (geen due date, geen `assignedToMe`, geen event). De Hub kent echter al een ander, wél passend precedent: **Open Invoices** (`server/invoicesApi.js` + `web/src/views/hub/OpenInvoicesCard.tsx`) — een eigen module, eigen route, eigen Hub-kaart, buiten de connector-registry om, met een `available:false`-degradatie-contract. Dat is het patroon dat dit ontwerp volgt, niet de task-connector-registry.

---

## Architectuurvraag: één gedeelde bunq-connector, of apart van de bonnetjes-flow?

**Antwoord: gedeeld waar het moeilijk is (auth/signing), apart waar het risicovol is (lezen vs. schrijven).**

bunq's authenticatie (keypair, device-registratie, sessie-levenscyclus, request-signing) is het enige écht lastige stuk — en dat stuk is identiek voor zowel "saldo lezen" als "bonnetje aan transactie koppelen". Twee keer onafhankelijk bouwen betekent twee keer dezelfde bunq-crypto onderhouden en twee keer dezelfde kans op een subtiele signing-bug. Daarom:

- **Eén laag-niveau client** (`bunqClient.js`): keypair, installation/device/session, signed-request-wrapper, retry/backoff. Dit is de enige plek die bunq's authenticatie kent.
- **Twee gescheiden, smalle consumers**, elk met een eigen blast radius:
  1. **Nu bouwen:** `bunqBalance.js` — roept alleen `GET .../monetary-account` aan, puur lezen, voor de Hub-kaart.
  2. **Later, apart ontwerp + eigen Argus-review:** de bonnetjes/attachment-flow uit Athena's onderzoek — schrijft (`attachment`, `note-attachment`), en verdient z'n eigen design-first traject omdat het een schrijf-pad naar een bankrekening is.

Reden om ze niet te fuseren tot één "bunq-connector-module met alles erin": een bug of scope-verandering in de (nog te bouwen, complexere) bonnetjes-schrijf-flow mag nooit de simpele, al-in-productie saldo-kaart kunnen breken of per ongeluk meeschrijven. Read en write zijn in dit ontwerp bewust twee verschillende modules die dezelfde onderliggende auth-client importeren — nooit één module die alles doet. Als de bonnetjes-flow uiteindelijk in n8n draait in plaats van in de Cockpit-server, dan is de "gedeelde client" vooral gedeelde *kennis* (dezelfde signing-aanpak, opnieuw geïmplementeerd of hergebruikt als lokale HTTP-call naar de Cockpit) — die beslissing hoort bij het eigen ontwerp van die flow, niet bij dit document.

---

## Aanpak A — Directe Node-connector in de Cockpit (aanbevolen)

Zelfde vorm als Open Invoices: een eigen server-module + eigen route + eigen Hub-kaart, volledig read-only, server-side (voldoet aan de strict-self-origin CSP — de browser praat nooit rechtstreeks met bunq).

**Nieuwe bestanden:**
- `server/connectors/bunq/bunqClient.js` — RSA-keypair laden (nooit genereren tijdens een normale requestcyclus), `POST /installation`, `POST /device-server`, `POST /session-server` (+ automatische refresh bij verlopen sessie), canonical request-signing (`X-Bunq-Client-Signature` e.d.), sandbox/productie base-URL-switch via `BUNQ_ENV`.
- `server/connectors/bunq/bunqBalance.js` — roept `bunqClient` aan, doet `GET /user/{userID}/monetary-account`, normaliseert naar `[{ accountId, description, iban, balance, currency }]`, korte in-memory cache (~60s) tegen dubbele Hub-reloads, calm-degradatie (`{ available: false, items: [] }` als keys ontbreken — zelfde contract als `invoicesApi.js`), exporteert `registerBunqBalanceRoutes(app, { safe })`.
- `scripts/setup-bunq.mjs` — eenmalig, interactief setup-script (mirrort `npm run set-pin`): genereert de RSA-keypair, doorloopt installation/device-registratie met de door Sander geplakte API-key, schrijft de resulterende secrets naar `Team Knowledge/.env`. Draait één keer, niet bij elke boot.
- `web/src/views/hub/BunqBalanceCard.tsx` — Hub-kaart, mirrort `OpenInvoicesCard.tsx` 1-op-1 qua structuur (loading → `available:false` → lege staat → lijst).

**Wijzigingen:**
- `server/server.js` — `registerBunqBalanceRoutes(app, { safe })` toevoegen, zelfde plek als `registerInvoicesRoutes`.
- `server/cockpitSettingsDb.js` — nieuwe entry in `KNOWN_MODULES`: `{ key: 'bunq_balance', label: 'Bunq balance', hint: '...' }`.
- `web/src/views/HubView.tsx` — `BunqBalanceCard` importeren, toevoegen aan de `renderers`-map en `DEFAULT_MODULE_ORDER`.
- `.env.example` — nieuwe keys documenteren: `BUNQ_API_KEY`, `BUNQ_PRIVATE_KEY_B64`, `BUNQ_INSTALLATION_TOKEN`, `BUNQ_DEVICE_SERVER_ID`, `BUNQ_USER_ID`, `BUNQ_ENV` (`sandbox`/`production`).
- Activatie volgt het bestaande patroon exact: **geen nieuwe globale feature-vlag** — de kaart is actief zodra de vereiste keys resolven, zoals elke andere connector. Geen `BUNQ_BALANCE_ENABLED`-boolean nodig.

**Voordelen:** past exact in het bestaande, al-geverifieerde Open-Invoices-precedent; near-realtime (geen polling-vertraging); geen nieuwe write-oppervlakte; sessie-token hoeft nergens op schijf — leeft alleen in het proces-geheugen van de draaiende Node-server en wordt na een herstart opnieuw opgehaald met de bewaarde installation-token + API-key (één sensitive artefact minder om te bewaren).
**Nadelen:** de eenmalige bouw van bunq's signing-logica is niet triviaal (RSA-signing, canonical request-vorm) — maar dit werk moet sowieso een keer gebeuren, ook voor de latere bonnetjes-flow, dus het is geen extra kosten, alleen naar voren gehaald.

## Aanpak B — n8n-workflow pollt bunq, Cockpit leest een snapshot

Een n8n-workflow (schedule-trigger, bv. elke 15 min — ruim binnen 3 GET/3s) doet zelf de volledige bunq auth+signing-dans en schrijft het resultaat weg naar iets wat de Cockpit leest: óf een JSON-bestand op een vaste lokale pad, óf een nieuwe tabel in `mypka-cockpit.db` (via een nieuw write-endpoint dat n8n aanroept, of via directe SQLite-toegang tot hetzelfde bestand).

**Nadelen die dit voor déze kaart minder geschikt maken dan Aanpak A:**
1. De signing-complexiteit verdwijnt niet — hij verhuist. n8n's Code-node zou exact dezelfde RSA-signing-logica moeten implementeren die Aanpak A ook nodig heeft. Geen tijdswinst, wél een tweede plek waar bunq-crypto onderhouden moet worden.
2. Staleness: het saldo is tot de poll-interval oud. Sander wil het juist "altijd kunnen opvragen" — near-realtime past beter bij die wens dan een 15-minuten-oud snapshot.
3. n8n's eigen uptime wordt een afhankelijkheid van een Hub-kaart die verder niets met taken/agenda te maken heeft.
4. Optie (b2, schrijven naar `mypka-cockpit.db`) introduceert een **nieuwe schrijf-oppervlakte** vanuit een extern proces — een groter aanvalsoppervlak dan nodig voor iets dat in essentie een enkele GET-call is.

Niet aanbevolen voor de saldo-kaart. Wél de juiste vorm voor de latere, aparte bonnetjes-flow (event-driven, schrijft naar twee systemen, hoort qua aard bij een achtergrond-workflow — zie Athena's onderzoek).

## Aanpak C — Balans in de bestaande task-connector-registry proppen

Verworpen. `registry.js`/`catalog.json` is hard getypeerd op `kind: 'task' | 'calendar'` met semantiek (due date, `assignedToMe`, `editableFields`) die niet op een saldo-cijfer past. Een saldo als nep-"taak" voorstellen zou de Agenda/Today-secties (`/api/cockpit/agenda`, die `taskConnectors()` leest) vervuilen met een item dat geen taak is. Het Open-Invoices-precedent bestaat precies voor dit soort "los, read-only, geen taak/event"-data — dat volgen we, niet de connector-registry forceren.

---

## Aanbeveling

**Aanpak A**, met de auth/signing-laag apart in `bunqClient.js` gezet zodat de latere, apart-goedgekeurde bonnetjes-flow er zonder herbouw op kan aansluiten.

---

## Beveiligingsoverwegingen (bankdata weegt zwaarder dan een takenlijst)

- **Puur GET, altijd.** Deze connector implementeert nooit `attachment`, `note-attachment`, `payment`, of enige andere schrijf-operatie. Eén endpoint: `monetary-account`.
- **API-key-scope verifiëren vóór bouw:** nagaan of bunq een read-only-scoped API-key-optie aanbiedt (permissies bij aanmaak in de app) en die gebruiken als het kan — dit staat nog niet vast en is een verificatiepunt tijdens de bouw, geen aanname.
- **Secrets:** API-key, private key (base64) en installation-token volgens het bestaande patroon in `Team Knowledge/.env` (0600, gitignored), alleen via `readEnvKey(...)` bij naam opgehaald, nooit gelogd/geëchood — zelfde `maskToken`/`maskSecret`-discipline als `todoist.js`.
- **Sessie-token nooit naar schijf** — alleen in het geheugen van het lopende Node-proces; vermindert het aantal persistente gevoelige artefacten met één.
- **Sandbox eerst.** Bouwen en testen tegen `public-api.sandbox.bunq.com` vóór ooit een echte productie-key te gebruiken — conform Athena's aanbeveling.
- **Rate limits:** 3 GET/3s per IP/endpoint. Eén Hub-load = één GET; de 60s in-memory cache in `bunqBalance.js` beschermt tegen snelle herhaalde reloads/meerdere tabbladen. Retry+backoff volgens hetzelfde patroon als `todoist.js` (429-afhandeling, max attempts).
- **Calm degradation:** ontbrekende keys → `{ available: false, items: [] }`, Hub toont een `ModuleEmptyState` die naar de setup wijst — nooit een crash of 500, exact het `invoicesApi.js`-contract.
- **LAN-mode-kanttekening:** geen nieuwe technische maatregel nodig (dezelfde loopback-default + PIN-gated LAN-mode als de rest van de Cockpit), maar het is het waard om expliciet te benoemen: zet Sander ooit LAN-mode aan, dan wordt zijn banksaldo zichtbaar voor elk apparaat op zijn netwerk met de PIN — een andere impact dan een open takenlijst.
- **Aanbevolen extra gate:** omdat dit levende bankdata raakt, adviseer ik dat Argus (SOP-004) een gerichte security-audit doet op de bunq-module vóórdat Sander 'm met echte productie-credentials aanzet — een uitzondering op de normale connector-flow, gerechtvaardigd door wat hier op het spel staat. Beslissing hierover ligt bij Sander/Hermes.

---

## Eén verduidelijkende vraag

Bunq-rekeningen kunnen meerdere "potjes"/sub-rekeningen hebben onder dezelfde API-key. Hoe wil je dat de kaart dat toont?

**A** — Elke rekening als eigen regel (naam + saldo) — volledige uitsplitsing, handig als er potjes zijn.
**B** — Eén gecombineerd totaalsaldo over alle rekeningen onder die key — simpeler, één getal.

---

## Openstaand voor de plan-fase (na goedkeuring van dit ontwerp)

- Exacte bestandsformaat-/detail-vragen zijn hier niet relevant (geen attachments in dit ontwerp).
- Read-only-scope van de API-key: te verifiëren tijdens implementatie.
- Sandbox-test vóór productie: expliciete stap in het uitvoeringsplan (Fase 2).
- Of Argus een formele audit doet vóór productie-activatie: te bevestigen met Sander/Hermes.
