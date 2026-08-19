# Darts Exercises - Index

Trackbare dart-oefeningen: één notitie per oefening, met de volledige instructie en een eigen `## Logboek` waarin elke uitvoering wordt vastgelegd. De markdown is canoniek; de Cockpit spiegelt deze map naar de tabellen `darts_exercises` en `darts_exercise_logs` in `mypka.db`.

## Waarom dit een aparte map is

Een oefening is geen [[PKM/My Life/Habits/INDEX|Habit]] (geen cadans, geen dagelijkse ja/nee) en geen [[PKM/My Life/Projects/INDEX|Project]] (geen finish). Het is een **collectie herhaalbare items met een meetbaar resultaat** — dezelfde vorm als de Recipes/Movies-bibliotheken uit het Cockpit-library-patroon. Het schema staat in [[GL-002-frontmatter-conventions]].

## Jouw Dartstraining (22 oefeningen)

Bron: [[jouw-dartstraining]] — de cursus die Sander beheert in de Huddle-community Dart Buddies.

### Dag 1 : Rust, Ritme & Richting

- [[dag-1-oefening-1-bulls-basic]] — Oefening 1: Bulls Basic
- [[dag-1-oefening-2-simply-singles]] — Oefening 2: Simply Singles
- [[dag-1-oefening-3-20-lock-in]] — Oefening 3: 20-Lock-In
- [[dag-1-oefening-4-scorestreak]] — Oefening 4: ScoreStreak
- [[dag-1-oefening-5-double-trouble]] — Oefening 5: Double Trouble
- [[dag-1-oefening-6-finishtrap-41-3]] — Oefening 6: Finishtrap 41 + 3

### Dag 2 Herhaling & Wedstrijddruk

- [[dag-2-oefening-1-simply-singles]] — Oefening 1: Simply Singles
- [[dag-2-oefening-2-20-lock-in]] — Oefening 2: 20-Lock-In
- [[dag-2-oefening-3-scorestreak]] — Oefening 3: ScoreStreak
- [[dag-2-oefening-4-bullmaster]] — Oefening 4: BullMaster
- [[dag-2-oefening-5-me-myself-the-invisible-man]] — Oefening 5: Me Myself & The Invisible Man
- [[dag-2-oefening-6-101-bo-11]] — Oefening 6: 101 bo 11

### Dag 3 Verdieping & Variatie

- [[dag-3-oefening-1-270p]] — Oefening 1: 270P
- [[dag-3-oefening-2-simply-singles]] — Oefening 2: Simply Singles
- [[dag-3-oefening-3-double-no-trouble]] — Oefening 3: Double No Trouble
- [[dag-3-oefening-4-scorestreak]] — Oefening 4: ScoreStreak
- [[dag-3-oefening-5-finishtrap-41-3]] — Oefening 5: Finishtrap 41 + 3
- [[dag-3-oefening-6-ten-big-fishes]] — Oefening 6: Ten Big Fishes

### Dag 4 Wedstrijd of Vrije Training

- [[dag-4-oefening-1-5-potjes-501-best-of-5]] — Oefening 1: 5 potjes 501 best of 5
- [[dag-4-oefening-2-scorestreak]] — Oefening 2: ScoreStreak
- [[dag-4-oefening-3-121-en]] — Oefening 3: 121'en
- [[dag-4-wedstrijd]] — Wedstrijd: Wedstrijd

## Een sessie loggen

Open de notitie van de oefening en zet onder `## Logboek` een datumkop met de regels eronder. Dezelfde vorm als de dagelijkse check-in bij een Habit:

```markdown
### 2026-08-19

- score: 22
- unit: punten
- result: 22 punten over 10 beurten
- trigger: chat
- note: ritme voelde beter na beurt 5
```

Alleen de datumkop is verplicht; `score`, `unit`, `result`, `trigger` en `note` zijn optioneel. Meerdere blokken op dezelfde datum mogen — een oefening kan twee keer op een dag gedaan worden. Draai daarna `python3 Expansions/mypka-cockpit/scripts/regen-mypka-db.py` om de spiegel bij te werken.

## Naming

Kebab-case slug, geen datumprefix: `dag-<n>-oefening-<n>-<naam>`. Zie [[GL-001-file-naming-conventions]].
