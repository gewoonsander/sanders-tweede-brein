---
agent_id: hermes
session_id: koppelingendashboard-firecrawl-tegoed-contrastfix
timestamp: 2026-08-18T15:52:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-018-integratie-en-software-register"]
---

# Koppelingendashboard: kapotte registerwaarde, Firecrawl-tegoed, contrastfix

## Context

Sander opende het tabblad "Koppelingen & software" in de myPKA Cockpit en zag
geen enkele koppeling meer. Daarna vroeg hij om Firecrawl-tegoed zichtbaar te
maken op die pagina, met een groen/oranje kleursignaal.

## What we did

- Hermes vond de oorzaak van de lege pagina: `Team Knowledge/Guidelines/GL-018-integratie-en-software-register.md`
  bevatte `"cost_model": "paid-onetime"` bij `davinci-resolve-studio`, een
  waarde die niet in de validator (`server/integrationRegistry.js`) voorkomt.
  Eén ongeldig veld liet het hele register — en dus alle 24 koppelingen —
  onzichtbaar worden. Gecorrigeerd naar `"lifetime"`.
- Hermes voegde een sectie **Toegestane veldwaarden (enums)** toe aan GL-018,
  met de volledige tabel uit de validator, zodat een toekomstige registeredit
  niet opnieuw blind gokt.
- Hermes bouwde een nieuwe route `GET /api/cockpit/integrations/usage`
  (`Expansions/mypka-cockpit/server/integrationUsage.js`) die Firecrawl's
  credit- en token-tegoed ophaalt via het account-endpoint van de leverancier
  (kost zelf geen credits, sleutel blijft server-side, 5 min buffer, 8s
  timeout, fail-soft `{ ok:false, reason }`).
- Hermes bouwde de weergave in `IntegrationsView.tsx`: een tegoedblok op de
  Firecrawl-kaart met groen/oranje/rood-balk (groen tot de helft, oranje vanaf
  de helft, rood bij nul), cijfer + `aria-label` als tekstueel duplicaat van de
  kleur.
- Bij het testen viel op dat de bestaande rode statuskleur (`--status-danger`)
  niet bestond als token — de "verbroken"-kaart (Jortt) en de knop
  "Probleem oplossen" waren daardoor onopvallend crème/transparant in plaats
  van rood. Hermes verving de drie verwijzingen door de wél bestaande tokens
  (`--status-error`, `--status-error-text`).
- Dat legde een tweede probleem bloot: wit op `--status-error` (`#D64545`)
  haalt maar 4,38:1 contrast, onder de WCAG-eis van 4,5:1 voor de 17px/700
  knoptekst. Hermes routeerde dit naar **Harmonia**, die `--status-error-strong:
  #C53F3F` toevoegde (zelfde roodfamilie, uniform verdonkerd, 5,05:1 tegen
  wit) in beide thema's van `web/src/index.css`, met uitbreiding van de
  bestaande A146/A147-ruling. Hermes verwerkte het token in de knop en
  verifieerde het gemeten contrast in de draaiende app.
- Alle wijzigingen geverifieerd in de Cockpit-preview (Browser-tool) op de
  live, herstarte server (`launchctl kickstart`) na `npm run build`.
- Gedocumenteerd in `Expansions/mypka-cockpit/LOCAL-ADAPTATION.md`: de nieuwe
  usage-route onder "Security posture", de contrastfix onder een nieuwe
  sectie "Accessibility fixes for the integration dashboard".
- Gecommit (`4f8de95`, alleen de 3 relevante bestanden — index.css,
  integrations.css, LOCAL-ADAPTATION.md) en gepusht naar `origin/main`.

## Decisions made

- **Vraag:** Waar hoort de documentatie van Cockpit-specifieke tokenkeuzes
  thuis — GL-003 (merk-tokens) of LOCAL-ADAPTATION.md?
  **Beslissing (Harmonia, onderschreven door Hermes):** LOCAL-ADAPTATION.md.
  De Cockpit is geen GL-003-merk maar een lokale aanpassing van een extern
  product met een eigen tokenbestand; dit is een implementatiedetail van dat
  bestand, niet merk-identiteit.
- **Vraag:** Welk component krijgt `--status-error-strong`?
  **Beslissing:** Alleen `.intg-action--urgent` (tekst op vlak). De
  tegoedbalk-vulling (`.intg-usage--out`) draagt geen tekst en bleef op het
  gewone `--status-error`.

## Insights

- Het integratieregister (GL-018) heeft geen gedeeltelijke faalmodus: één
  ongeldig enum-veld in het JSON-blok laat de hele lijst van 24 koppelingen
  onzichtbaar worden in de Cockpit-UI. Waard om te onthouden bij toekomstige
  registeredits — en de nieuwe enum-tabel in GL-018 dekt dit nu af.
- Het designsysteem-tokenbestand van de Cockpit (`index.css`) had al een
  precedent voor "kleur X is geschikt als tekst maar niet als vlak"
  (`--status-error` vs. `--status-error-text`, ruling A146/A147) — de nieuwe
  `--status-error-strong` is een directe uitbreiding van diezelfde ruling naar
  het derde geval: vlak-met-tekst-erop.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] Diner van vandaag (2026-08-18) staat nog niet gelogd in het
      voedingslogboek (`food_log.py status` toont `missing: ["dinner"]`).

## Next steps

- Geen openstaande vervolgstappen op het koppelingendashboard-werk zelf; de
  fix, de tegoedweergave en de contrastcorrectie zijn afgerond, geverifieerd
  en gepusht.

## Cross-links

- `[[2026-08-18-14-19_hermes_whisper-lock-fix-en-dataverlies]]` — meest
  recente eerdere sessielog van vandaag vóór dit werk.
