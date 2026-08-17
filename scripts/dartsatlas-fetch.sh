#!/bin/bash
# dartsatlas-fetch.sh
#
# Bash-wrapper rond Expansions/mypka-cockpit/scripts/dartsatlas-fetch.mjs voor de
# LaunchAgent nl.gewoonsander.dartsatlas-fetch (wekelijks, maandag 08:00).
#
# LET OP — DEZE ROUTINE IS OP DIT MOMENT GEBLOKKEERD (2026-08-17, Daedalus)
# De onderliggende .mjs draait op Homebrew node, en node krijgt onder launchd geen
# TCC-toegang tot ~/Documents. In plaats van een nette foutmelding krijgt node een
# toestemmingsdialoog die niemand kan wegklikken, waardoor het proces oneindig blijft
# hangen. Gemeten op 17-08: node onder launchd hangt onbeperkt op een readdir van de repo
# en is alleen met SIGKILL te stoppen. Zie scripts/lib/launchd-guard.sh voor de volledige
# analyse.
#
# Anders dan bij de claude-CLI is hier GEEN omweg mogelijk: er bestaat geen Apple-
# gesigneerd of stabiel-gesigneerd alternatief pad naar dezelfde node-runtime. De enige
# echte oplossing is Volledige Schijftoegang geven aan node:
#
#   Systeeminstellingen > Privacy en beveiliging > Volledige schijftoegang > +
#   (Cmd+Shift+G) /opt/homebrew/Cellar/node/26.4.0/bin/node
#
# Tot dat gebeurd is doet deze wrapper precies één ding van waarde: hij zorgt dat de hang
# ZICHTBAAR en BEGRENSD is. Zonder wrapper hield het hangende node-proces de launchd-job
# "running", waardoor launchd elke volgende geplande run stilzwijgend oversloeg — één hang
# kostte dus weken aan runs. Met de watchdog eindigt de job altijd, met een logregel die
# vertelt wat er aan de hand is.

set -uo pipefail

REPO="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
COCKPIT="$REPO/Expansions/mypka-cockpit"
FETCHER="$COCKPIT/scripts/dartsatlas-fetch.mjs"
NODE_BIN="${NODE_BIN:-/opt/homebrew/bin/node}"
MAX_RUNTIME="${DARTSATLAS_MAX_RUNTIME:-300}"

export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

source "$REPO/scripts/lib/launchd-guard.sh"
guard_init "dartsatlas-fetch"

guard_log "start"

guard_repo_readable "$REPO" || exit 77
[[ -r "$FETCHER" ]] || { guard_log "FOUT: $FETCHER niet leesbaar."; exit 78; }
[[ -x "$NODE_BIN" ]] || { guard_log "FOUT: node niet gevonden op $NODE_BIN."; exit 78; }

cd "$COCKPIT" || { guard_log "FOUT: cd naar $COCKPIT mislukt."; exit 78; }

guard_run "$MAX_RUNTIME" "$NODE_BIN" "$FETCHER" --summary
RC=$?

if [[ $RC -eq 0 ]]; then
  guard_log "klaar (exit 0)"
elif [[ $RC -eq 137 || $RC -eq 143 ]]; then
  guard_log "klaar met FOUT (exit $RC): node is na ${MAX_RUNTIME}s door de watchdog afgebroken. Vrijwel zeker de TCC-blokkade op ~/Documents — geef node Volledige Schijftoegang (zie de kop van dit script). De job is wel netjes vrijgegeven, dus de volgende geplande run wordt niet overgeslagen."
else
  guard_log "klaar met FOUT (exit $RC) — zie regels hierboven"
fi
exit $RC
