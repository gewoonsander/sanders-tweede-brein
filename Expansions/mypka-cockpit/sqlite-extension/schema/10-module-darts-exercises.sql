-- ============================================================================
-- 10-module-darts-exercises.sql — trackbare dart-oefeningen + hun sessielogboek
-- ----------------------------------------------------------------------------
-- Twee tabellen, exact het `habits` / `habit_logs`-patroon:
--
--   darts_exercises      de DEFINITIE — één rij per oefening-notitie in
--                        PKM/My Life/Darts Exercises/ (doc_type: darts-exercise).
--                        Tegelijk een LIBRARY-mirror (library_registry-rij), dus
--                        de Cockpit-nav pikt hem data-driven op zonder UI-code.
--   darts_exercise_logs  het FEIT — één rij per uitgevoerde sessie, geparsed uit
--                        de `## Logboek`-sectie van diezelfde notitie.
--
-- MARKDOWN IS CANONIEK. Beide tabellen zijn regen-owned (staan in OWNED_TABLES
-- van scripts/regen-mypka-db.py): ze worden bij elke run gedropt en opnieuw
-- opgebouwd uit de notities. Er wordt hier NIETS geseed en er wordt nooit naar
-- markdown teruggeschreven. Een sessie loggen doe je door een datumkop in de
-- notitie te zetten, niet door in deze tabellen te INSERTen — een INSERT hier
-- overleeft de volgende regen niet.
--
-- WAAROM DIT GEEN `habits` IS.
--   Een Habit beantwoordt "heb ik het vandaag gedaan?" (ja/nee, op een cadans).
--   Een oefening beantwoordt "wat scoorde ik toen ik hem deed?" — geen cadans,
--   geen dagelijkse verwachting, wél een meetbaar resultaat per uitvoering.
--   Vandaar `score` in plaats van `done`, en géén UNIQUE op (slug, datum).
-- ============================================================================

-- ── darts_exercises ──────────────────────────────────────────────────────────
--   slug             bestandsnaam-stam (route-key), bv. 'dag-1-oefening-1-bulls-basic'
--   title            volledige weergavenaam ('Dag 1 - Oefening 1 - Bulls Basic')
--   exercise_name    alleen de oefeningnaam ('Bulls Basic') — meerdere dagen delen
--                    dezelfde oefening, dus dit is de kolom waarop je groepeert
--                    als je progressie over de hele cursus wilt zien
--   course           slug van de broncursus-notitie (FK naar documents.slug).
--                    Bestaat nu al zodat een tweede cursus later gewoon een extra
--                    waarde is in plaats van een schemawijziging
--   course_module    modulenaam als LABEL, niet als FK — er is geen modulenotitie
--   training_day     dagnummer binnen de cursus (1..4); numeriek zodat sorteren werkt
--   exercise_number  volgnummer binnen die dag; NULL voor lessen zonder nummer
--                    (bv. 'Dag 4 - Wedstrijd')
--   source_*         herkomst: het Huddle-platform, cursus-id en les-id. Bewaard
--                    zodat een herimport dezelfde les kan terugvinden ook als de
--                    lesnaam op het platform verandert
CREATE TABLE IF NOT EXISTS darts_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  title TEXT,
  exercise_name TEXT,
  status TEXT,
  course TEXT,
  course_module TEXT,
  training_day INTEGER,
  exercise_number INTEGER,
  key_element TEXT,
  source_platform TEXT,
  source_course_id TEXT,
  source_lesson_id TEXT,
  imported_on TEXT,
  tags TEXT,
  body TEXT,
  file_path TEXT,
  raw_frontmatter TEXT
);

-- ── darts_exercise_logs ──────────────────────────────────────────────────────
--   exercise_slug  FK naar darts_exercises.slug
--   log_date       ISO YYYY-MM-DD, uit de `### `-datumkop in `## Logboek`
--   seq            0-gebaseerde volgorde van dit blok BINNEN die datum. Bestaat
--                  omdat er BEWUST geen UNIQUE(exercise_slug, log_date) is: een
--                  oefening kan twee keer op één dag gedaan worden, en dan zijn
--                  het twee resultaten, geen correctie op elkaar. Dat is precies
--                  het punt waarop dit afwijkt van habit_logs, waar de laatste
--                  check-in van de dag de vorige juist WEL overschrijft.
--   score          numeriek resultaat als de gebruiker er een noteerde; NULL is
--                  volkomen geldig — "ik heb hem gedaan" is ook een log
--   unit           eenheid bij score ('punten', 'darts', 'legs', ...), vrij veld
--                  omdat elke oefening in een andere eenheid scoort
--   result         korte tekstuele uitslag voor de gevallen waar één getal het
--                  niet vangt ('best of 5 gewonnen', 'tot dubbel 14 gekomen')
--   trigger        waar de log vandaan kwam ('chat', 'close-session', ...)
--   note           vrije observatie
--   source_path    het markdown-bestand waaruit deze rij is afgeleid — maakt elke
--                  rij terug traceerbaar naar zijn canonieke bron
CREATE TABLE IF NOT EXISTS darts_exercise_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_slug TEXT NOT NULL,
  log_date TEXT NOT NULL,
  seq INTEGER NOT NULL DEFAULT 0,
  score REAL,
  unit TEXT,
  result TEXT,
  trigger TEXT,
  note TEXT,
  source_path TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_darts_exercise_logs_slug_date
  ON darts_exercise_logs (exercise_slug, log_date);

-- ── v_darts_exercise_log ─────────────────────────────────────────────────────
-- Platte leesweergave: elke gelogde sessie met de naam van de oefening erbij.
-- Het analogon van v_habit_heatmap.
CREATE VIEW IF NOT EXISTS v_darts_exercise_log AS
SELECT l.exercise_slug, e.title AS exercise_title, e.exercise_name,
       e.training_day, e.course,
       l.log_date, l.seq, l.score, l.unit, l.result, l.trigger, l.note
FROM darts_exercise_logs l
LEFT JOIN darts_exercises e ON e.slug = l.exercise_slug
ORDER BY l.log_date DESC, l.exercise_slug, l.seq;

-- ── v_darts_exercise_progress ────────────────────────────────────────────────
-- Eén rij per oefening: hoe vaak gedaan, wanneer voor het laatst, beste en meest
-- recente score. Het analogon van v_habit_streaks — maar zonder streak-logica,
-- want een oefening kent geen dagelijkse verwachting die je kunt missen.
-- Oefeningen zonder enkele log komen er WEL in (LEFT JOIN vanaf de definitie),
-- met sessions = 0: "nog nooit gedaan" is de nuttigste rij van allemaal.
CREATE VIEW IF NOT EXISTS v_darts_exercise_progress AS
SELECT e.slug AS exercise_slug, e.title AS exercise_title, e.exercise_name,
       e.training_day, e.exercise_number, e.course, e.status,
       COUNT(l.id) AS sessions,
       MIN(l.log_date) AS first_logged,
       MAX(l.log_date) AS last_logged,
       MAX(l.score) AS best_score,
       (SELECT l2.score FROM darts_exercise_logs l2
         WHERE l2.exercise_slug = e.slug
         ORDER BY l2.log_date DESC, l2.seq DESC LIMIT 1) AS last_score,
       (SELECT l2.unit FROM darts_exercise_logs l2
         WHERE l2.exercise_slug = e.slug
         ORDER BY l2.log_date DESC, l2.seq DESC LIMIT 1) AS last_unit,
       CAST(julianday('now') - julianday(MAX(l.log_date)) AS INTEGER)
         AS days_since_last_log
FROM darts_exercises e
LEFT JOIN darts_exercise_logs l ON l.exercise_slug = e.slug
GROUP BY e.slug;
