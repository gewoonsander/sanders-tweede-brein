---
agent_id: hermes
session_id: 2026-08-18-21-16-alex-spellman-outshots
timestamp: 2026-08-18T19:16:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Alex Spellman-transcripties compleet gemaakt, watchlist en outshot-skill opgezet

## Context

Sander vroeg om de resterende video's van het YouTube-kanaal Alex Spellman (playlist
"Visualizing Outshots in Darts", `PLKL0kXRvzwjy6ErAwSk-F3LQIs5ijkzex`) op te halen, er
een watchlist voor nieuwe video's op in te stellen, en er een herbruikbare kennis-skill
van te bouwen. De kennisbank stond al voor een groot deel klaar in
`PKM/Documents/YouTube-Kennis/Alex Spellman/` uit een eerdere sessie.

## What we did

- Hermes bracht de status van de playlist in kaart: 54 van 69 video's al opgehaald,
  15 nog te doen, waarvan 7 met geldige titel (echt op te halen) en 8 zonder titel
  (vermoedelijk verwijderd/privé, niet op te halen).
- Hermes haalde de 7 resterende video's op via `transcribeer.py`.
- Daarbij ontdekte Hermes dat het script bij een **playlist-URL** de doelmap-naam
  afleidt van de playlist-titel ("Visualizing Outs in Darts") in plaats van de
  kanaalnaam ("Alex Spellman"). Doordat die map leeg was, herkende het script geen van
  de 54 al opgehaalde video's, en haalde het alle 61 bereikbare video's opnieuw op via
  Firecrawl — 61 credits in plaats van de verwachte 7, in een verkeerd genoemde map.
- Bijkomende ontdekking: de oude 54 bestanden waren lokale Whisper-transcripties
  **vertaald naar het Nederlands**, met terminologiefouten in vakjargon (bv. "bull" →
  "de boel"). De nieuwe Firecrawl-versies zijn in het originele Engels, zonder dat
  probleem.
- Hermes legde dit voor aan Sander; na akkoord zijn de 61 Engelse Firecrawl-versies
  leidend gemaakt in `Alex Spellman/` (oude Nederlandse versies overschreven), en is de
  verkeerd genoemde map verwijderd.
- Hermes richtte een wekelijkse scheduled task `alex-spellman-watchlist` in (elke
  maandag 09:06) die nieuwe video's van dit kanaal automatisch ophaalt, en repareerde
  die met een expliciete `--out` naar de juiste map plus een stopregel die een
  toekomstige run laat stoppen en melden in plaats van blind door te fetchen als er
  onverwacht veel "nieuwe" video's worden gezien.
- Hermes bouwde de skill `spellman-outshots`
  (`~/.claude/skills/spellman-outshots/SKILL.md`) met gedistilleerde
  outshot-principes van Alex Spellman (triple-eerst, 1-2 aanbevolen routes per getal,
  situatie-afhankelijke risicobereidheid). Na een bredere leesronde door de
  transcripties (n.a.v. Sanders vraag "welke principes hanteert hij allemaal") is de
  skill uitgebreid met 7 aanvullende principes (drempel-denken, eigen mis-richting
  meewegen, eliminatie met concrete reden, niveauschaal in advies, het
  "stappen-van-drie"-patroon, wedstrijdsituatie-afhankelijke risicobereidheid, en
  "soms is er geen keuze").

## Decisions made

- **Question:** hoe omgaan met de twee overlappende mappen na de doelmap-bug (oude
  Nederlandse Whisper-vertalingen vs. nieuwe Engelse Firecrawl-versies)?
  **Decision:** de nieuwe Engelse versies worden leidend (betere brontrouw, geen
  vertaalfouten in vakjargon), oude versies overschreven, verkeerd genoemde map
  verwijderd.
- **Question:** hoe voorkomen dat de wekelijkse watchlist-taak dezelfde doelmap-bug
  herhaalt?
  **Decision:** expliciete `--out` in het commando van de scheduled task, plus een
  ingebouwde stopregel bij een onverwacht hoog aantal "nieuwe" video's.

## Insights

- `transcribeer.py` leidt de doelmap-naam bij een **playlist-URL** af van de
  playlist-titel, niet van de kanaalnaam. Bij hetzelfde kanaal kan een channel-URL en
  een playlist-URL dus naar twéé verschillende mappen wijzen. Elke toekomstige run op
  een kanaal dat al eerder via de andere URL-vorm is opgehaald, moet expliciet `--out`
  meegeven om dit te voorkomen.
- Lokale Whisper-transcriptie met vertaling naar het Nederlands kan vakjargon
  corrumperen (bv. "bull" → "de boel"). Voor kennis-skills die op zulke transcripties
  leunen is de oorspronkelijke taal (ondertitels/Firecrawl) betrouwbaarder dan een
  vertaalde Whisper-transcriptie.

## Realignments

- _(geen dit keer — geen koerscorrectie door Sander)_

## Open threads

- [ ] Geen actie vereist, wel ter info: deze sessie kostte 61 Firecrawl-credits door de
      doelmap-bug, tegenover de verwachte 7. Niet terug te draaien; wel meegenomen in de
      stopregel van de watchlist-taak.
- [ ] Avondeten van vandaag (2026-08-18) staat nog niet gelogd in de voedingsregistratie.

## Next steps

- De wekelijkse watchlist-taak (maandag 09:06) draait vanzelf; alleen actie nodig als
  hij de stopregel triggert of een IP-blokkade meldt.
- De skill `spellman-outshots` is direct bruikbaar voor toekomstige outshot-vragen.

## Cross-links

- _(geen eerdere sessielog over dit onderwerp gevonden)_
