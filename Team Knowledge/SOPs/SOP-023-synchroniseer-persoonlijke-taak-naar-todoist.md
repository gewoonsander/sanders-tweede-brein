# SOP-023 — Synchroniseer persoonlijke taak naar Todoist

Default owner: Daedalus.

Lees [[GL-012-pkm-vs-todoist]], [[GL-014-todoist-taakformat]] en [[GL-019-persoonlijke-taakarchitectuur]]. myPKA blijft altijd SSOT.

## Projecteren

1. Valideer de canonieke taak en `task_id`.
2. Zoek eerst op bestaand `todoist_id`; maak nooit blind een duplicaat.
3. Vertaal titel, eigenaar, tijdsinschatting, prioriteit, project en de passende datum volgens GL-014.
4. Voeg een klikbare verwijzing naar de canonieke taak en haar bronnen toe.
5. Maak of werk de Todoist-taak idempotent bij.
6. Schrijf `todoist_id`, `todoist_sync_status: synced` en een geschiedenisregel terug naar myPKA.

## Gebeurtenissen terug

Een Todoist-statuswijziging is een gebeurtenis, geen zelfstandig gezag. Controleer de gekoppelde `task_id`, vertaal de wijziging naar myPKA en leg haar vast. Bij inhouds- of statusconflict wint myPKA en wordt Todoist opnieuw geprojecteerd.

## Fouten en herstel

Zet bij fouten `todoist_sync_status: error`, behoud alle canonieke gegevens en meld het tijdens de eerstvolgende review. Verwijder nooit een myPKA-taak omdat Todoist ontbreekt. Zonder Todoist werkt de taaklaag volledig door.

