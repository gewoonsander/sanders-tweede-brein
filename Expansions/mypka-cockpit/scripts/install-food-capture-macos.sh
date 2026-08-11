#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/nl.gewoonsander.food-capture.plist"
if [[ "${1:-}" != "--install" ]]; then
  echo "Dry run: primary host must be the Mac mini. Re-run with --install there."
  exit 0
fi
case "$(hostname | tr '[:upper:]' '[:lower:]')" in *mini*) ;; *) echo "Refusing: this is not the Mac mini" >&2; exit 2;; esac
[[ -n "${ANTHROPIC_API_KEY:-}" || -f "$HOME/.config/gewoonsander/env" ]] || { echo "Missing protected API environment" >&2; exit 3; }
mkdir -p "$HOME/Library/LaunchAgents"
sed "s|__ROOT__|$ROOT|g" "$ROOT/Expansions/mypka-cockpit/launchd/nl.gewoonsander.food-capture.plist.template" > "$PLIST"
plutil -lint "$PLIST"
launchctl bootout "gui/$UID/nl.gewoonsander.food-capture" 2>/dev/null || true
launchctl bootstrap "gui/$UID" "$PLIST"
echo "Installed nl.gewoonsander.food-capture on $(hostname)"
