#!/usr/bin/env python3
"""Normalize photo/audio/text food captures and append them to the canonical log."""
from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from food_log import append_meal, source_id


def category(text: str, hour: int) -> str | None:
    value = text.lower()
    aliases = {"breakfast": ("ontbijt", "breakfast"), "lunch": ("lunch",),
               "dinner": ("avondeten", "diner", "dinner"),
               "snack": ("tussendoor", "tussendoortje", "snack")}
    for key, words in aliases.items():
        if any(word in value for word in words): return key
    if 5 <= hour < 11: return "breakfast"
    if 11 <= hour < 15: return "lunch"
    if 17 <= hour < 22: return "dinner"
    return "snack"


def anthropic_call(content: list) -> dict:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key: raise RuntimeError("ANTHROPIC_API_KEY ontbreekt")
    prompt = """Bepaal eerst of dit over werkelijk gegeten eten of drinken gaat. Antwoord uitsluitend met JSON met keys:
is_food (boolean), description, meal_type (breakfast|lunch|dinner|snack|null), kcal [min,max],
protein_g [min,max], carbs_g [min,max], fat_g [min,max], confidence (low|medium|high).
Alle voedingswaarden moeten realistische bandbreedtes zijn. Geen exact schijngetal."""
    body = {"model":"claude-sonnet-4-5","max_tokens":900,"messages":[{"role":"user","content":content + [{"type":"text","text":prompt}]}]}
    req = urllib.request.Request("https://api.anthropic.com/v1/messages",
        data=json.dumps(body).encode(), headers={"content-type":"application/json",
        "x-api-key":key,"anthropic-version":"2023-06-01"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as response:
        result = json.load(response)
    text = result["content"][0]["text"].strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(text)

def anthropic_photo(path: Path, context: str) -> dict:
    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    content = [{"type":"image","source":{"type":"base64","media_type":mime,"data":base64.b64encode(path.read_bytes()).decode()}}]
    if context: content.append({"type":"text","text":"Context: "+context})
    return anthropic_call(content)

def anthropic_text(text: str) -> dict:
    return anthropic_call([{"type":"text","text":"Registratie van Sander: "+text}])


def normalize(args) -> dict:
    stamp = datetime.fromisoformat(args.logged_at) if args.logged_at else datetime.now().astimezone()
    raw_source = args.source_id or (str(args.photo) if args.photo else args.text)
    if args.analysis_json:
        analysis = json.loads(Path(args.analysis_json).read_text(encoding="utf-8"))
    elif args.photo:
        analysis = anthropic_photo(Path(args.photo), args.text or "")
    else:
        analysis = anthropic_text(args.text)
    if analysis.get("is_food") is False:
        raise ValueError("capture is geen voedingsregistratie")
    meal_type = args.meal_type or analysis.get("meal_type") or category(args.text or "", stamp.hour)
    if meal_type not in {"breakfast","lunch","dinner","snack"}:
        raise ValueError("Maaltijdcategorie kon niet betrouwbaar worden bepaald")
    return {"log_date":stamp.date().isoformat(),"logged_at":stamp.isoformat(timespec="seconds"),
        "meal_type":meal_type,"description":analysis["description"],"source_type":args.source_type,
        "source_id":source_id(args.source_type, raw_source),"kcal":analysis["kcal"],
        "protein_g":analysis["protein_g"],"carbs_g":analysis["carbs_g"],
        "fat_g":analysis["fat_g"],"confidence":analysis.get("confidence","medium"),
        "photo_path":args.photo_path}


def main():
    p = argparse.ArgumentParser(); p.add_argument("--source-type", choices=["photo","audio","text"], required=True)
    p.add_argument("--photo", type=Path); p.add_argument("--photo-path"); p.add_argument("--text", default="")
    p.add_argument("--analysis-json", type=Path); p.add_argument("--meal-type"); p.add_argument("--logged-at")
    p.add_argument("--source-id"); p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(); payload = normalize(args)
    if args.dry_run: print(json.dumps(payload, ensure_ascii=False, indent=2))
    else: print(append_meal(payload))


if __name__ == "__main__": main()
