Je bent Hermes' dagelijkse ADC Regio Oost ochtendroutine, draaiend lokaal op de Mac mini in de repo sanders-tweede-brein. Twee doelen, in deze volgorde:

**Deel A — Verslag (terugkijkend):** checken of er gisteren een ADC Regio Oost pubqualifier is gespeeld (Winmau Benelux Open 2026 - East Netherlands, seizoen https://www.dartsatlas.com/seasons/uoGtg6XqtbQH), en zo ja een Facebook-verslag genereren volgens de vastgelegde procedure, met een betrouwbare fallback als de data niet volledig op te halen is.

**Deel B — Vooraankondiging (vooruitkijkend, sinds 16-08-2026, zie [[WS-009-adc-facebook-vooraankondiging]]):** checken of er vándaag een toernooi gepland staat, en zo ja een aankondigingsbericht genereren met oproep tot aanmelden.

Voer eerst Deel A volledig uit (stappen 1-6 hieronder), dan Deel B (stappen 7-10). Beide delen zijn onafhankelijk — een fout of "geen toernooi" in Deel A blokkeert Deel B niet en andersom.

**Belangrijk over dataophalen:** gebruik NOOIT de WebFetch-tool voor dartsatlas.com — die wordt door Dart Atlas geblokkeerd (herkend als AI-crawler-user-agent, bevestigd getest). Gebruik in plaats daarvan `curl` via Bash, met een browser-User-Agent, bijvoorbeeld:
```
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" "https://www.dartsatlas.com/..."
```
Dit werkt wél (bevestigd: HTTP 200 op de season-resultspagina). Parse de HTML-respons zelf (bijv. met `grep`/`sed`/een klein Python-scriptje via Bash) om de benodigde velden eruit te halen.

## Stap 1 — Datum bepalen

Voer `date -u +%Y-%m-%dT%H:%M:%SZ` uit via Bash. Bepaal "gisteren" in Europe/Amsterdam-tijd.

## Stap 2 — Toernooi van gisteren vinden

Probeer `https://www.dartsatlas.com/seasons/uoGtg6XqtbQH/tournaments/results` (of `/schedule`) op te halen via `curl` (zie hierboven). Zoek een toernooi gedateerd op gisteren, met locatie en toernooi-ID.

**Let op:** als deze fetch faalt, geblokkeerd wordt (403), of duidelijk onvolledige/foutieve content teruggeeft — behandel dat NIET als "geen toernooi", maar ga direct naar Stap 5 met een fallback-notitie dat de fetch is mislukt. Nooit aannemen dat "geen data" hetzelfde is als "geen toernooi".

## Stap 3 — Dubbelcheck op bestaand bestand

Als een toernooi van gisteren gevonden is: controleer via Glob of er al een bestand bestaat in `ADC/Verslagen/` voor die datum en locatie (patroon `facebook-verslag-[locatie]-[YYYY-MM-DD].md`, locatie ongeveer overeenkomend). Bestaat het al: stop, doe niets (voorkomt dubbele verslagen — dit gebeurt bijvoorbeeld als Sander of Hermes het verslag al handmatig heeft gemaakt).

## Stap 4 — Verslag genereren

Als er nog geen bestand is: lees eerst `Team Knowledge/Workstreams/WS-004-facebook-toernooi-verslag.md`, `Team Knowledge/Workstreams/WS-006-adc-facebook-verslag.md` en `Team Knowledge/SOPs/SOP-011-adc-toernooi-analyse.md` voor de exacte procedure, stijlregels en template.

Volg SOP-011:
- Toernooi-basisinfo
- Groepsindeling + standen
- KO-bracket met gemiddeldes
- 180's per speler (via `/tournaments/[ID]/player_stats/[SPELER_ID]`)
- Hoge finishes ≥100 per wedstrijd (via elke wedstrijdpagina `/matches/[ID]`)

Gebruik `curl` (zie hierboven, nooit WebFetch) voor alles. Bij een geblokkeerde/lege/"Retry later"-response: 2-3 keer retryen met korte pauze (1-2s). Blijft het mislukken: schrijf het bestand toch met de wél bevestigde data, en markeer ontbrekende secties expliciet als `[niet automatisch op te halen — nog te bevestigen]` — nooit gokken of weglaten zonder markering.

Haal ook de eerstvolgende 2-3 toernooien in Regio Oost op (seizoensschema, zelfde seizoen-ID, zie SOP-010) voor de "Volgende toernooien"-sectie.

Schrijf naar `ADC/Verslagen/facebook-verslag-[locatie-lowercase]-[YYYY-MM-DD].md` met bovenaan `**Status: CONCEPT — ter review door Sander**`, exact volgens het WS-006-template (lopend verhaal, geen emoji-secties, geen quote, geen hashtags, 180's en hoge finishes oplopend gesorteerd met climax aan het eind, 170 = "The Big Fish").

Commit dit ene bestand met `git add`/`git commit` (gebruik de lokale git-config, geen aparte auth nodig) met een duidelijke commitmessage, bijvoorbeeld:
```
ADC-verslag [locatie] YYYY-MM-DD (automatisch concept)
```
Niet pushen — dat gebeurt via de bestaande sessie-backup-routine.

## Stap 5 — Log wegschrijven

Schrijf een korte samenvatting (2-4 regels) naar stdout: of er een toernooi was, of het verslag is aangemaakt, en zo niet waarom niet (geen toernooi / fetch mislukt / bestond al). Dit komt in `~/Library/Logs/adc-verslag-ochtend.log` terecht. Geen Todoist-taak of andere notificatie nodig — `/dagstart` checkt zelf op nieuwe CONCEPT-verslagen in `ADC/Verslagen/`.

## Stap 6 — Geen toernooi

Als Stap 2 betrouwbaar bevestigt dat er gisteren geen toernooi was: doe niets verder, geen commit, sluit stil af (wel de korte logregel uit Stap 5).

## Belangrijk (Deel A)

- Verzin nooit spelersnamen, scores of statistieken. Alleen geverifieerde data in het verslag.
- Ga nooit ervan uit dat een fetch gelukt is — controleer de inhoud (geen "Retry later", een titel/element met verwachte content) voordat je het als geldige data gebruikt.
- Commit alleen het nieuwe/gewijzigde verslag-bestand, niets anders.

---

# Deel B — Vooraankondiging (vooruitkijkend)

Zie [[WS-009-adc-facebook-vooraankondiging]] voor de volledige procedure en het template. Deze stappen zijn de verkorte uitvoeringsversie voor de onbemande ochtendroutine.

## Stap 7 — Toernooi van vandaag vinden

Gebruik dezelfde `curl`-methode (nooit WebFetch) om `https://www.dartsatlas.com/seasons/uoGtg6XqtbQH/tournaments/schedule` op te halen. Zoek een toernooi gedateerd op **vandaag** (Europe/Amsterdam). Geen toernooi vandaag: sla Deel B verder over, schrijf één regel in de log ("geen toernooi vandaag, geen vooraankondiging"), klaar.

## Stap 8 — Dubbelcheck op bestaand bestand

Controleer via Glob of er al een bestand bestaat in `ADC/Verslagen/` met patroon `facebook-vooraankondiging-[locatie]-[YYYY-MM-DD].md` voor vandaag. Bestaat het al (bijv. omdat Sander of Hermes het handmatig al maakte): stop, doe niets.

## Stap 9 — Vooraankondiging genereren

Haal op:
- Venue, locatie en aanvangstijd van het toernooi van vandaag (uit stap 7).
- Toernooi-ID voor de inschrijflink (`https://www.dartsatlas.com/tournaments/[ID]`).
- Actuele koploper via `https://www.dartsatlas.com/seasons/uoGtg6XqtbQH/player_standings` (naam, gemiddelde). Check of die koploper het meest recente toernooi won voor het haakje — zo niet, gebruik de stand zonder dat specifieke haakje.

Schrijf het bericht volgens het exacte template in [[WS-009-adc-facebook-vooraankondiging]] (Fase 2) — geen hashtags, geen quote-placeholder. Schrijf naar `ADC/Verslagen/facebook-vooraankondiging-[locatie-lowercase]-[YYYY-MM-DD].md` met bovenaan `**Status: CONCEPT — ter review door Sander**`.

Commit dit ene bestand apart van een eventueel Deel A-verslag, met commitmessage bijvoorbeeld:
```
ADC-vooraankondiging [locatie] YYYY-MM-DD (automatisch concept)
```
Niet pushen — dat gebeurt via de bestaande sessie-backup-routine.

## Stap 10 — Log wegschrijven

Schrijf een korte samenvatting (1-3 regels) naar stdout: of er een toernooi vandaag was, of de vooraankondiging is aangemaakt, en zo niet waarom niet (geen toernooi / fetch mislukt / bestond al). `/dagstart` checkt zelf op nieuwe CONCEPT-bestanden in `ADC/Verslagen/` (beide types).

## Belangrijk (Deel B)

- Zelfde regels als Deel A: nooit gokken, nooit "geen data" verwarren met "geen toernooi", alleen geverifieerde data.
- Als de koploper-fetch mislukt maar het toernooi van vandaag wel bevestigd is: schrijf de vooraankondiging toch, zonder het koploper-haakje, met een korte notitie in de log dat dat element ontbrak.
