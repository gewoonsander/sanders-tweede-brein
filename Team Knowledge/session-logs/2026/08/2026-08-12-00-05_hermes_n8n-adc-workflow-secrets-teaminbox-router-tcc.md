---
agent_id: hermes
session_id: n8n-adc-workflow-secrets-teaminbox-router-tcc
timestamp: 2026-08-12T00:05:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Dagstart → ADC-toernooiroutine reconstructie → credential-hygiëne → Team Inbox → downloads-router TCC

## Context

Begon als een gewone `/dagstart` (10-08). Sander vroeg daarna naar een "routine op de Mac Mini" die checkt of er een ADC-toernooi was — die bleek te bestaan als n8n-workflow, maar volledig stuk. De sessie liep door tot na middernacht (12-08) via credential-repair, een volledige workflow-herbouw, en eindigde in een onopgeloste macOS TCC-puzzel bij de downloads-router.

## What we did

- **Hermes** rondde `/dagstart` af: agenda (alleen vakantiemarkering), 4 Todoist-taken, lege Team Inbox op dat moment, dagintentie (dochter/Doetinchem, ClickUp, Hengelo-voorstel) doorgegeven aan **Penn** voor het journaal, en 4 tijdsblokken in de agenda gezet inclusief een nieuwe Todoist-taak voor het Hengelo-voorstel.
- **Hermes** vond de ADC-toernooiroutine terug: een n8n Cloud-workflow (`qDDTsCo229X3BpZz`, "ADC Oost — Verslag notificatie") uit een sessie van 28 juni, plus een losstaande `n8n-mcp`-koppeling in `.mcp.json` die sinds 20 juni nooit geverifieerd was.
- **Daedalus** diagnosticeerde de n8n-mcp-storing: het token stond via Keychain + `launchctl setenv` op de Mac mini, deze sessie draaide op de MacBook Air (bevestigd via `scutil`), en de beloofde login-LaunchAgent om het bij elke login opnieuw te zetten was nooit gebouwd.
- **Daedalus** bouwde die ontbrekende login-LaunchAgent (`nl.gewoonsander.secrets-env`, script + plist), en migreerde `FIRECRAWL_API_KEY` zelfstandig van `Team Knowledge/.env` naar de Keychain (geverifieerd, .env-regel bewust laten staan).
- Sander genereerde zelf een nieuw n8n MCP-token via de browser (na wat gedoe met een ander Chrome-profiel/venster zonder gedeelde sessie); **Hermes** zette het direct in de Keychain via `security add-generic-password` en herstartte de LaunchAgent — token bevestigd in de omgeving (273 tekens).
- **Daedalus** vond dat de workflow al maanden niets deed: een hardgecodeerde toernooidatumlijst (laatst bijgewerkt 28 juni, dus stil sinds half juli) én een Telegram-node zonder gekoppelde credential (dus nog nooit succesvol verstuurd, ook niet toen de lijst nog klopte).
- **Daedalus** herbouwde de workflow met een live Dart Atlas-databron (seizoen-opzoek op naam → `/tournaments/results` → venue-lookup), getest tegen 5 scenario's inclusief een live run tegen de echte site, zonder ooit een testbericht naar Sanders Telegram te sturen.
- Sander koos bewust (**B**) om door te gaan ondanks een ToS-waarschuwing in een ander bestand (`dartsatlas-fetch.mjs`) dat automatische toegang tot Dart Atlas beperkt moest blijven tot zijn eigen spelersprofiel — deze workflow scrapet regio-breed.
- Sander verplaatste de workflow zelf naar n8n-project "Gewoon Sander" (waar de Telegram-credential leeft, de MCP-tools konden dit zelf niet); **Daedalus** koppelde de credential en publiceerde. Workflow bevestigd live en getest (via een negatieve credential-probe, geen echt testbericht).
- **Hermes** legde uit hoe credential-opslag in dit myPKA werkt (`.env`/`.mcp.json`/Keychain, allemaal gitignored, nooit in PKM) na een vraag van Sander.
- **Hermes** verwerkte (deels) de Team Inbox: 4 screenshots bleken permission-dialoog-artefacten van deze sessie zelf (verwijderd); een WhatsApp-foto (Hengelo-toernooiwinnaar) en een privéfoto (Power Hungry Pets, Doetinchem) geïdentificeerd voor Mediahub; 3 DC-templates + een Brian Tracy-guide geïdentificeerd; 11 oude facturen bewust ongemoeid gelaten. Mediahub-verplaatsing geblokkeerd — Lexar SSD niet aangesloten op deze machine.
- **Hermes** herkende via PDF-metadata (Google Docs-export 23-01-2026, vóór het vroegste gelogde gesprek) dat een naamloze coaching-vragenlijst in Team Inbox bij **Maribel Wientjes** hoorde — content matcht haar dossier woordelijk ("rust onder druk", "publiek achter haar", LACO). Weggeschreven naar `PKM/CRM/People/maribel/2026-01-23_coachprep_rust-onder-druk-vragenlijst.md`, origineel verwijderd.
- Team Inbox sprong daarna naar 444+ bestanden — bleek de bestaande `downloads-router`-LaunchAgent te zijn die een backlog uit Downloads routeerde. Legitiem, maar te groot om inline te verwerken → apart vastgelegd als taak-chip (`task_94fdfeb4`).
- **Hermes** diagnosticeerde een macOS TCC-fout ("Operation not permitted") die de downloads-router intermitterend laat falen, inclusief een stale lock-map die daardoor ontstond (meermaals opgeruimd). Full Disk Access voor `bash` bleek al aan te staan; aan/uit-flippen loste het niet op. Onopgelost bij sessie-einde.

## Decisions made

- **Question:** n8n-mcp token opnieuw genereren — waar bewaren (plaintext in `.mcp.json` vs. Keychain + login-LaunchAgent)?
  **Decision:** Keychain-route afgemaakt (de al eerder gekozen richting), niet teruggevallen op plaintext.
- **Question:** Doorgaan met de regio-brede Dart Atlas-scraping in de n8n-workflow, ondanks een ToS-caveat die scraping tot Sanders eigen spelersprofiel beperkt?
  **Decision:** Sander koos bewust om door te gaan (optie B) — risico geaccepteerd, niet gewacht op Dart Atlas-toestemming.
- **Question:** Workflow verplaatsen naar het juiste n8n-project — zelf via UI, via een nieuwe API-key, of door Daedalus opnieuw opgebouwd?
  **Decision:** Sander deed de verplaatsing zelf via de n8n-UI (optie A) — snelst, geen ID/geschiedenis-verlies.
- **Question:** Todoist-taken in overzichten — hoe weergeven?
  **Decision:** Voortaan altijd letter-label (A/B/C) + klikbare Todoist-link per taak, ook buiten `/dagstart`. Vastgelegd in memory.
- **Question:** 444-bestanden Team-Inbox-backlog nu verwerken of apart zetten?
  **Decision:** Apart gezet als losse taak — te groot voor inline verwerking.

## Insights

- **Cowork-sessies delen geen Keychain/`launchctl setenv`-omgeving tussen machines** — een token dat op de Mac mini is gezet, bestaat niet op de MacBook Air en andersom. Elke secrets-fix moet nu standaard op beide machines herhaald worden totdat er een sync-mechanisme is.
- **`launchctl setenv` is sessie-breed, niet scoped per LaunchAgent** — `launchctl print` op één willekeurige agent toont de volledige "inherited environment" inclusief alle via `secrets-env` gezette tokens. Dat betekent dat elk proces in de GUI-sessie (niet alleen de bedoelde consumers) deze secrets kan zien. Tijdens diagnose is dit ook per ongeluk in een tool-output van deze sessie beland (N8N_MCP_TOKEN en FIRECRAWL_API_KEY plaintext zichtbaar in `launchctl print`-output). Geen extern lek, maar wel een aandachtspunt voor Argus: `launchctl setenv` is een breder-dan-bedoeld blootstellingsoppervlak.
- **Cockpit-connectors en MCP zijn twee volledig gescheiden mechanismen** die Sander eerder door elkaar haalde (dacht dat een "N8"-koppeling in de Cockpit zichtbaar zou zijn). Cockpit-connectors zijn platte REST-calls vanuit de lokale Node-server naar de UI; MCP geeft Hermes chat-time tool-toegang. Beide kunnen voor n8n bestaan, met verschillende credentials (REST API-key vs. MCP bearer-token) uit verschillende n8n-instellingenschermen.
- **n8n-mcp mist een "verplaats workflow tussen projecten"-tool** (en credential-share), en de publieke REST API accepteert het MCP-token niet als API-key (401). Sander moest dit handmatig via de UI doen. Waard om te weten voor toekomstige n8n-mcp-klussen.
- **n8n-mcp redigeert credential-referenties uit elk leesantwoord** (`get_workflow_details`, `get_workflow_version` tonen altijd `credentials: null`, ook bij al werkende workflows) — geen bug, gewoon hoe de MCP-laag credentials verbergt. Schrijfkant is wel te verifiëren via een negatieve probe (verzonnen credential-ID → duidelijke foutmelding).
- **`updateNodeParameters`/`setNodeParameter` op de n8n-mcp zijn soms stille no-ops** op bepaalde nodes — `removeNode` + `addNode` werkte waar dat niet lukte.
- **De downloads-router-LaunchAgent heeft een self-inflicted lock-bug**: als macOS het proces hard afbreekt (TCC-denial), vuurt de `trap EXIT`-opruiming niet, en blijft een lock-map achter die alle volgende triggers laat overslaan. Los van de TCC-hoofdoorzaak is dit een fragiele lock-strategie.
- **SOP-010-adc-inschrijvingen-opvragen is zelf verouderingsgevoelig** (Daedalus signaleerde dit): een handmatig bij te houden seizoen-URL-tabel, en de instructie verwijst naar het *schedule*-endpoint dat geen geschiedenis toont. Betere SSOT-URL gevonden (`/o/<orgId>/seasons/active`, zoekt seizoen op naam). Nog niet doorgevoerd in de SOP zelf.

## Realignments

- Sander corrigeerde de aanname dat de nieuwe Dart Atlas-scraper voor de n8n-toernooicheck hetzelfde was als een al bestaande scraper in een andere sessie (`dartsatlas-fetch.mjs`, spelersprofiel-gericht) — bleek functioneel verschillend, maar legde wel de ToS-scope-discrepantie bloot die anders onopgemerkt was gebleven.

## Open threads

- [ ] **downloads-router TCC-fout onopgelost.** Full Disk Access voor `bash` staat aan, aan/uit-flippen hielp niet. Volgende stappen: Mac herstarten, of Console.app filteren op "tccd" tijdens een nieuwe trigger voor de exacte reden.
- [ ] **444-bestanden Team-Inbox-backlog** — apart vastgelegd (`task_94fdfeb4`), nog te verwerken. Bevat ook belastingdocumentatie/facturen die niet in de Mediahub horen.
- [ ] **6 Mediahub-items uit de eerste (18-bestands) inboxronde** staan nog klaar maar geblokkeerd: Lexar SSD niet aangesloten op deze machine (zit aan de Mac mini). WhatsApp-foto (Hengelo-winnaar), Power Hungry Pets-foto, 3 DC-templates, Brian Tracy-guide.
- [ ] **Paspoortfoto in Downloads** ("paspoort Sander voor Mollie.jpeg", 2×) — gesignaleerd, niet verplaatst, blijft liggen tot Sander het zelf opruimt.
- [ ] **Secrets-env-LaunchAgent + Keychain-items nog niet gerepliceerd op de Mac mini** — nodig zodra daar weer aan gewerkt wordt (zelfde script/plist/Keychain-stappen als op de MacBook Air).
- [ ] **SOP-010-adc-inschrijvingen-opvragen bijwerken** met de betere seizoen-discovery-URL — nog niet gedaan, ligt bij Atlas of Hermes.
- [ ] **Dart Atlas ToS-permissieverzoek nog lopend** (uit een andere sessie) — de nieuwe n8n-workflow scrapet inmiddels breder dan die aanvraag dekt; Sander accepteerde dit risico bewust.

## Next steps

- Als Sander weer bij de Mac mini is: 6 Mediahub-items afronden, secrets-env-LaunchAgent daar ook opzetten.
- Console.app-diagnose of herstart voor de downloads-router TCC-fout.
- `task_94fdfeb4` oppakken zodra er ruimte is voor een grotere opruimronde.

## Cross-links

- `[[2026-08-07-14-28_hermes_todoist-regels-verbouwingsoverzicht-cockpit-secrets-audit]]` — waar de Keychain-migratie van deze tokens origineel gepland werd.
- `[[2026-06-28-22-00_hermes_adc-facebook-n8n-inboxen]]` — waar de n8n-workflow origineel gebouwd werd (met de nu-gefixte gebreken).
