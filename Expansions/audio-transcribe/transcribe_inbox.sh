#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/Users/sandervanockenburg-zwaan/.local/bin:$PATH"

# ANTHROPIC_API_KEY is no longer stored in the LaunchAgent plist (plaintext-on-disk risk).
# It now lives in the login Keychain; pull it into this process's environment at runtime.
ANTHROPIC_API_KEY="$(security find-generic-password -a "$(whoami)" -s "nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY" -w 2>/dev/null)"
export ANTHROPIC_API_KEY
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "FOUT: kon ANTHROPIC_API_KEY niet uit Keychain lezen (item nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY ontbreekt of Keychain is locked)." >&2
    exit 1
fi

INBOX="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Team Inbox/Audio Captures"
DELIVERABLES="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/Deliverables"
PKM="/Users/sandervanockenburg-zwaan/Documents/sanders-tweede-brein/PKM"
PROJECTS_DIR="$PKM/My Life/Projects"
SCRATCH="/tmp/audio_transcribe_scratch"

mkdir -p "$SCRATCH"
mkdir -p "$DELIVERABLES"

find "$INBOX" -maxdepth 1 \( -name "*.m4a" -o -name "*.wav" -o -name "*.mp3" -o -name "*.aiff" \) | while IFS= read -r f; do
    filename=$(basename "$f")
    name="${filename%.*}"

    # Dedupe op original_file in plaats van op ruwe bestandsnaam: de outputnaam wordt
    # straks een GL-001-slug, niet meer gelijk aan $name (zie onder).
    if grep -rq -- "^original_file: ${filename}\$" "$DELIVERABLES" --include="*.md" 2>/dev/null; then
        continue
    fi

    # Forceer download van iCloud als het bestand nog niet lokaal staat
    brctl download "$f" 2>/dev/null
    attempts=0
    while xattr "$f" 2>/dev/null | grep -q "com.apple.icloud.item-evicted"; do
        sleep 3
        attempts=$((attempts + 1))
        if [ $attempts -ge 20 ]; then
            echo "Overgeslagen (iCloud download timeout): $filename"
            continue 2
        fi
    done
    sleep 1

    echo "Transcriberen: $filename"

    whisper "$f" --model large-v3 --language nl --output_dir "$SCRATCH" --output_format txt 2>&1

    transcript_file="$SCRATCH/${name}.txt"

    if [ -f "$transcript_file" ]; then
        transcript=$(cat "$transcript_file")
        date_str=$(date "+%Y-%m-%d %H:%M")
        date_only=$(date "+%Y-%m-%d")

        echo "Verwerken met Larry: $filename"

        project_files=$(ls "$PROJECTS_DIR" 2>/dev/null | grep '\.md$')

        larry_output=$(python3 -c "
import json, urllib.request, os

transcript = '''$(echo "$transcript" | sed "s/'/\\\\'/g")'''
project_files = '''$(echo "$project_files" | sed "s/'/\\\\'/g")'''.splitlines()

prompt = f'''Je bent Larry, team orchestrator van Gewoon Basis. Een audio-opname van Sander is automatisch getranscribeerd. Verwerk de transcriptie als volgt:

1. Maak een korte samenvatting (max 3 zinnen)
2. Haal actiepunten eruit (als die er zijn)
3. Bepaal de beste PKM-bestemming: Journal (dagelijkse reflectie), CRM (over personen), Project (werkgerelateerd), of My Life (persoonlijk/gezin)
4. Als de bestemming Project is: kies het best passende bestand uit deze lijst van bestaande projectnotities, of \"none\" als niets duidelijk past:
{chr(10).join(project_files)}
5. Genereer een bestandsnaam-slug volgens GL-001 (Team Knowledge/Guidelines/GL-001-file-naming-conventions.md): 2 tot 5 woorden, kebab-case, alleen lowercase ascii-letters/cijfers/koppeltekens, geen datum erin (die wordt er apart voor geplakt), die de kern van de opname samenvat.

Transcriptie:
{transcript}

Geef je output ALLEEN als JSON (geen andere tekst eromheen) met deze velden: summary, actions (array), destination (journal/crm/project/mylife), destination_reason, destination_file (exacte bestandsnaam uit de lijst hierboven, of null), slug'''

data = json.dumps({'model': 'claude-haiku-4-5-20251001', 'max_tokens': 1024, 'messages': [{'role': 'user', 'content': prompt}]}).encode()
api_key = os.environ.get('ANTHROPIC_API_KEY', '')
req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=data, headers={'x-api-key': api_key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
resp = json.loads(urllib.request.urlopen(req).read())
print(resp['content'][0]['text'])
" 2>/dev/null)

        # GL-001: bestandsnaam wordt YYYY-MM-DD-slug.md, niet de ruwe voice-memo naam.
        # Slug komt uit de Haiku-classificatie hierboven; val terug op een generieke
        # slug als het model geen (bruikbaar) slug-veld teruggaf.
        raw_slug=$(python3 -c "
import json, re
raw = '''$(echo "$larry_output" | sed "s/'/\\\\'/g")'''
match = re.search(r'\{.*\}', raw, re.DOTALL)
slug = ''
if match:
    try:
        slug = json.loads(match.group(0)).get('slug') or ''
    except Exception:
        slug = ''
print(slug)
" 2>/dev/null)
        slug=$(echo "$raw_slug" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed 's/-\+/-/g; s/^-//; s/-$//')
        [ -z "$slug" ] && slug="audio-notitie"

        base_name="${date_only}-${slug}"
        output="$DELIVERABLES/${base_name}.md"
        collision=2
        while [ -f "$output" ]; do
            output="$DELIVERABLES/${base_name}-${collision}.md"
            collision=$((collision + 1))
        done

        # Sla transcriptie + Larry's verwerking altijd op in Deliverables (archief/audit trail)
        {
            echo "---"
            echo "date: $date_str"
            echo "source: Audio Capture"
            echo "original_file: $filename"
            echo "---"
            echo ""
            echo "# Transcriptie: $base_name"
            echo ""
            echo "$transcript"
            echo ""
            echo "---"
            echo ""
            echo "## Larry's verwerking"
            echo ""
            echo "$larry_output"
        } > "$output"

        echo "Opgeslagen: $output"

        # Kopieer het transcript ook als platte tekst terug naar Team Inbox/Audio Captures/
        # zodat de bestaande food-capture-pijplijn (watch-food-inbox.py, LaunchAgent
        # nl.gewoonsander.food-capture, bewaakt deze map al) het oppikt. Die pijplijn
        # bepaalt zelf via process-food-capture.py of het een voedingsregistratie is en
        # filet direct in food_log.py — geen eigen classificatie hier nodig. Niet-eten
        # transcripties worden door process-food-capture.py stil als "nonfood" gemarkeerd
        # en genegeerd. watch-food-inbox.py ruimt dit .txt-bestand op na verwerking.
        printf '%s' "$transcript" > "$INBOX/${name}.txt"

        # Bronbestand archiveren naar Mediahub zodra de transcriptie klaar is (SOP-013:
        # audio hoort in Mediahub, niet in Team Inbox). Pet/project-indeling kan dit
        # script niet betrouwbaar raden, dus naar 99_Inbox_Nog_Uitzoeken — Sander/Hermes
        # sorteert dat verder tijdens de reguliere Mediahub-opruimronde.
        mediahub_base="/Volumes/Lexar SSD/Sander Mediahub"
        if [ -d "$mediahub_base" ]; then
            archief_dir="$mediahub_base/99_Inbox_Nog_Uitzoeken"
            mkdir -p "$archief_dir"
            ext="${filename##*.}"
            archief_naam="${name// /_}.${ext}"
            if mv "$f" "$archief_dir/$archief_naam"; then
                echo "Bronbestand gearchiveerd: $archief_dir/$archief_naam"
            else
                echo "Archiveren mislukt, bestand blijft in Team Inbox: $filename"
            fi
        else
            echo "Mediahub (Lexar SSD) niet aangesloten — bronbestand blijft in Team Inbox: $filename"
        fi

        # Auto-file: als destination == project met een concrete bestandsmatch, direct
        # als datumsectie toevoegen aan de bestaande projectnotitie. Journal/CRM/My Life
        # blijven bewust in Deliverables staan voor handmatige routing (formaten daar
        # zijn te contextafhankelijk om blind te schrijven).
        python3 -c "
import json, re, os

raw = '''$(echo "$larry_output" | sed "s/'/\\\\'/g")'''
match = re.search(r'\{.*\}', raw, re.DOTALL)
if not match:
    raise SystemExit

try:
    parsed = json.loads(match.group(0))
except Exception:
    raise SystemExit

if parsed.get('destination') != 'project':
    raise SystemExit

dest_file = parsed.get('destination_file')
if not dest_file or str(dest_file).lower() in ('null', 'none', ''):
    raise SystemExit

path = os.path.join('$PROJECTS_DIR', dest_file)
if not os.path.isfile(path):
    raise SystemExit

summary = parsed.get('summary', '')
actions = parsed.get('actions', [])

entry = f'\n### Vandaag ($date_only) — automatisch verwerkte audio-opname\n\n'
entry += f'**Samenvatting:** {summary}\n\n'
if actions:
    entry += '**Actiepunten:**\n' + '\n'.join(f'- {a}' for a in actions) + '\n'

with open(path, 'a') as fh:
    fh.write(entry)

print(f'Auto-filed naar: {path}')
" 2>/dev/null
    else
        echo "Fout: transcriptie mislukt voor $filename"
    fi
done

rm -rf "$SCRATCH"
echo "Klaar."
