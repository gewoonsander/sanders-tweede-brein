---
name: project_davinci_resolve_studio
description: Sander heeft DaVinci Resolve Studio 20.3.2 met werkende externe scripting-API — automatisering van videowerk is dus mogelijk
metadata: 
  node_type: memory
  type: project
  originSessionId: d17f7f6b-1de4-4138-abd9-87b1e108d78e
  modified: 2026-08-17T20:03:02.512Z
---

Sander draait **DaVinci Resolve Studio 20.3.2.9** (op de MacBook Air, `/Applications/DaVinci Resolve/`). Op 2026-08-17 geverifieerd door de externe Python-API daadwerkelijk te ondervragen: `GetProductName()` gaf "DaVinci Resolve Studio" en de verbinding kwam meteen tot stand.

Dat betekent dat de **externe scripting-API bruikbaar is** — Claude Code kan Resolve dus rechtstreeks aansturen (timelines bouwen, media importeren, LUT's toepassen, renderqueue vullen, headless renderen met `-nogui`). Sinds Resolve 19.1 is dit Studio-only; de gratis editie kan alleen scripts in de interne Fusion-console draaien.

Voorwaarden bij gebruik:
- Resolve moet draaien op dezelfde machine als het script.
- Env-vars: `RESOLVE_SCRIPT_API="/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting"`, `RESOLVE_SCRIPT_LIB=".../DaVinci Resolve.app/Contents/Libraries/Fusion/fusionscript.so"`, plus `$RESOLVE_SCRIPT_API/Modules` op de PYTHONPATH.
- Op de MacBook Air ontbreken `ffmpeg`/`ffprobe`/`yt-dlp`; Python is er alleen als 3.9.6.

## MCP-koppeling (geïnstalleerd 2026-08-17)

De MCP-server `samuelgursky/davinci-resolve-mcp` staat in `~/Tools/davinci-resolve-mcp` (bewust buiten de PKM-repo), met een eigen venv op Python 3.12.14. Geregistreerd in `.mcp.json` van de PKM-repo onder de naam `davinci-resolve`, in **compound-modus: 35 tools** (niet de 353 granulaire — die vreten context). Telemetrie uit via `DAVINCI_RESOLVE_MCP_UPDATE_CHECK=0`.

Argus deed de securityreview: oordeel **geel** — geen telemetrie die projectdata verstuurt, geen `eval`/`exec`/`os.system`/`pickle`, nergens `shell=True`, geen secrets, geen typosquats. Restrisico is inherent: de server draait met Sanders volledige gebruikersrechten en de Python-deps zijn los gepind.

Let op bij schrijven naar `.mcp.json`: de auto-mode classifier blokkeert directe Edit-acties op dat bestand, ook na expliciete toestemming van Sander. Werkende route is `claude mcp add <naam> --scope project -e KEY=VAL -- <command> <args>`.

Handige tools: `timeline_frame` (frame als afbeelding — Claude kan dus meekijken), `media_analysis`, `media_pool`, `render`, `timeline_item_color`, `fusion_comp`, `script_plugin`.

Relevant voor videowerk van [[user_sander_profiel]] — de specialist stephan-speelberg (video-regie) kan hierop bouwen.
