---
date: 2026-06-20
time: "18:30"
agent: Larry
type: close-session
topic: n8n MCP server connectie
---

# Sessie — N8N MCP connectie — 2026-06-20

## Active tasks
- [x] N8N MCP server koppelen aan Claude Code
- [ ] Verbinding verifiëren na restart van de sessie
- [ ] (optioneel) overwegen of dit via Mack had moeten lopen i.p.v. direct door Larry

## Wat we hebben gedaan

- Sander wilde zijn "brain" (deze Claude Code sessie) koppelen aan zijn N8N cloud instance via MCP.
- N8N cloud (`gewoonsander.app.n8n.cloud`) heeft een MCP Server Settings pagina (`/settings/mcp`) die een HTTP MCP endpoint + bearer token genereert.
- Sander plakte de kant-en-klare MCP config (endpoint + JWT bearer token).
- Larry heeft `.mcp.json` aangemaakt in de repo-root met deze config, en `.mcp.json` toegevoegd aan `.gitignore` zodat het bearer-token nooit gecommit wordt.
- Verbinding is nog niet geverifieerd — vereist herstart van de Claude Code sessie zodat de nieuwe MCP server geladen wordt.

## What the user realigned
- Geen directe correcties deze sessie. Sander werkte vanuit een Cowork-sessie eerder op de dag en vroeg vervolgens in een Claude Code (terminal) sessie om de N8N-koppeling te maken — bevestigt dat Cowork en code-sessies los van elkaar geen gedeeld geheugen hebben, alleen de gedeelde repo/bestanden.

## Beslissingen

1. MCP-config opgeslagen als project-level `.mcp.json` (standaard Claude Code mechanisme voor HTTP MCP servers), niet in globale `~/.claude.json` — scoped tot dit project.
2. `.mcp.json` toegevoegd aan `.gitignore` om het bearer-token te beschermen.

## Inzichten

- Volgens `AGENTS.md` hoort het opzetten van MCP-servers/API-integraties bij Mack, niet bij Larry zelf. Deze sessie liep buiten dat protocol — Larry deed de wiring direct. Voor toekomstige MCP-koppelingen: routeer via Mack, zodat dit consistent blijft.
- Cowork (desktop app) en Claude Code (terminal) delen dezelfde repo/bestanden maar geen live sessiegeheugen — context-overdracht moet via session-logs of het bestandssysteem, niet verondersteld worden.

## Open threads

- [ ] N8N MCP-verbinding verifiëren na sessie-restart (`claude mcp list` of ToolSearch op "n8n")
- [ ] Overwegen: bij volgende MCP/integratie-vraag, route naar Mack i.p.v. Larry zelf
- [ ] Nog open van vorige sessie: `99_INBOX_Nog_Uitzoeken` opruimen (~70 PRV-bestanden)
- [ ] Nog open van vorige sessie: AppleScript-bestand verwijderen (`mediahub-run.applescript`)

## Cross-links

- [[2026-06-19-15-30_Larry_dagstart-inboxen]]
