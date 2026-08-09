---
name: project-mypka-cockpit
description: "Status en technische context van de myPKA Cockpit — wat werkt, wat niet, en wat nog open staat"
metadata: 
  node_type: memory
  type: project
  originSessionId: d03ff64d-d700-4dee-b16d-61872f1e4b3e
  modified: 2026-08-09T12:36:26.599Z
---

De myPKA Cockpit draait lokaal op http://127.0.0.1:4317 (Node.js + React, SQLite). Bedoeld als LaunchAgent (`~/Library/LaunchAgents/nl.gewoonsander.mypka-cockpit.plist`) die automatisch meestart bij inloggen — maar op 2026-08-09 bleek die plist niet aanwezig op de MacBook Air (LaunchAgents zijn per-machine; niet gecheckt op de Mac mini). Sander gebruikt beide machines; ga niet uit van "draait al" zonder eerst `lsof -i :4317` / `curl 127.0.0.1:4317` te checken op de machine waar de sessie actief is.

**Versie 1.5.2** (bijgewerkt 04-08-2026, was 1.2.1) — selectieve integratie vanuit myPKA-scaffold v5.4.0-download, zonder het team/AGENTS.md-laag aan te raken (die is te ver doorontwikkeld t.o.v. de vanilla-scaffold om een volledige update veilig te maken — zie sessielog 04-08-2026). Meegenomen: Graphite-thema, dagplanner drag-and-drop-fix, Team Analytics-pagina, **Weekly Reports** ("The Week in Ink" — vrijdag-recap samengesteld uit Journal/Images/Deliverables/session-logs, schema in [[GL-002-frontmatter-conventions]] v2.5, productiescripts in `Team Knowledge/scripts/weekly-report-*.py`). `mypka.db` heeft nu ook `session_logs` (79 rijen) en `weekly_reports` (0 — nog geen edities) tabellen.

**Connections-tabblad** — beheert externe koppelingen. Sleutels worden opgeslagen in `Team Knowledge/.env` (0600, nooit geëchoed). Master-schakelaar: `CONNECTORS_ENABLED=1` (staat aan).

**Todoist connector** — géén "awaiting connector" meer (dat was stale info, gecorrigeerd 2026-08-09). `server/connectors/todoistTasks.js` bestaat, staat correct in `catalog.json`, en is live geverifieerd via `GET /api/cockpit/sources`: `{"source":"todoist","ok":true,"reason":null}`. Werkt gewoon, toont alleen 0 items omdat er op dat moment geen Todoist-taken met een due date deze week stonden.

**Jortt connector** — gebouwd door Daedalus (`server/connectors/jorttTasks.js`, niet `jorttCustomers.js`), haalt alleen SENT+OVERDUE facturen op (scope `invoices:read`). Credentials staan in `.env` (`JORTT_GEWOON_SANDER_CLIENT_ID` + `_SECRET`) maar zijn mogelijk ongeldig — Sander meldde 2026-08-09 geen API-toegang te hebben ondanks aanwezige sleutels (niet opgehelderd). Connector werkt technisch, maar is **geblokkeerd**: API vereist het Jortt MKB-plan (€24,95/mnd) of hoger, niet beschikbaar op ZZP/Starter — drievoudig bevestigd (FAQ, prijspagina, én runtime-foutcode `organization.requires_mkb_plan` in de connector zelf, jorttTasks.js:68). Onopgehelderd of AKP Gezinshuis een eigen Jortt-administratie heeft (geen AKP-sleutels in `.env`).

Sander wil op termijn ook een **geldstatus/kasoverzicht** in de Cockpit. Onderzoek (Athena, 2026-08-09, zie [[project_jortt_geldstatus_onderzoek]]) bevestigt dat Jortt's API dit ondersteunt via `/v1/reports/summaries/cash_and_bank` (expliciet bedoeld voor dashboard-weergave) plus `balance` en `profit_and_loss`, onder scope `financing:read` — vereist dezelfde MKB-upgrade. Mogelijke route: Jortt's Boekhoudersportaal laat een boekhouder (Bart) namens de klant upgraden tegen kantoortarief in plaats van Sander die zelf tegen retailprijs laat upgraden — nog niet bevestigd of Bart's kantoor daarbij is aangesloten.

**Google Agenda** — privé iCal URL niet beschikbaar vanwege Google Workspace-beperking (gewoonsander.nl). Alternatief: persoonlijke sub-agenda's (Gewoon Thuis etc.) wél mogelijk. Niet afgerond.

**Why:** Cockpit is Sander's centrale dashboard voor taken, agenda, boekhouding en PKM.
**How to apply:** Bij nieuwe connector-verzoeken: check eerst het abonnement/plan van de externe tool. Bij Google Agenda: stuur naar persoonlijke agenda's, niet de Workspace-hoofdagenda.
