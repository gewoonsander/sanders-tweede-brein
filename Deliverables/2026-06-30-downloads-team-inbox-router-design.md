---
date: 2026-06-30
author: Daedalus
status: approved
topic: Automatische Downloads → Team Inbox router
---

# Design: Downloads → Team Inbox router

## Doel

Schermafbeeldingen en documenten die in Downloads terechtkomen worden automatisch naar Team Inbox gerouteerd, zodat Hermes ze bij de volgende sessie gegarandeerd oppakt. Installers en grote bestanden blijven buiten de inbox.

## Componenten

### 1. Watcher (Mac mini — primair)

Een launchd LaunchAgent die `~/Downloads` bewaakt via FSEvents.

**Routing-regels:**

| Bestandstype | Patroon | Bestemming |
|---|---|---|
| Screenshots | `Schermafbeelding*.png`, `Screenshot*.png` | `Team Inbox/Screenshots/` |
| Documenten | `.pdf`, `.docx`, `.doc`, `.xlsx`, `.xls`, `.pptx`, `.md`, `.txt` | `Team Inbox/Documents/` |
| Overig | `.dmg`, `.pkg`, `.zip`, `.app`, etc. | Blijft in Downloads |

Script: `Expansions/downloads-router/route_downloads.sh`
LaunchAgent plist: `~/Library/LaunchAgents/nl.gewoonsander.downloads-router.plist`

### 2. Close-session stap (alle apparaten — vangnet)

Uitbreiding van het close-session protocol in AGENTS.md:
- Hermes scant Downloads voor resterende bestanden
- Toont lijst, vraagt wat ermee moet
- Prullenbak leegmaken als finale stap (na bevestiging)

### 3. SessionStart hook uitbreiding

De bestaande hook (audio-check) uitbreiden: ook screenshots en documenten in Team Inbox melden bij sessiestart.

### 4. Installatie MacBook Air (optioneel)

Zelfde LaunchAgent + script, apart te installeren. Werkt identiek. Als MacBook Air uit staat of slaapt → close-session vangnet vangt het op.

## Bestandsstructuur

```
Expansions/downloads-router/
├── route_downloads.sh         ← routing-script
└── nl.gewoonsander.downloads-router.plist  ← LaunchAgent template

Team Inbox/
├── Screenshots/               ← nieuw (automatisch aangemaakt)
├── Documents/                 ← nieuw (automatisch aangemaakt)
└── Audio Captures/            ← bestaand
```

## Wat er NIET automatisch wordt verplaatst

- `.dmg`, `.pkg`, `.zip`, `.app` — installers
- Bestanden groter dan 50 MB
- Mappen

## Implementatievolgorde

1. `route_downloads.sh` schrijven en testen
2. LaunchAgent plist aanmaken en laden
3. SessionStart hook uitbreiden
4. AGENTS.md close-session protocol bijwerken
5. (Optioneel later) installatie op MacBook Air
