# dagstart

Proactieve ochtendroutine. Bereidt Sander voor op de dag — agenda, taken, inbox, intentie. Geen journaling (dat is WS-001 aan het einde van de dag).

## Gebruik

```
/dagstart
```

## Wat er gebeurt

Hermes doorloopt negen stappen in volgorde:

### Stap 1 — Agenda vandaag
Haal de afspraken van vandaag op via Google Calendar. Toon: tijd, titel, locatie (indien aanwezig). Als er niets staat: meld dat expliciet ("Geen afspraken vandaag").

### Stap 2 — Verjaardagen vandaag
Haal vandaag's verjaardagen op via Google Calendar (`eventType: BIRTHDAY`). Voor elke gevonden verjaardag: zoek het bijbehorende bestand in `PKM/CRM/People/`.
- **Bestaat het bestand**: gebruik de context erin (relatie, "how we met", gedeelde interesses, notities) om een kort, persoonlijk berichtvoorstel te schrijven (WhatsApp-stijl) — geen generiek "gefeliciteerd", iets dat past bij de relatie.
- **Bestaat het niet**: meld alleen de naam en bied aan dat Penn een stub aanmaakt (zie [[GL-011-contactenbeheer]]).
- Nooit zelf iets versturen — alleen voorstellen, Sander verstuurt zelf.
- Geen verjaardagen vandaag: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 3 — Open persoonlijke taken vandaag
Lees de canonieke taken uit `PKM/Tasks/` conform [[GL-019-persoonlijke-taakarchitectuur]]. Toon: `scheduled` voor vandaag, echte `due_date` vandaag of verlopen, beschikbare belangrijke `next`-acties en `waiting`-taken waarvan `follow_up_date` vandaag of verlopen is. Gebruik Eisenhower voor rangschikking en groepeer per Project of Key Element bij meer dan 5 taken. Todoist is alleen een afgeleide controleweergave; een verschil wordt gemeld en niet stilzwijgend als waarheid overgenomen. Als er niets staat: meld dat expliciet.

### Stap 4 — Lopende bestellingen
Laat Pieter Post eerst Gmail doorzoeken op nieuwe bestelbevestigingen en logistieke statusmails sinds de vorige verwerking. Hij leest de volledige relevante thread, koppelt de mail aan de juiste bestelling, werkt [[lopende-bestellingen]] bij en verwijdert de bronmail alleen wanneer de vaste regels in [[Team/Pieter Post - Emailregisseur/AGENTS]] dat toestaan. Lees daarna [[lopende-bestellingen]]. Toon alleen nieuwe bestellingen en betekenisvolle statuswijzigingen die nog niet bij een eerdere dagstart zijn gemeld. Per pakket: leverancier, korte omschrijving, actuele status en verwachte bezorging indien bekend. Als een pakket is overgedragen aan een vervoerder, noem de vervoerder wanneer die bekend is. Markeer de getoonde status daarna als gemeld in het overzicht. Zijn er geen nieuwe of gewijzigde statussen: sla deze stap stilzwijgend over.

### Stap 5 — Team Inbox check
Bestaat `Team Inbox/_wekelijkse-inboxronde-laatste-run.md` (geschreven door de wekelijkse `inbox-verwerken`-automatisering, zie [[SOP-013-inboxen-verwerken]])? Meld dan compact de wachtrij daaruit: hoeveel automatisch verplaatst, hoeveel wachten op beoordeling en waarom (financieel/gevoelig, twijfel, mogelijk duplicaat, tekst voor Penn). Bied aan de wachtrij nu samen door te nemen.
Bestaat dat bestand niet (nog geen automatische run geweest): val terug op een live check van `Team Inbox/` en meld wat er ligt.

### Stap 6 — ADC-verslagen en vooraankondigingen klaar voor review
Controleer `ADC/Verslagen/` op bestanden met status `CONCEPT — ter review door Sander` (gegenereerd door de lokale LaunchAgent `nl.gewoonsander.adc-verslag-ochtend` — dagelijks 07:00 op de Mac mini, niet zichtbaar in cloud-scheduled-tasks — of handmatig door Hermes). Twee types, beide relevant:
- **Verslagen** (`facebook-verslag-[locatie]-YYYY-MM-DD.md`, zie [[WS-004-facebook-toernooi-verslag]]) — terugkijkend, gegenereerd de ochtend ná een gespeeld toernooi. Meld toernooi, locatie, datum en winnaar in één regel.
- **Vooraankondigingen** (`facebook-vooraankondiging-[locatie]-YYYY-MM-DD.md`, zie [[WS-009-adc-facebook-vooraankondiging]]) — vooruitkijkend, gegenereerd dezelfde ochtend als een gepland toernooi. Meld locatie, aanvangstijd en datum in één regel — dit is met opzet urgent (toernooi is vaak diezelfde avond), dus dagstart is het moment om het direct voor te leggen.

Geen concepten van geen van beide types gevonden: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 7 — Deliverables die aandacht nodig hebben
Controleer losstaande Deliverables (geen eigenaartaak, zie [[GL-004-task-resource-linking]]) ouder dan 30 dagen die niet aan één van de archiveercriteria uit [[SOP-020-losstaand-deliverable-archiveren]] voldoen. Meld ze in één regel per stuk (bestandsnaam + leeftijd). Dit is een melding, geen archivering — verplaats niets. Geen kandidaten: sla deze stap stilzwijgend over, geen melding nodig.

### Stap 8 — Dagintentie (optioneel)
Vraag: "Wat wil je vandaag bereiken?" — één open vraag. Als Sander antwoordt, geeft Penn het door als journal-notitie voor vandaag. Als Sander zegt "overslaan" of niets invult, ga verder.

### Stap 9 — Tijdsblokken voorstellen (optioneel)
Als taken uit stap 3 `estimated_minutes` en een `scheduled_date` van vandaag hebben, stel concrete tijdsblokken voor om ze in de agenda te zetten. Nooit automatisch aanmaken — altijd eerst voorleggen en op akkoord wachten voor je iets in Google Calendar zet. Zijn er geen taken om te blokken: sla deze stap stilzwijgend over, geen melding nodig.

## Regels

- Altijd in deze volgorde — nooit stappen samenvoegen of overslaan
- Compact presenteren — geen lange uitleg, alleen de feiten
- Stap 2 (bij geen verjaardagen), 4 (bij geen statuswijzigingen), 6 (bij geen concepten), 7 (bij geen kandidaten), 8 en 9 zijn optioneel/overslaanbaar — nooit opdringen
- Geen acties uitvoeren zonder expliciete bevestiging (bijv. taken niet automatisch afsluiten, tijdsblokken niet automatisch aanmaken, berichten niet automatisch versturen, Deliverables niet automatisch archiveren)
- Keuzeopties altijd met (A)(B)(C) labels
