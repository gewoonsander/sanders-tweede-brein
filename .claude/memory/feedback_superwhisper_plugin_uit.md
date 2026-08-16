---
name: feedback-superwhisper-plugin-uit
description: SuperWhisper Claude Code-plugin is permanent uitgeschakeld in ~/.claude/settings.json wegens irritante pop-ups bij elke Stop/Notification/AskUserQuestion/PermissionRequest/prompt
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fa0ae155-7c90-421a-9ffe-4fd359477ccf
  modified: 2026-08-16T09:16:08.131Z
---

De SuperWhisper Claude Code-plugin (`enabledPlugins."superwhisper@superwhisper"` in `~/.claude/settings.json`) staat op `false` — bewust uitgeschakeld op 2026-08-16, niet per ongeluk leeg of verwijderd.

**Why:** Sander vond de pop-ups die de plugin triggerde bij elke Stop/Notification/AskUserQuestion/PermissionRequest/promptindiening irritant ("elke keer weer"). De bestaande `/superwhisper off`-toggle loste dit niet structureel op: die werkt alleen per werkmap via een tijdelijk `/tmp`-bestand, verdwijnt na herstart en geldt alleen op de Mac waar de sessie op dat moment draait (zie [[feedback_machine_identiteit_verifieren]]). Sander koos expliciet voor optie A: volledig en permanent uitschakelen, boven optie B (alleen Stop/Notification behouden) en optie C (tijdelijk per map).

**How to apply:** Stel niet voor om deze plugin weer aan te zetten of de `/superwhisper`-skill te gebruiken om pop-ups te beheren, tenzij Sander er zelf naar vraagt. Zijn gewone SuperWhisper-dictatie (opname-indicator, tekst rechtstreeks in een prompt) zit in de SuperWhisper-app zelf en is dus onafhankelijk van deze plugin-status — die blijft gewoon werken. Een herstart van Claude Code is nodig voordat de wijziging actief wordt (zelfde als bij installatie, volgens de plugin-README).
