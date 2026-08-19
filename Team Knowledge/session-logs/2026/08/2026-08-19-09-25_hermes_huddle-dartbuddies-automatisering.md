---
agent_id: hermes
session_id: 2026-08-19-huddle-dartbuddies-automatisering
timestamp: 2026-08-19T07:25:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Huddle/Dartbuddies-automatisering: onderzoek naar API/MCP-mogelijkheden

## Context

Sander wilde weten of hij zijn Huddle-community Dart Buddies geautomatiseerd kan voeden met content en kan laten reageren op leden, en hoe een LLM daarin kan worden ingezet.

## What we did

- Martonny (Huddle Platform Specialist) onderzocht de officiële Huddle-documentatie (help.thehuddle.nl) en de Algemene Voorwaarden op API's, MCP-servers, webhooks, ingebouwde AI-features en ToS-regels rond geautomatiseerd posten.
- Hermes legde de bevindingen vast als projectkennis in `.claude/memory/project_huddle_dartbuddies_automatisering.md`.
- Hermes presenteerde vier vervolgsporen (contentmotor, reactieassistent, browser-automatisering, supportvraag aan Huddle) — Sander parkeerde de beslissing voor later.
- Penn controleerde de Team Inbox op een gemelde screenshot + document; beide bleken niet aanwezig (alleen `.DS_Store`-bestanden). Vals alarm, geen actie nodig.

## Decisions made

- _(geen — Sander parkeerde de Dartbuddies-automatiseringsbeslissing expliciet voor later)_

## Insights

- Huddle (thehuddle.nl) heeft geen publieke API, geen MCP-server, geen content-posting-automatisering, geen "nieuw bericht"-webhook-trigger en geen ingebouwde AI-moderator. Het enige geautomatiseerde is gebruikersbeheer (webhook/Zapier) en, in gesloten bèta, automatische privéberichten bij specifieke triggers.
- Verwarringsrisico: Huddle.com/Huddle.net (Brits, Ideagen) heeft wél een developer-API, maar is een ander bedrijf dan thehuddle.nl. Nooit tegen die API bouwen voor Dart Buddies.

## Realignments

- _(none this session)_

## Open threads

- [ ] Sander beslist later welk vervolgspoor hij wil voor Dartbuddies-automatisering (contentmotor / reactieassistent / browser-automatisering / supportvraag aan Huddle).
- [ ] Optioneel: navraag bij Huddle-support over een eventuele private developer-API, de status van de Global Automations-bèta, en een apart community-guidelines-document — nog niet gesteld.

## Next steps

- Bij hervatting: vraag Sander welk van de vier sporen (A/B/C/D uit dit gesprek) hij wil oppakken.

## Cross-links

- `[[2026-07-14-huddle-specialist-hire-research]]` — Athena's oorspronkelijke hire-research digest voor Martonny, die het API/developer-documentatiegat al vlagde.
