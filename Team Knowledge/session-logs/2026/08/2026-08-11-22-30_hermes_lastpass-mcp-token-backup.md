---
agent_id: hermes
session_id: lastpass-mcp-token-backup
timestamp: 2026-08-11T22:30:50+02:00
type: proactive
linked_sops: ["SOP-018-registreer-mcp-service-bij-agent-runtime"]
linked_workstreams: []
linked_guidelines: ["GL-017-mcp-service-register"]
---

# LastPass als back-up voor MCP-tokens

## Context

Sander vroeg expliciet vast te leggen dat hij LastPass gebruikt als back-up voor MCP-tokens.

## What we did

- Daedalus verwerkte de afspraak in [[GL-017-mcp-service-register]], zonder een tokenwaarde of ander geheim vast te leggen.
- Hermes legde de beslissing vast als blijvende teamcontext.

## Decisions made

- **Vraag:** Waar worden MCP-tokens centraal bewaard voor herstel en overdracht tussen apparaten?
  **Besluit:** LastPass is de versleutelde back-up- en overdrachtskluis. De lokale secret store van ieder apparaat blijft de runtimebron.

## Insights

- Het tweede brein registreert alleen het opslagbeleid en secretnamen; nooit geheime waarden.

## Realignments

- _(geen)_

## Open threads

- [ ] Het actuele n8n MCP-token nog lokaal installeren en de verbinding verifiëren op ieder gewenst apparaat.

## Next steps

- Gebruik [[SOP-018-registreer-mcp-service-bij-agent-runtime]] bij installatie of rotatie op een nieuw apparaat.

## Cross-links

- [[GL-017-mcp-service-register]]
