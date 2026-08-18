#!/bin/bash
# Installs (or re-deploys) the food-capture pipeline on the primary host.
#
# The vault stays the source of truth: edit the scripts in
# Expansions/mypka-cockpit/scripts/ as usual, then re-run this with --install to
# push the change live. The RUNNING copy lives outside the vault on purpose —
# see the comment block in the plist template for the iCloud open() wedge that
# cost two days of silent downtime on 2026-08-18.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/nl.gewoonsander.food-capture.plist"
RUNTIME="$HOME/Library/Application Support/gewoonsander/food-capture"

# Everything the watcher reaches at runtime. watch-food-inbox.py shells out to
# process-food-capture.py as a sibling, which imports food_log.py, which in turn
# runs regen-mypka-db.py as a sibling. Miss one and the chain breaks at the
# point furthest from the error message, so they deploy together.
FILES=(watch-food-inbox.py process-food-capture.py food_log.py regen-mypka-db.py)

if [[ "${1:-}" != "--install" ]]; then
  echo "Dry run: primary host must be the Mac mini. Re-run with --install there."
  echo "  vault:   $ROOT"
  echo "  runtime: $RUNTIME"
  exit 0
fi
case "$(hostname | tr '[:upper:]' '[:lower:]')" in *mini*) ;; *) echo "Refusing: this is not the Mac mini" >&2; exit 2;; esac
[[ -n "${ANTHROPIC_API_KEY:-}" || -f "$HOME/.config/gewoonsander/env" ]] || { echo "Missing protected API environment" >&2; exit 3; }

# Pin the interpreter at install time. Leaving it to PATH is how you end up with
# a login shell that resolves to a python without PyYAML — the mirror then fails
# quietly while the markdown keeps looking fine.
PYTHON="$(/bin/zsh -lc 'command -v python3')"
[[ -x "$PYTHON" ]] || { echo "No usable python3 found" >&2; exit 4; }
"$PYTHON" -c 'import yaml' 2>/dev/null || echo "Warning: $PYTHON has no PyYAML — the mirror regen will degrade to a warning" >&2

mkdir -p "$RUNTIME" "$HOME/Library/LaunchAgents"
for f in "${FILES[@]}"; do
  cp "$ROOT/Expansions/mypka-cockpit/scripts/$f" "$RUNTIME/$f"
done
chmod +x "$RUNTIME/watch-food-inbox.py"

sed -e "s|__ROOT__|$ROOT|g" -e "s|__RUNTIME__|$RUNTIME|g" -e "s|__PYTHON__|$PYTHON|g" \
  "$ROOT/Expansions/mypka-cockpit/launchd/nl.gewoonsander.food-capture.plist.template" > "$PLIST"
plutil -lint "$PLIST"

launchctl bootout "gui/$UID/nl.gewoonsander.food-capture" 2>/dev/null || true
launchctl bootstrap "gui/$UID" "$PLIST"
echo "Installed nl.gewoonsander.food-capture on $(hostname)"
echo "  runtime:     $RUNTIME"
echo "  interpreter: $PYTHON"
echo "  vault:       $ROOT"
