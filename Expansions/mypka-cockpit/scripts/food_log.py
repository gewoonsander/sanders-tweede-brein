#!/usr/bin/env python3
"""Append-only daily food logs. Markdown is canonical; JSON comments are parser anchors."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import tempfile
from datetime import datetime
from pathlib import Path

MEAL_TYPES = {"breakfast", "lunch", "dinner", "snack"}
ENTRY_RE = re.compile(r"<!-- FOOD_ENTRY (\{.*\}) -->")
AUDIT_RE = re.compile(r"<!-- FOOD_AUDIT (\{.*\}) -->")


def root() -> Path:
    return Path(__file__).resolve().parents[3]


def daily_path(log_date: str, vault: Path | None = None) -> Path:
    base = vault or root()
    year, month, _ = log_date.split("-")
    return base / "PKM" / "Journal" / year / month / f"{log_date}-voedingslogboek.md"


def source_id(source_type: str, source: str) -> str:
    return hashlib.sha256(f"{source_type}\0{source}".encode()).hexdigest()[:20]


def _template(log_date: str) -> str:
    return f"""---
date: {log_date}
type: food-log
key_element: gezondheid
goal: gewicht-aanpakken
day_complete: unknown
confirmed_at:
tags: [voeding, tracking]
---

# Voedingslogboek — {log_date}

## Meals

<!-- FOOD_ENTRIES -->

## Completion audit

<!-- FOOD_AUDITS -->
"""


def _atomic_write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def parse(path: Path) -> dict:
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    entries = [json.loads(m.group(1)) for m in ENTRY_RE.finditer(text)]
    audits = [json.loads(m.group(1)) for m in AUDIT_RE.finditer(text)]
    superseded = {e.get("supersedes_entry_id") for e in entries if e.get("supersedes_entry_id")}
    active = [e for e in entries if e["entry_id"] not in superseded]
    return {"text": text, "entries": entries, "active": active, "audits": audits,
            "latest_audit": audits[-1] if audits else None}


def _validate_range(name: str, value) -> list[float]:
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError(f"{name} must be [min,max]")
    low, high = map(float, value)
    if low < 0 or high < low:
        raise ValueError(f"invalid {name}")
    return [low, high]


def append_meal(payload: dict, vault: Path | None = None) -> Path:
    required = {"log_date", "logged_at", "meal_type", "description", "source_type", "source_id"}
    missing = required - payload.keys()
    if missing:
        raise ValueError(f"missing fields: {', '.join(sorted(missing))}")
    if payload["meal_type"] not in MEAL_TYPES:
        raise ValueError("meal_type must be breakfast, lunch, dinner, or snack")
    for key in ("kcal", "protein_g", "carbs_g", "fat_g"):
        payload[key] = _validate_range(key, payload[key])
    payload.setdefault("confidence", "medium")
    payload.setdefault("photo_path", None)
    payload.setdefault("supersedes_entry_id", None)
    payload.setdefault("entry_id", source_id(payload["source_type"], payload["source_id"]))
    path = daily_path(payload["log_date"], vault)
    state = parse(path)
    if any(e.get("source_id") == payload["source_id"] for e in state["entries"]):
        return path
    text = state["text"] or _template(payload["log_date"])
    label = {"breakfast":"Ontbijt","lunch":"Lunch","dinner":"Avondeten","snack":"Tussendoor"}[payload["meal_type"]]
    human = (f"\n### {payload['logged_at'][11:16]} — {label}\n"
             f"- {payload['description']}\n"
             f"- Energie: {payload['kcal'][0]:g}–{payload['kcal'][1]:g} kcal\n"
             f"- Eiwit: {payload['protein_g'][0]:g}–{payload['protein_g'][1]:g} g\n"
             f"- Koolhydraten: {payload['carbs_g'][0]:g}–{payload['carbs_g'][1]:g} g\n"
             f"- Vet: {payload['fat_g'][0]:g}–{payload['fat_g'][1]:g} g\n"
             f"- Betrouwbaarheid: {payload['confidence']}\n")
    if payload.get("photo_path"):
        human += f"- Foto: ![[{payload['photo_path']}]]\n"
    machine = "<!-- FOOD_ENTRY " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + " -->\n"
    text = text.replace("<!-- FOOD_ENTRIES -->", human + machine + "\n<!-- FOOD_ENTRIES -->")
    _atomic_write(path, text)
    return path


def append_audit(log_date: str, complete: bool, confirmed_at: str | None = None,
                 vault: Path | None = None) -> Path:
    path = daily_path(log_date, vault)
    state = parse(path)
    text = state["text"] or _template(log_date)
    stamp = confirmed_at or datetime.now().astimezone().isoformat(timespec="seconds")
    audit = {"confirmed_at": stamp, "complete": bool(complete), "source": "close-session"}
    machine = "<!-- FOOD_AUDIT " + json.dumps(audit, separators=(",", ":")) + " -->"
    text = text.replace("<!-- FOOD_AUDITS -->", f"- {stamp} — complete: {'yes' if complete else 'no'} — source: close-session\n{machine}\n\n<!-- FOOD_AUDITS -->")
    text = re.sub(r"(?m)^day_complete:.*$", f"day_complete: {'true' if complete else 'false'}", text, count=1)
    text = re.sub(r"(?m)^confirmed_at:.*$", f"confirmed_at: {stamp}", text, count=1)
    _atomic_write(path, text)
    return path


def main() -> None:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    meal = sub.add_parser("append-meal"); meal.add_argument("json_file")
    audit = sub.add_parser("audit"); audit.add_argument("date"); audit.add_argument("complete", choices=["yes", "no"])
    show = sub.add_parser("show"); show.add_argument("date")
    args = parser.parse_args()
    if args.command == "append-meal":
        print(append_meal(json.loads(Path(args.json_file).read_text(encoding="utf-8"))))
    elif args.command == "audit":
        print(append_audit(args.date, args.complete == "yes"))
    else:
        print(json.dumps(parse(daily_path(args.date)), ensure_ascii=False, default=str, indent=2))


if __name__ == "__main__":
    main()
