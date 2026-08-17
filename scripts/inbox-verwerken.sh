#!/bin/bash
# inbox-verwerken.sh
#
# Wekelijkse inboxronde (LaunchAgent nl.gewoonsander.inbox-verwerken, vrijdag 08:00).
# Roept de Claude Code CLI headless aan met scripts/inbox-verwerken.prompt.md, die de
# drie inboxen uit SOP-013 doorloopt.
#
# Vervangt scripts/inbox-verwerken.mjs. Die node-wrapper kon onder launchd niet meer
# werken: node krijgt daar geen TCC-toegang tot ~/Documents en blijft oneindig hangen in
# plaats van te falen. De volledige uitleg staat op één plek: scripts/lib/launchd-guard.sh.

set -uo pipefail

REPO="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
PROMPT="$REPO/scripts/inbox-verwerken.prompt.md"
# Ruimer dan ADC: deze ronde loopt drie inboxen langs. Blijft onder de ExitTimeOut van
# de LaunchAgent, zodat dit script zelf nog zijn slotregel kan loggen.
MAX_RUNTIME="${INBOX_MAX_RUNTIME:-2700}"

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

source "$REPO/scripts/lib/launchd-guard.sh"
guard_init "inbox-verwerken"

guard_log "start"

CLAUDE="$(guard_claude_bin)" || exit 78
guard_log "claude-binary: $CLAUDE"

guard_repo_readable "$REPO" || exit 77
[[ -r "$PROMPT" ]] || { guard_log "FOUT: promptbestand $PROMPT niet leesbaar."; exit 78; }
cd "$REPO" || { guard_log "FOUT: cd naar $REPO mislukt."; exit 78; }

guard_run "$MAX_RUNTIME" "$CLAUDE" -p "$(cat "$PROMPT")" \
  --allowedTools "Bash Read Write Edit Glob Grep" \
  --dangerously-skip-permissions
RC=$?

if [[ $RC -eq 0 ]]; then
  guard_log "klaar (exit 0)"
else
  guard_log "klaar met FOUT (exit $RC) — zie regels hierboven"
fi
exit $RC
