---
name: GL-023-eenvoudige-taal
title: Eenvoudige taal (jip-en-janneketaal)
type: guideline
tags:
  - communicatie
  - interactie
  - taal
owner: Hermes
created: 2026-08-18
---

# GL-023 — Eenvoudige taal (jip-en-janneketaal)

Dit is de enige bron voor hoe Hermes en de specialisten een technisch antwoord hertalen naar taal die Sander zonder voorkennis begrijpt. Het commando `/jip` (`.claude/commands/jip.md`) wikilinkt hierheen en herhaalt deze regels niet.

## Waar de norm vandaan komt

Jip en Janneke zijn de kleuters uit de verhaaltjes van Annie M.G. Schmidt, wekelijks in *Het Parool* van 13 september 1952 tot 7 september 1957. Sinds de jaren '90 staat hun naam symbool voor begrijpelijke taal in overheid en bedrijfsleven.

Evers-Vermeul en Sanders (Universiteit Utrecht, *Onze Taal* jrg. 78) hebben dertig verhaaltjes gemeten:

| Kenmerk | Bij Schmidt |
|---|---|
| Zinslengte | gemiddeld ~6 woorden |
| Woordlengte | ~4 letters |
| Tegenwoordige tijd | 91% van de werkwoorden |
| Directe rede | 54% van de zinnen |
| Lijdende vorm | 8 zinnen in 30 verhalen |
| Verbindingswoorden | en, maar, want, toen |

**De doorslaggevende nuance:** onderzoek van Jentine Land laat zien dat korte zinnen op zichzelf niets oplossen. Vmbo-leerlingen begrepen teksten met korte zinnen juist *minder* goed zodra de samenhang wegviel. Kortheid is dus het gevolg, samenhang is de motor. Zinnen los knippen zonder "want", "dus" en "maar" maakt een tekst slechter, niet beter.

Tweede nuance: de term wordt ook denigrerend gebruikt ("je praat tegen mij als tegen een kleuter"). Doel hier is daarom **eenvoudige taal voor een volwassene**, geen kinderboekentoon.

## De acht hertaalregels

1. **Zinslengte gemiddeld 10–12 woorden.** Niet 6 — dat is kleutertaal en breekt de samenhang.
2. **Verbindingswoorden zichtbaar houden:** en, maar, want, dus, toen. Nooit zinnen los naast elkaar zetten.
3. **Actief en tegenwoordige tijd.** Lijdende vorm is verboden. Niet "het model wordt gedraaid op", maar "je draait het model op".
4. **Vakwoorden en afkortingen blijven staan, mét uitleg erachter van wat het *doet*** — niet waar de letters voor staan. Dus niet "MCP staat voor Model Context Protocol", maar "MCP (het stekkerdoosje waarmee ik met je Gmail kan praten)". Sander wil de term later kunnen herkennen.
5. **Elk abstract begrip krijgt een vergelijking uit het dagelijks leven.**
6. **Vaste afsluiting:** een kopje **Wat betekent dit voor jou** en een kopje **Wat kun je nu doen**.
7. **Harde uitzondering — exactheid gaat vóór eenvoud.** Getallen, bedragen, datums, bestandsnamen, paden, commando's en foutmeldingen blijven woordelijk exact. Nooit afronden, nooit parafraseren, nooit een verhouding uitrekenen die niet in de bron staat. Zelfde regel als bij `/caveman`.
8. **Geen kinderboekentoon.** Geen uitroeptekens, geen "Jip zei tegen Janneke", geen aanhalingen uit de verhaaltjes. Volwassen, alleen simpel.

## Twee niveaus

- **Standaard** — gewoon simpel. Vakwoorden mogen mee, mits uitgelegd bij eerste gebruik.
- **Diep** (`/jip diep`) — alles uitleggen, ook wat vanzelfsprekend lijkt. Elk vakwoord krijgt een vergelijking, niet alleen een omschrijving.

## Zelfcontrole vóór verzenden

Verplichte laatste stap, altijd:

1. Lees de tekst terug en markeer elk woord dat een 12-jarige niet kent. Vervang het of leg het uit.
2. Tel de langste zin. Boven de 20 woorden? Opknippen, mét verbindingswoord.
3. Controleer of elk getal, pad en commando nog letterlijk gelijk is aan het origineel.
4. Controleer of de twee vaste kopjes uit regel 6 er staan.

## Waar deze Guideline geldt

Chat-antwoorden én bestanden in `Deliverables/`. Het technische rapport verdwijnt nooit: de eenvoudige versie komt **bovenaan** het bestaande rapport te staan, onder het kopje `## In het kort (simpel)`, met het volledige technische rapport er ongewijzigd onder.

Niet van toepassing op journaal, klantcommunicatie en ADC-verslagen — daar gelden de eigen toon en conventies van die stukken.

## Cross-references

- [[GL-013-interactie-enkelvoudige-keuzes]] — A/B/C blijft ook in eenvoudige taal verplicht.
- [[GL-016-beslis-en-waarschuwingsblokken]] — beslisblokken blijven ongewijzigd; eenvoudige taal verandert de zinsbouw, niet de structuur.
- [[GL-021-klikbare-bestandslinks]] — `file://`-links blijven verplicht en woordelijk exact (zie regel 7).

## Bronnen

- Evers-Vermeul, J. & Sanders, T., "'Zeg het in jip-en-janneketaal' — Begrijpelijk schrijven in de geest van Annie M.G. Schmidt", *Onze Taal* jrg. 78 (DBNL: `_taa014200901_01_0161`).
- NEMO Kennislink, "Zeg het in jip-en-janneketaal".
- Woordenboek van Nieuwe Woorden / ANW (Instituut voor de Nederlandse Taal), lemma `jip-en-janneketaal`.

## Updates to this Guideline

Wijzigt het format, update dit bestand. Niet dupliceren naar CLAUDE.md, AGENTS.md of `.claude/commands/jip.md` — die `[[wikilinken]]` hierheen.
