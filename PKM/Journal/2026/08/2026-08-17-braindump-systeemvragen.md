---
date: 2026-08-17
title: Braindump systeemvragen en ideeën
tags:
  - systeem
  - tweede-brein
  - capaciteit
  - workflow
---

# 17 augustus — Systeemvragen en braindump

Vanochtend (10:56u) een audiomemo ingesproken met een handvol vragen en ideeën over hoe het systeem werkt en hoe ik het verder wil uitbouwen.

## Idee: Dynamische abonnementslimiet tijdens vakantie

Misschien sluit ik volgende keer tijdelijk een hoger tokenlimiet-abonnement af als ik tegen de grens aanloop en nog veel werk wil doen. Bijvoorbeeld: verhogen voor de vakantieperiode, dan aan het einde van de maand weer terugschalen. Eenmalige kostenpost, maar dan kan ik doorwerken aan wat belangrijk is.

Actie: herinnering zetten dat ik dit volgende maand weer moet verlagen.

## Vraag: Transparantie van de audio→transcriptie→PKM-pijplijn

In het memo zeg ik: "Als het goed is gaat Hermes dat omvormen. Of wordt dat eerst omgezet in tekst en vervolgens gaat dat ergens heen. Alleen weet ik niet zo goed meer waar."

Het lijkt erop dat er nu een stapel launchd-agents en MCP-servers werkt — maar ik heb niet goed zicht op hoe alles met elkaar praat. Dit audiomemo zelf is getranscribeerd (handmatig, omdat de reguliere pijplijn vast liep), en nu wordt het hier verwerkt. Maar waar landen andere soorten input? Wat happen ze door? Wanneer verdwijnt iets in een queue?

**Vraag aan Hermes:** kan ik een visuele weergave krijgen van hoe alle SOPs en workflows in elkaar zitten, en welke pijplijn welk type input oppikt?

## Zorg: Mac Mini capaciteit en processprioriteit

We sturen veel dingen nu naar de Mac Mini — transcripties van videokanalen, foto-analyse, voedingsloggen, allemaal via afzonderlijke launchd-agents. Maar de Mac Mini kan niet alles tegelijk aan. Soms blijven dingen achter als er net een zware transcriptie-run gaande is.

Dit moet eigenlijk voorkomen worden. Er moet een soort prioriteitvolgorde in, zodat bepaalde processen voorgaan, en zwaardere taken als video-transcriptie alleen draaien op momenten waarop anderen er niet onder lijden.

**Vraag:** hoe voorkomen we dat processen elkaar blokkeren? En wie bepaalt de prioriteit?

## Telegram-notificatie (nog twijfelend)

Ik ben benieuwd of het handig zou zijn om een Telegram-notificatie te krijgen als bepaalde dingen verwerkt zijn — bijvoorbeeld als een audiomemo is getranscribeerd, of als voedingsitems zijn gelogd. Misschien zou dat helpen om te zien wanneer het systeem iets heeft gedaan.

Maar ik wil ook niet te veel appjes tegelijk krijgen. Ik wil mijn rust houden. Dus dit staat nog open — ik kan het laten bouwen, maar ik moet eerst goed nadenken over wanneer ik een notificatie wil krijgen en wanneer niet.

## Open vraag aan Hermes: dubbele registratie voorkomen

Dit is eigenlijk de belangrijkste vraag. Als ik vandaag twee keer zeg "ik heb mijn bodylotion aangebracht", hoe voorkomt het systeem dat dit dubbel wordt genoteerd?

Als ik bijvoorbeeld twee keer op een dag de sessie afsluit en beide keren bevestig dat ik bodylotion heb aangebracht: gaat het systeem dan een twee opnemen, of herkent het dat het dezelfde dag is en vervangt het de eerste met de tweede? Ik wil niet per ongeluk dubbel tracken.

Dit lijkt me heel belangrijk voor alle gewoontes waar je per dag maar één keer iets doet — zoals bodylotion, schimmelcrème, en andere dagelijkse rituelen.

## Voeding vandaag

Voeding is al geregistreerd (zie [[2026-08-17-voedingslogboek]]): meloen om 10:05, plus koffie en tonijnsalade die ik net uit het audiomemo heb toegevoegd.

## Tot zover

Veel vragen, maar veel ervan zijn meer technisch dan content. Hermes kan helpen dit uit te zoeken.
