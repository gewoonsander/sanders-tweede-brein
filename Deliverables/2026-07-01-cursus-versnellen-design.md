---
date: 2026-07-01
author: Mack
status: geimplementeerd
topic: 14 Day Filmmaker — versnelde batch-verwerking (opname → transcript → samenvatting → beslissing)
---

# Design: Cursus "14 Day Filmmaker" versneld doornemen

## Doel

Sander wil niet elke les van "14 Day Filmmaker" (contentcreator.com, Wisdia) volledig moeten afkijken voordat hij Dart Buddies onboarding-video's kan opnemen. Hij wil per les een transcript + samenvatting krijgen, zodat hij per les kan beslissen: **bekijken** (echt de video kijken) of **skippen** (samenvatting was genoeg). Dit moet werken over tientallen lessen heen, niet één voor één handmatig.

## Uitgangspunt — wat al bestaat, wordt hergebruikt

- Whisper (`large-v3`) + ffmpeg staan al geïnstalleerd.
- `~/Documents/Scripts/transcribeer-cursusopname.sh <pad> [taal]` — bestaand, werkend script. Transcribeert één bestand naar `~/Documents/Werkarchief/cursus-transcripties/`.
- OBS-opname blijft handmatig — géén DRM-omzeiling, géén automatisering van de Wisdia-player. Dat is en blijft Sanders eigen scherm+geluid-opname van content die hij legitiem mag bekijken. Dit ontwerp raakt dat niet aan.
- Ollama draait lokaal met `llama3.2:3b` beschikbaar (gecheckt: `ollama list`) — relevant voor optie B hieronder.

## Wat dit ontwerp toevoegt

1. Een **routine** om meerdere lessen achter elkaar op te nemen met een consistente bestandsnaam, zodat verwerking daarna geautomatiseerd kan.
2. Een **batch-transcriptiescript** dat een hele map met opnames in één run verwerkt (i.p.v. het bestaande script steeds los aan te roepen).
3. Een **lichte voortgangs-tracker** (één CSV/markdown-bestand) die per les bijhoudt: opgenomen → getranscribeerd → samengevat → beslissing (bekijken/skip/nog niet beslist).
4. Een samenvattingsstap — drie varianten hieronder, dit is het echte ontwerpkeuzepunt.

## Opnameroutine (licht maken van het OBS-ritueel)

Geen automatisering van OBS zelf (geen scripted start/stop nodig — dat voegt complexiteit toe voor weinig winst, en OBS scripting zit buiten Mack's mandaat qua nut/risico-afweging). In plaats daarvan: een naamgevingsafspraak zodat de rest van de pipeline automatisch kan meelezen.

**Afspraak:** Sander neemt per sessie 3–5 lessen achter elkaar op (OBS start/stop tussen lessen kost een paar seconden, geen reden om dat te automatiseren). Bestandsnaam bij het stoppen van elke opname:

```
DagXX-LesYY-korte-titel.mkv
# bv. Dag07-Les03-jcuts-en-lcuts.mkv
```

Alle bestanden van een batch komen in één inbox-map:

```
~/Documents/Werkarchief/cursus-opnames-inbox/
```

Dat is de enige nieuwe handmatige stap — verder identiek aan wat Sander al doet, alleen: niet meteen na elke losse les het transcriptiescript aanroepen, maar wachten tot er een stapel ligt.

## Nieuwe bestandsstructuur

```
~/Documents/Werkarchief/
├── cursus-opnames-inbox/         ← nieuw: ruwe OBS-opnames, wachtend op verwerking
│   └── verwerkt/                 ← nieuw: opnames die al getranscribeerd zijn (afvoer, geen dubbel werk)
├── cursus-transcripties/         ← bestaand: whisper .txt output
├── cursus-samenvattingen/        ← nieuw: één .md samenvatting per les
└── cursus-voortgang.csv          ← nieuw: de tracker
```

Tracker-kolommen: `dag, les, titel, bronbestand, transcript_status, samenvatting_status, beslissing, notitie`
Waarden `beslissing`: `todo` / `bekijken` / `skip`.

## Batch-transcriptiescript (nieuw)

`~/Documents/Scripts/batch-transcribeer-cursusopnames.sh [inbox-map]`

Gedrag:
- Loopt over alle video/audio-bestanden in de inbox-map die nog niet in de tracker staan (idempotent — check op bestandsnaam, geen dubbel werk bij herhaald draaien).
- Parseert `Dag` / `Les` / `titel` uit de bestandsnaam via het `DagXX-LesYY-titel` patroon. Bestandsnamen die niet matchen: worden gewoon getranscribeerd, maar krijgen `dag=?`/`les=?` in de tracker zodat Sander het handmatig kan corrigeren — géén harde stop, alleen een vlag.
- Roept per bestand dezelfde whisper-aanroep aan als het bestaande script (zelfde model, zelfde output-map) — geen dubbele logica, factored uit het bestaande script.
- Bij een whisper-fout op één bestand: logt de fout, zet die rij op `transcript_status=fout`, en gaat door met de rest van de batch. Eén kapotte opname mag de hele batch niet blokkeren.
- Verplaatst verwerkte brondbestanden naar `verwerkt/` na succesvolle transcriptie (voorkomt re-run-verwarring; brondata blijft bewaard, wordt niet verwijderd).
- Output: transcript-bestanden zoals nu, plus een bijgewerkte tracker-rij per les.

Dit lost het "batchen i.p.v. één voor één aanroepen"-punt op zonder de bestaande scriptbouwsteen opnieuw uit te vinden.

## Samenvattingsstap — drie opties

Dit is het punt waar ik een keuze aan je voorleg.

### Optie A — Handmatig, maar gebatcht (laagste complexiteit)
Na een batch-transcriptie geef je in één Claude-sessie alle nieuwe `.txt`-bestanden tegelijk mee ("vat de transcripten in cursus-transcripties samen die nog op todo staan"). Claude schrijft per les een `.md`-samenvatting naar `cursus-samenvattingen/` en werkt de tracker bij (status + korte kijk/skip-suggestie, jij beslist definitief).
- **Voordeel:** geen nieuwe infrastructuur, hoogste samenvattingskwaliteit, past in je bestaande werkwijze.
- **Nadeel:** vereist nog steeds een expliciete "nu samenvatten"-actie van jou per batch (wel één actie voor 3-5 lessen tegelijk, niet meer per les).

### Optie B — Volledig lokaal geautomatiseerd (Ollama)
Het batch-script roept na transcriptie automatisch `llama3.2:3b` (al geïnstalleerd) aan per transcript, genereert een Nederlandstalige bullet-samenvatting + kijk/skip-suggestie, en zet dit direct in `cursus-samenvattingen/` en de tracker. Kan 's nachts of onbeheerd draaien over een hele stapel.
- **Voordeel:** nul handmatige stappen na het opnemen — volledig fire-and-forget tot de tracker klaar ligt om te beslissen.
- **Nadeel:** een 3B-model is merkbaar zwakker in samenvatten dan Claude — kans op oppervlakkige of onnauwkeurige samenvattingen bij technische editing-content. Extra lokale afhankelijkheid om te onderhouden.

### Optie C — Hybride (batch lokaal, samenvatting via Claude, in één doorlopende sessie)
Zelfde als optie A qua kwaliteit, maar het batch-script laat aan het eind zien welke lessen "transcript klaar, wacht op samenvatting" zijn, en jij triggert één keer per stapel: "vat de nieuwe cursustranscripten samen". Verschil met A is vooral scherpere afbakening: het script doet nooit meer dan transcriptie + tracker-update; samenvatten blijft altijd een expliciete, aparte stap zodat je nooit een halve of foutieve auto-samenvatting in je tracker krijgt zonder dat je het ziet gebeuren.

**Mijn aanbeveling: Optie A/C** (in de praktijk vrijwel hetzelfde) — geen nieuwe afhankelijkheid, beste samenvattingskwaliteit voor technische content waar precisie (welke tool, welke instelling, welke techniek) er echt toe doet voor je beslissing kijken/skippen. Optie B is aantrekkelijk voor volume maar het risico dat een zwak lokaal model een cruciale techniek verkeerd samenvat — en je hem daardoor onterecht skipt — weegt zwaarder dan de tijdswinst.

## Rate limits / retry / idempotentie (operationeel)

- Batch-script: idempotent op bestandsnaam (skip wat al in tracker staat), per-bestand foutafhandeling (één mislukte transcriptie stopt de batch niet), bronbestanden worden verplaatst niet verwijderd (veilig herhaalbaar).
- Geen externe API's, geen rate limits van toepassing — alles lokaal (Whisper, evt. Ollama).
- Whisper `large-v3` op langere batches kost tijd (reken op enkele minuten per les, afhankelijk van lengte) — script logt start/eind per bestand zodat een lange batch-run volgbaar blijft.

## Wat dit ontwerp NIET doet

- Geen automatisering van de Wisdia-player of het aftappen van de cursus-content zelf.
- Geen wijziging aan Team Knowledge / SOPs — dit is een persoonlijke tool in Sanders eigen mappen (`~/Documents/Scripts/`, `~/Documents/Werkarchief/`), buiten `PKM/` en buiten de acht entity-folders. Geen frontmatter-verplichting van toepassing.
- Geen entity-notes in het myPKA — als Sander later specifieke technieken uit een samenvatting permanent in zijn PKM wil vastleggen (bv. als Topic-note "J-cuts en L-cuts"), is dat een aparte, expliciete stap voor Silas/Penn — niet onderdeel van deze pipeline.

## Implementatievolgorde (bij goedkeuring)

1. `~/Documents/Werkarchief/cursus-opnames-inbox/` (+ `verwerkt/`) en `cursus-samenvattingen/` aanmaken.
2. `cursus-voortgang.csv` aanmaken met kolomkoppen.
3. `batch-transcribeer-cursusopnames.sh` schrijven (hergebruikt whisper-aanroep uit bestaand script), testen op 1-2 dummy-bestanden.
4. Tracker-update-logica in het script verifiëren (idempotentie: tweede run op dezelfde map doet niets dubbel).
5. Kort testen met een echte batch van 2-3 opgenomen lessen end-to-end (opname → batch-script → transcript → tracker-rij).
6. Samenvattingsstap volgens gekozen optie (A/B/C) aansluiten.

## Keuze nodig

**A** — Ga verder met optie A/C (handmatige trigger, Claude-kwaliteit samenvatting, mijn aanbeveling)
**B** — Ga verder met optie B (volledig lokaal via Ollama, geen handmatige trigger)
**C** — Wil eerst iets aanpassen aan het ontwerp voordat je akkoord geeft
