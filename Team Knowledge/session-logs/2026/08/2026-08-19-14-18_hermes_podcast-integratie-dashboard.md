---
agent_id: hermes
session_id: podcast-integratie-dashboard
timestamp: 2026-08-19T12:18:42Z
type: close-session
linked_sops: [SOP-005-nemesis-quality-gate]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# Podcast-integratie in het myPKA-dashboard

## Context

Sander wilde zijn podcast-luistergedrag (Dartpraat, Marketingpraat, De Universiteit van Nederland Podcast, en anderen) zichtbaar en doorzoekbaar maken in het mypka-cockpit-dashboard, als aanvulling op losse apps — inclusief transcripten en een idee van wat hij al heeft geluisterd.

## What we did

- **Hermes** onderzocht en verifieerde live (niet aangenomen) dat Apple Podcasts via iCloud een lokale, ongedocumenteerde SQLite-database (`MTLibrary.sqlite`) vult op de Mac met luisterstatus, ook zonder dat je op de Mac zelf luistert.
- **Atlas** bouwde het schema (`podcasts`/`podcast_episodes`, library-foundation-patroon), de matching-logica naar bestaande transcripten (67/67 Dartpraat-afleveringen), de handmatige "ook gezien via YouTube"-override-laag (Inner-World-annotatiepatroon, boolean-ontwerp), het smalle read-write schrijfkanaal (`podcastsDb.js`, vier beveiligingslagen inclusief boot-time-proof) en twee bugfixes (live migratie toegepast, CHECK-constraint verbreed zodat de 67 transcript-koppelingen daadwerkelijk werden weggeschreven — bleken eerder stil te falen).
- **Daedalus** bouwde de iCloud-syncscript + launchd-job (elke 45 min, robuust tegen een bekend iCloud-pad-hangrisico), ruimde 7 automatisch-toegevoegde ("implicitly followed") podcasts en hun 1.764 afleveringen op uit de live database na expliciete bevestiging van Sander, en bouwde de event-gedreven transcriptietrigger (alleen transcriberen na daadwerkelijk "gezien", nooit blanket — met watermark-mechanisme geverifieerd tegen backfill).
- **Bezalel** bouwde de PodcastsView-UI (shows → gepagineerde afleveringen → detail, 2968 afleveringen), het handmatige vinkje, en fixte een HIGH-bevinding (mobiele grid-overflow) inclusief dezelfde bug in de bestaande Audiobooks-weergave.
- **Nemesis** deed de SOP-005-kwaliteitspoort: CONDITIONAL PASS → na Bezalel's fix → PASS, met gemeten (niet aangenomen) WCAG-contrastwaarden en keyboard-operability.
- Drie achtereenvolgende connectieverliezen bij subagents (Atlas ×2, Nemesis ×1) opgevangen door hervatten via SendMessage in plaats van opnieuw beginnen.
- Een auto-mode-classifierblokkade op het aanmaken van launchd-jobs opgelost door samen met Sander een gerichte `autoMode.allow`-uitzondering toe te voegen in `.claude/settings.local.json`.

## Decisions made

- **Question:** Moet luistergeschiedenis automatisch (via Apple's iCloud-sync) of handmatig worden bijgehouden?
  **Decision:** Automatisch via iCloud-sync als basis, met een handmatig vinkje erbovenop voor content die Sander via YouTube in plaats van de Podcasts-app consumeert (Inner-World-override, overschrijft nooit Apple's status averechts).
- **Question:** Smal read-write schrijfkanaal (route A) of aparte cockpit-tabel (route B) voor het handmatige vinkje?
  **Decision:** Route A — de alleen-lezen-regel op `mypka.db` beschermt tegen regen-overschrijving, en `podcast_episodes` is aantoonbaar geen regen-eigendom, dus de regel is niet van toepassing.
- **Question:** Moeten de 7 automatisch-toegevoegde ("implicitly followed") podcasts in de data blijven staan?
  **Decision:** Nee — volledig verwijderd uit de live database (na backup), en de sync aangepast zodat ze nooit meer terugkomen tenzij Sander ze bewust volgt.
- **Question:** Mag content blanket getranscribeerd worden zodra een podcast wordt gevolgd?
  **Decision:** Nee, hard principe — alleen transcriberen na daadwerkelijke consumptie (afgeluisterd/gezien), nooit vooraf op basis van abonnement. Vastgelegd in `feedback_transcriptie_alleen_bij_gezien.md`.
- **Question:** YouTube-transcriptieroute nu uitbreiden naar een RSS-audio-enclosure-route (werkt voor alle podcasts, ook Marketingpraat) nu YouTube vanaf deze Mac niet werkt?
  **Decision:** Nee, voorlopig niet — wachten tot YouTube-toegang vanaf deze Mac weer werkt. Infrastructuur staat klaar voor als dat verandert.

## Insights

- Het "Inner-World-annotatielaag"-patroon uit DATA-CONTRACT §14 (eerder gebouwd voor een andere library) bleek direct herbruikbaar voor het YouTube-vinkje — een goed voorbeeld van waarom dat patroon bestaat.
- De alleen-lezen-regel op `mypka.db` is een regen-beschermingsmaatregel, geen absolute regel — voor niet-regen-eigendom tabellen (zoals `podcast_episodes`) gaat de onderliggende reden niet op, en dat is een herbruikbaar afwegingskader voor toekomstige schrijftoegang-beslissingen.
- Herhaald patroon deze sessie: subagents die "Connection lost mid-response" krijgen, kunnen via `SendMessage` naar hun agentId worden hervat vanaf waar ze gebleven waren, in plaats van de hele opdracht opnieuw te starten — bespaart aanzienlijk werk.

## Realignments

- Sander corrigeerde het plan om Marketingpraat/UvN blanket te transcriberen: "dan heb ik allemaal onzin in mijn tweede brein zitten, waarvan ik niet eens weet dat het erin zit" — leidde tot het harde principe hierboven, nu vastgelegd in memory voor alle toekomstige contentbronnen, niet alleen podcasts.
- Sander wees erop dat de eerdere melding "20 podcasts" misleidend was zonder de context dat 7 daarvan automatisch door Apple waren toegevoegd, niet bewust gevolgd.

## Open threads

- [ ] RSS-audio-enclosure-transcriptieroute (werkt voor alle podcasts, ook Marketingpraat) — Sander wacht bewust tot YouTube-toegang vanaf deze Mac weer werkt voordat hij hierover beslist.
- [ ] YouTube als eigen library-categorie in het dashboard — vastgelegd als taak `tsk-2026-08-19-002-youtube-als-library-in-dashboard`, expliciet "kan later".
- [ ] Harmonia moet nog beslissen of de mypka-cockpit een eigen merkbestand in de GL-003-registry krijgt (Nemesis testte tegen de cockpit's eigen tokenlaag bij gebrek daaraan).
- [ ] De Universiteit van Nederland Podcast heeft een werkende YouTube-playlist-route (geverifieerd door Daedalus) maar is bewust nog niet aangezet.

## Next steps

- Bij een volgende sessie: check of YouTube-toegang vanaf deze Mac weer werkt, dan kan de transcriptietrigger voor UvN direct worden aangezet (playlist-route staat al klaar) en kan de RSS-audio-route-beslissing opnieuw op tafel.
- `tsk-2026-08-19-002` oppakken wanneer er ruimte is voor een bredere library-uitbreiding.

## Cross-links

- Deelverslagen van vandaag (chronologisch): `2026-08-19-11-26_atlas_podcasts-library-schema.md`, `2026-08-19-11-45_atlas_podcasts-handmatige-override.md`, `2026-08-19-12-13_atlas_podcasts-override-live-migratie.md`, `2026-08-19-12-20_atlas_podcasts-manual-watched-write-channel.md`, `2026-08-19-12-59_bezalel_podcasts-library-ui.md`, `2026-08-19-13-30_nemesis_podcasts-library-ui-herinspectie.md`, `2026-08-19-14-07_atlas_podcast-transcript-match-method-check-bugfix.md`
