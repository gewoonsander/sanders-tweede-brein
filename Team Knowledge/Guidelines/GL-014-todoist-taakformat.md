---
name: GL-014-todoist-taakformat
title: Todoist — taakformat, prioriteit en bronmateriaal
type: guideline
tags:
  - todoist
  - workflow
  - mail
owner: Hermes
created: 2026-07-01
---

# GL-014 — Todoist: taakformat, prioriteit en bronmateriaal

> **Elke agent die een Todoist-taak aanmaakt of bijwerkt leest dit.** Dit geldt voor taken die uit mailverwerking komen, maar ook voor taken die uit onderzoek, audio-transcripties of andere sessies ontstaan.

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
- `⏰ {tijdsinschatting}` — altijd aanwezig, ruwe schatting is voldoende (`10 min`, `1 uur`).

Voorbeeld: `bekijken > Nieuwe inschrijving DartsCoaching.nl – Shane van Zanten ⏰ 10 min`

### Prioriteit

- **Uitsluitend** het native Todoist-prioriteitsveld (p1–p4).
- **Nooit** als tekst-prefix in de titel — geen dubbeling meer.
- **Altijd verplicht** ingevuld bij taakaanmaak. Geen taak zonder expliciete prioriteit.

### Bronmateriaal (description)

Elke taak die uit een concrete bron voortkomt, linkt naar die bron in de description:

| Bron | Format |
|---|---|
| E-mail | 📧 `[Origineel mailtje](https://mail.google.com/mail/u/0/#inbox/[thread_id])` — zie [[feedback_gmail_links]] |
| Fysiek/digitaal document (factuur, formulier, scan) | 🔗 `[Bronbestand](pad-of-link-naar-PKM/Documents-of-Werkarchief)` |

Geen bron beschikbaar (bijv. een idee, een reminder)? Dan blijft de description leeg of bevat alleen context — geen verplichte link.

### Afronding — het "actie-archief"-principe

Zodra de taak wordt afgerond:

- Bronmateriaal dat niet langer nodig is: verwijderen.
- Bronmateriaal dat bewaard moet blijven: verplaatsen naar het definitieve archief (`PKM/Documents/` of Mediahub, afhankelijk van het type — zie [[SOP-013-inboxen-verwerken]]).

Dit is de digitale versie van "papier weg of in de kast" en sluit aan bij het eenrichtings-principe uit [[GL-004-task-resource-linking]]: de taak wijst naar de bron, nooit andersom.

## Projectroutering

Een taak landt **nooit** in de kale `Inbox` als de context bekend is. Route naar het juiste Todoist-project volgens dezelfde pet-indeling als [[SOP-013-inboxen-verwerken]]:

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

- Elke keer dat een agent (Hermes, of een specialist die tijdens een sessie een Todoist-taak aanmaakt) een taak schrijft, bijwerkt of afsluit.
- Bij mailverwerking (SOP-013 en toekomstige mail-triage procedures).

## Cross-references

- [[GL-004-task-resource-linking]] — eenrichtings-principe taak → resource, waar het archiveer-bij-afronding idee op voortbouwt.
- [[GL-012-pkm-vs-todoist]] — beslisregel wanneer iets een Todoist-taak wordt vs. PKM-kennis.
- [[SOP-013-inboxen-verwerken]] — de pet-indeling die de projectroutering hierboven hergebruikt.
- [[feedback_gmail_links]] — Gmail thread-link formaat.

## Updates to this Guideline

Als het format verandert, update dit bestand. Niet dupliceren naar SOPs of Workstreams — zij `[[wikilinken]]` hierheen.
