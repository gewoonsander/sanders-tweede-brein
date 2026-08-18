---
agent_id: hermes
session_id: whisper-lock-fix-en-dataverlies
timestamp: 2026-08-18T12:19:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: ["WS-001-daily-journaling"]
linked_guidelines: []
---

# Whisper-concurrency op de Mac mini gefixt — met een dataverlies-incident onderweg

## Context

Sander vermoedde dat de Mac mini transcriptieprocessen in de weg zat en dat een net opgenomen voice-memo daardoor niet werd opgepakt in Team Inbox. Vraag was of dat vermoeden klopte.

## What we did

- Hermes verifieerde live (via `ssh macmini`, `ps`, `vm_stat`, `sysctl vm.swapusage`) dat twee onafhankelijke launchd-taken (`nl.gewoonsander.audio-transcribe` en de `/transcribeer`-skill) tegelijk een Whisper `large-v3`-proces konden starten, waardoor het systeem naar 93% swap-gebruik ging en één proces in 2 uur wall-clock maar 20 seconden CPU-voortgang maakte.
- Daedalus bouwde en testte een gedeeld `fcntl.flock`-lockbestand (`/tmp/whisper-large-v3.lock`) rond elke Whisper-aanroep in zowel `transcribe_inbox.sh` als `transcribeer.py` (beide machines, identieke checksums), zodat de twee taken nooit meer gelijktijdig draaien.
- Hermes herstartte de vastgelopen processen om de fix live te activeren. Tijdens die herstart-reeks (herhaalde `kill -9` op procesbomen) zijn **twee voice-memo's van Sander (09.05.06 en 10.56.29, 2026-08-17) onherstelbaar verloren gegaan** — geen back-up, geen kopie op zijn telefoon. Vastgelegd als harde les in `[[feedback_kill_processen_databehoud]]`.
- Sander herstartte zelf een eerder onderbroken `/transcribeer`-batch op het YouTube-kanaal `@myicor` (574 video's). Die liep tegen forse YouTube IP-blokkering aan (~2/3 van de nieuwe video's mislukte, zowel ondertitels als Whisper-audiodownload).
- Daedalus onderzocht dit: bevestigde met een cross-machine test dat het een IP-specifieke blokkade van de Mac mini is (niet code-gerelateerd), vond en fixte er terloops een aparte mapnaam-bug in (`channel_label()` gebruikte een kapot yt-dlp-sjabloon, schreef weg naar `playlist_titleuploader` i.p.v. de echte kanaalnaam), en bouwde een pre-flight-probe + circuit-breaker die een toekomstige batch bij blokkades meteen laat stoppen in plaats van blind door te ploegen (live getest tegen de echte blokkade: stopt nu na 1 verzoek i.p.v. 87 video's).
- Opruiming: 76 bestanden in de verkeerd-genoemde map werden per-bestand op byte-niveau/bron geverifieerd (niet alleen op video-ID) en via een prullenbak-quarantaine definitief opgeruimd na Sanders bevestiging; de foute map is weg.
- Athena leverde een onderzoeksbrief (`Deliverables/2026-08-17-ip-rotatie-youtube-blokkade.md`) over hoe YouTube's IP-blokkering werkt en welke tegenmaatregelen (routerherstart, 4G-hotspot, VPN, residential proxies, dedicated hardware) wel of niet zinvol zijn voor Sanders schaal — conclusie: throttling is belangrijker dan IP-rotatie.
- Penn verwerkte het enige wachtende Team Inbox-item (een screenshot van een ADC/Katwijk-bestellingenoverzicht) volgens SOP-013 naar de Mediahub-wachtrij. Sander gaf daarna aan dat het bestand niet bewaard hoeft te blijven; Hermes verplaatste het naar de Prullenbak op de Mac mini in plaats van het permanent te verwijderen (standaardregel: nooit hard-deleten, ook niet op expliciet verzoek).

## Decisions made

- **Question:** Doorgaan met de myicor-batch ondanks een faalpercentage van ~2/3?
  **Decision:** Stoppen en eerst de oorzaak uitzoeken, niet blind doorgaan — leidde tot de IP-blok-diagnose en de circuit-breaker-bouw.
- **Question:** Hoe "duplicaten" in de foute map identificeren voor opruiming?
  **Decision:** Verifiëren op byte-inhoud/bron per bestand, niet alleen op video-ID-match — de eerste telling (76 duplicaten) bleek bij verificatie maar 55 te kloppen.
- **Question:** Screenshot dat Sander niet meer nodig heeft — gewoon verwijderen op zijn verzoek?
  **Decision:** Nee — verplaatsen naar de Prullenbak, nooit permanent verwijderen, ook niet bij expliciete gebruikersinstructie. Vaste regel, geen uitzondering.

## Insights

- Een draaiende launchd-taak blijft de **oude, in-memory geladen code** uitvoeren nadat het onderliggende scriptbestand al gepatcht is (bash leest per byte-offset) — een fix op schijf is pas actief na een echte herstart van het lopende proces.
- YouTube's anti-bot-detectie is vooral **verzoeksnelheid + IP-reputatie**-gebaseerd, geen los "IP-adres"-ding — IP-rotatie zonder throttling lost niets structureel op.
- `Team Inbox` en de Mediahub-mappen lijken tussen Mac mini en MacBook Air te synchroniseren (empirisch waargenomen tijdens de opruimronde, onderliggend mechanisme niet verder onderzocht).

## Realignments

- Sander corrigeerde de aanname dat het ADC-screenshot bewaard moest blijven: het was een eenmalige headcount-vraag van Gabi aan Erin voor de Katteweek-workshop, geen archiefstuk. SOP-013's standaardaanname (zakelijk = bewaren in Mediahub) klopte hier dus niet.

## Open threads

- [ ] YouTube IP-blokkade op de Mac mini nog actief bij sessie-einde — geen harde ETA (anekdotisch 24-48u). Check bij volgende sessie of de pre-flight-probe al groen licht geeft.
- [ ] `/transcribeer`-batch op `@myicor` (574 video's) nog niet compleet (gestopt bij video 87) — hervatten zodra de blokkade voorbij is.
- [ ] `~/.Trash/2026-08-18_ADC_katwijk-bestellingen-screenshot.png` op de Mac mini staat nog te wachten op Sanders eigen definitieve verwijdering.
- [x] Twee voice-memo's van Sander (09.05.06 en 10.56.29, 2026-08-17) zijn definitief verloren — geen actie meer mogelijk, alleen vastgelegd als les.

## Next steps

- Bij volgende sessie eerst de YouTube-blokkade-status checken (pre-flight-probe) voordat de myicor-batch hervat wordt.
- Prullenbak-item op de Mac mini staat klaar voor Sanders eigen opruiming.

## Cross-links

- `[[2026-08-14-19-56_hermes_audio-transcribe-naming-fix-close-session]]` — vorige sessie die dezelfde `audio-transcribe`-pipeline aanraakte.
