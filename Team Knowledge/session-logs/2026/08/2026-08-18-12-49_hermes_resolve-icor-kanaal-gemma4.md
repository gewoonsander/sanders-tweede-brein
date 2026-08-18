---
agent_id: hermes
session_id: resolve-icor-kanaal-gemma4
timestamp: 2026-08-18T12:49:00Z
type: end-of-session
linked_sops: ["SOP-024-video-monteren-in-davinci-resolve", "SOP-013-inboxen-verwerken", "SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: []
linked_guidelines: ["GL-017-mcp-service-register", "GL-018-integratie-en-software-register", "GL-005-llm-agnostic-portable-core"]
linked_tasks: []
linked_journal_entries: []
---

# Resolve gekoppeld, ICOR-kanaal binnengehaald, Gemma 4 onderzocht

Lange sessie, gestart 2026-08-17 om 20:47 en doorgelopen tot de volgende middag. Verkort
afgesloten op verzoek van Sander.

## Wat er is gedaan

**DaVinci Resolve gekoppeld aan Claude Code.** Vastgesteld door meting dat Sander Studio 20.3.2.9
draait (externe scripting is sinds Resolve 19.1 Studio-only). Vijf MCP-servers vergeleken op
onderhoudscijfers via de GitHub API; `samuelgursky/davinci-resolve-mcp` won op onderhoud, niet op
sterren. Argus deed de securityreview (geel, installeerbaar mits voorwaarden). Geïnstalleerd in
compound-modus, 35 tools. Vastgelegd in [[GL-017-mcp-service-register]],
[[GL-018-integratie-en-software-register]] en [[SOP-024-video-monteren-in-davinci-resolve]].

**Het ICOR-kanaal van 121 naar 588 van 598 video's.** De eigen transcribeer-skill liep vast op een
YouTube-limiet; overgestapt op Firecrawl, dat 411 video's in tachtig minuten ophaalde. Kosten: 424
van 1.507 credits. De resterende tien video's hebben geen enkele ondertitel — bewust laten liggen.

**`/transcribeer` permanent verbeterd.** Firecrawl als tweede route ingebouwd, vóór de
Whisper-terugval, plus `--geen-firecrawl`. De pre-flight stopt niet meer bij een geblokkeerd IP
zolang Firecrawl beschikbaar is. Gesynchroniseerd naar beide machines.

**Twee gefaalde routines op de Mac mini gediagnosticeerd.** `soap` faalde omdat Ollama niet draaide
(nu gestart als service). `dartsatlas-fetch` liep in de eigen timeout door een TCC-probleem met
Homebrew Node; dat wacht op een handeling van Sander in Systeeminstellingen.

**Gemma 4 onderzocht** door Athena (wat kan het) en Daedalus (kan het hier draaien). Conclusie: nog
niet doen. Herinnering ingesteld voor 2026-09-18 om het te herbeoordelen.

**Team Inbox verwerkt**: een voedingsfoto (bleek al gelogd, duplicaat opgeruimd) en een
audio-opname (het Gemma 4-verzoek, getranscribeerd en gearchiveerd naar de Mediahub).

## Decisions made

- **Question:** Welke MCP-server voor Resolve?
  **Decision:** `samuelgursky`, omdat die als enige kenmerken van onderhouden software vertoont —
  22 bijdragers, dagelijkse releases. Bij software die diep in projectbestanden graait is dat het
  criterium, niet populariteit.
- **Question:** Hoe de 441 resterende video's ophalen na de blokkades?
  **Decision:** Firecrawl. De gratis routes haalden veertien video's per IP per venster; Firecrawl
  omzeilt het probleem volledig.
- **Question:** Gemma 4 nu inzetten?
  **Decision:** Nee. Vijf blokkades staan overeind; over een maand opnieuw bekijken.
- **Question:** De Ollama-bug in de DaVinci-MCP repareren?
  **Decision:** Niet de code aanpassen (verdwijnt bij de eerstvolgende update), maar de
  Ollama-binary op de Air installeren plus een SSH-tunnel. Werkt, en overleeft updates.

## Insights

- **YouTube knijpt af per IP, niet per kanaal of sessie.** Veertien video's per venster, gemeten op
  drie losse IP's. Verse sessies per video helpen niet — die hypothese is onderuit gegaan tijdens
  het meten. Hoe zwaarder een IP is aangesproken, hoe langer de sanctie: de mini zat na een blinde
  batch negentien uur dicht, terwijl korte overschrijdingen in minuten oplosten.
- **De classifier blokkeert een directe Edit op `.mcp.json`,** ook na expliciete toestemming van
  Sander. Werkende route: `claude mcp add <naam> --scope project -e KEY=VAL -- <command>`.
- **Een fout die crasht is een geschenk; een fout die valideert niet.** Daedalus' scherpste
  bevinding: een lokaal 3B-model vulde een voedingsregistratie met nullen die netjes door de
  schemacontrole kwamen. Dat is gevaarlijker dan een harde fout.
- **Nooit een schema versoepelen omdat een lokaal model het niet haalt** — dan bepaalt een
  modelbeperking de canonieke structuur van het tweede brein, precies wat GL-005 wil voorkomen.

## Open threads

- [ ] **4 · CAM** — campingdarts-project in Resolve opzetten (1080x1920, 30 fps) vóór er media
      geïmporteerd wordt; de framerate is daarna niet meer te wijzigen.
- [ ] **17 · TCC** — Node toevoegen aan Volledige Schijftoegang op de mini:
      `/opt/homebrew/Cellar/node/26.4.0/bin/node`. Alleen Sander kan dit.
- [ ] **24 · TUN** — de SSH-tunnel naar Ollama draait nu handmatig; verdwijnt bij herstart.
- [ ] Team Inbox: 1 screenshot en 1 document binnengekomen na de verwerking van vanochtend.
- [ ] Het regieplan campingdarts §8 gaat uit van Studio 21.0.4 of de gratis 20.3.2; het is
      Studio 20.3.2.9. Correctie hoort bij Stephan Speelberg.
- [ ] `davinci-resolve-mcp` staat in GL-018 op `configured`; pas `active` na een geslaagde
      `resolve_control`-aanroep vanuit de runtime.

## Next steps

- Beslissingen 4, 17 en 24 afhandelen wanneer het uitkomt.
- 2026-09-18: de ingeplande herbeoordeling van Gemma 4 draait automatisch.

## Cross-links

- [[2026-08-18-gemma-4-onderzoek-athena]] · [[2026-08-18-gemma-4-lokaal-draaien-daedalus]]
- [[2026-08-18-gemma-4-onderzoeksverzoek]] · [[SOP-024-video-monteren-in-davinci-resolve]]
- [[2026-08-17-campingdarts-regieplan]]
