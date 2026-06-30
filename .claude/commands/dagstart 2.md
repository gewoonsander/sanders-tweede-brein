# dagstart

Proactieve ochtendroutine. Bereidt Sander voor op de dag — agenda, taken, inbox, intentie. Geen journaling (dat is WS-001 aan het einde van de dag).

## Gebruik

```
/dagstart
```

## Wat er gebeurt

Hermes doorloopt vier stappen in volgorde:

### Stap 1 — Agenda vandaag
Haal de afspraken van vandaag op via Google Calendar. Toon: tijd, titel, locatie (indien aanwezig). Als er niets staat: meld dat expliciet ("Geen afspraken vandaag").

### Stap 2 — Open taken vandaag
Haal taken op via Todoist die vandaag vervallen of als prioriteit zijn gemarkeerd. Groepeer per project indien meer dan 5 taken. Als er niets staat: meld dat expliciet.

### Stap 3 — Team Inbox check
Controleer of er bestanden of notities in `Team Inbox/` staan die nog niet verwerkt zijn. Meld wat er ligt en bied aan het te routeren naar de juiste specialist.

### Stap 4 — Dagintentie (optioneel)
Vraag: "Wat wil je vandaag bereiken?" — één open vraag. Als Sander antwoordt, geeft Penn het door als journal-notitie voor vandaag. Als Sander zegt "overslaan" of niets invult, ga verder.

## Regels

- Altijd in deze volgorde — nooit stappen samenvoegen of overslaan
- Compact presenteren — geen lange uitleg, alleen de feiten
- Stap 4 is optioneel — nooit opdringen
- Geen acties uitvoeren zonder expliciete bevestiging (bijv. taken niet automatisch afsluiten)
- Keuzeopties altijd met (A)(B)(C) labels
