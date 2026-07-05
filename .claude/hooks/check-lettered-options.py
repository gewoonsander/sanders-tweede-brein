#!/usr/bin/env python3
"""Stop hook: implementeert GL-013 mechanisch.

Blokkeert als het laatste assistant-bericht eindigt in een vraagteken zonder
geletterde opties (**A**/**B**/**C**/**D**). Zie
Team Knowledge/Guidelines/GL-013-interactie-enkelvoudige-keuzes.md.
"""
import json
import re
import sys


def last_assistant_text(transcript_path):
    try:
        with open(transcript_path) as f:
            lines = f.readlines()
    except OSError:
        return None

    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("type") != "assistant":
            continue
        content = obj.get("message", {}).get("content", [])
        if isinstance(content, str):
            texts = [content]
        else:
            texts = [
                c.get("text", "")
                for c in content
                if isinstance(c, dict) and c.get("type") == "text"
            ]
        if any(t.strip() for t in texts):
            return "\n".join(texts)
    return None


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        return

    transcript_path = data.get("transcript_path")
    if not transcript_path:
        return

    text = last_assistant_text(transcript_path)
    if text is None:
        return

    ends_in_question = text.rstrip().endswith("?")
    has_lettered_options = bool(re.search(r"\*\*[A-D]\*\*", text))
    is_marked_open = bool(re.search(r"\(open vraag\)", text, re.IGNORECASE))

    if ends_in_question and not has_lettered_options and not is_marked_open:
        print(json.dumps({
            "decision": "block",
            "reason": (
                "GL-013: bericht eindigt in een vraag zonder geletterde "
                "opties (**A**/**B**/**C**). Herschrijf met lettered "
                "options, of leg uit waarom dit een open informatievraag "
                "is zonder eindig antwoordbereik."
            ),
        }))


if __name__ == "__main__":
    main()
