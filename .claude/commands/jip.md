# jip

Hertaalt een technisch antwoord of rapport naar jip-en-janneketaal: eenvoudige taal voor een volwassene, zonder dat er een cijfer, pad of commando verandert.

De hertaalregels zelf staan in [[GL-023-eenvoudige-taal]] (`Team Knowledge/Guidelines/GL-023-eenvoudige-taal.md`). Lees die eerst, elke keer. Ze worden hier bewust niet herhaald.

## Wanneer gebruiken

- Een onderzoeksrapport van Athena, een technisch ontwerp van Daedalus of een audit van Argus staat vol vakwoorden en je wil weten wat er nou eigenlijk staat.
- Je moet een beslissing nemen en de onderbouwing leest te zwaar.

Niet gebruiken voor:

- Klantcommunicatie, journaal, ADC-verslagen — die hebben hun eigen toon.
- Werk waarbij je juist de exacte formulering nodig hebt (contracten, code-review, foutdiagnose).

## Gebruik

```
/jip
```

Zonder argument: hertaal het laatste antwoord of rapport uit deze sessie.

```
/jip Deliverables/2026-08-18-gemma-4-onderzoek-athena.md
```

Met bestandspad: hertaal dat rapport en schrijf de eenvoudige versie erin.

```
/jip hoe werkt een MCP-server eigenlijk
```

Met een vraag: beantwoord die vraag meteen in eenvoudige taal.

```
/jip diep <bestand of vraag>
```

Diep niveau: leg ook uit wat vanzelfsprekend lijkt, elk vakwoord krijgt een vergelijking.

```
/jip aan
/jip uit
```

Modus die aanblijft: alles wat Hermes daarna schrijft, is meteen in eenvoudige taal. Blijft aan tot je hem uitzet of een nieuwe sessie start.

## Wat er gebeurt

1. Hermes leest [[GL-023-eenvoudige-taal]].
2. Hij hertaalt volgens de acht regels daar — met als harde grens: getallen, bedragen, datums, paden, commando's en foutmeldingen blijven woordelijk exact.
3. Bij een bestand komt de eenvoudige versie **bovenaan** het rapport, onder `## In het kort (simpel)`. Het technische rapport blijft er ongewijzigd onder staan.
4. Elke hertaling eindigt met **Wat betekent dit voor jou** en **Wat kun je nu doen**.
5. Hermes draait de verplichte zelfcontrole uit GL-023 voordat hij verzendt.

Beslisblokken ([[GL-016-beslis-en-waarschuwingsblokken]]) en A/B/C-keuzes ([[GL-013-interactie-enkelvoudige-keuzes]]) blijven onverkort gelden. `/jip` verandert de zinsbouw, niet de structuur.

## Bijschaven

Klopt het niveau niet — te simpel, te moeilijk, verkeerde toon — gebruik dan `/improve-skill jip`. De aanpassing hoort in GL-023 terecht te komen, niet in dit bestand.

## Herkomst

Jip en Janneke zijn de kleuters uit de verhaaltjes van Annie M.G. Schmidt (*Het Parool*, 1952–1957). Sinds de jaren '90 staat hun naam voor begrijpelijke taal. De meetbare kenmerken en de bronnen staan in [[GL-023-eenvoudige-taal]].
