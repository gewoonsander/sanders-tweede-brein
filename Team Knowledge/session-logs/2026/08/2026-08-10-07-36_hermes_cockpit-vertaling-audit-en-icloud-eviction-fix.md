---
agent_id: hermes
session_id: cockpit-vertaling-audit-en-icloud-eviction-fix
timestamp: 2026-08-10T07:36:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Cockpit-vertaling geaudit, cockpit bleek leeg door iCloud-eviction

## Context

Sander meldde dat de myPKA Cockpit-vertaling nog niet af leek en vroeg om onderzoek plus voorstel. Later in dezelfde sessie meldde hij dat de cockpit leeg leek te laden — een los, urgenter probleem dat de rest van de sessie domineerde.

## What we did

- Hermes onderzocht het i18n-systeem (`web/src/lib/i18n`): `en.ts`/`nl.ts` zijn type-compleet (628 sleutels elk, TypeScript dwingt volledigheid af), maar slechts 27 van de 78 `.tsx`-bestanden roepen `useT()` aan. 39 bestanden bevatten in totaal ~187 hardgecodeerde Engelse strings die het vertaalsysteem nooit bereiken.
- Hermes stelde drie aanpak-opties voor (taak vastleggen / quick-win-views nu / alles nu). Sander koos ervoor het als kant-en-klaar instructieblok te krijgen om zelf in een Claude Code/terminal-sessie te plakken; Hermes leverde dat blok met een prioriteitenlijst van alle 39 bestanden.
- Sander meldde daarna dat de cockpit leeg leek. Via de Browser-tool bevestigde Hermes een zwart scherm met 500-fouten op alle statische assets.
- Server-logs toonden eerst een crash-loop van de LaunchAgent (net vandaag voor het eerst geïnstalleerd) met `Unknown system error -11` bij het laden van better-sqlite3 — inmiddels zelf hersteld na 4 herstarts.
- De echte, aanhoudende oorzaak: de build-bestanden in `web/dist` waren iCloud cloud-placeholders (0 bytes lokaal, `du` vs `ls` kwamen niet overeen) omdat `Expansions/mypka-cockpit` onder de iCloud-gesyncte `~/Documents` valt. Node's synchrone bestand-reads falen op geëvicte iCloud-bestanden met errno -11 in plaats van de download af te wachten.
- Hermes forceerde het lokaal materialiseren van `web/dist` (directe `readFileSync`-reads) — cockpit laadde weer normaal, geverifieerd met een screenshot van de Hub met echte data.
- Een audit van `node_modules` toonde dat ~80% van een steekproef eveneens geëvict was — een sluimerend risico bij elke koude herstart. Sander zette daarop zelf "Optimaliseer Mac-opslag" uit in Systeeminstellingen.
- Hermes forceerde vervolgens het volledig lokaal downloaden van `node_modules` (alle bestanden uitgelezen); alleen een handvol niet-kritieke bestanden (README/LICENSE/tests) bleven geëvict, geen runtime-bestanden meer.

## Decisions made

- **Question:** Hoe de i18n-migratie (39 bestanden, ~187 strings) oppakken?
  **Decision:** Niet in deze Cowork-sessie zelf uitvoeren — Sander wil het als paste-ready instructieblok in een Claude Code/terminal-sessie draaien. Geen apart taakbestand aangemaakt op zijn verzoek.
- **Question:** Hoe het iCloud-evictieprobleem structureel voorkomen (A: symlink-truck / B: "Optimaliseer Mac-opslag" uitzetten / C: project uit de vault-map halen)?
  **Decision:** Optie B — Sander heeft de instelling zelf uitgezet in Systeeminstellingen; Hermes heeft daarna `node_modules` handmatig gematerialiseerd omdat macOS het herdownloaden niet direct voltooide.

## Insights

- iCloud Drive kan build-artefacten (`node_modules`, `web/dist`) binnen een iCloud-gesyncte Documenten-map evicten. Node's synchrone `fs.readFileSync`/Express static-serving faalt daarop met `Unknown system error -11` in plaats van te wachten op de download — dit verklaart zowel de opstart-crash-loop van een verse LaunchAgent als het lege-scherm-probleem. Relevant voor elk toekomstig Node-project binnen deze iCloud-gesyncte vault.
- Een gewone (niet-geforceerde) `fs.readFileSync` triggert alsnog materialisatie/download van een geëvict iCloud-bestand — bruikbare workaround zonder systeeminstellingen te wijzigen, mocht "Optimaliseer Mac-opslag" ooit weer aan moeten.

## Realignments

- _(none this session)_

## Open threads

- [ ] i18n-migratie van de 39 resterende bestanden staat nog open — instructieblok is bij Sander, nog niet uitgevoerd in een terminal-sessie.
- [ ] Niet gegarandeerd dat `node_modules` blijvend lokaal blijft nu "Optimaliseer Mac-opslag" uit staat — geen harde macOS-garantie, alleen een sterk verkleind risico.
- [ ] Hetzelfde iCloud-evictierisico is nooit gecheckt op de Mac mini (aparte machine, mogelijk aparte iCloud-instelling) — zie [[project_dubbele_tweede_brein_map]].

## Next steps

- Sander opent desgewenst een Claude Code-sessie met het geleverde i18n-instructieblok om de vertaalmigratie uit te voeren.
- Bij de eerstvolgende koude start van de cockpit (reboot) kort checken of alles nog normaal laadt.

## Cross-links

- `[[2026-08-07-14-28_hermes_todoist-regels-verbouwingsoverzicht-cockpit-secrets-audit]]` — meest recente eerdere cockpit-gerelateerde sessie.
