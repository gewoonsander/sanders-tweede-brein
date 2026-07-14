# Team Knowledge / scripts

Utility scripts for this myPKA. Most are one-shot (migrate or repair content,
then forget about them) — see `migrate-inline-fields-to-frontmatter.py` below.
`perplexity_search.py` is the exception: a recurring tool Athena calls as part
of her normal research protocol, not a one-time migration.

---

## `migrate-inline-fields-to-frontmatter.py`

**Status:** ships in v1.3.0. Optional. Safe to delete after you've migrated.

### What it does

Pre-v1.3.0, you may have written entity notes with metadata as inline body
text:

```markdown
# Dr. Schmidt

**Full name:** Dr. Andrea Schmidt
**Role:** practicing physician
**Organization:** [[dr-schmidt-clinic]]
```

v1.3.0 makes **YAML frontmatter** the canonical source of truth (per
`Guidelines/GL-002-frontmatter-conventions.md` and the entity templates in
`Templates/`). The Properties tab in mypka-interface v0.3.4+ parses
frontmatter; the SQLite converter (SOP-002) extracts structured columns
from frontmatter. Inline body fields parse to **nothing** — silent data
loss.

This script scans your myPKA, detects the old `**Field:** value` pattern,
and rewrites your notes with a YAML frontmatter block on top.

### What it touches

It only looks inside the eight canonical entity folders:

```
PKM/CRM/People/
PKM/CRM/Organizations/
PKM/My Life/Projects/
PKM/My Life/Goals/
PKM/My Life/Habits/
PKM/My Life/Topics/
PKM/My Life/Key Elements/
PKM/Documents/
```

It **skips**:

- files that already have YAML frontmatter (no double-write)
- `INDEX.md`, `README.md`, `_template.md` files
- folders outside the eight entity folders above (e.g. `PKM/Journal/`,
  `PKM/Images/`, anything under `Team Knowledge/`)

### How to run it

The script is **dry-run by default** — it prints unified diffs and does not
touch your files until you pass `--apply`.

```bash
# 1. Preview what would change (safe; reads only)
python3 "Team Knowledge/scripts/migrate-inline-fields-to-frontmatter.py" .

# 2. Apply the rewrites (originals are saved as `<file>.bak`)
python3 "Team Knowledge/scripts/migrate-inline-fields-to-frontmatter.py" . --apply

# 3. (optional) Limit to one entity folder
python3 "Team Knowledge/scripts/migrate-inline-fields-to-frontmatter.py" . \
    --only "PKM/CRM/People"

# 4. (optional) Quieter preview (summary only, no diffs)
python3 "Team Knowledge/scripts/migrate-inline-fields-to-frontmatter.py" . --quiet
```

The first positional argument is your **myPKA root** — the folder that
contains `PKM/`, `Team Knowledge/`, etc. Run from your myPKA and pass `.`,
or pass an absolute path from anywhere.

### Requirements

- Python 3.9 or newer (preinstalled on macOS, most Linux distros, and
  Windows via the Microsoft Store)
- **No third-party packages.** Stdlib only.

### Safety

- Default mode is `--dry-run`. You will not accidentally overwrite anything.
- `--apply` writes a `.bak` sibling next to every modified file before
  rewriting it. To roll back a single file: `mv note.md.bak note.md`.
- Files with existing YAML frontmatter are skipped entirely. The script is
  idempotent — running it twice is a no-op the second time.
- Unknown inline labels (labels not in the field map for the entity type)
  are **left in the body untouched** and reported in the per-file summary
  so you can decide what to do with them.

### When to delete this script

Once you've run it on your myPKA and you're satisfied with the result, you
can safely delete `Team Knowledge/scripts/migrate-inline-fields-to-frontmatter.py`
and this README. They serve no day-to-day purpose; the canonical authority
for frontmatter shape going forward is `Guidelines/GL-002-frontmatter-conventions.md`
and `Templates/`.

If you'd rather keep them around in case you ingest legacy notes later,
that's also fine. The script will only ever rewrite files that match its
strict pattern (bold-label inline fields in entity folders without
existing frontmatter), so it is safe to leave installed.

### Reporting issues

If the script mis-extracts a field or mangles a note, please open an issue
with:

1. The dry-run diff for the affected file
2. The inline pattern it failed on
3. The entity folder

The script's regex is conservative by design (it requires `**Label:** value`
on its own line). False negatives (skipped fields) are preferred to false
positives (corrupted prose).

---

## `perplexity_search.py`

**Status:** active, recurring use. Do not delete — Athena calls this directly.

### What it does

Queries Perplexity's Sonar API (`https://api.perplexity.ai`) for a grounded,
cited answer — a second, mechanically independent search path alongside the
built-in WebSearch tool. This is what powers the dual-independent-search
escalation in `Team/Athena - Researcher/AGENTS.md` (Protocol Step 3): for
high-impact numbers/statistics, already-contradictory findings, or
explicitly high-stakes tasks, Athena queries both paths and treats
disagreement between them as the signal to dig deeper.

Reviewed and approved by Argus (2026-07-10) — read-only network call, no
retry loop, credential never logged or echoed back, `.env` confirmed
git-ignored.

### How to run it

```bash
python3 "Team Knowledge/scripts/perplexity_search.py" "your question here"

# cheaper model (default is sonar-pro)
python3 "Team Knowledge/scripts/perplexity_search.py" "your question here" --model sonar
```

Prints the answer followed by a numbered source list. Non-zero exit and a
`[FOUT]` message on stderr if the key is missing or the call fails — never
crashes, never leaks the key in the error output.

### Requirements

- `PERPLEXITY_API_KEY` in `Team Knowledge/.env` (pay-as-you-go, no
  subscription — see console.perplexity.ai). Stdlib only, no pip installs.

### Cost note

`sonar-pro` (the default) costs more per call than `sonar`. Athena should
default to `sonar-pro` for the escalation cases above (accuracy matters more
than the cents saved) but nothing stops a lower-stakes caller from passing
`--model sonar`.

---

## `sheets_write.py`

**Status:** active, recurring use. Writes local CSV/TSV data into a tab of
a Google Sheet — set up 13-07-2026 to get the verbouwing-materialenlijst
into the "verbouwing huismanstaat 34" spreadsheet, but reusable for any
sheet Sander's own Google account can already open.

**Not yet reviewed by Argus.** This script handles an OAuth credential
with broad Sheets access (see Security note below) — recommended to get a
security pass before relying on it for anything sensitive.

### What it does

Authenticates as Sander's own Google account via OAuth (no service account,
no separate share-step needed — if you can already open the sheet in your
browser, this script can write to it). Reads a local CSV or TSV file and
writes it into a named tab, creating the tab if it doesn't exist yet.

### One-time setup (do this once, in your own Google Cloud project)

1. Go to <https://console.cloud.google.com/> and create a new project
   (e.g. `sanders-tweede-brein-automation`).
2. Enable two APIs for that project: **Google Sheets API** and
   **Google Drive API** (APIs & Services → Library → search each → Enable).
3. Configure the OAuth consent screen (APIs & Services → OAuth consent
   screen) — choose **External**, fill in an app name, your own email as
   support/developer contact. You can leave it in "Testing" status and add
   your own Google account under **Test users**.
4. Create credentials: APIs & Services → Credentials → Create Credentials
   → OAuth client ID → Application type **Desktop app**. Download the JSON.
5. Save that downloaded file as:
   ```
   Team Knowledge/.secrets/google-oauth-client.json
   ```
   (create the `.secrets/` folder if it doesn't exist yet — it's already
   git-ignored, so nothing here ever gets committed).

### First run (one-time browser consent)

```bash
cd "Team Knowledge/scripts"
.venv/bin/python3 sheets_write.py <spreadsheet_id_or_url> "<tab naam>" <data.tsv>
```

The first call opens your browser for a one-time Google login/consent
screen (log in, click Allow). After that it caches a refresh token at
`Team Knowledge/.secrets/google-authorized-user.json` — every later run is
silent, no browser needed, until you revoke access.

Add `--append` to add rows after whatever is already in the tab instead of
clearing it first.

### Requirements

- Python 3.9+, plus the `gspread` package — already installed in
  `Team Knowledge/scripts/.venv/` (also git-ignored). Use that venv's
  Python (`.venv/bin/python3`), not the system one.

### Security

- Credential files live only in `Team Knowledge/.secrets/` — git-ignored,
  never committed.
- Scopes requested: `spreadsheets` (read/write) and `drive.metadata.readonly`
  (needed to look sheets up by ID/URL) — no access to Drive file *contents*
  beyond Sheets themselves.
- The script only ever touches the spreadsheet ID you pass on the command
  line — it can't discover or iterate over your other files.
- To revoke access entirely: Google Account → Security → Third-party
  access → remove the app, then delete
  `Team Knowledge/.secrets/google-authorized-user.json`.
