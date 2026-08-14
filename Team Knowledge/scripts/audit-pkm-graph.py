#!/usr/bin/env python3
"""Read-only graph-integrity audit for an Obsidian-compatible myPKA vault."""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote


WIKILINK_RE = re.compile(r"(!?)\[\[([^\]]+)\]\]")
MARKDOWN_LINK_RE = re.compile(r"(!?)\[[^\]]*\]\(([^)]+)\)")
FENCED_CODE_RE = re.compile(r"```.*?```|~~~.*?~~~", re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
EXTERNAL_SCHEMES = ("http://", "https://", "mailto:", "tel:", "obsidian:", "data:")
EXCLUDED_PARTS = {".git", ".claude", ".obsidian", "node_modules", "dist", ".venv", "__pycache__", "_installed"}
EXCLUDED_ROOTS = {"Expansions"}


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Audit myPKA wikilinks without changing the vault.")
    parser.add_argument("vault", nargs="?", default=".", help="Vault root (default: current directory)")
    parser.add_argument("--scope", default="PKM", help="Folder to classify and report (default: PKM)")
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    parser.add_argument("--output", type=Path, help="Write the report here instead of stdout")
    return parser.parse_args(argv)


def is_excluded(path: Path, vault: Path) -> bool:
    rel = path.relative_to(vault)
    return bool(rel.parts and rel.parts[0] in EXCLUDED_ROOTS) or any(part in EXCLUDED_PARTS for part in rel.parts)


def clean_markdown(text: str) -> str:
    return INLINE_CODE_RE.sub("", FENCED_CODE_RE.sub("", text))


def normalize_target(raw: str) -> str:
    target = unquote(raw.strip().strip("<>"))
    target = target.split("|", 1)[0].split("#", 1)[0].split("?", 1)[0]
    return target.replace("\\", "/").strip()


class Resolver:
    def __init__(self, vault: Path, scope: Path, files: list[Path]) -> None:
        self.vault = vault
        self.scope = scope
        self.by_path: dict[str, Path] = {}
        self.by_md_stem: dict[str, list[Path]] = defaultdict(list)
        self.by_filename: dict[str, list[Path]] = defaultdict(list)
        for path in files:
            rel = path.relative_to(vault).as_posix()
            self.by_path[rel.casefold()] = path
            self.by_filename[path.name.casefold()].append(path)
            if path.suffix.casefold() == ".md":
                self.by_path[rel[:-3].casefold()] = path
                self.by_md_stem[path.stem.casefold()].append(path)

    def resolve_wikilink(self, target: str) -> list[Path]:
        norm = normalize_target(target).strip("/")
        if not norm:
            return []
        direct = self.by_path.get(norm.casefold())
        if direct:
            return [direct]
        scoped = self.by_path.get(f"{self.scope.as_posix().strip('/')}/{norm}".casefold())
        if scoped:
            return [scoped]
        name = Path(norm).name
        if Path(name).suffix:
            return self.by_filename.get(name.casefold(), [])
        candidates = self.by_md_stem.get(name.casefold(), [])
        if "/" in norm:
            suffix = norm.casefold()
            narrowed = [p for p in candidates if p.relative_to(self.vault).with_suffix("").as_posix().casefold().endswith(suffix)]
            if narrowed:
                return narrowed
        return candidates

    def resolve_markdown_link(self, source: Path, target: str) -> list[Path] | None:
        norm = normalize_target(target)
        if not norm or norm.casefold().startswith(EXTERNAL_SCHEMES):
            return None
        candidate = (source.parent / norm).resolve()
        try:
            rel = candidate.relative_to(self.vault).as_posix()
        except ValueError:
            return []
        hit = self.by_path.get(rel.casefold())
        return [hit] if hit else []


def category(rel: str) -> str:
    if "/YouTube-Kennis/" in f"/{rel}":
        return "YouTube-Kennis"
    parts = Path(rel).parts
    return parts[1] if len(parts) > 1 else "PKM-overig"


def classify(rel: str) -> str:
    path = Path(rel)
    if path.name in {"INDEX.md", "README.md"} or "_template" in path.parts:
        return "technical-or-index"
    if "/YouTube-Kennis/" in f"/{rel}":
        return "collection-item"
    return "knowledge-note"


def audit(vault: Path, scope_name: str) -> dict:
    vault = vault.resolve()
    scope = Path(scope_name.strip("/"))
    scope_root = vault / scope
    if not scope_root.is_dir():
        raise ValueError(f"Scope bestaat niet: {scope_root}")

    files = sorted(p for p in vault.rglob("*") if p.is_file() and not is_excluded(p, vault))
    markdown = [p for p in files if p.suffix.casefold() == ".md"]
    scoped = [p for p in markdown if p == scope_root or scope_root in p.parents]
    scoped_set = set(scoped)
    resolver = Resolver(vault, scope, files)
    incoming = {p: set() for p in scoped}
    outgoing = {p: set() for p in scoped}
    broken: set[tuple[str, str, str]] = set()
    ambiguous: set[tuple[str, str, str, tuple[str, ...]]] = set()
    resolved_occurrences = Counter()

    for source in markdown:
        text = clean_markdown(source.read_text(encoding="utf-8", errors="replace"))
        links: list[tuple[str, str, list[Path] | None]] = []
        for embed, raw in WIKILINK_RE.findall(text):
            links.append(("embed" if embed else "wikilink", raw, resolver.resolve_wikilink(raw)))
        for embed, raw in MARKDOWN_LINK_RE.findall(text):
            links.append(("markdown-embed" if embed else "markdown-link", raw, resolver.resolve_markdown_link(source, raw)))

        for kind, raw, matches in links:
            if matches is None:
                continue
            source_rel = source.relative_to(vault).as_posix()
            target = normalize_target(raw)
            if len(matches) == 1:
                destination = matches[0]
                if source in scoped_set:
                    resolved_occurrences[kind] += 1
                    outgoing[source].add(destination)
                if destination in scoped_set:
                    incoming[destination].add(source)
            elif len(matches) == 0:
                if source in scoped_set:
                    broken.add((source_rel, target, kind))
            else:
                if source in scoped_set:
                    destinations = tuple(sorted(p.relative_to(vault).as_posix() for p in matches))
                    ambiguous.add((source_rel, target, kind, destinations))

    isolated = []
    for path in scoped:
        if incoming[path] or outgoing[path]:
            continue
        rel = path.relative_to(vault).as_posix()
        isolated.append({"path": rel, "category": category(rel), "classification": classify(rel)})

    index_only = []
    for path in scoped:
        sources = incoming[path]
        if not sources or any(s.name not in {"INDEX.md", "README.md"} for s in sources):
            continue
        rel = path.relative_to(vault).as_posix()
        index_only.append({"path": rel, "category": category(rel), "incoming_from": sorted(s.relative_to(vault).as_posix() for s in sources)})

    broken_rows = [{"source": s, "target": t, "kind": k} for s, t, k in sorted(broken)]
    ambiguous_rows = [
        {"source": s, "target": t, "kind": k, "matches": list(matches)}
        for s, t, k, matches in sorted(ambiguous)
    ]
    return {
        "schema_version": 1,
        "vault": vault.as_posix(),
        "scope": scope.as_posix(),
        "summary": {
            "markdown_files": len(scoped),
            "resolved_link_occurrences": sum(resolved_occurrences.values()),
            "isolated_candidates": len(isolated),
            "broken_links": len(broken_rows),
            "ambiguous_links": len(ambiguous_rows),
            "index_only_notes": len(index_only),
        },
        "resolved_by_kind": dict(sorted(resolved_occurrences.items())),
        "isolated_by_category": dict(sorted(Counter(row["category"] for row in isolated).items())),
        "isolated_by_classification": dict(sorted(Counter(row["classification"] for row in isolated).items())),
        "isolated": isolated,
        "broken": broken_rows,
        "ambiguous": ambiguous_rows,
        "index_only": index_only,
    }


def render_markdown(result: dict) -> str:
    s = result["summary"]
    lines = [
        "# PKM-graafhygiëne — auditrapport",
        "",
        f"- Scope: `{result['scope']}/**/*.md`",
        "- Modus: alleen-lezen",
        "",
        "## Samenvatting",
        "",
        "| Signaal | Aantal |",
        "|---|---:|",
        f"| Markdownbestanden | {s['markdown_files']} |",
        f"| Opgeloste linkvoorkomens | {s['resolved_link_occurrences']} |",
        f"| Geïsoleerde kandidaten | {s['isolated_candidates']} |",
        f"| Niet-oplosbare links | {s['broken_links']} |",
        f"| Dubbelzinnige links | {s['ambiguous_links']} |",
        f"| Alleen via INDEX/README bereikbaar | {s['index_only_notes']} |",
        "",
        "## Geïsoleerde kandidaten",
        "",
    ]
    for row in result["isolated"]:
        lines.append(f"- `{row['path']}` — {row['classification']}")
    lines += ["", "## Niet-oplosbare links", ""]
    for row in result["broken"]:
        lines.append(f"- `{row['source']}` → `[[{row['target']}]]` ({row['kind']})")
    lines += ["", "## Dubbelzinnige links", ""]
    for row in result["ambiguous"]:
        matches = ", ".join(f"`{m}`" for m in row["matches"])
        lines.append(f"- `{row['source']}` → `[[{row['target']}]]`: {matches}")
    lines += ["", "## Alleen via INDEX/README bereikbaar", ""]
    for row in result["index_only"]:
        sources = ", ".join(f"`{p}`" for p in row["incoming_from"])
        lines.append(f"- `{row['path']}` ← {sources}")
    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        result = audit(Path(args.vault), args.scope)
    except (OSError, ValueError) as exc:
        print(f"FOUT: {exc}", file=sys.stderr)
        return 2
    output = json.dumps(result, ensure_ascii=False, indent=2) + "\n" if args.format == "json" else render_markdown(result)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8")
    else:
        sys.stdout.write(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
