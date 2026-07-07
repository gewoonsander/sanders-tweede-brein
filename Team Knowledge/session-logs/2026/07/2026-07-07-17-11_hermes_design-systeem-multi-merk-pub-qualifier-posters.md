---
agent_id: hermes
session_id: design-systeem-multi-merk-pub-qualifier-posters
timestamp: 2026-07-07T17:11:00Z
type: close-session
linked_sops: [SOP-006-author-a-design-system, SOP-010-adc-inschrijvingen-opvragen]
linked_workstreams: []
linked_guidelines: [GL-003-design-system, GL-015-agent-model-tier-review]
---

# Multi-merk design-systeem opgezet, DartsCoaching.nl + ADC Regio Oost gevuld, 10 pub-qualifier-posters gebouwd

## Context

Lange sessie die begon met twee YouTube-video-samenvattingen over AI-teamkosten (model-tiering) en design-/video-tooling, en uitgroeide tot een volledige herstructurering van het merk-systeem (GL-003) en concreet productiewerk: DartsCoaching.nl volledig ingevuld, vier kroeglogo's voor ADC Regio Oost opgeschoond, en tien printklare Pub Qualifier-posters gebouwd voor de Winmau Benelux Open 2026.

## What we did

- **Model-tiering (Hermes):** naar aanleiding van een video over AI-teamkosten, alle 11 `.claude/agents/*.md`-bestanden voorzien van een expliciet `model:`-veld (Opus: Bezalel/Atlas/Daedalus; Sonnet: Argus/Nemesis/Harmonia/Athena; Haiku: Penn/Jethro/Charta/Pixel). Vastgelegd in nieuwe [[GL-015-agent-model-tier-review]] met kwartaal + event-getriggerde reviewcadans.
- **Design-/video-tooling onderzoek (Athena):** brief opgeleverd in `Deliverables/2026-07-07-design-video-tooling-kostenvergelijking.md` na 6 video-samenvattingen. Kernconclusie: Canva heeft Affinity én Cavalry overgenomen en beide gratis gemaakt — Sanders bestaande stack dekt vrijwel alles al, geen nieuwe abonnementen nodig.
- **GL-003 multi-merk-herstructurering (Harmonia, 3 pogingen door API-529-storingen):** GL-003-design-system.md werd een hub; nieuwe map `GL-003-brands/` met adc-regio-oost.md, dartscoaching.md, dartbuddies.md (erft van dartscoaching), van-gewoon-sander.md. Charta/Pixel/Bezalel/Nemesis cold-start-regels bijgewerkt naar verplicht merk-eerst-principe.
- **SOP-consistentiepas (Harmonia):** SOP-006/007/008/009 bijgewerkt naar het nieuwe hub+merkbestand-model.
- **Teamhygiëne (Jethro):** ontbrekende `AGENTS.md` aangemaakt voor Harmonia/Charta/Pixel (cold-start faalde hiervoor stil); Larry→Hermes en Iris→Harmonia gecorrigeerd in SOP-003/005/INDEX; GL-010 stale frontmatter gefixt; legacy-mapjes Mack/Nolan/Pax/Silas verwijderd (na onderzoek, geen unieke content).
- **DartsCoaching.nl volledig gevuld (Harmonia via SOP-006):** bestaande stijlgids gevonden op de Mediahub — kleuren, typografie, beeldstijl 1-op-1 overgenomen. Doelgroep, spacing (8px) en voice samples samen met Sander bepaald. Gedeelde avatarset (7 coaches + Nina/Bob/Weszley/Willie) vastgelegd als gedeeld tussen DartsCoaching.nl én Dart Buddies (na Sanders correctie — niet Dart Buddies-exclusief).
- **DartsCoaching-poster (Pixel-achtig werk buiten Canva om):** vakantie/hangmat-poster met Joppe en Sander, gegenereerd via Gemini na twee correctierondes (logo-tekst, dartpositie, boekomslagen). Gearchiveerd op de Mediahub, Facebook-marketingtekst geschreven met boekverkooplinks.
- **ADC Regio Oost — hiërarchie + kleuren/typografie deels gevuld:** ADC Europe → ADC Benelux → Regio's bevestigd via amateurdarts.eu. Kleuren/font benaderd uit bestaande spiekbrief-template (oranje `#F26522` en bold grotesk-font — **beide niet geverifieerd tegen officieel merkboek**).
- **Vier kroeglogo's opgeschoond/gevonden voor de Pub Qualifiers:** De Rijnvogels (Sander zelf gevectoriseerd in Affinity, met begeleiding — inclusief Zennor→Mr Dafoe font-match), Café Kafé en Het Twentse Ros (beide bleken al een eigen logo te hebben, gevonden via hun website), Dubbel10 (bestond al). Alle vier gearchiveerd in `03_ADC_Regio_Oost/07_Beeldbank/Kroeglogos/`.
- **Regiofinale-data vastgelegd:** Amateur Finale 26-09-2026 bij Het Twentse Ros, Elite Finale 27-09-2026 bij Dubbel10 — toegevoegd aan SOP-010 (stond nog niet in Dart Atlas zelf).
- **10 Pub Qualifier-posters (Charta, 3 iteraties):** 4 kroeg-posters + 1 overzichtsposter, elk in A4-print en social-formaat. Eerste versie had drie echte kwaliteitsproblemen (onleesbaar Dubbel10-logo, laag-contrast logo's, lege vlakken) plus verkeerde printresolutie. Tweede Charta-poging loste de HTML op maar vergat 5 PNG's opnieuw te renderen (zelf-gerapporteerde verificatie klopte niet — tweede keer dat dit gebeurde). Hermes nam de laatste correctieslag zelf over met Chrome headless (lokaal geïnstalleerd, geen extra installatie nodig) — logo-contrast, layout-centrering en een `zoom`-fix voor de A4's (content was geschaald voor het oude kleine formaat, niet het nieuwe 300dpi-canvas). Alle 10 bestanden zelf visueel geverifieerd vóór oplevering.

## Decisions made

- **Question:** Hoe voorkom je dat Charta/Pixel het verkeerde merk se kleuren/logo gebruiken nu er meerdere ondernemingen zijn?
  **Decision:** GL-003 wordt een hub die per taak een merk-bevestiging afdwingt; tokens leven in aparte `GL-003-brands/<slug>.md`-bestanden, nooit in de hub zelf.
- **Question:** Moeten de vier kroeglogo's een uniforme "familie-stijl" krijgen?
  **Decision:** Nee — elke kroeg behoudt zijn eigen bestaande identiteit; alleen de kwartaal-specifieke qualifier-posters delen een gezamenlijke ADC-stijl (zwart/wit/oranje) waar de kroeglogo's als eigen beeldelement op geplaatst worden.
- **Question:** Playwright installeren voor betrouwbaar HTML→PNG-renderen?
  **Decision:** Nee — lokaal geïnstalleerde Chrome headless bleek voldoende en vereiste geen nieuwe installatie.

## Insights

- Charta's zelf-gerapporteerde "geverifieerd"-meldingen klopten twee keer op rij niet met de daadwerkelijke output (stale PNG's die niet overeenkwamen met de al-gecorrigeerde HTML-bron). Waard om in de gaten te houden bij toekomstig Charta-werk met een render-stap — altijd zelf een steekproef doen in plaats van het rapport te vertrouwen.
- Canva's overname van Affinity én Cavalry (beide nu gratis) maakt Sanders bestaande toolstack toevalligerwijs coherenter dan wat de meeste "beste AI-designtools"-video's aanprijzen.
- Chrome headless (`--headless --screenshot --window-size=WxH`) is een volwaardig alternatief voor Playwright voor eenvoudige HTML→PNG-renders, zonder installatie-overhead.

## Realignments

- Sander corrigeerde de aanname dat de Nina/Bob/Weszley/Willie-avatars exclusief voor Dart Buddies waren — ze zijn een gedeelde basisset met DartsCoaching.nl; Dart Buddies voegt alleen nog te bepalen extra figuren toe.
- "Café Café" bleek fonetisch "Café Kafé" te zijn — opgehelderd via Dart Atlas-data in plaats van verder te blijven gokken.

## Open threads

- [ ] ADC Regio Oost's oranje hex (`#F26522`) en heading-font (benaderd als Archivo Black/Anton) zijn niet geverifieerd tegen een officieel ADC Europe-merkboek.
- [ ] Dart Buddies' "extra figuren"-override (naast de gedeelde basisset) nog niet bepaald.
- [ ] Van Gewoon Sander en de resterende secties van Dart Buddies staan nog volledig leeg in GL-003-brands.
- [ ] Dubbel10's logo-bestand staat nog los in de hoofdmap van `03_ADC_Regio_Oost/` i.p.v. in de `Kroeglogos/`-submap (cosmetisch, geen blokkerend probleem).

## Next steps

- Sander print/verspreidt de 10 ADC-posters en de DartsCoaching-vakantieposter.
- Volgende SOP-006-sessie (indien gewenst): ADC Regio Oost afmaken (exacte kleuren/font) of Van Gewoon Sander vanaf nul.
- Extra figuren voor Dart Buddies bepalen zodra Sander daar tijd voor heeft.

## Cross-links

- `[[2026-07-07-09-55_hermes_adc-verslag-arnhem-duplicate-map-gl013-hook]]` — vorige sessie dezelfde dag.
