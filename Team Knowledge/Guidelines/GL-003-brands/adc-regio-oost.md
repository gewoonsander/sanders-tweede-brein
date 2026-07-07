# GL-003 Brand — ADC Regio Oost

> **Part of the multi-brand design system.** This file is the token SSOT for **ADC Regio Oost** only. Before reading further, confirm this is actually the brand the task is for — see [[GL-003-design-system]] §1 for the cold-start rule every agent follows. Never read this file on a hunch; the briefing must say "ADC Regio Oost" explicitly.

> **Empty is honest; placeholder is dangerous.** Until you've actually chosen a value, the placeholder stays. A populated-with-defaults design system silently sets choices you never made. If a section below is still showing `<your brand X>`, the agent reads that as "not yet pinned" and either routes to Harmonia first or works in flagged fallback mode.

> **Edits are Harmonia-only.** The user proposes; Harmonia authors. Charta, Pixel, Bezalel, and Nemesis only ever read this file. The split keeps the schema coherent — multiple authors silently drift it.

---

## 1. Identity

- **Brand name:** `ADC Regio Oost`  *(regionale afdeling van ADC Benelux, op zijn beurt onderdeel van ADC Europe — geen zelfstandig merk, geen eigen logo; gebruikt het officiële ADC Europe-logo)*
- **Voice/tone descriptors:** `<nog niet vastgelegd — niet nodig gebleken voor de eerste deliverables (data-/schema-posters); alsnog invullen zodra er voice-afhankelijke content nodig is>`
- **Audience:** `<nog niet vastgelegd>`

---

## 2. Color palette

*Bron: bestaand spiekbrief-template van Sander (`03_ADC_Regio_Oost/05_Templates/...poule-indeling...png` op de Mediahub) en het officiële ADC Europe-logo. **De oranje hex is een benadering, niet geverifieerd tegen een officieel merkboek** — pas aan zodra Sander de exacte waarde heeft (pipet of ADC Europe-merkboek).*

| Role | Token | Value | Intent |
|---|---|---|---|
| Primary | `--color-primary` | `#F26522` *(benadering, niet bevestigd)* | Oranje — ADC Europe-huisstijlkleur, accentlijnen, cijfer-badges, tabelkoppen |
| Secondary | `--color-secondary` | `<niet nodig gebleken — dit merk werkt met zwart/wit/oranje, geen secundaire kleur>` | |
| Accent | `--color-accent` | `<zelfde als Primary — geen apart accent boven op het oranje>` | |
| Neutral 0 (lightest) | `--color-neutral-0` | `#FFFFFF` | Wit — tekst en logo op de zwarte achtergrond |
| Neutral 1 | `--color-neutral-1` | `<nog niet ingevuld>` | |
| Neutral 2 | `--color-neutral-2` | `<nog niet ingevuld>` | |
| Neutral 3 | `--color-neutral-3` | `<nog niet ingevuld>` | |
| Neutral 4 | `--color-neutral-4` | `<nog niet ingevuld>` | |
| Neutral 5 (darkest) | `--color-neutral-5` | `#000000` | Zwart — de standaard achtergrondkleur van dit merk (niet wit zoals DartsCoaching.nl) |
| Status: success | `--color-success` | *(niet van toepassing)* | |
| Status: warning | `--color-warning` | *(niet van toepassing)* | |
| Status: error | `--color-error` | *(niet van toepassing)* | |
| Status: info | `--color-info` | *(niet van toepassing)* | |

---

## 3. Typography

*Exacte fontnamen niet bevestigd — de stijlgids toont een zware/bold grotesk-stijl voor titels. Gebruik voorlopig een systeemvergelijkbare zware sans-serif (bijv. Archivo Black / Anton) totdat Sander het exacte font bevestigt.*

| Role | Family | Weights | Usage |
|---|---|---|---|
| Heading | `<niet bevestigd — zware/bold grotesk-stijl, vergelijkbaar met Archivo Black of Anton>` | Bold/Black | Titels, sectiekoppen, cijfer-labels |
| Body | `<niet bevestigd — neutrale sans-serif>` | Regular/Medium | Tabeltekst, data, bijschriften |
| Mono | `<niet gebruikt>` | | |

**Type scale** *(optional but recommended; pick one and lock):*

| Token | Size | Line-height | Use |
|---|---|---|---|
| `--text-display` | `<px or rem>` | `<value>` | Hero / display titles |
| `--text-h1` | `<px or rem>` | `<value>` | Page titles |
| `--text-h2` | `<px or rem>` | `<value>` | Section heads |
| `--text-h3` | `<px or rem>` | `<value>` | Subsection heads |
| `--text-body` | `<px or rem>` | `<value>` | Paragraph copy |
| `--text-caption` | `<px or rem>` | `<value>` | Captions, labels, fine print |

---

## 4. Spacing scale

- **Base unit:** `8px`  *(consistent met DartsCoaching.nl — poster-/infographic-werk, geen app-UI)*

| Token | Value | Use |
|---|---|---|
| `--space-xs` | `<base × 1>` | Hairline gaps, icon-to-text spacing |
| `--space-sm` | `<base × 2>` | Button padding, dense list items |
| `--space-md` | `<base × 3 or × 4>` | Card padding, paragraph spacing |
| `--space-lg` | `<base × 6>` | Section spacing within a page |
| `--space-xl` | `<base × 8>` | Section spacing on hero / landing |
| `--space-2xl` | `<base × 12>` | Page-level rhythm, between major blocks |

---

## 5. Imagery style

- **Photography style:** `<geen fotografie in gebruik tot nu toe — dit merk werkt met data/schema-gedreven posters, geen beeldmateriaal>`
- **Illustration style:** dramatisch/cinematisch (referentie: officiële "Winmau Benelux Open 2026"-poster — stadion/spotlight-achtergrond, schild/badge-vorm, dik 3D-verlooplettertype) voor hero-aankondigingen; strak/functioneel zwart-wit-oranje (referentie: bestaande spiekbrief-templates) voor data-/schema-posters. Beide stijlen leven naast elkaar afhankelijk van het deliverable-type.
- **Icon style:** `<nog niet vastgelegd>`

**Logo:** geen eigen Regio Oost-logo — gebruikt het officiële ADC Europe-logo (wit beeldmerk met oranje dart-flight-accent, "AMATEUR DARTS CIRCUIT EUROPE"). Te vinden ingesloten in bestaande templates op de Mediahub (`03_ADC_Regio_Oost/05_Templates/`); geen losstaand logobestand bekend.

**Kroeglogo's (Pub Qualifier-locaties):** vier partnerkroegen hebben elk hun eigen logo, gearchiveerd in `03_ADC_Regio_Oost/07_Beeldbank/Kroeglogos/` — Het Twentse Ros (wit + zwart variant), Café Kafé, De Rijnvogels, Dartcafe Dubbel 10. Deze logo's zijn niet in de ADC-huisstijl (oranje/zwart) maar behouden hun eigen kroegidentiteit; ze worden als los beeldelement op ADC-materiaal geplaatst, niet herontworpen.

This section drives Pixel's prompt construction directly. The more concrete you are here, the more on-brand Pixel's outputs.

---

## 6. Voice samples

Three short example sentences in your intended voice. These are the canonical reference for any caption, headline, or body copy a creative agent writes.

1. `<your first voice sample sentence>`
2. `<your second voice sample sentence>`
3. `<your third voice sample sentence>`

*If you're stuck: write the first sentence of an email to your ideal customer. Then write a button label. Then write a one-line product tagline.*

---

## References

- [[GL-003-design-system]] — the multi-brand hub: cold-start rule, inheritance model, full brand registry.
- [[SOP-006-author-a-design-system]] — the procedure for populating or extending this file.
- [[SOP-007-audit-content-for-design-system-compliance]] — the procedure for verifying deliverables against this file.
- [[GL-001-file-naming-conventions]] — slug, date, filename rules.
- [[Team/Harmonia - Design System Architect/AGENTS]] — Harmonia's contract; the default author of this file.
