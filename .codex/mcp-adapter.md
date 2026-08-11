# MCP adapter — Codex

Deze adapter is afgeleid van [[GL-017-mcp-service-register]]. De portable service-definitie is leidend; de door Codex beheerde gebruikersconfiguratie bevat alleen de runtimevertaling.

## n8n-mcp

Registratievorm:

```bash
codex mcp add n8n-mcp \
  --url 'https://gewoonsander.app.n8n.cloud/mcp-server/http' \
  --bearer-token-env-var N8N_MCP_TOKEN
```

- Endpoint en env-varnaam moeten overeenkomen met GL-017.
- Het token staat in macOS Keychain en wordt door de gedeelde loader in de procesomgeving geplaatst.
- Geen literal bearer-token in Codexconfiguratie zetten.

## Laden

Na installatie of tokenrotatie:

1. voer de gedeelde loader uit;
2. sluit de Codex-app volledig af;
3. start de app opnieuw;
4. open een nieuwe sessie;
5. controleer `codex mcp get n8n-mcp` en inventariseer de tools;
6. voer eerst een read-only workflowlijst uit.

## Validatie

```bash
codex mcp get n8n-mcp
codex mcp list
```

Canonieke procedure: [[SOP-018-registreer-mcp-service-bij-agent-runtime]].
