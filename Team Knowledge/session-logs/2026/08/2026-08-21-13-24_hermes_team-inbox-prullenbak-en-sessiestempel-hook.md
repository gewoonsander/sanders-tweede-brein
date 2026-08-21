---
agent_id: hermes
session_id: e864d521-a18b-4f75-b2d5-fdfd3cf5b178
timestamp: 2026-08-21T11:24:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Team Inbox: prullenbak-knop + sessiestempel nu technisch afgedwongen

## Context

Sander vroeg of hij bestanden uit de Team Inbox ook vanuit het myPKA Cockpit-dashboard
kon verwijderen, niet alleen bekijken. Onderweg kwam ook aan het licht dat de
sessietitel-afspraak (datum/tijd + onderwerp) opnieuw was gemist, in deze en 4 andere
sessies van vandaag.

## What we did

- Onderzocht de bestaande folder-tree/upload-code in `Expansions/mypka-cockpit/server/filetree.js`
  en gevonden dat een discard-naar-Trash patroon al bestond in `scripts/watch-food-inbox.py`
  (na eerder dataverlies van voice-memo's).
- Voorstel met voor-/nadelen en alternatieven besproken (eigen `_trash`-map + cron vs.
  macOS' eigen `~/.Trash` + Finders "verwijder na 30 dagen"-instelling); Sander koos
  voor het laatste, met als hoofddoel: één-klik uit het zicht, geen bevestigingsvraag.
- Gebouwd: `POST /api/cockpit/inbox/trash` in `filetree.js` (TOCTOU-veilige
  symlink-weigering, Finder-stijl naamsbotsing, EXDEV-fallback), prullenbak-knop in
  `FolderTree.tsx`/`InboxView.tsx` (alleen zichtbaar in Team Inbox), 7 automatische
  tests in `filetree.trash.test.mjs`.
- Handmatig geverifieerd in de browser tegen de echte single-origin server (niet de
  vite-dev-proxy, die de CSRF-guard breekt voor élke write-route — geen nieuwe bug).
- Gecommit en gepusht (`29efff3`) — alleen de 5 relevante bestanden, niet het overige
  al openstaande, niet-gerelateerde werk in de working tree.
- Sessietitel van deze sessie + 4 andere sessies van vandaag gecorrigeerd naar
  `YYYY-MM-DD HH:MM · onderwerp`.
- Nieuwe Stop-hook gebouwd: `.claude/hooks/check-session-stamp.py`, zusje van de
  bestaande GL-013-hook (`check-lettered-options.py`) — blokkeert de eerste reply van
  een sessie als de stempelregel of de `set_session_title`-aanroep ontbreekt.
  Pipe-getest met 3 scenario's, geregistreerd in `.claude/settings.json`.
- `feedback_sessiestempel_bij_sessiestart.md` bijgewerkt: dit stuk is nu technisch
  afgedwongen, niet meer alleen geheugenwerk.

## Decisions made

- **Question:** Eigen `_trash`-map + zelfgeschreven purge-cron, of macOS' eigen Trash +
  ingebouwde 30-dagen-instelling?
  **Decision:** macOS' eigen Trash. Minder nieuwe code, hergebruikt een al bewezen
  patroon uit `watch-food-inbox.py`, geen cron die ik moet installeren of onderhouden.
- **Question:** Bevestigingsdialoog vóór het verplaatsen naar de Trash?
  **Decision:** Nee — expliciete keuze van Sander: één klik, uit het zicht, de
  30-dagen-Trash is de vangnet-laag, niet een tweede bevestigingsstap.

## Insights

- De vite-dev + losse API-server-opstelling (`npm run dev:web` + `dev:server`) breekt
  de CSRF-`localWriteGuard` voor elke write-route zodra de proxy `changeOrigin`
  toepast — dit is geen nieuwe regressie, maar een pre-existing bekende beperking van
  die split-dev-workflow. Schrijf-features testen tegen de gebouwde app op de
  single-origin server (`npm run build:web` + de lopende `server.js`), niet via de
  vite-proxy.
- Er bestaat al een discard-niet-vernietig-patroon in dit project
  (`scripts/watch-food-inbox.py:discard()`) voor Team Inbox-bestanden die geen
  voedingsregistratie blijken te zijn — ontstaan na dataverlies van twee voice-memo's
  op 2026-08-17/18. Dit patroon is nu ook de basis voor de nieuwe dashboard-knop.
- De sessietitel-regel had, anders dan GL-013, geen technische bewaker — puur
  geheugenwerk. Dat verklaarde waarom hij herhaaldelijk werd gemist (5 sessies op één
  dag). Nu gedicht met een Stop-hook naar hetzelfde patroon als GL-013.

## Realignments

- _(geen — Sander's feedback op dit gesprek was aanvullend/kiezend, geen correctie op
  een eerder ingeslagen pad)_

## Open threads

- [ ] Op de Mac mini: `git pull` + cockpit-server herstarten, anders verschijnt de
      prullenbak-knop daar nog niet.
- [ ] Sander moet zelf op elke Mac (Mac mini én MacBook Air) de Finder-instelling
      "verwijder items na 30 dagen uit het Prullenmand" aanzetten — dat is de hele
      retentie-laag, geen code.
- [ ] `.claude/settings.json` en `.claude/hooks/check-todoist-taakformat.py` bevatten
      al langer openstaand, niet-gerelateerd, niet-gecommit werk van eerder (niet van
      deze sessie) — nog niet gecommit, ook mijn 5 nieuwe hook-regels zitten er nu
      tussen in de working tree.
- [ ] `check-session-stamp.py` kon zichzelf niet in déze sessie bewijzen (we zaten al
      voorbij de eerste beurt) — bevestiging volgt bij de eerstvolgende nieuwe sessie.

## Next steps

- Volgende sessie: checken of de nieuwe sessiestempel-hook daadwerkelijk vuurt bij de
  eerste reply.
- Bij gelegenheid: `.claude/settings.json`/`check-todoist-taakformat.py` opschonen of
  bewust committen (aparte klus, niet vermengen met toekomstig ander werk).

## Cross-links

- _(geen directe voorganger gevonden voor dit onderwerp)_
