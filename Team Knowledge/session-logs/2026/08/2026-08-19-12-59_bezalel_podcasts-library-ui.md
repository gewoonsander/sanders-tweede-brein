---
agent_id: bezalel
session_id: 613d861b-99db-4f30-9f32-d5926e099072
timestamp: 2026-08-19T10:59:55Z
type: end-of-session
linked_sops: ["SOP-003-bezalel-build-a-component", "SOP-005-nemesis-quality-gate"]
linked_workstreams: []
linked_guidelines: ["GL-003-design-system"]
---

# Podcasts-library UI in de cockpit

Atlas leverde het schema, de override-laag en het schrijfkanaal; Daedalus de live
iCloud-sync. Ik heb daar de user-facing kant op gebouwd: shows-overzicht →
gepagineerde afleveringenlijst → afleveringsdetail, met het handmatige
"ook elders gezien"-vinkje en de transcript-brug.

## Wat er staat

Alle code in `Expansions/mypka-cockpit/web/src/` (buiten de markdown-scaffold).

**Nieuw**
- `views/PodcastsView.tsx` — de drie surfaces, één route-naam, deep-linkbaar.
- `views/podcasts.css` — alleen tokens, geen hex/rgba.
- `lib/podcasts.ts` — API-seam (URL-bouw + de ene PATCH) en display-helpers.
- `components/podcasts/EpisodeWatchToggle.tsx` — het schrijfaffordance.

**Gewijzigd**
- `lib/cockpitTypes.ts` — volledig getypeerd podcast-contract.
- `lib/router.ts`, `App.tsx`, `lib/moduleRegistry.tsx` — route + menu-item.
- `lib/i18n/en.ts` + `nl.ts` — ~80 `podcasts.*`-sleutels, beide compleet.
- `components/Sidebar.tsx` — `isActive`-fix (zie hieronder).
- `views/LibraryView.tsx` — `Podcast` in de icon-allow-list.

## Patroonbeslissingen die ik wil bewaren

**De vier `effective_*`-velden worden nergens herberekend.** Ze komen kant-en-klaar
uit `v_podcast_episodes_effective` en worden letterlijk gerenderd. `play_state`
lees ik op precies één plek — om te zeggen "Apple telt deze al als gespeeld, je
vinkje legt vast wáár, niet óf". Dat is provenance, geen herafleiding.

**Geen optimistische state bij de write.** De server echoot de rij terug uit de
view; die echo vervangt de lokale rij. Vinkje en statusbadge kunnen daardoor
geen frame lang uit elkaar lopen — en er is geen tweede JS-waarheid.

**Het platform is een keuze vóór het vinkje, geen bewerkbaar veld erna.** Een
`<select>` die bij elke `change` schrijft vuurt een burst writes zodra iemand met
pijltjestoetsen door de opties loopt; de writes die tijdens een lopende request
binnenkomen moeten dan gedropt worden, en dan toont de control iets anders dan de
database bevat. Daarom: dropdown alleen zolang de aflevering *niet* is aangevinkt,
daarna het vastgelegde platform als read-only chip. Wijzigen = uit- en weer
aanvinken.

**`aria-disabled` in plaats van `disabled` waar focus kan sneuvelen.** Een
`disabled` knop verdwijnt uit de tab-order; op het moment dat "Vorige" op offset 0
uitgaat — of de checkbox tijdens het opslaan — springt de focus naar `<body>` en
raakt een toetsenbordgebruiker z'n plek kwijt. De pagerknoppen en de checkbox-
tijdens-schrijven gebruiken daarom `aria-disabled` + een guard in de handler.
Alleen de stabiele pagina-brede read-only-modus gebruikt echt `disabled`.

**WCAG 2.5.3.** De accessible name van de checkbox begint woordelijk met de
zichtbare labeltekst ("Ook elders gezien — {titel}"), zodat spraakinvoer werkt.

## Gevonden tijdens de bouw

1. **Artwork is dubbel geblokkeerd.** De mirror bewaart Apple's URL letterlijk, en
   dat zijn *templates* (`…/{w}x{h}bb.{f}`) — die 404'en; gesubstitueerd geven ze
   een 200. Maar zelfs dan blokkeert `APP_CSP` (`img-src 'self' data:`) alles van
   `*.mzstatic.com`. Ik render daarom bewust het glyph-merk in plaats van 20
   gegarandeerd geblokkeerde requests per pagina. `ARTWORK_REMOTE_ALLOWED` in
   `lib/podcasts.ts` is de één-regel-seam zodra iemand de CSP verbreedt of een
   jailed proxy-route bouwt. **Audiobooks heeft dit probleem vandaag al** — alle
   covers vallen daar stil terug op het glyph.
2. **`transcript_path` is repo-root-relatief**, maar `/api/cockpit/file` resolvet
   niet-Deliverables/Team-Knowledge-paden tegen `PKM/`. Zonder het strippen van de
   `PKM/`-prefix zou elke transcript-link 404'en. Nu al opgelost, ook al zijn er
   0 van 4732 gekoppeld.
3. **De sidebar-rij van Library en Outer World lichtte nooit op.** `isActive`
   vergeleek `route.name` met `'module'`, terwijl die twee via een gelijknamige
   *core route* renderen. Één regel erbij fixt Library, Outer World én Podcasts.
4. **Horizontale overflow onder ~400px** is shell-breed en bestaat al: Audiobooks
   toont bij 390px exact dezelfde afgesneden zoekbalk. Niet unilateraal aangepast.

## Verificatie

Eigen serverinstantie op poort 4399 (4317 onaangeroerd). Alle read-endpoints,
alle zes state-filters, paginering-randen en de zoekopdracht geverifieerd tegen de
live database. Write-pad: 403 zonder header, 400 op onbekend veld / fout platform
/ platform-bij-untick, 404 op onbekende slug. Eén tick→untick round-trip gedaan en
daarna geverifieerd dat er nul override-rijen overblijven.

Visueel: headless screenshots op 1280px en 390px van alle drie de surfaces.
`tsc -b --force` schoon onder `strict` + `noUnusedLocals` + `noUnusedParameters`;
`npm run build` schoon; de view is een lazy chunk (20 kB / 5,6 kB gzip).

## Open

- Nemesis' quality gate ([[SOP-005-nemesis-quality-gate]]) — nog niet gedraaid.
- De cockpit heeft geen eigen merkbestand in de GL-003-registry. Ik heb geen
  merkpalet gegokt en geen ander merkbestand gelezen; ik volg de tokenlaag die de
  cockpit zelf in `web/src/index.css` draagt. Voor Harmonia om te beslissen of die
  laag als brand file in `GL-003-brands/` thuishoort.
- De CSP-vraag voor artwork ligt bij Argus.
- UI-taal staat standaard op Engels (de cockpit-default); beide woordenboeken zijn
  compleet, dus de Settings-switch zet alles in het Nederlands.
