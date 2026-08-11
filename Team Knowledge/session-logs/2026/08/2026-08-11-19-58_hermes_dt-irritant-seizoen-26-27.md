---
agent_id: hermes
session_id: dt-irritant-google-forms-n8n
timestamp: 2026-08-11T19:58:25+02:00
type: realignment
linked_sops:
  - SOP-development-workflow
linked_workstreams: []
linked_guidelines: []
---

# D.T. Irritant-automatisering vastgezet op seizoen 26-27

## Context

Sander liet een n8n-ontwerp en implementatieplan maken dat vanuit Teambeheer een Google Form voor de beschikbaarheid van D.T. Irritant genereert.

## What we did

- Daedalus ontwierp Teambeheer als SSOT met een handmatig gestarte n8n-synchronisatie.
- Hermes controleerde het bestaande Google Sheet `Feeds teambeheer` en bevestigde `d=1` voor RDB en `t=394` voor D.T. Irritant.
- Daedalus paste ontwerp en plan aan zodat seizoen `26-27` verplicht wordt gevalideerd.

## Decisions made

- **Question:** Welk seizoen mag de workflow verwerken? **Decision:** uitsluitend seizoen `26-27`; iedere andere waarde of response stopt vóór een Google Form wordt aangemaakt.

## Insights

- Een standaardwaarde alleen is onvoldoende voor een externe schrijfflow; het seizoen moet ook tegen de bronresponse worden gevalideerd.

## Realignments

- Sander: "zorg er wel voor dat je het goede seizoen toepast dus 26-27".

## Open threads

- [ ] Sander keurt het aangepaste implementatieplan goed.
- [ ] Daedalus bouwt en test daarna de n8n-workflows.

## Next steps

- Na goedkeuring de workflow implementeren met een harde `s=26-27`-guard.

## Cross-links

- [[2026-08-07-14-28_hermes_todoist-regels-verbouwingsoverzicht-cockpit-secrets-audit]]
