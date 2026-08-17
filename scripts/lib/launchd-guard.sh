#!/bin/bash
# launchd-guard.sh — gedeelde helpers voor onbemande LaunchAgent-routines op de Mac mini.
#
# ACHTERGROND (root cause 2026-08-17, Daedalus)
# LaunchAgents hebben op deze Mac geen TCC-toegang tot ~/Documents. Dat pakt per binary
# anders uit:
#
#   * Apple-gesigneerde binaries (/bin/bash, /bin/ls, /usr/bin/head, /usr/bin/python3)
#     werken WEL zolang het topproces van de job /bin/bash is — bash staat in Volledige
#     Schijftoegang en kindprocessen erven die verantwoordelijkheid.
#   * Binaries van derden (Homebrew node, Homebrew python3, de losse claude-versiebinary)
#     krijgen géén nette foutmelding maar een toestemmingsdialoog, en BLOKKEREN oneindig
#     zolang niemand die wegklikt. Gemeten: node onder launchd hangt onbeperkt op een
#     readdir van de repo; alleen een SIGKILL maakt er een eind aan.
#   * De Claude Code CLI werkt zichzelf bij. Elke versie staat op een nieuw pad
#     (~/.local/share/claude/versions/<versie>) en is voor TCC dus een nieuwe client
#     zonder rechten. Het app-bundle-pad daarentegen heeft een stabiele, door Anthropic
#     gesigneerde identiteit (com.anthropic.claude-code) mét Volledige Schijftoegang,
#     en die grant overleeft auto-updates.
#
# Een oneindig hangend proces houdt bovendien de launchd-job "running". launchd start
# geen tweede instantie, dus elk volgend gepland interval wordt stilzwijgend overgeslagen
# — daardoor sleept één hang dagen aan gemiste runs mee. Vandaar dat elke routine hier
# een harde tijdslimiet krijgt: liever een luide fout dan stilte.
#
# Gebruik:
#   source "$(dirname "$0")/lib/launchd-guard.sh"
#   guard_init "mijn-routine"
#   CLAUDE="$(guard_claude_bin)" || exit 78
#   guard_repo_readable "$REPO" || exit 77
#   guard_run 1800 "$CLAUDE" -p "$PROMPT" --dangerously-skip-permissions

GUARD_TAG="${GUARD_TAG:-launchd-guard}"

guard_init() { GUARD_TAG="$1"; }

guard_log() { echo "[$GUARD_TAG] $(date '+%Y-%m-%dT%H:%M:%S%z') $*"; }

# Echoot het te gebruiken claude-pad. Bundle eerst (TCC-stabiel), losse binary als
# noodgreep. Retourneert 1 als er niets bruikbaars is.
guard_claude_bin() {
  local bundle="$HOME/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude"
  local fallback="${CLAUDE_BIN:-$HOME/.local/bin/claude}"
  if [[ -x "$bundle" ]]; then
    echo "$bundle"; return 0
  fi
  if [[ -x "$fallback" ]]; then
    guard_log "WAARSCHUWING: app-bundle ontbreekt, val terug op $fallback — onder launchd hangt dat pad waarschijnlijk op een TCC-dialoog."
    echo "$fallback"; return 0
  fi
  guard_log "FOUT: geen claude-binary gevonden (noch $bundle noch $fallback)."
  return 1
}

# Controleert of de repo leesbaar is. Gebruikt /bin/ls omdat een Apple-gesigneerde binary
# onder een TCC-blokkade meteen EPERM geeft in plaats van te blijven hangen.
guard_repo_readable() {
  local repo="$1"
  if /bin/ls "$repo" >/dev/null 2>&1; then
    return 0
  fi
  guard_log "FOUT: kan $repo niet lezen (waarschijnlijk TCC/Volledige Schijftoegang ontbreekt voor deze LaunchAgent)."
  return 1
}

# guard_run <seconden> <commando...>
# Draait het commando met stdin op /dev/null en een harde tijdslimiet. Bij overschrijding
# eerst SIGTERM, daarna SIGKILL. Retourcode is die van het commando (137 = gekilld).
guard_run() {
  local secs="$1"; shift
  "$@" </dev/null &
  local pid=$!
  ( sleep "$secs"
    if kill -0 "$pid" 2>/dev/null; then
      guard_log "TIMEOUT na ${secs}s — proces $pid wordt afgebroken (zie de TCC-uitleg boven in launchd-guard.sh)."
      kill -TERM "$pid" 2>/dev/null
      sleep 15
      kill -KILL "$pid" 2>/dev/null
    fi ) &
  local watchdog=$!
  wait "$pid"
  local rc=$?
  # watchdog én zijn sleep opruimen, anders houdt die de launchd-job onnodig in leven
  pkill -P "$watchdog" 2>/dev/null
  kill "$watchdog" 2>/dev/null
  wait "$watchdog" 2>/dev/null
  return $rc
}
