---
agent_id: hermes
session_id: vooraankondiging-transcriptie-frustratie-audit
timestamp: 2026-08-16T23:38:58+02:00
type: close-session
linked_sops: [SOP-011-adc-toernooi-analyse, SOP-write-session-log]
linked_workstreams: [WS-004-facebook-toernooi-verslag, WS-006-adc-facebook-verslag, WS-009-adc-facebook-vooraankondiging, WS-001-daily-journaling]
linked_guidelines: [GL-013-interactie-enkelvoudige-keuzes, GL-018-integratie-en-software-register]
---

# Vooraankondiging-workstream, YouTube-transcriptiebatch, en frustratie-audit

## Context

Vervolg op een eerdere close-session dezelfde dag. Begon met een SuperWhisper-instelling, liep via het bouwen van een nieuwe ADC-vooraankondigingsprocedure en het herstarten van een YouTube-transcriptiebatch naar een grote, expliciet aangevraagde frustratie-audit over het hele myPKA, gevolgd door drie concrete fixes op basis van die audit.

## What we did

- Hermes vond en zette **Superwhisper's "Recording window" op "None"** (i.p.v. "Mini") zodat het kleine popup-schermpje na elke dictatie niet meer met Escape weggeklikt hoeft te worden — Auto paste bleef aan.
- Hermes draaide `/dagstart` volledig: agenda (alleen doorlopende vakantie), verjaardag Kirsten Haan (geen CRM-bestand), openstaande/achterstallige taken, 1 nieuwe bestelling (Dartshopper/DPD) gevonden en verwerkt in [[lopende-bestellingen]], Team Inbox-wachtrij samengevat, 6 ADC-verslagen op Sanders bevestiging op GEPUBLICEERD gezet.
- Op Sanders signaal dat het Hengelo-toernooi van die dag nergens in de taken stond, onderzocht Hermes de bestaande ADC-automatisering (`adc-verslag-ochtend`-LaunchAgent, bleek gewoon te werken — hij kijkt terug, niet vooruit) en ontdekte dat een vooraankondiging-posttype twee keer eerder ad-hoc was gemaakt maar nooit als staande procedure vastgelegd.
- Op Sanders akkoord: **[[WS-009-adc-facebook-vooraankondiging]]** geschreven (spiegelbeeld van WS-004/006), `scripts/adc-verslag-ochtend.prompt.md` uitgebreid met Deel B (checkt nu ook of er vandaag een toernooi is), `dagstart.md` stap 6 uitgebreid, Mac mini gesynchroniseerd en de routine handmatig getriggerd zodat de vooraankondiging voor Hengelo dezelfde dag nog gemaakt werd.
- Op verzoek: het **YouTube-transcriptiebatchproces** (channel `@myicor`, 176→verder) opnieuw gestart op de Mac mini nadat het 3 uur stil had gelegen — bleek niet vast te zitten maar middenin een trage lokale Whisper-transcriptie.
- Hermes legde uit waar transcripties/samenvattingen terechtkomen (`PKM/Documents/YouTube-Kennis/`, en straks de Cockpit-tab "Outer World") en corrigeerde zichzelf: de samenvattingsstap gebruikt al Sanders **abonnement** (headless Claude Code), niet de goedkopere Haiku-API — het ontwerpdocument beschreef een eerdere, inmiddels achterhaalde keuze.
- Sander vroeg om een resource-URL (`app.myicor.com/resources/...`) te transcriberen; bleek achter een verlopen proefperiode/betaalmuur te zitten. Hermes klikte niet door op "Upgrade Now" (aankoopbeslissing) en sloeg de resource op Sanders verzoek over.
- **Grote frustratie-audit uitgevoerd** op expliciet, zeer gedetailleerd verzoek van Sander: 3 parallelle subagents (juni/juli/augustus, 134 sessielogs in totaal, vrijwel alles volledig gelezen), plus Hermes' eigen onderzoek naar het correctiekanaal, regeldocument-tegenstrijdigheden en taken-veroudering. Rapport geschreven naar [[2026-08-16-frustratie-audit]].
- Op Sanders akkoord (na een reflectievraag en een aanbevelingenvraag): **3 van de 4 aanbevelingen direct uitgevoerd** — GL-018 en `software-en-tools.md` samengevoegd (rclone/Affinity/WPMU Dev toegevoegd, 22 integraties), een "check eerst of een register al bestaat"-reflex toegevoegd aan `Guidelines/INDEX.md`, en 4 bevestigde memory-only correcties (taal, geen-aannames, bureaublad-leeg, klantcommunicatie-ik-niet-wij) gecodificeerd als MANDATORY-secties in `CLAUDE.md`.

## Decisions made

- **Question:** Vooraankondiging als losse actie of als staande, geautomatiseerde procedure?
  **Decision:** Staande procedure (WS-009), zelfde dagelijkse trigger als het bestaande verslag-achteraf, geen aparte LaunchAgent nodig.
- **Question:** Frustratie-audit — alles uitvoeren of eerst de dataomvang checken?
  **Decision:** 134 sessielogs is ruim boven Sanders eigen ondergrens van ~30 — volledige audit uitgevoerd, geen archeologie-op-te-weinig-data-risico.
- **Question:** Na de audit — welke aanbevelingen nu direct oppakken?
  **Decision:** Sander koos (B): de drie kleine/bepaalde acties (GL-018-samenvoeging, registratie-reflex, memory-lekken codificeren) nu; het grotere "aannames-als-feiten-mechanisme" bewust laten liggen als ontwerpvraag, niet nu bouwen.

## Insights

- De ADC-ochtendroutine kijkt met opzet terug (verslag), nooit vooruit — dat een vooraankondiging ontbrak was dus geen bug maar een nooit-vastgelegd gat. Onderscheid dat het waard is scherp te houden bij toekomstige "waarom gebeurt X niet automatisch"-vragen: eerst checken wat de bestaande routine daadwerkelijk als taak heeft, niet aannemen dat iets "zou moeten" werken.
- De frustratie-audit liet zien dat mechanismen (Stop-hooks) stand houden zodra ze daadwerkelijk actief zijn, en dat vrijwel alle terugkerende problemen zijn terug te leiden tot een regel die *afwezig* was in een specifieke context (ander host, verouderde mapkopie, verouderde config), niet tot een regel die faalde terwijl hij actief was.
- Tijdens de audit ontdekte Hermes zelf een live tegenstrijdigheid die hij een paar uur eerder in dezelfde sessie had helpen veroorzaken (GL-018 vs. `software-en-tools.md`) — een direct, zelf-gefalsifieerbaar voorbeeld van het exacte procesprobleem dat de audit moest opsporen.
- Een subagent tijdens de audit citeerde `feedback_geen_aannames_als_feiten` ten onrechte als "staat in mijn eigen AGENTS.md" — bleek na verificatie nergens in AGENTS.md of CLAUDE.md te staan. Verzonnen bronvermelding over de eigen regels van het team, ontdekt tijdens een audit die precies dat soort fouten moest vinden.

## Realignments

- Sander corrigeerde een eerder (foutief) voorstel om Google Drive te gebruiken als simpele upload-en-terug-downloaden-omweg voor grote video's — loste de eigenlijke Tailscale-bottleneck niet op tenzij de Mac mini zelf rechtstreeks van Drive download.
- Sander corrigeerde Hermes' aanname dat de YouTube-samenvatting via de (goedkopere) Haiku-API zou lopen — de config staat al op "abonnement", Hermes had het ontwerpdocument geciteerd i.p.v. de daadwerkelijke configuratie.

## Open threads

- [ ] Het "aannames-als-feiten"-mechanisme (brontag + hook) uit de audit — bewust nog niet gebouwd, wacht op Sanders ontwerpkeuze over hoe streng.
- [ ] Beslissing over de lege specialist-journals (Team/*/journal/) — audit-aanbeveling 4, nog niet opgepakt.
- [ ] rclone nog niet op de Mac mini geïnstalleerd (Sander doet dit zelf thuis).
- [ ] YouTube-transcriptiebatch liep nog door bij het schrijven van dit logbestand — voortgang niet geverifieerd bij sessie-einde.
- [ ] `stef_50.mp4` in Downloads nog steeds onbehandeld (blijft openstaan sinds eerdere sessie).
- [ ] 32 SOP's zijn nooit systematisch op tegenstrijdigheden gecontroleerd (audit Sectie E) — grootste overgeslagen stuk.

## Next steps

- Volgende sessie: checken of `adc-verslag-ochtend` de Hengelo-vooraankondiging daadwerkelijk correct heeft weggeschreven en of Sander 'm heeft gepubliceerd.
- YouTube-transcriptiebatch-voortgang checken.
- Bij gelegenheid: beslissing over specialist-journals en het aannames-mechanisme aan Sander voorleggen.

## Cross-links

- `[[2026-08-16-10-51_hermes_refund-mail-dashboard-crisis-mediahub-rclone]]` — eerdere close-session dezelfde dag.
- `[[2026-08-16-frustratie-audit]]` — het rapport zelf.
