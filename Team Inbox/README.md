# Team Inbox

Dit is de **enige inbox die Sander bewust hoeft te beoordelen**. Hier komen ruwe
inputs en alle uitzonderingen terecht waarvoor het team nog geen zekere
canonieke bestemming kan bepalen. De route en levenscyclus per informatietype
staan canoniek in [[GL-020-informatie-invoer-uitvoer-en-levenscyclusregister]].

Alles wat je hierin zet wordt beoordeeld en gerouteerd. Screenshots, voice
memo's, visitekaartjes, PDF's, losse gedachten en links mogen rechtstreeks naar
de root. Zeg daarna bijvoorbeeld: "Hermes, verwerk de Team Inbox."

## How it works

- You drop a file (or paste content into a `.md` file)
- **Hermes** routeert het naar de juiste specialist (meestal **Penn** voor capture)
- The specialist files it into PKM, CRM, Journal, or wherever it belongs
- Cross-links via `[[wikilinks]]` get added automatically
- The processed input gets removed from Team Inbox once filed

## What goes here

- Screenshots of conversations, business cards, whiteboard photos
- Voice memos to be transcribed
- Random ideas you want captured but don't want to file yourself
- Links naar artikelen voor **Athena** om verder te onderzoeken
- A quick `.md` braindump at end of day for **Penn** to file across PKM

If you know exactly where a note belongs, write it directly in PKM. Team Inbox is for *"I have something, not sure where, just take it."*

## Subfolders (automation-fed, not manual drop zones)

De root en deze twee automatiseringssubmappen vormen samen één Team Inbox. De
submappen worden gevuld door de `nl.gewoonsander.downloads-router` launchd-agent
(`Expansions/downloads-router/route_downloads.sh`), die passende bestanden uit
`~/Downloads` hierheen routeert:

- `Team Inbox/Screenshots/` - screenshot-shaped files that land in Downloads (e.g. dragged out of Slack, saved from a browser, shared from another device), renamed to `YYYY-MM-DD_HHMM_omschrijving.ext`.
- `Team Inbox/Documents/` - PDFs/docs/spreadsheets that land in Downloads, moved here unchanged.

This is separate from a direct screen capture (Cmd+Shift+3/4/5), which macOS saves straight into the `Team Inbox/` root per the `com.apple.screencapture` default location - it never touches `Screenshots/`.

Whoever processes the inbox (see [[Team Knowledge/Workstreams/WS-001-daily-journaling]]) must check both subfolders, not just the root.

## Voeding: machine-tot-machine, geen menselijke submap

`Team Inbox/Audio Captures/` en `Team Inbox/Documents/` worden ook bewaakt door de
food-capture-pijplijn (LaunchAgent `nl.gewoonsander.food-capture`, script
`Expansions/mypka-cockpit/scripts/watch-food-inbox.py`): foto's in `Documents/` en
transcripten in `Audio Captures/` worden automatisch beoordeeld en direct in het
voedingslogboek gefiled (`process-food-capture.py` → `food_log.py`) — geen mensuele
review, geen aparte `Voeding/`-submap. Zie [[SOP-017-verwerk-voedingsregistratie]] voor
het contract en de volledige LaunchAgent-inventaris in
[[Team Knowledge/Guidelines/GL-018-integratie-en-software-register]] voor wie wat
bewaakt. Er heeft ooit een aparte `Team Inbox/Voeding/`-staging bestaan
(`classify_food_inbox.sh`); die is op 2026-08-11 uitgefaseerd toen bleek dat hij
verweesde bestanden achterliet die niemand oppikte — niet opnieuw invoeren.

## Technische bronnen zijn geen extra inboxen

Downloads, e-mail, apparaatcaptures, werkmappen en tijdelijk iCloud `00-inbox`
kunnen invoer aanleveren. Sander hoeft die plekken niet als losse wachtrijen te
controleren. Automatisering verwerkt alleen ondubbelzinnige gevallen; ieder
twijfelgeval komt terug in deze Team Inbox met een reden. Na geslaagde routering
en verificatie wordt het verwerkte invoerbestand verwijderd.
