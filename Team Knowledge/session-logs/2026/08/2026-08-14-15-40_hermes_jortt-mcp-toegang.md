---
agent_id: hermes
session_id: jortt-mcp-toegang
timestamp: 2026-08-14T15:40:00+02:00
type: mid-session-insight
linked_sops:
  - SOP-018-registreer-mcp-service-bij-agent-runtime
linked_workstreams: []
linked_guidelines:
  - GL-019-persoonlijke-taakarchitectuur
---

# Jortt heeft een officiële read-only MCP

## Context

Een Jortt-mail over nieuwe voorwaarden meldde dat Jortt nu via MCP met AI-agents kan worden verbonden. Sander wilde weten of dit voor zijn beide administraties en zijn beperkte rechten mogelijk is.

## What we did

- Pieter Post verwijderde drie door Sander aangewezen informatieberichten uit Gmail.
- Daedalus verifieerde de officiële MCP-server, OAuth-route, read-only grens, abonnementseis en rolbeperkingen.
- Atlas legde het onderzoek vast in [[2026-08-14-jortt-mcp-toegangscheck]] en maakte [[tsk-2026-08-14-001-controleer-jortt-mcp-toegang]].

## Decisions made

- **Question:** Is direct bouwen tegen de REST API nodig? **Decision:** Nee; test eerst de officiële read-only MCP, omdat die minder integratiecode en geen mutatierechten vereist.
- **Question:** Is het abonnement een blokkade? **Decision:** Waarschijnlijk niet; beide administraties hebben Jortt MKB. De gebruikersrol wordt per administratie getest.

## Insights

- Alleen een Jortt-Beheerder kan externe applicaties en API-sleutels beheren; MKB alleen garandeert dus nog geen succesvolle koppeling.

## Realignments

- _(none this session)_

## Open threads

- [ ] Sanders gebruikersrol en OAuth-toegang per administratie verifiëren.

## Next steps

- Daedalus voert de read-only MCP-proef uit wanneer de Jortt-aanmelding beschikbaar is.

## Cross-links

- [[jortt]]
- [[2026-08-14-jortt-mcp-toegangscheck]]
- [[tsk-2026-08-14-001-controleer-jortt-mcp-toegang]]
