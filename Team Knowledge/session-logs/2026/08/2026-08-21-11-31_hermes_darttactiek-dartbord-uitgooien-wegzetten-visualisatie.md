---
agent_id: hermes
session_id: darttactiek-dartbord-uitgooien-wegzetten-visualisatie
timestamp: 2026-08-21T11:31:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes"]
---

# Darttactiek-dartbord-artifact: geometrie-fix en nieuwe wegzet-visualisatie

## Context

Sander had eerder een Artifact gebouwd ("Uitgooien Visualiseren — Darttactiek prototype") met een SVG-dartbord voor het Darttactiek-videocontentproject. Hij vond het bord "niet mooi genoeg" en wilde het stap voor stap laten verbeteren en uitbreiden, uiteindelijk tot een compleet tweede hoofdmodus (wegzetten naast uitgooien).

## What we did

- Hermes vond Sanders eigen boek ("Darttactiek – van beginner tot professional", PDF in `PKM/Documents/`) en installeerde `poppler` om pagina 25 te renderen en te vergelijken met het bord.
- Ontdekte en fixte de kernbug: de onderliggende CodePen-vector had 20 ongelijke taartpunten (hoek tussen groene vakken liep uiteen van ~28° tot ~49° i.p.v. steeds 36°). Alle ringen (single/triple/dubbel/bull) zijn herbouwd met exacte `polar()`/`wedgePath()`-geometrie, dezelfde die al voor de klikzones werd gebruikt.
- Bouwde een echte losse cijferring met buitenrand (vergeleken met boek-pagina 25), daarna op Sanders feedback weer versimpeld naar vlak zwart (geen brass bezel, geen scheidingslijnen) — meerdere kleine correctierondes.
- Voegde een hover-tooltip per vakje toe (82 vakjes) met naamgeving die Sander expliciet corrigeerde: "Single [n] (klein)", "Single [n] (groot)", "Triple [n]", "Double [n]", "Single bull", "Bullseye".
- **Nieuwe hoofdfunctie: Wegzetten visualiseren.** Per restscore toont het bord nu wat elk vakje achterlaat, met bust-markering volgens de officiële WDF-bustregel (opgezocht via de `wdf-regels`-skill: te veel gegooid, exact op de reststand zonder dubbel, of een stand van 1 over).
- Bouwde een "Directe finishes"-ledger (vakjes waarvan het restant zelf een dubbel/bullseye is), gesorteerd op de hoogte van de finish-dubbel (niet de eerste dart) na Sanders correctie.
- Herstructureerde de hele pagina op Sanders verzoek: een prominente Uitgooien/Wegzetten-modusschakelaar bovenaan, secundaire instellingen (Dubbels aanpassen, puntwaarden tonen, chip-achtergrond) verhuisd naar een instellingenmenu (tandwiel-icoon).
- Bouwde combineerbare bordfilters: Single/Double/Triple-ringtype-knoppen plus een losse "Mogelijke uitgooien"-knop, vrij te combineren, in beide modi.
- Vergrootte het bord (420px → 500px) en voegde een instelbare chip-achtergrond achter de cijfers toe voor leesbaarheid; rand later verstevigd (`--wire` i.p.v. `--felt-line`) na feedback dat de chips op lichte achtergronden nauwelijks opvielen.
- Verwijderde de automatisch geselecteerde default-route (T13→D18 stond altijd aan bij het laden) — vond en fixte daarbij een crash-bug in de 1-dart-modus die door die wijziging aan het licht kwam.
- Bouwde klik-naar-highlight voor de wegzet-finishes: klikken op een ledger-rij óf rechtstreeks op een vakje op het bord toont dezelfde paarse route-highlight die de Uitgooien-modus al had.
- Diverse kleine tekstcorrecties op Sanders verzoek (o.a. "vakje" → "score" in een lege-lijst-melding).

## Decisions made

- **Vraag:** Instellingenmenu licht houden of een echt tandwiel-menu bouwen?
  **Beslissing:** Een echt instellingenmenu (tandwiel-icoon met paneel).
- **Vraag:** Moeten het ringtype-filter en de "Mogelijke uitgooien"-filter combineerbaar zijn?
  **Beslissing:** Ja, vrij combineerbaar, en beide beschikbaar in zowel Uitgooien- als Wegzetten-modus.
- **Vraag:** Moet de nieuwe Wegzetten-ledger alle 82 vakjes tonen of alleen de vakjes met een directe finish?
  **Beslissing:** Alleen finishes.

## Insights

- De WDF Playing and Tournament Rules (lokale kennisbasis `PKM/Documents/WDF-Kennis/`) gaven de exacte bustregel-logica die nu de fundering vormt onder zowel de bust-kleuring als de "Mogelijke uitgooien"-filter — een casus waarbij een bestaande kennisbasis rechtstreeks bruikbaar bleek voor productcode, niet alleen voor vraagbeantwoording.
- Sanders eigen boek (pagina 25) bevestigde de nummervolgorde van het bord exact, wat waardevol was om de geometrie-fix te valideren tegen een gezaghebbende bron i.p.v. alleen interne consistentie.
- Herhaald patroon deze sessie: Sander geeft een correctie in vrij informele/gedicteerde taal (soms met verhaspelingen, bv. "boel" voor "bull"), en vraagt expliciet om verduidelijkende vragen bij twijfel — dat werkte goed en voorkwam verkeerd gebouwde features.

## Realignments

- Sander corrigeerde herhaaldelijk visuele details die niet aansloten bij zijn boek/de WDF-specificatie (brass bezel weg, scheidingslijnen weg, cijferring-verhouding aanpassen aan echte bordrand) — les: bij "mooi maken"-verzoeken eerst een gezaghebbende bron (boek, WDF-regels) raadplegen vóór het toevoegen van decoratieve elementen.
- Sander wilde geen automatisch geselecteerde route bij het laden van de pagina — een schoon, neutraal startpunt heeft de voorkeur boven een "handige" default.

## Open threads

- [ ] Team Inbox staat nog open: 1 screenshot + 3 documenten wachten op verwerking (niet opgepakt deze sessie — herhaald open punt over meerdere sessies).
- [ ] Geen kalibratie of koppeling gelegd tussen dit Artifact en de parallelle sessie over de uitgooi-route-formule (`[[2026-08-22-00-24_hermes_darts-uitgooi-route-formule]]`) — mogelijk interessant om op termijn samen te voegen (de formule zou de "Directe finishes"-ledger kunnen verrijken met een kwaliteitsscore per route).

## Next steps

- Bij een volgende sessie: vragen of de Wegzetten-modus en de nieuwe filters in de praktijk goed werken tijdens het maken van videocontent.
- Eventueel de dartbord-artifact en de uitgooi-route-formule (andere sessie) laten samenkomen als Sander daar behoefte aan heeft.

## Cross-links

- `[[2026-08-22-00-24_hermes_darts-uitgooi-route-formule]]` — zelfde dag, ander maar thematisch verwant darts-project (checkout-formule i.p.v. dartbord-artifact).
