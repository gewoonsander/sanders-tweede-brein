---
date: 2026-07-01
author: Mack
status: approved
topic: Implementatieplan — cursus-versnellen batch-verwerking (optie A goedgekeurd)
---

# Plan: cursus-versnellen batch-verwerking (optie A)

Gebaseerd op [[2026-07-01-cursus-versnellen-design]], goedgekeurd door Sander. Bouwt voort op bestaand `~/Documents/Scripts/transcribeer-cursusopname.sh` — dat script wordt niet vervangen.

## Taken

1. **Mappenstructuur aanmaken.**
   Pad: `~/Documents/Werkarchief/cursus-opnames-inbox/`, `~/Documents/Werkarchief/cursus-opnames-inbox/verwerkt/`, `~/Documents/Werkarchief/cursus-samenvattingen/`.
   Verificatie: `ls -la ~/Documents/Werkarchief/` toont alle drie.

2. **Tracker-bestand aanmaken.**
   Pad: `~/Documents/Werkarchief/cursus-voortgang.csv`
   Kolomkoppen: `dag,les,titel,bronbestand,transcript_status,samenvatting_status,beslissing,notitie`
   Verificatie: `cat` toont exact de header-rij, verder leeg.

3. **Batch-script schrijven.**
   Pad: `~/Documents/Scripts/batch-transcribeer-cursusopnames.sh`
   Gedrag: zie design-doc §Batch-transcriptiescript. Roept whisper direct aan (zelfde parameters als bestaand script) i.p.v. het bestaande script te shell-out'en, om per-bestand foutafhandeling en tracker-logica in één plek te houden — bestaand script blijft ongewijzigd bestaan voor los gebruik.
   Verificatie: `bash -n batch-transcribeer-cursusopnames.sh` (syntax check), daarna `chmod +x`.

4. **Dry-run test met 2 dummy-audiobestanden.**
   Genereer 2 korte testaudiobestanden (via `ffmpeg` sine-tone of `say` naar aiff) met namen volgens conventie `DagXX-LesYY-titel.ext` in de inbox-map.
   Draai het batch-script, controleer: transcript verschijnt in `cursus-transcripties/`, tracker-rij toegevoegd, bronbestand verplaatst naar `verwerkt/`.
   Tweede run zonder nieuwe bestanden: geen dubbele tracker-rijen (idempotentie-check).
   Verificatie: `cat cursus-voortgang.csv` toont exact 2 rijen na eerste run, nog steeds 2 na tweede run.

5. **Opruimen testbestanden, rapport aan Sander.**
   Verwijder dummy-testbestanden en hun transcripten/tracker-rijen na verificatie (geen troep achterlaten in zijn echte werkarchief).
   Rapporteer conform format hieronder.
