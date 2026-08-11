# Implementatieplan — integratiecontrole in de myPKA Cockpit

## Doel

De myPKA Cockpit veilig activeren en uitbreiden met één dashboard waarop MCP-servers, API's, webhooks, databronnen en belangrijke software per apparaat en agentruntime controleerbaar zijn.

Het eindresultaat combineert:

- een portable Markdown-register als canonieke verwachting;
- secretvrije lokale verificatieresultaten per apparaat;
- een visuele Cockpit-pagina met status, voortgang, filters, geschiedenis en eerstvolgende acties.

## Constraints

- Geen token, API-key, OAuth-secret, private URL of Authorization-header in Markdown, Git, API-responses, logs of tests.
- Markdown blijft canoniek; `mypka.db` blijft afgeleid en read-only.
- Lokale observaties leven uitsluitend in `Expansions/mypka-cockpit/mypka-cockpit.db` en synchroniseren niet tussen apparaten.
- Mac mini en MacBook Air krijgen afzonderlijke observaties.
- Healthchecks zijn read-only en hebben time-outs; één fout mag dashboard en server niet blokkeren.
- n8n MCP-token en n8n Public API-key blijven afzonderlijke credentials.
- Geen runtime wordt automatisch gestart.
- Installatie volgt [[WS-003-install-an-expansion]] en `Expansions/mypka-cockpit/INSTALL.md`, inclusief disclaimer, toestemming, back-up en securitygate.
- De portable kern bevat geen runtime- of clientmerken behalve als geregistreerde externe dienst of waargenomen target.
- Bestaande, ongerelateerde wijzigingen in de werkboom blijven onaangeraakt.

## Vooraf gevonden blokkades

De implementatie mag niet rechtstreeks met installatie beginnen:

1. `Expansions/mypka-cockpit/expansion.yaml` mist het verplichte veld `requires_scaffold_version`.
2. `requires_agents` gebruikt de oude rollen `Larry`, `Mack` en `Silas`; de huidige rollen zijn Hermes, Daedalus en Atlas.
3. Het pakket is niet opgenomen in `Expansions/.trusted-sources`; `author: myICOR` kan daardoor niet automatisch worden vertrouwd.
4. [[WS-003-install-an-expansion]] verplaatst in §7 standaard de Expansion-map, maar deze runtime start juist vanuit die map. Dat zou de installatie breken.

Deze vier punten worden vóór installatie opgelost of de installatie stopt. Er is geen stilzwijgende bypass.

## Aanpak voor de compatibiliteitsblokkade

Behandel de aanwezige Cockpit als een **lokale SanderCo-adaptatie**, niet als ongewijzigd myICOR-artefact:

1. Bewaar de oorspronkelijke manifesthash en herkomst in een compatibiliteitsrapport.
2. Security-audit de volledige runtime.
3. Pas het manifest alleen na een groene audit aan naar een herkenbare lokale adaptatie met actuele scaffoldrange en actuele rolvereisten.
4. Verander [[WS-003-install-an-expansion]] zodat runtime-Expansions hun uitvoerbare map behouden en alleen een manifestsnapshot in `_installed/` krijgen.
5. Laat Argus de aangepaste versie opnieuw beoordelen als community/lokale fork; geen myICOR-vertrouwensclaim.

Als Argus rood geeft, stopt het gehele plan vóór installatie.

## Bestandskaart

### Portable tweede brein

| Bestand | Actie | Doel |
|---|---|---|
| `Team Knowledge/Guidelines/GL-018-integratie-en-software-register.md` | nieuw | Canonieke, machineleesbare inventaris zonder secrets |
| `Team Knowledge/Guidelines/INDEX.md` | wijzigen | GL-018 vindbaar maken |
| `Team Knowledge/SOPs/SOP-019-controleer-integraties-en-software.md` | nieuw | Generieke controle-, review- en rotatieprocedure |
| `Team Knowledge/SOPs/INDEX.md` | wijzigen | SOP-019 vindbaar maken |
| `Team Knowledge/Workstreams/WS-003-install-an-expansion.md` | kleine correctie | Runtime-map behouden; manifestsnapshot archiveren |
| `Expansions/INDEX.md` | wijzigen bij succesvolle installatie | Cockpit als geïnstalleerd registreren |

### Cockpit-runtime

| Bestand | Actie | Doel |
|---|---|---|
| `Expansions/mypka-cockpit/expansion.yaml` | compatibiliteitsadaptatie na audit | Geldig lokaal manifest voor scaffold 2.x |
| `Expansions/mypka-cockpit/LOCAL-ADAPTATION.md` | nieuw | Herkomst, hash, afwijkingen en audit vastleggen |
| `Expansions/mypka-cockpit/server/integrationRegistry.js` | nieuw | GL-018 veilig en strikt parsen |
| `Expansions/mypka-cockpit/server/integrationChecks.js` | nieuw | Allowlisted, read-only probes uitvoeren |
| `Expansions/mypka-cockpit/server/integrationStatusDb.js` | nieuw | Lokale observaties en historie opslaan |
| `Expansions/mypka-cockpit/server/migrations/008-integration-status.sql` | nieuw | Tabellen voor machine en probe-observaties |
| `Expansions/mypka-cockpit/server/integrationsApi.js` | nieuw | Secretvrije GET- en controle-endpoints |
| `Expansions/mypka-cockpit/server/server.js` | wijzigen | Integratieroutes registreren |
| `Expansions/mypka-cockpit/server/integrationRegistry.test.mjs` | nieuw | Parser- en validatietests |
| `Expansions/mypka-cockpit/server/integrationChecks.test.mjs` | nieuw | Probe-, timeout- en secretlekkagetests |
| `Expansions/mypka-cockpit/server/integrationsApi.test.mjs` | nieuw | API-contract- en securitytests |
| `Expansions/mypka-cockpit/web/src/lib/integrations.ts` | nieuw | Frontendtypes en statusaggregatie |
| `Expansions/mypka-cockpit/web/src/views/IntegrationsView.tsx` | nieuw | Dashboardweergave |
| `Expansions/mypka-cockpit/web/src/views/integrations.css` | nieuw | Responsive statuskaarten en filters |
| `Expansions/mypka-cockpit/web/src/App.tsx` | wijzigen | Nieuwe view routeren |
| `Expansions/mypka-cockpit/web/src/lib/router.ts` | wijzigen | Route `#/integrations` toevoegen |
| `Expansions/mypka-cockpit/web/src/components/Sidebar.tsx` | wijzigen | Navigatie “Koppelingen & software” toevoegen |
| `Expansions/mypka-cockpit/web/src/lib/i18n/*` | wijzigen | Nederlandse en bestaande taalstrings toevoegen |
| `Expansions/mypka-cockpit/package.json` | wijzigen | Integratietests aan standaardscript toevoegen |

### Lokale installatie per Mac

| Bestand | Actie | Doel |
|---|---|---|
| gegenereerde Cockpit-launcher volgens `launcher/GENERATE-LAUNCHER.md` | nieuw, lokaal | Cockpit handmatig starten |
| `mypka-cockpit.db` | migratie bij start | Lokale machinestatus, niet canoniek |
| `mypka.db` | genereren/actualiseren indien goedgekeurd | Read-only spiegel van Markdown |

## Fase 0 — verplichte toestemming en herstelpunt

### Taak 0.1 — Installatiedisclaimer tonen

1. Toon `Expansions/mypka-cockpit/DISCLAIMER.md` volledig, eerst Engels en daarna Duits.
2. Vraag expliciete toestemming om door te gaan.
3. Bij geen toestemming: stop zonder installatie- of runtimewijzigingen.

**Verificatie:** de toestemming staat expliciet in het gesprek; geen interpretatie van een eerder algemeen “A” als installatietoestemming.

### Taak 0.2 — Restorable back-up bevestigen

1. Controleer `git status`, remote en laatste commit zonder wijzigingen te maken.
2. Bied een volledige git-back-up aan.
3. Ga alleen verder nadat Sander een herstelbare back-up bevestigt of expliciet afziet van de back-upeis.

**Verificatie:** noteer commit-ID of expliciete waiver; toon geen secrets uit ongetrackte bestanden.

## Fase 1 — packagecompatibiliteit en security

### Taak 1.1 — Manifest en runtime inventariseren

1. Valideer alle verplichte manifestvelden tegen `Expansions/docs/expansion-spec.md`.
2. Vergelijk `VERSION` met de beoogde scaffoldrange.
3. Breng alle processen, netwerkcalls, bestandsschrijfacties, env-vars en poorten in kaart.
4. Bereken hashes van manifest en relevante bronbestanden.

**Verificatie:** een rapport bevat alle vier vooraf gevonden blokkades plus eventuele nieuwe afwijkingen; geen secretwaarden.

### Taak 1.2 — Argus-securitygate

1. Scan op tokenpatronen, literals, onverwachte netwerkdoelen en commando-injectie.
2. Controleer `.env.example`, CSP, loopbackbinding, PIN/LAN-gate, CSRF, padjails en write gates.
3. Controleer dat de nieuwe integratieprobes alleen allowlisted read-only gedrag krijgen.
4. Geef GREEN, YELLOW of RED conform WS-003.

**Verificatie:** auditbestand met bevindingen en concreet bewijs. RED stopt het plan; YELLOW vereist een nieuwe expliciete keuze van Sander.

### Taak 1.3 — Lokale adaptatie vastleggen

Alleen na GREEN of geaccepteerd YELLOW:

1. Maak `LOCAL-ADAPTATION.md` met oorspronkelijke versie, hash, datum en wijzigingen.
2. Maak het manifest geldig voor de geteste scaffoldrange.
3. Vervang oude rolvereisten door huidige rollen.
4. Markeer auteur/herkomst eerlijk als lokale adaptatie; claim geen ongewijzigde myICOR-signatuur.
5. Corrigeer WS-003 §7 voor runtime-Expansions: runtimefolder blijft staan, alleen installatiemanifest wordt naar `_installed/` gekopieerd.

**Verificatie:** manifestparser slaagt; foldernaam en slug zijn gelijk; alle vereiste rollen bestaan; diff toont alleen bedoelde compatibiliteitswijzigingen.

## Fase 2 — portable register en procedure

### Taak 2.1 — GL-018 test-first definiëren

1. Schrijf eerst een parserfixture met geldige en ongeldige records.
2. Definieer in GL-018 een streng YAML-frontmatterblok `integrations` met de velden uit het ontwerp.
3. Voeg eerste records toe voor de eerder geïnventariseerde MCP's, API's, workflows, databronnen en software.
4. Gebruik bij MCP-records een `[[GL-017-mcp-service-register]]`-verwijzing; dupliceer endpoint- en transportfeiten niet.
5. Voeg GL-018 aan de Guidelines-index toe.

**Verificatie:** parser accepteert alle records, weigert dubbele `integration_id`'s en onbekende statuswaarden, en vindt nul secretwaarden.

### Taak 2.2 — SOP-019 toevoegen

1. Beschrijf inventarisatie, classificatie, veilige probes, handmatige verificatie, veroudering, incidentstatus, rotatie en retirement.
2. Leg vast dat `configured` geen bewijs voor `working` is.
3. Leg LastPass → lokale secret store → runtime als secretflow vast door te verwijzen naar GL-017; dupliceer geen tokenbeleid.
4. Voeg SOP-019 aan de SOP-index toe.

**Verificatie:** wikilinks lossen op; SOP bevat expliciete rollback- en secretregels.

## Fase 3 — lokale statusopslag

### Taak 3.1 — migratie 008 schrijven

Maak minimaal:

- `integration_machine(machine_id, label, platform, first_seen_at, last_seen_at)`;
- `integration_observation(id, integration_id, machine_id, probe_id, status, checked_at, duration_ms, evidence_code, error_category, profile_version)`.

Voeg indexes toe op `(integration_id, machine_id, checked_at)` en bewaarbeleid voor beperkte historie.

**Verificatie:** migratie tweemaal uitvoeren is veilig; schema bevat geen kolom voor secret, header of responsebody.

### Taak 3.2 — statusrepository bouwen

1. Genereer een stabiele lokale machine-ID zonder serienummer of persoonlijk pad naar de UI te sturen.
2. Schrijf transactieve inserts en query's voor nieuwste status plus geschiedenis.
3. Beperk bewijs en foutcategorie tot gesloten enums en maximale lengtes.
4. Voeg periodieke opschoning toe, bijvoorbeeld maximaal 100 observaties per probe/apparaat.

**Verificatie:** unit-tests bewijzen isolatie per apparaat, enumvalidatie, idempotente machine-upsert en begrensde historie.

## Fase 4 — registerparser en veilige probes

### Taak 4.1 — registerparser bouwen

1. Lees uitsluitend GL-018 vanaf een vast, gejaild pad.
2. Parse YAML met de reeds gebruikte veilige YAML-parser; sta geen dynamische code of tags toe.
3. Valideer veldtypen, enums, ID's, verwijzingen en probeprofielen.
4. Bij een ongeldige record: toon een rustige recordfout en laad overige geldige records.

**Verificatie:** tests voor dubbele ID, padtraversal, onbekende probe, te lange tekst en kwaadaardige YAML-tag.

### Taak 4.2 — passieve probes bouwen

Eerste allowlist:

- config aanwezig;
- secretnaam aanwezig in goedgekeurde lokale secret store, zonder waarde te retourneren;
- lokaal proceshealth-endpoint;
- veilige HTTPS HEAD/GET met korte timeout;
- runtime-MCP-registratiecontrole zonder tokenoutput;
- handmatige observatie als afzonderlijk type.

De runner accepteert geen vrij commando, vrije URL, shelltekst of headers uit een HTTP-request van de browser. Targets komen alleen uit gevalideerde registerprofielen en server-side adapters.

**Verificatie:** tests bewijzen time-out, DNS-/HTTP-foutclassificatie, geen redirects naar privé/onverwachte hosts, geen POST/PUT/PATCH/DELETE en geen secret in foutoutput.

### Taak 4.3 — eerste integraties controleren

Activeer profielen voor:

1. n8n MCP;
2. Firecrawl MCP/API;
3. Todoist API;
4. Calendar iCal;
5. Jortt API;
6. Perplexity API;
7. Cockpit-runtime;
8. n8n Public API alleen wanneer afzonderlijk geconfigureerd.

**Verificatie:** iedere integratie eindigt in bewezen `pass`, verklaarde `warn/fail`, `planned` of `not_checked`; geen vage status.

## Fase 5 — server-API

### Taak 5.1 — read-endpoints toevoegen

Voeg toe:

- `GET /api/cockpit/integrations` — register plus nieuwste lokale status;
- `GET /api/cockpit/integrations/:id/history` — begrensde lokale historie;
- `GET /api/cockpit/integrations/summary` — aantallen en voortgang.

**Verificatie:** contracttests controleren sortering, lege staat, onbekende ID, statusaggregatie en dat geen verboden velden voorkomen.

### Taak 5.2 — gecontroleerde checkroute toevoegen

Voeg `POST /api/cockpit/integrations/check` toe met bestaande session/loopback-, CSRF- en body-sizegates. De body accepteert alleen bekende `integration_id`'s en optioneel bekende probe-ID's.

**Verificatie:** onbekende ID `400`, ontbrekende auth/CSRF `403`, disabled gate `503`, geldige check retourneert alleen statussen en bewijslabels.

## Fase 6 — dashboardinterface

### Taak 6.1 — route en navigatie

1. Voeg `#/integrations` toe.
2. Vervang of herpositioneer de huidige “Software-stack”-ingang zodat er één duidelijke ingang “Koppelingen & software” is.
3. Behoud de bestaande smalle plannerconnectorfunctie als onderdeel of subsectie; dupliceer geen sleutelbeheer.

**Verificatie:** routertests/deeplinkcontrole; actieve navigatiestatus klopt op desktop en mobiel.

### Taak 6.2 — overzicht bouwen

Implementeer:

- samenvattingsbalk;
- voortgangspercentage;
- status-, type-, apparaat-, runtime- en kostenfilters;
- kaarten met laatste controle en eerstvolgende actie;
- rustige empty/error/loading states.

**Verificatie:** frontendbuild slaagt; toetsenbordnavigatie en screenreaderlabels aanwezig; kleur is niet de enige statusdrager.

### Taak 6.3 — detail en controleactie

1. Toon verwachting, probes per apparaat, geschiedenis, dependencies en wikilinks.
2. Plaats een expliciete “Nu veilig controleren”-knop.
3. Toon vooraf welke read-only probes worden uitgevoerd.
4. Laat externe reparatie, tokenrotatie en activatie buiten het dashboard.

**Verificatie:** dubbele klik veroorzaakt geen overlappende run; loading/timeout/failure worden correct getoond; geen tokennaam wordt als tokenstatus verward.

## Fase 7 — formele Cockpit-installatie

### Taak 7.1 — WS-003-installatie uitvoeren

1. Toon installpreview van de lokaal aangepaste versie.
2. Gebruik Argus' definitieve verdict.
3. Voer de merge/integriteitsstappen uit; er zijn geen agents/SOP's uit het pakket te kopiëren.
4. Configureer alleen goedgekeurde niet-geheime runtimeopties.
5. Genereer de launcher maar start hem niet.
6. Maak de `_installed`-manifestsnapshot terwijl de runtimefolder blijft staan.
7. Werk `Expansions/INDEX.md` bij.

**Verificatie:** alle `post_install_validation`-checks slagen en de launcher verwijst naar bestaande paden.

### Taak 7.2 — SQLite-spiegel aanbieden en genereren

1. Detecteer schemahiaten.
2. Toon Sander het effect van de SQLite-upgrade.
3. Voer deze alleen na afzonderlijke toestemming uit.
4. Genereer `mypka.db` en valideer de 13 verplichte tabellen.

**Verificatie:** Cockpit opent de spiegel read-only; regeneratie verandert geen Markdown.

### Taak 7.3 — Sander start de runtime

1. Geef het exacte launcherpad.
2. Sander start de Cockpit zelf.
3. Controleer daarna `GET /api/health` en de nieuwe integratie-endpoints.

**Verificatie:** HTTP 200, juiste Cockpitversie, integratieoverzicht laadbaar en geen serverfouten.

## Fase 8 — verificatie op de Mac mini

1. Draai unit-, API- en frontendtests.
2. Draai secret-scans op getrackte bestanden en API-fixtures.
3. Bouw de webapp schoon.
4. Controleer responsive layout en WCAG 2.2 AA-basics.
5. Laat Nemesis de visuele kwaliteitsgate uitvoeren.
6. Leg de eerste statusbaseline vast.

**Commando's**

```bash
cd Expansions/mypka-cockpit
node --test server/integrationRegistry.test.mjs server/integrationChecks.test.mjs server/integrationsApi.test.mjs
npm run build
npm test --if-present
```

Aanvullend vanuit de repo:

```bash
bash validation-script.sh .
git diff --check
git grep -n -E 'Bearer [A-Za-z0-9._-]{20,}|(API_KEY|TOKEN|SECRET)=.+'
```

**Verwacht:** nieuwe tests groen, build exit 0, geen nieuwe portable-corefouten en geen literal secret.

## Fase 9 — uitrol op de MacBook Air

1. Synchroniseer uitsluitend getrackte code en Markdown via Git.
2. Genereer lokaal de Cockpit-launcher.
3. Installeer benodigde secrets vanuit LastPass in de lokale secret store; nooit via chat of Git.
4. Start de Cockpit handmatig.
5. Draai dezelfde controlebatch.
6. Vergelijk MacBook Air met Mac mini in het dashboard of via een expliciet geëxporteerde secretvrije statussamenvatting.

Omdat `mypka-cockpit.db` machine-lokaal is, verschijnen observaties van twee Macs niet vanzelf in één lokale Cockpit. Versie 1 toont op ieder apparaat zijn eigen status en de verwachte apparaten uit Markdown. Een gezamenlijke cross-device historie vereist later een afzonderlijk, privacybewust synchronisatieontwerp en valt buiten dit plan.

**Verificatie:** op de MacBook Air heeft iedere verwachte koppeling een eigen lokale status; ontbrekende secrets worden `MISSING`, nooit stil als groen weergegeven.

## Fase 10 — afronding en onderhoud

1. Werk `last_verified` alleen bij na echte controles.
2. Schrijf installatiesessie- en implementatielog zonder secrets.
3. Leg open rode/oranje kaarten vast als concrete vervolgacties.
4. Documenteer controlefrequenties: snelle lokale checks bij dashboardopening; netwerkchecks alleen handmatig in versie 1.
5. Voer de volledige close-session Librarian- en git-backupprocedure pas uit wanneer Sander de sessie sluit.

## Acceptatiecriteria

- [ ] Het Cockpit-pakket heeft een geldig en eerlijk lokaal adaptatiemanifest.
- [ ] Argus heeft de installatie niet rood beoordeeld.
- [ ] GL-018 is de enige canonieke inventarisbron.
- [ ] Iedere MCP/API/softwaredienst heeft één unieke ID en een eerstvolgende actie.
- [ ] n8n MCP en n8n Public API zijn gescheiden.
- [ ] Dashboard toont apparaat- en runtimestatus afzonderlijk.
- [ ] Geen status wordt groen zonder recent verificatiebewijs.
- [ ] Geen secretwaarde of gevoelige response wordt opgeslagen of geretourneerd.
- [ ] Een falende probe veroorzaakt geen Cockpit-crash.
- [ ] De Mac mini heeft een volledige baseline.
- [ ] De MacBook Air-procedure is reproduceerbaar en secretvrij.
- [ ] Frontendbuild, backendtests, portable audit en secret-scan slagen.

## Rollback

Bij mislukking vóór installatie:

- herstel alleen de bestanden uit dit plan vanuit het vooraf vastgelegde herstelpunt;
- laat bestaande Keychain-items en tokens ongemoeid;
- start geen runtime.

Bij mislukking na installatie:

- stop de Cockpit-runtime;
- herstel launcher en runtimebestanden vanuit het herstelpunt;
- verwijder alleen de nieuwe lokale integratie-observatietabellen indien dat voor een schone rollback nodig is;
- behoud `mypka.db` als regenerabele spiegel of verwijder hem alleen na expliciete toestemming;
- trek geen externe token in zonder afzonderlijke toestemming.

## Stopcondities

De uitvoering stopt onmiddellijk wanneer:

- de disclaimer of back-up niet expliciet wordt goedgekeurd;
- Argus een RED-verdict geeft;
- het manifest niet eerlijk compatibel kan worden gemaakt;
- een probe een externe schrijfactie nodig blijkt te hebben;
- een secret in Git, log of API-response wordt gevonden;
- installatie een bestaande gebruikerswijziging zou overschrijven;
- dezelfde blokkade drie opeenvolgende uitvoeringspogingen overleeft.
