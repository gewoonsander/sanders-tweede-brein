---
agent_id: hermes
session_id: vscode-claude-code-koppeling
timestamp: 2026-08-21T19:35:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# VS Code + Claude Code koppeling en tweede-brein toegang

## Context

Sander vroeg eerst naar OpenAI/Codex-integraties met Visual Studio (bleek voor zijn zwager te zijn, die met OpenAI werkt). Daarna wilde hij weten hoe hijzelf Claude Code kan koppelen aan VS Code om zijn tweede brein direct vanuit de editor te benaderen. Onderweg ook een korte losstaande vraag over hoe je op een MacBook ziet waar de computer mee bezig is.

## What we did

- Hermes zocht via WebSearch uit welke OpenAI-integraties voor (volledige) Visual Studio en VS Code bestaan (GitHub Copilot Chat met GPT-4.1/GPT-5, officiële OpenAI Codex-extensie voor VS Code, community-extensies voor volledige Visual Studio) en gaf Sander een overzicht met bronnen.
- Hermes legde uit hoe de officiële Claude Code-extensie (uitgever Anthropic) in VS Code te installeren en in te loggen is, na verificatie via WebSearch.
- Hermes controleerde `.mcp.json` en `.claude/settings.json` in de repo om feitelijk te kunnen onderbouwen wat er automatisch meekomt als Sander deze map opent in VS Code (CLAUDE.md/AGENTS.md-identiteit, subagents, skills, project-MCP's n8n/Firecrawl/DaVinci Resolve) versus wat onzeker is (account-gebonden connectors als Gmail/Todoist/Agenda/Dropbox/Drive/Canva, die niet in `.mcp.json` staan).
- Legde uit hoe Sander kan verifiëren of de extensie daadwerkelijk geïnstalleerd is (Extensions-paneel of bliksem-icoon). Sander bevestigde: gelukt.
- Beantwoordde de losse vraag over Activiteitenweergave (Activity Monitor) op macOS.

## Decisions made

- _(geen expliciete beslissingen deze sessie — informatieve/uitlegsessie)_

## Insights

- Bij vragen over externe tools/integraties (VS Code, OpenAI, macOS) altijd eerst verifiëren via WebSearch in plaats van op trainingsdata te vertrouwen — dit soort IDE-integraties verandert snel.
- Onderscheid vastgelegd tussen project-scoped MCP's (`.mcp.json`, gaan automatisch mee naar elke host die deze map opent) en account-scoped connectors (Gmail, Todoist, Agenda, Dropbox, Drive, Canva — niet in `.mcp.json`, dus onzeker of de VS Code-extensie dezelfde sessie deelt met Cowork). Nog niet getest door Sander.

## Realignments

- _(none this session)_

## Open threads

- [ ] Sander test in VS Code of de account-gebonden connectors (Gmail, Todoist, Agenda, Dropbox, Drive, Canva) ook beschikbaar zijn via de Claude Code-extensie, of alleen de project-MCP's uit `.mcp.json`.
- [ ] Team Inbox staat nog open: 1 screenshot + 3 documenten wachten op verwerking (niet opgepakt deze sessie).

## Next steps

- Bij eerstvolgende sessie: vragen of de VS Code-test (connectors) is gelukt, en zo nodig Daedalus inschakelen als er een aparte MCP-koppeling nodig blijkt voor de VS Code-omgeving.

## Cross-links

- `[[2026-08-21-19-18_hermes_martell-video-analyse-launchagents-teaminbox]]` — vorige sessie-log dezelfde dag.
