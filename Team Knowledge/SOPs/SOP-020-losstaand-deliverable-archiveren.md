# SOP — Losstaand Deliverable archiveren

- **Owner:** Hermes (beoordeelt), de gebruiker (keurt goed) — zie [[WS-008-deliverables-en-projecten-audit]] voor het periodieke ritme
- **Getriggerd door:** een run van [[WS-008-deliverables-en-projecten-audit]], of ad-hoc wanneer tijdens een sessie blijkt dat een losstaand Deliverable aan een criterium hieronder voldoet
- **Output:** het Deliverable verhuist naar `Deliverables/_archive/YYYY/MM/<originele-slug>`, of blijft staan met een reden waarom niet
- **Referenties:** [[GL-004-task-resource-linking]] (definieert "losstaand"/orphan en het bestaande archief-pad voor taakgebonden Deliverables), [[GL-002-frontmatter-conventions]] (het `key_element`/`project`-schema), [[GL-010-pka-modeling-principles]] (Principe 5)

## Scope — alleen losstaande Deliverables

Een Deliverable dat door een taak is aangemaakt (`linked_deliverables` op die taak) archiveert al automatisch zodra die taak sluit, per [[GL-004-task-resource-linking]]. Deze SOP gaat **alleen** over Deliverables zonder eigenaartaak — die blijven anders voor altijd in de actieve map staan, ook als hun werk allang gedaan is.

## Waarom dit bestaat

Ontstaan op 2026-08-13 na een brainstorm met Sander: `Deliverables/` voelde als een pakhuis van losse producten zonder structuur. De naamconventie (datum-prefix) hielp bij sorteren, maar loste niet op dat niets ooit vertrok. Deze SOP is het afsluitmoment dat ontbrak — het equivalent van [[SOP-close-task]] voor Deliverables die geen taak hebben om ze te sluiten.

## De vijf archiveerbare criteria

Een losstaand Deliverable is archiveerbaar zodra het aan **minstens één** van deze vijf voldoet:

1. **Overgenomen** — de inhoud staat nu in een PKM- of Team Knowledge-notitie (een Topic, Goal, Habit, Project, SOP, Guideline of Workstream). Het Deliverable is geen bron meer, maar een verslag van hoe je daar kwam.
2. **Uitgevoerd** — het was een plan, ontwerp of onderzoek, en de uitvoering ervan (code, een gepubliceerd resultaat, een genomen besluit) is nu de levende werkelijkheid.
3. **Ingehaald** — een nieuwere versie van hetzelfde Deliverable vervangt deze.
4. **Vervallen** — het relevantievenster is gesloten: het gekoppelde event is voorbij, of het gekoppelde Project (via het `project`-veld) staat op `status: done`.
5. **Losgelaten** — Sander geeft expliciet aan dat het niet meer nodig is.

Bij twijfel welke van de vijf van toepassing is: noteer de meest specifieke, of "overgenomen + uitgevoerd" samen als dat allebei klopt. Het is geen exclusieve keuze.

## Het signaal — niet hetzelfde als archiveerbaar

**Nooit opgevolgd** is geen zesde archiveer-criterium. Een losstaand Deliverable dat ouder is dan **30 dagen** en niet onder één van de vijf criteria hierboven valt, is niet per se klaar — het is mogelijk gewoon laten liggen. Dit wordt **gemeld, nooit stilzwijgend gearchiveerd**:

- Gemeld via `/dagstart` (stap "Deliverables die aandacht nodig hebben"), zodra Sander toch al inlogt.
- Geen pushmelding — expliciete keuze van Sander op 2026-08-13 om het aantal meldingen minimaal te houden. (Telegram-infrastructuur bestaat al in n8n mocht dit ooit heroverwogen worden, zie [[n8n]].)

## Procedure

### 1. Verzamel de kandidaten

```bash
find "Deliverables" -maxdepth 1 -type f -name "*.md" -o -maxdepth 1 -type d
```

Sluit `README.md`, `_archive/`, en elk item uit dat als `linked_deliverables` op een open of in-progress taak staat (grep `Team Knowledge/tasks/open` en `Team Knowledge/tasks/in-progress` op de bestandsslug — die zijn taakgebonden, buiten scope van deze SOP).

### 2. Beoordeel elk overgebleven item tegen de vijf criteria

Individueel, niet blind. Lees de inhoud, check of de `key_element`/`project`-velden aanwezig zijn (voeg toe als ze ontbreken — retroactief invullen is prima), en bepaal of één van de vijf criteria van toepassing is.

### 3. Voor archiveerbare items — stel voor, voer pas uit na goedkeuring

Nooit automatisch verplaatsen zonder dat Sander akkoord heeft gegeven op de specifieke lijst. Zie [[WS-008-deliverables-en-projecten-audit]] voor hoe dit voorstel wordt gepresenteerd.

Na goedkeuring:

```bash
YEAR=$(date -u +%Y)
MONTH=$(date -u +%m)
mkdir -p "Deliverables/_archive/${YEAR}/${MONTH}"
git mv "Deliverables/<slug>.md" "Deliverables/_archive/${YEAR}/${MONTH}/<slug>.md"
```

Voor map-Deliverables: verplaats de hele map, niet losse bestanden erbinnen.

### 4. Voor items ouder dan 30 dagen zonder criterium — meld, verplaats niet

Voeg toe aan de `/dagstart`-melding van de eerstvolgende sessie. Verplaats niets.

### 5. Log de run

Sessielog-vermelding: hoeveel kandidaten beoordeeld, hoeveel gearchiveerd (met criterium per stuk), hoeveel gemeld als "nooit opgevolgd."

## Veelgemaakte fouten

- Een Deliverable archiveren omdat het "oud" is, zonder dat één van de vijf criteria daadwerkelijk klopt — leeftijd alleen is geen archiveer-criterium, alleen een signaal.
- Een taakgebonden Deliverable via deze SOP archiveren — dat gaat al automatisch via [[GL-004-task-resource-linking]] / [[SOP-close-task]]. Dubbel werk, en de sharing-check van die SOP wordt dan overgeslagen.
- Stilzwijgend verplaatsen zonder Sanders goedkeuring, ook al "is het toch duidelijk."
- Het `key_element`/`project`-veld overslaan bij het schrijven van een nieuw Deliverable — dat is precies het gat dat deze hele SOP dichtte.
