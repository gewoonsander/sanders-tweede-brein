# caveman

Zet Hermes tijdelijk in extreem beknopte, "caveman"-modus: minimale output-tokens, geen inleidende zinnen, geen beleefdheidsjes, geen samenvattingen — maar code, commando's, paden en foutmeldingen blijven altijd letterlijk exact.

## Wanneer gebruiken

- Lange debug/code-sessies waarin je zelf al snapt wat er gebeurt en alleen de kale actie wil zien
- Werk waarbij tokenverbruik/kosten meetellen (veel iteraties met Daedalus, Bezalel, Atlas, n8n-workflows)

Niet gebruiken voor:

- Klantcommunicatie, verslagen, journaling — daar is nuance en correcte formulering nodig
- Alles waarbij je nog aan het leren of beslissen bent — uitleg is dan juist nodig, geen telegramstijl

## Gebruik

```
/caveman aan
/caveman uit
```

## Wat er gebeurt

Zolang caveman-modus aan staat:

- Geen inleidende zinnen, geen "Ik ga nu...", geen afsluitende samenvattingen
- Geen lidwoorden/vulwoorden waar dat de betekenis niet verandert
- Code, commando's, paden en foutmeldingen altijd woordelijk exact, nooit ingekort of geparafraseerd
- Beslisblokken (GL-016) en A/B/C-keuzes (GL-013) blijven gewoon verplicht — caveman-modus verandert de zinsbouw, niet de structuur

`/caveman uit`, of een nieuwe sessie, herstelt Hermes' normale communicatiestijl.

## Bron

Gebaseerd op de community "caveman"-token-reductieskill voor Claude Code (o.a. github.com/JuliusBrussee/caveman) — hier vertaald naar een los aan/uit-commando in plaats van permanent gedrag, omdat Hermes' standaardstijl (Nederlands, klantcommunicatie, verslagen) niet samengaat met continu telegramstijl.
