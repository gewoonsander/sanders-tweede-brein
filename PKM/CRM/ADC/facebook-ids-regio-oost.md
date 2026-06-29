---
title: Facebook ID lookup — ADC Regio Oost spelers
last_updated: 2026-06-28
doel: Wordt gebruikt door n8n workflow om spelers automatisch te taggen in Facebook-groep berichten
---

# Facebook ID lookup — ADC Regio Oost

Spelers die vriend zijn van Sander op Facebook. Gebruikt voor automatisch taggen bij toernooiverslagen.

| Naam (Dart Atlas) | Facebook identifier | Type | Vriendstatus |
|---|---|---|---|
| Ricardo Ulrich | `100094174630821` | numeric ID | ✅ Vriend (als "Rico Ulrich") |
| Marc Vleghert | `marc.vleghert.5` | username | ✅ Vriend |
| Rick Heijdemann | `100009414307453` | numeric ID | ✅ Vriend |
| Mark Schlaghecke | `mark.schlaghecke` | username | ✅ Vriend |
| Rick Hiddink | `rick.hiddink` | username | ✅ Vriend |
| John Lutgens | `john.lutgens.735` | username | ✅ Vriend |
| Mark Van Ovost | `mvanovost` | username | ✅ Vriend |
| Kevin Rooks | `kevin.tatoo.399` | username | ✅ Vriend |
| Jeffrey Mansveld | `jmansveld` | username | ✅ Vriend |
| Henrico Eilander | — | — | ⏳ Verzoek in behandeling |
| Lo Wolswijk | — | — | ❌ Niet gevonden |
| John Wolsheumer | — | — | ❌ Niet gevonden |
| Sjors Kathmann | — | — | ❌ Niet gevonden |
| Jesper Kistemaker | — | — | ❌ Niet gevonden |

## Gebruik in n8n

De workflow zoekt per spelersnaam in dit bestand op of er een Facebook identifier beschikbaar is.
- Bij een `username` → tag als `@[username]`
- Bij een numeric ID → tag via Graph API met `profile.php?id=[ID]`
- Bij geen match → spelersnaam als platte tekst in het bericht
