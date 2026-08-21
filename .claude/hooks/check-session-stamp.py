#!/usr/bin/env python3
"""Stop hook: implementeert het sessiestart-ritueel mechanisch.

Blokkeert bij de EERSTE echte gebruikersbeurt van een sessie als het
assistant-antwoord niet begint met de stempelregel (datum, tijd, onderwerp)
EN geen `set_session_title`-tool-aanroep bevat. Zie:
  .claude/memory/feedback_sessiestempel_bij_sessiestart.md
  .claude/memory/feedback_sessietitel_formaat.md

Zusje van check-lettered-options.py (GL-013) — zelfde stdin-contract, zelfde
"decision: block"-mechaniek.
"""
import json
import re
import sys


def load_entries(transcript_path):
    try:
        with open(transcript_path) as f:
            lines = f.readlines()
    except OSError:
        return []
    entries = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            entries.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return entries


def is_genuine_user_text(entry):
    """A real human turn, not a tool_result echo (also type=='user')."""
    if entry.get("type") != "user":
        return False
    content = entry.get("message", {}).get("content", [])
    if isinstance(content, str):
        return bool(content.strip())
    if isinstance(content, list):
        return any(
            isinstance(c, dict) and c.get("type") == "text" and c.get("text", "").strip()
            for c in content
        )
    return False


def last_assistant_entry(entries):
    for entry in reversed(entries):
        if entry.get("type") == "assistant":
            return entry
    return None


def assistant_text(entry):
    content = entry.get("message", {}).get("content", [])
    if isinstance(content, str):
        return content
    texts = [c.get("text", "") for c in content if isinstance(c, dict) and c.get("type") == "text"]
    return "\n".join(texts)


def has_set_session_title_call(entries):
    for entry in entries:
        if entry.get("type") != "assistant":
            continue
        content = entry.get("message", {}).get("content", [])
        if not isinstance(content, list):
            continue
        for c in content:
            if (
                isinstance(c, dict)
                and c.get("type") == "tool_use"
                and str(c.get("name", "")).endswith("set_session_title")
            ):
                return True
    return False


# "**18 augustus 2026, 09:12 — Sessietitels hernoemen**" — bold, dag maand jaar,
# komma, uu:mm, em-dash of gewoon streepje, onderwerp, bold sluit af.
STAMP_RE = re.compile(r"^\*\*\d{1,2} \w+ \d{4},\s*\d{1,2}:\d{2}\s*[—-]\s*\S.*\*\*")


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        return

    transcript_path = data.get("transcript_path")
    if not transcript_path:
        return

    entries = load_entries(transcript_path)
    if not entries:
        return

    # Alleen de EERSTE echte beurt van de sessie wordt gecontroleerd.
    genuine_user_turns = sum(1 for e in entries if is_genuine_user_text(e))
    if genuine_user_turns != 1:
        return

    last = last_assistant_entry(entries)
    if last is None:
        return
    text = assistant_text(last).lstrip()

    has_stamp = bool(STAMP_RE.match(text))
    has_title_call = has_set_session_title_call(entries)

    if has_stamp and has_title_call:
        return

    missing = []
    if not has_stamp:
        missing.append("de stempelregel bovenaan (datum, tijd, onderwerp)")
    if not has_title_call:
        missing.append("de set_session_title-tool-aanroep")

    print(json.dumps({
        "decision": "block",
        "reason": (
            "Sessiestart-ritueel niet compleet bij de eerste reply — ontbreekt nog: "
            + " en ".join(missing)
            + ". Zie feedback_sessiestempel_bij_sessiestart.md en "
              "feedback_sessietitel_formaat.md."
        ),
    }))


if __name__ == "__main__":
    main()
