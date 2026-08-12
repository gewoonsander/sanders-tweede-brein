import errno, importlib.util, subprocess, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

P = Path(__file__).resolve().parents[1] / "watch-food-inbox.py"
spec = importlib.util.spec_from_file_location("watch_food_inbox", P)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class WatchFoodInboxTests(unittest.TestCase):
    def test_digest_retries_temporary_icloud_read_failure(self):
        with tempfile.TemporaryDirectory() as tmp:
            photo = Path(tmp) / "meal.jpeg"; photo.write_bytes(b"meal")
            attempts = 0
            def flaky(*args, **kwargs):
                nonlocal attempts
                attempts += 1
                if attempts < 3: raise subprocess.TimeoutExpired(args[0], 10)
                return subprocess.CompletedProcess(args[0], 0, "ea36e4da4017000028db7794d946b152540d7c68bbdb6c60e999f1dce19a409b  meal.jpeg\n", "")
            with patch.object(mod.subprocess, "run", flaky), patch.object(mod.time, "sleep") as sleep:
                self.assertEqual(64, len(mod.digest(photo)))
                self.assertEqual(3, attempts)
                self.assertEqual([unittest.mock.call(1), unittest.mock.call(2)], sleep.call_args_list)

    def test_run_defers_unreadable_file_without_crashing_scan(self):
        with patch.object(mod, "digest", side_effect=OSError(errno.EAGAIN, "Resource deadlock avoided")):
            mod.run(Path("pending.jpeg"), "photo")

if __name__ == "__main__": unittest.main()
