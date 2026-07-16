---
sop_id: SOP-014
title: Refresh platform-specialist knowledge
owner: Athena
status: active
triggers:
  - kwartaal-scheduled task (automatisch)
  - "check de Huddle/Plug&Pay docs opnieuw"
  - "is Martonny/Tonnymart nog actueel"
  - vermoeden dat een platform (Huddle, Plug&Pay, of een toekomstig vergelijkbaar platform) iets veranderd heeft
tags:
  - platform-specialist
  - onderhoud
  - freshness
last_updated: 2026-07-14
---

# SOP-014 — Refresh platform-specialist knowledge

**Reusable by any agent.** Default executor is Athena (zij deed de oorspronkelijke research), maar elke agent kan deze procedure aanroepen wanneer een platform-kennisdossier hersteld moet worden.

## Doel

Platform-specialisten zoals [[Team/Martonny - Huddle Platform Specialist/AGENTS|Martonny]] en [[Team/Tonnymart - Plug&Pay Platform Specialist/AGENTS|Tonnymart]] zijn zo waardevol als hun bron: een docs-grounded kennisdossier dat op een vast moment is vastgelegd. Vendor-documentatie verandert stilletjes — nieuwe features, gewijzigde tier-gates, nieuwe prijzen. Zonder onderhoud loopt een specialist onopgemerkt achter en geeft hij zelfverzekerde antwoorden op basis van verouderde feiten — precies het failure-mode dat deze rollen juist moeten voorkomen.

Deze SOP is een **lichte, herhaalbare refresh**, geen volledige her-crawl. Een volledige her-crawl (zoals bij de oorspronkelijke hire) kost ~90 tool-calls en ~7-8 minuten per platform — te zwaar om elk kwartaal blind te herhalen. In plaats daarvan: eerst goedkoop checken of er iets veranderd is, alleen diep lezen wat écht nieuw of gewijzigd is.

## Trigger

- **Automatisch, per kwartaal** — scheduled task (zie sectie "Scheduled task" hieronder).
- **On-demand** — Sander of een specialist vermoedt concreet dat er iets veranderd is (bijv. een nieuwe pricing-pagina gezien, een feature die niet meer bèta blijkt).

## Stap 1 — Lees het bestaande dossier

Open het kennisdossier voor het betreffende platform (bijv. `Deliverables/2026-07-14-huddle-specialist-hire-research.md` of `Deliverables/2026-07-14-plugandpay-specialist-hire-research.md`). Noteer:
- `last_verified` (frontmatter)
- De bron-URL (help center homepage)
- Welke secties/categorieën eerder als "niet deep-dived" of "gap" gemarkeerd stonden (§ Gaps/Not Deep-Dived) — dat zijn kandidaten om deze keer wél te checken, features veranderen daar het snelst van "niet bestaand" naar "wel bestaand"

## Stap 2 — Lichte scan

Haal de help-center categorie/artikel-index opnieuw op (niet elk artikel individueel). Vergelijk:
- Aantal artikelen per categorie tegen wat in het dossier genoteerd staat
- Artikeltitels — nieuwe titels die niet in het dossier voorkomen
- De officiële pricing-pagina expliciet opnieuw fetchen (hoogste inzet — prijzen en tier-gates zijn het meest schade-gevoelig als ze verouderd zijn)

## Stap 3 — Diep lezen, alleen wat nieuw/gewijzigd is

Voor elk artikel dat nieuw is, een titel-wijziging heeft, of hoort bij een eerder gemarkeerde gap: lees het volledig, zelfde diepgang als de oorspronkelijke research. Artikelen die ongewijzigd lijken (zelfde titel, zelfde categorie-telling) worden **niet** herlezen — vertrouw de vorige pass tenzij Stap 2 een concrete aanwijzing van verandering gaf.

## Stap 4 — Werk het dossier bij, in-place

**Geen nieuw dossierbestand per kwartaal** — dat zou de wikilinks in Martonny's en Tonnymart's AGENTS.md/shim laten verwijzen naar een verouderd bestand en de SSOT-regel schenden. Werk het bestaande bestand bij:

- Voeg bovenaan een `## Changelog`-sectie toe (of vul de bestaande aan) met een entry per refresh-pass: datum, wat gecheckt is, wat (indien iets) veranderd is.
- Verouderde feiten worden **nooit stilzwijgend overschreven** — gebruik dezelfde `> **Correctie (YYYY-MM-DD):** ...`-conventie die al elders in de wiki gebruikt wordt (zie `GL-003-brands/dartbuddies.md` als precedent), zodat de oorspronkelijke vondst zichtbaar blijft naast de correctie.
- Nieuwe features/artikelen worden toegevoegd in de juiste sectie, met dezelfde citatie-discipline als de oorspronkelijke research (bron-artikel + exact UI-pad waar mogelijk).

## Stap 5 — Frontmatter bijwerken

```yaml
last_verified: YYYY-MM-DD   # datum van deze refresh-pass
next_review: YYYY-MM-DD     # +3 maanden
review_cadence: quarterly
```

## Stap 6 — Meld substantiële wijzigingen proactief

Als er iets is veranderd dat een eerdere aanname van Sander raakt (prijswijziging, een feature die van bèta naar GA ging, een tier-gate die verschoof) — meld dit expliciet aan Hermes/Sander. Niet stilzwijgend wegschrijven in het dossier en verder gaan; dit soort wijzigingen kan eerdere beslissingen (bijv. welk Plug&Pay-plan nodig is) ongeldig maken.

## Stap 7 — Log de refresh-pass

Korte entry in de eerstvolgende sessielog: welk platform, welke datum, kernbevinding (of "geen wijzigingen gevonden"). Dit wordt onderdeel van het team-geheugen zodat een toekomstige refresh-pass ook kan zien wanneer en wat er eerder gecheckt is.

## Scheduled task

Een scheduled task draait deze procedure elk kwartaal automatisch voor zowel Martonny (Huddle) als Tonnymart (Plug&Pay). Zie de scheduled-tasks-registratie voor de exacte cron-configuratie. Bij afronding rapporteert de task kort aan Sander: welke platformen gecheckt zijn en of er iets substantieels veranderd is.

## Generiek voor toekomstige platform-specialisten

Deze SOP is niet gebonden aan Huddle/Plug&Pay specifiek — elke toekomstige "platform-specialist"-hire (via [[SOP-001-how-to-add-a-new-specialist]]) die op eenzelfde manier een docs-grounded kennisdossier krijgt, gebruikt deze SOP voor onderhoud. Voeg de nieuwe specialist toe aan de scheduled task in plaats van een aparte SOP te schrijven.

## Gerelateerd

- [[SOP-001-how-to-add-a-new-specialist]] — de procedure die het oorspronkelijke kennisdossier oplevert (SOP-001 stap 2, Athena's research-pass).
- [[Team/Martonny - Huddle Platform Specialist/AGENTS]] en [[Team/Tonnymart - Plug&Pay Platform Specialist/AGENTS]] — de specialisten die dit dossier lezen op elke invocatie.
- `Deliverables/2026-07-14-huddle-specialist-hire-research.md` en `Deliverables/2026-07-14-plugandpay-specialist-hire-research.md` — de kennisdossiers die deze SOP onderhoudt.
