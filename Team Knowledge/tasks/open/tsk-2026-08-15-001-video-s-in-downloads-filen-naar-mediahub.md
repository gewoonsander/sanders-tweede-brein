---
# Identity
id: tsk-2026-08-15-001
title: "5 video's uit Downloads filen naar de Mediahub zodra de Lexar SSD lokaal aangesloten is"

# Ownership & priority
assignee: unassigned
priority: 3

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-15T14:47:34Z
updated: 2026-08-15T14:47:34Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-15
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: [SOP-013-inboxen-verwerken]
linked_workstreams: []
linked_guidelines: [GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]
linked_my_life: []
linked_session_logs: [2026-08-16-10-35_hermes_invoerregister-mediahub-en-rclone]
linked_journal_entries: []

# Tagging
tags: [mediahub, downloads, opruiming]
---

# 5 video's uit Downloads filen naar de Mediahub zodra de Lexar SSD lokaal aangesloten is

## What this is

Tijdens een schijfruimte-crisis op de MacBook Air (96% vol, waardoor de myPKA Cockpit crashte) is de Downloads-map opgeruimd. Vijf grote video's zijn al goedgekeurd voor verplaatsing naar de Mediahub, maar de Lexar SSD stond op dat moment aangesloten op de Mac Mini thuis — een overdracht via de Tailscale-tunnel bleek te traag (~1 MB/s, uren werk). Besloten om te wachten tot Sander weer thuis is en de SSD lokaal kan aansluiten; dan gaat dit in enkele minuten in plaats van uren.

De 5 bestanden staan nog gewoon in `~/Downloads` op de MacBook Air (niet verwijderd, niet gedeeltelijk overgezet — een eerder mislukte partiële overdracht is al opgeruimd van de Mediahub-kant).

**Doelnamen (al bepaald, alleen nog uitvoeren):**

| Origineel (in Downloads) | Nieuwe naam | Doelmap |
|---|---|---|
| Sander_naar_ADC__autorit_MP4-1.mp4 | 2026-01-14_ADC_autorit-naar-adc_v01.mp4 | 03_ADC_Regio_Oost/07_Beeldbank |
| naar_adc.MP4 | 2026-01-14_ADC_onderweg-naar-adc_v01.mp4 | 03_ADC_Regio_Oost/07_Beeldbank |
| bord assignment adc.mp4 | 2026-04-04_ADC_bord-assignment_v01.mp4 | 03_ADC_Regio_Oost/07_Beeldbank |
| wandeling_in_huis_badkamers_huismanstraat.MP4 | 2026-01-14_prv_wandeling-verbouwing-badkamers-huismanstraat_v01.mp4 | 06_Persoonlijk/07_Beeldbank |
| unboxing_grondzeef.MP4 | 2026-01-14_prv_unboxing-grondzeef_v01.mp4 | 06_Persoonlijk/07_Beeldbank |

Nog niet verwerkt (nog geen voorstel voor gedaan): `escape_tairib-1.MP4` en `stef_50.mp4` — daar was nog een gerichte vraag over merk/context voor nodig, nooit beantwoord.

## Context one click away
_(geen directe SOP/workstream-koppeling — losse opruimactie)_

## Success criteria
- De 5 bestanden staan hernoemd en op hun doelmap in de Mediahub (`/Volumes/Lexar SSD/Sander Mediahub/...`)
- De originelen zijn daarna pas uit Downloads verwijderd (na bevestiging, niet automatisch)
- Logbestand geschreven in `Sander Mediahub/99_Inbox_Nog_Uitzoeken/_logs/`
- `escape_tairib-1.MP4` en `stef_50.mp4` alsnog geclassificeerd (merk/context) en meegenomen of bewust overgeslagen

## Updates
- 2026-08-15 14:47 (hermes) — created. Achtergrondoverdracht via Tailscale-tunnel gestart en weer gestopt (te traag, ~1 MB/s); onvolledig bestand op de Mediahub-kant al opgeruimd.
- 2026-08-15 (hermes) — Mediahub live via SSH geverifieerd op de Mac mini; doelstructuur en logmap bestaan. Routeringsregel canoniek verduidelijkt in [[SOP-013-inboxen-verwerken]]: deze vijf content-/registratievideo's horen in de Mediahub, niet in iCloud Foto's.
- 2026-08-16 10:50 (hermes) — status gecontroleerd na parallelle sessie [[2026-08-16-10-35_hermes_invoerregister-mediahub-en-rclone]]: **2 van 5 klaar** (`naar_adc.MP4` → `03_ADC_Regio_Oost/02_Content/2026-01-14_ADC_naar-adc_v01.MP4`, `bord assignment adc.mp4` → `03_ADC_Regio_Oost/02_Content/2026-04-04_ADC_bord-assignment_v01.mp4` — andere doelmap dan oorspronkelijk voorgesteld, `02_Content` i.p.v. `07_Beeldbank`, prima keuze). **3 van 5 veilig geland op Google Drive**, nog niet op de Mediahub: `Sander_naar_ADC__autorit_MP4-1.mp4`, `wandeling_in_huis_badkamers_huismanstraat.MP4`, `unboxing_grondzeef.MP4` — samen met `escape_tairib-1.MP4` (die overigens wél al geclassificeerd is, in `gdrive:backup film van macbook air/`). **`stef_50.mp4` staat nog ongemoeid in Downloads**, enige echt onbehandelde bestand. rclone is inmiddels ook op deze MacBook Air geïnstalleerd en gekoppeld (zie [[software-en-tools]]) — kan gebruikt worden om de 4 Drive-bestanden alsnog naar de Mediahub te krijgen, al bleek directe SSH in de meting van de andere sessie sneller.

## Outcome
_(filled when status flips to done — see SOP-close-task)_
