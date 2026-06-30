# rename-images

Bekijk afbeeldingen in een map via vision en stel op basis van de inhoud een beschrijvende kebab-case naam voor. Hernoem pas na bevestiging van de gebruiker.

## Gebruik

```
/rename-images <pad-naar-map>
```

Voorbeeld: `/rename-images ~/Pictures/uitzoeken`

## Stappen

1. **Lijst alle afbeeldingen** in de opgegeven map (maxdepth 1, extensies: jpg, jpeg, png, gif, webp, JPG, JPEG, PNG — geen submappen tenzij de gebruiker dat vraagt).

2. **Verwerk ze per stuk** — voor elk bestand:
   a. Gebruik de Read tool om de afbeelding te bekijken.
   b. Stel een beschrijvende kebab-case naam voor op basis van wat je ziet: personen, locatie, activiteit, object, sfeer. Gebruik altijd een datum-prefix als die al in de bestandsnaam zit (`YYYY-MM-DD-`). Anders geen verzonnen datum.
   c. Houd de extensie in kleine letters (`.jpg`, `.png`).
   d. Maximaal 6 woorden in de naam, geen stopwoorden (de, het, een, van, in).

3. **Presenteer de voorstellen gebundeld** — toon een tabel:
   ```
   | Huidige naam | Voorgestelde naam |
   |---|---|
   | DSC09637.JPG | 2017-06-28-sander-achtertuin.jpg |
   | gmd5.jpeg | dartbord-close-up.jpg |
   ```

4. **Vraag bevestiging** voor je hernoemt:
   - **A** — Alles hernoemen zoals voorgesteld
   - **B** — Per stuk bevestigen
   - **C** — Annuleren

5. **Hernoem** op basis van de keuze. Meld het resultaat in één zin.

## Regels

- Volg [[GL-001-file-naming-conventions]] — kebab-case, kleine letters, geen spaties.
- Hernoem nooit zonder expliciete bevestiging van de gebruiker.
- Als een afbeelding persoonsgegevens bevat (gezichten, namen), gebruik dan een generieke beschrijving tenzij de gebruiker de naam kent.
- Bij twijfel over de inhoud: gebruik de meest beschrijvende term die je zeker weet.
- Sla submappen over tenzij de gebruiker `--recursive` meegeeft.
