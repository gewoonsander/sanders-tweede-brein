# Team Inbox

Where you drop raw inputs for the team to process.

Anything you throw in here gets filed. Screenshots, voice memos, business cards, PDFs, half-formed thoughts in a `.md` file, links to articles - drop it in, then say "Larry, process the inbox" (or just "Hi Larry, here's something new").

## How it works

- You drop a file (or paste content into a `.md` file)
- **Larry** routes it to the right specialist (usually **Penn** for capture)
- The specialist files it into PKM, CRM, Journal, or wherever it belongs
- Cross-links via `[[wikilinks]]` get added automatically
- The processed input gets removed from Team Inbox once filed

## What goes here

- Screenshots of conversations, business cards, whiteboard photos
- Voice memos to be transcribed
- Random ideas you want captured but don't want to file yourself
- Links to articles for **Pax** to research deeper
- A quick `.md` braindump at end of day for **Penn** to file across PKM

If you know exactly where a note belongs, write it directly in PKM. Team Inbox is for *"I have something, not sure where, just take it."*

## Subfolders (automation-fed, not manual drop zones)

Two subfolders exist alongside the flat root and are populated by the `nl.gewoonsander.downloads-router` launchd agent (`Expansions/downloads-router/route_downloads.sh`), which watches `~/Downloads` and moves matching files here automatically:

- `Team Inbox/Screenshots/` - screenshot-shaped files that land in Downloads (e.g. dragged out of Slack, saved from a browser, shared from another device), renamed to `YYYY-MM-DD_HHMM_omschrijving.ext`.
- `Team Inbox/Documents/` - PDFs/docs/spreadsheets that land in Downloads, moved here unchanged.

This is separate from a direct screen capture (Cmd+Shift+3/4/5), which macOS saves straight into the `Team Inbox/` root per the `com.apple.screencapture` default location - it never touches `Screenshots/`.

Whoever processes the inbox (see [[Team Knowledge/Workstreams/WS-001-daily-journaling]]) must check both subfolders, not just the root.
