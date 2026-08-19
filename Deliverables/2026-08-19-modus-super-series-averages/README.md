# MODUS Super Series — speler-gemiddelden per Series

Opgehaald op 2026-08-19 met `Team Knowledge/scripts/modus-super-series-averages.py`
van [modussuperseries.com](https://modussuperseries.com/). Hoort bij taak
[[tsk-2026-08-19-004]].

## De bestanden

| Bestand | Wat erin staat | Rijen |
|---|---|---|
| `modus-super-series-per-series.csv` | **Hoofdresultaat.** Eén rij per speler per Series, met het Series-eindgemiddelde. | 1937 |
| `modus-super-series-per-week.csv` | Ruwe brondata: één rij per speler per week, precies zoals de site die toont. | 2182 |
| `modus-super-series-alltime.csv` | Eén rij per speler over alle Series samen. | 593 |

Kolommen in het hoofdbestand: `series`, `series_id`, `series_status`, `positie`,
`speler`, `weken_gespeeld`, `gespeeld`, `punten`, `darts`, `gemiddelde`.

## Belangrijk: hoe het Series-gemiddelde is berekend

De site toont per week een tabel met de kop **"Accumulative Averages"**. Die naam is
misleidend: de tabel is cumulatief **binnen die ene week** (groepswedstrijden,
finalegroep, halve finales en finale van dat week-evenement), niet cumulatief over
de hele Series. Elke week heeft een eigen spelersveld.

Geverifieerd op 2026-08-19: Series 1 week 6, week 9 en week 13 delen vrijwel geen
spelers, en Ciaran Teehan staat in week 6 met 4 gespeelde partijen en in week 13
met 8 — losse tellingen, geen doorlopende.

**Gevolg:** de laatste week van een Series is níét het eindgemiddelde van die
Series. Het Series-gemiddelde in `per-series.csv` is daarom berekend als:

```
gemiddelde = 3 × (som van alle punten in die Series) / (som van alle darts in die Series)
```

Die formule is getoetst aan de site zelf: week 6 van Series 1 geeft James Hurrell
4722 punten / 159 darts → 3 × 29,698 = 89,09, exact het getoonde gemiddelde.

## Wat er is opgehaald

16 onderdelen uit de dropdown van de site:

- **Series 1 t/m 14** — `series_status: afgerond`
- **Series 15** — `series_status: lopend (tussenstand)`, 3 van de geplande weken
  gespeeld op ophaaldatum (Series 15 loopt t/m 31-10-2026)
- **Double Trouble** — `series_status: los evenement`, 1 week, geen genummerde Series

De status komt uit de [Honours Board](https://modussuperseries.com/honours-board):
alleen afgeronde Series hebben daar een winnaar. Dat is bewust niet hardcoded, zodat
het klopt zodra Series 15 afloopt.

## Uitgevoerde controles

| Controle | Uitkomst |
|---|---|
| Weekgemiddelde vs. herberekend 3 × punten / darts, alle 2182 rijen | 0 afwijkingen |
| Series-totalen vs. optelling van de weekdata, alle 1937 rijen | 0 mismatches |
| Series-rijen zonder gemiddelde | 0 |
| Gemiddelden buiten het bereik 30–120 | 0 |
| Weken zonder tabelrijen | geen |

## Beperkingen en bronartefacten

- **Series 1 mist de weken 1 t/m 5.** De site heeft voor die weken geen
  averages-pagina; Series 1 begint bij Week 6. Alle andere afgeronde Series hebben
  13 volledige weken. Het Series 1-gemiddelde is dus gebaseerd op 8 van de 13 weken.
- **Underscores in achternamen.** De bron schrijft samengestelde achternamen als
  `Jeffrey de_Zwaan`, `Gian van_Veen`, soms met een underscore aan het eind
  (`Rusty-Jake Rodriguez_`) — 38 spelers in totaal. Die zijn genormaliseerd naar
  spaties. De onbewerkte brontekst staat in de kolom `speler_bron` van
  `per-week.csv`. De bron doet dit consistent: vóór en ná normalisatie zijn het
  593 unieke spelers, er zijn dus geen dubbele varianten samengevoegd.
- **HTML-entiteiten in namen.** De bron levert apostrofs als `&#039;`
  (`Tony O&#039;Shea`) — 5 spelers. Die worden nu gedecodeerd naar een echte
  apostrof. Dit is op 2026-08-19 hersteld nadat het in de eerste versie van de
  dataset nog onvertaald in de CSV's stond.
- **Spelers worden op naam samengevoegd**, niet op een spelers-ID (de site biedt er
  geen). Twee verschillende spelers met exact dezelfde naam zouden samenvallen; dat
  is niet gecontroleerd.
- De `positie`-kolom in `per-series.csv` is door dit script toegekend op basis van
  het berekende Series-gemiddelde. Het is géén officiële eindstand van de
  competitie — Modus rangschikt de Series op resultaat, niet op gemiddelde.

## Opnieuw ophalen

```bash
python3 "Team Knowledge/scripts/modus-super-series-averages.py" \
  --uit "Deliverables/2026-08-19-modus-super-series-averages"
```

Het script leest de Series-lijst uit de dropdown van de site, dus een nieuwe Series 16
wordt vanzelf meegenomen zonder codewijziging. Met `--cache MAP` wordt de opgehaalde
HTML bewaard, zodat een herdraai de site niet opnieuw belast.
