---
agent_id: hermes
session_id: cockpit-koppelingen-fix-en-dt-irritant-oauth
timestamp: 2026-08-12T13:01:20+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: [GL-013-interactie-enkelvoudige-keuzes, GL-018-integratie-en-software-register]
---

# Cockpit-koppelingen echt gerepareerd, D.T. Irritant Google-koppeling werkend gekregen

## Context

Sander zag kapotte koppelingen op zijn myPKA Cockpit-dashboard, te beginnen bij de n8n Public API. Dat groeide uit tot twee sporen: (1) de dashboardstatus van meerdere koppelingen structureel kloppend maken, en (2) de al eerder gebouwde D.T. Irritant-beschikbaarheidsautomatisering (uit de sessie van 11-08) daadwerkelijk werkend krijgen inclusief een echte Google-koppeling.

## What we did

- Daedalus bevestigde live dat n8n Public API echt kapot was (ontbrekende `N8N_API_KEY`/`N8N_BASE_URL`), hielp Sander de sleutel aanmaken en voegde 'm toe aan `Team Knowledge/.env`.
- Daedalus corrigeerde [[GL-018-integratie-en-software-register]] (n8n-public-api: `planned` → `configured`, overbodige `config-present`-probe verwijderd) en fixte een echte code-bug in `integrationsApi.js`: verouderde probe-resultaten van een inmiddels verwijderde check trokken de status blijvend naar "broken"/"action needed". Commit `10af5cc`.
- Daedalus bouwde een terugkoppelmechanisme: elke echte, toch al lopende connector-fetch (Todoist/Jortt/n8n/Agenda in `getAgenda()`) meldt zichzelf nu automatisch als bewijs aan het GL-018-register — geen nieuw netwerkverkeer, wel eerlijke "working"-status. Nieuwe, scope-beperkte endpoint `POST /api/cockpit/integrations/manual-probe` liet ook Google Contacts (via n8n-mcp) en Canva (via de Canva MCP-verbinding van deze sessie) meteen als geverifieerd registreren.
- Daedalus sloot hetzelfde gat voor Perplexity: `perplexity_search.py` meldt na elke echte aanroep zelf succes/falen terug aan de Cockpit. Live getest met een echte (betaalde) testvraag. Commit `fd8216d`.
- Sander en Hermes liepen samen de resterende 10 "actie nodig"-tegels langs; bewust *niet* aangeraakt: LastPass/Formflow/Huddle/Plug&Pay (vereisen Sanders eigen account-login), bunq (expliciet een pending besluit, geen bankkoppeling zonder review), Teambeheer (er loopt al apart onderzoek), D.T. Irritant Forms en de voedingsdatalaag (zijn bouwwerk, geen snelle check).
- Daedalus importeerde de twee al-geteste D.T. Irritant n8n-workflows (Genereer beschikbaarheidsformulier, Synchroniseer formulierantwoorden) 1:1 via de n8n-mcp SDK-route, verifieerde de bedrading byte-voor-byte tegen het origineel, en draaide een echte dry-run tegen de live Teambeheer-feed (22 wedstrijden seizoen 26-27 correct, 3 bekerwedstrijden terecht uitgesloten).
- Bij het koppelen van een Google-credential liep de Claude Browser-pane vast op een coördinaten-/focusprobleem (klikken en typen kwamen op de verkeerde plek terecht, zowel in n8n's canvas als later in Google Sheets). Eén foute poging veroorzaakte kortstondig een dubbel/kapot parameterveld in een workflow-node; direct opgemerkt, hersteld en geverifieerd via de n8n-API.
- De bestaande credential "Google account" bleek zelf kapot (`Unable to sign without access token`). Daedalus zette samen met Sander een nieuwe, dedicated OAuth-client "D.T. Irritant n8n" op in Google Cloud (project `tweede-brein-integraties`; Forms/Drive/Sheets-API's stonden al aan), corrigeerde een verkeerd aangenomen redirect-URI (n8n Cloud gebruikt `oauth.n8n.cloud`, niet het domein van de instance), en maakte een nieuwe n8n-credential "D.T. Irritant Google OAuth2" met de vier juiste scopes. Sander rondde de Google-consent zelf af.
- Live geverifieerd dat de nieuwe credential werkt (echte, geslaagde GET naar Google Drive). Gekoppeld aan alle 5 relevante nodes in beide workflows via de betrouwbare `setNodeCredential`-API in plaats van de haperende browser.
- Op Sanders vraag "heb je geen API/MCP hiervoor?" schakelde Daedalus over: het antwoorden-Sheet (3 tabs, alle headers inclusief de 22 exacte wedstrijdtitels) werd volledig aangemaakt via een eenmalig, wegwerp-n8n-workflowtje dat de Google Sheets API rechtstreeks aansprak — omzeilde de kapotte browserinteractie volledig. Workflowtje na gebruik gearchiveerd. `outputSpreadsheetId` ingevuld in workflow 2.

## Decisions made

- **Question:** Verouderde probe-status oplossen door een `CONFIG_PATHS`-entry toe te voegen, of de overbodige check verwijderen?
  **Decision:** Verwijderen — sluit aan bij hoe de vergelijkbare Todoist/Jortt-koppelingen al zijn opgezet.
- **Question:** Moet de dashboardstatus automatisch worden bijgewerkt op basis van echte koppelingsgebruik?
  **Decision:** Ja, maar uitsluitend door mee te liften op fetches die toch al gebeuren — nooit nieuw, ongevraagd netwerkverkeer alleen om een tegel groen te maken.
- **Question:** De kapotte "Google account"-credential herstellen, of een nieuwe dedicated credential bouwen voor D.T. Irritant?
  **Decision:** Nieuwe, dedicated OAuth-client — schoner gescheiden en Sander kon zelf meteen de Google Cloud-kant afhandelen.
- **Question:** OAuth consent screen op Internal of External?
  **Decision:** Internal — Sanders account valt al binnen de Workspace-organisatie, geen verificatie of 7-dagen-tokenverval nodig.
- **Question:** Hoe het antwoorden-Sheet afmaken toen browserautomatisering onbetrouwbaar bleek?
  **Decision:** n8n zelf als uitvoeringsmotor gebruiken (een tijdelijke workflow met de Sheets API), in plaats van door te blijven vechten met de browser.

## Insights

- De Claude Browser-pane vertoonde deze sessie een serieuze, onverklaarde mismatch tussen getoonde schermcoördinaten en waar kliks/toetsaanslagen daadwerkelijk terechtkwamen — zowel in n8n's canvas als in Google Sheets. Zodra dat gebeurt: stoppen met klikken/typen en overschakelen op een API-route in plaats van door te forceren.
- Het GL-018-statussysteem had wel het *principe* ("configured ≠ active, alleen een echte probe of gedateerde controle mag groen maken") maar miste de daadwerkelijke terugkoppel-mechaniek. Die ontbrekende schakel bouwen loste meteen meerdere losse dashboardklachten in één keer op.
- Workflows importeren via de n8n-mcp SDK-route (parameters letterlijk overgenomen via JSON-serialisatie, bedrading achteraf gedifft tegen het origineel) is een betrouwbare, laag-risico manier om al-geteste workflow-JSON te importeren wanneer de Public API-sleutel bewust alleen-lezen is.
- Wanneer Sander vraagt "heb je hier geen API voor", is het antwoord vaker wel dan niet ja — en levert overschakelen naar de API-route direct betrouwbaardere resultaten dan doorzetten met browserautomatisering.

## Realignments

- Sander stuurde bij: in plaats van hem telkens handmatige browserstappen te laten doen, wees hij erop dat een API/MCP-route waarschijnlijk beter zou werken — dat leidde direct tot de oplossing voor zowel de credential-koppeling als de Sheet-aanmaak.

## Open threads

- [ ] Sander bekijkt de D.T. Irritant-preview nog één keer, zet dan `createForm=true` in workflow 1 om het echte Google Form aan te maken.
- [ ] Zodra het formulier bestaat: `formId` invullen in workflow 2 en de sync-responses-workflow echt testen.
- [ ] De coördinaten-/focusbug in de Claude Browser-pane (kliks/typen komen op de verkeerde plek terecht) is nog niet gemeld of gereproduceerd buiten deze sessie — waard om bij een volgende browsertaak alert op te zijn, en te melden als het weer optreedt.
- [ ] Jortt blijft echt kapot (MKB-abonnement vereist) — bekend, geen actie tenzij Sander besluit te upgraden.
- [ ] 8 overige GL-018 "actie nodig"-tegels blijven bewust liggen (LastPass, Formflow, Huddle, Plug&Pay, bunq-besluit, Teambeheer, D.T. Irritant Forms-afronding, Nederlandse voedingsdatalaag) — vereisen Sanders eigen login of zijn een pending besluit/eigen bouwklus.

## Next steps

- D.T. Irritant oppakken bij "createForm=true zetten en het echte formulier aanmaken" zodra Sander er klaar voor is.
- Bij een volgende browsertaak: als klikken/typen weer op de verkeerde plek lijkt te landen, meteen overschakelen op een API-route in plaats van door te zetten.

## Cross-links

- [[2026-08-11-19-58_hermes_dt-irritant-seizoen-26-27]] — eerdere sessie waarin de D.T. Irritant-workflows werden ontworpen en gebouwd.
- [[2026-08-12-00-25_hermes_integratie-ssot-en-cockpit]] — eerdere sessie over het GL-018-integratieregister.
- [[2026-08-12-12-41_hermes_cockpit-dropbox-en-dagafsluiting]] — vorige close-session vandaag (Cockpit-consolidatie, Dropbox-pauze).
