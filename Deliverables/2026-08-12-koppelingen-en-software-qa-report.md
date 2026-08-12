# QA-rapport — Koppelingen & software

## Verdict

**PASS** — geen Critical- of High-bevindingen.

## Scope en bewijs

Nemesis inspecteerde de live productiebuild op `#/integrations` in de ingebouwde browser op 2026-08-12. Per viewport is visueel screenshotbewijs vastgelegd tijdens de inspectie en zijn DOM-layoutmetingen uitgevoerd.

| Viewport | Resultaat | Bewijs |
|---|---|---|
| 375 × 812 | PASS | Geen horizontale overflow (`scrollWidth: 375`); één kaartkolom; filters vullen de breedte; actieknoppen 46,6 px hoog. |
| 768 × 1024 | PASS | Geen horizontale overflow (`scrollWidth: 768`); twee kaartkolommen van circa 345 px; actieknoppen 46,6–53,2 px hoog. |
| 1280 × 900 | PASS | Geen horizontale overflow (`scrollWidth: 1280`); drie kaartkolommen van circa 296 px; precies één navigatie-ingang voor Connections/Koppelingen/Software. |

## Functionele controle

- De productiebuild toont uitsluitend **Koppelingen & software** in de zijbalk.
- Status, type, software, API- en MCP-informatie zijn aanwezig.
- `Probleem oplossen` opent **Software koppelen of herstellen**.
- Na openen verhuist de toetsenbordfocus naar de samenvatting van die sectie.
- De assistentgebonden tekst `Laat Claude dit aansluiten` komt niet meer in de pagina voor.
- De live pagina rapporteerde geen console errors of warnings.

## Accessibility

- Semantische koppen, artikelen, termen/definities, comboboxlabels, knoppen en `details`/`summary` zijn aanwezig.
- Kleur is niet de enige statusdrager; iedere status heeft tekst en een pictogram.
- Primaire acties voldoen aan de minimale aanraakhoogte van 44 px.
- Focus wordt na een actie naar de geopende doelsectie verplaatst.
- `prefers-reduced-motion` schakelt de draaiende animatie uit.

## Lage aandachtspunten

- De samenvatting bevat op mobiel nog acht tegels. Dit is functioneel en breekt niet, maar kan later compacter wanneer meer rust gewenst is.
- De volledige bundel bevat meerdere grote bestaande chunks; dit valt buiten deze wijziging maar verklaart de relatief lange productiebouw.

## Hercontrole

Geen reparatieronde nodig. De eerste inspectie voldeed aan de gate.

## Gerelateerde bestanden

- [[2026-08-12-koppelingen-en-software-consolidatie-design]]
- [[GL-003-design-system]]
- [[GL-018-integratie-en-software-register]]
