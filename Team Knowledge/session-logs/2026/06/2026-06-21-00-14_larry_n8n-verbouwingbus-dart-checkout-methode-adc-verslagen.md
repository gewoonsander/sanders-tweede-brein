---
agent_id: larry
session_id: n8n-verbouwingbus-dart-checkout-methode-adc-verslagen
timestamp: 2026-06-21T00:14:00+02:00
type: close-session
linked_sops: ["SOP-003-adc-inschrijvingen-opvragen"]
linked_workstreams: ["WS-004-facebook-toernooi-verslag"]
linked_guidelines: []
---

# n8n-koppeling, verbouwingsbus-check, Dart Atlas checkout-methode en twee ADC-verslagen

## Context

Brede sessie met meerdere losse threads: n8n MCP-server koppelen en opruimen, een laadcapaciteit-check voor de verbouwing, een grondige herziening van hoe Dart Atlas-checkouts worden bepaald (WS-004), en het afronden van twee Facebook-verslagen voor de ADC-toernooien van 20 juni in Regio Oost.

## What we did

- Larry hielp n8n MCP-server koppelen en inventariseerde alle 27 workflows; poging tot archiveren van 7 ongebruikte testworkflows liep vast omdat geen van de workflows MCP-toegang had ingeschakeld in n8n zelf.
- Larry zocht uit dat er geen Google Sheets MCP-connector in de registry beschikbaar is; n8n's Sheets-node (officiële API) blijft het aangewezen pad voor schrijfacties.
- Larry checkte het kenteken VPN83J via RDW open data (Opel Movano, 600×205×252 cm) en gaf een inschatting dat de nieuwe keuken (langste onderdeel 2,33m) in één rit past — vastgelegd in `[[verbouwing-huismanstraat-34]]`.
- Larry analyseerde een Dart Atlas-wedstrijdpagina (Ivo vs Paul) stap voor stap om uit te leggen hoe checkouts worden afgelezen uit de score-tabel.
- Na een gebruikersvraag over volledigheid herzag Larry de match-verzamelingsmethode in WS-004: van onvolledige sampling via spelerspagina's naar complete verzameling via de `/group/[N]`-sidebar.
- Larry analyseerde het hele Arnhem-toernooi (11 juni, 32 wedstrijden) eerst handmatig via screenshots, vond 5 hoge finishes (140, 132, 120, 116, 110).
- Op gebruikersvraag "kan het sneller" ontdekte Larry een DOM-extractiemethode (eigen tekstnode van elke `<li>` binnen `.leg-throws-summary`) die screenshots overbodig maakt — geverifieerd tegen de handmatige uitkomst, exact gelijk.
- Op een tweede snelheidsvraag ontdekte Larry dat de browser-tab met `fetch()` + `DOMParser` alle wedstrijdpagina's van een toernooi **parallel** kan ophalen zonder te navigeren — alle 32 wedstrijden van Arnhem herverifieerd in 1 tool-call, zelfde uitkomst.
- Larry legde de uiteindelijke snelste methode vast in WS-004 (stap 1.5), met fallback-instructies.
- Larry stelde vast dat er op 20 juni twee toernooien in Regio Oost speelden: Regional Amateur I Finals (Driel, winnaar Keano de Wit) en Regional Amateur II Finals (Doetinchem, winnaar Mitch Olijslager).
- Larry herverifieerde Amateur I Finals (9 wedstrijden) volledig met de nieuwe methode en verwijderde de oude onzekerheids-disclaimer uit het conceptverslag.
- Larry maakte een nieuw conceptverslag voor Amateur II Finals (27 wedstrijden, 5 hoge finishes: 130, 124, 120, 108, 100; 5×180).
- Larry checkte de officiële EC-kwalificatieregels (amateurdarts.eu) en bevestigde dat Keano's EC-kwalificatie-claim klopt; voegde de bronlink toe aan het verslag.
- Larry checkte het nieuwe seizoen Winmau Benelux Open 2026 – Regio Oost (season-ID `uoGtg6XqtbQH`) en corrigeerde een verkeerde seizoenslink in het Amateur I-verslag (wees naar het oude Trophy-seizoen i.p.v. het nieuwe Open-seizoen).
- Larry werkte SOP-003 bij met de nieuwe seizoens-URL en de volledige Benelux Open-planning (pub qualifiers, Amateur/Elite Finals, hoofdtoernooi).
- Larry haalde de winnaarsfoto's van Keano de Wit en Mitch Olijslager op uit Team Inbox, kopieerde ze naar `PKM/Journal/Images/2026/06/` en verwerkte ze in beide verslagen.

## Decisions made

- **Question:** Hoe wordt voortaan de match-ID-verzameling voor een ADC-toernooi gedaan in WS-004?
  **Decision:** Via de `/tournaments/[ID]/group/[N]`-sidebar (compleet, geen sampling) i.p.v. via spelerspagina's (riskeerde gemiste wedstrijden door rate-limiting-beperking).
- **Question:** Hoe worden checkouts per wedstrijd bepaald?
  **Decision:** Via parallelle `fetch()` + `DOMParser` binnen de browser-tab (1 call voor een heel toernooi), met DOM-extractie per match en screenshots als allerlaatste fallback.
- **Question:** Mag Larry user-aangeleverde foto's verwerken zonder bestandspad van de gebruiker?
  **Decision:** Nee — gebruiker moet de foto zelf in Team Inbox plaatsen; Larry zoekt 'm daar op (geen toegang tot losse chat-attachments op schijf).

## Insights

- Dart Atlas is server-side gerenderd (Rails), geen losse JSON-API — WebFetch faalt met 403 puur door bot-detectie, niet door JS-rendering.
- De zichtbare scoretabel-cijfers per beurt zitten niet in de decoratieve `<span>`-kinderen van elke `<li>` (die zijn overal identiek, puur een samenvattings-badge) maar in de eigen tekstnode van de `<li>` zelf, vóór die spans.
- Omdat de browser-tab al is ingelogd op dartsatlas.com, werkt `fetch()` vanuit de pagina zelf waar `WebFetch` (los van de browser) faalt — dezelfde sessie/cookies passeren blijkbaar bot-checks die los browserverkeer blokkeren.
- RDW open data geeft alleen buitenmaten van een voertuig, geen laadruimte — bruikbaar voor een grove inschatting, niet voor exacte laadcapaciteit.

## Realignments

- Gebruiker corrigeerde Larry's aanname dat de "Matches"-link op een toernooipagina alle wedstrijden zou tonen — die linkt in werkelijkheid naar `/results` (alleen KO-fase). De gebruiker wees vervolgens zelf op de juiste route (`/group/[N]`-pagina met volledige wedstrijdenlijst in de sidebar), wat de basis werd voor de WS-004-herziening.
- Gebruiker wees Larry op een fundamentele DOM-structuur die over het hoofd was gezien (eigen tekstnode per `<li>` i.p.v. de span-content) na een eerste mislukte analyse — leidde direct tot de snelle extractiemethode.

## Open threads

- [ ] Optionele quotes van Keano de Wit en Mitch Olijslager nog toevoegen aan beide verslagen (handmatig, Sander vraagt na bij de winnaars).
- [ ] Beide ADC-verslagen wachten op Sanders akkoord vóór publicatie op Facebook.
- [ ] 7 ongebruikte n8n-testworkflows ("My workflow 2/3/4/6/7/8/9") nog te archiveren — vereist eerst handmatig MCP-toegang inschakelen per workflow in n8n, of Sander archiveert ze zelf direct in de n8n-UI.
- [ ] Verhuisbus-transport (11 juli, Almere → Huissen) nog definitief bevestigen met Albero; bus-inschatting (Opel Movano, VPN83J) is gedaan maar laadruimte-binnenmaten blijven een aanname.
- [ ] Bij het volgende toernooi in Regio Oost: de nieuwe parallelle fetch-methode uit WS-004 toepassen vanaf het begin (geen handmatige screenshot-ronde meer nodig).

## Next steps

- Bij het volgende ADC-toernooi: direct stap 1.1–1.5 van WS-004 doorlopen met de parallelle fetch-methode, geen aparte verificatieronde meer nodig.
- Zodra Sander akkoord geeft op de twee verslagen: publiceren en de status-velden in de frontmatter bijwerken naar "gepubliceerd".
- Bij de eerste Winmau Benelux Open-toernooien (vanaf eind september): SOP-003 en WS-004 zijn al voorbereid met de juiste seizoens-ID (`uoGtg6XqtbQH`).

## Cross-links

- `[[2026-06-20-larry_n8n-mcp-connectie]]` — vorige sessie, start van de n8n-koppeling die in deze sessie werd vervolgd (workflow-opruiming).
