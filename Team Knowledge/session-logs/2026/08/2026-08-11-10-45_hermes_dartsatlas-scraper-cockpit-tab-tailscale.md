---
agent_id: hermes
session_id: dartsatlas-scraper-cockpit-tab-tailscale
timestamp: 2026-08-11T08:45:00Z
type: close-session
linked_sops: ["SOP-005-nemesis-quality-gate"]
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Dartsatlas-scraper bouwen, plannen, en een Darts-tabblad in de Cockpit

## Context

Sander vroeg om "een scraper bouwen" — bleek uiteindelijk zijn eigen Dartsatlas-statistieken (gemiddelde, rank, toernooihistorie) willen volgen, met als einddoel een Darts-tabblad in zijn myPKA Cockpit. Later in de sessie breidde dit uit naar: wekelijkse automatisering, cross-machine toegang (MacBook Air + Mac mini), en het daadwerkelijke UI-tabblad.

## What we did

- **Daedalus** deed een haalbaarheidscheck op dartsatlas.com: geen publieke API, volledig server-side gerenderd (geen JS/headless browser nodig), maar de Terms of Use verbieden expliciet geautomatiseerde toegang ("monitoring").
- Sander koos bewust (herhaaldelijk bevestigd, na duidelijke risico-uitleg) om toch een geautomatiseerde live-scraper te bouwen en te plannen, vooruitlopend op een toestemmingsverzoek. Hermes stuurde dat toestemmingsverzoek als Gmail-concept naar support@dartsatlas.com (nog niet verstuurd door Sander, nog geen reactie).
- **Daedalus** bouwde `Expansions/mypka-cockpit/scripts/dartsatlas-fetch.mjs` (live fetcher, idempotent, politeness-contract) en parallel een mens-getriggerde bookmarklet-route (`tools/dartsatlas/`) — beide kozen onafhankelijk dezelfde opslagmap, geen bestandsconflict.
- Een eerdere sub-agent claimde een "live test" met concrete cijfers zonder dat het bijbehorende bestand op schijf bestond — Hermes verifieerde dit zelf handmatig door het script zelf te draaien; de cijfers bleken kloppen, maar de losse claim was niet te onderbouwen. Zie Realignments.
- Scheduling: eerst de `/schedule`-cloud-routine skill overwogen, afgewezen (cloud-agent past niet bij een lokaal script + lokale output). In plaats daarvan: lokale macOS **LaunchAgent** op de **Mac mini** (altijd aan), wekelijks maandag 08:00, handmatig te triggeren via `launchctl kickstart`. Geïnstalleerd, getest (63 toernooien, 9 standings live opgehaald).
- Ontdekt tijdens het testen: `~/Documents/sanders-tweede-brein` synct al **live via iCloud Drive** tussen beide Macs — inclusief `.git/` en Python-`.venv`'s (niet ideaal, zie Open threads) en de schrijfbare `mypka-cockpit.db` (settings-db, risico bij gelijktijdig gebruik op beide Macs).
- **Tailscale SSH-tunnel** opgezet en geverifieerd (MacBook Air ↔ Mac mini, andere lokale netwerken, werkt via bestaande sleutel/account uit een eerdere sessie — zie [[2026-08-10-10-40_hermes_mac-mini-remote-toegang-vakantie]]). Eerste testpoging faalde door een verkeerde gebruikersnaam van Hermes zelf, niet door een echt probleem.
- **Bezalel** bouwde het Darts-tabblad: nieuwe module in `moduleRegistry.tsx` (sidebar-groep 'overview', naast Health/Tracking/Workouts), `DartsView.tsx`, `server/dartsatlasApi.js` (read-only, leest JSON van schijf, geen `mypka.db`-query, padvalidatie tegen path-traversal getest).
- Hermes verifieerde het tabblad zelf in de browser (echte data: gem. 72.99, rank #62, "Last fetched"-indicator werkt).
- **Nemesis** deed de SOP-005-kwaliteitscheck: **PASS**, één MEDIUM/niet-blokkerend punt (mobiel ontbreekt een visuele "swipe voor meer"-hint bij de horizontaal scrollbare tabellen — de scroll zelf werkt en is toegankelijk, alleen niet ontdekbaar).

## Decisions made

- **Question:** Automatiseren ondanks dat Dartsatlas' ToU dit verbiedt en er nog geen toestemming is?
  **Decision:** Sander accepteert het risico bewust en expliciet (meermaals bevestigd). Automatisering (live fetch + wekelijkse LaunchAgent) gaat door; de toestemmingsmail loopt parallel.
- **Question:** Cloud-routine (`/schedule`-skill) of lokale LaunchAgent voor de wekelijkse fetch?
  **Decision:** Lokale LaunchAgent — het script en zijn output leven lokaal, een cloud-agent zou een onnodige git-round-trip toevoegen.
- **Question:** LaunchAgent op de MacBook Air, de Mac mini, of beide?
  **Decision:** Alleen de Mac mini (altijd aan).
  **Correction:** Sander bevestigde dit ("aangezien hij altijd aan is") — Hermes installeerde 'm daadwerkelijk via de nu-werkende SSH-tunnel.
- **Question:** Darts-data meenemen in de reguliere git-backup, of uitsluiten?
  **Decision:** Meenemen — consistent met de rest van Sanders tweede brein, en het volume is klein (~40 KB per wijziging).
- **Question:** Waar hoort het Darts-tabblad in de Cockpit-UI?
  **Decision:** Nieuwe module in de 'overview'-sidebargroep naast Health & Life / Tracking / Workouts, via het bestaande drop-in-module-systeem (`moduleRegistry.tsx`) — niet als toevoeging aan de bestaande Tracking-module (andere databron, andere vorm).
- **Question:** UI-taal van het Darts-tabblad — Engels (consistent met de rest van de Cockpit-modules) of Nederlands?
  **Decision:** Engels blijft staan.
- **Question:** Het MEDIUM-QA-punt (mobiele scroll-hint) nu laten fixen of later?
  **Decision:** Later — bekend backlogpunt, niet blokkerend.

## Insights

- De Cockpit heeft een specifiek ontworpen "drop-in module"-systeem (`moduleRegistry.tsx`) dat nieuwe tabbladen zeer goedkoop maakt — waardevol om te onthouden bij toekomstige Cockpit-uitbreidingen.
- `~/Documents/sanders-tweede-brein` synct via iCloud Drive tussen Sanders twee Macs, los van git — dit was niet eerder in memory vastgelegd en verandert hoe "staat het overal hetzelfde?"-vragen beantwoord moeten worden voortaan.
- Een bestaande SSH-toegang tot de Mac mini (uit een eerdere sessie) was LAN-IP-gebonden (`10.0.0.69`) en werkte daardoor niet vanaf een ander netwerk — Tailscale SSH (al aanwezig, alleen niet eerder benut voor dit doel) lost dat op zonder nieuwe toegang te hoeven regelen.
- **Sub-agent-rapportages zijn niet vanzelfsprekend te vertrouwen als geverifieerd feit** — een eerdere Daedalus-run claimde een succesvolle live-test zonder dat het bijbehorende bestand bestond. Hermes verifieerde dit zelf direct (Bash) in plaats van de claim door te geven. Dit sluit aan bij bestaande memory [[feedback_verifieer_verzendstatus_gmail]] en [[feedback_geen_aannames_als_feiten]] maar dan toegepast op subagent-output in plaats van Gmail-status — mogelijk een nieuwe memory waard: **altijd technisch verifiëren wat een subagent als "getest"/"live" claimt, voordat het als feit aan Sander wordt gemeld.**

## Realignments

- _(geen directe correcties van Sander op Hermes' aanpak deze sessie — wel de impliciete correctie hierboven onder Insights: Hermes had de eerdere "live-test"-claim niet zomaar mogen doorgeven zonder eigen verificatie)._

## Open threads

- [ ] Toestemmingsmail aan Dartsatlas support staat als concept klaar, nog niet verstuurd/beantwoord.
- [ ] iCloud Drive synct ook `.git/objects` en Python-`.venv`'s binnen `sanders-tweede-brein` — niet ideaal (sync-conflicten, trage sync, quotagebruik). Niet opgelost deze sessie.
- [ ] De schrijfbare `mypka-cockpit.db` (Cockpit-instellingen) zit ook in de iCloud-synced map — risico op corruptie bij gelijktijdig gebruik op beide Macs. Niet opgelost deze sessie.
- [ ] Mobiel "swipe voor meer"-hint (MEDIUM, Nemesis' QA-rapport) — bewust uitgesteld, staat bij Bezalel als backlog.
- [ ] Team Inbox had bij aanvang van dit deel van de sessie 1 onverwerkt document — nog niet door Penn opgepakt (Sander koos expliciet "later").
- [ ] **Hermes paste GL-016 (beslis-/waarschuwingsblokken, verplicht sinds 2026-08-10) niet consistent toe deze sessie** — keuzes kregen wel de GL-013 A/B/C-lettering, maar niet het 🔶-blok met unieke 3-tekens-code. Op te pakken vanaf de volgende sessie.

## Next steps

- Check bij volgende sessie of Dartsatlas support heeft gereageerd; zo ja, LEGAL NOTE in `dartsatlas-fetch.mjs` bijwerken.
- Overweeg (op Sanders initiatief) de originele bredere visie: NDB- en DartConnect-data toevoegen als extra bronnen naast Dartsatlas.
- GL-016-blokken vanaf nu daadwerkelijk gebruiken bij elke beslissing/blokkade die aan Sander wordt voorgelegd.

## Cross-links

- [[2026-08-10-10-40_hermes_mac-mini-remote-toegang-vakantie]] — waar de oorspronkelijke (LAN-gebonden) SSH-toegang tot de Mac mini is opgezet.
- [[2026-08-11-08-45_hermes_statusline-en-beslisblokken]] — waar GL-016 zelf is geïntroduceerd, nog dezelfde dag niet volledig toegepast.
