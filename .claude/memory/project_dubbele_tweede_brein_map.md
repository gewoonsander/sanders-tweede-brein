---
name: project-dubbele-tweede-brein-map
description: "Op de Mac mini bestaan twee losse, niet-gesynchroniseerde kopieën van sanders-tweede-brein — de echte zit onder ~/Documents/sanders-tweede-brein, niet onder Documenten - Mac mini van Sander"
metadata:
  type: project
  originSessionId: adc-oost-verslag-ochtend-2026-07-07
---

Op deze Mac mini staan twee volledig gescheiden mappen met (bijna) dezelfde inhoud:

1. `~/Documents/sanders-tweede-brein` — de ECHTE, actief bijgehouden map: bevat `.git` (git-repo met commit-historie), `.obsidian` (Obsidian-vault), `.mcp.json`, `mypka.db`. Dit is de canonieke plek voor nieuw werk.
2. `~/Documents/Documenten - Mac mini van Sander/sanders-tweede-brein` — een apparaat-specifieke duplicaatmap zonder `.git`, zonder `.obsidian`, zonder `.mcp.json`. Vermoedelijk ontstaan door een iCloud Drive-sync-conflict tussen deze Mac mini en een ander apparaat (de mapnaam "Documenten - Mac mini van Sander" is het klassieke macOS/iCloud-patroon voor conflict-duplicaten).

Beide mappen hebben verschillende inodes — geen symlink/hardlink, dus wijzigingen in de ene komen NOOIT automatisch in de andere terecht.

**Concreet incident (2026-07-07):** de "Primary working directory" van deze Cowork-sessie stond bij sessiestart al ingesteld op map 2 (de verkeerde/duplicaat), niet gekozen tijdens het gesprek zelf. Daardoor is het Facebook-verslag over ADC Regio Oost Arnhem eerst in de verkeerde, niet-gesynchroniseerde map beland. Sander merkte dit op en vroeg onderzoek; na bevestiging zijn de ADC-bestanden verplaatst naar map 1, en is het hardcoded pad in de scheduled task `adc-oost-verslag-ochtend` (`~/.claude/scheduled-tasks/adc-oost-verslag-ochtend/SKILL.md`) gecorrigeerd naar map 1.

**Why:** bestanden die in map 2 belanden worden niet meegenomen in git-commits en lopen het risico kwijt te raken of niet gesynchroniseerd te worden naar andere apparaten — precies Sanders zorg.

**How to apply:** Bij elke toekomstige taak op deze Mac mini die bestanden opslaat binnen "sanders-tweede-brein" (verslagen, deliverables, scripts, etc.): controleer of het opslagpad `~/Documents/sanders-tweede-brein/...` is en NIET `~/Documents/Documenten - Mac mini van Sander/sanders-tweede-brein/...`. Als de sessie zelf met de verkeerde working directory start (dit is een Cowork/sessie-configuratiekwestie, niet iets wat ik zelf kan wijzigen binnen een gesprek), gebruik dan expliciet het absolute pad naar map 1 in plaats van relatieve paden te vertrouwen. Sander regelt zelf de onderliggende sessie-configuratie/iCloud-conflict, dus deze memory is vooral een vangnet totdat dat structureel is opgelost.
