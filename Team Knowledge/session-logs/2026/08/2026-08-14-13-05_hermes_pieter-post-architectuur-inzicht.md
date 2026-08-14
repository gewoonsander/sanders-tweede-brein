---
agent_id: hermes
session_id: pieter-post-onderzoek
timestamp: 2026-08-14T11:05:17Z
type: mid-session-insight
linked_sops:
  - SOP-001-how-to-add-a-new-specialist
  - SOP-development-workflow
linked_workstreams: []
linked_guidelines:
  - GL-012-pkm-vs-todoist
  - GL-014-todoist-taakformat
---

# Pieter Post hoeft geen nieuw informatie- of taakplatform te bouwen

## Insight

Het onderzoek naar een toekomstige e-mailassistent liet zien dat de benodigde verbindingen grotendeels al bestaan: Gmail is live gekoppeld in Codex en Todoist bestaat al als MCP- en Cockpit-API-verbinding in de bredere myPKA-omgeving. Het echte ontbrekende onderdeel is geen connector, maar een gespecialiseerde mailbeslisboom en een duidelijk bevoegdheidsmodel.

## Hoe dit ontstond

Athena vergeleek actuele officiële Gmail- en Todoist-documentatie met de werkelijk beschikbare Codex-tools en bestaand teamgeheugen. De bestaande richtlijnen [[GL-012-pkm-vs-todoist]] en [[GL-014-todoist-taakformat]] bepalen al waar actie, kennis en bronmateriaal thuishoren.

## Downstream implications

- Start interactief met de bestaande Gmail-plugin en officiële Todoist-MCP-route.
- Gebruik myPKA niet als verplicht tussenstation voor elke e-mailtaak.
- Bouw een Gmail API/Pub/Sub-listener pas wanneer de menselijke workflow stabiel is.
- Laat Pieter Post uiteindelijk de ontbrekende mailtriageprocedure aanvullen, zonder de bestaande SSOT-regels te dupliceren.
- Iedere uit e-mail afgeleide PKM-notitie bewaart een klikbare Gmail-threadlink; het dashboard moet die bronlink als éénkliknavigatie tonen. Deze permanente eis is gecanoniseerd in [[GL-012-pkm-vs-todoist]].
- Pieter Post gebruikt GTD als verwerkingsvolgorde en Eisenhower als prioriteitslaag voor uitvoerbare mail. Iedere delegatie krijgt een afzonderlijk, eenmalig Todoist-opvolgcontrolepunt met een geschatte controledatum; het gedelegeerde werk zelf blijft bij de andere persoon.
- Sander wil één bestuurlijke inbox over meerdere bronkanalen. Dit wordt een centrale myPKA/dashboardwachtrij met bronlinks en casestatus, niet een fysieke kopie van iedere Gmail-thread in `Team Inbox/`. Pieter Post bezit de e-mailcasus end-to-end maar routeert inhoudelijk domeinwerk naar de juiste specialist.

Gerelateerd: [[2026-08-14-pieter-post-hire-research]], [[2026-08-14-pieter-post-gmail-todoist-design]]
