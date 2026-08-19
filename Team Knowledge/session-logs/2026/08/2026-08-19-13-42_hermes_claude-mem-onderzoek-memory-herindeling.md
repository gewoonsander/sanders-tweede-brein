---
agent_id: hermes
session_id: claude-mem-onderzoek-memory-herindeling
timestamp: 2026-08-19T13:42:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Onderzoek claude-mem en progressive disclosure voor MEMORY.md

## Context

Sander vroeg onderzoek naar de externe skill/tool "claude-mem" (Alex Newman /
thedotmack): wat het doet, wat het anders doet dan ons eigen geheugensysteem,
en wat bruikbaar zou zijn om over te nemen. Vervolgens vroeg hij het
progressive-disclosure-idee daaruit concreet uit te werken voor `MEMORY.md`.

## What we did

- Athena onderzocht claude-mem via 6 bronnen (GitHub-repo, officiële docs,
  een onafhankelijke review, LICENSE-bestand, twee GitHub-issues) en leverde
  een vergelijkend rapport met bronvermelding.
- Hermes vertaalde het bruikbare deel (progressive disclosure bij het lezen)
  naar een 3-laags ontwerp voor `MEMORY.md` zonder nieuwe infrastructuur
  (geen DB, geen hooks — blijft binnen de markdown-only-regel uit
  `AGENTS.md`).
- Hermes herindeelde `MEMORY.md` in kopjes per type (Feedback / Projecten /
  User) en voegde een triggerregel toe voor een toekomstige split naar
  `<type>/INDEX.md`. Inhoud van de entries is ongewijzigd.

## Decisions made

- **Question:** Nemen we claude-mem's automatische hooks en vector search
  over?
  **Decision:** Nee. Bevestigde issues bij claude-mem zelf (tokenbudget op in
  <10 berichten door AI-samenvatting per tool-call; 35GB RAM door Chroma)
  laten zien dat automatisering hier vooral risico toevoegt zonder
  navenant voordeel voor een single-user, laag-volume setup. Ons
  instructie-gestuurde systeem blijft ongewijzigd.
- **Question:** Hoe houden we `MEMORY.md` schaalbaar als het aantal
  memory-bestanden groeit?
  **Decision:** Nu alleen groeperen op type (doorgevoerd). Pas een categorie
  naar een eigen `INDEX.md` splitsen zodra die >15-20 entries heeft of
  `MEMORY.md` richting ~150 regels gaat (cap is 200). Nu op 36 regels, dus
  nog geen aanleiding om verder te bouwen.

## Insights

- claude-mem's "automatisch is per definitie beter"-aanname houdt geen
  stand tegen de eigen bugtracker van het project — een nuttig
  tegenwicht bij toekomstige evaluaties van vergelijkbare tools.

## Realignments

- _(none this session)_

## Open threads

- [ ] Categorie-splitsing naar `<type>/INDEX.md` (laag 1) nog niet gebouwd —
      bewust uitgesteld tot het triggerpunt (zie Decisions) bereikt wordt.

## Next steps

- Geen directe vervolgactie. Oppakken zodra `MEMORY.md` richting de 150
  regels gaat of een categorie de 15-20 entries passeert.

## Cross-links

- _(geen direct gerelateerde eerdere sessie-log gevonden)_
