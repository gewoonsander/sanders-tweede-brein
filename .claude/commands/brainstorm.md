# brainstorm

Start een development-taak volgens SOP-development-workflow — design-first, geen implementatie zonder goedgekeurd ontwerp.

## Wanneer gebruiken

Gebruik `/brainstorm` bij het begin van elke nieuwe development-taak: nieuw script, n8n workflow, API-integratie, automation, of feature.

Niet nodig voor kleine bug fixes of aanpassingen < 10 regels.

## Wat er gebeurt

Hermes delegeert aan Daedalus, die:

1. De bestaande context verkent (relevante bestanden, vorige sessies)
2. Maximaal één verduidelijkende vraag stelt (meerkeuze)
3. 2–3 aanpakken presenteert met afwegingen + aanbeveling
4. Een design-doc schrijft naar `Deliverables/YYYY-MM-DD-<onderwerp>-design.md`
5. Wacht op jouw goedkeuring voor implementatie begint

## Gebruik

```
/brainstorm <wat je wil bouwen>
```

Voorbeeld: `/brainstorm n8n workflow die nieuwe Google Drive bestanden automatisch verwerkt`
