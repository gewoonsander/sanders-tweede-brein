---
# Identity
id: tsk-2026-08-16-003
title: "Statusregister + Cockpit-indicator voor de wekelijkse inbox-verwerkronde per machine"

# Ownership & priority
assignee: daedalus
priority: 2

# Status (mirrors folder location)
status: open
blocked_reason: null
blocked_by: null

# Time
created: 2026-08-16T17:45:00Z
updated: 2026-08-16T17:52:00Z
due: null

# Provenance
created_by: hermes
source: hermes-session-2026-08-16
parent: null

# Cross-references — REQUIRED, even if empty array. The act of filling these is the whole point.
linked_sops: [SOP-013-inboxen-verwerken]
linked_workstreams: []
linked_guidelines: [GL-018-integratie-en-software-register, GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]
linked_my_life: []
linked_session_logs: []
linked_journal_entries: []

# Tagging
tags: [mediahub, downloads, automatisering, cockpit, dashboard, mypka-cockpit]
---

# Statusregister + Cockpit-indicator voor de wekelijkse inbox-verwerkronde per machine

## What this is

Tijdens de Downloads-opruimsessie van 2026-08-16 (MacBook Air) ontstond de wens bij Sander om overzicht te krijgen wanneer de wekelijkse `inbox-verwerken`-ronde (SOP-013) op elke machine voor het laatst succesvol heeft gedraaid — met een zichtbare status in de myPKA Cockpit (groen vinkje = recent gedraaid, per machine).

Directe aanleiding: de wekelijkse automatisering (`nl.gewoonsander.inbox-verwerken` LaunchAgent) draait nu alleen op de Mac mini. Sander overweegt 'm ook op de MacBook Air te installeren (zie sessielog van vandaag), maar realiseerde zich dat de MacBook Air niet altijd aanstaat — waardoor een vaste vrijdag-08:00-trigger kan worden gemist. Hij wil daarom kunnen zíen of/wanneer een machine de ronde daadwerkelijk heeft gedraaid, in plaats van blind te vertrouwen op de planning.

## Ontwerprichting (nog niet vastgesteld, eerste voorstel van Hermes — Daedalus mag dit bijstellen)

1. **Statusbestand, git-gesynchroniseerd, per machine.** Uitbreiden van het bestaande `Team Inbox/_wekelijkse-inboxronde-laatste-run.md`-mechanisme (dat de wekelijkse run al bijwerkt en commit, zie SOP-013 §Wanneer uitvoeren) naar een gestructureerd, machine-sleutel bestand — bijvoorbeeld `Team Inbox/_wekelijkse-inboxronde-status.json`:
   ```json
   {
     "Mac-mini-van-Sander.local": { "last_run": "2026-08-14T08:00:00+02:00", "outcome": "success", "auto_verplaatst": 47, "wacht_op_sander": 83 },
     "MacBook-Air-van-Sander-2.local": { "last_run": "2026-08-16T14:08:00+02:00", "outcome": "success", "auto_verplaatst": 606, "wacht_op_sander": 0, "note": "interactieve ronde, niet de wekelijkse automatisering" }
   }
   ```
   Bijgewerkt door zowel de onbewaakte wekelijkse run (`inbox-verwerken.mjs`) als een interactieve SOP-013-sessie (zoals vandaag), zodat het overzicht altijd klopt, ongeacht welke modus is gebruikt.
2. **Cockpit-tegel.** Nieuwe kaart/indicator in de myPKA Cockpit (owner: daedalus, zie GL-018-register) die dit JSON-bestand leest en per machine een status toont:
   - 🟢 groen: `last_run` binnen ~10-14 dagen (ruimer dan 7 dagen omdat de MacBook Air niet altijd aan staat)
   - 🟡 amber: 14-21 dagen
   - 🔴 rood: >21 dagen, of laatste `outcome` was `failed`
3. **Realistische verwachting bij de MacBook Air managen.** macOS' `launchd` haalt een gemiste `StartCalendarInterval`-trigger doorgaans in zodra de Mac weer wakker/aan is (geen garantie op exact vrijdag 08:00), dus volledig missen is zeldzaam — maar de statustegel is er juist om dat te verifiëren i.p.v. aan te nemen.

## Context one click away

- [[SOP-013-inboxen-verwerken]] — de procedure die dit statusbestand voedt
- [[GL-018-integratie-en-software-register]] — Cockpit-integratie en LaunchAgent-inventaris
- Sessielog van vandaag (2026-08-16) bevat de volledige Downloads-opruimronde die aanleiding gaf tot deze wens

## Success criteria

- Statusbestand bestaat, wordt bijgewerkt door zowel de wekelijkse automatisering als een interactieve ronde, en is git-gesynchroniseerd zichtbaar op beide machines
- Cockpit toont een duidelijke, kloppende status per machine (groen/amber/rood) die Sander in één oogopslag kan lezen
- Geen valse groene vinkjes: een mislukte of nooit gedraaide run moet zichtbaar afwijken

## Updates

- 2026-08-16 (hermes) — aangemaakt op verzoek van Sander tijdens de Downloads-opruimsessie. Nog geen implementatie gestart; dit is bewust als taak vastgelegd i.p.v. meteen te bouwen, gezien de omvang (raakt zowel `inbox-verwerken.mjs`/de LaunchAgent als de Cockpit-frontend) en omdat de sessie al vol zat met classifier-geblokkeerde automatiseringsacties.
- 2026-08-16 17:52 (hermes) — Sander koos expliciet: de installatie van de `nl.gewoonsander.inbox-verwerken` LaunchAgent op de MacBook Air (waarvoor eerder deze sessie twee installatiepogingen door de auto-mode classifier werden geblokkeerd, zie sessielog) wacht nu bewust tot dit statusregister + de Cockpit-tegel zijn uitgewerkt — dan in één keer goed installeren mét zichtbare status, i.p.v. eerst kaal installeren en het statuswerk later erbovenop te zetten. Dit is dus de reden om NIET los verder te gaan met de eerdere plist-installatie-opties.

## Outcome
_(filled when status flips to done — see SOP-close-task)_
