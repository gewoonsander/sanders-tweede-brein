---
# Identity
id: tsk-2026-08-11-001
title: "myPKA Cockpit: nieuw tabblad 'Software-stack' voor overzicht van verbonden software"

# Ownership & priority
assignee: bezalel
priority: 3

# Status (mirrors folder location)
status: in-progress
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-11T18:30:00Z
updated: 2026-08-11T18:45:00Z
due: null

# Provenance
created_by: Hermes
source: manual
parent: null

# Cross-references
linked_sops:
  - SOP-003-bezalel-build-a-component
linked_workstreams: []
linked_guidelines:
  - GL-003-design-system
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags:
  - mypka-cockpit
  - frontend
  - terminal-sessie
  - integraties
---

# myPKA Cockpit: nieuw tabblad "Software-stack" voor overzicht van verbonden software

## What this is

Tijdens het wiren van cockpit-connectors (sessie 2026-08-11) vroeg Sander of
de bestaande **Connections**-pagina (`web/src/views/ConnectionsView.tsx`,
route `#/connections`) ook bedoeld is als algemeen overzicht van alle
software waarmee zijn "brein" verbonden is. Antwoord: nee — die pagina is
strak gebouwd rond één smal contract (`server/connectors/README.md`):
read-only taken/agenda-items (`NormalizedTask`/`NormalizedEvent`,
`assignedToMe: true`) die het planbord voeden. Twee opgeslagen
`.env`-sleutels (`FIRECRAWL_API_KEY`, `PERPLEXITY_API_KEY`) passen daar niet
in — Firecrawl en Perplexity hebben geen "mijn taken"-lijst om te tonen, ze
zijn al rechtstreeks via MCP verbonden, los van dit dashboard-onderdeel.

Sander wil daarom een **apart, nieuw tabblad** in de cockpit: een breder
overzicht van zijn hele verbonden software-stack (MCP-servers zoals
Firecrawl/n8n, opgeslagen `.env`-sleutels — ook de sleutels die nooit een
taak-connector krijgen — mogelijk lokale automatiseringen/launchd-agents),
met deep links terug naar elke tool, en idealiter beheeracties (bijv.
sleutel intrekken, status zien). Dit is bewust **niet** hetzelfde datamodel
als de bestaande connectors — het hergebruikt het design-system (GL-003) en
de visuele stijl van de Connections-pagina, maar met een eigen databron en
eigen API-route(s) (bijv. een nieuwe `GET /api/cockpit/stack` die MCP-config
+ alle opgeslagen `.env`-sleutelnamen + eventueel launchd-agents samenvat —
secret-free door constructie, net als `/api/cockpit/connectors`).

**Expliciete gebruikersvoorkeur:** dit is een groter frontend-karwei
(nieuwe view + route + server-endpoint + i18n-strings in nl/en, meerdere
databronnen die individueel uitgezocht moeten worden) — Sander bewaart dit
soort werk bewust voor een sessie waarin hij echt in Claude Code/terminal
werkt, niet in Cowork/desktop-app.

## Context one click away
- Procedure: [[SOP-003-bezalel-build-a-component]]
- Guideline: [[GL-003-design-system]]
- Bestaande smalle referentie: `Expansions/mypka-cockpit/server/connectors/README.md` en `web/src/views/ConnectionsView.tsx` (het contract dat dit NIET moet volgen — apart datamodel)
- Verwante audit: `PKM/My Life/Projects/project_secrets-beveiliging-audit.md` (inventariseert dezelfde 7 `.env`-sleutels vanuit beveiligingsoogpunt)

## Success criteria
- Nieuw tabblad/route in de cockpit-web-app (bijv. `#/stack`) zichtbaar in `Sidebar.tsx`
- Toont: alle opgeslagen `.env`-sleutelnamen (secret-free, zoals `listStoredKeyNames`/`GET /api/cockpit/connectors` nu al doet) inclusief sleutels zonder connector (Firecrawl, Perplexity)
- Toont: verbonden MCP-servers (bron nog uit te zoeken — mogelijk uit Claude-config, niet uit de cockpit zelf)
- Elke rij heeft een deep link naar de tool zelf waar relevant
- Blijft read-only/secret-free zoals de bestaande Connections-pagina (geen waarden ooit tonen/loggen)
- Ontwerp volgt GL-003 tokens, licht + donker thema

## Updates
- 2026-08-11 18:30 (Hermes) — aangemaakt, na Sanders vraag of de Connections-pagina een algemeen software-overzicht is (antwoord: nee, apart tabblad is de juiste vorm)
- 2026-08-11 18:45 (Hermes) — picked up. Sander gaf expliciet aan nu al verder te willen, ondanks de standaard-voorkeur voor terminal-sessies bij dit soort werk — bewuste uitzondering, geen herhaalde vraag nodig. MCP-server-bron uitgezocht: repo-root `.mcp.json` gebruikt overal `${VAR}`-placeholders (geen letterlijke secrets), dus veilig te lezen als bron voor de MCP-server-sectie — lost het open punt in "Context one click away" op. Doorgezet naar Bezalel voor de bouw.
