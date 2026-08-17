---
id: GL-017
title: MCP service register
status: active
owner: daedalus
last_verified: 2026-08-17
---

# GL-017 — MCP service register

Dit is de single source of truth voor externe MCP-diensten die agentruntimes bij Sanders myPKA mogen aansluiten. Runtime-specifieke adapters zijn afgeleiden en verwijzen altijd naar dit register. De scheiding tussen portable kern en adapters volgt [[GL-005-llm-agnostic-portable-core]].

## Regels

1. Eén externe dienst heeft één `service_id`, ongeacht het aantal aangesloten runtimes.
2. Het register bevat nooit een secretwaarde; uitsluitend de naam van de benodigde secretvariabele.
3. Secrets leven in de secret store van het besturingssysteem.
4. Endpoint, transport, capabilities en veiligheidsclassificatie zijn canoniek in dit register.
5. Een runtime-adapter mag de configuratie vertalen, maar het operationele contract niet dupliceren of wijzigen.
6. Ontbrekende authenticatie faalt gesloten; nooit terugvallen op anonieme of hardcoded toegang.
7. Nieuwe of gewijzigde schrijftools worden opnieuw beoordeeld voordat ze gebruikt worden.
8. LastPass is de centrale versleutelde back-up- en overdrachtskluis voor MCP-tokens. De lokale secret store van ieder apparaat blijft de runtimebron; tokens worden nooit vanuit het tweede brein geladen.

## Services

### n8n-mcp

| Veld | Waarde |
|---|---|
| `service_id` | `n8n-mcp` |
| Doel | Workflows inventariseren, inspecteren, maken en beheren binnen Sanders n8n-omgeving |
| Eigenaar | Daedalus |
| Status | active |
| Transport | `streamable-http` |
| Endpoint | `https://gewoonsander.app.n8n.cloud/mcp-server/http` |
| Authenticatie | Bearer-token uit runtimeomgeving |
| Secretvariabele | `N8N_MCP_TOKEN` |
| Secret store | macOS Keychain, service `sanderco-mcp-n8n` |
| Versleutelde back-up | LastPass; uitsluitend voor herstel en installatie op een apparaat |
| Risicoklasse | hoog — kan externe workflows en automatiseringen wijzigen |
| Schrijfbeleid | alleen binnen expliciet gevraagde scope; destructieve of publicerende acties blijven bevestigingsplichtig |
| Verwachte capabilities | workflow search/read/create/update; uitvoering en activatie alleen wanneer de server die tools aanbiedt |
| Healthcheck | server registreren, toolinventaris ophalen, een read-only workflowlijst uitvoeren; nooit tokenwaarde loggen |
| Laatst geverifieerd | 2026-08-11 |

### firecrawl-mcp

| Veld | Waarde |
|---|---|
| `service_id` | `firecrawl-mcp` |
| Doel | Webinhoud read-only ophalen wanneer directe webtoegang onvoldoende is |
| Eigenaar | Daedalus |
| Status | active |
| Transport | `stdio` via de runtime-adapter |
| Endpoint | Door de officiële adapter beheerd; niet dupliceren in de portable kern |
| Authenticatie | API-key uit runtimeomgeving |
| Secretvariabele | `FIRECRAWL_API_KEY` |
| Secret store | Lokale OS-secretstore per apparaat |
| Versleutelde back-up | LastPass; uitsluitend voor herstel en installatie op een apparaat |
| Risicoklasse | midden — externe webinhoud verlaat de gevraagde bron en wordt door een derde dienst verwerkt |
| Schrijfbeleid | geen publicatie- of mutatierechten; alleen ophalen binnen de gevraagde scope |
| Verwachte capabilities | webpagina ophalen en machineleesbare inhoud retourneren |
| Healthcheck | registratie en secret-aanwezigheid controleren; daarna één openbare pagina read-only ophalen |
| Laatst geverifieerd | 2026-08-11 |

### dropbox-mcp

| Veld | Waarde |
|---|---|
| `service_id` | `dropbox-mcp` |
| Doel | Alle Dropbox-bestanden cloud-native lezen en uitsluitend via goedgekeurde batches wijzigen |
| Eigenaar | Daedalus |
| Status | built-awaiting-oauth |
| Transport | `stdio` naar één lokale portable server |
| Authenticatie | OAuth 2.0 met PKCE en offline refresh token |
| Content access | `Full Dropbox` |
| Secret store | macOS Keychain; gescheiden app-key, refresh-token en batchsigneringssleutel |
| Risicoklasse | zeer hoog |
| Schrijfbeleid | preview plus eenmalige menselijke goedkeuring buiten MCP; geen root-delete of permanent wissen |
| Verwachte capabilities | search/list/metadata/download; preview mutation batch; execute externally approved batch once |
| Verboden capabilities | vrije API-passthrough, permanent wissen, autonome goedkeuring, replay en standaard publieke links |
| Healthcheck | toolinventaris, accountmetadata, rootlisting en testbatch in tijdelijke map |
| Laatst geverifieerd | lokaal contract 2026-08-12; OAuth nog open |

### davinci-resolve

| Veld | Waarde |
|---|---|
| `service_id` | `davinci-resolve` |
| Doel | DaVinci Resolve Studio aansturen vanuit een agentruntime: media importeren, timelines bouwen, retimen, graden, Fusion-composities opbouwen en renderen |
| Eigenaar | Stephan Speelberg (gebruik), Daedalus (koppeling) |
| Status | active |
| Transport | `stdio` naar een lokale Python-server; geen netwerklistener |
| Endpoint | Lokaal: `~/Tools/davinci-resolve-mcp/venv/bin/python ~/Tools/davinci-resolve-mcp/src/server.py` |
| Herkomst | `samuelgursky/davinci-resolve-mcp`, MIT, derde partij — geen myICOR-Expansion |
| Authenticatie | Geen. De server praat met een lokaal draaiende Resolve-instantie via de Blackmagic scripting-API |
| Secretvariabele | n.v.t. — deze dienst heeft geen token |
| Servermodus | **compound (35 tools)**. De granulaire modus (`--full`, 353 tools) niet inschakelen: die vult het contextvenster zonder functionele winst |
| Vereisten | DaVinci Resolve **Studio** (externe scripting is sinds Resolve 19.1 Studio-only), Resolve draait op dezelfde machine, Preferences → System → General → External scripting using = **Local** |
| Risicoklasse | hoog — draait met Sanders volledige gebruikersrechten, kan buiten Resolve-projectmappen lezen en schrijven, en kan renders starten |
| Schrijfbeleid | Montage-, kleur- en renderacties binnen een expliciet gevraagde opdracht mogen zonder tussentijdse bevestiging. Verwijderen van clips of timelines, overschrijven van bestaand bronmateriaal en het installeren van `script_plugin`/`dctl`/`fuse_plugin`-bestanden blijven bevestigingsplichtig |
| Telemetrie | Uitgezet via `DAVINCI_RESOLVE_MCP_UPDATE_CHECK=0`. Zonder die variabele doet de server één GET per 24 uur naar de GitHub releases-API — geen projectdata, geen machine-identifiers (vastgesteld door Argus) |
| Securityreview | Argus, 2026-08-17: **geel — installeerbaar mits voorwaarden**. Geen `eval`/`exec`/`os.system`/`pickle.loads`, nergens `shell=True`, geen secrets, geen typosquats, geen netwerklistener in de standaardserver. Restrisico: brede bestandssysteemtoegang (inherent aan de functie) en losse dependencypins (`>=`, geen lockfile) |
| Healthcheck | Resolve starten, dan `resolve_control` aanroepen; `GetProductName()` hoort `DaVinci Resolve Studio` terug te geven. Faalt de verbinding, dan draait Resolve niet of staat scripting niet op Local |
| Laatst geverifieerd | 2026-08-17 — MCP-handshake geslaagd, 35 tools, Resolve Studio 20.3.2.9 |

## Adaptercontract

Elke runtime-adapter controleert minimaal:

- exact dezelfde `service_id`;
- exact het endpoint- of pakketcontract uit de betreffende servicetabel;
- transport compatibel met het transport uit die servicetabel;
- authenticatie uitsluitend via de genoemde secretvariabele;
- geen literal Authorization-waarde;
- status enabled pas nadat de healthcheck slaagt;
- herstart- of reloadstap indien de runtime configuratie alleen bij start laadt.

## Secret lifecycle

- Bewaar een actuele herstelkopie in LastPass onder een herkenbare naam, zonder de waarde in documentatie of gesprekken te kopiëren.
- Installeer het token vanuit LastPass afzonderlijk in de lokale secret store van ieder apparaat dat toegang nodig heeft.
- Installeren of roteren gebeurt interactief buiten gesprekken en zonder echo.
- Na rotatie wordt de oude token bij de provider ingetrokken.
- Validatie toont uitsluitend `PRESENT`, `MISSING` of een statuscode.
- Verwijdering uit Keychain vereist expliciete toestemming omdat herstel anders een nieuw providertoken vereist.

## Referenties

- [[GL-005-llm-agnostic-portable-core]]
- [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
