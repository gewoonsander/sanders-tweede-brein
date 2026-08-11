---
id: WS-007
title: Voeding vastleggen en controleren
owners: [Hermes, Penn, Daedalus, Atlas, Bezalel]
status: active
---

# WS-007 — Voeding vastleggen en controleren

## Trigger

Een voedingsfoto, gesproken eetregistratie, tekst over wat Sander at, of de voedselcheck tijdens het sluiten van een sessie.

## Choreografie

1. **Hermes** routeert de invoer.
2. **Daedalus** levert foto/audio/tekst als betrouwbare, idempotente capture aan.
3. **Penn** verwerkt de maaltijd volgens [[SOP-017-verwerk-voedingsregistratie]] in het dagelijkse voedingslogboek.
4. **Atlas** regenereert de SQLite-mirror uit markdown.
5. **Bezalel** toont de registratie read-only in `Tracking > Meals`.
6. **Hermes + Penn** voeren bij close-session de voedselcheck uit volgens het rootprotocol.

## Bronnen en bestemming

- Bronnen: iPhone-foto, iPhone-audio, chattekst en recall tijdens close-session.
- Canoniek: `PKM/Journal/YYYY/MM/YYYY-MM-DD-voedingslogboek.md`.
- Afgeleid: `food_logs`, `food_log_days` en `v_food_day_totals` in `mypka.db`.
- UI: myPKA Cockpit `Tracking > Meals`.

Deze Workstream verwijst naar [[SOP-017-verwerk-voedingsregistratie]] en [[WS-001-daily-journaling]]; hij dupliceert hun stappen niet.
