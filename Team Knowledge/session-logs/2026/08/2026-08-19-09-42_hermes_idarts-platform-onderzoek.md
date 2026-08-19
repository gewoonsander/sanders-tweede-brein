---
agent_id: hermes
session_id: idarts-platform-onderzoek
timestamp: 2026-08-19T09:42:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Uitgebreid iDarts-onderzoek (platform + 11 tutorial-transcripten)

## Context

Sander vroeg om een uitgebreid onderzoek naar iDarts: wat het is, wat het kan, inclusief transcriptie van de YouTube-video's op de site om een compleet beeld te krijgen. Bouwt voort op het DartConnect-dashboardonderzoek van 2026-08-18, dat iDarts al deels had aangeraakt.

## What we did

- Hermes identificeerde `idarts.nl`/`stats.idarts.nl` als het bedoelde platform (i.p.v. het gelijknamige maar ongerelateerde "RadikalDarts iDarts®" automatische dartbord-systeem).
- Ontdekte dat de live "How it works"-pagina kapot is (alle tutorial-tegels tonen dezelfde video door een Webflow-tabbug) en vond de 11 echte video-URL's terug via een Wayback Machine-snapshot, geverifieerd met directe DOM-inspectie.
- Transcribeerde alle 11 unlisted tutorial-video's via de `/transcribeer`-skill (YouTube-IP was geblokkeerd, automatische terugval naar Firecrawl werkte voor alle 11).
- Verplaatste de 11 transcripten naar `PKM/Documents/YouTube-Kennis/iDarts (Mastercaller)/` voor permanente opslag.
- Schreef het volledige onderzoeksverslag naar `Deliverables/2026-08-19-idarts-platform-onderzoek.md` (profiel, prijzen, doelgroep, functionaliteit per module, relatie met Mastercaller, bronnen, beperkingen) en leverde het bestand aan Sander.

## Decisions made

- _(geen expliciete beslissingen deze sessie — puur onderzoek + oplevering)_

## Insights

- iDarts' marketingsite heeft een stille functionele bug (video-tabs wisselen niet) — niet aan Sander gemeld als actiepunt, alleen als methodologische kanttekening in het rapport, want het is niet zijn site.
- Nieuw t.o.v. het DartConnect-rapport van gisteren: database-toegang bij iDarts kost €275/jaar excl. btw (de Web API zelf blijft prijsloos/op aanvraag).
- Naamsverwarring bestaat met "RadikalDarts iDarts®" (Spaans automatisch dartbord-hardwaremerk) — volledig ander bedrijf, niet verder onderzocht.

## Realignments

- _(none this session)_

## Open threads

- [ ] Sander kan zelf op `stats.idarts.nl` zijn eigen dartsnaam ("Sander Vos") opzoeken om te checken of iDarts ook NDB LaCo/SuperLeague-teamwedstrijden dekt of alleen rankingtoernooien — dit stond al als open vraag in het DartConnect-rapport van gisteren en is in dit onderzoek niet opnieuw getest.

## Next steps

- Geen vervolgactie gepland; onderzoek is afgerond en opgeleverd.

## Cross-links

- `[[2026-08-18-dartconnect-data-dashboard-onderzoek]]` — het eerdere onderzoek waar dit rapport op voortbouwt.
