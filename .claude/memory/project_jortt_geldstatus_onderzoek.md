---
name: project-jortt-geldstatus-onderzoek
description: Onderzoeksuitkomst Jortt API voor een geldstatus/kasoverzicht in de Cockpit — welk plan nodig is en de rol van boekhouder Bart
metadata: 
  node_type: memory
  type: project
  originSessionId: 8d7ae64c-ee75-49da-8aae-e7d8b1981f56
  modified: 2026-08-09T11:52:26.710Z
---

Athena's onderzoek (2026-08-09, brief: `Deliverables/2026-08-09-jortt-api-geldstatus-onderzoek.md`) bevestigt dat Jortt's API een geldstatus-overzicht kan voeden: `/v1/reports/summaries/cash_and_bank` (expliciet bedoeld voor dashboard-weergave), plus `balance` en `profit_and_loss`, onder scope `financing:read`. Dit vereist het Jortt MKB-plan (€24,95/mnd) — bevestigd via FAQ, prijspagina én een runtime-foutcode in de bestaande connector (`organization.requires_mkb_plan`, hoge zekerheid).

Twee routes om aan API-toegang te komen: (1) Sander upgradet zelf naar MKB tegen retailprijs, of (2) boekhouder Bart — als zijn kantoor is aangesloten bij Jortt's Boekhoudersportaal — kan namens Sanders administratie upgraden tegen kantoortarief (goedkoper). Route 2 is **niet bevestigd** (medium confidence, kwam uit een zoekresultaat-samenvatting, niet de brontekst zelf) en hangt af van een antwoord van Bart.

Concrete vraag klaar voor Bart: (1) is zijn kantoor aangesloten bij het Boekhoudersportaal en kan hij Gewoon Sander (+ evt. AKP Gezinshuis) upgraden naar MKB tegen kantoortarief, (2) kan hij daarna een nieuwe API-koppeling met scope `financing:read` aanmaken en de client ID/secret doorgeven.

**Why:** Sander wil op termijn een geldstatus-overzicht in de myPKA Cockpit; dit onderzoek was de voorbereidende stap voordat hij Bart benadert.
**How to apply:** Bij vervolgstappen op dit thema — niet opnieuw uitzoeken of Jortt geldstatus-endpoints heeft, dat staat vast. Wel navragen bij Bart of hij bij het Boekhoudersportaal is aangesloten, en het JSON-schema van de endpoints alsnog verifiëren zodra er echte API-toegang is (nog niet uitgelezen wegens getrunceerde spec-fetch). Zie ook [[project_mypka_cockpit]].
