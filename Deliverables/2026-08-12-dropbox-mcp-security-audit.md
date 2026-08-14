---
key_element: groei
---

# Securityaudit — portable Dropbox MCP

## Verdict

**CONDITIONAL PASS.** Lokale implementatie en tests slagen. Activering wacht op OAuth en een end-to-end test in een tijdelijke Dropbox-map.

## Bewijs

- Geen credentials in code, PKA, adapters of logs; secrets komen uit macOS Keychain.
- Geen vrije API-passthrough, permanent-delete-tool of rootverwijdering.
- Maximaal 100 mutaties per manifest; manifest verloopt na 15 minuten en is ondertekend.
- Goedkeuring vindt buiten MCP plaats en uitvoering is eenmalig.
- Uitvoering stopt bij de eerste fout en rapporteert gedeeltelijk resultaat.
- Vier contracttests slagen; dependency-audit meldt nul kwetsbaarheden.

## Herstelde HIGH-bevinding

De eerste versie liet een agent zijn eigen preview teruggeven aan de uitvoeringstool en stond replay toe. Dit is vervangen door een lokale state store en afzonderlijke menselijke goedkeuringshandeling buiten MCP. Regressietests bewijzen dat uitvoering vóór goedkeuring en replay falen.

## Open vóór activering

1. Benodigde Dropbox-scopes definitief vaststellen.
2. OAuth-PKCE, refresh en intrekking bewijzen.
3. Provider-mutaties uitsluitend in een tijdelijke testmap testen.
4. Beide runtime-adapters tegen exact dezelfde toolinventaris verifiëren.

## Gerelateerd

- [[GL-017-mcp-service-register]]
- [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
- [[2026-08-12-dropbox-cloud-mcp-design]]
