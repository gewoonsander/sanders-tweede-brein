---
# Identity
id: tsk-2026-08-17-001
title: "Bouw bunq-saldo Cockpit-connector (read-only) volgens goedgekeurd ontwerp + Argus-eisen"

# Ownership & priority
assignee: daedalus
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-17T09:30:00Z
updated: 2026-08-21T19:45:00Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-17
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: [SOP-004-argus-security-audit]
linked_workstreams: []
linked_guidelines: [GL-022-financiele-koppelingen-dashboard-scope]
linked_my_life: [financien]
linked_session_logs: [2026-08-17-11-30_hermes_dagobert-duck-hire, 2026-08-17-13-00_argus_bunq-connector-designaudit]
linked_journal_entries: []

# Tagging
tags: [bunq, financien, cockpit, connector, dagobert-duck, security, bank]
---

# Bouw bunq-saldo Cockpit-connector (read-only) volgens goedgekeurd ontwerp + Argus-eisen

## What this is

Sander wil zijn bunq-banksaldo('s) kunnen opvragen via de nieuwe teamspecialist Dagobert Duck (Persoonlijke Financiële Assistent). Het ontwerp en de security-audit zijn afgerond en goedgekeurd; de daadwerkelijke code (RSA-signing, device-registratie, de Cockpit-kaart) is nog niet gebouwd. Sander koos er op 2026-08-17 expliciet voor om de bouwfase nu NIET te starten ("later plannen") — dit is dus bewust als taak vastgelegd, niet als afgekeurd werk.

Architectuurbeslissing (niet ter discussie, al vastgesteld): een directe, server-side, read-only Cockpit-connector volgens het Open-Invoices-precedent — géén MCP-server (bunq kent geen read-only-scope; de twee bestaande third-party bunq-MCP-servers hebben beide betaal-tools ingebouwd, wat een prompt-injectie-pad naar een betaalfunctie zou openen).

## Context one click away

- [[2026-07-05-bunq-saldo-cockpit-design]] — architectuurontwerp (Aanpak A), incl. openstaande vraag over weergave van sub-rekeningen (Sander koos: A — elke rekening apart).
- [[2026-08-17-bunq-mcp-koppeling-onderzoek]] — waarom geen MCP-server; negenpunts-checklist als auditscope.
- [[2026-08-17-argus-bunq-connector-audit]] — YELLOW-verdict, 3 blokkerende eisen + 2 aanbevolen maatregelen.
- [[GL-022-financiele-koppelingen-dashboard-scope]] — teambrede regels voor financiële connectors.
- [[Team/Dagobert Duck - Persoonlijke Financiële Assistent/AGENTS]] — de specialist die deze data straks gaat gebruiken.

## Success criteria

Vóór bouwstart, harde eisen uit Argus' audit (geen overrule-pad):
- [x] `bunqClient.js` exporteert geen generieke `request(method, path)` — alleen hardcoded-GET `signedGet(path)` met een expliciete allowlist-check vóór elke call, plus een unit-test die een niet-toegestaan path laat falen zonder netwerkcall. **Gehaald 2026-08-21**: 18 verboden paden getest, `fetch` blijft aantoonbaar ongebruikt; de allowlist telt één anchored regex.
- [~] `ensureInstallation()`-guard. **Deels gehaald 2026-08-21.** Guard: strenger dan gevraagd — `installation`/`device-server` staan niet in `bunqClient.js` maar in `bunqSetup.js`, dat de server nooit importeert, dus een crash-loop kán de 10/dag-bucket niet raken. Crash-loop-bescherming: gehaald (60s cooldown + max 5 pogingen/uur, los van bunq's 429). **Nog open:** sandbox-verificatie van welke bucket `session-server` raakt — dat vereist een draaiende sandbox-sleutel.
- [~] `permitted_ips` concreet vastgelegd (geen wildcard). **Code-kant gehaald:** `registerDevice()` weigert de wildcard `*` actief en valideert elk IP-formaat vóór er iets naar bunq gaat; runbook-stap voor IP-wijzigingen staat in `server/connectors/bunq/README.md`. **Nog open:** de operationele afspraak zelf — welke IP's, en of de module tot één vaste machine beperkt blijft. Dat is Sanders beslissing, geen code.

Aanbevolen (niet blokkerend, wel vóór productie-activatie):
- [~] Compenserende maatregelen tegen het betaalrisico van een gecompromitteerde sleutel. **Gedocumenteerd** in `.env.example` en de connector-README (aparte sleutel per rekening, intrekprocedure, FileVault/schermvergrendeling, bunq-pushmeldingen als tripwire). **Nog open:** het daadwerkelijk inoefenen van de intrekprocedure.
- [x] bunq-kaart standaard uitgeschakeld bij LAN-toegang tot de Cockpit, ook als hij lokaal wel actief is. **Gehaald 2026-08-21**, server-side afgedwongen (`BUNQ_ALLOW_LAN`, standaard leeg), niet als UI-verbergtruc. Sleutel toegevoegd aan `PROTECTED_KEYS` zodat een LAN-gebruiker met de pincode de gate niet zelf kan openzetten.

Algemeen:
- Sandbox (`public-api.sandbox.bunq.com`) verplicht getest vóór ooit een productie-key gebruikt wordt.
- Tweede Argus-audit (post-implementatie, vóór eerste gebruik van een echte productie-sleutel) is een harde poort — geen overslaan.
- bunq Pro bevestigd aanwezig op zowel Gewoon Sander als AKP Gezinshuis (2026-08-17, mondeling bevestigd door Sander).

## Updates

- 2026-08-17 09:30 (hermes) — aangemaakt na afronding van ontwerp (juli), MCP-onderzoek en Argus-audit (beide 2026-08-17). Sander koos expliciet voor "later bouwen" i.p.v. nu — geen afkeuring, bewuste vertraging.
- 2026-08-21 19:45 (hermes/daedalus) — **code gebouwd en getest.** Zeven nieuwe bestanden onder `Expansions/mypka-cockpit/server/connectors/bunq/` plus `scripts/setup-bunq.mjs` en de Hub-kaart; 40 tests groen, frontend-build en typecheck schoon. bunq's signing-regels vooraf geverifieerd bij doc.bunq.com (alleen de body wordt getekend; validatie sinds 2020-04-28 alleen nog voor betaalcalls en sessie-initiatie).
  Twee dingen die tijdens de bouw zijn gevonden en niet in het ontwerp stonden:
  (1) `BUNQ_ALLOW_LAN` moest naar `PROTECTED_KEYS` in `connectorAdmin.js` — zonder die regel kon iemand met LAN-toegang en de pincode via de Connections-pagina zijn eigen LAN-gate openzetten, precies het gat dat audit §4 wil dichten.
  (2) De rate-limit-eis is strenger opgelost dan de audit vroeg: de setup-calls zijn fysiek uit de servercode gehaald in plaats van achter een guard gezet.
  **Taak blijft open.** Wat resteert is niet-code: sandboxronde met een echte sleutel, verificatie van de session-server-bucket, de `permitted_ips`-afspraak, en de tweede Argus-audit vóór de eerste productiesleutel.

## Outcome
_(filled when status flips to done — see SOP-close-task)_
