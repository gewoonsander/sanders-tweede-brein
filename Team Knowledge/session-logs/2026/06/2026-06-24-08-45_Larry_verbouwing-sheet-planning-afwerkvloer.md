---
agent_id: larry
session_id: verbouwing-sheet-planning-afwerkvloer
timestamp: 2026-06-24T08:45:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Verbouwing Google Sheet + planning update + afwerkvloer woonkeuken

## Context

Vervolgsessie op de verbouwing Huismanstraat 34. Focus op: Google Sheet opzetten en delen met Ralf en Marieke, planningsdetails aanscherpen (regels m t/m p), en verkenning afwerkvloer woonkeuken (tapijt, dekvloer, betonlook).

## What we did

- Google Sheet (verbouwingsplanning) aangemaakt en gedeeld met Ralf (info@bouwbedrijfzwaan.nl) en Marieke (emjvoz@gmail.com) via n8n Google Drive workflow — beiden editor-rechten.
- Tabblad "planning" gevuld met chronologische planningstabel (19 rijen incl. nieuw regel a0) via n8n workflow "Verbouwing Sheet Vullen".
- Tabblad "beschikbaarheid" aangemaakt met capaciteitsoverzicht: Ralf en Marktplaatsmannetje elk 40u/week (week 30+31), Sander leeg (volgt na agenda-check).
- Planning aangescherpt op basis van gesprek:
  - Regel a0 toegevoegd: tapijt verwijderen woonkeuken (25 juni, Sander + eventueel Thomas)
  - Regel e uitgebreid: stopcontacten bepalen + afzuigkap-gat aftekenen toegevoegd
  - Regel g uitgebreid: keukenmaterialen bestellen erbij
  - Regel l uitgebreid: afzuigkap-gat boren door Ralf (diamantboor) + stroomleidingen infrezen in dekvloer voor oversteek naar binnenmuur hoge kasten
  - Regel n: spatwand achter keuken expliciet benoemd als onderdeel restpunten
  - Regel p: IKEA keuken, Marieke zoekt uit, nog geen aannemer of planning
- Nieuwe beslissingen vastgelegd in PKM:
  - Keukenpositie staat vast (exact Marktplaats-indeling, aanrechtblad/spoelbak/kookplaat al ingefreesd)
  - Afzuigkap: doorvoer buitenmuur — Ralf boort gat met diamantboor
  - Quooker: Marieke nakijken of werkend te maken vóór installatie (werkt momenteel niet) — actie Marieke
  - Stroomleidingen oversteek: infrezen in bestaande dekvloer, onderdeel leidingwerk (l)
- Afwerkvloer woonkeuken uitgebreid besproken en in PKM vastgelegd:
  - Vlonder (panlatten 25mm + schoten 20mm = 45mm) al verwijderd door Sander
  - Eronder: zand-cement dekvloer met vastgelijmd tapijt (~10mm)
  - Max opbouwhoogte t.o.v. drempel: 70mm; na tapijt weg effectief ~80mm
  - Foto gemaakt: dispersielijm (niet bitumen) — lichtgekleurde resten, viltige onderkant tapijt
  - Voorkeursoplossing: tapijt verwijderen → slijpen → betonlook coating (~3-5mm) voor industriële look
  - Vloerschuurmachine (huurbaar) is beste aanpak voor dispersielijm

## Decisions made

- **Google Sheet is de gedeelde SSOT** voor de verbouwingsplanning — Marieke, Ralf en Sander bewerken direct; Larry schrijft via n8n.
- **Larry werkt het sheet nooit bij zonder expliciete opdracht** van Sander — Larry mag wel vragen, pas schrijven na bevestiging.
- **Tapijt verwijderen als eerste verkenningsstap** (morgen 25 juni) — daarna pas definitieve keuze afwerkvloer.
- **Detailplanning op uren** wordt later opgepakt met Larry — globale planning staat, urenplanning per werkdag volgt.
- **Regel o** (wasmeubel herplaatsen) — bespreking uitgesteld naar volgende sessie.

## Insights

- n8n Google Sheets append werkt niet met `autoMapInputData` op een leeg sheet — `defineBelow` met expliciete expressies is de juiste aanpak.
- Sheet-tabblad via naam opzoeken (`mode: name`) werkt inconsistent; `mode: id, value: '0'` voor het eerste tabblad is betrouwbaarder.
- Google Drive credential refresh token kan verlopen — opnieuw authenticeren lost dit op.
- Dispersielijm is aanmerkelijk makkelijker te verwijderen dan bitumenlijm — vloerschuurmachine of schrapen + aceton volstaat.

## Open threads

- [ ] **Tapijt verwijderen** — 25 juni, Sander (+ eventueel Thomas)
- [ ] **Quooker nakijken** — Marieke, vóór keukenmontage
- [ ] **Sander's uren** invullen in beschikbaarheid-tab — na agenda-check Sander
- [ ] **Detailplanning op uren** — later oppakken met Larry
- [ ] **Afwerkvloer definitieve keuze** — na beoordeling vloer op 25 juni
- [ ] **Vloerverwarming meenemen?** — nu of nooit beslissen
- [ ] **Regel o** (wasmeubel herplaatsen) — later bespreken
- [ ] **Spatwand achter keuken** — materiaal/uitvoering nog te bepalen

## Cross-links

- `[[2026-06-23-00-13_Larry_google-contacts-koppeling-en-darts-onderzoek]]` — vorige sessie
- `[[verbouwing-huismanstraat-34]]` — PKM bijgewerkt
