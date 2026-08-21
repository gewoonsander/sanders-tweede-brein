---
agent_id: hermes
session_id: 7f4f46bd-6a33-4b75-b12d-5c060c0be951
timestamp: 2026-08-20T10:44:18Z
type: close-session
linked_sops: ["SOP-019-controleer-integraties-en-software"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken", "GL-014-todoist-taakformat", "GL-017-mcp-service-register", "GL-018-integratie-en-software-register", "GL-003-design-system"]
---

# Plug&Pay MCP-koppeling, gelekt Todoist-token, en Cockpit-dashboard-uitbreiding

## Context

Sander wilde Plug&Pay (en Huddle) aan een MCP-server koppelen voor zijn dartscoaching-werk. Dat groeide uit tot een lange sessie: de officiële Plug&Pay-MCP werd live gekoppeld en getest, het verwerken daarvan in het myPKA Cockpit-integratieregister triggerde een bredere security-audit die een gelekt Todoist-API-token in de publieke GitHub-historie blootlegde, en de sessie eindigde met een volledige UI-vernieuwing van de Cockpit's "Koppelingen & software"-pagina.

## Wat we deden

- **Tonnymart** onderzocht Plug&Pay's officiële MCP: scope beperkt tot pagina's/funnels/orders-zoeken, geen billing/subscription-data.
- **Daedalus** onderzocht de technische verbindingsopties (OAuth 2.1 + PKCE + Dynamic Client Registration, geen bestaande MCP-registry-vermelding), en voerde daarna de volledige GL-017/GL-018-registerronde uit: 10+ nieuwe integraties toegevoegd (waaronder `plugandpay-mcp`, `todoist-connector`, `claude-in-chrome`, vier claude.ai-connectors, Apple Podcasts), GL-018 ging van 24 naar 35 records, GL-017 van 4 naar 6 diensten.
- **Hermes** koppelde samen met Sander de officiële Plug&Pay-MCP-connector op claude.ai, bevestigde werking op beide shops (21766 "Dartbuddies.online" = boek-account, 33052 "www.dartscoaching.nl" = coachingpraktijk), begeleidde Sander via `/jip` door het roteren van het gelekte Todoist-token, verwijderde `delete-object`/`add-projects` uit de lokale Todoist-permissies en zette ze in een `deny`-blok, en breidde de GL-014-hook (`check-todoist-taakformat.py`) uit naar `update-tasks`.
- **Argus** vond een **CRITICAL**: `TODOIST_API_KEY` stond sinds commit `a1c65c9` (28-06-2026) in de git-historie van de publieke repo `gewoonsander/sanders-tweede-brein`. Leverde ook GEEL-risicobeoordelingen (GL-017) voor `plugandpay-mcp` en `todoist-connector`.
- **Bezalel** bouwde een icoon+tabelweergave voor de Koppelingen-pagina (34→35 rijen), repareerde onderweg 6 kapotte CSS-tokens (een knop was onzichtbaar in het lichte thema), en verhielp na Nemesis' QA-ronde een contrast- en een responsive-bug.
- **Nemesis** gaf eerst FAIL (contrast 4,35:1 i.p.v. 4,5:1, tabel brak op 768px), daarna definitieve **PASS** na Bezalel's fixes, inclusief een toegevoegde tabindex/aria-fix voor het zoom-scenario.
- **Harmonia** loste twee designsysteem-gaten app-breed op: nieuw token `--text-on-error`, en `--accent-marker` aangepast voor AA-contrast in het lichte thema (4,35:1 → 4,91:1) — plus een vervolgronde om tint-tokens en de hover-stap weer consistent te maken.

## Decisions made

- **Vraag:** Welke aanpak voor de Plug&Pay-AI-koppeling?
  **Decision:** De officiële MCP-connector nu gebruiken voor pagina's/funnels/orders; een eigen MCP-server voor volledige billingdata blijft optie B voor later, niet nu gebouwd.
- **Vraag:** Welke tools horen in het GL-018-integratieregister?
  **Decision:** Alleen tools die (1) een externe dienst/account raken én (2) een intrekbare, persistente toestemming hebben die stilzwijgend kan verlopen. `computer-use`/`scheduled-tasks`/`mcp-registry`/`ccd_session_mgmt` vallen daarbuiten; `Claude in Chrome` valt erbinnen (erft lopende browsersessies van Sander).
- **Vraag:** Icoon+tabelweergave als vervanging of aanvulling op de kaartweergave?
  **Decision:** Tabel wordt de standaardweergave met uitklapbare detailrijen; kaartweergave blijft bestaan achter een Lijst/Kaarten-toggle (localStorage).
- **Vraag:** Nieuw token verzinnen of bestaande tokenwaarde aanpassen voor het app-brede contrastprobleem?
  **Decision:** Bestaande waarde van `--accent-marker` aanpassen (niet een nieuw token), zodat alle 13+ bestaande call sites automatisch meeprofiteren.

## Insights

- Todoist personal API-tokens kennen geen scopes — volledige accounttoegang, geen read-only variant.
- Todoist Free heeft geen activiteitenlog (Premium-only) — beperkt wat je na een lek kan naspeuren.
- De Cockpit's `readEnvKey()` checkt `process.env` vóór `Team Knowledge/.env` voor **elke** sleutel (niet alleen de twee die `secrets-env` injecteert) — verklaart waarom een `.env`-wijziging soms geen effect lijkt te hebben als dezelfde sleutel ook via Keychain/LaunchAgent wordt geïnjecteerd (gevonden bij `FIRECRAWL_API_KEY`, die dubbel gedefinieerd bleek).
- Een claude.ai custom connector die je tijdens een lopende Cowork/Claude Code-sessie toevoegt, wordt automatisch beschikbaar in die sessie — geen herstart nodig. Loste een eerdere onzekerheid op.
- Eén Plug&Pay-login kan toegang geven tot meerdere shops (tenants) tegelijk via een `shop_id`-parameter — geen aparte OAuth-koppeling per account nodig, in tegenstelling tot wat vooraf werd aangenomen.

## Realignments

- Sander gaf tussendoor aan de openstaande beslissingen "stuk voor stuk" te willen krijgen in plaats van gebundeld — vanaf dat moment is elk GL-016-beslisblok los gepresenteerd en pas na antwoord het volgende getoond.

## Open threads

- [ ] Argus moet nog twee vragen beantwoorden over `claude-in-chrome` (kan `read_network_requests` autorisatieheaders blootleggen? klik-/typtools buiten de permissieset beschikbaar?) plus de drie server-aliassen terugbrengen tot één `service_id`, vóór GL-017 een `claude-in-chrome`-entry krijgt.
- [ ] Sander: besluit nog nemen over `github-connector` (staat op `idea`, wel of geen agenttoegang tot repositories).
- [ ] `dropbox-mcp` blijft bewust `paused` tot Sander er expliciet om vraagt.
- [ ] Daedalus: volledige toolinventaris vaststellen voor `gmail-connector`, `dropbox-connector`, `canva-connector`; checken of de Apple Podcasts-LaunchAgent ook op de Mac mini draait; `integrationChecks.js` repareren voor de drie vals-negatieve statussen (`davinci-resolve-mcp` 2×, `rclone` 1×) — ontwerp-eerst, nog niet begonnen.
- [ ] Huddle-kant van het oorspronkelijke verzoek is niet opnieuw onderzocht deze sessie — bestaande bevinding (geen community-API/MCP, wel een onofficiële e-learning-API) blijft staan, zie `[[project_huddle_dartbuddies_automatisering]]`.
- [ ] Team Inbox heeft nog onverwerkte items (screenshots/documenten) — staand punt, niet nieuw ontstaan deze sessie.
- Dagelijkse habits (bodylotion, bewegen, opdrukken, drinken, schimmelcrème) nog niet gelogd vandaag; voedingslogboek mist ontbijt en lunch — snelle close-session, dus alleen gemeld, niet uitgevraagd.

## Next steps

- Bij een volgende sessie: Argus' claude-in-chrome-vragen afronden zodat GL-017 compleet is.
- Als Sander billingdata (abonnees, mislukte incasso's, omzet) uit Plug&Pay wil bevragen: optie B oppakken (eigen MCP-server op de REST-API), design-first via SOP-development-workflow.
- Bij eerstvolgende Cockpit-UI-werk: Bezalel's kleine documentatiedrift-opmerking meenemen (codecommentaar zegt nog "34 koppelingen", is inmiddels 35).

## Cross-links

- `[[project_plugandpay_mcp_onderzoek]]` — memory met de volledige technische bevindingen over de Plug&Pay-MCP.
- `[[project_huddle_dartbuddies_automatisering]]` — de Huddle-kant van het oorspronkelijke verzoek.
- `[[2026-08-21-11-35_bezalel_generieke-sop-diagram-parser]]`, `[[2026-08-21-13-24_hermes_team-inbox-prullenbak-en-sessiestempel-hook]]`, `[[2026-08-21-13-25_hermes_dartpijlen-productpagina-darren-en-ide-thema]]` — parallelle sessies die tijdens dit werk in dezelfde repo actief waren (o.a. GL-005 Rule 5, GL-024, INDEX.md-wijzigingen die niet van deze sessie zijn).
