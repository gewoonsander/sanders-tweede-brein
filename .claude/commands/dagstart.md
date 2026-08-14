# dagstart

Proactieve ochtendroutine. Bereidt Sander voor op de dag — agenda, taken, inbox, intentie. Geen journaling (dat is WS-001 aan het einde van de dag).

## Gebruik

```
/dagstart
```

## Wat er gebeurt

Hermes doorloopt acht stappen in volgorde:

### Stap 1 — Agenda vandaag
Haal de afspraken van vandaag op via Google Calendar. Toon: tijd, titel, locatie (indien aanwezig). Als er niets staat: meld dat expliciet ("Geen afspraken vandaag").

### Stap 2 — Verjaardagen vandaag
Haal vandaag's verjaardagen op via Google Calendar (`eventType: BIRTHDAY`). Voor elke gevonden verjaardag: zoek het bijbehorende bestand in `PKM/CRM/People/`.
- **Bestaat het bestand**: gebruik de context erin (relatie, "how we met", gedeelde interesses, notities) om een kort, persoonlijk berichtvoorstel te schrijven (WhatsApp-stijl) — geen generiek "gefeliciteerd", iets dat past bij de relatie.
- **Bestaat het niet**: meld alleen de naam en bied aan dat Penn een stub aanmaakt (zie [[GL-011-contactenbeheer]]).
- Nooit zelf iets versturen — alleen voorstellen, Sander verstuurt zelf.
- Geen verjaardagen vandaag: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 3 — Open taken vandaag
Haal taken op via Todoist die vandaag vervallen of als prioriteit zijn gemarkeerd. Groepeer per project indien meer dan 5 taken. Als er niets staat: meld dat expliciet.

### Stap 4 — Team Inbox check
Controleer of er bestanden of notities in `Team Inbox/` staan die nog niet verwerkt zijn. Meld wat er ligt en bied aan het te routeren naar de juiste specialist.

### Stap 5 — ADC-verslagen klaar voor review
Controleer `ADC/Verslagen/` op bestanden met status `CONCEPT — ter review door Sander` (gegenereerd door de scheduled routine `adc-oost-verslag-ochtend` of handmatig door Hermes). Voor elk gevonden concept: meld toernooi, locatie, datum en winnaar in één regel. Geen concepten gevonden: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 6 — Deliverables die aandacht nodig hebben
Controleer losstaande Deliverables (geen eigenaartaak, zie [[GL-004-task-resource-linking]]) ouder dan 30 dagen die niet aan één van de archiveercriteria uit [[SOP-020-losstaand-deliverable-archiveren]] voldoen. Meld ze in één regel per stuk (bestandsnaam + leeftijd). Dit is een melding, geen archivering — verplaats niets. Geen kandidaten: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 7 — Dagintentie (optioneel)
Vraag: "Wat wil je vandaag bereiken?" — één open vraag. Als Sander antwoordt, geeft Penn het door als journal-notitie voor vandaag. Als Sander zegt "overslaan" of niets invult, ga verder.

### Stap 8 — Tijdsblokken voorstellen (optioneel)
Als taken uit stap 3 een tijdsinschatting (⏰, zie [[GL-014-todoist-taakformat]]) en een datum van vandaag hebben, stel concrete tijdsblokken voor om ze in de agenda te zetten. Nooit automatisch aanmaken — altijd eerst voorleggen en op akkoord wachten voor je iets in Google Calendar zet. Zijn er geen taken om te blokken: sla deze stap stilzwijgend over, geen melding nodig.

## Regels

- Altijd in deze volgorde — nooit stappen samenvoegen of overslaan
- Compact presenteren — geen lange uitleg, alleen de feiten
- Stap 2 (bij geen verjaardagen), 5 (bij geen concepten), 6 (bij geen kandidaten), 7 en 8 zijn optioneel/overslaanbaar — nooit opdringen
- Geen acties uitvoeren zonder expliciete bevestiging (bijv. taken niet automatisch afsluiten, tijdsblokken niet automatisch aanmaken, berichten niet automatisch versturen, Deliverables niet automatisch archiveren)
- Keuzeopties altijd met (A)(B)(C) labels
