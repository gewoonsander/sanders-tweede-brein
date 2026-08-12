---
agent_id: hermes
session_id: codex-dropbox-cloud-mcp
timestamp: 2026-08-12T08:02:15+02:00
type: realignment
linked_sops:
  - SOP-018-registreer-mcp-service-bij-agent-runtime
linked_workstreams: []
linked_guidelines:
  - GL-005-llm-agnostic-portable-core
  - GL-017-mcp-service-register
---

# Realignment — Dropbox moet LLM-agnostisch zijn

## Oorspronkelijke richting

Het eerste Dropbox-cloudontwerp richtte zich op Claude Code als gebruiker van de nieuwe Dropbox-MCP-adapter.

## Correctie van Sander

> "n Ik wil dat je er ook voor zorgt dat codexf bij kan zodat ik LLM-agnostisch kan blijven werken."

`codexf` is in context geïnterpreteerd als Codex. Sander keurde het Claude-gerichte ontwerp expliciet niet goed.

## Nieuwe vaste richting

De Dropbox-service, OAuth-accountbinding, batchgoedkeuring en auditgeschiedenis zijn portable en runtime-onafhankelijk. Claude en Codex krijgen dunne, afgeleide adapters naar exact dezelfde MCP-server. GL-017 blijft de SSOT en SOP-018 bestuurt registratie per runtime.

## Waarom dit ertoe doet

Toegang tot Sanders cloudbestanden mag geen lock-in naar één LLM-runtime veroorzaken. Nieuwe MCP-compatibele runtimes moeten later kunnen aansluiten zonder de Dropbox-integratie of haar veiligheidsbeleid opnieuw te bouwen.

## Gerelateerd

- [[2026-08-12-dropbox-cloud-mcp-design]]
- [[GL-005-llm-agnostic-portable-core]]
- [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
