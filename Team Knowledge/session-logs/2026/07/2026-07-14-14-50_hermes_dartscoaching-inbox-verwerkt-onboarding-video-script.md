---
agent_id: hermes
session_id: dartscoaching-inbox-verwerkt-onboarding-video-script
timestamp: 2026-07-14T12:50:00Z
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken"]
linked_workstreams: []
linked_guidelines: []
---

# Team Inbox verwerkt (Dartscoaching-map) + onboarding-videoscript kritisch aangescherpt

## Context

Vervolg op de eerdere sessie over Martonny/Tonnymart en het Dart Buddies onboarding-videoproject ([[2026-07-14-11-23_hermes_martonny-tonnymart-platform-specialist-hires]]). Sander wilde het draaiboek voor de onboarding-video kritisch en gedetailleerd doornemen, en sleepte tijdens dat gesprek een map met Dartscoaching-bestanden ("Bob de Bouwer" persona-assets erbij) in de Team Inbox.

## What we did

- **Live browser-verificatie:** Hermes keek mee in Sander's echte, ingelogde Huddle-omgeving (Claude in Chrome, met Sander's toestemming) en las de exacte profielpagina uit: veldvolgorde (profielfoto → voor-/achternaam → koptekst → over mij → socials → Privacy Openbaar/Privé → Opslaan) en de exacte navigatiepaden voor de community-onderdelen (Dartbuddies en The victory wall staan onder "Communityplein", 180 in je Mindset staat apart onder "Boeken", Tips & Tools staat niet in het linkermenu maar onder "E-Learning" als cursuskaart).
- **Draaiboek herschreven** ([[dart-buddies-onboarding-video]], project in PKM/My Life/Projects/): elke generieke "iemand" vervangen door "demobob", exacte URL toegevoegd (`https://dartbuddies.dartscoaching.nl/`), scène 5-8 (profiel) en scène 10-13 (community) herschreven met de zojuist geverifieerde exacte UI-details. Scenario B (aankoop → gratis Free buddie) expliciet gemarkeerd als "niet filmen totdat bevestigd" — die Plug&Pay-koppeling is nog niet geverifieerd.
- **SOP-013 (Inboxen verwerken) uitgevoerd** op de "Dartscoaching"-map die Sander in de Team Inbox sleepte:
  - 8 persona-bestanden (Bob, Nina, Weszley, Willie — elk raw + achtergrond-verwijderd) bleken al ongeorganiseerd in `01_Dartscoaching/02_Content/` te staan (byte-identiek aan wat Sander opnieuw aanleverde) — die bestaande bestanden zijn nu pas goed hernoemd en verplaatst naar `07_Beeldbank/`, volgens het Mediahub-naamformat (`2026-07-14_DC_persona-<naam>-raw/nobg_v01.png`).
  - Nieuw bestand `doelgroepenkaart Nina.png` verplaatst en hernoemd.
  - 17 coach-foto's (Erin, Gerard, Joppe, Mikel, Ray, Rik, Sander + teamfoto + logo) verplaatst en hernoemd naar `07_Beeldbank/`.
  - `logogeklooi moet verder mee.png` — expliciet als werkversie herkend aan de bestandsnaam — apart naar `99_Inbox_Nog_Uitzoeken` verplaatst in plaats van stilzwijgend als afgerond asset gearchiveerd.
  - De 8 duplicaat-bestanden in de Team Inbox zijn **niet** automatisch verwijderd door Hermes — de Stop-hook/permissiesysteem blokkeerde dat correct omdat Sander ze nooit expliciet had aangewezen voor verwijdering. Na Sanders expliciete bevestiging ("a") alsnog verwijderd.
  - Team Inbox/Dartscoaching-map is nu volledig leeg en verwijderd.
- **Bob-persona-foto** (`2026-07-14_DC_persona-bob-nobg_v01.png`) aangewezen als demobob's profielfoto voor de video — vervangt het eerdere, minder passende voorstel om een robot-mascotte te gebruiken.
- **Demo-profieltekst gedefinieerd**: koptekst "Gezelligheidsdarter met ambities" + een "over mij"-tekst in Bob-persona-toon, klaar om live te typen tijdens opname.

## Decisions made

- **Vraag:** Zijn de net aangeleverde persona-bestanden nieuw, of duplicaten?
  **Besluit:** Byte-voor-byte vergeleken — duplicaten van wat al (ongeorganiseerd) in de Mediahub stond. Bestaande bestanden verwerkt, duplicaten in Team Inbox pas verwijderd na expliciete bevestiging van Sander.
- **Vraag:** Welke foto gebruiken we als demobob's profielfoto?
  **Besluit:** De echte Bob-persona-illustratie (niet een Dart Buddies-robotmascotte) — inhoudelijk en merktechnisch een betere match, en nu toevallig al beschikbaar dankzij de inbox-opruiming.

## Insights

- Een bestandsnaam die zelf al "moet verder mee" / "nog niet af" zegt, is een signaal om níet automatisch als afgerond asset te archiveren — dat onderscheid (WIP vs. klaar) verdient een aparte bestemming (`99_Inbox_Nog_Uitzoeken`) in plaats van blind door te schuiven naar de Beeldbank.
- Live meekijken in een geauthenticeerde sessie (met expliciete toestemming van Sander) leverde meerdere concrete correcties op t.o.v. het oorspronkelijke, met ChatGPT geschreven playbook — met name de aanname dat community-onderdelen allemaal in hetzelfde menu staan, klopte niet (180 in je Mindset zit in een ander blok dan Dartbuddies/Victory wall).

## Realignments

- _(geen — dit was uitvoering van een expliciet verzoek, geen koerscorrectie)_

## Open threads

- [ ] Scenario B (aankoop → gratis Free buddie) nog te bevestigen bij Tonnymart voordat dat deel van het script gefilmd wordt
- [ ] Sander voert de definitieve welkomstmail-tekst live door in Huddle
- [ ] Opnamesessie zelf nog niet gepland

## Next steps

- Scène-voor-scène doorname afronden met Sander (was in gang toen de inbox-verwerking tussendoor kwam)
- Daarna: opname inplannen

## Cross-links

- [[2026-07-14-11-23_hermes_martonny-tonnymart-platform-specialist-hires]] — vorige sessie in dezelfde reeks
- [[dart-buddies-onboarding-video]] — het projectbestand dat deze sessie bijwerkte
