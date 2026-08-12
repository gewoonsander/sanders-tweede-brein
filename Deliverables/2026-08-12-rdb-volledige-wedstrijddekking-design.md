---
title: RDB volledige wedstrijddekking
date: 2026-08-12
status: implemented
owner: daedalus
---

# RDB volledige wedstrijddekking

## Aanleiding

De actieve workflow kent alle teams, maar `Code • Prepare Team Details` begrenst de detailcrawl met `slice(0,10)`. Daardoor bevat `matches` alleen programma's van een kleine alfabetische selectie en ontbreken de wedstrijden van D.T. Irritant (`team_id 394`). Daarnaast begrenst `Code • Normalize Matches` de gededupliceerde uitvoer op 100 wedstrijden.

## Gewenst resultaat

- Alle actieve RDB-teams van seizoen 2026–2027 worden meegenomen.
- Wedstrijden worden op `bond_id|match_id` gededupliceerd.
- Het volledige gevonden programma wordt opgeslagen; geen limiet van 100 wedstrijden.
- Bestaande read-before-write- en deltafilters blijven behouden.
- Een controlerun bewijst dat wedstrijden met team-ID `394` in `matches` staan.
- De wekelijkse planning en centrale foutworkflow blijven actief.

## Aanpakken

### A — Alle teamdetailpagina's in één wekelijkse run

Verwijder beide POC-limieten. De bestaande HTTP-node verwerkt teams sequentieel met 1,2 seconde tussen requests. Wedstrijden die via twee teams voorkomen worden vóór opslag gededupliceerd.

Voordelen: kleinste wijziging, complete team- en spelersdekking, sluit aan op bewezen parsers. Nadelen: ongeveer twee minuten extra netwerktijd bij honderd teams en dezelfde pagina wordt gebruikt voor zowel spelers als wedstrijden.

### B — Wedstrijden via divisieprogramma's

Bouw een aparte route per divisie en parseer het volledige competitieprogramma rechtstreeks uit divisiepagina's.

Voordelen: waarschijnlijk minder HTTP-requests en natuurlijker voor volledige wedstrijddekking. Nadelen: nieuwe bronroute en parser moeten volledig worden onderzocht en gevalideerd; spelers vereisen alsnog teamdetailpagina's.

### C — Alleen favoriete teams volledig synchroniseren

Voeg een allowlist toe met D.T. Irritant en eventueel later andere favoriete teams.

Voordelen: snel en zeer weinig requests. Nadelen: database blijft onvolledig en voldoet niet aan het bredere doel van een betrouwbare RDB-database.

## Advies

Kies aanpak A. De bestaande parser, vertraging, deduplicatie en delta-upsert zijn al bewezen. Dit is de snelste veilige route naar volledige dekking. Als de runtime of bronbelasting later te hoog wordt, kan aanpak B als optimalisatie worden onderzocht zonder het datamodel te wijzigen.

## Verificatie

1. Nodeconfiguraties valideren en workflowupdate atomair uitvoeren.
2. Handmatige controlerun starten.
3. Controleren dat de run slaagt en de Google Sheets-writequota niet overschrijdt.
4. In `matches` zoeken op team-ID `394` en de gevonden speeldatums rapporteren.
5. Ongewijzigde herhaalrun is alleen nodig als de deltafilters of upsertlogica worden aangepast; die blijven in dit ontwerp intact.

## Implementatieresultaat

- De limiet van tien teamdetailpagina's en de limiet van honderd wedstrijden zijn verwijderd.
- Handmatige uitvoering `1045` slaagde in 3 minuten en 6 seconden zonder quota- of parserfout.
- De wedstrijdtabel groeide naar 1.587 gegevensrijen; 25 wedstrijden bevatten D.T. Irritant (`team_id 394`).
- De uitgebreide workflow is gepubliceerd als actieve versie `b5f2cd36-a34c-4b3d-beb8-7bafef034a4b`.
- De planning blijft iedere maandag om 04:00 in `Europe/Amsterdam`; centrale Gmail-foutafhandeling blijft gekoppeld.
