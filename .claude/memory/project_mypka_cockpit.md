---
name: project-mypka-cockpit
description: "Status en technische context van de myPKA Cockpit — wat werkt, wat niet, en wat nog open staat"
metadata: 
  node_type: memory
  type: project
  originSessionId: d03ff64d-d700-4dee-b16d-61872f1e4b3e
---

De myPKA Cockpit draait lokaal op http://127.0.0.1:4317 (Node.js + React, SQLite).

**Connections-tabblad** — beheert externe koppelingen. Sleutels worden opgeslagen in `Team Knowledge/.env` (0600, nooit geëchoed). Master-schakelaar: `CONNECTORS_ENABLED=1` (staat aan).

**Todoist connector** — `TODOIST_API_KEY` staat in `.env`, maar status is "awaiting connector" — de connector-module in `server/connectors/` moet nog geactiveerd worden. Catalog entry bestaat al.

**Jortt connector** — gebouwd door Daedalus (`server/connectors/jorttCustomers.js`), credentials opgeslagen (`JORTT_GEWOON_SANDER_CLIENT_ID` + `_SECRET`). Connector werkt technisch, maar is **geblokkeerd**: zowel Gewoon Sander als AKP Gezinshuis zitten op Jortt ZZP-plan — API vereist MKB of hoger. On hold totdat Sander upgradet.

**Google Agenda** — privé iCal URL niet beschikbaar vanwege Google Workspace-beperking (gewoonsander.nl). Alternatief: persoonlijke sub-agenda's (Gewoon Thuis etc.) wél mogelijk. Niet afgerond.

**Why:** Cockpit is Sander's centrale dashboard voor taken, agenda, boekhouding en PKM.
**How to apply:** Bij nieuwe connector-verzoeken: check eerst het abonnement/plan van de externe tool. Bij Google Agenda: stuur naar persoonlijke agenda's, niet de Workspace-hoofdagenda.
