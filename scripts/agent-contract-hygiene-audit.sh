#!/bin/bash
# agent-contract-hygiene-audit.sh
#
# Onbemande kwartaal-routine (LaunchAgent nl.gewoonsander.agent-contract-hygiene-audit,
# 21 jan/apr/jul/okt 09:00 lokaal). Roept de Claude Code CLI headless aan met
# scripts/agent-contract-hygiene-audit.prompt.md om SOP-025 uit te voeren.
#
# Lokale LaunchAgent i.p.v. een Anthropic-cloud scheduled task — zie
# Team Knowledge/Guidelines/GL-005-llm-agnostic-portable-core.md Rule 5. Zelfde
# TCC-workaround als adc-verslag-ochtend.sh: bash i.p.v. node, app-bundle-pad i.p.v. losse
# claude-binary. Volledige uitleg in scripts/lib/launchd-guard.sh.

set -uo pipefail

REPO="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
PROMPT="$REPO/scripts/agent-contract-hygiene-audit.prompt.md"
MAX_RUNTIME="${AUDIT_MAX_RUNTIME:-1200}"

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

source "$REPO/scripts/lib/launchd-guard.sh"
guard_init "agent-contract-hygiene-audit"

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
