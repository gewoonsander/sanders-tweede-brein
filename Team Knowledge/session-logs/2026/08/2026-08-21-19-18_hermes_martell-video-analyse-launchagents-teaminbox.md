---
agent_id: hermes
session_id: 2026-08-21-martell-video-analyse-launchagents
timestamp: 2026-08-21T19:18:00+02:00
type: close-session
linked_sops: ["SOP-025-agent-contract-hygiene-audit", "SOP-014-refresh-platform-specialist-knowledge", "SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: ["GL-024-reverse-prompting-bij-vage-taken", "GL-005-llm-agnostic-portable-core", "GL-013-interactie-enkelvoudige-keuzes"]
---

# Video-analyse Dan Martell → GL-024, SOP-025, lokale LaunchAgents, Team Inbox-start

## Context

Sander vroeg om transcriptie + samenvatting van de video "Dan Martell: The AI Cheat Codes
Every Founder Needs in 2026", gevolgd door een analyse van welke inzichten uit die video
toepasbaar zijn op het eigen myPKA-systeem. Dat groeide uit tot twee nieuwe
teamverbeteringen, de ontdekking van een structureel betrouwbaarheidsprobleem met cloud
scheduled tasks, en de bouw + installatie van twee lokale LaunchAgents. De sessie eindigde
met een gestarte maar niet afgeronde SOP-013-inboxronde.

## What we did

- Hermes transcribeerde de video via de `/transcribeer`-skill (ondertitels, geen Whisper
  nodig) en leverde een gestructureerde samenvatting.
- Op verzoek leverde Hermes een vergelijking tussen de video-inzichten (master prompt,
  agentic AI, reverse prompting, klantretentie-analyse, dagelijkse AI-nieuwsdigest,
  contract-refresh-cadans) en de bestaande myPKA-SOPs/Guidelines, met concrete gaten.
- Hermes schreef [[GL-024-reverse-prompting-bij-vage-taken]] (wanneer Hermes bij een vage
  taak eerst blokkerende vragen stelt, met een expliciete grens t.o.v. Auto Mode) en
  [[SOP-025-agent-contract-hygiene-audit]] (kwartaal-audit van de 16 specialist-contracten +
  shims), met bijbehorende updates in `AGENTS.md`, de SOP/GL-indexen en Jethro's contract
  (`Team/Jethro - HR/AGENTS.md`, `.claude/agents/jethro.md`).
- Bij het opzetten van een kwartaal-scheduled-task voor SOP-025 ontdekte Hermes dat de
  eerder aangemaakte cloud scheduled task voor SOP-014
  (`refresh-huddle-plugandpay-knowledge`, gemeld als "aangemaakt" in het sessielog van
  2026-07-14) niet meer bestond — noch in de scheduled-tasks-lijst, noch als map op schijf.
  Tweede, onafhankelijke geval van hetzelfde falen als de `adc-oost-verslag-ochtend`-cloud-
  routine (ontdekt 2026-08-11).
- Hermes legde de les vast als [[GL-005-llm-agnostic-portable-core]] Rule 5 en bouwde twee
  lokale LaunchAgents naar het bestaande `scripts/lib/launchd-guard.sh`-patroon:
  `nl.gewoonsander.agent-contract-hygiene-audit` (kwartaal, 21e) en
  `nl.gewoonsander.refresh-huddle-plugandpay-knowledge` (kwartaal, 14e). SOP-014 en SOP-025
  zijn bijgewerkt om de LaunchAgents te beschrijven i.p.v. een cloud-taak.
- De agent-dispatch naar Daedalus voor bouw/installatie werd geblokkeerd door de auto-mode
  classifier (SSH + `--dangerously-skip-permissions` in één taakomschrijving). Hermes
  bouwde de zes bestanden zelf, direct door Sander geautoriseerd, en committete + pushte ze
  (commit `afd54c1`).
- Sander installeerde de twee LaunchAgents zelf op de Mac mini via een eigen Remote-Control-
  sessie (SSH via Hermes werd ook daar door de classifier geblokkeerd). Beide bevestigd
  geregistreerd en idle via `launchctl print`, wachtend op de eerstvolgende kwartaaldatum.
- Hermes startte [[SOP-013-inboxen-verwerken]] — inventarisatie compleet (Team Inbox,
  Downloads, Werkarchief, vault-root), classificatievragen aan Sander gesteld maar bij
  sessie-einde nog onbeantwoord.

## Decisions made

- **Question:** Cloud scheduled tasks of lokale LaunchAgents voor terugkerende myPKA-
  automatiseringen?
  **Decision:** Altijd lokaal (LaunchAgent of gelijkwaardige OS-scheduler), nooit alleen een
  harness-cloud-scheduler — vastgelegd als [[GL-005-llm-agnostic-portable-core]] Rule 5, na
  twee onafhankelijke gevallen van stille verdwijning.
- **Question:** Moet Hermes bij een vage taak altijd eerst doorvragen (reverse prompting)?
  **Decision:** Ja, maar begrensd — alleen wanneer er nog geen ondubbelzinnige SOP bestaat
  of de actie duur/omkeerbaar-onvriendelijk is; anders een redelijke aanname maken, uitvoeren
  en die aanname melden. Vastgelegd in [[GL-024-reverse-prompting-bij-vage-taken]], bewust
  begrensd om niet te botsen met de sessie-brede Auto Mode-instructie.

## Insights

- Twee onafhankelijke, in tijd gescheiden gevallen van verdwenen cloud scheduled tasks
  (2026-08-11 en 2026-08-21) wijzen op een structureel betrouwbaarheidsprobleem van het
  mechanisme zelf, geen eenmalige fluke.
- Een SOP die een "scheduled, automatisch"-cadans claimt is daarmee nog geen garantie dat
  die cadans ook echt draait — een sessielog-claim is niet hetzelfde als een geverifieerde
  live automatisering. Live verificatie (`launchctl print` op de machine die de job hoort te
  draaien) is nodig voordat je een cadans als feit aanneemt.
- De auto-mode classifier blokkeert een gecombineerde SSH-naar-externe-machine +
  `--dangerously-skip-permissions`-opdracht, zowel via de Agent-tool als via directe Bash-
  aanroepen. Dat soort werk moet Sander zelf uitvoeren, of stap voor stap in losse,
  kleinere goedgekeurde acties.

## Realignments

- _(geen — dit waren eigen bevindingen tijdens het werk, geen correcties van Sander op mijn
  aanpak)_

## Open threads

- [ ] SOP-013-inboxronde niet afgerond: classificatie van `Scherm­afbeelding 2026-08-21 om
  11.34.23.png` (dartbord-uitshot-visualisatie, doel onbekend), akkoord voor verwijderen van
  `Scherm­afbeelding 2026-08-21 om 12.15.56.png` (inhoud al verwerkt in dit gesprek),
  routering van de losse `Professionals Need Systems, Not Just Notes #shorts
  [-qOMnlDWjBQ].mp4` in de vault-root, en of Downloads (19 items) + Werkarchief nu of in een
  aparte ronde worden meegenomen.
- [ ] Alle vijf actieve dagelijkse Habits (bewegen, opdrukken, bodylotion, drinken,
  schimmelcrème) hebben nog geen entry van vandaag; alle drie maaltijden (ontbijt, lunch,
  avondeten) staan nog niet gelogd in het voedingslogboek. Read-only geconstateerd bij deze
  snelle close-session, niet uitgevraagd.

## Next steps

- Volgende sessie: SOP-013 afronden op basis van Sanders antwoorden op de vier openstaande
  vragen hierboven.
- Bij de eerstvolgende kwartaaldatum (14 en 21 oktober 2026) verifiëren dat beide nieuwe
  LaunchAgents daadwerkelijk gevuurd hebben (logs onder `~/Library/Logs/agent-contract-
  hygiene-audit.log` en `~/Library/Logs/refresh-huddle-plugandpay-knowledge.log`).

## Cross-links

- [[2026-08-11-23-35_hermes_adc-automatisering-inbox-voedingspijplijn]] — het eerste geval
  van een verdwenen cloud scheduled task (`adc-oost-verslag-ochtend`).
- [[2026-07-14-11-23_hermes_martonny-tonnymart-platform-specialist-hires]] — de hire-sessie
  die de nu-verdwenen `refresh-huddle-plugandpay-knowledge`-cloud-taak claimde te hebben
  aangemaakt.
