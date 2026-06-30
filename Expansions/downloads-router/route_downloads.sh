#!/bin/bash

DOWNLOADS="$HOME/Downloads"
INBOX="$HOME/Documents/sanders-tweede-brein/Team Inbox"
SCREENSHOTS="$INBOX/Screenshots"
DOCUMENTS="$INBOX/Documents"
MAX_SIZE=52428800  # 50 MB

mkdir -p "$SCREENSHOTS"
mkdir -p "$DOCUMENTS"

route_file() {
    local f="$1"
    local filename
    filename=$(basename "$f")
    local ext="${filename##*.}"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    # Sla mappen over
    [ -d "$f" ] && return

    # Sla grote bestanden over (> 50 MB)
    local size
    size=$(stat -f%z "$f" 2>/dev/null || echo 0)
    [ "$size" -gt "$MAX_SIZE" ] && return

    case "$filename" in
        Scherm*afbeelding*.png|Screenshot*.png|Scherm*afbeelding*.jpg|Screen\ Shot*.png)
            mv "$f" "$SCREENSHOTS/" && echo "Screenshot → Team Inbox/Screenshots: $filename"
            ;;
        *)
            case "$ext" in
                pdf|docx|doc|xlsx|xls|pptx|ppt|md|txt|csv|pages|numbers|keynote)
                    mv "$f" "$DOCUMENTS/" && echo "Document → Team Inbox/Documents: $filename"
                    ;;
            esac
            ;;
    esac
}

# Verwerk alle bestanden in Downloads
for f in "$DOWNLOADS"/*; do
    [ -e "$f" ] || continue
    route_file "$f"
done
