# improve-skill

Verbeter een bestaande skill op basis van feedback. Past het skill-bestand permanent aan en commit naar git.

## Gebruik

```
/improve-skill <skill-naam> <wat er mis was>
```

Voorbeelden:
- `/improve-skill rename-images namen moeten altijd Nederlands zijn, niet Engels`
- `/improve-skill brainstorm stel nooit meer dan één vraag per bericht`
- `/improve-skill close-session voeg altijd open threads toe aan Todoist`

## Wat er gebeurt

1. **Lees het huidige skill-bestand** — `.claude/commands/<skill-naam>.md`
2. **Analyseer de feedback** — wat ging er mis, wat moet anders
3. **Toon het verschil** — wat wordt aangepast en waarom
4. **Vraag bevestiging** voordat er iets gewijzigd wordt
5. **Pas het bestand aan** — verwerk de feedback in de instructies
6. **Commit naar git** — met bericht: `Improve skill: <skill-naam> — <korte reden>`
7. **Sla de verbetering op in memory** — zodat toekomstige sessies de context kennen

## Regels

- Nooit een skill aanpassen zonder bevestiging van Sander
- De oorspronkelijke intentie van de skill blijft intact — alleen het gedrag dat niet werkte wordt aangepast
- Bij twijfel over de juiste aanpassing: stel één verduidelijkende vraag
- Altijd een git-commit zodat verbeteringen terug te draaien zijn
- Na aanpassing: kort samenvatten wat er veranderd is en waarom
