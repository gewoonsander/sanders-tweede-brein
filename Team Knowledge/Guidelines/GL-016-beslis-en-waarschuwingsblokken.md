---
name: GL-016-beslis-en-waarschuwingsblokken
title: Beslis- en waarschuwingsblokken
type: guideline
tags:
  - interactie
  - UX
  - communicatie
owner: Hermes
created: 2026-08-10
---

# GL-016 — Beslis- en waarschuwingsblokken

Wanneer een antwoord iets bevat waar Sander een beslissing over moet nemen, iets moet goedkeuren, of zelf actie op moet ondernemen, wordt dat nooit verstopt in lopende tekst. Het krijgt een apart, visueel opvallend blok.

## Formaat

Elk open item krijgt precies dit blok:

```
─────────────────────────────────────
1 · 🔶 CLS · BESLISSING NODIG · <korte titel>
<de vraag plus je aanbeveling in 1 tot 3 regels>
─────────────────────────────────────
```

## Emoji-betekenis

- 🔶 — een beslissing of goedkeuring die Sander moet nemen.
- 🔴 — een blokkade die alleen Sander kan opheffen.
- ✅ — een afgeronde gate waar Sander op wachtte.

## Regels

- Eén blok per beslissing. Nooit twee beslissingen in één blok samenvoegen.
- Alle blokken staan aan het **einde** van het antwoord, na de normale statusprosa — nooit halverwege de tekst, zodat ze nooit verstopt raken.
- Elk 🔶- en 🔴-blok begint met een zichtbaar oplopend actienummer, gevolgd door de emoji en een herkenbare afkorting van drie letters, bijvoorbeeld `1 · 🔶 CLS`.
- Actienummers lopen door over alle procedures en contexten binnen dezelfde sessie. Na `1 · 🔶 CLS` en `2 · 🔶 CLS` wordt een actie uit een andere procedure bijvoorbeeld `3 · 🔶 GIT`.
- Ook een antwoordoptie wordt aan het actienummer gekoppeld. Bij J/N-vragen antwoordt Sander bijvoorbeeld met `1N, 2J`; bij A/B/C-keuzes met `3B`. Alleen `J`, `N`, `A`, `B` of `C` is bij meerdere open acties onvoldoende eenduidig.
- Een blok met maar één actie krijgt eveneens een nummer; het nummer wordt nooit weggelaten. Actienummers zijn uniek binnen een sessie en worden nooit hergebruikt voor een andere beslissing.
- Komt dezelfde openstaande beslissing later in de sessie terug, dan behoudt die haar oorspronkelijke actienummer en code.
- Verwijst Sander naar een actienummer, dan wordt dit eerst herleid naar de exacte beslissing waar het bij hoort, voordat er actie op volgt.

## Relatie met GL-013

Dit blok vervangt niet de A/B/C-lettering uit [[GL-013-interactie-enkelvoudige-keuzes]]. Als de beslissing uit een eindige set opties bestaat, gebruik dan het A/B/C-format ⁠— eventueel binnenin het blok, onder de vraagregel. GL-016 regelt de zichtbaarheid en het adresseerbaar maken (het blok, de code); GL-013 regelt het antwoordformaat van de keuze zelf. Ze zijn complementair, niet concurrerend.

## Wanneer deze Guideline gelezen wordt

Elke keer dat Hermes of een specialist een antwoord opstelt dat een beslissing, blokkade, of afgeronde gate voor Sander bevat. Van toepassing in elke sessie, vanaf 2026-08-10.

## Cross-references

- [[GL-013-interactie-enkelvoudige-keuzes]] — A/B/C-antwoordformaat voor keuzes met een eindige optieset.

## Updates to this Guideline

Als het format verandert, update dit bestand. Niet dupliceren naar CLAUDE.md, AGENTS.md of SOPs — zij `[[wikilinken]]` hierheen.
