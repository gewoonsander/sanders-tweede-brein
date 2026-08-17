#!/bin/bash
# adc-verslag-ochtend.sh
#
# Onbemande ADC Regio Oost ochtendroutine (LaunchAgent nl.gewoonsander.adc-verslag-ochtend,
# dagelijks 07:00 lokaal). Roept de Claude Code CLI headless aan met
# scripts/adc-verslag-ochtend.prompt.md.
#
# Deze routine liep op 12, 13 en 17 augustus 2026 stil vast. De oorzaak was NIET
# dartsatlas/Cloudflare/curl (curl haalt alle benodigde pagina's gewoon op), maar macOS TCC
# in combinatie met de auto-updatende Claude CLI. De volledige uitleg staat op één plek:
# scripts/lib/launchd-guard.sh. Vandaar bash in plaats van node, en het app-bundle-pad in
# plaats van ~/.local/bin/claude.

set -uo pipefail

REPO="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
PROMPT="$REPO/scripts/adc-verslag-ochtend.prompt.md"
MAX_RUNTIME="${ADC_MAX_RUNTIME:-1800}"

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

source "$REPO/scripts/lib/launchd-guard.sh"
guard_init "adc-verslag-ochtend"

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
