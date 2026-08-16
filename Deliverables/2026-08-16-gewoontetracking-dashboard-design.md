# Ontwerp — Gewoontetracking in het myPKA-dashboard

## Aanleiding

De cockpit bevat al een actieve Tracking-pagina met heatmaps en streaks. De tabel `habit_logs` en de views `v_habit_heatmap` en `v_habit_streaks` bestaan eveneens, maar `habit_logs` is leeg. Dagelijkse bevestigingen worden nu alleen als vrije tekst onder `## Reflection` in de gewoontebestanden geschreven. Er ontbreekt een omzetter van die canonieke Markdown naar de afgeleide database.

De nieuwe gewoontes [[dagelijks-opdrukken]], [[dagelijks-bewegen]] en [[bodylotion-aanbrengen]] moeten op dezelfde manier kunnen worden bevraagd als [[schimmelcreme-gebruiken]]. Voor opdrukken moet naast gedaan/niet gedaan ook het werkelijke aantal zichtbaar kunnen worden.

## Ontwerpdoelen

- Markdown blijft de single source of truth.
- De dagelijkse afsluitroutine blijft het primaire accountabilitymoment.
- Het dashboard toont per actieve dagelijkse gewoonte een kalender en voortgang.
- Opdrukken ondersteunt een hoeveelheid en eenheid, zodat opbouw vanaf 25 zichtbaar is.
- Bestaande vrije Reflection-regels blijven leesbaar en worden waar mogelijk meegenomen.
- Een regeneratie is deterministisch en veilig meerdere keren uitvoerbaar.

## Onderzochte aanpakken

### A. Alleen vrije tekst herkennen

Een extractor probeert bestaande zinnen zoals “bevestigd: crème vandaag aangebracht” te interpreteren.

Voordeel: geen wijziging aan het schrijfproces. Nadeel: kwetsbaar voor formulering, moeilijk betrouwbaar voor aantallen en toekomstige gewoontes.

### B. Gestructureerde Reflection-check-ins met terugwaartse herkenning — aanbevolen

Nieuwe check-ins krijgen onder de datum een kleine, menselijk leesbare structuur:

```markdown
### 2026-08-16

- done: true
- amount: 25
- unit: herhalingen
- note: verdeeld over twee sets
```

Een extractor leest deze structuur, herkent daarnaast de voornaamste bestaande ✓/niet-gedaan-regels en vult `habit_logs`. De database krijgt optionele velden voor hoeveelheid en eenheid. De Tracking-kaart toont bij opdrukken het laatst behaalde aantal naast de bestaande heatmap en streak.

Voordelen: betrouwbaar, uitbreidbaar en Markdown blijft canoniek. Nadeel: de afsluitroutine moet voortaan dezelfde vaste logvorm gebruiken.

### C. Rechtstreeks vanuit het dashboard in SQLite schrijven

De Tracking-pagina krijgt afvinkknoppen en invoer voor aantallen.

Voordeel: snel in gebruik. Nadelen: doorbreekt de huidige read-only cockpit en de Markdown-SSOT; vraagt synchronisatie en conflictbeleid. Daarom nu niet passend.

## Aanbevolen implementatie

1. Breid `habit_logs` additief uit met `amount` en `unit`.
2. Maak een idempotente extractor die alle Habit-bestanden leest en `habit_logs` opnieuw opbouwt vanuit `## Reflection`.
3. Laat de gewone myPKA-regeneratie de extractor uitvoeren, zodat nieuwe check-ins vanzelf in het dashboard verschijnen.
4. Breid het Tracking-API-contract en de kaart uit met de laatste hoeveelheid, zonder bestaande heatmap- of streakweergave te vervangen.
5. Leg de vaste Reflection-logvorm vast in de afsluitprocedure, inclusief:
   - opdrukken: gedaan, werkelijk aantal, optionele sets/notitie;
   - bewegen, bodylotion en crème: gedaan/niet gedaan, optionele notitie.
6. Voeg parser-, database- en API-tests toe en voer de bestaande cockpit-tests uit.

## Grenzen van deze versie

- Geen invoer of afvinken vanuit het dashboard; de cockpit blijft read-only.
- Geen Apple Health- of GPX-import.
- Geen automatische herinneringen buiten de bestaande afsluitroutine.
- Geen strafkleur of beschamende melding bij gemiste dagen.

## Acceptatiecriteria

- Alle actieve dagelijkse gewoontes kunnen na een check-in op Tracking verschijnen.
- Opdrukken toont het laatst geregistreerde aantal.
- Een tweede regeneratie levert geen dubbele logregels op.
- De bestaande crème-Reflection wordt waar mogelijk teruggevuld.
- Vrije tekst die niet betrouwbaar te interpreteren is, wordt niet als gedaan gegokt.
- Markdown blijft de canonieke bron en de dashboardlaag blijft afgeleid en read-only.

