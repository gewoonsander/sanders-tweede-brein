---
key_element: groei
---

# Koppelingen & software — consolidatieontwerp

## Status

Goedgekeurd door Sander op 2026-08-12 (keuze A).

## Doel

De drie zichtbare Cockpit-ingangen `Koppelingen`, `Software-stack` en `Koppelingen & software` worden één gebruikersingang: **Koppelingen & software**. De bestaande kaartweergave blijft de visuele basis. Sander kan vanuit dezelfde pagina software inventariseren, API/MCP-status zien, een aansluiting starten en een storing gericht oplossen.

## Gekozen aanpak

Eén route en één navigatie-item met drie informatielagen:

1. **Overzicht** — status, type, doel, apparaat, laatste controle en concrete eerstvolgende actie per softwaredienst.
2. **Koppelen en herstellen** — hergebruik van het bestaande veilige sleutel- en connectorbeheer; geen tweede schrijfpad naar `.env`.
3. **Technische details** — read-only sleutelnamen en MCP-registraties, standaard ingeklapt.

Oude deeplinks naar `#/connections` en `#/stack` blijven werken door ze naar `#/integrations` te routeren.

## Actiemodel

- `working` → **Details bekijken**
- `not_checked` → **Nu controleren**
- `planned` → **Koppelen**
- `action_needed` → **Aansluiting voltooien**
- `broken` → **Probleem oplossen**
- `paused` / `retired` → **Details bekijken**

Read-only controles mogen direct draaien. Configuratiewijzigingen tonen eerst de benodigde stap en vragen bevestiging voordat er wordt geschreven. Assistentnamen worden niet in knoplabels of uitleg getoond; de ingestelde lokale AI-runtime is een uitvoeringsdetail.

## Responsive gedrag

- Desktop: kaartenraster en compacte bediening.
- Tablet: twee kaarten waar ruimte dit toelaat; acties blijven minimaal 44 px hoog.
- Mobiel: één kolom, filters stapelen en primaire knoppen vullen de beschikbare breedte.
- Koppelen en technische details staan onder uitklapbare secties om de hoofdpagina rustig te houden.

## Acceptatiecriteria

1. De zijbalk toont slechts één ingang voor dit domein.
2. Oude routes verliezen geen bereikbare functionaliteit.
3. Iedere integratiekaart heeft een statusafhankelijke actieknop.
4. De tekst `Laat Claude dit aansluiten` en vergelijkbare assistentgebonden interfacecopy is verwijderd.
5. Sleutels en MCP-serverregistraties blijven secretvrij en functioneel beschikbaar.
6. Frontendbuild en relevante tests slagen.
7. Nemesis controleert 375, 768 en 1280 px, toetsenbordbediening en toegankelijke namen.

## Gerelateerde bronnen

- [[GL-018-integratie-en-software-register]]
- [[2026-08-11-integratiecontrole-cockpit-design]]
- [[2026-08-11-integratiecontrole-cockpit-plan]]
