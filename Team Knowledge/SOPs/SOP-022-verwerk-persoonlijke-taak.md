# SOP-022 — Verwerk een persoonlijke taak

Default owner: Hermes. Pieter en Penn mogen deze SOP uitvoeren via Hermes.

Lees eerst [[GL-001-file-naming-conventions]], [[GL-002-frontmatter-conventions]], [[GL-004-task-resource-linking]] en [[GL-019-persoonlijke-taakarchitectuur]].

## 1. Capture

Maak bij onduidelijke invoer een taak met `status: inbox`. Gebruik [[Templates/personal-task]], ken de volgende vrije `task_id` van vandaag toe en bewaar de bron. Een Gmail-taak is pas compleet met werkende thread-URL.

## 2. Clarify

Formuleer één concrete eerstvolgende actie met werkwoord en één toetsbare gewenste uitkomst. Is er geen actie: verwijderen, als kennis/routering verwerken, of bewust naar `someday`.

## 3. Organize

1. Koppel verplicht het juiste bestaande Key Element.
2. Koppel alleen een bestaand Project, Goal of Habit wanneer de relatie echt bestaat.
3. Vul eigenaar, context, Eisenhower-kwadrant en tijdsinschatting in.
4. Vul alleen een echte `due_date`; gebruik voor intentie `scheduled_date` en voor uitstel `start_date`.
5. Wandel de relevante broncategorieën uit [[GL-004-task-resource-linking]] langs en spiegel ze als `[[wikilinks]]` in de body.

## 4. Kies de GTD-status

- uitvoerbaar nu → `next`;
- bewust op dag gezet → `scheduled`;
- bij ander belegd → `waiting` en vul gedelegeerde, start en opvolgdatum;
- geen actuele toezegging → `someday`.

Verplaats het bestand naar de overeenkomstige map. Hernoem het nooit.

## 5. Waiting follow-up

Leg vast wat is gevraagd, aan wie, wanneer, verwachte reactietijd en wat Sander op `follow_up_date` doet. Bij het controlepunt: sluiten bij geleverd resultaat, een herinneringsactie maken, opnieuw dateren met reden, of escaleren naar Hermes. Geen automatische oneindige herhaling.

## 6. Review en engage

`/dagstart` toont relevante `next`, `scheduled`, harde deadlines en wachtcontrolepunten. De weekreview verduidelijkt achtergebleven `inbox`, beoordeelt `someday`, verlopen datums en waiting-items. Kies uitvoer op context, beschikbare tijd, energie en Eisenhower.

## 7. Sluiten

Zet `status: done` of `cancelled`, werk `updated` bij, voeg een gedateerde geschiedenisregel met reden toe en verplaats naar `done/YYYY/MM/` of `cancelled/YYYY/MM/`. Bronnen blijven op hun canonieke plek. Sluit een Todoist-projectie via [[SOP-023-synchroniseer-persoonlijke-taak-naar-todoist]].

