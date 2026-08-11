import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from food_log import append_audit, append_meal, daily_path, parse


class FoodLogTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.vault = Path(self.tmp.name)

    def tearDown(self): self.tmp.cleanup()

    def payload(self, source="photo-1", meal="lunch"):
        return {"log_date":"2026-08-11","logged_at":"2026-08-11T12:30:00+02:00",
                "meal_type":meal,"description":"Banaan en sinaasappel","source_type":"photo",
                "source_id":source,"kcal":[95,135],"protein_g":[1,1.8],
                "carbs_g":[23,32],"fat_g":[0.2,0.5],"confidence":"high"}

    def test_append_and_duplicate_are_idempotent(self):
        path = append_meal(self.payload(), self.vault)
        before = path.read_bytes(); append_meal(self.payload(), self.vault)
        self.assertEqual(before, path.read_bytes())
        self.assertEqual(1, len(parse(path)["active"]))

    def test_all_meal_types(self):
        for i, meal in enumerate(("breakfast","lunch","dinner","snack")):
            append_meal(self.payload(f"s-{i}", meal), self.vault)
        self.assertEqual(4, len(parse(daily_path("2026-08-11", self.vault))["active"]))

    def test_correction_supersedes_old_entry(self):
        first = self.payload(); append_meal(first, self.vault)
        state = parse(daily_path("2026-08-11", self.vault))
        corrected = self.payload("correction"); corrected["supersedes_entry_id"] = state["entries"][0]["entry_id"]
        corrected["description"] = "Gecorrigeerde lunch"; append_meal(corrected, self.vault)
        self.assertEqual(1, len(parse(daily_path("2026-08-11", self.vault))["active"]))

    def test_completion_latest_wins(self):
        append_audit("2026-08-11", False, "2026-08-11T18:00:00+02:00", self.vault)
        path = append_audit("2026-08-11", True, "2026-08-11T21:00:00+02:00", self.vault)
        self.assertTrue(parse(path)["latest_audit"]["complete"])
        self.assertIn("day_complete: true", path.read_text())

    def test_rejects_unknown_category(self):
        with self.assertRaises(ValueError): append_meal(self.payload(meal="brunch"), self.vault)


if __name__ == "__main__": unittest.main()
