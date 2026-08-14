import importlib.util
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "audit-pkm-graph.py"
SPEC = importlib.util.spec_from_file_location("audit_pkm_graph", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(MODULE)


class GraphAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.vault = Path(self.temp.name)
        (self.vault / "PKM/Topics").mkdir(parents=True)

    def tearDown(self):
        self.temp.cleanup()

    def write(self, relative, text=""):
        path = self.vault / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def audit(self):
        return MODULE.audit(self.vault, "PKM")

    def test_resolves_wikilinks_and_ignores_code_examples(self):
        self.write("PKM/Topics/alpha.md", "[[beta]]\n`[[fake]]`\n```\n[[fake-two]]\n```\n")
        self.write("PKM/Topics/beta.md", "")
        result = self.audit()
        self.assertEqual(result["summary"]["isolated_candidates"], 0)
        self.assertEqual(result["summary"]["broken_links"], 0)

    def test_reports_broken_and_ambiguous_links(self):
        self.write("PKM/Topics/source.md", "[[missing]] [[shared]]")
        self.write("PKM/Topics/shared.md", "")
        self.write("PKM/Other/shared.md", "")
        result = self.audit()
        self.assertEqual(result["summary"]["broken_links"], 1)
        self.assertEqual(result["summary"]["ambiguous_links"], 1)

    def test_resolves_scope_relative_embed_and_markdown_attachment(self):
        self.write("PKM/Journal/day.md", "![[Images/photo.jpg]]\n[document](../Documents/a.pdf)\n")
        self.write("PKM/Images/photo.jpg", "image")
        self.write("PKM/Documents/a.pdf", "pdf")
        result = self.audit()
        self.assertEqual(result["summary"]["broken_links"], 0)
        self.assertEqual(result["resolved_by_kind"]["embed"], 1)
        self.assertEqual(result["resolved_by_kind"]["markdown-link"], 1)

    def test_external_links_do_not_count_as_broken(self):
        self.write("PKM/Topics/alpha.md", "[site](https://example.com)\n")
        result = self.audit()
        self.assertEqual(result["summary"]["broken_links"], 0)
        self.assertEqual(result["summary"]["isolated_candidates"], 1)

    def test_resolved_occurrence_count_is_limited_to_scope_sources(self):
        self.write("PKM/Topics/alpha.md", "")
        self.write("Team Knowledge/outside.md", "[[alpha]]")
        result = self.audit()
        self.assertEqual(result["summary"]["resolved_link_occurrences"], 0)
        self.assertEqual(result["summary"]["isolated_candidates"], 0)

    def test_excludes_worktrees_and_expansions(self):
        self.write("PKM/Topics/alpha.md", "[[duplicate]]")
        self.write("PKM/Topics/duplicate.md", "")
        self.write(".claude/worktrees/x/PKM/Topics/duplicate.md", "")
        self.write("Expansions/example/duplicate.md", "")
        result = self.audit()
        self.assertEqual(result["summary"]["ambiguous_links"], 0)


if __name__ == "__main__":
    unittest.main()
