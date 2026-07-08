#!/bin/bash
# route_downloads.sh — bewaakt Downloads (via launchd WatchPaths).
# 1. Screenshots/documenten -> verplaatst naar Team Inbox (bestaand gedrag).
# 2. Media (foto/video/audio/design-export) -> hernoemd IN Downloads volgens
#    Mediahub-naamconventie (YYYY-MM-DD_merk_omschrijving_v01.ext), blijft liggen.
# Key komt uit ~/.config/gewoonsander/env (geen plaintext-key in de plist).

export PATH="/opt/homebrew/bin:/usr/local/bin:/Users/sandervanockenburg-zwaan/.local/bin:/usr/bin:/bin:$PATH"

[ -f "$HOME/.config/gewoonsander/env" ] && source "$HOME/.config/gewoonsander/env"

DOWNLOADS="$HOME/Downloads"
INBOX="$HOME/Documents/sanders-tweede-brein/Team Inbox"
SCREENSHOTS="$INBOX/Screenshots"
DOCUMENTS="$INBOX/Documents"
MAX_SIZE=52428800  # 50 MB, alleen voor verplaatsen naar Team Inbox
MODEL="claude-haiku-4-5-20251001"
STATE="$HOME/.local/state/gewoonsander/downloads-rename"
RENAME_CONF_DREMPEL="0.3"
DRY_RUN="${DRY_RUN:-0}"

mkdir -p "$SCREENSHOTS" "$DOCUMENTS" "$STATE"

sha_of() { shasum -a 256 "$1" 2>/dev/null | awk '{print $1}'; }

# Voldoet al aan Mediahub-conventie: YYYY-MM-DD_merk_omschrijving_vNN[_WxH][_PUBLISHED].ext
matches_convention() {
    [[ "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}_[a-z0-9]{2,3}_[a-z0-9-]+_v[0-9]{2}(_[0-9]+x[0-9]+)?(_PUBLISHED)?\.[A-Za-z0-9]+$ ]]
}

# Grofweg klaar met downloaden: grootte verandert niet binnen 2s.
is_stable() {
    local s1 s2
    s1=$(stat -f%z "$1" 2>/dev/null || echo -1)
    sleep 2
    s2=$(stat -f%z "$1" 2>/dev/null || echo -2)
    [ "$s1" = "$s2" ]
}

wait_for_icloud() {
    local f="$1" attempts=0
    brctl download "$f" 2>/dev/null
    while xattr "$f" 2>/dev/null | grep -q "com.apple.icloud.item-evicted"; do
        sleep 3
        attempts=$((attempts + 1))
        [ $attempts -ge 20 ] && return 1
    done
    return 0
}

BRAND_RULES='DC = dartscoaching, huddle, cursus, coaching, jouw dartstraining, 180 mindset
DB = dartbuddies, community, boekkopers
ADC = adc, regio oost, pubqualifier, dartsatlas, ranking, d10, rijnvogels, twentse ros
VGS = vgs, gewoon sander, mentor, ai, strategie, ondernemer
GGT = ggt, gezinshuis, gewoon thuis
PRV = prive, familie, persoonlijk
90 = algemeen, stock, muziek, font, licentie (meerdere merken / geen duidelijk merk)'

classify_image() {
    local f="$1" filename="$2" ext_lc="$3"
    local media_type="image/jpeg" send_file="$f" cleanup=""
    case "$ext_lc" in
        png) media_type="image/png" ;;
        heic)
            send_file="/tmp/$$.$(basename "$f").rename.jpg"
            sips -s format jpeg "$f" --out "$send_file" >/dev/null 2>&1
            media_type="image/jpeg"; cleanup="$send_file" ;;
    esac
    SEND_FILE="$send_file" MEDIA_TYPE="$media_type" MODEL="$MODEL" FNAME="$filename" RULES="$BRAND_RULES" python3 -c "
import json, urllib.request, os, base64
p = os.environ['SEND_FILE']
with open(p,'rb') as fh: b64 = base64.standard_b64encode(fh.read()).decode()
prompt = ('Je herkent voor welk merk een gedownload bestand bedoeld is, op basis van de afbeelding en '
          'de bestandsnaam \"' + os.environ['FNAME'] + '\". Signaalwoorden per merk:\n' + os.environ['RULES'] +
          '\nGeef UITSLUITEND JSON: {\"merk\": \"DC|DB|ADC|VGS|GGT|PRV|90|onbekend\", '
          '\"omschrijving\": \"korte-nederlandse-omschrijving-met-koppeltekens\", \"confidence\": 0.0-1.0}. '
          'Gebruik \"onbekend\" als er geen enkel signaal is. Nooit final/definitief/nieuw/kopie in de omschrijving.')
data = json.dumps({'model': os.environ['MODEL'],'max_tokens':256,'messages':[{'role':'user','content':[{'type':'image','source':{'type':'base64','media_type':os.environ['MEDIA_TYPE'],'data':b64}},{'type':'text','text':prompt}]}]}).encode()
req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=data, headers={'x-api-key':os.environ.get('ANTHROPIC_API_KEY',''),'anthropic-version':'2023-06-01','content-type':'application/json'})
try:
    resp = json.loads(urllib.request.urlopen(req).read())
    print(resp['content'][0]['text'])
except Exception:
    print('{\"merk\":\"onbekend\",\"omschrijving\":\"\",\"confidence\":0}')
" 2>/dev/null
    [ -n "$cleanup" ] && rm -f "$cleanup"
}

classify_by_filename() {
    FNAME="$1" MODEL="$MODEL" RULES="$BRAND_RULES" python3 -c "
import json, urllib.request, os
prompt = ('Je herkent voor welk merk een gedownload bestand bedoeld is, uitsluitend op basis van de bestandsnaam \"' +
          os.environ['FNAME'] + '\". Signaalwoorden per merk:\n' + os.environ['RULES'] +
          '\nGeef UITSLUITEND JSON: {\"merk\": \"DC|DB|ADC|VGS|GGT|PRV|90|onbekend\", '
          '\"omschrijving\": \"korte-nederlandse-omschrijving-met-koppeltekens\", \"confidence\": 0.0-1.0}. '
          'Gebruik \"onbekend\" als de naam geen enkel signaal bevat (bv. IMG_1234, generieke export-namen). '
          'Nooit final/definitief/nieuw/kopie in de omschrijving.')
data = json.dumps({'model': os.environ['MODEL'],'max_tokens':256,'messages':[{'role':'user','content':prompt}]}).encode()
req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=data, headers={'x-api-key':os.environ.get('ANTHROPIC_API_KEY',''),'anthropic-version':'2023-06-01','content-type':'application/json'})
try:
    resp = json.loads(urllib.request.urlopen(req).read())
    print(resp['content'][0]['text'])
except Exception:
    print('{\"merk\":\"onbekend\",\"omschrijving\":\"\",\"confidence\":0}')
" 2>/dev/null
}

json_field() {
    python3 -c "import json,sys,re
raw=sys.stdin.read(); m=re.search(r'\{.*\}', raw, re.DOTALL)
try:
    d=json.loads(m.group(0)) if m else {}
    print(d.get('$1','$2'))
except Exception:
    print('$2')" 2>/dev/null
}

rename_media_file() {
    local f="$1"
    local filename; filename=$(basename "$f")
    matches_convention "$filename" && return

    local fhash marker
    fhash=$(sha_of "$f")
    marker="$STATE/${fhash}.onbekend"
    [ -n "$fhash" ] && [ -f "$marker" ] && return

    wait_for_icloud "$f" || { echo "Overgeslagen (iCloud timeout): $filename"; return; }
    is_stable "$f" || { echo "Overgeslagen (nog bezig met downloaden): $filename"; return; }

    local ext ext_lc classify merk omschrijving conf
    ext="${filename##*.}"
    ext_lc=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    case "$ext_lc" in
        jpg|jpeg|png|gif|webp|heic)
            classify=$(classify_image "$f" "$filename" "$ext_lc") ;;
        *)
            classify=$(classify_by_filename "$filename") ;;
    esac

    merk=$(echo "$classify" | json_field merk onbekend)
    omschrijving=$(echo "$classify" | json_field omschrijving "")
    conf=$(echo "$classify" | json_field confidence 0)

    local below
    below=$(python3 -c "print(1 if '$merk'=='onbekend' or float('${conf:-0}' or 0) < ${RENAME_CONF_DREMPEL} else 0)" 2>/dev/null)
    if [ "$below" = "1" ]; then
        [ -n "$fhash" ] && [ "$DRY_RUN" = "0" ] && touch "$marker"
        echo "Niet herkend, naam ongewijzigd: $filename"
        return
    fi

    local date_str new_base new_name target counter
    date_str=$(stat -f "%Sm" -t "%Y-%m-%d" "$f")
    omschrijving=$(echo "$omschrijving" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
    [ -z "$omschrijving" ] && omschrijving="bestand"

    new_base="${date_str}_${merk}_${omschrijving}"
    counter=1
    while :; do
        new_name=$(printf "%s_v%02d.%s" "$new_base" "$counter" "$ext_lc")
        target="$DOWNLOADS/$new_name"
        [ -e "$target" ] || break
        counter=$((counter + 1))
    done

    if [ "$DRY_RUN" = "1" ]; then
        echo "[DRY_RUN] zou hernoemen ($merk, conf=$conf): $filename -> $new_name"
    else
        mv "$f" "$target" && echo "Hernoemd in Downloads ($merk, conf=$conf): $filename -> $new_name"
    fi
}

route_file() {
    local f="$1"
    local filename; filename=$(basename "$f")
    local ext; ext=$(echo "${filename##*.}" | tr '[:upper:]' '[:lower:]')

    [ -d "$f" ] && return

    case "$filename" in
        Scherm*afbeelding*.png|Screenshot*.png|Scherm*afbeelding*.jpg|Screen\ Shot*.png)
            local size; size=$(stat -f%z "$f" 2>/dev/null || echo 0)
            [ "$size" -gt "$MAX_SIZE" ] && return
            mv "$f" "$SCREENSHOTS/" && echo "Screenshot → Team Inbox/Screenshots: $filename"
            return
            ;;
    esac

    case "$ext" in
        pdf|docx|doc|xlsx|xls|pptx|ppt|md|txt|csv|pages|numbers|keynote)
            local size; size=$(stat -f%z "$f" 2>/dev/null || echo 0)
            [ "$size" -gt "$MAX_SIZE" ] && return
            mv "$f" "$DOCUMENTS/" && echo "Document → Team Inbox/Documents: $filename"
            ;;
        jpg|jpeg|png|gif|webp|heic|svg|mp4|mov|avi|mkv|m4v|mp3|wav|aac|m4a|flac|ai|psd|afdesign|afpub|sketch|fig)
            rename_media_file "$f"
            ;;
    esac
}

# Verwerk alle bestanden in Downloads
for f in "$DOWNLOADS"/*; do
    [ -e "$f" ] || continue
    route_file "$f"
done
