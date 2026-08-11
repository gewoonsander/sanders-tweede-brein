#!/usr/bin/env python3
"""PreToolUse hook: implementeert GL-014 mechanisch voor nieuwe Todoist-taken.

Blokkeert een Todoist add-tasks-aanroep als een taak niet voldoet aan het
verplichte formaat uit
Team Knowledge/Guidelines/GL-014-todoist-taakformat.md:

- Titel: "{actie} > {titel} ⏰ {tijdsinschatting}"
- Prioriteit: expliciet ingevuld (p1-p4), nooit stilzwijgend de default
- Precies één persoons-label
- Een verplichte einddatum (dueString of deadlineDate)

Geldt alleen voor taakaanmaak (add-tasks) — GL-014's verplichte velden zijn
expliciet "bij aanmaak", niet bij elke losse update.
"""
import json
import re
import sys

TITLE_RE = re.compile(r"^\S.*\s>\s.+⏰\s*\S.+$")
VALID_PRIORITIES = {"p1", "p2", "p3", "p4"}


def is_add_tasks(tool_name: str) -> bool:
    # "add-tasks" is a Todoist-specific MCP tool name. The connector can appear
    # under its friendly name (mcp__claude_ai_Todoist__add-tasks) or under its
    # raw connector UUID (mcp__038b67df-...__add-tasks) which does NOT contain
    # the word "todoist" — so match on the tool-name suffix alone.
    return bool(tool_name) and tool_name.startswith("mcp__") and tool_name.endswith("__add-tasks")


def check_task(task: dict) -> list:
    problems = []
    content = task.get("content", "")
    if not TITLE_RE.match(content):
        problems.append(
            f'titel "{content}" mist het verplichte format '
            '"{actie} > {titel} ⏰ {tijdsinschatting}"'
        )
    if task.get("priority") not in VALID_PRIORITIES:
        problems.append("geen expliciete prioriteit (p1-p4) ingevuld")
    labels = task.get("labels") or []
    if not labels:
        problems.append("geen persoons-label (bijv. sander/marieke/thomas) ingevuld")
    if not task.get("dueString") and not task.get("deadlineDate"):
        problems.append("geen einddatum (dueString/deadlineDate) ingevuld")
    return problems


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        return

    tool_name = data.get("tool_name", "")
    if not is_add_tasks(tool_name):
        return

    tool_input = data.get("tool_input", {})
    tasks = tool_input.get("tasks", [])
    if not isinstance(tasks, list):
        return

    all_problems = []
    for i, task in enumerate(tasks):
        if not isinstance(task, dict):
            continue
        problems = check_task(task)
        if problems:
            label = task.get("content", f"taak {i + 1}")
            all_problems.append(f'- "{label}": ' + "; ".join(problems))

    if all_problems:
        reason = (
            "GL-014: de volgende Todoist-taak/taken voldoen niet aan het "
            "verplichte format (titel, prioriteit, persoons-label, "
            "einddatum zijn allemaal verplicht bij aanmaak):\n"
            + "\n".join(all_problems)
            + "\n\nVul de ontbrekende velden aan en probeer opnieuw."
        )
        sys.stderr.write(reason + "\n")
        sys.exit(2)


if __name__ == "__main__":
    main()
