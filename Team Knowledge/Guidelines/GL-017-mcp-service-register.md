---
id: GL-017
title: MCP service register
status: active
owner: daedalus
last_verified: 2026-08-21
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

### plugandpay-mcp

| Veld | Waarde |
|---|---|
| `service_id` | `plugandpay-mcp` |
| Doel | Agenttoegang tot beide Plug&Pay-shops: orders, checkouts, producten, formulieren en promoties opzoeken, en pagina's, funnels en checkouts bouwen, wijzigen, publiceren of verwijderen |
| Eigenaar | Daedalus (koppeling), Tonnymart (gebruik) |
| Status | active |
| Transport | Remote HTTP, volledig cloud-managed als claude.ai custom connector. Geen lokale `.mcp.json`-entry, geen lokaal proces |
| Endpoint | `https://mcp.plugandpay.com/mcp` |
| Herkomst | Officiële Plug&Pay-server, live sinds 2026-08-20. Docs: help.plugandpay.com/nl/articles/16097982-plug-pay-koppelen-aan-claude |
| Authenticatie | OAuth 2.1 + PKCE + Dynamic Client Registration. Enige scope: `mcp:use` — er bestaat geen read-only of per-tool scope |
| Secretvariabele | n.v.t. — tokens leven bij claude.ai, niet op een apparaat |
| Secret store | n.v.t. Geen LastPass-back-up nodig of mogelijk |
| Tenantmodel | Eén login geeft toegang tot twee shops tegelijk. Elke tool vereist een expliciete `shop_id`: 21766 = "Dartbuddies.online" (boek-account, plan lite) en 33052 = "www.dartscoaching.nl" (coachingpraktijk, plan premium) |
| Risicoklasse | hoog — kan live betaalpagina's en checkouts van twee bedrijven publiceren, wijzigen en verwijderen, plus custom scripts injecteren. `mcp:use` is één alles-of-niets-scope, dus de schrijfrechten zijn niet in te perken bij de bron |
| Goedkeuringsmodel | "Needs approval" is een client-side instelling in de claude.ai Connectors-UI. Geen bekende server-side afdwinging. In een lokale agentruntime geldt die instelling niet — daar bepaalt `.claude/settings.json` het |
| Schrijfbeleid | Alle schrijftools blijven bevestigingsplichtig per aanroep, zonder uitzondering. Geen enkele Plug&Pay-tool wordt aan een `permissions.allow`-lijst toegevoegd. Leestools (list-shops, search, retrieve-*, list-*, authenticated-user) mogen vrij |
| shop_id-beleid | (1) Verplichte pre-flight: vóór elke schrijfsessie eerst `list-shops`, en de agent noemt in het bevestigingsverzoek shop_id én shopnaam letterlijk. (2) Nooit een default shop_id of een shop_id uit eerdere context hergebruiken zonder herbevestiging. (3) Eén shop per opdracht. (4) Schrijfacties op 33052 (live coachingpraktijk) krijgen een zwaardere bevestiging dan op 21766 |
| Verboden capabilities | delete-page, remove-block, remove-custom-script en clone-resource zonder voorafgaande, gedateerde vastlegging van wat er verdwijnt. add-custom-script/update-custom-script vereisen altijd dat Sander de scriptinhoud eerst zelf leest. Nooit een schrijfactie op een shop die niet in de opdracht genoemd staat |
| Verwachte capabilities | Lezen: shops, orders, checkouts, pagina's, producten, media, blok-templates, authoring guide. Schrijven: pagina's/funnels/checkouts bouwen, blokken beheren, media uploaden, afbeeldingen genereren, custom scripts beheren |
| Healthcheck | `list-shops` read-only aanroepen; hoort exact twee shops te geven, 21766 en 33052. Daarna `authenticated-user`. Geen enkele schrijftool in de healthcheck. Aanvullend, lokaal: `grep -c "d6292a44\|plugandpay" .claude/settings.json .claude/settings.local.json` hoort 0 te blijven |
| Revocatie | claude.ai → Instellingen → Connectors → disconnect. Geen tweede intrekpad op een apparaat |
| Securityreview | Argus, 2026-08-21: geel — bruikbaar mits voorwaarden |
| Laatst geverifieerd | 2026-08-20 — orders zoeken werkend op beide shops; geen schrijfactie ooit uitgevoerd |

### todoist-connector

| Veld | Waarde |
|---|---|
| `service_id` | `todoist-connector` |
| Doel | Agenttoegang tot Todoist: taken zoeken en filteren, en taken aanmaken, bijwerken en afronden. Niet te verwarren met `todoist-api`, de aparte read-only API-key-koppeling van de Cockpit |
| Eigenaar | Daedalus |
| Status | active |
| Transport | Standaard claude.ai-connector, cloud-managed. Server-uuid `038b67df-1277-4cd5-b6e4-150bccb71b78`. Geen lokale `.mcp.json`-entry |
| Endpoint | Door claude.ai beheerd |
| Authenticatie | OAuth, gebonden aan Sanders claude.ai-account |
| Secretvariabele | n.v.t. — geen lokaal secret. Let op: `todoist-api` heeft dat wél (`TODOIST_API_KEY`, opgeslagen in `Team Knowledge/.env`, zojuist geroteerd na een lek — zie sessienotitie) en is een aparte draad |
| Risicoklasse | midden — raakt geen betaal- of klantdata, maar kan de operationele takenlijst van twee bedrijven en het gezin herschrijven. Deels onomkeerbaar (delete-object), en bulk-capabel |
| Schrijfbeleid | add-tasks, update-tasks en complete-tasks mogen zonder tussentijdse bevestiging binnen een expliciet gevraagde opdracht en bij maximaal 5 taken per aanroep. Boven die grens, of bij een aanroep die niet één-op-één uit Sanders verzoek volgt, geldt bevestigingsplicht met een opsomming van de geraakte taken vooraf |
| Verboden capabilities | delete-object en add-projects staan niet in enige permissions.allow-lijst en horen in een deny-blok. Taken worden afgerond, nooit verwijderd |
| GL-014-conventie | Elke aanmaak- of wijzigingsactie respecteert GL-014-todoist-taakformat. `add-tasks` wordt mechanisch bewaakt door de PreToolUse-hook `.claude/hooks/check-todoist-taakformat.py`; die hook dekt `update-tasks` niet — tot de matcher is uitgebreid is dat een menselijke controle |
| Bulk- en routeringsbeleid | Nooit een update-tasks/complete-tasks op een filterresultaat dat niet eerst per taak getoond is. Bij projecttoewijzing altijd eerst find-projects, routeer op de canonieke koppeling, nooit op naamgelijkenis |
| Verwachte capabilities | Circa 50 tools, waarvan ~22 lezend en drie toegestane schrijftools. Volledige inventaris lokaal niet vastgesteld — alleen de 27 toolnamen in de allow-lijsten zijn geverifieerd |
| Healthcheck | `user-info` plus `find-projects` read-only. Nooit een testtaak aanmaken. Aanvullend: controleer dat delete-object en add-projects niet in `.claude/settings.json` of `.claude/settings.local.json` staan |
| Revocatie | claude.ai → Instellingen → Connectors → disconnect. Trekt `todoist-api` niet in — die sleutel apart in Todoist revoken |
| Securityreview | Argus, 2026-08-21: geel — bruikbaar mits voorwaarden. Openstaand: delete-object/add-projects staan pre-approved in settings.local.json (zie blok 11, nog niet besloten); GL-014-hook dekt update-tasks niet. **Opvolging 2026-08-21 (Daedalus):** het eerste punt is afgehandeld — beide tools staan in geen enkele lijst van `settings.local.json` meer en zitten nu in het `permissions.deny`-blok van `settings.json`; zelfstandig nagemeten, niet op melding aangenomen. Het hook-punt staat nog open |
| Laatst geverifieerd | 2026-08-21 — schrijftools aantoonbaar aanwezig in de lokale permissieset; geen live aanroep tijdens de review |

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
- Op macOS levert de LaunchAgent `nl.gewoonsander.secrets-env` de tokens aan de sessie: hij leest ze bij het inloggen uit de Keychain (`security find-generic-password`) en zet ze met `launchctl setenv` in het GUI-sessiedomein. Het gaat nu om `FIRECRAWL_API_KEY` en `N8N_MCP_TOKEN`. De Keychain blijft de runtimebron; deze agent is uitsluitend het doorgeefluik.
- De agent draait alleen `RunAtLoad`, zonder interval. Een rotatie in de Keychain bereikt de sessie dus pas na opnieuw inloggen of nadat de agent handmatig opnieuw is gestart. Tot dat moment blijft elke draaiende runtime het oude token gebruiken, zonder foutmelding.
- `launchctl setenv` werkt alleen vooruit: processen die al draaiden houden hun eigen kopie van de omgeving. Na een rotatie moeten dus zowel de agent opnieuw draaien als de betrokken processen (agentruntime, Cockpit) opnieuw worden gestart. Eén van beide is niet genoeg.
- Staat dezelfde variabele ook in `Team Knowledge/.env`, dan wint de geïnjecteerde waarde: de resolver leest eerst `process.env` en pas daarna het bestand. Dat geldt nu voor `FIRECRAWL_API_KEY`. Roteer daarom altijd in de Keychain en nooit alleen in `.env` — een wijziging daar lijkt te slagen maar heeft geen enkel effect zolang de injectie actief is.

## Referenties

- [[GL-005-llm-agnostic-portable-core]]
- [[SOP-018-registreer-mcp-service-bij-agent-runtime]]
