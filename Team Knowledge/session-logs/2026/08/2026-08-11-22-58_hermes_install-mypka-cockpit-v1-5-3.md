---
agent_id: hermes
session_id: install-mypka-cockpit-v1-5-3
timestamp: 2026-08-11T22:58:50+02:00
type: proactive
linked_sops: ["SOP-004-argus-security-audit", "SOP-019-controleer-integraties-en-software"]
linked_workstreams: ["WS-003-install-an-expansion"]
linked_guidelines: ["GL-017-mcp-service-register", "GL-018-integratie-en-software-register"]
---

# myPKA Cockpit 1.5.3 lokaal geïnstalleerd

## Context

Sander koos de myPKA Cockpit als dashboard voor het gestructureerd controleren
van MCP's, API's, webhooks, databronnen en software.

## What we did

- Hermes doorliep disclaimer, toestemming, back-up en installpreview.
- Argus gaf YELLOW; Sander accepteerde dit expliciet.
- Daedalus legde de lokale herkomst vast, corrigeerde het manifest en bouwde het
  portable integratieregister, passieve probes, lokale statusopslag en API.
- Bezalel bouwde de pagina “Koppelingen & software”.
- De macOS-launcher is gegenereerd maar niet gestart.

## Decisions made

- **Vraag:** Hoe blijft integratiestatus portable én apparaatbewust?
  **Besluit:** verwachting is canoniek in [[GL-018-integratie-en-software-register]];
  observaties blijven lokaal in `mypka-cockpit.db`.
- **Vraag:** Mag de aangepaste Cockpit als ongewijzigd myICOR-artefact gelden?
  **Besluit:** nee; versie 1.5.3 is expliciet een SanderCo local adaptation.

## Insights

- n8n MCP en de n8n Public API gebruiken verschillende credentials en blijven
  afzonderlijke integraties.
- Een runtime-Expansion moet zijn uitvoerbare folder na installatie behouden.

## Realignments

- _(geen)_

## Open threads

- [ ] Sander kiest afzonderlijk of de SQLite-uitbreidingen mogen worden uitgevoerd.
- [ ] Sander start de Cockpit zelf via `start-cockpit.command`.
- [ ] Visuele runtime-QA uitvoeren nadat de Cockpit draait.
- [ ] Uitrol en lokale secretcontrole op de MacBook Air uitvoeren.

## Next steps

- Detecteer schemahiaten en leg de SQLite-upgradekeuze voor.
- Start daarna de Cockpit handmatig en controleer het dashboard live.

## Cross-links

- [[2026-08-11-integratiecontrole-cockpit-design]]
- [[2026-08-11-integratiecontrole-cockpit-plan]]
- [[2026-08-11-mypka-cockpit-security-audit]]
