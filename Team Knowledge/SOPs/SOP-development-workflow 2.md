---
id: SOP-development-workflow
title: Development Workflow (gebaseerd op Superpowers methodologie)
owner: daedalus
applies_to: code, scripts, n8n workflows, automations, API-integraties
---

# SOP: Development Workflow

Geldt voor alle development-taken — code, scripts, n8n workflows, automations. Vier verplichte fasen in volgorde. Nooit overslaan, ook niet bij "kleine" taken.

---

## Fase 1 — Brainstorm (design-first)

**Regel: Geen implementatie zonder goedgekeurd ontwerp.**

1. Verken de context — lees bestaande bestanden, vorige sessies, AGENTS.md
2. Stel maximaal één verduidelijkende vraag per bericht (meerkeuze waar mogelijk)
3. Presenteer 2–3 aanpakken met afwegingen + aanbeveling
4. Schrijf een beknopt design-doc naar `Deliverables/YYYY-MM-DD-<onderwerp>-design.md`
5. Wacht op goedkeuring van Sander — pas dan naar fase 2

**YAGNI:** Haal alles weg wat niet strikt nodig is voor het doel.

---

## Fase 2 — Plan schrijven

**Regel: Elk plan is uitvoerbaar zonder context — een vreemde moet het kunnen volgen.**

Plan-structuur:
- Doel en constraints (wat mag niet breken)
- Bestandskaart (wat wordt aangemaakt/gewijzigd en waarom)
- Taken in stappen van 2–5 minuten, elk met exact pad, actie en verificatie
- Per taak: hoe je weet dat het werkt (commando + verwachte output)

Sla op als `Deliverables/YYYY-MM-DD-<onderwerp>-plan.md`. Wacht op goedkeuring.

---

## Fase 3 — Uitvoering

- Één taak tegelijk, in volgorde van het plan
- Na elke taak: verifieer met een concreet commando of de stap werkt
- Bij fout: **root cause eerst** — nooit raden, nooit drie fixes tegelijk proberen
- Na drie mislukte pogingen op hetzelfde probleem: stop en rapporteer aan Hermes

**Debugging-regel:** Lees de foutmelding volledig → reproduceer consistent → check recente wijzigingen → trace terug. Nooit een fix implementeren zonder bewijs van de oorzaak.

---

## Fase 4 — Verificatie voor afronding

**Regel: Nooit "klaar" zeggen zonder vers verificatiebewijs.**

Controlelijst:
- [ ] Voer het verificatie-commando uit (niet uit het hoofd — écht uitvoeren)
- [ ] Lees de volledige output en exit codes
- [ ] Bevestig dat het resultaat overeenkomt met het plan
- [ ] Rapporteer terug aan Hermes met: wat gedaan, hoe geverifieerd, wat de output was

Verboden taalgebruik: "zou moeten werken", "waarschijnlijk", "lijkt goed". Alleen feiten.

---

## Toepassingen

| Taak | Fase 1 nodig? | Plan nodig? |
|---|---|---|
| Bug fix < 10 regels | Nee | Nee — direct naar fase 3+4 |
| Nieuw script | Ja | Ja |
| n8n workflow | Ja | Ja |
| API-integratie | Ja | Ja |
| Kleine aanpassing bestaande code | Nee | Nee — direct naar fase 3+4 |
