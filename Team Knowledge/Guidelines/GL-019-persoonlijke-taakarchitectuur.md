---
id: GL-019
title: Persoonlijke taakarchitectuur
owner: Atlas
created: 2026-08-14
tags: [tasks, gtd, eisenhower, pkm]
---

# GL-019 — Persoonlijke taakarchitectuur

myPKA is de SSOT voor Sanders persoonlijke taken. Todoist en dashboards zijn afgeleide weergaven.

## Plaats in de kennisgrafiek

Iedere taak heeft één bestaand `key_element`. De keten is `Key Element → eventueel Goal → Project of Habit → Task → resources`. Een `project` is alleen aanwezig bij echt begrensd projectwerk. `goal` en `habit` respecteren de carrier doctrine uit [[GL-002-frontmatter-conventions]]. `parent_task` is alleen voor echte subtaken.

Taaklinks wijzen eenrichtings naar bronnen conform [[GL-004-task-resource-linking]]. Bronnen krijgen geen `linked_tasks`-veld. Menselijke links staan onder `## Context een klik verder`; dezelfde relaties staan als slugs in frontmatter.

## GTD-statusmachine

- `inbox`: nog niet verduidelijkt.
- `next`: concrete eerstvolgende actie die nu uitvoerbaar is.
- `waiting`: uitvoering ligt bij een ander; Sander bewaakt alleen het controlepunt.
- `scheduled`: bewust op een uitvoerdag gezet.
- `someday`: mogelijk later, zonder actuele toezegging.
- `done`: gewenste uitkomst of actie voltooid.
- `cancelled`: bewust niet meer uitvoeren.

Een taak heeft precies één status. Bestandslocatie en `status` moeten overeenkomen. Afgeronde en geannuleerde taken gaan naar jaar/maand op basis van de sluitdatum.

## Eisenhower

`eisenhower` is verplicht en heeft één waarde:

- `important-urgent`: vandaag beschermen of direct handelen;
- `important-not-urgent`: plannen en ruimte beschermen;
- `not-important-urgent`: delegeren of sterk begrenzen;
- `not-important-not-urgent`: schrappen, parkeren of alleen bewust doen.

Eisenhower bepaalt prioriteit, niet de GTD-status. `waiting` kan bijvoorbeeld nog steeds belangrijk en urgent zijn.

## Datumsemantiek

- `due_date`: uitsluitend een echte externe deadline of vervaldatum.
- `scheduled_date`: bewuste uitvoerdag.
- `start_date`: vóór deze datum niet als `next` aanbieden.
- `follow_up_date`: eerstvolgende controle bij wachten of delegatie.

Geen fictieve deadline gebruiken voor zichtbaarheid. `/dagstart` en projecties lezen de passende datumvelden.

## Wachten en delegatie

Bij `status: waiting` zijn `delegated_to`, `waiting_since` en `follow_up_date` verplicht. De gedelegeerde bezit het werk; Sander bezit alleen het opvolgcontrolepunt. Pieter of Hermes schat een redelijke reactietijd op basis van afspraak, complexiteit en urgentie. Zonder concrete afspraak geldt een voorstel, geen stilzwijgende zekerheid. Een gemist controlepunt wordt opnieuw beoordeeld; er ontstaat geen eindeloos herhalende reminder zonder menselijke beslissing.

## Bronnen en e-mail

Een Gmail-taak bevat `source_type: gmail` en een werkende thread-URL in `source_url`. Factuurbetaling en aanlevering aan Jortt zijn afzonderlijke acties of aantoonbaar afzonderlijke statuscontrolepunten. Het afsluiten van één bewijst het andere niet.

## Bestandsidentiteit

Naam en locatie volgen [[GL-001-file-naming-conventions]]. `task_id` en bestandsnaam blijven stabiel bij statuswijziging. De append-only geschiedenis vermeldt datum, wijziging, actor en reden.

## Todoist

Todoist is optioneel. Alleen canonieke myPKA-taken worden geprojecteerd. Bij conflict wint myPKA. Verwijdering of uitval van Todoist mag taak, status, bron of geschiedenis niet verwijderen.

