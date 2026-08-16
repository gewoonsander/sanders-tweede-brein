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

    def test_run_deletes_audio_transcript_after_successful_file(self):
        # audio-transcribe drops the transcript back into Team Inbox/Audio Captures/
        # for food-capture to consume; once filed it must not linger there forever.
        with tempfile.TemporaryDirectory() as tmp:
            txt = Path(tmp) / "note.txt"; txt.write_text("ontbijt: ei")
            with patch.object(mod, "digest", return_value="abc123"), \
                 patch.object(mod, "done", return_value=False), \
                 patch.object(mod, "mark") as mark, \
                 patch.object(mod.subprocess, "run", return_value=subprocess.CompletedProcess([], 0, "", "")):
                mod.run(txt, "audio", "ontbijt: ei")
            mark.assert_called_once_with("abc123", "done")
            self.assertFalse(txt.exists())

    def test_run_deletes_audio_transcript_when_marked_nonfood(self):
        with tempfile.TemporaryDirectory() as tmp:
            txt = Path(tmp) / "note.txt"; txt.write_text("dit gaat niet over eten")
            with patch.object(mod, "digest", return_value="abc123"), \
                 patch.object(mod, "done", return_value=False), \
                 patch.object(mod, "mark") as mark, \
                 patch.object(mod.subprocess, "run", return_value=subprocess.CompletedProcess(
                     [], 1, "", "capture is geen voedingsregistratie")):
                mod.run(txt, "audio", "dit gaat niet over eten")
            mark.assert_called_once_with("abc123", "nonfood")
            self.assertFalse(txt.exists())

if __name__ == "__main__": unittest.main()
