#!/bin/bash

INBOX="/Users/sandervanockenburg-zwaan/Documents/Documenten - Mac mini van Sander/sanders-tweede-brein/Team Inbox/Audio Captures"
DELIVERABLES="/Users/sandervanockenburg-zwaan/Documents/Documenten - Mac mini van Sander/sanders-tweede-brein/Deliverables"
SCRATCH="/tmp/audio_transcribe_scratch"

mkdir -p "$SCRATCH"
mkdir -p "$DELIVERABLES"

for f in "$INBOX"/*.m4a "$INBOX"/*.mp3 "$INBOX"/*.wav "$INBOX"/*.aiff; do
    [ -f "$f" ] || continue

    filename=$(basename "$f")
    name="${filename%.*}"
    output="$DELIVERABLES/${name}.md"

    [ -f "$output" ] && continue

    echo "Transcriberen: $filename"

    mp3="$SCRATCH/${name}.mp3"
    ffmpeg -i "$f" -ar 16000 -ac 1 -c:a libmp3lame "$mp3" -y -loglevel quiet

    whisper "$mp3" --model large-v3 --language nl --output_dir "$SCRATCH" --output_format txt

    transcript_file="$SCRATCH/${name}.txt"

    if [ -f "$transcript_file" ]; then
        date_str=$(date "+%Y-%m-%d %H:%M")
        echo "---" > "$output"
        echo "date: $date_str" >> "$output"
        echo "source: Audio Capture" >> "$output"
        echo "original_file: $filename" >> "$output"
        echo "---" >> "$output"
        echo "" >> "$output"
        echo "# Transcriptie: $name" >> "$output"
        echo "" >> "$output"
        cat "$transcript_file" >> "$output"
        echo "Opgeslagen: $output"
    else
        echo "Fout: transcriptie mislukt voor $filename"
    fi
done

rm -rf "$SCRATCH"
echo "Klaar."
