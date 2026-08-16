import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "regen-mypka-db.py"
SPEC = importlib.util.spec_from_file_location("regen_mypka_db", SCRIPT)
regen = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(regen)


class HabitReflectionParserTests(unittest.TestCase):
    def test_parses_structured_quantity(self):
        body = """
## Reflection

### 2026-08-16

- done: true
- amount: 25
- unit: herhalingen
- trigger: close-session
- note: verdeeld over twee sets
"""
        self.assertEqual(
            regen.parse_habit_reflections(body),
            [{
                "log_date": "2026-08-16",
                "done": 1,
                "amount": 25.0,
                "unit": "herhalingen",
                "trigger": "close-session",
                "note": "verdeeld over twee sets",
                "log_schema": "reflection-v1",
            }],
        )

    def test_legacy_later_correction_wins(self):
        body = """
## Reflection

### 2026-07-08

Bij close-session: nog niet aangebracht op het moment van afsluiten.

**Update:** crème alsnog aangebracht ✓.
"""
        rows = regen.parse_habit_reflections(body)
        self.assertEqual(rows[0]["done"], 1)
        self.assertEqual(rows[0]["log_schema"], "legacy-reflection")

    def test_uncertain_prose_is_not_guessed(self):
        body = """
## Reflection

### 2026-08-16

Vandaag dacht ik na over deze gewoonte.
"""
        self.assertEqual(regen.parse_habit_reflections(body), [])


if __name__ == "__main__":
    unittest.main()
