#!/usr/bin/env python3
"""Vraag Perplexity's Sonar API een gegronde, geciteerde vraag - het tweede,
onafhankelijke zoekpad voor Athena's dual-independent-search escalatie
(zie Team/Athena - Researcher/AGENTS.md, Stap 3).

Gebruik:
    python3 perplexity_search.py "vraag hier"
    python3 perplexity_search.py "vraag hier" --model sonar-pro

Sleutel komt uit Team Knowledge/.env (PERPLEXITY_API_KEY) - nooit los in code of
chat laten staan. Geen output betekent geen credits verbruikt; het script faalt
netjes (leeg resultaat + foutmelding op stderr) als de sleutel ontbreekt of de
call mislukt, in plaats van te crashen.
"""
from __future__ import annotations
import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ENV_FILE = SCRIPT_DIR.parent / ".env"


def load_env_key(name: str) -> str | None:
    """Leest een sleutel uit Team Knowledge/.env zonder het hele bestand te exporteren
    naar de omgeving (voorkomt dat andere sleutels per ongeluk meelekken naar subprocessen)."""
    if not ENV_FILE.exists():
        return None
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        if key.strip() == name:
            return value.strip()
    return None


def ask_perplexity(query: str, model: str, api_key: str) -> dict:
    data = json.dumps(
        {
            "model": model,
            "messages": [{"role": "user", "content": query}],
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.perplexity.ai/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def main() -> int:
    ap = argparse.ArgumentParser(description="Vraag Perplexity's Sonar API (gegrond, met citaties).")
    ap.add_argument("query", help="De vraag om te stellen")
    ap.add_argument("--model", default="sonar-pro", choices=["sonar", "sonar-pro"],
                     help="sonar (goedkoper) of sonar-pro (default, betere kwaliteit)")
    args = ap.parse_args()

    api_key = os.environ.get("PERPLEXITY_API_KEY") or load_env_key("PERPLEXITY_API_KEY")
    if not api_key:
        print("[FOUT] PERPLEXITY_API_KEY niet gevonden in Team Knowledge/.env", file=sys.stderr)
        return 1

    try:
        resp = ask_perplexity(args.query, args.model, api_key)
    except Exception as e:
        print(f"[FOUT] Perplexity-aanroep mislukt: {type(e).__name__}: {e}", file=sys.stderr)
        return 1

    try:
        answer = resp["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        print(f"[FOUT] Onverwacht antwoordformaat: {json.dumps(resp)[:500]}", file=sys.stderr)
        return 1

    citations = resp.get("citations", [])

    print(answer)
    if citations:
        print("\n--- Bronnen ---")
        for i, url in enumerate(citations, 1):
            print(f"[{i}] {url}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
