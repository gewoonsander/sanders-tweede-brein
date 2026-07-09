---
agent_id: hermes
session_id: downloads-media-auto-rename-launchd-incident
timestamp: 2026-07-09T09:42:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Downloads media auto-rename gebouwd — met een live-lus-incident onderweg

## Context

Sander wilde dat gedownloade media (foto/video/audio/design-exports) automatisch een geschikte naam krijgt volgens de Mediahub-naamconventie zodra het bestand in Downloads landt, zonder dat het bestand gelijk permanent naar Mediahub verhuist. Aanleiding: de bestaande `mediahub-magazijnmeester`-skill werkt alleen als hij actief wordt aangeroepen, wat ruimte laat voor vervuiling tussen sessies in.

## What we did

- Hermes onderzocht de bestaande flow en ontdekte dat er al een werkende launchd-agent draait (`nl.gewoonsander.downloads-router`, `WatchPaths` op `~/Downloads`) die screenshots/documenten naar Team Inbox verplaatst — maar media-bestanden ongemoeid liet.
- Via `AskUserQuestion` (GL-013) is met Sander doorgesproken: bestanden blijven in Downloads staan na hernoemen (niet meteen naar Mediahub), trigger via de bestaande launchd-watcher, en "ruimhartig" automatisch hernoemen bij redelijke herkenning.
- `Expansions/downloads-router/route_downloads.sh` uitgebreid met een nieuwe tak: media-bestanden worden geclassificeerd via een headless Claude Haiku-call (Vision voor afbeeldingen, tekst-only voor overige types) met de merk-signaalwoorden uit de mediahub-skill, en in Downloads zelf hernoemd naar `YYYY-MM-DD_MERK_omschrijving_v01.ext`.
- **Incident:** de live agent bleef tijdens het testen actief (niet vooraf geünload) en trof een regex-bug (merk-check herkende alleen kleine letters, terwijl bestaande bestanden hoofdletter-merkcodes gebruiken zoals `ADC`/`VGS`/`DC`) — dit veroorzaakte een oneindige hernoem-lus (~1320 onnodige API-calls) totdat Hermes de agent handmatig unloadde.
- Schade-audit: geen dataverlies. Alle 9 destijds aanwezige media-bestanden waren precies één keer correct hernoemd; alleen versienummers wiebelden. Handmatig genormaliseerd naar `v01`.
- Fix: regex geaccepteerd hoofdletter-merkcodes, plus een harde achtervang (content-hash "al hernoemd"-marker, onafhankelijk van regex-correctheid), een mkdir-lock tegen overlappende runs, en `mv -n` (no-clobber).
- Geverifieerd: twee dry-runs + een echte run op de huidige Downloads-inhoud → volledig stil (idempotent). Synthetisch onherkenbaar testbestand correct met rust gelaten, geen herhaalde API-call bij tweede run. Agent weer geladen, logs schoongeveegd.
- Duty 2c (people-dedup check op `mypka.db`) uitgevoerd op verzoek van close-session: geen duplicaten gevonden.

## Decisions made

- **Question:** Moet hernoemen en verplaatsen naar Mediahub één stap blijven (zoals de bestaande skill) of ontkoppeld worden?
  **Decision:** Ontkoppeld. Hernoemen gebeurt automatisch en blijft in Downloads; verplaatsen naar Mediahub blijft een bewuste, aparte stap via de bestaande `mediahub-magazijnmeester`-skill.
- **Question:** Welk trigger-mechanisme?
  **Decision:** Uitbreiden van de bestaande `downloads-router` launchd-agent in plaats van een tweede, parallelle watcher op dezelfde map te bouwen (voorkomt race conditions tussen twee agents).

## Insights

- Bij het bewerken van een script dat door een actieve launchd `WatchPaths`-agent wordt aangeroepen: **altijd eerst unloaden**, anders draait de ongeteste wijziging al live mee op elke bestandswijziging — inclusief de eigen mutaties van het script, wat een self-triggering lus kan veroorzaken. Vastgelegd in memory ([[feedback_launchd_edit_veiligheid]]) zodat dit ook geldt voor de andere vier `nl.gewoonsander.*` agents (audio-transcribe, soap, food-photo-classify, superwhisper-meeting).
- De praktijk in dit myPKA gebruikt hoofdletter-merkcodes (`ADC`, `VGS`, `DC`) in bestandsnamen, terwijl de `mediahub-magazijnmeester` SKILL.md-voorbeelden kleine letters tonen (`adc`, `vgs`). Niet gecorrigeerd in dit sessie — mogelijk het overwegen waard om SKILL.md bij te werken naar de praktijk, of andersom.
- Elke autonome hernoem/verplaats-actie zonder mens-in-de-loop verdient een harde, logica-onafhankelijke achtervang (content-hash marker) naast de primaire detectielogica — een regex-bug alleen is dan nooit genoeg om een lus te veroorzaken.

## Realignments

- _(geen — Sander koos steeds tussen aangereikte opties, geen koerswijziging)_

## Open threads

- [ ] Overwegen of `mediahub-magazijnmeester` SKILL.md bijgewerkt moet worden naar hoofdletter-merkcodes voor consistentie met de praktijk.
- [ ] Geen actie meer nodig op de runaway-lus zelf — opgelost en geverifieerd, alleen ter info.

## Next steps

- Downloads media auto-rename draait nu live; geen vervolgactie nodig tenzij Sander afwijkend gedrag signaleert.
- Bij een volgende sessie die Downloads/Mediahub raakt: dit logbestand en [[feedback_launchd_edit_veiligheid]] als eerste referentiepunt gebruiken.

## Cross-links

- [[2026-07-08-20-13_hermes_adc-posters-darren-crm-darteritus-cursus-review]]
