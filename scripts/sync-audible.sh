#!/usr/bin/env bash
# sync-audible.sh
# Exports Audible library to TSV and syncs to mypka.db audiobooks table.
# Usage: ./scripts/sync-audible.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TSV_PATH="$REPO_ROOT/PKM/audible-library.tsv"
DB_PATH="$REPO_ROOT/mypka.db"

echo "[sync-audible] Exporting Audible library..."
audible library export --output "$TSV_PATH" --format tsv
echo "[sync-audible] Exported to $TSV_PATH"

echo "[sync-audible] Importing into mypka.db..."

COUNT=$(python3 - "$TSV_PATH" "$DB_PATH" << 'PYEOF'
import sys
import csv
import sqlite3

tsv_path = sys.argv[1]
db_path  = sys.argv[2]

conn = sqlite3.connect(db_path)
cur  = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS audiobooks (
    asin                        TEXT PRIMARY KEY,
    title                       TEXT,
    subtitle                    TEXT,
    extended_product_description TEXT,
    authors                     TEXT,
    narrators                   TEXT,
    series_title                TEXT,
    series_sequence             TEXT,
    genres                      TEXT,
    runtime_length_min          INTEGER,
    is_finished                 TEXT,
    percent_complete            REAL,
    rating                      REAL,
    num_ratings                 INTEGER,
    date_added                  TEXT,
    release_date                TEXT,
    cover_url                   TEXT,
    purchase_date               TEXT
)
""")

count = 0
with open(tsv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        cur.execute("""
            INSERT OR REPLACE INTO audiobooks
            (asin, title, subtitle, extended_product_description, authors, narrators,
             series_title, series_sequence, genres, runtime_length_min, is_finished,
             percent_complete, rating, num_ratings, date_added, release_date,
             cover_url, purchase_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            row['asin'], row['title'], row['subtitle'], row['extended_product_description'],
            row['authors'], row['narrators'], row['series_title'], row['series_sequence'],
            row['genres'],
            int(row['runtime_length_min'])   if row.get('runtime_length_min')  else None,
            row['is_finished'],
            float(row['percent_complete'])   if row.get('percent_complete')    else None,
            float(row['rating'])             if row.get('rating')              else None,
            int(row['num_ratings'])          if row.get('num_ratings')         else None,
            row['date_added'], row['release_date'], row['cover_url'], row['purchase_date']
        ))
        count += 1

conn.commit()
conn.close()
print(count)
PYEOF
)

echo "[sync-audible] Done — $COUNT boeken geimporteerd/bijgewerkt in mypka.db"
