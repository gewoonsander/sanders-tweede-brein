# close-session

Sluit de sessie af: session-log schrijven, de dagregistraties bijwerken, sessietitel corrigeren en de hele myPKA-repo back-uppen.

Dit bestand is een gemaksverpakking voor Claude Code. **De canonieke, LLM-agnostische specificatie staat in `AGENTS.md`** onder "Session-Log Triggers" en de bijbehorende close-session-secties. Wijkt dit bestand daarvan af, dan wint `AGENTS.md` — pas dan dít bestand aan, niet andersom.

## Gebruik

```
/close-session
```

```
/close-session snel
```

De natuurlijke triggers werken altijd, ook zonder slash-command: "close session", "wrap", "wrap up", "end session", "we're done for today", "let's stop here". Voor de snelle variant: "close session snel", "snel afsluiten", "sluit snel", "wrap snel".

Bij "that's it" vraagt Hermes eerst om bevestiging voordat het protocol start.

## Wat er gebeurt — volledige variant

1. **Journaalcheck** — Penn vraagt of Sander nog iets wil meegeven aan het journaal van vandaag.
2. **Habit-check** — scan `PKM/My Life/Habits/` op `cadence: daily` + `status: active`. Al een entry van vandaag onder `## Reflection`? Stil overslaan. Zo niet: vragen in hetzelfde bericht als de journaalvraag, niet als losse prompt. Voor `dagelijks-opdrukken` altijd het aantal herhalingen uitvragen.
3. **Voedselcheck** — tijdvenstergestuurd, geen onvoorwaardelijke J/N-vraag meer. Draai `python3 Expansions/mypka-cockpit/scripts/food_log.py status <datum>`; vraag uitsluitend naar wat in `missing` staat. "Nog niet gegeten" vastleggen met `food_log.py skip <datum> <meal_type>`, anders komt dezelfde vraag terug. Zie `SOP-017`.
4. **Permissie-skill** — vraag of `fewer-permission-prompts` mag draaien om de allowlist bij te werken.
5. **Session-log** — schrijf naar `Team Knowledge/session-logs/YYYY/MM/YYYY-MM-DD-HH-MM_<agent>_<topic-slug>.md` volgens `_template.md`.
6. **Sessietitel** — zet de titel om naar `YYYY-MM-DD HH:MM · <onderwerp>` met de **starttijd** van de sessie. De lopende sessie kan zichzelf niet hernoemen; meld de gewenste titel dan aan Sander. Nooit een duur in de titel.
7. **Git-backup** — `git pull` → `git add -A` → `git commit -m "Session backup YYYY-MM-DD HH:MM"` → `git push`. Meld het resultaat in één regel. Faalt er iets: expliciet melden, nooit stil overslaan. Bij een pull-conflict stoppen en de conflicterende bestanden tonen.

## Wat er gebeurt — snelle variant

Stap 1 tot en met 4 vervallen; stap 5 tot en met 7 blijven volledig intact. Het onderscheid is bewust: de vragen kosten Sander een antwoord, de schrijfstappen kosten hem niets.

Wel verplicht: controleer de overgeslagen items alsnog **read-only** (habit-bestanden, `food_log.py status`) en meld in één regel wat er openstaat, bijvoorbeeld "Overgeslagen: opdrukken nog niet gelogd, lunch ontbreekt." Geen vraag, geen beslisblok, geen wachten op antwoord.

Noem deze variant nooit "final" — dat leest als *laatste sessie van de dag*, en juist dan zijn de habit- en voedselcheck het hardst nodig.

Twijfel je welke variant Sander bedoelt? Draai de volledige. Over-vragen is herstelbaar, een gemiste dagregistratie niet.
