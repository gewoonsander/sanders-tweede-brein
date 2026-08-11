# LLM-agnostisch MCP-register — ontwerp

## Status

Ontwerp ter goedkeuring. Nog geen clientconfiguraties wijzigen.

## Doel

Eén leesbare en controleerbare bron in Sanders tweede brein vastleggen voor alle MCP-diensten, met dunne afgeleide adapters voor iedere agentruntime. De bestaande n8n-MCP wordt daarna zowel voor Claude als Codex geregistreerd. Secrets blijven buiten Git in macOS Keychain.

## Bestaande situatie

- De portable-coregrens is canoniek vastgelegd in [[GL-005-llm-agnostic-portable-core]].
- De bestaande `.mcp.json` registreert `n8n-mcp` als remote HTTP-server voor Claude.
- De endpoint-URL is niet geheim; de Authorization-header verwijst naar `${N8N_MCP_TOKEN}`.
- Codex heeft momenteel alleen `computer-use` en `node_repl`; `n8n-mcp` ontbreekt.
- `N8N_MCP_TOKEN` is na de huidige herstart niet beschikbaar in de procesomgeving.
- Er is geen Keychain-item gevonden onder de beoogde canonieke servicenaam.

## Ontwerpprincipes

1. **Eén service, meerdere clients.** Er wordt geen tweede n8n-server gebouwd.
2. **Portable definitie, afgeleide adapters.** Het register beschrijft de capability zonder clientmerken; adapters vertalen dit naar clientconfiguratie.
3. **Keychain is secret-SSOT.** Geen token in Markdown, JSON, TOML, shellprofiel of Git.
4. **Fail closed.** Ontbreekt het token, dan blijft de server uitgeschakeld en verschijnt een duidelijke fout.
5. **Geen geheime output.** Tests rapporteren alleen `present`, HTTP-status en toolnamen.
6. **Herstartbestendig.** Een login-loader haalt het token uit Keychain en publiceert uitsluitend de omgevingsvariabele aan GUI-processen.

## Aanpakken

### A — Eén gedeeld configbestand door alle clients laten lezen

Alle clients zouden rechtstreeks hetzelfde JSON/YAML-bestand moeten gebruiken.

**Voordeel:** één technisch bestand.

**Nadeel:** clients ondersteunen verschillende configuratieformaten en locaties. Chat/webclients lezen lokale bestanden niet. Dit is daardoor niet werkelijk portable.

### B — Portable register + gegenereerde clientadapters (aanbevolen)

Een host-agnostisch register in Team Knowledge beschrijft service-ID, capability, transport, endpoint, authvariabelenaam, veiligheidsniveau en healthcheck. Iedere adapter bevat alleen de client-specifieke vertaling. Een validatiescript vergelijkt adapters met het register.

**Voordelen:** sluit aan op GL-005; alle kennis blijft in de repository; één SSOT; meerdere clients kunnen naast elkaar werken; afwijkingen worden detecteerbaar.

**Nadelen:** enkele kleine adapterbestanden moeten worden onderhouden of opnieuw gegenereerd.

### C — Iedere client volledig afzonderlijk beheren

Claude, Codex en toekomstige clients krijgen handmatig hun eigen beschrijving en secrets.

**Voordeel:** snel per client.

**Nadeel:** configuratiedrift, duplicatie en onduidelijkheid over de SSOT. Afgewezen.

## Aanbevolen bestandsstructuur

```text
Team Knowledge/
├── Guidelines/GL-017-mcp-service-register.md
└── SOPs/SOP-018-registreer-mcp-service-bij-agent-runtime.md

.claude/
└── mcp-adapter.md

.codex/
└── mcp-adapter.md

~/Library/Application Support/SanderCo/mcp/
├── load-mcp-env.sh
└── validate-mcp-adapters.sh

~/Library/LaunchAgents/
└── nl.sanderco.mcp-environment.plist

macOS Keychain
└── service: sanderco-mcp-n8n
```

De scripts en LaunchAgent leven buiten de markdown-vault. Alleen de uitleg, contractspecificatie en adapters blijven in het tweede brein.

## Portable register

`GL-017` bevat per service uitsluitend generieke velden:

- `service_id`
- doel/capability
- eigenaar
- transport (`streamable-http` of `stdio`)
- niet-geheim endpoint
- naam van de secretvariabele
- authvorm
- lees-/schrijfclassificatie
- verwachte toolfamilies
- healthcheck zonder secretuitvoer
- datum laatste verificatie
- status

De portable kern noemt geen clientmerken, overeenkomstig GL-005.

## Clientadapters

### Claude-adapter

- Verwijst naar `[[GL-017-mcp-service-register]]`.
- Documenteert dat `.mcp.json` afgeleid is.
- Behoudt de bestaande remote HTTP-configuratie en `${N8N_MCP_TOKEN}`.
- Geen tokenwaarde in het bestand.

### Codex-adapter

- Verwijst naar hetzelfde register.
- Registreert dezelfde endpoint-URL via `codex mcp add n8n-mcp --url ... --bearer-token-env-var N8N_MCP_TOKEN`.
- De werkelijke clientconfiguratie blijft in de door Codex beheerde gebruikersconfig; de adapter documenteert en valideert haar.

## Secret-loading

1. Sander genereert of kopieert een n8n MCP-token buiten de chat.
2. Een interactief installatiecommando schrijft het token rechtstreeks naar Keychain-service `sanderco-mcp-n8n`; het token verschijnt niet in command history wanneer veilige stdin/invoer wordt gebruikt.
3. `load-mcp-env.sh` leest het token uit Keychain en roept `launchctl setenv N8N_MCP_TOKEN` aan.
4. Een LaunchAgent voert de loader uit bij login.
5. Al geopende agentapps moeten na de eerste installatie één keer volledig opnieuw worden gestart.

## Veiligheidsgrenzen

- Het bestaande n8n-token wordt niet uit bestanden of procesgeheugen geëxtraheerd.
- Als het token niet meer beschikbaar is, maakt Sander in n8n een nieuw token en wordt het oude ingetrokken.
- Scripts loggen nooit stdout van `security find-generic-password -w`.
- Het Keychain-account gebruikt Sanders lokale accountnaam; servicenaam is stabiel en gedocumenteerd.
- Rechten van loader en plist worden gecontroleerd; loader is alleen door Sander schrijfbaar.
- n8n-schrijftools blijven onder normale clientbevestiging vallen.

## Validatie

Na implementatie moeten deze feiten aantoonbaar zijn:

1. Portable-core-audit slaagt.
2. `.mcp.json` bevat geen literal bearer-token.
3. Codex toont `n8n-mcp` als enabled.
4. Beide clients gebruiken exact dezelfde endpoint-URL en env-varnaam.
5. Keychain-item bestaat, zonder de waarde te tonen.
6. Na loader-run bestaat `N8N_MCP_TOKEN` in de launchd-omgeving, zonder de waarde te tonen.
7. Nieuwe clientsessies kunnen de n8n-tools inventariseren.

## Implementatiepoort

De documentatie, adapters en loader kunnen zonder token worden gebouwd en getest. Voor de laatste live-verificatie moet Sander zelf het n8n-token veilig in Keychain invoeren of een nieuw token genereren. Hermes vraagt het token nooit in de chat.
