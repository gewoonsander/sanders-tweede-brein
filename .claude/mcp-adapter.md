# MCP adapter — Claude

Deze adapter is afgeleid van [[GL-017-mcp-service-register]]. De portable service-definitie is leidend; `.mcp.json` bevat alleen de Claude-specifieke vertaling.

## n8n-mcp

- Configuratiebestand: `.mcp.json`
- Transport: remote HTTP
- Endpoint: neem exact over uit GL-017
- Authenticatie: header `Authorization: Bearer ${N8N_MCP_TOKEN}`
- Secretbron: macOS Keychain via de gedeelde environment-loader
- Nooit een literal token in `.mcp.json` zetten

## Laden

Claude-apps lezen GUI-omgevingsvariabelen bij processtart. Na installatie of rotatie van het Keychain-item:

1. voer de gedeelde loader uit;
2. sluit de Claude-app volledig af;
3. start de app opnieuw;
4. open een nieuwe sessie in deze workspace;
5. controleer dat `n8n-mcp` tools aanbiedt en voer eerst een read-only workflowlijst uit.

## Validatie

```bash
jq '.mcpServers["n8n-mcp"] | {type, url, header_names: (.headers|keys)}' .mcp.json
```

De output mag de headernaam tonen, nooit de opgeloste tokenwaarde.

Canonieke procedure: [[SOP-018-registreer-mcp-service-bij-agent-runtime]].

## dropbox-mcp

Registreer pas na OAuth-setup:

```bash
claude mcp add dropbox-mcp --scope project -- node /Users/sandervanockenburg-zwaan/Documents/sander-projects/dropbox-mcp/src/server.mjs
```

Verifieer eerst alleen rootmetadata. Mutatiegoedkeuring gebeurt buiten MCP.
