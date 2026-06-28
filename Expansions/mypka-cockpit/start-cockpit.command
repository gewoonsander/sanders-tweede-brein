#!/bin/bash
# start-cockpit.command — myPKA Cockpit launcher (macOS). Double-click to run.
# Generated locally from launcher/templates/macos.command.txt — review before use.
set -euo pipefail

# --- config -------------------------------------------------------------------
PORT="${PORT:-4317}"

# --- 1. resolve the cockpit dir and cd into it --------------------------------
COCKPIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$COCKPIT_DIR"

DB_PATH="$(cd "$COCKPIT_DIR/../.." && pwd)/mypka.db"

# --- 2. ensure mypka.db exists ------------------------------------------------
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
    echo "Refreshing mypka.db from your markdown (non-destructive)…"
    python3 "scripts/regen-mypka-db.py" || echo "  (regen failed — using existing mypka.db)"
  else
    echo "Python 3 + PyYAML not found — skipping DB refresh (existing mypka.db will serve)."
  fi
else
  echo "No mypka.db yet — creating it (core schema + all cockpit modules)…"
  if ! command -v python3 >/dev/null 2>&1 || ! python3 -c "import yaml" >/dev/null 2>&1; then
    echo "Cannot create mypka.db: install Python 3 + pip3 install --user pyyaml"
    exit 1
  fi
  if ! python3 "sqlite-extension/install-extensions.py" "$DB_PATH" --all; then
    echo "Could not create mypka.db. Fix the issue, then re-run me."
    exit 1
  fi
fi

# --- 3. first-run install + build (skipped on later launches) -----------------
[ -d node_modules ]      || { echo "Installing server deps…"; npm install --no-audit --no-fund; }
[ -d web/node_modules ]  || { echo "Installing web deps…";    npm --prefix web install --no-audit --no-fund; }
[ -d web/dist ]          || { echo "Building the web app…";   npm --prefix web run build; }

# --- 4. free the port ---------------------------------------------------------
if lsof -ti "tcp:$PORT" >/dev/null 2>&1; then
  echo "Port $PORT busy — stopping the previous instance…"
  lsof -ti "tcp:$PORT" | xargs kill 2>/dev/null || true
  sleep 1
fi

# --- 5. open the browser ------------------------------------------------------
open "http://127.0.0.1:$PORT/" || true

# --- 6. start the server ------------------------------------------------------
echo "Starting the cockpit on http://127.0.0.1:$PORT/  (close this window to stop it)"
NODE_ENV=production PORT="$PORT" WORKBENCH_WRITE_ENABLED=1 PLAN_WRITE_ENABLED=1 exec /opt/homebrew/bin/node server/server.js
