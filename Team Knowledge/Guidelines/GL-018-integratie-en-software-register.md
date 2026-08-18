---
id: GL-018
title: Integratie- en softwareregister
status: active
owner: daedalus
last_verified: 2026-08-16
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
