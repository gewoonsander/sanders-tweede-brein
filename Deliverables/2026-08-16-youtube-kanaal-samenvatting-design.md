**Status: DESIGN — wacht op goedkeuring Sander**

# Ontwerp: automatische YouTube-kanaal-samenvatting

## Doel

Sander volgt YouTube-kanalen en wil op de hoogte blijven van nieuwe video's zonder ze zelf te
hoeven kijken. Zodra een gevolgd kanaal een nieuwe video post, moet die automatisch getranscribeerd
en samengevat worden, zodat de kernboodschap 's ochtends klaarligt.

## Vereisten (afgestemd met Sander, 2026-08-16 — inclusief bijstelling na kostenoverweging)

| Keuze | Antwoord |
|---|---|
| Kanaal (eerste) | `https://www.youtube.com/@myicor` ("ICOR with Tom AI Productivity" — al deels bekend, 20+ video's staan al in `PKM/Documents/YouTube-Kennis/`) |
| Check-frequentie | 1x per dag, 's ochtends |
| Filter op relevantie | Geen harde filter — elke nieuwe video krijgt een samenvatting, mét een relevantie-oordeel erbij (zie hieronder) |
| Bestemming | Twee lagen: volwaardige samenvatting → PKM-archief; kort seintje → dagstart |
| Video-type | Alleen gewone video's (geen Shorts, geen livestreams) |
| **Kostenprioriteit** | **Goedkoopst — Mac Mini doet zoveel mogelijk lokaal, geen dure headless Claude Code-sessie per dag** |
| **PKM-samenvatting** | Volwaardig (niet alleen 2-3 zinnen) — dit is het archiefstuk in het tweede brein |
| **Dagstart-seintje** | Nog korter dan de PKM-samenvatting: onderwerp + relevantie-oordeel (bv. "nieuw filmpje over X — [relevant/niet relevant], omdat...") |
| **Relevantie-criterium** | Gebaseerd op Sanders bestaande PKM (Topics/Projects) — geen aparte, apart te onderhouden themalijst |
| **Meldingsinhoud dagstart** | Relevantie-label + één zin toelichting (geen geforceerde actiepunten — de meeste video's van dit kanaal zijn informatief, geen taken) |
| **Verwerkingslimiet** | Geen — bij 1 kanaal en goedkope Haiku-calls is dit verwaarloosbaar; later heroverwegen bij meer kanalen |
| **Queue-gedrag** | Meldingen stapelen altijd op tot ze door `/dagstart` gemeld zijn — nooit stilzwijgend laten vervallen |

## Bestaande bouwstenen (hergebruiken, niet opnieuw uitvinden)

1. **`/transcribeer`** (`~/.claude/skills/transcribeer/`, Daedalus) — haalt per kanaal de nieuwste
   video's op, ondertitels eerst, Whisper-terugval (lokaal of via SSH naar de Mac Mini) als een
   video geen ondertitels heeft. Heeft **al** dedupe op video-ID (`already_done()`) — draai je het
   dagelijks met een klein `--max`, dan worden al verwerkte video's vanzelf overgeslagen.
2. **`Expansions/audio-transcribe/transcribe_inbox.sh`** (Larry-patroon) — het precedent voor
   "goedkope, voorspelbare AI-classificatie zonder headless Claude Code": een directe Anthropic
   API-call (Haiku) met de ANTHROPIC_API_KEY uit de Keychain (`nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY`),
   die JSON teruggeeft (samenvatting, actiepunten, bestemming). Precies dit patroon hergebruiken
   we hier voor de twee samenvattingslagen.
3. **`nl.gewoonsander.adc-verslag-ochtend`** (Mac Mini LaunchAgent) — het precedent voor
   "onbemande ochtendtaak die een CONCEPT-bestand klaarzet, gelezen door `/dagstart`". Hier
   hergebruiken we alléén dát deel (LaunchAgent-structuur, CONCEPT-status, queue-bestand,
   git-commit) — **niet** de headless-Claude-Code-aanroep zelf, want die is duurder dan nodig
   voor een taak die een enkele Haiku-call ook aankan.
4. **`/dagstart`** (`.claude/commands/dagstart.md`) — stap 6 en 7 zijn het precedent voor "lees een
   door een LaunchAgent voorbereid bestand, meld het compact, sla stil over als er niets is".

## Gekozen aanpak: B — losse scriptpijplijn (Larry-patroon), geen headless Claude Code

Na kostenafweging (Sander, 2026-08-16): Aanpak A uit de eerste versie van dit ontwerp (headless
Claude Code-sessie per ochtend) is duurder dan nodig. Een dagelijkse Haiku-API-call — zoals
`transcribe_inbox.sh` al doet — is functioneel voldoende en aanzienlijk goedkoper. Alle zware
lokale rekenkracht (transcriptie, eventueel Whisper) blijft op de Mac Mini; alleen de twee
samenvattingsstappen gaan naar de (goedkope) Anthropic API.

### Pijplijn per run (dagelijks, Mac Mini)

1. **Node/bash-wrapper** (`scripts/youtube-samenvatting-ochtend.mjs` of `.sh`, naar smaak — Larry's
   script is bash, ADC's wrapper is node; bash ligt het dichtst bij `transcribe_inbox.sh` en heeft
   geen extra runtime nodig) roept voor elk kanaal in `config/youtube-kanalen.json`
   (lijst, start met `@myicor`) aan:
   ```
   uv run ~/.claude/skills/transcribeer/transcribeer.py "<url>" --max 5 --out "<kanaal-map>"
   ```
   Dedupe van `/transcribeer` zorgt dat alleen echt nieuwe video's een nieuw bestand opleveren.
2. **Nieuwe bestanden herkennen**: bestandsdatum van vandaag in de kanaal-map (of: bijhouden welke
   video-ID's al een samenvatting-ronde hebben gehad, in een klein state-bestand naast de config).
3. **Per nieuwe video, twee Haiku-calls** (of één call die beide teksten in JSON teruggeeft — net
   als Larry nu al doet met meerdere velden in één response, dus vermoedelijk één call volstaat):
   - **PKM-samenvatting** (volwaardig): kernpunten, geen harde lengtelimiet — dit moet de video
     grotendeels kunnen vervangen.
   - **Dagstart-seintje**: onderwerp + relevantie-oordeel + één zin toelichting. Voor het
     relevantie-oordeel krijgt de prompt een beknopte lijst van Sanders bestaande PKM-Topics/Projects
     mee (bv. bestandsnamen uit `PKM/My Life/Topics/` en `PKM/My Life/Projects/`) als context om
     tegen te beoordelen.
4. **Wegschrijven**:
   - PKM-samenvatting toegevoegd aan het bestaande transcript-bestand (bovenaan, net als Larry dat
     nu al bij audio-transcribe doet) — dit blijft het archiefstuk.
   - Dagstart-seintje toegevoegd aan een groeiend queue-bestand,
     `PKM/Documents/YouTube-Kennis/_nieuw-voor-dagstart.md`, met bovenaan
     `**Status: CONCEPT — ter review door Sander**` (ADC-patroon). Nieuwe entries komen erbij,
     niets wordt overschreven — dit bestand stapelt op tot `/dagstart` het leegt.
5. **Commit** de gewijzigde/nieuwe bestanden lokaal (niet pushen, zelfde patroon als ADC en
   audio-transcribe).
6. **Log** een korte samenvatting naar `~/Library/Logs/youtube-samenvatting-ochtend.log`.

### `/dagstart`-uitbreiding

Nieuwe stap (tussen de bestaande stap 6 en 7): check `_nieuw-voor-dagstart.md`. Bestaat het en
heeft het inhoud: meld compact per video (onderwerp, relevantie-label, toelichtingszin, link),
en **wis de gemelde entries** uit het bestand na melding (queue leegt bij het melden, niet bij het
schrijven — zo gaat er nooit iets stilzwijgend verloren als Sander een paar dagen geen `/dagstart`
draait). Geen entries: sla de stap stilzwijgend over, net als de andere optionele stappen.

## Verworpen alternatieven (uit de vorige versie van dit ontwerp)

- **Aanpak A — headless Claude Code (ADC-patroon voor de hele taak):** verworpen op kosten. Een
  volledige agentic sessie per ochtend voor een taak die een enkele Haiku-call ook aankan, is
  duurder dan nodig.
- **Aanpak C — alles in `transcribeer.py` zelf via een `--samenvat`-vlag:** nog steeds een geldige
  optie voor de script-structuur, maar de dagstart-specifieke logica (queue, CONCEPT-status,
  relevantie-tegen-PKM) hoort niet in een general-purpose transcriptie-tool. Gekozen voor een apart
  wrapper-script dat `/transcribeer` aanroept, zodat `/transcribeer` zelf ongewijzigd en
  breed herbruikbaar blijft.

## Concreet bouwplan (bij goedkeuring)

1. `config/youtube-kanalen.json` — lijst gevolgde kanalen (`{naam, url}`), start met `@myicor`.
2. `scripts/youtube-samenvatting-ochtend.sh` — roept per kanaal `/transcribeer` aan, detecteert
   nieuwe bestanden, doet de Haiku-call (Keychain-key, zelfde patroon als `transcribe_inbox.sh` —
   nieuw Keychain-item of hergebruik van het bestaande audio-transcribe-item, nog te bepalen),
   schrijft PKM-samenvatting + dagstart-queue-entry, committed, logt.
3. LaunchAgent-plist op de Mac Mini (`nl.gewoonsander.youtube-samenvatting-ochtend`), 07:00 (vóór
   `nl.gewoonsander.adc-verslag-ochtend`, zodat beide ochtendbronnen klaarstaan tegen de tijd dat
   Sander `/dagstart` draait).
4. Nieuwe stap in `.claude/commands/dagstart.md` (tussen stap 6 en 7): queue lezen, melden, legen.
5. Testen: `launchctl kickstart` handmatig draaien, verifiëren dat het queue-bestand correct
   verschijnt/aanvult, en dat een volgende `/dagstart` het meldt en leegt (ook getest: twee dagen
   niet `/dagstart` draaien → beide dagen se meldingen moeten allebei verschijnen bij de derde run).

## Open aandachtspunten

- **Keychain-key hergebruiken of nieuwe aanmaken?** `transcribe_inbox.sh` gebruikt al
  `nl.gewoonsander.audio-transcribe.ANTHROPIC_API_KEY` — kan 1-op-1 hergebruikt worden, of een
  apart item voor scheiding van verantwoordelijkheid. Kleine keuze, geen blokkade.
- **Whisper-duur bij ontbrekende ondertitels:** blijft ongewijzigd risico t.o.v. de vorige versie
  van dit ontwerp — ICOR with Tom heeft doorgaans ondertitels, maar bij een toekomstig kanaal
  zonder ondertitels kan een run langer duren. Geen probleem zolang de run vóór Sanders ochtend
  klaar is.
- **Relevantie-context uit PKM:** welke mappen precies meegeven aan de Haiku-prompt (alleen
  `Topics/` en `Projects/`, of breder)? Voorstel: bestandsnamen (niet volledige inhoud) van
  `PKM/My Life/Topics/` en `PKM/My Life/Projects/` — genoeg context voor een relevantie-oordeel,
  zonder een zware prompt.
