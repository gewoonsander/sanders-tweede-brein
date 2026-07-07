# GL-003 Brand — DartsCoaching.nl

> **Part of the multi-brand design system.** This file is the token SSOT for **DartsCoaching.nl** only. Before reading further, confirm this is actually the brand the task is for — see [[GL-003-design-system]] §1 for the cold-start rule every agent follows. Never read this file on a hunch; the briefing must say "DartsCoaching.nl" explicitly.

> **Note — Dart Buddies inherits from this file.** Dart Buddies ([[GL-003-brands/dartbuddies]]) is a sub-brand of DartsCoaching.nl. Any change made here propagates to Dart Buddies automatically for every section it does not explicitly override. Check [[GL-003-brands/dartbuddies]] §Overrides before assuming a change here is safe to make freely.

> **Empty is honest; placeholder is dangerous.** Until you've actually chosen a value, the placeholder stays. A populated-with-defaults design system silently sets choices you never made. If a section below is still showing `<your brand X>`, the agent reads that as "not yet pinned" and either routes to Harmonia first or works in flagged fallback mode.

> **Edits are Harmonia-only.** The user proposes; Harmonia authors. Charta, Pixel, Bezalel, and Nemesis only ever read this file. The split keeps the schema coherent — multiple authors silently drift it.

---

## 1. Identity

- **Brand name:** `DartsCoaching.nl`  *(canonical capitalization — logo toont "DARTSCOACHING.NL" in blokletters, maar lopende tekst gebruikt consequent deze schrijfwijze, consistent met de rest van het systeem, o.a. [[GL-014-todoist-taakformat]])*
- **Voice/tone descriptors:** Eerlijk, Menselijk, Rustig, Gestructureerd, Gericht op groei en prestatie  *(bron: bestaande stijlgids "Visuele tone-of-voice", `01_Dartscoaching/02_Content/stijlgids dartscoaching 2026.png` op de Mediahub)*
- **Audience:** Dartsliefhebbers van elk niveau — van de onzekere nieuwkomer die haar eerste pijl nog moet gooien tot de wedstrijdgerichte speler die wil winnen — die stap voor stap beter willen worden, elk op hun eigen niveau en tempo. *(Dekt de volle persona-piramide Nina→Bob→Weszley→Willie, gedeeld met Dart Buddies — zie [[GL-003-brands/dartbuddies]].)*

**Logo:** `01_Dartscoaching/02_Content/Logo-DartsCoaching.NL-2026.png` (kleur) + witte variant in `07_Beeldbank/2026-06-12_dc_logo-2026-white_v01.pdf`, op de Lexar SSD Mediahub. Gebruiksregels: alleen op wit/lichtgrijs, min. 40mm print / 200px online, geen schaduw of verloop, ~20% witruimte rondom.

---

## 2. Color palette

*Bron: bestaande stijlgids "Kleurpalet" + "Knoppen & CTA's", `01_Dartscoaching/02_Content/stijlgids dartscoaching 2026.png` op de Mediahub.*

| Role | Token | Value | Intent |
|---|---|---|---|
| Primary | `--color-primary` | `#F22E3E` | Rood — energie, actie, motivatie. Primaire CTA's, knoppen, belangrijke titels. Hover: `#C3272B` |
| Secondary | `--color-secondary` | `#35BF0F` | Groen — balans, groei, vertrouwen. Secundaire CTA's, successen, ondersteunende elementen. Hover: `#2FA00D` |
| Accent | `--color-accent` | `#7FD971` | Lichtgroen — frisheid, progressie. Highlights, hover-effecten, infoblokken |
| Neutral 0 (lightest) | `--color-neutral-0` | `#FFFFFF` | Wit — openheid, balans, contrast |
| Neutral 1 | `--color-neutral-1` | `#F2F2F2` | Lichtgrijs — achtergrond, rust en witruimte. Voor vlakken en secties |
| Neutral 2 | `--color-neutral-2` | `<nog niet ingevuld — stijlgids definieert geen tussenliggende grijstinten>` |
| Neutral 3 | `--color-neutral-3` | `<nog niet ingevuld — idem>` |
| Neutral 4 | `--color-neutral-4` | `<nog niet ingevuld — idem>` |
| Neutral 5 (darkest) | `--color-neutral-5` | `#000000` | Zwart — hoofdtekst en belangrijke koppen |
| Status: success | `--color-success` | *(niet van toepassing — editorial/marketing-merk, geen UI-states)* | |
| Status: warning | `--color-warning` | *(niet van toepassing)* | |
| Status: error | `--color-error` | *(niet van toepassing)* | |
| Status: info | `--color-info` | *(niet van toepassing)* | |

*Let op: de bestaande stijlgids definieert bewust maar 3 neutrale waarden (wit, lichtgrijs, zwart), geen volledige 6-stappen-ramp. Neutral 2-4 blijven open totdat Sander aangeeft of tussenliggende grijstinten nodig zijn (bijv. voor een toekomstige website), of dat 3 waarden voldoende blijven.*
*Vuistregel uit de stijlgids: gebruik bij voorkeur maximaal twee accentkleuren tegelijk, gecombineerd met lichtgrijs en veel witruimte.*

---

## 3. Typography

*Bron: bestaande stijlgids "Typografie", `01_Dartscoaching/02_Content/stijlgids dartscoaching 2026.png`.*

| Role | Family | Weights | Usage |
|---|---|---|---|
| Heading | Montserrat | Bold, SemiBold | Titels, ondertitels, sectiekoppen |
| Body | Open Sans | Regular, Light, SemiBold, Bold, Italic | Platte tekst, subtitels, sectietitels, citaten, bijschriften |
| Mono | *(niet gebruikt — geen code/tabulaire data in dit merk)* | | |

**Type scale** *(uit de "Canva stijlen"-tabel in de stijlgids — punten i.p.v. px/rem, zoals gebruikt in Canva):*

| Token | Font | Size | Use |
|---|---|---|---|
| `--text-display` | Montserrat Bold | 32pt | Titel |
| `--text-h1` | Montserrat SemiBold | 22pt | Ondertitel |
| `--text-h2` | Open Sans SemiBold | 18pt | Subtitel |
| `--text-h3` | Open Sans Bold | 16pt | Sectietitel |
| `--text-body` | Open Sans Regular | 10pt | Platte tekst |
| `--text-caption` | Open Sans Light | 9pt | Bijschrift |
| `--text-quote` *(extra rol, niet in standaardtemplate)* | Open Sans Italic | 12pt | Citaat |

CTA-tekst: Montserrat Bold, hoofdletters, minimaal 14pt.

---

## 4. Spacing scale

- **Base unit:** `8px`  *(gekozen voor eenvoud — dit merk is vooral poster-/infographic-werk, geen app-UI)*

| Token | Value | Use |
|---|---|---|
| `--space-xs` | `8px` | Hairline gaps, icon-to-text spacing |
| `--space-sm` | `16px` | Button padding, dense list items |
| `--space-md` | `24px` | Card padding, paragraph spacing |
| `--space-lg` | `48px` | Section spacing within a page |
| `--space-xl` | `64px` | Section spacing on hero / landing |
| `--space-2xl` | `96px` | Page-level rhythm, between major blocks |

---

## 5. Imagery style

*Bron: bestaande stijlgids "Beeldstijl" + "Grafische elementen", `01_Dartscoaching/02_Content/stijlgids dartscoaching 2026.png`.*

- **Photography style:** candid / lifestyle
  *Notes:* Echte darters en coaches in actie, authentieke momenten (concentratie, plezier, groei), lichte natuurlijke achtergronden. Expliciet vermijden: stockfoto's en oververzadigde kleuren. Voorbeelden aanwezig in `01_Dartscoaching/07_Beeldbank/` op de Mediahub (o.a. workshopfoto's, coaching-foto's Joppe).
- **Illustration style:** mixed — geen classieke lijn/vlak-illustraties, wel een eigen decoratieve grafische taal
  *Notes:* Subtiele lijnen, pijlen en boogvormen (zie logo en kadering), afgeronde hoeken (~6px radius), achtergrondvlakken in lichtgrijs.
- **Icon style:** `<nog niet ingevuld — stijlgids beschrijft decoratieve elementen, geen vaste icoon-familie zoals Lucide/Phosphor>`
  *Family:* `<nog niet ingevuld>`

**Avatars (gedeelde basisset — gebruikt door zowel DartsCoaching.nl als Dart Buddies):** een bestaande set van 7 coach-personages plus 4 klantpersona's (Nina, Bob, Weszley, Willie), allemaal in dezelfde 3D-animatiefilmstijl (witte studio-achtergrond `#FFFFFF`, warme vriendelijke uitstraling, zachte schaduw, naam als leesbare tekst op één kledingstuk/item — geen logo's). Bronbestanden: `01_Dartscoaching/03_Video_Assets/2026-05-11_dc_sander-avatar-staand_v01.png`, de persona-beelden in `07_Beeldbank/`, en de volledige generatie-prompts in `Team Inbox/Documents/dartscoaching personas.md`. Deze basisset is dus niet exclusief voor één van de twee merken — Dart Buddies erft 'm volledig en voegt daar nog specifiek eigen extra figuren aan toe (nog te bepalen, zie [[GL-003-brands/dartbuddies]] §Overrides).

This section drives Pixel's prompt construction directly. The more concrete you are here, the more on-brand Pixel's outputs.

---

## 6. Voice samples

Three short example sentences in your intended voice. These are the canonical reference for any caption, headline, or body copy a creative agent writes.

1. "Fijn dat je de stap zet — laten we samen kijken waar jouw spel nu staat en wat de volgende stap wordt." *(eerste zin van een mail aan een klant)*
2. "Start je eerste sessie" *(knoplabel, sluit aan bij bestaande CTA-stijl "START NU")*
3. "Van eerste pijl tot persoonlijk record — coaching die met je meegroeit." *(tagline)*

---

## References

- [[GL-003-design-system]] — the multi-brand hub: cold-start rule, inheritance model, full brand registry.
- [[GL-003-brands/dartbuddies]] — the sub-brand that inherits from this file.
- [[SOP-006-author-a-design-system]] — the procedure for populating or extending this file.
- [[SOP-007-audit-content-for-design-system-compliance]] — the procedure for verifying deliverables against this file.
- [[GL-001-file-naming-conventions]] — slug, date, filename rules.
- [[Team/Harmonia - Design System Architect/AGENTS]] — Harmonia's contract; the default author of this file.
