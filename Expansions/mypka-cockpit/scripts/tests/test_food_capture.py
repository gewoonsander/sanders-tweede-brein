import importlib.util, json, tempfile, unittest
from pathlib import Path

P = Path(__file__).resolve().parents[1] / "process-food-capture.py"
spec = importlib.util.spec_from_file_location("food_capture", P); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class Args: pass
class CaptureTests(unittest.TestCase):
    def test_explicit_category_beats_time(self):
        self.assertEqual("lunch", mod.category("Lunch met brood", 8))
    def test_time_fallback(self):
        self.assertEqual("dinner", mod.category("kip met rijst", 19))
    def test_normalized_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            f=Path(tmp)/"a.json"; f.write_text(json.dumps({"description":"Soep","kcal":[100,160],"protein_g":[3,6],"carbs_g":[12,20],"fat_g":[2,7],"confidence":"medium"}))
            a=Args(); a.logged_at="2026-08-11T12:00:00+02:00"; a.source_id="memo-1"; a.photo=None; a.text="lunch soep"; a.analysis_json=f; a.meal_type=None; a.source_type="audio"; a.photo_path=None
            out=mod.normalize(a); self.assertEqual("lunch",out["meal_type"]); self.assertEqual([100,160],out["kcal"])

if __name__ == "__main__": unittest.main()
