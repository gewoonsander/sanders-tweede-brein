#!/usr/bin/env python3
"""Write a local CSV/TSV file into a tab of a Google Sheet.

First run needs a one-time browser login (see README.md in this folder).
After that, the cached token refreshes automatically — no browser needed.

Usage:
    .venv/bin/python3 sheets_write.py <spreadsheet_id_or_url> <tab_name> <data_file> [--append]

Examples:
    .venv/bin/python3 sheets_write.py 1giz0qmy... "Materialenlijst" materials.tsv
    .venv/bin/python3 sheets_write.py 1giz0qmy... "Materialenlijst" materials.tsv --append
"""

import argparse
import csv
import re
import sys
from pathlib import Path

import gspread

SECRETS_DIR = Path(__file__).resolve().parent.parent / ".secrets"
CREDENTIALS_FILE = SECRETS_DIR / "google-oauth-client.json"
AUTHORIZED_USER_FILE = SECRETS_DIR / "google-authorized-user.json"


def extract_spreadsheet_id(id_or_url: str) -> str:
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", id_or_url)
    return match.group(1) if match else id_or_url


def read_rows(data_file: Path) -> list[list[str]]:
    with data_file.open(newline="", encoding="utf-8") as f:
        first_line = f.readline()
        f.seek(0)
        delimiter = "\t" if "\t" in first_line else ","
        return list(csv.reader(f, delimiter=delimiter))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("spreadsheet", help="Spreadsheet ID or full Google Sheets URL")
    parser.add_argument("tab", help="Tab/worksheet name (created if it doesn't exist)")
    parser.add_argument("data_file", type=Path, help="Local CSV or TSV file to write")
    parser.add_argument("--append", action="store_true", help="Append after existing rows instead of clearing the tab first")
    args = parser.parse_args()

    if not CREDENTIALS_FILE.exists():
        print(f"[FOUT] OAuth-clientbestand ontbreekt: {CREDENTIALS_FILE}", file=sys.stderr)
        print("Zie README.md in deze map voor de setup-stappen.", file=sys.stderr)
        return 1

    rows = read_rows(args.data_file)
    if not rows:
        print("[FOUT] Geen data gevonden in het bestand.", file=sys.stderr)
        return 1

    gc = gspread.oauth(
        credentials_filename=str(CREDENTIALS_FILE),
        authorized_user_filename=str(AUTHORIZED_USER_FILE),
    )
    sh = gc.open_by_key(extract_spreadsheet_id(args.spreadsheet))

    try:
        ws = sh.worksheet(args.tab)
    except gspread.WorksheetNotFound:
        ws = sh.add_worksheet(title=args.tab, rows=max(len(rows) + 10, 100), cols=max(len(rows[0]) + 5, 20))

    start_row = 1
    if args.append:
        start_row = len(ws.get_all_values()) + 1
    else:
        ws.clear()

    ws.update(range_name=f"A{start_row}", values=rows, value_input_option="USER_ENTERED")
    print(f"Klaar: {len(rows)} rijen geschreven naar tabblad '{args.tab}'.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
