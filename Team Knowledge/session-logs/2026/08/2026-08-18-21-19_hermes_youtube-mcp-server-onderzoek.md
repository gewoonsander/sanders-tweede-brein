---
agent_id: hermes
session_id: youtube-mcp-server-onderzoek
timestamp: 2026-08-18T21:19:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# YouTube MCP-server haalbaarheidsonderzoek

## Context

Sander wilde weten of er een bruikbare MCP-server voor YouTube bestaat waarmee hij vanuit Claude (1) kanaal-/video-statistieken kan bekijken en (2) video's kan uploaden of inplannen voor publicatie.

## What we did

- Hermes routeerde het onderzoek naar Athena voor cross-geverifieerd bronnenonderzoek.
- Athena leverde een uitgebreid rapport op met tabel van gevonden MCP-servers, quota-analyse en aanbeveling: `Deliverables/2026-08-18-youtube-mcp-server-research.md`.
- Hermes vatte de bevindingen samen voor Sander en bood vervolgstappen aan (A: n8n-route opzetten, B: twee MCP-servers opzetten, C: nog niets doen).

## Decisions made

- **Question:** Welke route om YouTube-upload/scheduling + analytics te ontsluiten?
  **Decision:** Sander koos voorlopig geen vervolgactie (optie C: "nog niet, eerst zelf nadenken"). Geen server opgezet, geen route ingezet.

## Insights

- De populairste YouTube MCP-server in zoekresultaten (563★, ZubeidHendricks) beschrijft zichzelf als "advanced analytics", maar biedt in werkelijkheid alleen leesbare metadata zonder OAuth — marketing-beschrijving kwam niet overeen met de daadwerkelijke tool-lijst. Les: altijd de README/tool-lijst zelf controleren, niet de tagline.
- Het bekende YouTube API-quotacijfer van 1.600 eenheden per upload is verouderd — sinds 4 december 2025 verlaagd naar ~100 eenheden, en sinds 1 juni 2026 heeft `videos.insert` een eigen dagbudget van 100 aanroepen los van de gedeelde pool van 10.000. Quota is voor persoonlijk gebruik waarschijnlijk geen praktisch probleem meer.
- Analytics API (kijktijd, omzet) vereist dat het authenticerende account kanaal-**eigenaar** is, niet enkel beheerder — dit onderscheid is relevant voor Sanders eigen setup.

## Realignments

- _(geen dit sessie)_

## Open threads

- [ ] Sander overweegt zelf welke route (n8n-integratie, twee gespecialiseerde MCP-servers, of niets) hij wil inzetten voor YouTube-upload/scheduling + analytics. Geen deadline.

## Next steps

- Zodra Sander een keuze maakt: Hermes routeert naar Daedalus voor de daadwerkelijke opzet (optie B of C uit het rapport).

## Cross-links

- _(geen direct gerelateerde eerdere sessie)_
