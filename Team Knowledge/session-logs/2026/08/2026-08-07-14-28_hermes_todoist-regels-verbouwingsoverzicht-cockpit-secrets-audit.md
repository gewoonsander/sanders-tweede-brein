---
agent_id: hermes
session_id: 2026-08-07-vakantie-voorbereiding
timestamp: 2026-08-07T12:28:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: ["GL-014-todoist-taakformat", "GL-012-pkm-vs-todoist", "GL-011-contactenbeheer", "GL-013-interactie-enkelvoudige-keuzes"]
---

# Todoist-regels, verbouwingsoverzicht, en een cockpit/secrets-opruimronde vóór de vakantie

## Context

Ochtendsessie op de laatste werkdag voor Sander en Marieke's twee weken vakantie (vertrek zaterdag 08-08 naar De Betteld, Zelhem). Begon als een `/dagstart`, groeide uit tot een brede opruim- en verbeterronde: nieuwe Todoist-regels, het verbouwingsoverzicht voor de vier prioriteitsruimtes, een nieuw dagbesteding-systeem voor Thomas, en — grotendeels zijstromen die het onderzoeken waard bleken — een audio-inbox die vastliep, twee plaintext-secrets, en een per ongeluk verwijderde cockpit-module.

## What we did

- **Hermes** breidde `GL-014-todoist-taakformat.md` uit: verplicht persoons-label per taak (default `sander` als niemand genoemd wordt), verplichte specifieke einddatum, en pomodoro-eenheden (1 pomodoro ≈ 30 min) voor taken ≥20-25 min.
- **Hermes** fixte naamdrift uit de pre-Hermes-periode in `GL-012-pkm-vs-todoist.md` (interne id `GL-005`→`GL-012`, "Larry"→"Hermes", "Pax"→"Athena") en `GL-011-contactenbeheer.md` (id `GL-004`→`GL-011`, "Larry"→"Hermes", plus een restant in `INDEX.md`).
- **Hermes** breidde `.claude/commands/dagstart.md` uit van 5 naar 6 stappen: nieuwe Stap 2 (Verjaardagen vandaag — leest Google Calendar `BIRTHDAY`-events, stelt een persoonlijk berichtvoorstel voor op basis van het CRM-bestand) en nieuwe Stap 6 (Tijdsblokken voorstellen — zet taken met pomodoro-schatting en datum-vandaag als voorstel in de agenda, nooit automatisch).
- **Hermes** verwerkte een reeks Ralf-updates in `verbouwing-huismanstraat-34.md`: inductiekookplaat gerepareerd, oude groepenkast in de Deel al verwijderd (maakte twee openstaande punten overbodig), hoofdaansluiting-doorrekening bewust gekoppeld aan FH Team's warmtepomp-installatie (week 37) in plaats van een losse actie, plus een volledige cliëntenkamer-walkthrough en de traphal-backlog (bewust geen Todoist-taken, geen concreet moment).
- **Hermes** legde **terugkomdag 1 (vrijdag 14-08-2026)** vast en ontdekte een deadline: Francine Hansen (schoonmoeder) + partner komen de tweede vakantieweek logeren in de cliëntenkamer → er moet dan een slaapbank staan.
- **Hermes** maakte een CRM-stub voor `francine-hansen.md` (na correctie van Sander: eerst in Google Contacts checken vóór een stub — bleek niet uitvoerbaar, zie Open threads) en linkte haar in Marieke's familie-sectie.
- **Hermes** zette `PKM/My Life/Projects/thomas-overdrachtslijst-systeem.md` op — vult een wikilink die al bestond maar nooit was aangemaakt. Wekelijks donderdaglijstje (vaste + specifieke klussen, label `thomas`) plus een doorlopend logboek in `thomas-dagbesteding-klussen.md`. Eerste verslag (06-08) direct verwerkt, incl. een aandachtspunt over Thomas die steeds vaker zelf lunch koopt.
- **Hermes** onderzocht en beantwoordde een e-mail over het faillissement van fonQ (curator draagt e-mailadres + voornaam over aan Etrias Group) — Sander koos geen bezwaar te maken.
- **Hermes** schreef een WhatsApp-verjaardagsvoorstel voor Jos Wenders (D.T. Irritant-teamgenoot) op basis van zijn CRM-bestand.
- **Hermes** deed vooronderzoek naar het automatiseren van de beschikbaarheids-inventarisatie voor D.T. Irritant (Sanders dartsteam) — bevestigde dat de Teambeheer-feed voor seizoen 26-27 volledig scrapebaar is, schreef een voorstel op 3 niveaus in `project_dt-irritant-beschikbaarheid-automatisering.md`.
- **Daedalus** onderzocht hoe Hermes leestoegang tot Google Contacts kan krijgen — vond dat Google een gehoste People API MCP-server aanbiedt (toe te voegen als Custom Connector in claude.ai, geen eigen server nodig), en signaleerde en passant plaintext secrets in `.mcp.json` en de lokale macOS Contacten-toegang-blokkade.
- **Argus** deed een securityronde: fixte de Anthropic API-key die in platte tekst in de LaunchAgent-plist van `transcribe_inbox.sh` stond (nu in Keychain), en corrigeerde Daedalus' aanname dat `.mcp.json` in git zou staan (staat er niet in, wel `.gitignore`d).
- **Daedalus** loste de `.mcp.json`-secrets (n8n, Firecrawl) op: verplaatst naar Keychain, opgehaald via `launchctl setenv` (empirisch getest omdat Claude.app geen shell-profiles leest), `.mcp.json` verwijst nu naar `${N8N_MCP_TOKEN}`/`${FIRECRAWL_API_KEY}`, geverifieerd met een negatieve test (401 zonder de variabelen).
- **Hermes** vond de root cause van "audio blijft in Audio Captures staan": `transcribe_inbox.sh` transcribeerde prima maar archiveerde het bronbestand nooit. Script gepatcht (archiveert nu naar Mediahub `99_Inbox_Nog_Uitzoeken`), en de 7 al-getranscribeerde achterstallige opnames handmatig naar `05_Gezinshuis_Gewoon_Thuis/04_Audio/` verplaatst.
- **Hermes** vond en herstelde een per-ongeluk-verwijderde Audiobooks-module in de mypka-cockpit (ongecommite verwijdering tijdens de 04-08-scaffold-upgrade): 3 volledig verwijderde bestanden teruggehaald uit git, 4 registratiepunten (`server.js`, `moduleRegistry.tsx`, `LibraryView.tsx`, `Sidebar.tsx`) handmatig teruggezet zonder de overige nieuwe wijzigingen te raken, build + live-endpoint gecontroleerd (104 boeken tonen weer).
- **Hermes** draaide `/fewer-permission-prompts`: scande 50 recente transcripts, vond dat de allowlist al zeer compleet was, voegde 2 kwalificerende read-only patterns toe.
- Sander voegde zelf 28 permission-regels toe aan `settings.json` (Todoist onder een sessie-specifieke UUID, twee Gmail-acties, twee Bash-patterns).

## Decisions made

- **Question:** Moeten GL-012 (PKM vs Todoist) en GL-014 (Todoist-taakformat) samengevoegd worden?
  **Decision:** Gescheiden houden — verschillende verantwoordelijkheid (beslisregel vs. formaat), wel steviger cross-linken.
- **Question:** Todoist-taken zonder toegewezen persoon of datum — toegestaan?
  **Decision:** Nee, vanaf nu verplicht. Geen persoon genoemd → automatisch `sander`. Geen concreet moment (idee/backlog) → geen Todoist-taak, blijft PKM-notitie.
- **Question:** fonQ mag mijn e-mailadres + voornaam overdragen aan Etrias Group na het faillissement — bezwaar maken?
  **Decision:** Geen bezwaar, laten gebeuren.
- **Question:** Audio-bronbestanden na transcriptie — waar moeten ze heen als het script niet kan raden welke "pet" erbij hoort?
  **Decision:** Naar Mediahub `99_Inbox_Nog_Uitzoeken` (de bestaande SOP-013-twijfelbak), niet blijven liggen in Team Inbox en niet blind een pet raden.
- **Question:** Thomas' bredere "hoe gaat het met hem"-dossier — apart bestand of meegroeien in de klussenlijst?
  **Decision:** Voorlopig meegroeien in `thomas-dagbesteding-klussen.md`, apart bestand pas als dat te veel wordt.

## Insights

- Legacy-teamnamen (Larry, Pax) blijven opduiken in guideline-bestanden die niet in de originele 2026-06-28-opschoning zaten (GL-011, GL-012 vandaag gevonden) — bevestigt dat de in `INDEX.md` genoteerde backlog van ~15-20 PKM-bestanden met oude namen nog niet compleet is; dit soort vondsten gebeurt opportunistisch tijdens ander werk, geen systematische sweep gedaan.
- Cowork (Claude.app) leest geen shell-profiles (`~/.zshrc`/`~/.zprofile`) — elke toekomstige env-var-gebaseerde secret-oplossing moet dit incalculeren. `launchctl setenv` + een login-LaunchAgent die 'm elke keer opnieuw zet, is het nu bevestigd werkende patroon.
- De mypka-cockpit "1.5.2 selectieve integratie" (04-08-2026) liet een module (Audiobooks) stilzwijgend vallen zonder dat dit in de projectmemory werd genoteerd — de sync-data zelf (Audible → `mypka.db`) bleef intact, alleen de cockpit-laag verloor de koppeling. Waard om te onthouden dat toekomstige scaffold-pulls een module-inventarisatie vooraf/achteraf verdienen.
- `.mcp.json` is niet git-tracked (wel `.gitignore`d) — twee keer bijna verkeerd aangenomen deze sessie (eerst door Daedalus, toen door Hermes zelf voordat Argus het rechtzette). Onthouden voor toekomstige security-reviews van dit bestand.

## Realignments

- Sander corrigeerde Hermes na het aanmaken van de Francine Hansen-stub: eerst in Google Contacts checken of iemand al bestaat vóór een CRM-stub, in plaats van zelf iets verzinnen of het aan Sander vragen. Leidde tot het Daedalus-onderzoek naar een Contacts-koppeling (nog niet afgerond, zie Open threads).
- Meerdere keren tijdens deze sessie greep de GL-013 Stop-hook in op berichten die eindigden in een impliciete keuze zonder geletterde opties — bevestigt dat de hook ook "of dit, of dat"-constructies in lopende tekst detecteert, niet alleen letterlijke vraagtekens.

## Open threads

- [ ] **Kritiek, tijdgevoelig:** Sander moet Claude.app volledig afsluiten en herstarten — `launchctl setenv` bereikt geen al-lopende processen, dus tot dat gebeurt geeft n8n-mcp een 401 in lopende Cowork-sessies.
- [ ] Sander: rotatie overwegen van drie sleutels die in platte tekst hebben gestaan (Anthropic-key uit de LaunchAgent-plist, n8n bearer JWT, Firecrawl API-key) — puur hygiëne, geen bevestigde misbruik.
- [ ] Google Contacts-koppeling: Todoist-taak staat voor maandag 10-08 (`instellen > Google People API + Contacts-connector`), Sander moet de Google Cloud Console-stappen zelf doorlopen; pas daarna kan GL-011 de "eerst Contacts checken"-regel ook echt afdwingen.
- [ ] D.T. Irritant beschikbaarheid-automatisering: Todoist-taak staat voor maandag 10-08, Sander kiest een niveau (1/2/3) uit het voorstel.
- [ ] Verbouwing: aardlekklasse type A/B voor de Solis-omvormer — status onduidelijk, navragen bij Arman of dit al is meegenomen bij de overzet van de groepenkast.
- [ ] Verbouwing: "nieuwe groepen aanleggen vanuit nieuwe ElectraMat-kast (1× tuin + 2× Deel)" staat nog open in het projectbestand, niet vandaag geverifieerd.
- [ ] Mediahub `99_Inbox_Nog_Uitzoeken` krijgt vanaf nu automatisch audio-aanvoer vanuit het getranscribeerde-audio-script — Sander moet dit periodiek blijven sorteren tijdens een reguliere Mediahub-opruimronde.
- [ ] Eén audio-opname (07-08 om 11:11) stond aan het einde van de sessie nog te wachten op transcriptie door de pipeline zelf — met opzet niet aangeraakt.
- [ ] `fewer-permission-prompts` signaleerde dat de bestaande allowlist al bredere wildcards heeft dan de skill zelf zou aanraden (`git *`, `rm *`, `mv *`, `osascript *`, `launchctl *`) — niet aangepast, alleen genoteerd.

## Next steps

- Maandag 10-08 (Sander neemt een laptop mee op vakantie): Google Contacts-connector afronden, D.T. Irritant-niveau kiezen.
- Terugkomdag 1 (14-08): cliëntenkamer leeghalen, steiger opruimen, oude/nieuwe radiator wisselen, slaapbank plaatsen (deadline vóór Francine Hansen's logeerpartij in de tweede vakantieweek).
- Bij een volgende `/dagstart`: de nieuwe Stap 2 (verjaardagen) en Stap 6 (tijdsblokken) draaien nu automatisch mee.

## Cross-links

- [[2026-08-03-19-14_hermes_privekeuken-elektra-adc-sop-beveiligingsaudit-e-boekhouden]] — vorige sessie, ook al een elektra/beveiligings-mix voor de verbouwing.
