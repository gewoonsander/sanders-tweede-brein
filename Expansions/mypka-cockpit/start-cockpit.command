#!/bin/bash
# myPKA Cockpit 1.5.3 local launcher for macOS. Generated on this machine.
set -euo pipefail

PORT="${PORT:-4317}"
COCKPIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$COCKPIT_DIR"

if [ -n "${MYPKA_ROOT:-}" ]; then
  DB_PATH="$MYPKA_ROOT/mypka.db"
else
  DB_PATH="$(cd "$COCKPIT_DIR/../.." && pwd)/mypka.db"
fi

db_has_core() {
  python3 - "$DB_PATH" <<'PY' 2>/dev/null
import os, sqlite3, sys
p = sys.argv[1]
if not os.path.isfile(p): sys.exit(1)
try:
    c = sqlite3.connect(f"file:{p}?mode=ro", uri=True)
    sys.exit(0 if c.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='journal'"
    ).fetchone() else 1)
except sqlite3.Error:
    sys.exit(1)
PY
}

if db_has_core; then
  if command -v python3 >/dev/null 2>&1 && python3 -c "import yaml" >/dev/null 2>&1; then
    echo "Refreshing mypka.db from Markdown (non-destructive)…"
    python3 "scripts/regen-mypka-db.py" || echo "  (refresh failed — using existing mypka.db)"
  else
    echo "Python 3 + PyYAML missing — using existing mypka.db without refresh."
  fi
else
  echo "No usable mypka.db yet — creating the core schema and Cockpit modules…"
  if ! command -v python3 >/dev/null 2>&1 || ! python3 -c "import yaml" >/dev/null 2>&1; then
    echo "Python 3 + PyYAML are required for first-time setup."
    echo "Install PyYAML with: pip3 install --user pyyaml"
    echo "Press any key to close."; read -r -n 1 _ || true
    exit 1
  fi
  if ! python3 "sqlite-extension/install-extensions.py" "$DB_PATH" --all; then
    echo "Could not create mypka.db. Fix the reported error and run this launcher again."
    echo "Press any key to close."; read -r -n 1 _ || true
    exit 1
  fi
fi

[ -d node_modules ] || { echo "Installing server dependencies…"; npm install --no-audit --no-fund; }
[ -d web/node_modules ] || { echo "Installing web dependencies…"; npm --prefix web install --no-audit --no-fund; }
[ -d web/dist ] || { echo "Building the web app…"; npm --prefix web run build; }

if lsof -ti "tcp:$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is occupied — stopping the previous Cockpit instance…"
  lsof -ti "tcp:$PORT" | xargs kill 2>/dev/null || true
  sleep 1
fi

open "http://127.0.0.1:$PORT/" || true
echo "Starting the Cockpit on http://127.0.0.1:$PORT/ — close this window to stop it."
NODE_ENV=production PORT="$PORT" WORKBENCH_WRITE_ENABLED=1 PLAN_WRITE_ENABLED=1 exec node server/server.js
