# council

Laat een raad van perspectiefstemmen onafhankelijk over een openstaande beslissing oordelen, en smeed hun oordelen tot één eindverdict met een verplicht minderheidsstandpunt.

## Wanneer gebruiken

- Je bent nog **niet** overtuigd — er is een echte, open "zou ik wel of niet..."-vraag
- Hoge inzet: geld, tijd, een strategische richting, iets dat moeilijk terug te draaien is
- Je wilt het probleem vanuit meerdere, expliciet verschillende invalshoeken bekeken hebben voordat je kiest

**Niet gebruiken** als bevestigingsgereedschap ("vertel me dat dit een goed idee is") — dat is precies het sycofantie-patroon dat deze skill moet tegengaan. Een peer-reviewed Stanford-onderzoek (gepubliceerd in *Science*, 2026) vond dat AI-assistenten gebruikershandelingen ~49% vaker bevestigen dan mensen zouden doen, ook bij twijfelachtig gedrag.

### Verschil met andere skills

| Skill | Voor wat |
|---|---|
| `/debate` | Je bent al overtuigd — bouwt de sterkste tegenstem |
| `/brainstorm` | Start van een development-taak — genereert ideeën, design-first |
| `/council` | Je bent nog niet overtuigd — meerdere stemmen wegen een open beslissing |

## Gebruik

```
/council <jouw openstaande vraag>
```

Natuurlijke triggers: "laat de council hierop los", "ik wil dit vanuit meerdere hoeken bekeken hebben", "meerdere perspectieven op dit besluit".

## Wat er gebeurt

1. **Hermes kiest de persona-set** op basis van het type vraag (zie hieronder).
2. **Hermes dispatcht elke persona als parallelle, ad-hoc subagent** (geen permanente specialist, sessiegebonden) met dezelfde vraag en een expliciete instructie om tegen te spreken waar relevant — geen valse consensus.
3. **Elke stem levert onafhankelijk**: positie, sterkste argument, grootste risico van de eigen positie.
4. **Hermes treedt op als voorzitter** en synthetiseert tot één eindverdict:
   - Positie
   - Vertrouwensscore
   - Kritieke risico's
   - Vervolgstappen
   - **Verplicht minderheidsstandpunt** — de sterkste tegenstem die het niet haalde, expliciet uitgeschreven. Dit is niet optioneel: onderzoek naar multi-agent debate laat zien dat één overtuigende maar foute stem het hele debat kan meeslepen: meer stemmen betekent niet automatisch meer waarheid.

## Persona-sets

Hermes kiest de set die bij de vraag past; bij twijfel vraagt hij welke.

### Persoonlijk/financieel (5) — privé-beslissingen, huishouden, eigen geld

1. **Scepticus** — zoekt zwaktes, twijfelt aan aannames
2. **Strateeg** — lange termijn: wat betekent dit over 1-5 jaar
3. **Eerste-principes-denker** — negeert conventies, redeneert vanaf de grond af
4. **Pragmaticus/Uitvoerder** — wat kost dit echt, wat kan er praktisch misgaan
5. **Mensgerichte stem** — impact op Sander, gezin, energie, waarden

### Zakelijk/strategisch (7) — klantprojecten (DartsCoaching, Dart Buddies, ADC Regio Oost, Van Gewoon Sander, Gezinshuis Gewoon Thuis)

De 5 hierboven, plus:

6. **Financiële stem** — cijfers, risico, ROI, cashflow
7. **Klant/Markt-stem** — hoe landt dit bij klanten/doelgroep, concurrentiepositie

## Regels

- Geen valse consensus — elke stem spreekt tegen waar dat eerlijk is
- Het minderheidsstandpunt is verplicht onderdeel van elk eindverdict, nooit weggelaten omdat het "toch niet won"
- Hermes duwt niet naar een vooraf gewenste uitkomst — de synthese volgt de argumenten, niet andersom
- Dit is een sessiegebonden prompttechniek, geen nieuwe permanente specialist in `Team/`
- Bron en achtergrond: [[Deliverables/2026-08-14-claude-council-research]]
