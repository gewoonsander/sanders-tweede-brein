#!/bin/bash
# youtube-samenvatting-ochtend.sh
#
# Dagelijkse (LaunchAgent nl.gewoonsander.youtube-samenvatting-ochtend, Mac Mini, 07:00)
# controle op nieuwe video's van gevolgde YouTube-kanalen (config/youtube-kanalen.json).
# Per nieuwe video:
#   1. /transcribeer haalt de tekst op (ondertitels eerst, Whisper-terugval anders) —
#      dedupe gebeurt UITSLUITEND door /transcribeer zelf (already_done() op video-ID in
#      de bestandsnaam). Geen aparte state-laag hier, om te voorkomen dat twee dedupe-
#      mechanismen uit sync raken (zie Deliverables/2026-08-16-youtube-kanaal-samenvatting-
#      design.md, Raad-uitspraak risico 2). "Nieuw" = een bestand dat na deze /transcribeer-
#      aanroep bestaat en er vóór de aanroep nog niet was.
#   2. Eén samenvattingsstap levert een volwaardige PKM-samenvatting + een kort dagstart-
#      relevantie-oordeel, gegrond in Sanders bestaande PKM-Topics/Projects (geen losse, apart
#      te onderhouden themalijst). Methode instelbaar via config/youtube-kanalen.json ->
#      samenvatting_methode: 'abonnement' (default, headless Claude Code CLI, geen aparte
#      kosten) of 'api' (directe Anthropic-call, Haiku, Keychain-key uit audio-transcribe,
#      kleine kosten per aanroep) — wisselen is een configwijziging, geen scriptwijziging.
#   3. Samenvatting wordt weggeschreven als Outer World-item (PKM/Outer World/YYYY/MM/) —
#      hergebruikt het bestaande "dingen die ik van buiten bewaar"-concept in de Cockpit.
#   4. Een kort seintje gaat naar de dagstart-queue (PKM/Documents/YouTube-Kennis/
#      _nieuw-voor-dagstart.md) — stapelt altijd op, wordt pas geleegd als /dagstart hem meldt.
#
# Faalt een stap (transcriptie, Haiku-call, API-key): dat wordt ALTIJD als regel in de queue
# gezet, zodat stilte nooit ambigu is met "geen nieuwe video's" (Raad-uitspraak risico 1).
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/Users/sandervanockenburg-zwaan/.local/bin:$PATH"

REPO="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein"
CONFIG="$REPO/config/youtube-kanalen.json"
KENNIS_MAP="$REPO/PKM/Documents/YouTube-Kennis"
OUTER_WORLD="$REPO/PKM/Outer World"
QUEUE="$KENNIS_MAP/_nieuw-voor-dagstart.md"
TOPICS_DIR="$REPO/PKM/My Life/Topics"
PROJECTS_DIR="$REPO/PKM/My Life/Projects"
TRANSCRIBEER="$HOME/.claude/skills/transcribeer/transcribeer.py"
DATUM=$(date "+%Y-%m-%d")
JAAR_MAAND=$(date "+%Y/%m")

log() { echo "[youtube-samenvatting-ochtend] $(date -u +%Y-%m-%dT%H:%M:%SZ) $*"; }

# Gedeelde LaunchAgent-helpers (TCC-stabiele claude-binary, preflight, watchdog).
# Zie scripts/lib/launchd-guard.sh voor de achtergrond bij het TCC-probleem van 17-08-2026.
source "$REPO/scripts/lib/launchd-guard.sh"
guard_init "youtube-samenvatting-ochtend"

# Apple's system-python in plaats van Homebrew python3. Onder launchd blokkeert de
# Homebrew-build oneindig zodra hij iets in ~/Documents aanraakt (TCC-dialoog die niemand
# wegklikt) — precies waar deze routine op 17-08-2026 op vastliep, al bij het inlezen van
# de config. De Apple-gesigneerde build erft de Volledige Schijftoegang van /bin/bash en
# werkt wel. Alle inline-python hieronder gebruikt uitsluitend stdlib (json, re, sys, os,
# urllib), dus de wissel is functioneel neutraal.
PY="${YOUTUBE_PYTHON:-/usr/bin/python3}"

meld_fout() {
    # Schrijft een fout-regel naar de queue zodat een mislukte run nooit stilzwijgend
    # verdwijnt — dagstart ziet dit net als een geslaagde melding.
    local reden="$1"
    mkdir -p "$KENNIS_MAP"
    if [ ! -f "$QUEUE" ]; then
        printf '%s\n' "**Status: CONCEPT — ter review door Sander**" "" > "$QUEUE"
    fi
    { echo ""; echo "**FOUT ($DATUM):** $reden"; } >> "$QUEUE"
    log "FOUT: $reden"
}

log "start"

if [ ! -f "$CONFIG" ]; then
    meld_fout "config ontbreekt: $CONFIG"
    exit 1
fi

if [ ! -f "$TRANSCRIBEER" ]; then
    meld_fout "/transcribeer-skill niet gevonden op $TRANSCRIBEER"
    exit 1
fi

mkdir -p "$KENNIS_MAP" "$OUTER_WORLD/$JAAR_MAAND"

# config uitlezen via stdin (cat | "$PY" -c ...) i.p.v. python zelf open('$CONFIG') te laten
# doen: een LaunchAgent-Python-proces dat zelf een pad onder ~/Documents opent kan vastlopen op
# een macOS TCC-toestemmingscontrole die nooit interactief afgehandeld kan worden (geconstateerd
# 2026-08-16 — bash zelf heeft die toegang al wel, dus bash leest het bestand en pipet de inhoud
# door). Zie Deliverables/2026-08-16-youtube-kanaal-samenvatting-design.md.
SAMENVATTING_METHODE=$(cat "$CONFIG" | "$PY" -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('samenvatting_methode', 'abonnement'))
")

kanalen=$(cat "$CONFIG" | "$PY" -c "
import json, sys
data = json.load(sys.stdin)
for k in data.get('kanalen', []):
    print(k['naam'] + '|' + k['url'])
")

if [ -z "$kanalen" ]; then
    log "geen kanalen in config, klaar"
    exit 0
fi

# ANTHROPIC_API_KEY alleen nodig bij methode 'api' — bij 'abonnement' gebruikt de headless
# Claude Code CLI Sanders ingelogde sessie, geen aparte key.
if [ "$SAMENVATTING_METHODE" = "api" ]; then
    ANTHROPIC_API_KEY="$(security find-generic-password -a "$(whoami)" -s "nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY" -w 2>/dev/null)"
    export ANTHROPIC_API_KEY
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        meld_fout "kon ANTHROPIC_API_KEY niet uit Keychain lezen (item nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY ontbreekt of Keychain is locked)."
        exit 1
    fi
else
    # Bewust NIET ~/.local/bin/claude: dat symlinkt naar een versiespecifiek pad
    # (~/.local/share/claude/versions/<versie>) dat na elke auto-update voor macOS TCC een
    # nieuwe, rechtenloze client is. Onder launchd levert dat geen foutmelding op maar een
    # toestemmingsdialoog die niemand wegklikt, waardoor de run oneindig hangt.
    # guard_claude_bin kiest het app-bundle-pad, met een stabiele Anthropic-identiteit die
    # Volledige Schijftoegang heeft en auto-updates overleeft.
    CLAUDE_BIN="$(guard_claude_bin)"
    if [ -z "$CLAUDE_BIN" ] || [ ! -x "$CLAUDE_BIN" ]; then
        meld_fout "samenvatting_methode staat op 'abonnement', maar er is geen bruikbare claude-CLI gevonden (bundle noch ${CLAUDE_BIN:-$HOME/.local/bin/claude})."
        exit 1
    fi
    log "claude-binary: $CLAUDE_BIN"
fi

# FIRECRAWL_API_KEY — /transcribeer heeft sinds 2026-08-18 een Firecrawl-route die YouTube's
# IP-blokkade omzeilt. Die blokkade is de oorzaak van de vastgelopen runs op 17 en 18 augustus:
# zonder alternatief bleef de ondertitelroute hangen tot de 900s-timeout toesloeg. launchd geeft
# dit script een kale omgeving, dus de key komt hier uit de Keychain. Ontbreekt de key, dan is
# dat geen harde fout — /transcribeer valt dan terug op ondertitels + Whisper, precies zoals
# voorheen; wel loggen zodat het zichtbaar is.
# Twee bekende plekken (2026-08-18, Mac Mini-audit): het "abonnement"-patroon
# (nl.gewoonsander.FIRECRAWL_API_KEY, account = volledige gebruikersnaam, zelfde stijl als
# ANTHROPIC_API_KEY hierboven) en een ouder item uit de Firecrawl-MCP-koppeling
# (mcp-firecrawl-api-key, account "sander"). Probeer beide, in die volgorde.
if [ -z "$FIRECRAWL_API_KEY" ]; then
    FIRECRAWL_API_KEY="$(security find-generic-password -a "$(whoami)" -s "nl.gewoonsander.FIRECRAWL_API_KEY" -w 2>/dev/null)"
fi
if [ -z "$FIRECRAWL_API_KEY" ]; then
    FIRECRAWL_API_KEY="$(security find-generic-password -a "sander" -s "mcp-firecrawl-api-key" -w 2>/dev/null)"
fi
if [ -n "$FIRECRAWL_API_KEY" ]; then
    export FIRECRAWL_API_KEY
    log "Firecrawl-route beschikbaar (key uit Keychain of omgeving)"
else
    log "WAARSCHUWING: geen FIRECRAWL_API_KEY gevonden (geen van beide Keychain-items aanwezig: nl.gewoonsander.FIRECRAWL_API_KEY of mcp-firecrawl-api-key) — /transcribeer draait zonder Firecrawl-terugval en kan opnieuw vastlopen op een YouTube-IP-blokkade"
fi

# PKM-context voor het relevantie-oordeel: alleen bestandsnamen (geen inhoud), Topics + Projects.
topics_lijst=$(ls "$TOPICS_DIR" 2>/dev/null | grep '\.md$' | grep -v '^INDEX.md$' | sed 's/\.md$//')
projects_lijst=$(ls "$PROJECTS_DIR" 2>/dev/null | grep '\.md$' | grep -v '^INDEX.md$' | sed 's/\.md$//')

TOTAAL_NIEUW=0
GEWIJZIGDE_BESTANDEN=()

while IFS='|' read -r naam url; do
    [ -z "$url" ] && continue
    kanaal_map="$KENNIS_MAP/$naam"
    mkdir -p "$kanaal_map"

    before=$(find "$kanaal_map" -maxdepth 1 -name "*.md" 2>/dev/null | sort)

    # Eigen timeout rond /transcribeer (macOS heeft standaard geen timeout/gtimeout-commando).
    # Voorkomt dat een onverwachte hang (geconstateerd 2026-08-16: een netwerkcall zonder eigen
    # timeout liet een run >20 min stilzwijgend vasthangen) de kans wegneemt dat dit script zelf
    # nog een FOUT-regel naar de queue schrijft — launchd's ExitTimeOut (1800s) killt anders de
    # hele boom zonder dat onze eigen foutafhandeling nog kan draaien. 900s ruim onder die 1800s.
    TRANSCRIBEER_TIMEOUT_S=900
    tmp_out=$(mktemp)
    uv run "$TRANSCRIBEER" "$url" --max 5 --out "$kanaal_map" > "$tmp_out" 2>&1 &
    transcribeer_pid=$!
    gewacht=0
    while kill -0 "$transcribeer_pid" 2>/dev/null && [ $gewacht -lt $TRANSCRIBEER_TIMEOUT_S ]; do
        sleep 5
        gewacht=$((gewacht + 5))
    done
    if kill -0 "$transcribeer_pid" 2>/dev/null; then
        kill -9 "$transcribeer_pid" 2>/dev/null
        transcribeer_status=124
        log "\"$naam\": /transcribeer overschreed ${TRANSCRIBEER_TIMEOUT_S}s en is hard gestopt (vermoedelijk netwerk-hang)"
    else
        wait "$transcribeer_pid" 2>/dev/null
        transcribeer_status=$?
    fi
    transcribeer_output=$(cat "$tmp_out")
    rm -f "$tmp_out"

    if [ $transcribeer_status -ne 0 ]; then
        log "transcribeer-output voor \"$naam\":"
        echo "$transcribeer_output" >&2
        if [ $transcribeer_status -eq 124 ]; then
            meld_fout "YouTube-check voor \"$naam\" mislukt — /transcribeer bleef >${TRANSCRIBEER_TIMEOUT_S}s hangen (netwerkprobleem) en is afgebroken."
        else
            meld_fout "YouTube-check voor \"$naam\" mislukt — /transcribeer gaf een foutcode (zie ~/Library/Logs/youtube-samenvatting-ochtend.err.log)."
        fi
        continue
    fi

    after=$(find "$kanaal_map" -maxdepth 1 -name "*.md" 2>/dev/null | sort)
    nieuwe_bestanden=$(comm -13 <(echo "$before") <(echo "$after"))

    if [ -z "$nieuwe_bestanden" ]; then
        log "\"$naam\": geen nieuwe video's"
        continue
    fi

    while IFS= read -r bestand; do
        [ -z "$bestand" ] && continue
        TOTAAL_NIEUW=$((TOTAAL_NIEUW + 1))
        GEWIJZIGDE_BESTANDEN+=("$bestand")
        log "\"$naam\": nieuwe video, samenvatten — $(basename "$bestand")"

        transcript_inhoud=$(cat "$bestand")
        video_titel=$(echo "$transcript_inhoud" | head -1 | sed 's/^# //')
        video_url=$(echo "$transcript_inhoud" | grep -m1 '^\- \*\*Video:\*\*' | sed 's/^- \*\*Video:\*\* //')

        # Prompt éénmalig opbouwen (geen API-call hier) — daarna gebruikt door welke methode
        # dan ook (abonnement via headless Claude Code, of de directe API).
        prompt_text=$("$PY" -c "
import json

transcript = '''$(echo "$transcript_inhoud" | sed "s/'/\\\\'/g")'''
titel = '''$(echo "$video_titel" | sed "s/'/\\\\'/g")'''
video_url = '''$(echo "$video_url" | sed "s/'/\\\\'/g")'''
kanaal = '''$(echo "$naam" | sed "s/'/\\\\'/g")'''
topics = '''$(echo "$topics_lijst" | sed "s/'/\\\\'/g")'''.splitlines()
projects = '''$(echo "$projects_lijst" | sed "s/'/\\\\'/g")'''.splitlines()

prompt = f'''Je verwerkt een automatisch getranscribeerde YouTube-video voor Sanders tweede brein (myPKA).
Kanaal: {kanaal}
Titel: {titel}

Doe twee dingen:
1. Schrijf een VOLWAARDIGE samenvatting (geen harde lengtelimiet — mag de video grotendeels
   vervangen zodat Sander hem niet per se zelf hoeft te kijken). Gebruik kopjes/bullets waar
   dat de leesbaarheid helpt.
2. Beoordeel de relevantie voor Sander op basis van zijn bestaande PKM-Topics en -Projects
   hieronder (GEEN vaste themalijst, alleen deze twee lijsten als context). Geef een label
   (hoog/gemiddeld/laag) en een reden van precies 1 zin. Geef ook een kort onderwerp (max 8
   woorden) voor de ochtendmelding.

Sanders PKM-Topics:
{chr(10).join(topics) if topics else '(geen)'}

Sanders PKM-Projects:
{chr(10).join(projects) if projects else '(geen)'}

Als de video inhoudelijk raakt aan één of meer Topics/Projects hierboven, noem hun EXACTE
bestandsnaam (zonder .md) in linked_topics/linked_projects. Verzin nooit een naam die niet
letterlijk in de lijst hierboven staat. Geen match: laat de array leeg.

Genereer ook een bestandsnaam-slug volgens GL-001 (Team Knowledge/Guidelines/GL-001-file-naming-
conventions.md): 2 tot 5 woorden, kebab-case, alleen lowercase ascii-letters/cijfers/koppeltekens,
die de kern van de video samenvat.

Transcriptie:
{transcript}

Geef je output ALLEEN als JSON (geen andere tekst eromheen) met deze velden: slug,
pkm_samenvatting (string, mag markdown bevatten), dagstart_onderwerp (string, max 8 woorden),
relevantie_label (\"hoog\"/\"gemiddeld\"/\"laag\"), relevantie_reden (1 zin), linked_topics
(array van strings), linked_projects (array van strings)'''

print(prompt)
")

        # Samenvatten: 'abonnement' (headless Claude Code, gebruikt Sanders Claude-abonnement,
        # geen aparte kosten) of 'api' (directe Anthropic-call, Haiku, kleine kosten per aanroep).
        # Instelbaar via config/youtube-kanalen.json -> samenvatting_methode, geen scriptwijziging
        # nodig om te wisselen (bv. bij abonnements-limiet vaker geraakt worden).
        if [ "$SAMENVATTING_METHODE" = "api" ]; then
            haiku_output=$("$PY" -c "
import json, urllib.request, os
prompt = '''$(echo "$prompt_text" | sed "s/'/\\\\'/g")'''
data = json.dumps({'model': 'claude-haiku-4-5-20251001', 'max_tokens': 4096, 'messages': [{'role': 'user', 'content': prompt}]}).encode()
api_key = os.environ.get('ANTHROPIC_API_KEY', '')
req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=data, headers={'x-api-key': api_key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
resp = json.loads(urllib.request.urlopen(req, timeout=120).read())
print(resp['content'][0]['text'])
" 2>&1)
        else
            haiku_output=$("$CLAUDE_BIN" -p "$prompt_text" --dangerously-skip-permissions 2>&1)
        fi

        parsed_ok=$("$PY" -c "
import json, re, sys
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
match = re.search(r'\{.*\}', raw, re.DOTALL)
if not match:
    print('NEE'); sys.exit()
try:
    json.loads(match.group(0))
    print('JA')
except Exception:
    print('NEE')
")

        if [ "$parsed_ok" != "JA" ]; then
            log "Haiku-call voor \"$video_titel\" gaf geen bruikbare JSON terug:"
            echo "$haiku_output" >&2
            meld_fout "Samenvatting van \"$video_titel\" ($naam) mislukt — de video is wel getranscribeerd (staat in $kanaal_map), maar nog niet samengevat. Verwerk dit bestand later handmatig."
            continue
        fi

        # Velden uit de JSON halen.
        slug=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
s = (d.get('slug') or 'youtube-video').lower()
s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
print(s or 'youtube-video')
")
        pkm_samenvatting=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
print(d.get('pkm_samenvatting') or '')
")
        dagstart_onderwerp=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
print(d.get('dagstart_onderwerp') or '')
")
        relevantie_label=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
print(d.get('relevantie_label') or 'onbekend')
")
        relevantie_reden=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
print(d.get('relevantie_reden') or '')
")
        linked_topics_yaml=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
items = d.get('linked_topics') or []
print('\n'.join(f'  - {i}' for i in items) if items else '  []')
")
        linked_projects_yaml=$("$PY" -c "
import json, re
raw = '''$(echo "$haiku_output" | sed "s/'/\\\\'/g")'''
d = json.loads(re.search(r'\{.*\}', raw, re.DOTALL).group(0))
items = d.get('linked_projects') or []
print('\n'.join(f'  - {i}' for i in items) if items else '  []')
")

        # Botsingsvrije bestandsnaam in de Outer World-maand-map.
        ow_dir="$OUTER_WORLD/$JAAR_MAAND"
        mkdir -p "$ow_dir"
        ow_slug="$slug"
        ow_pad="$ow_dir/${ow_slug}.md"
        collision=2
        while [ -f "$ow_pad" ]; do
            ow_slug="${slug}-${collision}"
            ow_pad="$ow_dir/${ow_slug}.md"
            collision=$((collision + 1))
        done

        {
            echo "---"
            echo "doc_type: outer-world"
            echo "title: \"$video_titel\""
            echo "captured_on: $DATUM"
            echo "status: filed"
            echo "source_url: $video_url"
            echo "source_type: video"
            echo "source_author: $naam"
            echo "embed_kind: video"
            echo "embed_title: \"$video_titel\""
            echo "embed_site_name: YouTube"
            echo "embed_domain: youtube.com"
            echo "tom_context: \"Automatisch opgehaald door de youtube-samenvatting-ochtend-routine. Relevantie: $relevantie_label — $relevantie_reden\""
            echo "linked_topics:"
            echo "$linked_topics_yaml"
            echo "linked_projects:"
            echo "$linked_projects_yaml"
            echo "---"
            echo ""
            echo "# $video_titel"
            echo ""
            echo "## Samenvatting"
            echo ""
            echo "$pkm_samenvatting"
            echo ""
            echo "## Bron"
            echo ""
            echo "- Video: $video_url"
            echo "- Kanaal: $naam"
            echo "- Volledige transcriptie: [[$(basename "$bestand" .md)]]"
        } > "$ow_pad"
        GEWIJZIGDE_BESTANDEN+=("$ow_pad")
        log "Outer World-item geschreven: $ow_pad"

        # Queue-entry voor dagstart — stapelt op, wordt pas geleegd als dagstart hem meldt.
        if [ ! -f "$QUEUE" ]; then
            printf '%s\n' "**Status: CONCEPT — ter review door Sander**" "" > "$QUEUE"
        fi
        {
            echo ""
            echo "## $naam — $dagstart_onderwerp"
            echo "**Relevantie: $relevantie_label** — $relevantie_reden"
            echo "Video: $video_url"
            echo "Volledige samenvatting: [[$ow_slug]]"
        } >> "$QUEUE"
        GEWIJZIGDE_BESTANDEN+=("$QUEUE")
        log "queue-entry toegevoegd voor \"$video_titel\""

    done <<< "$nieuwe_bestanden"

done <<< "$kanalen"

if [ ${#GEWIJZIGDE_BESTANDEN[@]} -gt 0 ]; then
    cd "$REPO" || exit 1
    printf '%s\n' "${GEWIJZIGDE_BESTANDEN[@]}" | sort -u | xargs git add
    git commit -q -m "YouTube-samenvatting-ochtend $DATUM (automatisch, $TOTAAL_NIEUW nieuwe video's)" || log "git commit gaf niets te committen (mogelijk al gecommit)"
    log "gecommit: $TOTAAL_NIEUW nieuwe video('s)"
else
    log "niets gewijzigd, geen commit"
fi

log "klaar — $TOTAAL_NIEUW nieuwe video('s) verwerkt"
