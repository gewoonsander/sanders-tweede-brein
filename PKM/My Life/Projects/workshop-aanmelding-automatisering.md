---
name: Workshop aanmelding automatisering
status: planning
key_element: work
linked_people:
  - erin-van-weijerden
  - ray-de-vries
tags:
  - automatisering
  - dartscoaching
  - plug-and-pay
  - mailblue
---

# Workshop aanmelding automatisering

## Why this matters

Workshops worden verzorgd door Erin van Weijerden en Ray de Vries (ZZP). Ticketverkoop loopt via Plug&Pay. Op dit moment worden aanmeldingen niet automatisch doorgezet naar de coaches. Erin en Ray moeten weten wie er meekomt zodat ze de workshop goed kunnen voorbereiden. Dit nu handmatig doen is foutgevoelig en tijdrovend.

## Gewenste flow

1. **Plug&Pay** — klant koopt ticket voor een workshop
2. **Mailblue** (ActiveCampaign NL) — Plug&Pay triggert een koppeling naar Mailblue bij nieuwe aankoop
3. **Excel / Google Sheets** — Mailblue vult automatisch een deelnemerslijst per workshop
4. **Erin & Ray** — hebben toegang tot de sheet en zien realtime wie zich heeft aangemeld

## Status update

2026-06-12 — Idee vastgelegd. Nog niet in uitvoering. Plug&Pay Lite-abonnement actief. Mailblue-koppeling nog niet opgezet.

## Open threads

- Heeft Plug&Pay Lite een native Mailblue-integratie, of is Zapier/Make nodig?
- Welke velden moeten in de deelnemerslijst? (Naam, e-mail, workshop-datum, locatie, betaalstatus?)
- Aparte sheet per workshop of één sheet met filter op datum/locatie?
- Wil Erin een Excel-bestand of liever een gedeelde Google Sheet?
- Linkjes workshoppagina's op Plug&Pay aanleveren voor koppeling

## Next steps

- [x] Plug&Pay linkjes per workshop aanleveren (Sander) — ontvangen 2026-06-12
- [ ] Uitzoeken of Plug&Pay native Mailblue-koppeling heeft (Mack)
- [ ] Velden deelnemerslijst afstemmen met Erin
- [ ] ⚠️ Plug&Pay pagina Katwijk controleren: title toont "Hengelo" en description noemt "Padel Station Harderwijk" — vermoedelijk copy-paste fout

## Plug&Pay workshop links

| Workshop | Datum | Tijd | Prijs | Max. plekken | Plug&Pay link |
|---|---|---|---|---|---|
| Almere – Bij Moontje | 24 juni 2026 | — | — | — | https://shop.dartscoaching.nl/checkout/workshop-darts-almere-bij-moontje |
| Arnhem – Dubbel 10 | 11 juli 2026 | — | — | — | https://shop.dartscoaching.nl/checkout/workshop-darts-arnhem-dubbel-10 |
| Katwijk – Katwijkse Dartvereniging | 23 augustus 2026 | — | — | — | https://shop.dartscoaching.nl/checkout/workshop-de-katwijkse-dartvereniging |
| Harderwijk – Padel Station | 11 september 2026 | 20:00–23:00 | €55 incl. btw | 12 | https://shop.dartscoaching.nl/checkout/workshop-harderwijk-padel-station |

## ⚠️ Copy-paste fouten in Plug&Pay pagina's

Gevonden bij ophalen van de pagina-metadata op 2026-06-12. Controleren en corrigeren in Plug&Pay:

- **Katwijk-pagina**: title toont "Hengelo", description noemt locatie "Padel Station Harderwijk" — klopt niet voor Katwijk.
- **Harderwijk-pagina**: title toont "Hengelo", og:description noemt "Het Twentse Ros in Hengelo" — zou Harderwijk moeten zijn.
