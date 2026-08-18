---
agent_id: hermes
session_id: sessietitels-rechtzetten
timestamp: 2026-08-18T15:21:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: ["GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Sessietitels rechtzetten en de titelregel naar de sessiestart verplaatst

## Context

Sander merkte op dat sessies verkeerde namen droegen, niet volgens afspraak. Drie van de vier andere sessies in de zijbalk stonden nog op de automatische app-titel zonder datumstempel, waaronder één met een typefout uit zijn eigen openingsbericht ("Darts draaid door").

## What we did

- Hermes achterhaalde de oorzaak: de titelregel in AGENTS.md (regel 288–296) grijpt uitsluitend tijdens close-session. De laatste session-log van die dag was van 14:19; de drie fout benoemde sessies startten daarna (15:12, 15:51, 16:45 lokaal) en waren nooit afgesloten, dus de regel is bij die sessies nooit uitgevoerd.
- Hermes hernoemde de drie sessies naar het afgesproken formaat, met hun `createdAt` als tijd en de typefout gecorrigeerd naar "Darts Draait Door".
- Hermes breidde AGENTS.md uit: hard rule 12 zet nu ook de sessietitel bij de eerste reply, nieuwe hard rule 12a legt het verschoven moment plus de aanleiding vast, en de close-sessionsectie scherpt de titel voortaan alleen nog aan.
- Hermes corrigeerde een feitelijk onjuiste bullet in de close-sessionsectie: een lopende sessie kán zichzelf hernoemen via `session_id: "self"`.
- Hermes hernoemde de memory `feedback_sessietitel_bij_close_session` naar `feedback_sessietitel_formaat` (de oude naam wees naar het verkeerde moment), inclusief MEMORY.md-index en de wikilink vanuit `feedback_sessiestempel_bij_sessiestart`.
- Hermes zette deze sessie zelf meteen op `2026-08-18 17:21 · Sessietitels rechtzetten`, volgens de nieuwe regel.

## Decisions made

- **Vraag:** Moet de sessietitel bij de sessiestart gezet worden of pas bij close-session?
  **Besluit:** Bij de sessiestart, direct na de eerste reply. Close-session scherpt alleen nog aan als het onderwerp intussen verschoven is. Reden: een regel die alleen bij het afsluiten grijpt, laat elke blijven liggende sessie ongestempeld — precies wat er die dag drie keer gebeurde.

## Insights

- Een afspraak die aan één moment hangt, faalt stil zodra dat moment overgeslagen wordt. Bij regels die de staat van iets bewaken loont het om het vroegste moment te kiezen, niet het meest logische.
- `mcp__ccd_session_mgmt__set_session_title` accepteert `"self"` en hernoemt ook andere actieve sessies. De aanname in AGENTS.md dat dit niet kon, stond er sinds 2026-08-18 ochtend en was nooit getoetst.

## Realignments

- _(geen deze sessie)_

## Open threads

- [ ] `regen-mypka-db.py` faalt op deze machine: PyYAML ontbreekt, waardoor de mypka.db-mirror na elke food_log-schrijfactie niet ververst wordt. Op te lossen met `pip3 install --user pyyaml`.

## Next steps

- Nieuwe sessies krijgen hun titel voortaan bij de eerste reply; controleren of dat in de praktijk ook gebeurt.

## Cross-links

- `[[2026-08-18-10-31_hermes_sessiestempels-voedselcheck-en-sluit-snel]]` — daar zijn de sessiestempel en de snelle close-sessionvariant vastgelegd.
