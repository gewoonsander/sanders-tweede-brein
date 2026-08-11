# Implementatieplan — LLM-agnostisch MCP-register

## Doel en constraints

Eén portable MCP-serviceregister maken en de bestaande remote n8n-MCP daaruit voor Claude en Codex registreren.

Constraints:

- Team Knowledge blijft provider- en clientagnostisch conform [[GL-005-llm-agnostic-portable-core]].
- Geen tokens in Git, Markdown, JSON, TOML, shellhistory of tooloutput.
- macOS Keychain is de enige secret-SSOT.
- De bestaande `.mcp.json` wordt behouden en alleen veilig gedocumenteerd/gevalideerd.
- Codex krijgt dezelfde endpoint-URL en env-varnaam.
- Zonder Keychain-item mag geen loader een lege of oude tokenwaarde publiceren.
- Een bestaande n8n-configuratie wordt niet overschreven zonder voorafgaande read-only controle.

## Bestandskaart

### In het tweede brein

| Bestand | Actie | Doel |
|---|---|---|
| `Team Knowledge/Guidelines/GL-017-mcp-service-register.md` | nieuw | Portable SSOT van MCP-diensten; geen clientnamen |
| `Team Knowledge/SOPs/SOP-018-registreer-mcp-service-bij-agent-runtime.md` | nieuw | Generieke registratie- en verificatieprocedure |
| `Team Knowledge/Guidelines/INDEX.md` | wijzigen | GL-017 vindbaar maken |
| `Team Knowledge/SOPs/INDEX.md` | wijzigen | SOP-018 vindbaar maken |
| `.claude/mcp-adapter.md` | nieuw | Afgeleide Claude-instructie en validatiepunten |
| `.codex/mcp-adapter.md` | nieuw | Afgeleide Codex-instructie en validatiepunten |

### Buiten het tweede brein

| Bestand | Actie | Doel |
|---|---|---|
| `~/Library/Application Support/SanderCo/mcp/load-mcp-env.sh` | nieuw | Token uit Keychain naar launchd-omgeving laden |
| `~/Library/Application Support/SanderCo/mcp/install-n8n-token.sh` | nieuw | Token interactief en zonder echo/history in Keychain plaatsen |
| `~/Library/Application Support/SanderCo/mcp/validate-mcp-adapters.sh` | nieuw | Adapter-, Keychain- en omgevingscontrole zonder secretuitvoer |
| `~/Library/LaunchAgents/nl.sanderco.mcp-environment.plist` | nieuw | Loader bij login uitvoeren |
| `~/.codex/config.toml` | door Codex CLI wijzigen | Remote n8n-MCP registreren |

## Taak 1 — Portable register testgedreven toevoegen

1. Maak GL-017 met service-ID `n8n-mcp`, capability, eigenaar, transport, endpoint, authvorm, `N8N_MCP_TOKEN`, risicoklasse, healthcheck en verificatiedatum.
2. Gebruik uitsluitend host-agnostische termen.
3. Voeg GL-017 aan de Guidelines-index toe.

**Verificatie**

```bash
rg -n 'n8n-mcp|streamable-http|N8N_MCP_TOKEN' 'Team Knowledge/Guidelines/GL-017-mcp-service-register.md'
bash validation-script.sh .
```

Verwacht: registervelden gevonden en portable-core-audit groen.

## Taak 2 — Generieke registratie-SOP toevoegen

1. Maak SOP-018 met discovery, securityreview, adapterrendering, secretinstallatie, registratie, herstart en verificatie.
2. Beschrijf capabilities en runtime-adapters zonder productnamen.
3. Voeg SOP-018 aan de SOP-index toe.

**Verificatie**

```bash
rg -n 'Keychain|adapter|healthcheck|rollback' 'Team Knowledge/SOPs/SOP-018-registreer-mcp-service-bij-agent-runtime.md'
bash validation-script.sh .
```

Verwacht: procedure compleet en audit groen.

## Taak 3 — Clientadapters documenteren

1. Maak `.claude/mcp-adapter.md` met verwijzing naar GL-017, bestaand `.mcp.json`-pad, env-varvereiste, restart en verificatie.
2. Maak `.codex/mcp-adapter.md` met verwijzing naar GL-017, CLI-registratie, gebruikersconfig, restart en verificatie.
3. Dupliceer geen token, endpointmetadata of operationele contracten; verwijs naar het register.

**Verificatie**

```bash
rg -n 'GL-017-mcp-service-register|N8N_MCP_TOKEN' .claude/mcp-adapter.md .codex/mcp-adapter.md
```

Verwacht: beide adapters verwijzen naar dezelfde SSOT en env-varnaam.

## Taak 4 — Keychain-installatie en loader bouwen

1. Maak buiten de vault de applicatiemap met rechten `700`.
2. Bouw `install-n8n-token.sh` met verborgen interactieve invoer (`read -s`), dubbele invoercontrole en `security add-generic-password -U`.
3. Bouw `load-mcp-env.sh`: Keychain-read naar lokale variabele; leeg/missing faalt; `launchctl setenv` zonder echo.
4. Bouw een LaunchAgent die de loader bij login uitvoert.
5. Bestanden krijgen minimaal benodigde rechten; geen logbestand met tokeninhoud.

**Verificatie zonder echt token**

```bash
sh -n "$HOME/Library/Application Support/SanderCo/mcp/"*.sh
plutil -lint "$HOME/Library/LaunchAgents/nl.sanderco.mcp-environment.plist"
```

Verwacht: shells en plist syntactisch geldig.

## Taak 5 — Veilige validatiescript bouwen

Controleer zonder waarden te tonen:

- GL-017 bestaat;
- Claude-adapter en `.mcp.json` bestaan;
- `.mcp.json` gebruikt `${N8N_MCP_TOKEN}`;
- Codex-adapter bestaat;
- Codexregistratie bestaat;
- Keychain-item bestaat;
- launchd-env bestaat;
- endpoint-URL's hebben dezelfde hash;
- geen literal Authorization-token in getrackte bestanden.

**Verificatie**

```bash
sh -n "$HOME/Library/Application Support/SanderCo/mcp/validate-mcp-adapters.sh"
```

Verwacht: geldige shell; vóór secretinstallatie duidelijke `MISSING`, nooit een tokenwaarde.

## Taak 6 — Codexregistratie aanmaken

1. Lees eerst `codex mcp get n8n-mcp`; alleen toevoegen wanneer hij ontbreekt.
2. Lees endpoint uit het portable register of de bestaande afgeleide Claude-config zonder Authorization-waarde te tonen.
3. Registreer met:

```bash
codex mcp add n8n-mcp --url '<endpoint>' --bearer-token-env-var N8N_MCP_TOKEN
```

4. Controleer `codex mcp get n8n-mcp` en `codex mcp list`.

Verwacht: `n8n-mcp` bestaat, enabled, remote HTTP, token uit env-var.

## Taak 7 — Veilige tokeninvoer door Sander

1. Daedalus toont het exacte lokale installatiecommando.
2. Sander voert het script zelf in Terminal uit.
3. Sander plakt het token uitsluitend in de verborgen prompt, nooit in de chat.
4. Loader wordt uitgevoerd en LaunchAgent geladen.
5. Sander herstart Claude en Codex volledig.

**Verificatie**

```bash
"$HOME/Library/Application Support/SanderCo/mcp/validate-mcp-adapters.sh"
```

Verwacht: Keychain en env `PRESENT`; geen waarde zichtbaar.

## Taak 8 — Eindverificatie en rollback

1. Draai portable-core-audit.
2. Draai adaptervalidator.
3. Controleer Git-diff op secrets.
4. Open nieuwe clientsessies en inventariseer n8n-tools.
5. Bij fout: verwijder alleen de nieuwe Codexregistratie en unload de LaunchAgent; behoud Keychain-item totdat Sander expliciet verwijdering goedkeurt.

**Verificatie**

```bash
bash validation-script.sh .
git diff --check
git grep -n -E 'Bearer [A-Za-z0-9._-]{20,}|N8N_MCP_TOKEN=.+'
```

Verwacht: audits groen en geen literal secrets.

## Stopconditie

De implementatie kan zelfstandig doorlopen tot en met de documentatie, scripts, LaunchAgent en Codexregistratie. Daarna pauzeert Daedalus voor Sanders verborgen tokeninvoer. Zonder die stap kan configuratie wel correct zijn, maar live n8n-toegang niet worden bevestigd.
