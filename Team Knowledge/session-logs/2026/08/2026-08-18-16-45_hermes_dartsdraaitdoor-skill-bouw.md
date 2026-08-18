---
agent_id: hermes
session_id: dartsdraaitdoor-skill-bouw
timestamp: 2026-08-18T16:45:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Darts Draait Door-playlist transcriberen en er een kennisskill van bouwen

## Context

Sander leverde de YouTube-playlist "Darts Draait Door" (Sportnieuws.nl, presentator Damian
Vlottes met Vincent van der Voort) aan met het verzoek de kennis binnen te halen. Later in de
sessie: bouw er een skill van, test die, en een losse researchvraag aan de bestaande
`/dartpraat`-skill.

## What we did

- Hermes draaide `/transcribeer` op de volledige playlist (137 video's). Eerste telling ging
  fout door een afgekapte `tail`-output (leek 40 in plaats van 137) — direct gecorrigeerd na
  Sanders vraag.
- Batch liep via Firecrawl voor vrijwel alle afleveringen (IP was al vanaf video 1 door YouTube
  afgeknepen). Eén achtergrondrun stopte stil zonder foutmelding (proces weggevallen, vermoedelijk
  bij sessie-afsluiting) op 118/137; een tweede run maakte de resterende 19 af.
- Eindresultaat: 135 van de 137 afleveringen opgehaald naar
  `PKM/Documents/YouTube-Kennis/Sportnieuws.nl Darts Draait Door/` (6,4 MB tekst). Twee
  afleveringen mislukten definitief (`TranscriptsDisabled` + Whisper-terugval op macmini liep
  vast op de audiodownload): `qOXc7bqsoWU` en `CH_qJYHo1Bg`.
- Hermes bouwde `~/.claude/skills/dartsdraaitdoor/SKILL.md`, qua opzet gespiegeld aan de
  bestaande `dartpraat`-skill: kennisbron-pad, presentatoren (via video-omschrijving
  geverifieerd, niet gegokt), naamverbasteringstabel met getelde frequenties, zoektips voor de
  regelafbrekingen, en een onderhoudsparagraaf met de twee ontbrekende afleveringen.
- Skill getest in een nieuwe sessie (skills registreren pas bij sessiestart) met een echte vraag
  over Van Gerwen na de WK-finale — leverde bronvermeld antwoord op met link naar aflevering #20
  van de WK-reeks.
- Tijdens die test kwam een extra naamverbastering naar boven ("Gerben", 108×) die nog niet in
  de tabel stond; op Sanders bevestiging toegevoegd aan zowel de tabel als de grep-vuistregel.
- Losse onderzoeksvraag aan `/dartpraat`: "rekenfouten, wegzetten". Geen van beide bleek een
  eigen terugkerende rubriek; wel gevonden: een concrete Peter Wright-tel-anekdote in S03E11
  (met Gian van Veen) en Sanders eigen aflevering S03E04 die zwaar leunt op "rekenen" als
  tactiekthema (28 vermeldingen).

## Decisions made

- **Vraag:** moet de nieuwe skill dezelfde structuur volgen als `dartpraat`?
  **Beslissing:** ja, één-op-één qua opzet (kennisbron-verwijzing, naamtabel, zoektips,
  onderhoudsparagraaf) zodat beide skills onderhoudbaar blijven zonder dubbel werk.
- **Vraag:** worden ontbrekende afleveringen (2 stuks) alsnog geforceerd via een andere route?
  **Beslissing:** nog niet — gemeld aan Sander als open item, geen actie ondernomen zonder
  akkoord.

## Insights

- Bij een lopende achtergrondtaak die de sessie overleeft: een `task-notification` met
  `status: stopped` betekent niet per se een fout in het script zelf — kan ook een weggevallen
  proces zijn bij sessie-afsluiting. Wat al is opgehaald blijft staan; een hervatte run pakt de
  draad automatisch op zonder dubbel werk (bestaande bestanden worden overgeslagen).
- `tr '\n' ' ' | grep -o ".\\{0,120\\}term.\\{0,120\\}"` uit de dartpraat/dartsdraaitdoor-
  zoektips kan op deze machine vastlopen (timeout) op grote bestanden (600+ regels). Sneller en
  net zo bruikbaar: eerst `grep -n term bestand.md` voor regelnummers, dan `sed -n
  'START,EINDp' bestand.md` voor de context. Waard om als alternatief in beide skills op te
  nemen bij een volgende onderhoudsbeurt.

## Realignments

- _(geen dit keer)_

## Open threads

- [ ] De twee ontbrekende Darts Draait Door-afleveringen (`qOXc7bqsoWU`,
      `CH_qJYHo1Bg`) staan nog open — Sander kan aangeven of hij een alternatieve
      ophaalroute wil proberen.
- [ ] Overweeg de snellere `grep -n` + `sed`-zoekmethode (zie Insights) toe te voegen aan zowel
      `dartpraat` als `dartsdraaitdoor` SKILL.md, ter vervanging of aanvulling van de
      `tr | grep -o`-tip die kan timeouten.

## Next steps

- `/dartsdraaitdoor` is klaar voor gebruik vanaf de volgende sessie.
- Bij een volgende `/transcribeer`-run op deze playlist: alleen de 2 ontbrekende afleveringen
  plus eventuele nieuwe uploads worden opgepakt (bestaande 135 worden overgeslagen).

## Cross-links

- _(geen direct gerelateerde eerdere sessie-log gevonden)_
