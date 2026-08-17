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
updated: 2026-08-17T09:30:00Z
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
- [ ] `bunqClient.js` exporteert geen generieke `request(method, path)` — alleen hardcoded-GET `signedGet(path)` met een expliciete allowlist-check vóór elke call, plus een unit-test die een niet-toegestaan path laat falen zonder netwerkcall.
- [ ] `ensureInstallation()`-guard: checkt eerst bestaande tokens via `readEnvKey(...)` vóór `installation`/`device-server` ooit aangeroepen wordt; sandbox-verificatie van welke rate-limit-bucket `session-server` daadwerkelijk raakt; eigen crash-loop-bescherming los van bunq's 429.
- [ ] `permitted_ips` concreet vastgelegd (geen wildcard) — operationele afspraak, inclusief runbook-stap voor IP-wijzigingen.

Aanbevolen (niet blokkerend, wel vóór productie-activatie):
- [ ] Compenserende maatregelen tegen het betaalrisico van een gecompromitteerde sleutel (aparte sleutel per rekening, geteste intrekprocedure).
- [ ] bunq-kaart standaard uitgeschakeld bij LAN-toegang tot de Cockpit, ook als hij lokaal wel actief is.

Algemeen:
- Sandbox (`public-api.sandbox.bunq.com`) verplicht getest vóór ooit een productie-key gebruikt wordt.
- Tweede Argus-audit (post-implementatie, vóór eerste gebruik van een echte productie-sleutel) is een harde poort — geen overslaan.
- bunq Pro bevestigd aanwezig op zowel Gewoon Sander als AKP Gezinshuis (2026-08-17, mondeling bevestigd door Sander).

## Updates

- 2026-08-17 09:30 (hermes) — aangemaakt na afronding van ontwerp (juli), MCP-onderzoek en Argus-audit (beide 2026-08-17). Sander koos expliciet voor "later bouwen" i.p.v. nu — geen afkeuring, bewuste vertraging.

## Outcome
_(filled when status flips to done — see SOP-close-task)_
