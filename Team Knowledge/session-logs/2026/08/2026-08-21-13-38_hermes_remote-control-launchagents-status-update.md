---
agent_id: hermes
session_id: remote-control-launchagents-status-update
timestamp: 2026-08-21T11:38:07Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-005-llm-agnostic-portable-core"]
---

# Twee nieuwe kwartaal-LaunchAgents geïnstalleerd, statusronde openstaande punten

## Context

Vervolg op dezelfde doorlopende sessie. Sander riep `/remote-control` aan met een kant-en-klaar deploymentscript (SSH + git pull + plist-kopie + launchctl bootstrap) voor twee nieuwe kwartaal-automatiseringen die elders al waren voorbereid. Daarna vroeg hij een statusronde op eerder geopende threads.

## What we did

- Hermes constateerde dat de SSH-stap overbodig was (deze sessie draait al lokaal op de Mac mini) en voerde de rest van het geleverde script uit: `git pull`, de twee plist-bestanden (`nl.gewoonsander.agent-contract-hygiene-audit`, `nl.gewoonsander.refresh-huddle-plugandpay-knowledge`) gekopieerd naar `~/Library/LaunchAgents/` en gebootstrapt. Beide geverifieerd: geregistreerd, `not running` (idle, wacht op eerstvolgende kwartaaldatum), draaien via `/bin/bash` (geen node/TCC-risico).
- Beide plist-bestanden vooraf gelezen om te bevestigen dat het legitieme, goed gedocumenteerde vervangingen zijn van verdwenen Anthropic-cloud scheduled tasks (zelfde patroon als de eerdere ADC-ontdekking op 11 augustus) — geen destructieve of verrassende inhoud.
- Statusronde uitgevoerd op verzoek van Sander: EdgarTV Darts-transcripties bleken inmiddels wél compleet (26/26 + 11/11, 19 augustus 22:41 — buiten deze sessie om, waarschijnlijk door Sander zelf op de MacBook Air). `tsk-2026-08-17-001` (Volledige Schijftoegang node/uv) staat nog open — bevestigd via `mypka-cockpit` (nog vastgelopen op dezelfde PID 1181) en `dartsatlas-fetch`/`youtube-samenvatting-ochtend` (nog steeds abnormale exit-codes 143/126).

## Decisions made

- _(geen — uitvoerend en informatief werk)_

## Insights

- Twee onafhankelijke gevallen (11 en 21 augustus) van Anthropic-cloud scheduled tasks die stilzwijgend verdwenen zonder foutmelding — GL-005 Rule 5 documenteert dit patroon inmiddels expliciet. Reden om cloud-scheduled tasks structureel te wantrouwen voor terugkerende myPKA-onderhoudsroutines; lokale launchd met de bash/TCC-safe-constructie is het geworden default.
- Bij het lezen van `git status` vóór deze close-session bleken opnieuw (net als op 19 augustus) wijzigingen van een andere, gelijktijdig actieve sessie aanwezig (Bezalel, SOP-diagram generieke parser). Ditmaal bewust niet apart behandeld — `git add -A` bij close-session is expliciet het gedocumenteerde gedrag in AGENTS.md, dus meenemen is correct, niet een fout zoals op 19 augustus leek.

## Realignments

- _(geen)_

## Open threads

- [ ] `tsk-2026-08-17-001` (Volledige Schijftoegang node + uv, dan mypka-cockpit herstarten) — nog steeds niet uitgevoerd, drie automatiseringen blijven hierdoor stuk.
- [ ] Geen enkele dagelijkse gewoonte (opdrukken/schimmelcrème/bodylotion/bewegen) of voeding is vandaag (21 aug) al gelogd — niet bevraagd conform de snelle close-session-variant, maar wel vermeldenswaardig voor de volgende volledige sessie.

## Next steps

- Bij eerstvolgende volledige (niet-snelle) close-session: gewoonte- en voedingscheck van vandaag alsnog uitvragen.
- Zodra Sander bij de Mac mini is: `tsk-2026-08-17-001` afhandelen.

## Cross-links

- `[[2026-08-19-18-59_hermes_edgartv-darts-verkenning-en-transcripties]]` — vorig close-session-log in dezelfde doorlopende sessie.
