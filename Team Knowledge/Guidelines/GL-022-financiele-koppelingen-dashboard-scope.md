---
name: GL-022-financiele-koppelingen-dashboard-scope
title: Financiële koppelingen — wat wel en niet gebouwd mag worden
type: guideline
tags:
  - financien
  - integraties
  - security
  - mypka-cockpit
owner: Daedalus
created: 2026-08-17
---

# GL-022 — Financiële koppelingen: scope voor de myPKA Cockpit

Deze Guideline legt vast wat er rond financiële data (bank, boekhouding, betalingen) wél en niet gebouwd mag worden, zodat niemand dit onderzoek opnieuw hoeft te doen. Het patroon is niet theoretisch: het is exact de route die al is uitgezocht en geaudit voor de bunq-saldo-kaart. Bronnen: [[2026-07-05-bunq-saldo-cockpit-design]] (architectuurontwerp, Aanpak A), [[2026-08-17-bunq-mcp-koppeling-onderzoek]] (waarom geen MCP) en [[2026-08-17-argus-bunq-connector-audit]] (security-verdict YELLOW met voorwaarden).

## Wat wel

**Directe, server-side, read-only Cockpit-connector.** Eigen servermodule + eigen route + eigen Hub-kaart, buiten de task/calendar-connector-registry om — het bestaande **Open Invoices**-precedent (`server/invoicesApi.js` + `web/src/views/hub/OpenInvoicesCard.tsx`), niet `catalog.json`. De browser praat nooit met de externe partij; de Node-server haalt op en levert een genormaliseerde samenvatting.

Kenmerken van zo'n connector:

- **GET-only, hardcoded.** Het HTTP-werkwoord staat vast in de fetch-aanroep. Geen `method`-parameter die een aanroeper kan overschrijven.
- **Hardcoded endpoint-allowlist**, gecontroleerd vóór de HTTP-call, niet erna. Exacte string of strak regex — geen substring-match, geen wildcard.
- **Geen generieke request-methode** geëxporteerd naar consumers. Auth-levenscyclus-calls blijven intern en niet-geëxporteerd.
- **Calme degradatie:** ontbrekende keys → `{ available: false, items: [] }`, nooit een crash of 500 (het `invoicesApi.js`-contract).
- **Read en write zijn aparte modules** die hoogstens dezelfde auth-client delen — nooit één module die beide doet.

## Wat niet

| Niet doen | Reden |
|---|---|
| **MCP-server voor een bankkoppeling** | bunq kent geen read-only scope (API-key = volledige rekeningtoegang; OAuth kan nog steeds betalen tussen eigen rekeningen, draft-payments, kaartbeheer). Een MCP-server geeft het model rechtstreeks tooltoegang, terwijl bankdata door derden bestuurbare tekst bevat (transactieomschrijvingen) — een reëel prompt-injectie-pad zodra er één schrijf-tool geregistreerd staat. Bestaande third-party bunq-MCP's hebben allemaal betaal-tools aan boord. |
| **Directe browser-naar-bank-calls** | De Cockpit heeft een strict self-origin CSP. Elke externe call gebeurt server-side, zonder uitzondering. |
| **Schrijf-operaties** (payments, attachments, draft-payments) | Alleen toegestaan na een **apart eigen ontwerp** (design-first, SOP-development-workflow) én een **eigen Argus-audit**. Nooit meeliften op een bestaande read-connector. |
| **Financiële data in de task/calendar-connector-registry** | `catalog.json` is hard getypeerd op `kind: 'task' \| 'calendar'`. Een saldo of factuurstand is geen van beide en vervuilt de Agenda/Today-secties. |

## Verplichte eisen bij elke nieuwe financiële connector

Checklist — loop dit door vóórdat je een financiële feature voorstelt. Alle vijf zijn eisen, geen aanbevelingen.

- [ ] **Code-afdwingbare GET-only allowlist.** Niet als commentaar of intentie, maar als code: hardcoded GET + allowlist-check vóór de call, plus een unit-test die een niet-toegestaan pad laat falen zónder dat er een netwerkcall plaatsvindt.
- [ ] **Sandbox eerst, altijd vóór productie.** Bouwen en testen tegen de sandbox-omgeving van de partij vóórdat er ooit een echte productiesleutel in beeld komt.
- [ ] **Secrets alleen via `readEnvKey(...)` uit `Team Knowledge/.env`** (0600, gitignored). Nooit gelogd, nooit in een route-response, nooit in een foutmelding, nooit in een commit. `maskSecret`-discipline zoals `todoist.js`.
- [ ] **Sessie-tokens nooit naar schijf.** Alleen in het geheugen van het lopende proces; na een herstart opnieuw ophalen uit de bewaarde langlevende credentials.
- [ ] **Tweede Argus-audit vóór het eerste gebruik van een echte productiesleutel.** Een designreview vooraf vervangt die niet. Harde poort.

Aanvullend uit [[2026-08-17-argus-bunq-connector-audit]], niet blokkerend maar wel af te wegen vóór productie-activatie: aparte sleutel per rekening, een geteste intrekprocedure, concrete `permitted_ips` (geen wildcard), en de kaart standaard verborgen in LAN-mode.

## Precedent

Dit is geen nieuwe regel maar de vastlegging van een al doorlopen traject. De bunq-saldo-kaart is via precies dit patroon ontworpen (Cockpit-connector, geen MCP) en heeft een YELLOW-verdict van Argus met drie harde voorwaarden. Wijkt een voorstel hiervan af, dan is dat een **nieuwe** ontwerp- en auditvraag — niet iets wat binnen deze Guideline past.

Herhaal het onderzoek niet: de drie bronbestanden hierboven bevatten de rate limits, de auth-modellen, het MCP-landschap en de volledige auditbevindingen.

## Wanneer deze Guideline gelezen wordt

Elke keer dat een specialist een feature voorstelt of bouwt die bankdata, boekhoudkoppelingen of betaalgegevens raakt — in de Cockpit of daarbuiten. Van toepassing vanaf 2026-08-17.

## Cross-references

- [[GL-017-mcp-service-register]] — SSOT voor MCP-diensten; financiële bankkoppelingen horen daar per deze Guideline níét thuis.
- [[GL-018-integratie-en-software-register]] — inventaris van API's, webhooks en databronnen.

## Updates to this Guideline

Verandert het scope-oordeel (bijvoorbeeld doordat een bank alsnog een echte read-only scope aanbiedt), update dit bestand. Niet dupliceren naar CLAUDE.md, AGENTS.md of SOPs — zij `[[wikilinken]]` hierheen.
