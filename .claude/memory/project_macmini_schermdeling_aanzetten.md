---
name: project-macmini-schermdeling-aanzetten
description: Schermdeling op Mac mini staat uit en kan alleen fysiek aangezet worden — herinner Sander zodra een sessie op de Mac mini zelf draait
metadata: 
  node_type: memory
  type: project
  originSessionId: f5be6d4b-cb2f-4a13-819e-4ff8f9bfa2ba
  modified: 2026-08-16T11:43:12.716Z
---

Schermdeling / Extern beheer op de Mac mini (100.111.17.89 via Tailscale) staat uit. Activeren via SSH/`kickstart` zet de dienst wel aan, maar macOS blokkeert de bijbehorende Schermopname/Toegankelijkheid-toestemming totdat iemand fysiek op het systeemdialoogvenster klikt — dat kan niet headless.

**Why:** Ontdekt 2026-08-16 toen Sander vanaf de camping via SSH Schermdeling probeerde aan te zetten om de Mac mini visueel te kunnen overnemen vanaf zijn MacBook Air. `kickstart -activate` liep door, maar verbinden gaf "Schermdeling is niet toegestaan" — een eenmalige fysieke bevestiging is vereist voordat het ooit op afstand werkt. Een script dat toetsenbordgebruik detecteert is bewust afgewezen: dat vereist zelf ook een fysiek toegekende TCC-permissie (Invoermonitoring) en voegt dus niets toe, met wel het nadeel van een blijvend keylogger-achtig achtergrondproces.

**How to apply:** Zodra een sessie draait met hostname `Mac-mini-van-Sander` (zie [[feedback_machine_identiteit_verifieren]]), herinner Sander proactief: "Schermdeling staat nog uit — wil je dat nu aanzetten via Systeeminstellingen > Algemeen > Delen, dan werkt vanaf nu ook schermovername op afstand (bijv. vanaf de camping)?" Na die ene fysieke bevestiging is dit blijvend opgelost en is deze memory niet meer nodig — dan verwijderen.
