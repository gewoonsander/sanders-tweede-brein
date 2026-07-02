---
agent_id: hermes
session_id: todoist-format-versio-cursusworkflow
timestamp: 2026-07-01T22:19:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken", "SOP-development-workflow"]
linked_workstreams: []
linked_guidelines: ["GL-014-todoist-taakformat", "GL-004-task-resource-linking", "GL-012-pkm-vs-todoist", "GL-001-file-naming-conventions"]
---

# Todoist-format opschonen, Versio/Heleen-migratie afronden, cursus-transcriptie-workflow gebouwd

## Context

Lange sessie die begon met Sanders vraag waarom mail-afgeleide Todoist-taken inconsistent geformatteerd waren. Eindigde met een nieuwe Guideline, een volledig opgeschoonde Todoist-backlog, de afronding van de praktijkvoluitleven.nl/Versio-migratie, een gefixte n8n-bug, en een nieuwe lokale workflow om cursusmateriaal versneld te verwerken.

## What we did

- **Hermes** onderzocht de Todoist-taakformat-inconsistentie, ontdekte de root cause (Todoist API's geïnverteerde prioriteitscijfers leidden ooit tot een tekst-vangnet dat overbodig werd) en schreef **GL-014-todoist-taakformat** (`actie > titel ⏰tijd`, prioriteit alleen native, bronlink, projectroutering, archiveer-bij-afronding).
- **Hermes** converteerde de volledige Todoist-backlog (81 taken) naar het nieuwe format, met correcte projectroutering, en ruimde 5 sets duplicaten op (na overleg per set) — 6 taken verwijderd.
- **Hermes** legde een "digitale accounts & assets"-sectie vast in `financien.md` (MEXC, Bitvavo); Sander besloot bewust het MEXC-account (€0,35) niet op te zeggen.
- **Hermes** rondde de praktijkvoluitleven.nl-migratie verder af: DNS/mail bevestigd correct (webmail werkend getest), instructiemail naar Heleen verstuurd, facturatie-afspraak gemaakt (mail + WhatsApp), CRM-notitie voor Heleen aangemaakt. Domein bleek **al zelfstandig door Sander verhuisd naar GoDaddy** (bevestigd via browser-check). Sander probeerde de Versio-opzegging zelf (12 min wachtrij, 21 min met 2 medewerkers) — doorgezet naar Versio-administratie zonder ETA, met openstaand saldo (€14,86) en bulk-factuurverzoek. **Penn** legde deze ervaring vast als journal-entry (`2026-07-01-versio-opzegging.md`) inclusief een nieuwe CRM-organisatienotitie voor Versio.
- **Hermes** verwerkte Joppe Bakens' adreswijziging (Baronielaan 95, Goirle) via de n8n Contacten Beheer-webhook; ontdekte dat het `postalCode`-veld stil werd genegeerd.
- **Daedalus** (achtergrondtaak) inspecteerde de "Contacten Beheer"-workflow (n8n) en fixte de ontbrekende postcode-mapping in de "Wijzig Contact"-node; geverifieerd en live.
- **Hermes** hielp OBS instellen voor cursusopnames (hergebruik bestaande scene "opname cursus", Desktop Audio i.p.v. Applicatie Audio na troubleshooten van audio-uitval bij 2 van de eerste opnames), installeerde IINA (`.mkv`-player) via Homebrew.
- **Daedalus** (achtergrondtaak, via `/brainstorm`) ontwierp en bouwde de versnelde cursus-workflow: `~/Documents/Scripts/batch-transcribeer-cursusopnames.sh` (batch-Whisper-transcriptie + lichte CSV-tracker `cursus-voortgang.csv`), voortbouwend op het eerder handmatig gebouwde `transcribeer-cursusopname.sh`.
- **Hermes** verwerkte in totaal 15 cursusopnames (14 Day Filmmaker dag 7 + 1 Day Script modules "Prove Formula/Research Phase" en "Brainstorming") tot transcript + samenvatting; 2 opnames (Les 2 en Les 4, dag 7) hadden audio-uitval en moeten opnieuw.
- **Hermes** creëerde Goal `cursussen-afmaken` + Habit `een-cursus-tegelijk` onder het Groei Key Element, na Sanders zelfherkenning van versnippering.
- **Hermes** ruimde de Team Inbox volledig op: 9 P&L-PDF's + 10 auditfiles (XAF) voor Gezinshuis Gewoon Thuis gearchiveerd naar `PKM/Documents/e-Boekhouden/` (ontbrekend jaar 2021 alsnog gevonden, taak afgesloten), oude Versio-factuur (2011) gearchiveerd, stofzuiger-foto verwerkt (gegevens naar `apparaten.md`, foto naar Mediahub), 8 gebruikte screenshots verwijderd.
- **Hermes** corrigeerde `apparaten.md`: monitoren geïdentificeerd als Huawei/BenQ via OBS-bronnamen.

## Decisions made

- **Question:** Todoist-taakformat — dubbele prioriteit-weergave behouden of niet?
  **Decision:** Alleen native prioriteitsveld, geen tekst-duplicatie. Vastgelegd in GL-014.
- **Question:** MEXC-account opzeggen (deadline 23 okt) of laten staan?
  **Decision:** Laten staan — saldo (€0,35) te klein om de moeite waard te zijn.
- **Question:** Cursus-samenvattingsstap — Claude (hoge kwaliteit, handmatige trigger) of volledig lokaal via Ollama?
  **Decision:** Claude, met handmatige trigger per batch (optie A uit Daedalus' ontwerp).
- **Question:** Domeinregistratie praktijkvoluitleven.nl bij Versio laten of verhuizen?
  **Decision:** Verhuisd naar GoDaddy (Sander deed dit zelfstandig tijdens de sessie).

## Insights

- Todoist's ruwe API gebruikt geïnverteerde prioriteitscijfers (API 4 = zichtbaar P1) — een bekende valkuil die de root cause bleek van de dubbele-prioriteit-inconsistentie.
- Bij macOS + OBS: de audio-bronmethode "Applicatie Audioopname" (per-app) is onbetrouwbaar voor browser-tabbladen; "Desktop Audio" (systeembreed) is de robuustere keuze.
- Whisper hallucineert herhaald "you" bij stilte — een bruikbare diagnostische marker voor audio-uitval, geen willekeurige transcriptiefout.
- Bij .nl-domeinverhuizingen: nameservers kunnen al losstaan van de registrar (zoals hier, DNS al bij WPMU Dev) terwijl de registratie zelf nog ergens anders staat — dit zijn twee onafhankelijke zaken.

## Realignments

- _(geen dit keer — geen koerscorrecties, wel veel scopeverbreding op eigen initiatief van Sander (van Todoist-format naar cursusworkflow naar Versio) die steeds is meegenomen)_

## Open threads

- [ ] Les 2 (Data-management) en Les 4 (edit-10x-faster) van 14 Day Filmmaker dag 7 opnieuw opnemen (audio-uitval, nu opgelost met Desktop Audio-fix)
- [ ] Sander moet per samengevatte les nog beslissen: volledig bekijken of skippen (kolom "beslissing" in `cursus-voortgang.csv` staat overal nog op `todo`)
- [ ] Versio-administratie: navragen of opzegging + saldo-terugbetaling (€14,86) + bulk-facturen zijn afgehandeld (geen ETA gekregen)
- [ ] Heleen: bevestiging afwachten dat inloggen/webmail werkt, dan factuur sturen (migratie + hosting + e-mailhosting + achterstallige 2025-factuur)
- [ ] **Vóór het filmen van Dart Buddies-onboarding-video's: avatar/research-werk eerst afronden** (Sanders eigen verzoek — zie memory `project_dartbuddies-onboarding-videos`)
- [ ] Kleine PKM-opschoonpuntjes gesignaleerd door Penn: broken link `[[project_praktijkvoluitleven-migratie]]` vanuit Heleen's CRM-notitie (bestaat niet als PKM-notitie), en `abonnementen.md` noemt Versio nog als platte tekst

## Next steps

- Bij volgende sessie over cursusmateriaal: check `cursus-voortgang.csv` voor nieuwe opnames en open beslissingen.
- Bij volgende sessie over Heleen/Versio: check eerst of er nieuws is van de administratie of van Heleen zelf.
- Voor Dart Buddies-video's: actief navragen of het avatar/research-werk al is gedaan voor er gefilmd wordt.

## Cross-links

- `[[2026-07-01-01-22_hermes_email-inbox-postnl-boekfactuur]]` — vorige sessie, startte de praktijkvoluitleven-migratie verder
- `[[2026-07-01-versio-opzegging]]` — Penn's journal-entry over de Versio-belervaring
- `[[2026-07-01-cursus-versnellen-design]]` en `[[2026-07-01-cursus-versnellen-plan]]` — Daedalus' design-doc en implementatieplan
