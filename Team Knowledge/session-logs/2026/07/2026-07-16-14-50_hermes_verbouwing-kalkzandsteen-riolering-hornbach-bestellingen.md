---
agent_id: hermes
session_id: verbouwing-kalkzandsteen-riolering-hornbach-bestellingen
timestamp: 2026-07-16T14:50:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Verbouwing: kalkzandsteen-optimalisatie, keukenafvoer-riolering, en Hornbach-bestellingen doorgerekend

## Context

Sessie voortgezet na compactie (eerdere portie: radiatoraansluitingen, elektra-groepenkast-uitbreiding, kalkzandsteen kozijngat eerste opzet, geluidsisolerend plafond cliëntenkamer, Google Sheets-materialenlijst). Deze zichtbare portie draaide vrijwel volledig om de verbouwing Huismanstraat 34: het reconciliëren van meerdere Hornbach-winkelwagen-versies tegen de materialenlijst, een grondige herberekening van de kalkzandsteen-oplossing voor het kozijngat, het gipsplaatwandje bij Xanne Lynn, een complete rioolafvoer-uitwerking voor de nieuwe keuken, en het daadwerkelijk (laten) bestellen van dit alles bij Hornbach.

## What we did

- **Hermes** verwerkte een radiator-outletfactuur (202633871) en vulde de exacte prijzen (€431,89 / €465,30 / €455,20 + transport) in de materialenlijst.
- **Hermes** corrigeerde een reeks eerder abusievelijk als "besteld" gemarkeerde Hornbach-items terug naar "in winkelwagen, nog niet besteld" nadat Sander aangaf dat eerdere cart-PDF's slechts winkelwagen-afdrukken waren, geen bevestigde orders — daarna alsnog bevestigd als echte, betaalde bestelling toen een order-e-mail (DV9049176771) opdook.
- **Hermes** herrekende de ROCKWOOL-rotswol: prijs bleek per m² i.p.v. per plaat, en het product is alleen per pak van 5 platen verkrijgbaar — kosten gecorrigeerd van €263,75 naar €189,90.
- **Hermes** vond een gemiste bestelling bij De Isolatieshop BV (order 313100) voor de metal-stud teksschroef, niet bij Hornbach zoals eerder gepland.
- **Hermes** rekende het gipsplaatwandje (knieschot) bij Xanne Lynn door in drie varianten (1200mm plat, 600mm horizontaal gestapeld, 600mm verticaal in 2 stukken per plaat) — verticaal met 2 stukken per plaat bleek net zo goedkoop als horizontaal maar zonder naad, en werd de gekozen oplossing (4 platen, €23,20).
- **Hermes** vond en corrigeerde een fundamentele misvatting over kalkzandsteen-inbouwdozen (ATTEMA U-serie) — bleek via klantreviews wél geschikt voor stopcontact-montage, niet alleen kabeldoorvoer.
- **Hermes** herrekende de kalkzandsteen-oplossing voor het kozijngat drie keer door, eindigend bij: **262 stuks waalformaat, twee legrichtingen (102mm + 55mm), €104,80** — goedkoopste en eenvoudigste optie t.o.v. een lijmblok-mix of amstelformaat, waarmee SAKRETE blokkenlijm en lijmverdeler kwamen te vervallen.
- **Hermes** werkte een volledige, met AI-kennis gecorrigeerde rioolafvoer-materialenlijst uit voor de nieuwe keuken (spoelbak + vaatwasser): diameter gecorrigeerd van Ø40 naar Ø50mm, een beluchter (AAV) toegevoegd, het afschot-advies van de gebruiker gecorrigeerd (5mm/m was te weinig voor de 50mm-leiding), en alle 27+ producten met Hornbach-artikelnummers en prijzen opgezocht.
- **Hermes** probeerde de rioolproducten via browser-automatisering in de Hornbach-winkelwagen te zetten — dit faalde meteen (onbetrouwbare formulier-interactie, ongewenste navigatie), waarna is teruggevallen op een directe-links-lijst voor Sander om zelf toe te voegen.
- **Hermes** vergeleek de uiteindelijke, echte, betaalde Hornbach-reservering (RA9049183135, €619,25, afhalen Nijmegen) tegen het plan en vond meerdere afwijkingen: verkeerd SOUDAL-product (Fix All High Tack i.p.v. Flexi, later verklaard als bewuste extra aankoop voor plinten), een tekort aan bocht-87°-Ø110mm door voorraadgebrek in Nijmegen (opgelost met 2 extra bochten 45° als vervanging, op te halen in Duiven), en een kleine hoeveelheidsafwijking bij het Ø110×125mm-verloopstuk.
- **Hermes** ruimde Team Inbox op (8 verwerkte bestanden verwijderd na expliciete bevestiging) en schreef de journaal- en habit-reflectie voor vandaag.

## Decisions made

- **Vraag:** Welke kalkzandsteen-oplossing voor het kozijngat?
  **Besluit:** Alleen waalformaat, twee legrichtingen (102mm + 55mm) — 262 stuks, €104,80. Goedkoper en eenvoudiger dan de lijmblok-mix of amstelformaat-alternatieven.
- **Vraag:** Gipsplaatwandje Xanne Lynn — welke plaatbreedte en oriëntatie?
  **Besluit:** 600mm-brede platen (beter door deur/trapgat), verticaal geplaatst met 2 stukken per plaat van 2600mm — 4 platen, €23,20, geen horizontale naad.
- **Vraag:** Diameter van de nieuwe keukenafvoer (spoelbak + vaatwasser)?
  **Besluit:** Ø50mm i.p.v. de oorspronkelijk voorgestelde Ø40mm, plus een beluchter (AAV) toegevoegd tegen het wegzuigen van het waterslot.
- **Vraag:** Y-stuk voor de rioolaansluiting — Ø110 of Ø125?
  **Besluit:** De Ø110-variant bleek niet leverbaar; Ø125-variant + 3 verloopringen Ø110×125mm gekozen als flexibele oplossing die zowel een 110mm- als 125mm-bestaande leiding aankan.
- **Vraag:** Ontbrekende bocht 87° Ø110mm (voorraad Nijmegen op) — hoe oplossen?
  **Besluit:** 1 stuk blijft in de betaalde reservering; de 2e wordt vervangen door 2× bocht 45° (apart op te halen in Duiven).

## Insights

- Browser-automatisering op de Hornbach-site blijft onbetrouwbaar voor het vullen van een winkelwagen — een tweede, onafhankelijke poging deze sessie faalde net zo hard als eerdere pogingen. Directe productlinks + handmatige actie door Sander is de betrouwbare route gebleken.
- Cart-PDF's die Sander deelt zijn niet automatisch bevestigde bestellingen — dit leidde tot een foutieve "Besteld"-markering die later teruggedraaid moest worden. Voortaan expliciet navragen of een winkelwagen-afdruk een concept is of een afgeronde (betaalde) bestelling, tenzij een bevestigingsmail dat al aantoont.
- Bij PVC-rioolproducten kan Hornbach's eigen "per m²"-prijsvermelding een andere brik-oriëntatie aannemen dan de fysieke installatiepraktijk — zelf narekenen op basis van fysieke afmetingen blijft betrouwbaarder dan de winkel-eigen conversie klakkeloos overnemen (zoals eerder ook bleek bij de ROCKWOOL-rotswol).

## Realignments

- Sander corrigeerde de kalkzandsteen-legrichting-aanname meermaals — eerst een amstelformaat-vergelijking, toen een waalformaat-alleen-oplossing met 2 legrichtingen, wat uiteindelijk de goedkoopste en eenvoudigste optie bleek.
- Sander corrigeerde de hoeveelheid MARTENS-buis Ø110mm van 3 naar 1 stuk — de bestaande buitenriolering ligt daadwerkelijk maar ~2 meter van de fundering, niet de ruimere marge die in de oorspronkelijke checklist was aangehouden.
- Sander corrigeerde de SOUDAL Fix All High Tack als bewuste, aparte aankoop voor plinten-montage — niet een vergissing zoals Hermes eerst aannam.
- Sander corrigeerde de BONFIX muurplaatkoppelingen als bewuste aanvulling voor de warm/koud waterleiding van de keuken — niet onderdeel van het rioolplan maar wel relevant voor dezelfde klus.

## Open threads

- [ ] 2× MARTENS Bocht 45° Ø110mm (art. 4105958) nog op te halen bij Hornbach Duiven — kon niet meer bij de betaalde reservering RA9049183135 gevoegd worden.
- [ ] Kalkzandsteen (waalformaat, 262 stuks) en metselmortel (2 zakken) staan nog op "in winkelwagen, nog niet besteld" — nog daadwerkelijk af te ronden.
- [ ] Riolering-items met "NIET GEVONDEN bij Hornbach" (bocht 30°/15° Ø110mm, rechte mof Ø125mm, PVC reiniger, doorvoermanchet) — navragen bij de vestiging of een sanitair-groothandel.
- [ ] Mantelbuis voor de funderingsdoorvoer — exacte diameter/lengte nog te bepalen na het boren.
- [ ] Stucwerk-materialen en tijdsinschatting — bewust uitgesteld tot overleg met de stucadoor in week 1 van de klus.
- [ ] Team Inbox-backlog nog onverwerkt: `742C9A28-...jpeg`, `Hotels Portsmouth.docx`, `dartbonden - nederland.csv`, `dartscoaching personas.md`.

## Next steps

- Volgende sessie: eventueel de resterende "niet gevonden"-rioolonderdelen navragen bij een sanitair-groothandel.
- Bij het boren van de funderingsdoorvoer: mantelbuis-maat bepalen en vastleggen.
- Team Inbox-backlog blijft open voor een volgende sessie.

## Cross-links

- `[[2026-07-14-09-58_hermes_verbouwing-materialenlijst-plafond-sheets-automation]]` — vorige sessie met de eerste materialenlijst- en Sheets-opzet.
- `[[2026-07-14-10-12_hermes_verbouwing-groepen-leidingen-overzicht]]` — elektra-groepen en leidingroutes, direct relevant voor dezelfde verbouwing.
