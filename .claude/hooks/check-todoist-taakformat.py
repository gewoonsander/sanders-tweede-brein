#!/usr/bin/env python3
"""PreToolUse hook: implementeert GL-014 mechanisch voor Todoist-taken.

Bij taakaanmaak (add-tasks) blokkeert dit een aanroep als een taak niet
voldoet aan het verplichte formaat uit
Team Knowledge/Guidelines/GL-014-todoist-taakformat.md:

- Titel: "{actie} > {titel} ⏰ {tijdsinschatting}"
- Prioriteit: expliciet ingevuld (p1-p4), nooit stilzwijgend de default
- Precies één persoons-label
- Een verplichte einddatum (dueString of deadlineDate)

Bij taakwijziging (update-tasks) is de controle lichter: alleen de velden die
de update zelf aanraakt worden getoetst (raakt hij `content` aan, dan moet het
resultaat het titelformaat halen; raakt hij `labels` aan, dan moet er precies
één persoons-label overblijven). Prioriteit en einddatum worden bij een update
niet afgedwongen — die mogen ongewijzigd blijven.

2026-08-12: eerder zonder matcher geregistreerd (vuurde op ELKE tool-aanroep).
Tijdens een gelijktijdige sessie werd dit bestand kort onbereikbaar (concurrent
file-sync), waardoor python3 het script niet kon vinden en de hele sessie
vastliep — elke tool (Read/Bash/Skill) werd geblokkeerd, niet alleen Todoist.
Nu met matcher in settings.json beperkt tot Todoist add-tasks/update-tasks-
aanroepen, zodat eenzelfde storing voortaan alleen taakbeheer raakt, niet de
hele sessie.

2026-08-21: update-tasks toegevoegd nadat een GL-017-security-audit (Argus)
vaststelde dat een update het titelformaat of het persoons-label stilzwijgend
kon slopen zonder enige controle — zie de todoist-connector-entry in GL-017.
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


def is_update_tasks(tool_name: str) -> bool:
    # Same reasoning as is_add_tasks: match on suffix, not on "todoist" in the name.
    return bool(tool_name) and tool_name.startswith("mcp__") and tool_name.endswith("__update-tasks")


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


def check_task_update(task: dict) -> list:
    # Lichter dan check_task: alleen de velden die de update zelf aanraakt
    # worden getoetst. Prioriteit en einddatum zijn bij een update optioneel
    # (ontbreken betekent "ongewijzigd"), dus die worden hier niet afgedwongen.
    problems = []
    if "content" in task:
        content = task.get("content") or ""
        if not TITLE_RE.match(content):
            problems.append(
                f'nieuwe titel "{content}" mist het verplichte format '
                '"{actie} > {titel} ⏰ {tijdsinschatting}"'
            )
    if "labels" in task:
        labels = task.get("labels") or []
        # update-tasks vervangt bij het meesturen van labels ALLE bestaande
        # labels (zie de tool-beschrijving) — dus dezelfde eis als bij aanmaak:
        # precies één persoons-label moet overblijven, niet nul en niet meer.
        if len(labels) != 1:
            problems.append(
                f"labels-update laat {len(labels)} label(s) over — verplicht is "
                "precies één persoons-label (bijv. sander/marieke/thomas)"
            )
    return problems


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        return

    tool_name = data.get("tool_name", "")
    if is_add_tasks(tool_name):
        mode = "add"
    elif is_update_tasks(tool_name):
        mode = "update"
    else:
        return

    tool_input = data.get("tool_input", {})
    tasks = tool_input.get("tasks", [])
    if not isinstance(tasks, list):
        return

    all_problems = []
    for i, task in enumerate(tasks):
        if not isinstance(task, dict):
            continue
        problems = check_task(task) if mode == "add" else check_task_update(task)
        if problems:
            label = task.get("content", f"taak {i + 1}")
            all_problems.append(f'- "{label}": ' + "; ".join(problems))

    if all_problems:
        if mode == "add":
            reason = (
                "GL-014: de volgende Todoist-taak/taken voldoen niet aan het "
                "verplichte format (titel, prioriteit, persoons-label, "
                "einddatum zijn allemaal verplicht bij aanmaak):\n"
                + "\n".join(all_problems)
                + "\n\nVul de ontbrekende velden aan en probeer opnieuw."
            )
        else:
            reason = (
                "GL-014: de volgende Todoist-taakupdate(s) breken het "
                "verplichte format op de velden die ze zelf aanraken:\n"
                + "\n".join(all_problems)
                + "\n\nPas de update aan en probeer opnieuw."
            )
        sys.stderr.write(reason + "\n")
        sys.exit(2)


if __name__ == "__main__":
    main()
