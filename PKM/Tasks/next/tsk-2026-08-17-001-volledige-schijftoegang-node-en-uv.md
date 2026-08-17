---
type: personal-task
task_id: tsk-2026-08-17-001
title: Geef node en uv Volledige Schijftoegang (macOS Privacy-instellingen)
status: next
created: 2026-08-17
updated: 2026-08-17
key_element: groei
owner: sander
gtd_context: computer
eisenhower: important-not-urgent
estimated_minutes: 5
source_type: null
linked_documents: []
linked_people: []
linked_organizations: []
todoist_sync_status: not-synced
---

# Geef node en uv Volledige Schijftoegang (macOS Privacy-instellingen)

## Gewenste uitkomst

`nl.gewoonsander.dartsatlas-fetch`, het transcriptie-onderdeel van `nl.gewoonsander.youtube-samenvatting-ochtend` en `nl.gewoonsander.mypka-cockpit` draaien weer onbemand zonder vast te lopen op een macOS-toestemmingsdialoog die niemand kan wegklikken.

## Eerstvolgende actie

Op de Mac mini (thuis): Systeeminstellingen → Privacy en beveiliging → Volledige schijftoegang → `+` → Cmd+Shift+G, en voeg toe:
- `/opt/homebrew/Cellar/node/26.4.0/bin/node`
- `/Users/sandervanockenburg-zwaan/.local/bin/uv`

Herstart daarna `nl.gewoonsander.mypka-cockpit` (staat al langer vast, PID 1181) — bijvoorbeeld via `launchctl kickstart -k gui/$(id -u)/nl.gewoonsander.mypka-cockpit`.

## Context een klik verder

- Ontdekt en onderzocht door Daedalus op 2026-08-17 tijdens het herstellen van de ADC-ochtendroutine: node en `uv` hebben geen stabiel ondertekend pad zoals de Claude Code-CLI (die al Volledige Schijftoegang heeft via het Anthropic-gesigneerde app-bundle), dus macOS toont onder launchd een blokkerende toestemmingsdialoog die bij een onbemande taak nooit wordt weggeklikt.
- `nl.gewoonsander.inbox-verwerken` en `nl.gewoonsander.adc-verslag-ochtend` zijn al structureel gefixt (draaien nu via het bundle-pad) en hebben deze actie niet nodig.

## Geschiedenis

- 2026-08-17 — Vastgelegd door Hermes op Sanders verzoek ("noteer het ergens in het systeem als actie voor als ik thuis ben"), na Daedalus' onderzoek naar de vastgelopen ADC/inbox/youtube/mypka-automatiseringen. Sander is op vakantie en kan dit pas thuis bij de Mac mini uitvoeren.
