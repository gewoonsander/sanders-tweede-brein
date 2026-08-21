---
id: GL-018
title: Integratie- en softwareregister
status: active
owner: daedalus
last_verified: 2026-08-21
merged_from: software-en-tools (2026-08-16)
---

# GL-018 — Integratie- en softwareregister

Dit is de portable single source of truth voor de externe koppelingen en
belangrijke software rond Sanders myPKA. De Cockpit leest het gemarkeerde
JSON-blok hieronder. JSON is hier bewust gekozen boven uitvoerbare code of een
nieuwe parserdependency: het blijft leesbare Markdown en kan strikt worden
gevalideerd.

MCP-transport, endpoint en secretcontract leven canoniek in
[[GL-017-mcp-service-register]]. Een MCP-record hieronder verwijst daarnaar en
kopieert die feiten niet.

## Wat hoort hier wel en niet in

Een tool krijgt een record wanneer hij (1) een dienst, account of gegevensverzameling
buiten de agentruntime bereikt, én (2) berust op een persistente toestemming die los
intrekbaar is en stilzwijgend kan verlopen of blijven hangen. Beide vragen ja, anders
geen record.

De tweede vraag is de scherpe. Dit register bestaat om koppelingen te volgen die kunnen
wegdrijven zonder dat iemand het merkt — daarom heeft elk record een `lifecycle`, een
`next_action` en een `verification_profile`.

Capabilities van de agentruntime zelf krijgen géén record: schermbediening
(`computer-use`), sessie-introspectie (`ccd_session_mgmt`), de takenlijst van de host
(`scheduled-tasks`) en registry-zoekacties (`mcp-registry`). Die vragen toestemming per
gebruik en kunnen dus niet ongemerkt wegdrijven — precies wat dit register wél moet
signaleren. Een record ervoor zou permanent groen en actieloos zijn en de echte
signalen verdunnen.

Grensgeval, en daarom expliciet: browserbesturing valt wél onder het register, omdat de
toestemming persistent is en de tool de staande inlogsessies van derden erft.

## Statusregels

- `idea`: mogelijk nuttig, nog geen besluit.
- `planned`: besloten of ontworpen, nog niet aangesloten.
- `configured`: configuratie is aanwezig, werking nog niet bewezen.
- `active`: recent bewijs van werking is beschikbaar.
- `paused`: bewust tijdelijk uit.
- `retired`: niet meer gebruiken.

`configured` is nooit hetzelfde als `active`. Alleen een geldige probe of een
gedateerde handmatige controle kan een koppeling operationeel groen maken.

## Eigenaarschapsvelden

- `data_role` bepaalt of de toepassing bron, bestemming, processor,
  presentatielaag of kluis is.
- `sync_direction` wordt bekeken vanuit myPKA: `import` komt naar myPKA,
  `export` vertrekt vanuit myPKA en `none` verplaatst geen canonieke records.
- `canonical_records` noemt uitsluitend recordtypen waarvoor de externe
  toepassing de aangewezen operationele bron is. Een lege lijst betekent dat
  myPKA of een andere bron eigenaar blijft.
- `adapter_refs` bevat stabiele afgeleide adapternamen, nooit providerbeleid,
  machinepaden of credentials.
- `conflict_policy` is standaard `canonical-wins`. `manual-review` is verplicht
  wanneer twee kanten een wijziging kunnen voorstellen. Stil `last-write-wins`
  is verboden.

## Toegestane veldwaarden (enums)

Het JSON-blok hieronder wordt strikt gevalideerd door
`Expansions/mypka-cockpit/server/integrationRegistry.js`. Eén ongeldige waarde
laat het hele register vallen: de Cockpit-pagina *Koppelingen & software* geeft
dan HTTP 500 en toont geen enkele integratie meer. Gebruik uitsluitend:

| Veld | Toegestane waarden |
|---|---|
| `kind` | `mcp` · `api` · `webhook` · `data-source` · `software` |
| `lifecycle` | `idea` · `planned` · `configured` · `active` · `paused` · `retired` |
| `cost_model` | `free` · `paid` · `lifetime` · `included` · `usage-based` · `unknown` |
| `data_role` | `source` · `destination` · `processor` · `presentation` · `vault` |
| `sync_direction` | `none` · `import` · `export` · `bidirectional` |
| `conflict_policy` | `canonical-wins` · `manual-review` |
| `verification_profile` | `config-present` · `secret-present` · `mcp-registration` · `connector-readonly` · `process-health` · `manual` |

Let op bij `cost_model`: een eenmalige, eeuwigdurende aankoop is `lifetime`
(niet `paid-onetime` — die waarde bestaat niet en blokkeerde op 2026-08-18 het
hele dashboard).

Aanvullende regels die de validator afdwingt: `integration_id` is
kleine letters/cijfers/koppeltekens, `secret_names` is HOOFDLETTERS met
underscores, elke `dependencies`-verwijzing moet naar een bestaand
`integration_id` wijzen, `canonical_records` mag alleen bij `data_role: source`
(en die vereist `sync_direction` `import` of `bidirectional`), en
`bidirectional` vereist `conflict_policy: manual-review`.

## Register

<!-- integration-register:start -->
```json
{
  "schema_version": 2,
  "integrations": [
    {
      "integration_id": "n8n-mcp",
      "name": "n8n MCP",
      "kind": "mcp",
      "purpose": "Agenttoegang tot het inventariseren en beheren van automatiseringsworkflows.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop",
        "portable-computer"
      ],
      "expected_runtimes": [
        "local-agent-runtime"
      ],
      "auth_method": "bearer",
      "secret_names": [
        "N8N_MCP_TOKEN"
      ],
      "cost_model": "included",
      "verification_profile": [
        "config-present",
        "secret-present",
        "mcp-registration"
      ],
      "dependencies": [],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Installeer het actuele token lokaal en verifieer de toolinventaris per runtime.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [
        "runtime-mcp:n8n-mcp"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "firecrawl-mcp",
      "name": "Firecrawl MCP",
      "kind": "mcp",
      "purpose": "Webpagina's als machineleesbare inhoud ophalen wanneer normale webtoegang tekortschiet.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "local-agent-runtime"
      ],
      "auth_method": "api-key",
      "secret_names": [
        "FIRECRAWL_API_KEY"
      ],
      "cost_model": "paid",
      "verification_profile": [
        "config-present",
        "secret-present",
        "mcp-registration"
      ],
      "dependencies": [],
      "canonical_reference": "firecrawl",
      "next_action": "Verifieer de toolinventaris en één openbare read-only ophaalactie per runtime.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "web-content"
      ],
      "adapter_refs": [
        "runtime-mcp:firecrawl-mcp"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "davinci-resolve-mcp",
      "name": "DaVinci Resolve MCP",
      "kind": "mcp",
      "purpose": "DaVinci Resolve Studio aansturen vanuit de agentruntime: media importeren, timelines bouwen, retimen, graden, Fusion opbouwen en renderen.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "portable-computer"
      ],
      "expected_runtimes": [
        "local-agent-runtime"
      ],
      "auth_method": "none",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "config-present",
        "mcp-registration"
      ],
      "dependencies": [
        "davinci-resolve-studio"
      ],
      "canonical_reference": "davinci-resolve",
      "next_action": "Na herstart van de runtime de toolinventaris ophalen en resolve_control read-only aanroepen; daarna lifecycle op active zetten.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [
        "runtime-mcp:davinci-resolve"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "davinci-resolve-studio",
      "name": "DaVinci Resolve Studio",
      "kind": "software",
      "purpose": "Videomontage, kleurbewerking, Fusion-compositing en export van social video.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [
        "portable-computer"
      ],
      "expected_runtimes": [],
      "auth_method": "license-key",
      "secret_names": [],
      "cost_model": "lifetime",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "davinci-resolve",
      "next_action": "Geen. Versie 20.3.2.9 geverifieerd op 2026-08-17 via de scripting-API.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "n8n-public-api",
      "name": "n8n Public API",
      "kind": "api",
      "purpose": "Read-only workflow- en uitvoeringsstatus aan de Cockpit leveren.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "api-key",
      "secret_names": [
        "N8N_API_KEY"
      ],
      "cost_model": "included",
      "verification_profile": [
        "secret-present",
        "connector-readonly"
      ],
      "dependencies": [
        "mypka-cockpit"
      ],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Verifieer periodiek een read-only workflowlijst via de Cockpit.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "workflow-status"
      ],
      "adapter_refs": [
        "cockpit:n8n-workflows"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "todoist-api",
      "name": "Todoist API",
      "kind": "api",
      "purpose": "Open taken read-only in agenda en planning tonen.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "api-key",
      "secret_names": [
        "TODOIST_API_KEY"
      ],
      "cost_model": "included",
      "verification_profile": [
        "secret-present",
        "connector-readonly"
      ],
      "dependencies": [
        "mypka-cockpit"
      ],
      "canonical_reference": "GL-014-todoist-taakformat",
      "next_action": "Voer een read-only lijstcontrole uit.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "tasks"
      ],
      "adapter_refs": [
        "cockpit:todoist"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "calendar-ical",
      "name": "Agenda via iCal",
      "kind": "data-source",
      "purpose": "Agenda-items read-only in dagstart en Cockpit tonen.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "private-url",
      "secret_names": [
        "CALENDAR_ICAL_URL"
      ],
      "cost_model": "included",
      "verification_profile": [
        "secret-present",
        "connector-readonly"
      ],
      "dependencies": [
        "mypka-cockpit"
      ],
      "canonical_reference": "dagstart",
      "next_action": "Controleer of een actuele week veilig kan worden gelezen.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "calendar-events"
      ],
      "adapter_refs": [
        "cockpit:ical"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "jortt-api",
      "name": "Jortt API",
      "kind": "api",
      "purpose": "Factuur- en later geldstatusgegevens read-only ontsluiten.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "oauth-client-credentials",
      "secret_names": [
        "JORTT_GEWOON_SANDER_CLIENT_ID",
        "JORTT_GEWOON_SANDER_CLIENT_SECRET"
      ],
      "cost_model": "included",
      "verification_profile": [
        "secret-present",
        "connector-readonly"
      ],
      "dependencies": [
        "mypka-cockpit"
      ],
      "canonical_reference": "jortt",
      "next_action": "Verifieer scopes en een minimale read-only factuurlijst.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "invoices"
      ],
      "adapter_refs": [
        "cockpit:jortt"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "perplexity-api",
      "name": "Perplexity API",
      "kind": "api",
      "purpose": "Tweede onderzoekspad voor bronverificatie.",
      "lifecycle": "configured",
      "owner": "athena",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "local-agent-runtime"
      ],
      "auth_method": "api-key",
      "secret_names": [
        "PERPLEXITY_API_KEY"
      ],
      "cost_model": "usage-based",
      "verification_profile": [
        "secret-present",
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "2026-07-05-23-38_hermes_modus-facebook-rdb-vervolg-firecrawl-voorkeur",
      "next_action": "Controleer accountstatus en noteer laatste geslaagde onderzoeksaanroep.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [
        "runtime-api:perplexity"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "google-contacts-n8n",
      "name": "Google Contacts via n8n",
      "kind": "webhook",
      "purpose": "PKM-contacten gecontroleerd naar Google Contacts sturen.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "automation-platform"
      ],
      "auth_method": "webhook-plus-oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [
        "n8n-mcp"
      ],
      "canonical_reference": "sync-contact-to-google",
      "next_action": "Controleer read-only of de workflow nog bestaat; geen testcontact aanmaken.",
      "data_role": "destination",
      "sync_direction": "export",
      "canonical_records": [],
      "adapter_refs": [
        "n8n:sync-contact-to-google"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "google-people-api-mcp",
      "name": "Google People API (MCP-connector)",
      "kind": "mcp",
      "purpose": "Leestoegang voor Hermes tot Google Contacts (contacts.readonly), zodat vóór een nieuwe PKM/CRM-stub eerst gecontroleerd kan worden of een contact al bestaat.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "2026-06-23-00-13_Larry_google-contacts-koppeling-en-darts-onderzoek",
      "next_action": "Bevestigd door Argus 2026-08-16: scopes minimaal (contacts.readonly + userinfo.profile), geen lokaal secret aangetroffen (repo-brede grep schoon), geen GL-017-entry nodig — volledig cloud-managed bij claude.ai/Google, geen lokaal MCP-transport. Revocatiepad: claude.ai Instellingen → Connectors → disconnect, of Google Account → Beveiliging → Derdenapp-toegang → verwijderen, of Google Cloud Console → OAuth-client verwijderen/roteren.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:google-contacts"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "gmail-connector",
      "name": "Gmail (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Leestoegang tot Sanders Gmail: threads zoeken en lezen, labels opvragen en de conceptenlijst raadplegen. Draagt de mailkant van Pieter Posts triage- en antwoordwerk.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "SOP-019-controleer-integraties-en-software",
      "next_action": "Verbinding visueel bevestigd door Sander op 2026-08-21 op de claude.ai Connectors-pagina. In de lokale permissieset staan uitsluitend leestools (search_threads, get_thread, list_labels, list_drafts); of deze connector ook conceptmails kan aanmaken is lokaal niet vast te stellen. Stel de volledige toolinventaris vast en werk data_role en sync_direction bij zodra daar schrijftools in blijken te zitten.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:gmail"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "google-drive-connector",
      "name": "Google Drive (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Leestoegang tot Google Drive: bestanden zoeken, metadata en rechten opvragen en bestandsinhoud uitlezen. Grote bestanden lopen bewust buiten deze connector om via rclone.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "SOP-019-controleer-integraties-en-software",
      "next_action": "Verbinding visueel bevestigd door Sander op 2026-08-21. Alleen leestools waargenomen (search_files, read_file_content, get_file_metadata, get_file_permissions, list_recent_files). Houd de werkverdeling met rclone in stand: grote bestanden blijven buiten deze connector om.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:google-drive"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "google-calendar-connector",
      "name": "Google Calendar (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Leestoegang tot Sanders Google Agenda's: agenda's en afspraken opvragen voor dagstart en planning. Aparte draad naast de iCal-feed die de Cockpit leest.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "dagstart",
      "next_action": "Verbinding visueel bevestigd door Sander op 2026-08-21. Alleen leestools waargenomen (list_calendars, list_events, get_event). Bepaal welke van de twee agenda-draden leidend is voor dagstart, zodat deze connector en calendar-ical niet ongemerkt uiteen gaan lopen; calendar-ical blijft eigenaar van de canonieke calendar-events.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:google-calendar"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "todoist-connector",
      "name": "Todoist (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Volledige agenttoegang tot Todoist: taken en projecten zoeken en filteren, maar ook taken aanmaken, bijwerken en afronden, plus productiviteits- en projectstatistieken. Aparte draad naast de read-only API-key-koppeling van de Cockpit.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Schrijfbeleid en verboden capabilities staan canoniek in GL-017-mcp-service-register. Beide punten uit die review zijn opgelost op 2026-08-21: delete-object/add-projects staan niet meer in de allow-lijst en zitten in het deny-blok van .claude/settings.json; de matcher van check-todoist-taakformat.py dekt nu ook update-tasks naast add-tasks. Zelfstandig nagemeten, geen openstaande actie op dit record.",
      "data_role": "source",
      "sync_direction": "bidirectional",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:todoist"
      ],
      "conflict_policy": "manual-review"
    },
    {
      "integration_id": "dropbox-connector",
      "name": "Dropbox (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Officiele Dropbox-connector op claude.ai voor toegang tot Sanders Dropbox-bestanden. Staat volledig los van de zelfgebouwde portable Dropbox-MCP (dropbox-mcp), die nooit is geactiveerd.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "SOP-019-controleer-integraties-en-software",
      "next_action": "Verbinding visueel bevestigd door Sander op 2026-08-21 op de claude.ai Connectors-pagina; er is nog geen toolaanroep of toolinventaris vastgelegd en de tools zijn niet in de lokale permissieset gezien. Haal de toolinventaris op en stel vast of er schrijftools in zitten; zo ja, dan moeten sync_direction en conflict_policy worden bijgesteld.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:dropbox"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "dropbox-mcp",
      "name": "Dropbox MCP (eigen portable server)",
      "kind": "mcp",
      "purpose": "Zelfgebouwde portable Dropbox-MCP-server uit GL-017. De code is gebouwd en op beveiliging beoordeeld, maar er is nooit een OAuth-verbinding tot stand gekomen en geen enkele agentruntime heeft de server geregistreerd.",
      "lifecycle": "paused",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "2026-08-12-08-25_hermes_dropbox-traject-gepauzeerd",
      "next_action": "Alleen hervatten wanneer Sander er expliciet om vraagt; het traject strandde op 2026-08-12 omdat er geen Dropbox-app kon worden aangemaakt. Er zijn geen tokens of secrets opgeslagen. Let op: de inmiddels wel verbonden claude.ai-connector (dropbox-connector) is een andere draad en maakt deze server niet vanzelf overbodig.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "canva-connector",
      "name": "Canva (claude.ai-connector)",
      "kind": "mcp",
      "purpose": "Canva-connector op claude.ai voor ontwerpwerk vanuit de agentruntime. De abonnements- en accountkant blijft in het aparte canva-record staan.",
      "lifecycle": "active",
      "owner": "harmonia",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [
        "canva"
      ],
      "canonical_reference": "canva",
      "next_action": "Verbinding visueel bevestigd door Sander op 2026-08-21; hiermee is de openstaande vraag uit het canva-record beantwoord dat de optionele connector beschikbaar is. Nog geen toolinventaris of aanroep vastgelegd: haal die op en beoordeel of publiceer- of verwijderacties bevestigingsplichtig moeten worden.",
      "data_role": "destination",
      "sync_direction": "export",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:canva"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "github-connector",
      "name": "GitHub (claude.ai-connector, niet aangesloten)",
      "kind": "mcp",
      "purpose": "GitHub-integratie die als optie klaarstaat op de claude.ai Connectors-pagina maar niet is verbonden. Opgenomen zodat de optie bekend is en niet bij iedere audit opnieuw wordt uitgezocht.",
      "lifecycle": "idea",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "unknown",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "SOP-019-controleer-integraties-en-software",
      "next_action": "Op 2026-08-21 gezien als niet-verbonden optie (Connect-knop, geen vinkje). Er is geen besluit genomen: laat Sander bepalen of hij agenttoegang tot zijn GitHub-repositories wil voordat er iets wordt aangesloten.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "claude-in-chrome",
      "name": "Claude in Chrome (browserbesturing)",
      "kind": "mcp",
      "purpose": "Leest en navigeert webpagina's in Sanders eigen Chrome, met de rechten van elke sessie waarin hij daar is ingelogd. Waargenomen tools: find, get_page_text, navigate, read_page, read_console_messages, read_network_requests en tabs_context_mcp.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "browser-extension",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Verbinding bevestigd door Sander op 2026-08-21. Laat Argus vaststellen of read_network_requests autorisatieheaders van de open pagina kan blootleggen, en of de klik- en typtools van de extensie buiten de lokale permissieset alsnog beschikbaar zijn. Ruim daarbij de drie aliassen op (claude-in-chrome, Claude_in_Chrome, Claude_Browser) met verschillende rechten voor een dienst; GL-017-regel 1 eist een service_id. GL-017 heeft nog geen entry: die verwijzing wijst vooruit.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:claude-in-chrome"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "dt-irritant-forms",
      "name": "D.T. Irritant Forms-automatisering",
      "kind": "webhook",
      "purpose": "Wedstrijden uit Teambeheer omzetten naar beschikbaarheidsformulieren en overzichten.",
      "lifecycle": "configured",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "automation-platform"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [
        "teambeheer-source"
      ],
      "canonical_reference": "project_dt-irritant-beschikbaarheid-automatisering",
      "next_action": "Koppel Google OAuth2-credential aan de Forms/Drive-nodes en maak het antwoorden-Sheet aan, dan createForm=true.",
      "data_role": "processor",
      "sync_direction": "export",
      "canonical_records": [],
      "adapter_refs": [
        "n8n:dt-irritant-forms"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "teambeheer-source",
      "name": "Teambeheer",
      "kind": "data-source",
      "purpose": "Inhoudelijke bron voor dartswedstrijden en teamsamenstelling.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "automation-platform"
      ],
      "auth_method": "public-web",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "project_dt-irritant-beschikbaarheid-automatisering",
      "next_action": "Blijf seizoen en paginavorm bij iedere gerichte synchronisatie controleren.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "darts-matches",
        "team-roster"
      ],
      "adapter_refs": [
        "n8n:teambeheer-import"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "apple-podcasts",
      "name": "Apple Podcasts (lokale spiegel)",
      "kind": "data-source",
      "purpose": "Luisterstatus uit Apple Podcasts spiegelen naar de Cockpit: de LaunchAgent nl.gewoonsander.podcast-sync leest de lokale CoreData-store (die iCloud vanaf de iPhone vult) read-only en schrijft abonnementen en afleveringen naar mypka.db. Alleen shows met ZSUBSCRIBED = 1.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [
        "portable-computer"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "local-file-readonly",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [
        "mypka-cockpit"
      ],
      "canonical_reference": "SOP-019-controleer-integraties-en-software",
      "next_action": "Op 2026-08-21 geladen aangetroffen op de MacBook Air (interval 300s). Controleer of dezelfde LaunchAgent ook op de Mac mini draait en vul expected_devices dan aan; dat is nog niet vastgesteld.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "podcast-subscriptions",
        "podcast-episodes"
      ],
      "adapter_refs": [
        "cockpit:podcasts"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "mypka-cockpit",
      "name": "myPKA Cockpit",
      "kind": "software",
      "purpose": "Lokaal dashboard over de Markdownkennis en lokale operationele status.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [
        "primary-desktop",
        "portable-computer"
      ],
      "expected_runtimes": [
        "mypka-cockpit"
      ],
      "auth_method": "local-loopback",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "config-present",
        "process-health"
      ],
      "dependencies": [],
      "canonical_reference": "2026-08-11-integratiecontrole-cockpit-design",
      "next_action": "Gebruik GL-018 als register en houd alleen lokale controlegeschiedenis in de Cockpit bij.",
      "data_role": "presentation",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [
        "cockpit:integrations"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "lastpass",
      "name": "LastPass",
      "kind": "software",
      "purpose": "Versleutelde back-up en overdracht van MCP-tokens.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [
        "primary-desktop",
        "portable-computer"
      ],
      "expected_runtimes": [],
      "auth_method": "account",
      "secret_names": [],
      "cost_model": "unknown",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Behouden; bevestig periodiek dat de actuele herstelkopieën aanwezig zijn. Verlengbesluit bevestigd door Sander op 2026-08-14.",
      "data_role": "vault",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "formflow",
      "name": "Formflow",
      "kind": "software",
      "purpose": "Interactieve formulieren, intakes en leadfunnels.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "account",
      "secret_names": [],
      "cost_model": "lifetime",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "formflow",
      "next_action": "Controleer elk kwartaal credits, actieve flows en AVG-geschiktheid.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "form-responses"
      ],
      "adapter_refs": [
        "n8n:formflow-import"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "canva",
      "name": "Canva",
      "kind": "software",
      "purpose": "Ontwerp en publicatiemateriaal maken.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [],
      "expected_runtimes": [
        "optional-design-connector"
      ],
      "auth_method": "account-oauth",
      "secret_names": [],
      "cost_model": "paid",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "canva",
      "next_action": "Verifieer per agentruntime of de optionele connector beschikbaar is.",
      "data_role": "destination",
      "sync_direction": "export",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "huddle",
      "name": "Huddle",
      "kind": "software",
      "purpose": "Community en e-learning voor DartsCoaching en Dart Buddies.",
      "lifecycle": "active",
      "owner": "martonny",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "account",
      "secret_names": [],
      "cost_model": "paid",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "dartscoaching-nl",
      "next_action": "Noteer laatste handmatige platformcontrole.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "community-memberships",
        "course-content"
      ],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "plugandpay",
      "name": "Plug&Pay",
      "kind": "software",
      "purpose": "Betaalpagina's en verkoop van Darttactiek.",
      "lifecycle": "active",
      "owner": "tonnymart",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "account",
      "secret_names": [],
      "cost_model": "paid",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "plugandpay",
      "next_action": "Controleer verkooproute en langetermijnbesluit over consolidatie.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "orders",
        "subscriptions"
      ],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "plugandpay-mcp",
      "name": "Plug&Pay MCP (custom connector)",
      "kind": "mcp",
      "purpose": "Agenttoegang tot beide Plug&Pay-shops onder een enkele OAuth-login: orders, checkouts, producten, formulieren en promoties opzoeken (lezen), en pagina's, funnels en checkouts aanmaken, wijzigen, publiceren of verwijderen (schrijven). Elke toolaanroep vereist een expliciete shop_id: 21766 (Dartbuddies.online, boek-account) of 33052 (www.dartscoaching.nl, dartscoaching-praktijk).",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "claude-ai-connector",
        "local-agent-runtime"
      ],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [
        "plugandpay"
      ],
      "canonical_reference": "GL-017-mcp-service-register",
      "next_action": "Transport, scope, risicoklasse, shop_id-beleid en revocatiepad staan canoniek in GL-017-mcp-service-register; hier niet dupliceren. Eerstvolgende actie: draai de healthcheck uit dat contract (list-shops moet exact 21766 en 33052 geven, en de grep op de settings-bestanden moet 0 blijven) voordat er ooit een schrijftool wordt aangeroepen. Een mcp-registration-probe kan hier niet slagen: er is geen .mcp.json-entry.",
      "data_role": "source",
      "sync_direction": "bidirectional",
      "canonical_records": [],
      "adapter_refs": [
        "claude-connector:plugandpay"
      ],
      "conflict_policy": "manual-review"
    },
    {
      "integration_id": "bunq-api",
      "name": "bunq API",
      "kind": "api",
      "purpose": "Bonnetjes en transacties voor het Gezinshuis koppelen.",
      "lifecycle": "planned",
      "owner": "daedalus",
      "expected_devices": [],
      "expected_runtimes": [
        "automation-platform"
      ],
      "auth_method": "api-key",
      "secret_names": [],
      "cost_model": "included",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "bunq",
      "next_action": "Beslis pas na security- en boekhoudkundige review over aansluiting.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "bank-transactions"
      ],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "voedingsdata-nederland",
      "name": "Nederlandse voedingsdatalaag",
      "kind": "data-source",
      "purpose": "Voedingsschattingen verifiëren met Nederlandse en open bronnen.",
      "lifecycle": "planned",
      "owner": "athena",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [
        "food-capture"
      ],
      "auth_method": "mixed",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "2026-08-11-voedingsdata-bronnen-nederland-onderzoek",
      "next_action": "Importeer NEVO lokaal en ontwerp daarna Open Food Facts als productfallback.",
      "data_role": "source",
      "sync_direction": "import",
      "canonical_records": [
        "nutrition-reference-data"
      ],
      "adapter_refs": [
        "food:reference-import"
      ],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "affinity-suite",
      "name": "Affinity Suite (Photo/Designer/Publisher)",
      "kind": "software",
      "purpose": "Professionele designsoftware als alternatief voor Adobe, gebruikt in combinatie met Canva.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [
        "primary-desktop"
      ],
      "expected_runtimes": [],
      "auth_method": "license",
      "secret_names": [],
      "cost_model": "unknown",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "software-en-tools",
      "next_action": "Licentievorm vaststellen (V2 Universal of losse apps).",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "wpmu-dev",
      "name": "WPMU Dev",
      "kind": "software",
      "purpose": "Dedicated hosting en premium plugins voor de RDB-website (rivierenlanddartsbond.nl) en andere WordPress-projecten.",
      "lifecycle": "active",
      "owner": "sander",
      "expected_devices": [],
      "expected_runtimes": [],
      "auth_method": "account",
      "secret_names": [],
      "cost_model": "paid",
      "verification_profile": [
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "software-en-tools",
      "next_action": "Periodiek DNS, statistieken en plugin-updates controleren.",
      "data_role": "destination",
      "sync_direction": "export",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    },
    {
      "integration_id": "rclone",
      "name": "rclone",
      "kind": "software",
      "purpose": "Grote bestanden rechtstreeks van/naar Google Drive verplaatsen buiten de LLM-context om — nodig omdat de Drive-MCP-koppeling alleen kleine bestanden aankan.",
      "lifecycle": "active",
      "owner": "daedalus",
      "expected_devices": [
        "portable-computer"
      ],
      "expected_runtimes": [],
      "auth_method": "oauth",
      "secret_names": [],
      "cost_model": "free",
      "verification_profile": [
        "config-present",
        "manual"
      ],
      "dependencies": [],
      "canonical_reference": "software-en-tools",
      "next_action": "Ook installeren op de Mac mini; op termijn eigen Google OAuth-client aanmaken vóór de gedeelde rclone-client-ID in 2026 wordt uitgefaseerd.",
      "data_role": "processor",
      "sync_direction": "none",
      "canonical_records": [],
      "adapter_refs": [],
      "conflict_policy": "canonical-wins"
    }
  ]
}
```
<!-- integration-register:end -->

## Lokale LaunchAgents die Team Inbox bewaken

Ontstaan op 2026-08-16 nadat een sessie op het punt stond een derde, onbewuste
automatisering op `Team Inbox/Audio Captures/` te bouwen terwijl er al twee
bestonden. **Check deze tabel altijd voordat je een nieuwe watcher op een Team
Inbox-(sub)map bouwt of een bestaande aanpast.** Dit is géén complete
LaunchAgent-inventaris (er draaien meer `nl.gewoonsander.*` agents dan
hieronder staan) — alleen de agents die `Team Inbox/` bewaken zijn hier
geverifieerd.

| LaunchAgent | Script | Bewaakt | Doet | Status |
|---|---|---|---|---|
| `nl.gewoonsander.downloads-router` | `Expansions/downloads-router/route_downloads.sh` | `~/Downloads` | Routeert screenshot-shaped bestanden naar `Team Inbox/Screenshots/`, documenten naar `Team Inbox/Documents/` | active |
| `nl.gewoonsander.audio-transcribe` | `Expansions/audio-transcribe/transcribe_inbox.sh` | `Team Inbox/Audio Captures/` (audiobestanden: m4a/wav/mp3/aiff) | Whisper-transcriptie, Larry/Haiku-classificatie naar Journal/CRM/Project/MyLife (Deliverables als audit trail), schrijft transcript ook als `.txt` terug in dezelfde map voor `food-capture`, archiveert bronaudio naar Mediahub | active |
| `nl.gewoonsander.food-capture` | `Expansions/mypka-cockpit/scripts/watch-food-inbox.py` → `process-food-capture.py` → `food_log.py` | `Team Inbox/Documents/` (foto's) en `Team Inbox/Audio Captures/` (`.txt`/`.md`) | Claude-classificatie eten/niet-eten, filet direct in het canonieke voedingslogboek (`PKM/Journal/.../*-voedingslogboek.md`), ruimt verwerkte `.txt`-transcripten op | active — canonieke voedingspijplijn |
| `nl.gewoonsander.food-photo-classify` | `~/classify_food_inbox.sh` | `Team Inbox/Documents/` (foto's) | "Aanpak A"-prototype: Claude Vision-classificatie, schreef naar `Team Inbox/Voeding/*.food.md` | **retired (2026-08-16)** — plist verplaatst naar `.plist.disabled` + `launchctl bootout`. Op 2026-08-11 was al besloten dit uit te zetten en gebeurde dat met een kale `launchctl unload`, maar zonder de plist te verwijderen/hernoemen laadt macOS 'm bij de eerstvolgende her-login/herstart gewoon weer — en dat is ook gebeurd: het script verwerkte nog een foto op 2026-08-13 en liet weer een verweesd `.food.md`-bestand achter. **Les:** `launchctl unload`/`bootout` alleen is nooit persistent; een LaunchAgent écht retiren vereist het plist-bestand uit `~/Library/LaunchAgents/` te verplaatsen of te verwijderen. |

## Secretbeleid

- `secret_names` bevat uitsluitend variabelenamen.
- LastPass is back-up/overdracht; de lokale secret store is runtimebron.
- Een dashboard mag alleen `PRESENT`, `MISSING` of `NOT_CHECKED` tonen.
- Een secretwaarde, private feed-URL of responsebody is altijd verboden.
- Keychain-items en lokale observaties zijn apparaatgebonden afgeleiden en
  worden nooit teruggeschreven als canonieke registerinhoud.

## Referenties

- [[GL-017-mcp-service-register]]
- [[SOP-019-controleer-integraties-en-software]]
- [[2026-08-11-integratiecontrole-cockpit-design]]
- [[2026-08-11-een-ssot-voor-software-en-koppelingen-design]]
- [[2026-08-16-frustratie-audit]] — signaleerde dat `PKM/Documents/software-en-tools.md` los van dit register was blijven bestaan; Affinity, WPMU Dev en rclone zijn op 2026-08-16 hierin samengevoegd. Dat bestand is nu een doorverwijzing hierheen.
