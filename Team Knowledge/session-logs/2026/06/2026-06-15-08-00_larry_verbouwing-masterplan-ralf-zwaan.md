---
agent_id: larry
session_id: 2026-06-15-verbouwing-masterplan-ralf-zwaan
timestamp: 2026-06-15T08:00:00
type: close-session
linked_workstreams: []
linked_sops: []
linked_guidelines:
  - GL-001-file-naming-conventions
---

# Verbouwing Huismanstraat: masterplan, Google Docs, Ralf Zwaan

## Wat we gedaan hebben

### Google Calendar mijlpalen gezet
- **Larry** maakte 3 events aan in de nieuwe "Verbouwing Huismanstraat" agenda (calendar ID: `c_83c3dbabbce13c1d6a4485454b95e2b31a1d5d996007330deaf87a07fa2ee156@group.calendar.google.com`):
  - Fase 1 Voorbereiding (15 juni – 12 juli)
  - Fase 2 Harm aan het werk (13–19 juli, week 29)
  - Fase 3 Afwerking & oplevering (20 juli – 1 sept)

### Google Docs samenwerking — bevindingen
- Sander deelde eerst een doc van Marieke's account → Drive MCP kon het niet vinden (doc staat in ander account).
- Sander maakte een nieuw doc aan vanuit `sander@gewoonsander.nl` → Drive MCP vindt Google Docs (native format) nog steeds niet. MCP ondersteunt alleen geüploade bestanden, niet native Google Docs editing.
- **Conclusie:** Google Docs bewerken is niet mogelijk via de huidige Drive MCP of computer-use (Chrome is read-only). Geen betere connector beschikbaar in het register.
- **Gekozen aanpak:** masterplan als `.docx` aanmaken, uploaden naar Drive, Marieke werkt erin mee.

### Masterplan `.docx` aangemaakt
- **Larry** maakte `verbouwing-huismanstraat-masterplan.docx` op basis van eerder besproken planning.
- Opgeslagen in `sanders-tweede-brein/` (de gemounte map).
- Inhoud: faseplanning, ruimteomwisseling-tabel, keuken details, open items, Harm-planning.

### Marieke's weekplanning geïntegreerd
- Marieke had in het Google Doc een weekplanning (week 25–35) en kamer-werkzaamhedentabel gemaakt.
- **Larry** verwerkte dit volledig in het `.docx`:
  - Weekplanning met beschikbaarheid (Marieke vrij/werk, Ralf week 31, Thomas + Sander voor keuken ophalen)
  - Werkzaamheden per kamer: nieuwe eetkeuken, clientkamer, privé keuken — elk met takenpakket, te beslissen punten en opties
  - Open items tabel uitgebreid
  - Week 35 datumfout gecorrigeerd (was 17–23 aug, moet 24–30 aug zijn)

### Ralf Zwaan geprofileerd
- Sander vertelde dat "Ralf" in Marieke's planning zijn zwager is: de oudere broer van Marieke.
- **Larry** fetchte bouwbedrijfzwaan.nl en convenientinterior.com.
- **Nieuwe bestanden aangemaakt:**
  - `PKM/CRM/People/ralf-zwaan.md`
  - `PKM/CRM/Organizations/bouwbedrijf-zwaan.md`
  - `PKM/CRM/Organizations/convenient-interior.md`
- **Profiel Ralf:** SPH-opleiding → groepsleider → bouw via Bouwflex 2006 → zzp 2012 (Klusbedrijf) → Bouwbedrijf Zwaan 2017. Skills: timmerwerk, loodgieterswerk, elektra, stucwerk, tegelen, schilderwerk, keukens, badkamers, MDF meubels. Christelijk ondernemer, sociaal ondernemerschap.
- **Convenient Interior:** tweede bedrijf Ralf, ontwerpt Smart Guitar Station (muziekmeubel). Muzikant.
- **Gezin Ralf:** vrouw Esther, dochter Charlotte Zwaan.
- **Beschikbaar verbouwing:** week 31 (27 juli – 2 aug 2026).

### Elektrische groepen inschatting
- Sander vroeg hoeveel nieuwe groepen de meterkast nodig heeft voor de keuken.
- Schatting: **7 à 8 nieuwe groepen** (inductiekookplaat verplicht eigen groep, waarschijnlijk 3-fase; + oven, vaatwasser, combimagnetron, koelkast, espresso, afzuigkap/stopcontacten).
- Aanbeveling: Harm of Ralf laten meekijken op de meterkast voor definitief advies.

## Decisions

- Google Docs samenwerking loopt via `.docx` upload naar Drive — geen native editing mogelijk.
- Ralf Zwaan krijgt eigen CRM-profiel (hij is familie én professioneel betrokken).
- Week 35 in masterplan gecorrigeerd naar 24–30 aug.

## SSOT / structurele fixes (Librarian-pass)

- `PKM/CRM/INDEX.md` bijgewerkt — miste alle echte entries, bevatte alleen course samples. Alle bekende personen en organisaties toegevoegd.
- `marieke-van-ockenburg-zwaan.md` bijgewerkt — link naar [[ralf-zwaan]] toegevoegd als oudste broer.
- Wikilinks in nieuwe bestanden correct: `ralf-zwaan.md` → `marieke-van-ockenburg-zwaan`, `bouwbedrijf-zwaan`, `convenient-interior`, `verbouwing-huismanstraat-34`. Teruglinks vanuit `marieke` en `bouwbedrijf-zwaan` kloppen.

## Open threads

- [ ] Masterplan `.docx` uploaden naar Google Drive en delen met Marieke
- [ ] Week 29-planning invullen: wat doet Ralf precies in week 31?
- [ ] Type/vermogen Siemens 5-pits inductie opzoeken → juist aantal groepen meterkast bevestigen
- [ ] Gmail → Todoist workflow afmaken (reminder loopt morgen 09:00 via scheduled task `gmail-todoist-workflow-followup`)
- [ ] Privé keuken (fase 2 project): IKEA of Marktplaats, topvloer keuze
- [ ] Draairichting + exacte locatie nieuwe deur clientkamer beslissen voor Harm start
- [ ] PKA open threads vorige sessie: Marc Vleghert SL team 26-27, Xanne Lynn stub, financiele-vrijheid.md, Team Inbox 4 bestanden

## Cross-links

- [[2026-06-13-23-00_larry_darts-rdb-marc-vleghert-coaching]] — vorige sessie (LaCo, Gmail→Todoist, verbouwing start)
- [[verbouwing-huismanstraat-34]] — projectbestand verbouwing
- [[ralf-zwaan]] — nieuw CRM profiel
- [[bouwbedrijf-zwaan]] — nieuwe org entry
- [[convenient-interior]] — nieuwe org entry
