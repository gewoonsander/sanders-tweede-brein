---
agent_id: hermes
session_id: 2026-07-06-sterren-workflow-boekhouding-verbetering
timestamp: 2026-07-06T08:29:00Z
type: proactive
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Sterren-workflow (dagstart Stap 2) — mogelijke uitbreiding naar boekhouding

## Context

Na de dagstart van vandaag vroeg Sander waarvoor de "gesterde e-mails"-stap in `/dagstart` (Stap 2) ook alweer bedoeld was — hij had het idee dat sterren gekoppeld was aan het doorsturen van iets naar de boekhouding. Hermes doorzocht de sessielogs en de skill zelf en vond geen bestaande koppeling: sterren zet momenteel alleen een Todoist-taak klaar (vangnet naast de normale 7-dagen inbox-sweep), zonder enige forward-actie richting boekhouding of Bart/VMB Advies.

## Insight (verbatim kern)

Sander wil op termijn dat gesterde e-mails (bijv. facturen/bonnen) ook automatisch worden doorgestuurd naar de boekhouding. Dit heeft nu geen prioriteit, maar moet wel ergens vastgelegd worden zodat het niet verloren gaat.

**Waarom het relevant is:** voorkomt dat een e-mail zowel een Todoist-taak wordt (huidige gedrag) áls handmatig moet worden doorgestuurd naar de boekhouder — sterren zou dan in één klik beide kunnen triggeren.

**Waar dit landt:** `.claude/commands/dagstart.md` Stap 2 (gesterde e-mails), eigenaar Hermes. Mogelijk relevant voor Daedalus (automation/forwarding) als het uiteindelijk gebouwd wordt.

## Decisions made

- **Question:** Nu implementeren of parkeren?
  **Decision:** Parkeren — geen prioriteit op dit moment. Alleen vastleggen als toekomstige verbetering.

## Open threads

- [ ] Toekomstige verbetering: sterren-stap in `/dagstart` uitbreiden zodat (bepaalde) gesterde e-mails automatisch worden doorgestuurd naar de boekhouding, naast de Todoist-taak die al wordt aangemaakt. Geen deadline — oppakken wanneer Sander hier prioriteit aan geeft.

## Next steps

- Bij een toekomstige `/improve-skill`-sessie op dagstart: dit open thread meenemen als startpunt.
