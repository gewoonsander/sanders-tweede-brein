---
key_element: groei
---

# Integratiecontrole in de myPKA Cockpit — ontwerp

## Status

Ontwerp ter goedkeuring. Er is nog niets aan de Cockpit, koppelingen of secrets gewijzigd.

## Doel

Eén overzicht in de myPKA Cockpit maken waarin Sander kan zien:

- welke MCP-servers, API's, webhooks en belangrijke softwarediensten er zijn;
- waarvoor iedere koppeling wordt gebruikt;
- op welke apparaten en agentruntimes zij verwacht wordt;
- of zij alleen beschreven, geconfigureerd, bereikbaar of volledig werkend is;
- wanneer en hoe zij voor het laatst is gecontroleerd;
- welke actie nog nodig is, wie die uitvoert en wat de voortgang is;
- welke koppelingen betaald, gratis of nog kostentechnisch onbekend zijn.

Het dashboard toont nooit tokens, secrets, Authorization-headers of gevoelige healthcheckresponses.

## Bestaande situatie

- [[GL-017-mcp-service-register]] is de canonieke bron voor MCP-diensten, maar bevat nu alleen `n8n-mcp`.
- De Cockpit heeft al een `ConnectionsView`, een generiek connectorregister en een lokale statuspagina.
- De bestaande Cockpit-connectors zijn primair bedoeld voor live taken en agenda-items, niet voor integraal configuratiebeheer.
- De Cockpit bevat al een read-only `n8n:workflows`-connector die workflowstatus kan tonen wanneer een afzonderlijke n8n Public API-key beschikbaar is.
- Configuratiekennis is nu verspreid over Guidelines, `.mcp.json`, runtimeconfiguraties, `.env`-sleutelnamen, CRM-notities, projectplannen en sessielogs.
- De Cockpit-map is aanwezig, inclusief dependencies en gebouwde webapp, maar de Expansion-index registreert hem nog niet als officieel geïnstalleerd.
- De Cockpit hanteert: Markdown is canoniek, `mypka.db` is een afgeleide read-only spiegel en `mypka-cockpit.db` bevat alleen lokale machinestatus.

## Ontwerpprincipes

1. **Verwachting en observatie gescheiden.** Markdown beschrijft wat aanwezig hoort te zijn; een lokale controle registreert wat op dit apparaat werkelijk is waargenomen.
2. **Eén waarheid per feit.** De koppelingdefinitie staat één keer in het integratieregister; MCP-details verwijzen naar [[GL-017-mcp-service-register]].
3. **Apparaatbewust.** Mac mini en MacBook Air krijgen afzonderlijke controlestatussen, omdat Keychain, processen en lokale configuraties per apparaat verschillen.
4. **Runtimebewust.** Een koppeling kan voor de ene agentruntime groen en voor de andere rood zijn.
5. **Geen secrets in het dashboard.** Alleen secretnamen, opslaglocatie en `PRESENT`/`MISSING` worden getoond.
6. **Bewijs boven handmatige vinkjes.** Automatisch meetbare statussen komen uit probes; handmatige controles vermelden expliciet wie, wanneer en waarop heeft gecontroleerd.
7. **Rustige foutstatus.** Een fout in één externe dienst mag de Cockpit niet blokkeren.
8. **Read-only standaard.** Healthchecks gebruiken waar mogelijk lijst-, status- of metadata-endpoints en veroorzaken geen externe wijzigingen.
9. **Kosten zichtbaar.** Iedere dienst krijgt `free`, `paid`, `lifetime`, `included`, `usage-based` of `unknown`, plus een actie wanneer kosten onduidelijk zijn.

## Mogelijke aanpakken

### A — Alleen een handmatig Markdown-overzicht

Eén tabel wordt door Sander of Hermes bijgewerkt en door de Cockpit weergegeven.

**Voordelen:** eenvoudig, volledig portable, vrijwel geen code.

**Nadelen:** status veroudert snel; geen bewijs dat een token, endpoint of client werkelijk werkt; apparaten zijn lastig betrouwbaar te vergelijken.

### B — Alleen live technische controles

De Cockpit ontdekt configuraties en benadert alle endpoints rechtstreeks.

**Voordelen:** actuele technische status en weinig handmatig onderhoud.

**Nadelen:** geplande en handmatige software ontbreekt; de Cockpit moet veel verschillende authenticatiemethoden kennen; grotere security- en onderhoudsoppervlakte; geen goede SSOT voor intentie en eigenaarschap.

### C — Portable register + lokale verificatieresultaten (aanbevolen)

Een Markdown-register beschrijft de gewenste situatie. Een lokale probe-runner controleert wat veilig automatisch meetbaar is en bewaart alleen de resultaten in de machine-lokale Cockpit-database. De Cockpit voegt beide samen.

**Voordelen:** LLM-agnostisch, apparaatbewust, controleerbaar, secretvrij en geschikt voor zowel technische als handmatige koppelingen.

**Nadelen:** meer initiële bouw; voor OAuth- en GUI-diensten blijven soms handmatige controles nodig.

## Gegevensmodel

### 1. Canoniek integratieregister in Markdown

Een nieuwe Guideline wordt de SSOT voor alle integraties en softwarediensten. Iedere record bevat minimaal:

| Veld | Betekenis |
|---|---|
| `integration_id` | Stabiele unieke slug |
| `name` | Leesbare naam |
| `kind` | `mcp`, `api`, `webhook`, `data-source` of `software` |
| `purpose` | Waarvoor Sander deze gebruikt |
| `lifecycle` | `idea`, `planned`, `configured`, `active`, `paused`, `retired` |
| `owner` | Verantwoordelijke specialist of Sander |
| `expected_devices` | Apparaten waarop lokale configuratie nodig is |
| `expected_runtimes` | Generieke runtime-ID's of `none` |
| `auth_method` | Geen auth, API-key, OAuth, bearer, app password enzovoort |
| `secret_names` | Alleen namen/verwijzingen, nooit waarden |
| `cost_model` | Gratis, betaald, lifetime, inbegrepen, usage-based of onbekend |
| `verification_profile` | Welke veilige controles bij deze koppeling horen |
| `dependencies` | Andere koppelingen die eerst moeten werken |
| `canonical_reference` | Wikilink naar detailbron, bijvoorbeeld GL-017 of een project |

De registratie van MCP-transport en endpoints blijft in [[GL-017-mcp-service-register]]. Het integratieregister verwijst daarnaar en kopieert die feiten niet.

### 2. Verificatieprofielen

De eerste versie ondersteunt een kleine vaste set probes:

- `config-present`: bestaat de verwachte registratie zonder secretwaarde te lezen;
- `secret-present`: meldt de lokale secret store alleen `PRESENT` of `MISSING`;
- `dns-tcp`: kan de host veilig worden bereikt;
- `http-readonly`: geeft een afgesproken read-only endpoint een geldige status;
- `mcp-tools`: kan de runtime de verwachte server en toolfamilies inventariseren;
- `oauth-readonly`: kan een minimaal read-only verzoek slagen;
- `process-health`: draait de lokale software en antwoordt haar health-endpoint;
- `manual`: expliciet bewijs door Sander, met datum en notitie.

Niet iedere koppeling gebruikt alle probes. Een softwareabonnement zonder API kan bijvoorbeeld alleen `manual` gebruiken.

### 3. Lokale observaties

Per apparaat worden in `mypka-cockpit.db` uitsluitend deze afgeleide feiten opgeslagen:

- `integration_id`;
- apparaat-ID en apparaatlabel;
- probe-ID;
- status: `pass`, `warn`, `fail`, `not_applicable`, `not_checked`;
- gecontroleerd tijdstip;
- duur en niet-gevoelige foutcategorie;
- bewijslabel, bijvoorbeeld `HTTP 200`, `registered`, `secret present`;
- versie van het verificatieprofiel.

Geen responsebody, token, header, e-mailadres of volledige foutdump wordt opgeslagen.

## Statusmodel in het dashboard

Iedere koppeling krijgt één samengevatte kleur:

| Status | Betekenis |
|---|---|
| Groen — Werkend | Alle verplichte controles zijn recent geslaagd |
| Oranje — Actie nodig | Gedeeltelijk geconfigureerd, controle verouderd of handmatige stap open |
| Rood — Verbroken | Een verplichte controle faalt |
| Blauw — Gepland | Wel geregistreerd, nog niet aangesloten |
| Grijs — Niet gecontroleerd | Nog geen geldig bewijs op dit apparaat |
| Donkergrijs — Gepauzeerd | Bewust niet actief; geen storing |

“Recent” is profielafhankelijk: lokale config bijvoorbeeld 30 dagen, workflowgezondheid 24 uur en een abonnementshandmatige controle 90 dagen.

## Dashboardweergave

De bestaande Connections-pagina wordt uitgebreid tot **Koppelingen & software** met:

1. **Samenvattingsbalk** — totaal, werkend, actie nodig, verbroken, gepland en niet gecontroleerd.
2. **Voortgang** — percentage actieve/geplande koppelingen dat volledig is geverifieerd.
3. **Filters** — MCP, API, webhook, databron, software; apparaat; runtime; kostenmodel; status.
4. **Koppelingskaarten** — doel, status, laatste controle, apparaten, runtimes, kosten en eerstvolgende actie.
5. **Detailpaneel** — verwachte situatie, laatste probes per apparaat, afhankelijkheden, geschiedenis en relevante `[[wikilinks]]`.
6. **Actielijst** — concrete open stappen, gesorteerd op blokkade en impact.
7. **Controleknop** — start uitsluitend goedgekeurde read-only probes; geen automatische rotatie, login of externe schrijfactie.

Voor n8n worden twee verschillende relaties zichtbaar gehouden:

- `n8n-mcp`: toegang van een agentruntime tot MCP-tools;
- `n8n-public-api`: read-only workflow- en uitvoeringsstatus voor de Cockpit.

Deze gebruiken verschillende tokens en worden nooit als uitwisselbaar gepresenteerd.

## Eerste inventarisatiebatch

De initiële registervulling wordt in drie groepen gecontroleerd:

### Groep 1 — technisch aanwezig

- n8n MCP;
- Firecrawl MCP/API;
- Todoist API;
- Calendar iCal;
- Jortt API;
- Perplexity API;
- Google Drive/Docs/Sheets/Calendar-connectors;
- n8n Public API, indien Sander die wil activeren.

### Groep 2 — workflows en platformkoppelingen

- Google Contacts via n8n;
- Google Forms/Sheets/Drive voor D.T. Irritant;
- Teambeheer als publieke databron;
- Plug&Pay-, PostNL- en verzendworkflows;
- bunq/Jortt-bonnetjesroute.

### Groep 3 — software zonder betrouwbare technische probe

- Obsidian/myPKA;
- Claude en Codex;
- LastPass en macOS Keychain;
- Canva;
- Formflow;
- Huddle;
- WordPress en Uncanny Automator;
- Plug&Pay, Jortt, bunq en Dropbox als abonnement/platform.

Groep 3 begint met handmatige verificatie en kan later een API-probe krijgen.

## Controleproces

1. **Inventariseren:** bestaande bronnen verzamelen en iedere vermelding classificeren als bevestigd, verouderd, gepland of dubbel.
2. **Normaliseren:** één `integration_id` en één canonieke detailbron per koppeling vastleggen.
3. **Verwachting vastleggen:** apparaten, runtimes, authvorm, kosten en gewenste status invullen.
4. **Veiligheid beoordelen:** bepalen welke read-only probe is toegestaan en welke gegevens nooit mogen worden opgeslagen.
5. **Lokaal controleren:** probes per apparaat draaien en resultaten lokaal registreren.
6. **Handmatig aanvullen:** alleen waar geen veilige probe bestaat.
7. **Dashboard beoordelen:** rode/oranje kaarten omzetten naar concrete acties.
8. **Periodiek herhalen:** snelle controles dagelijks of bij dashboardopening; diepere controles wekelijks/maandelijks volgens profiel.

## Installatie- en wijzigingsgrenzen

- De formele Cockpit-installatie volgt `Expansions/mypka-cockpit/INSTALL.md`, inclusief disclaimer, expliciete toestemming, back-up en het aanbod voor de SQLite-upgrade.
- De server wordt nooit automatisch gestart; Sander start hem zelf via de gegenereerde launcher.
- De nieuwe probe-runner leeft bij de Cockpit-runtime, niet als uitvoerbare code in de portable Markdown-kern.
- Een controle mag nooit een token roteren, OAuth-toestemming verlenen, workflow activeren of externe data wijzigen.
- LastPass blijft back-up/overdracht; lokale secrets blijven per apparaat in de lokale secret store.

## Verificatiecriteria

Het ontwerp is correct geïmplementeerd wanneer:

1. iedere kaart terug te voeren is op precies één canonieke Markdown-record;
2. Mac mini en MacBook Air afzonderlijk zichtbaar zijn;
3. runtimeverschillen afzonderlijk zichtbaar zijn;
4. geen route of log secretwaarden retourneert;
5. een mislukte externe probe de Cockpit niet laat crashen;
6. n8n MCP en n8n Public API als afzonderlijke credentials verschijnen;
7. verouderde controles automatisch oranje worden;
8. alle kaarten een eerstvolgende actie of aantoonbare groene status hebben;
9. tests aantonen dat responsebodies, authheaders en secretwaarden niet worden opgeslagen;
10. de Cockpit vanaf een vers gegenereerde `mypka.db` hetzelfde register kan tonen.

## Aanbevolen fasering

### Fase 1 — Fundament

- formele Cockpit-installatie afronden;
- integratieregister en schema maken;
- bestaande inventaris normaliseren;
- register read-only in de Cockpit tonen.

### Fase 2 — Lokale controles

- machine-identiteit en observatietabel toevoegen;
- config-, secret-, proces- en veilige HTTP-probes bouwen;
- n8n MCP, Firecrawl, Todoist, iCal en Jortt als eerste end-to-end controleren.

### Fase 3 — Voortgang en onderhoud

- statusaggregatie, filters, acties en verificatiegeschiedenis toevoegen;
- geplande workflows en handmatig gecontroleerde software opnemen;
- controlefrequenties en verouderingsmeldingen activeren.

### Fase 4 — Tweede apparaat

- dezelfde loader/probe-runner op de MacBook Air installeren;
- resultaten per apparaat vergelijken;
- ontbrekende lokale secrets of runtimeadapters gericht aanvullen.

## Buiten scope voor versie 1

- automatisch aankopen of abonnementen beheren;
- tokens automatisch uit LastPass ophalen;
- OAuth-consents automatisch doorlopen;
- externe workflows activeren of herstellen;
- onbeperkte netwerk- of poortscans;
- één centraal cloud-dashboard met secrets van beide Macs;
- voedingdatabronnen aansluiten; die worden wel als `planned` geregistreerd.

## Beslispunt

Aanbevolen is aanpak **C**: Markdown als portable register, lokale machinestatus in de Cockpit-database en één visuele Cockpit-pagina die beide combineert. Na goedkeuring volgt eerst een zelfstandig uitvoerbaar implementatieplan. Voor de daadwerkelijke Cockpit-installatie worden daarna de verplichte disclaimer-, toestemmings- en back-upstappen afzonderlijk doorlopen.
