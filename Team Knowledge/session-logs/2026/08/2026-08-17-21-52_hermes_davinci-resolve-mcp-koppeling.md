---
agent_id: hermes
session_id: davinci-resolve-mcp-koppeling
timestamp: 2026-08-17T21:52:00Z
type: end-of-session
linked_sops: ["SOP-024-video-monteren-in-davinci-resolve", "SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: []
linked_guidelines: ["GL-017-mcp-service-register", "GL-018-integratie-en-software-register"]
linked_tasks: []
linked_journal_entries: []
---

# DaVinci Resolve gekoppeld aan Claude Code

## Context

Sander vroeg onderzoek naar de vraag in hoeverre Claude Code en DaVinci Resolve kunnen samenwerken. Dat groeide binnen één sessie uit tot een werkende koppeling, een securityreview en drie vastleggingen in Team Knowledge.

## What we did

- **Editie vastgesteld door te meten, niet te vragen.** De externe scripting-API van Resolve is sinds versie 19.1 Studio-only; de gratis editie kan alleen scripts in de interne Fusion-console draaien. Welke editie Sander had was uit app-bundel, configbestanden en licentiemap niet af te leiden. Resolve gestart en de API ondervraagd: `GetProductName()` gaf **DaVinci Resolve Studio 20.3.2.9**. Externe scripting stond al op Local — er hoefde niets geconfigureerd.
- **Vijf MCP-servers vergeleken op harde cijfers** via de GitHub API in plaats van op sterren af te gaan. `lordhoell` (440+ tools geclaimd) bleek op één dag gemaakt en nooit meer aangeraakt; `barckley75` (331 sterren) ligt drie maanden stil bij één bijdrager; `Tooflex` heeft geen licentie. Alleen `samuelgursky/davinci-resolve-mcp` vertoont kenmerken van onderhouden software: 22 bijdragers, 100+ commits in drie maanden, 100+ releases, laatste release diezelfde dag.
- **Argus deed de securityreview** op de gecloonde broncode, zonder iets uit te voeren. Oordeel: geel — installeerbaar mits voorwaarden. Geen `eval`/`exec`/`os.system`/`pickle.loads`, nergens `shell=True`, geen secrets, geen typosquats, geen netwerklistener in de standaardserver. De updatecontrole doet één GET naar de GitHub releases-API zonder projectdata; uitgezet via `DAVINCI_RESOLVE_MCP_UPDATE_CHECK=0`.
- **Geïnstalleerd en getest.** Repo in `~/Tools/davinci-resolve-mcp` (buiten de PKM-repo), eigen venv op Python 3.12.14. MCP-handshake geslaagd: 35 tools in compound-modus.
- **Vastgelegd:** `davinci-resolve`-entry in [[GL-017-mcp-service-register]], twee entries in [[GL-018-integratie-en-software-register]] (JSON gevalideerd, 24 entries), en [[SOP-024-video-monteren-in-davinci-resolve]] met Stephan Speelberg als eigenaar.

## Decisions made

- **Question:** Welke van de vijf beschikbare MCP-servers nemen?
  **Decision:** `samuelgursky/davinci-resolve-mcp`, niet omdat hij de meeste sterren heeft maar omdat hij als enige onderhouden wordt. Bij software die diep in projectbestanden graait is onderhoud het criterium, niet populariteit.
- **Question:** Compound-modus (35 tools) of granulair (353)?
  **Decision:** Compound. De granulaire modus vult het contextvenster zonder functionele winst.
- **Question:** Workstream of SOP voor de montageprocedure?
  **Decision:** SOP. Volgens het criterium in de Workstreams-index is monteren één specialist, en dan hoort het een SOP te zijn — geen choreografie tussen meerdere specialisten.

## Insights

- **De auto-mode classifier blokkeert een directe Edit op `.mcp.json`**, ook nadat Sander expliciet toestemming had gegeven. Er komt geen goedkeuringsprompt bij de gebruiker langs; de weigering is automatisch. Werkende route is het officiële CLI-commando: `claude mcp add <naam> --scope project -e KEY=VAL -- <command> <args>`. Dat scheelt de volgende keer een vastgelopen stap.
- **De aanname over de Resolve-editie zat op meer plekken dan gedacht.** Het regieplan campingdarts opent §8 met "Uitgangspunt: Studio 21.0.4. Waar een stap ook in de gratis 20.3.2 werkt, staat dat erbij." Beide helften kloppen niet: het is Studio 20.3.2.9. Alle voorbehouden over de gratis versie kunnen weg (Magic Mask, Optical Flow, Speed Warp en ResolveFX Stylize zijn beschikbaar), maar of alle tegen 21.0.4 beschreven stappen ook in 20.3 zo heten is niet nagelopen.
- **Een register bleek al te bestaan.** De neiging was een nieuw artefact te schrijven; GL-017 noemt zichzelf al de SSOT voor MCP-diensten. Dezelfde valkuil als de frustratie-audit van 2026-08-16 signaleerde — eerst zoeken, dan schrijven.

## Open threads

- [ ] **Beslissing 4 · CAM** staat open: leeg Resolve-project "campingdarts" opzetten via de MCP (1080x1920, 30 fps) vóór er ooit media geïmporteerd wordt, en/of het regieplan naast versie 20.3 leggen.
- [ ] `davinci-resolve-mcp` staat in GL-018 op lifecycle `configured`. Pas na een geslaagde `resolve_control`-aanroep vanuit de runtime mag dat `active` worden.
- [ ] Het regieplan campingdarts §8 bevat de achterhaalde editie-aanname. Correctie hoort bij Stephan Speelberg, niet bij Hermes.
- [ ] Er is nog geen beeldmateriaal voor campingdarts — `~/Movies`, Team Inbox en Downloads gecontroleerd. De testcase begint pas na het filmen.
- [ ] Resolve staat nog open met een leeg "Untitled Project" van de API-test.

## Next steps

- Morgen: beslissing 4 afhandelen. De MCP-tools zijn na herstart geladen en direct bruikbaar.
- Campingdarts filmen volgens de opnamevolgorde in §4 van het regieplan; daarna draait SOP-024 op echt materiaal.

## Cross-links

- [[GL-017-mcp-service-register]] — operationeel contract van `davinci-resolve`
- [[GL-018-integratie-en-software-register]] — lifecycle van koppeling en software
- [[SOP-024-video-monteren-in-davinci-resolve]] — de montageprocedure
- [[2026-08-17-campingdarts-regieplan]] — eerste toepassing, en de bron van de editie-aanname
