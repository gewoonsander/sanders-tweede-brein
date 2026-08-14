---
name: GL-014-todoist-taakformat
title: Todoist — taakformat, prioriteit, assignee en bronmateriaal
type: guideline
tags:
  - todoist
  - workflow
  - mail
owner: Hermes
created: 2026-07-01
---

# GL-014 — Todoist: taakformat, prioriteit, assignee en bronmateriaal

> **Elke agent die een Todoist-projectie aanmaakt of bijwerkt leest dit.** De canonieke persoonlijke taak staat altijd eerst in myPKA; zie [[GL-012-pkm-vs-todoist]].

## Aanleiding

Todoist-taken werden inconsistent aangemaakt: sommige met prioriteit dubbel (native veld + tekst-prefix zoals `p3 |`), sommige zonder tijdsinschatting, sommige zonder link naar de bron, en veel landden in de kale `Inbox` in plaats van het juiste project. Root cause van de dubbele prioriteit: de ruwe Todoist API gebruikt geïnverteerde cijfers (intern `4` = zichtbaar "P1", intern `1` = "P4" — zie `Expansions/mypka-cockpit/server/connectors/todoistTasks.js:31`). Toen taken via een ruwe API-aanroep werden gezet, bestond onzekerheid of de omzetting klopte, dus werd de prioriteit ook als leesbare tekst in de titel gezet als vangnet. De huidige Todoist MCP-connector normaliseert dit al correct — het vangnet is overbodig.

Sander werkte vroeger met een "actie-archief": een fysieke map met bronmateriaal per taak. Klaar? Papier weg of naar het definitieve archief. Deze Guideline is de digitale evenknie.

## Het format

### Taaktitel (content)

```
{actie} > {titel} ⏰ {tijdsinschatting}
```

- `{actie}` — los werkwoord, geen haken: `bekijken`, `beslissen`, `reageren`, `betalen`, `archiveren`, `verzenden`, etc.
- `>` — vaste scheiding tussen actie en titel, spatie aan beide kanten.
- `{titel}` — korte, concrete omschrijving.
- `⏰ {tijdsinschatting}` — altijd aanwezig. Twee notaties, afhankelijk van de duur:
  - Korter dan ~20-25 min: ruwe schatting in minuten (`10 min`, `15 min`). Een pomodoro erop plakken voegt niets toe voor iets dat toch al binnen één blok past.
  - 20-25 min of langer: uitdrukken in pomodoro's (`1 pomodoro`, `2 pomodoro's`). 1 pomodoro ≈ 30 min inclusief pauze — zie de sectie hieronder over waarom.

Voorbeeld: `bekijken > Nieuwe inschrijving DartsCoaching.nl – Shane van Zanten ⏰ 10 min`
Voorbeeld: `klussen > Privékeuken leegmaken ⏰ 2 pomodoro's`

### Prioriteit

- **Uitsluitend** het native Todoist-prioriteitsveld (p1–p4).
- **Nooit** als tekst-prefix in de titel — geen dubbeling meer.
- **Altijd verplicht** ingevuld bij taakaanmaak. Geen taak zonder expliciete prioriteit.

### Toegewezen persoon (label)

- Elke taak krijgt bij aanmaak precies één persoons-label: `sander`, `marieke`, `thomas`, etc.
- Geen persoon genoemd of onduidelijk wie het oppakt? Dan gaat het label `sander` erop — de verantwoordelijkheid ligt bij wie de taak aanmaakt totdat expliciet gedelegeerd wordt. Nooit een taak zonder persoons-label laten staan.
- Dit hergebruikt het bestaande labelmechanisme (zie bijv. de `thomas`-taken voor gras en moestuin) — geen nieuw systeem, alleen consequent toegepast.

### Datumprojectie

Todoist ontvangt nooit een verzonnen deadline. Kies de zichtbare datum uit de canonieke taak:

1. `scheduled_date` voor bewust geplande uitvoering;
2. `follow_up_date` voor een wachtcontrolepunt;
3. `due_date` wanneer alleen de echte externe deadline beschikbaar is.

`start_date` bepaalt zichtbaarheid in myPKA en wordt niet automatisch als Todoist-deadline misbruikt. `someday` wordt standaard niet geprojecteerd.

### Pomodoro-registratie bij afronding

- Bij taken van 1 pomodoro of meer: zet bij afronding een comment met het werkelijk aantal gebruikte pomodoro's.
- Bewust minimaal gehouden — geen apart tijdregistratie-systeem, geen dashboard. Alleen als dit in de praktijk waardevol blijkt, bouwen we er iets bovenop.

### Bronmateriaal (description)

Elke projectie linkt in de description eerst naar de canonieke myPKA-taak en daarnaast naar concrete bronnen:

| Bron | Format |
|---|---|
| E-mail | 📧 `[Origineel mailtje](https://mail.google.com/mail/u/0/#inbox/[thread_id])` — zie [[feedback_gmail_links]] |
| Fysiek/digitaal document (factuur, formulier, scan) | 🔗 `[Bronbestand](pad-of-link-naar-PKM/Documents-of-Werkarchief)` |

Geen bron beschikbaar (bijv. een idee, een reminder)? Dan blijft de description leeg of bevat alleen context — geen verplichte link.

### Afronding — het "actie-archief"-principe

Zodra de canonieke taak wordt afgerond:

- Todoist wordt als afgeleide projectie gesloten.
- Bronmateriaal dat bewaard moet blijven blijft of verhuist naar zijn definitieve canonieke archief (`PKM/Documents/` of Mediahub, afhankelijk van het type — zie [[SOP-013-inboxen-verwerken]]).

Dit is de digitale versie van "papier weg of in de kast" en sluit aan bij het eenrichtings-principe uit [[GL-004-task-resource-linking]]: de taak wijst naar de bron, nooit andersom.

## Projectroutering

Een projectie landt **nooit** in de kale `Inbox` als de context bekend is. Route op basis van de canonieke `key_element`- en `project`-koppeling; onderstaande tabel is alleen de huidige Todoist-weergave:

| Context | Todoist-project |
|---|---|
| DartsCoaching.nl | 🎯 DartsCoaching.nl |
| Dart Buddies | 🎯 Dart Buddies |
| ADC Regio Oost | 🎯 ADC Regio Oost |
| Van Gewoon Sander | ✏️ Van Gewoon Sander |
| Gezinshuis / Gewoon Thuis | 🏡 Gewoon Thuis |
| Persoonlijk | 👤 Persoonlijk |
| Verbouwing Huismanstraat | Huismanstraat |
| Twijfel / geen duidelijke context | `Inbox` (uitzondering, niet de regel) |

## Wanneer deze Guideline gelezen wordt

- Elke keer dat Daedalus of een andere bevoegde specialist een canonieke myPKA-taak naar Todoist projecteert, bijwerkt of sluit.
- Bij mailverwerking (SOP-013 en toekomstige mail-triage procedures).

## Cross-references

- [[GL-004-task-resource-linking]] — eenrichtings-principe taak → resource, waar het archiveer-bij-afronding idee op voortbouwt.
- [[GL-012-pkm-vs-todoist]] — beslisregel wanneer iets een Todoist-taak wordt vs. PKM-kennis.
- [[GL-019-persoonlijke-taakarchitectuur]] — canonieke status, datums en prioriteit.
- [[SOP-023-synchroniseer-persoonlijke-taak-naar-todoist]] — idempotente synchronisatie en conflictbeleid.
- [[SOP-013-inboxen-verwerken]] — de pet-indeling die de projectroutering hierboven hergebruikt.
- [[feedback_gmail_links]] — Gmail thread-link formaat.
- `/dagstart` (stap 5) — gebruikt de tijdsinschatting en einddatum hieruit om tijdsblokken op de agenda voor te stellen.

## Updates to this Guideline

Als het format verandert, update dit bestand. Niet dupliceren naar SOPs of Workstreams — zij `[[wikilinken]]` hierheen.
