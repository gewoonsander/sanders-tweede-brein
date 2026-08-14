---
agent_id: hermes
session_id: audio-transcribe-naming-fix-close-session
timestamp: 2026-08-14T19:56:00+02:00
type: close-session
linked_sops: ["SOP-013-inboxen-verwerken", "SOP-017-verwerk-voedingsregistratie"]
linked_workstreams: []
linked_guidelines: ["GL-001-file-naming-conventions", "GL-013-interactie-enkelvoudige-keuzes", "GL-016-beslis-en-waarschuwingsblokken"]
---

# Root-cause fix: audio-transcribe-automation negeerde GL-001

## Context

Sander vroeg wanneer de bestandsnaamconventie (GL-001) precies getriggerd wordt, naar aanleiding van onbekende bestandsnamen die in zijn systeem opdoken. Onderzoek wees naar een losse, onbewaakte LaunchAgent (`nl.gewoonsander.audio-transcribe`) die volledig buiten het agent-systeem om draait.

## What we did

- Hermes onderzocht GL-001, SOP-013 en de audio-transcribe-pijplijn en vond de root cause: `~/transcribe_inbox.sh` schreef sinds 3 juli ruwe voice-memo bestandsnamen (`Audio-opname YYYY-MM-DD om HH.MM.SS.md`) naar `Deliverables/`, zonder ooit door een agent-workflow te lopen die GL-001 zou toepassen.
- Hermes hernoemde alle 18 bestaande transcripties in `Deliverables/` naar `YYYY-MM-DD-slug.md` en fixte twee `[[wikilinks]]` die naar de oude namen verwezen (`PKM/Journal/2026/07/2026-07-09-audio-muziek-gelach.md`, `PKM/Journal/2026/07/2026-07-10-rookmelder-naam-aanpassen.md`).
- Hermes patchte `~/transcribe_inbox.sh` (de live LaunchAgent-versie) zodat de bestaande Haiku-classificatiestap er ook een GL-001-slug bij genereert, met collision-handling. De dedupe-check draait nu op `original_file` in de frontmatter in plaats van op de bestandsnaam. De verouderde repo-kopie (`Expansions/audio-transcribe/transcribe_inbox.sh`), die uit sync was geraakt met wat er echt draaide, is gesynchroniseerd met de gepatchte live versie.
- Commit `b06c8cb` — alleen deze 21 bestanden, losstaand van de bredere achtergrond-automation die parallel aan het draaien was (wekelijkse inboxronde).
- Close-session journaal: Sander gaf een korte terugblik op de dag (thuis gewerkt, gordijnen opgehangen, opgeruimd, boodschappen gedaan) → vastgelegd in `PKM/Journal/2026/08/2026-08-14.md`.
- Daily-habit check: schimmelcrème nog niet aangebracht vandaag → genoteerd in de Reflection-sectie van `PKM/My Life/Habits/schimmelcreme-gebruiken.md`.
- Food-log check: dag nog niet volledig gelogd. Sander herinnerde zich koffie, een glas Frivella, en een bordje krulfriet met een kippenbout — verwerkt via `food_log.py` (drie meal-entries, lage/gemiddelde confidence want teruggehaald uit geheugen) plus completion-audit `complete: yes` naar `PKM/Journal/2026/08/2026-08-14-voedingslogboek.md`. Mirror geregenereerd via `regen-mypka-db.py`.
- Fewer-permission-prompts-skill gedraaid op bevestiging: vrijwel de volledige recente read-only toolset stond al in `.claude/settings.json`. Eén nieuwe kandidaat (`Bash(claude agents *)`, read-only agent-inspectie) kon niet worden weggeschreven — geblokkeerd door de auto-mode classifier van deze host bij het bewerken van `.claude/settings.json`.

## Decisions made

- _(geen structurele beslissingen deze sessie — de audio-transcribe fix was een root-cause-reparatie, geen nieuw beleid)_

## Insights

- De audio-transcribe LaunchAgent is een structurele blinde vlek voor GL-001: het is een kale bash-script buiten elk agent-contact om, dus geen enkele naamconventie-regel kan hem automatisch bereiken tenzij hij expliciet in het script zelf wordt ingebakken (wat nu is gebeurd). Bij toekomstige losse LaunchAgents/scripts die naar de PKM schrijven: check proactief of ze GL-001 volgen, want "een agent leest het overal" is alleen waar als er daadwerkelijk een agent in de pijplijn zit.
- De repo-kopie van een geïnstalleerd script (`Expansions/.../transcribe_inbox.sh`) en de live, daadwerkelijk draaiende kopie (`~/transcribe_inbox.sh`) waren fors uit sync geraakt — de repo-versie miste de hele Haiku-classificatiestap. Waarde: bij het aanpassen van een Expansion-script altijd verifiëren welke kopie de LaunchAgent echt aanroept voordat je "klaar" meldt.
- `.claude/settings.json`-schrijfacties (ook lezen via `python3 -c` met dat pad erin) worden door de auto-mode classifier van deze host geblokkeerd, ook al staat de actie inhoudelijk voor de gebruiker klaar. Dit is een hostbeperking, geen taakfout — vermeld dit expliciet aan Sander in plaats van te blijven proberen.

## Realignments

- _(none this session)_

## Open threads

- [ ] `Bash(claude agents *)` moet nog handmatig door Sander (of via een andere permissiemodus) aan `.claude/settings.json` toegevoegd worden — Hermes kon dit niet zelf wegschrijven.
- [ ] De bredere achtergrond-inboxronde (honderden `Team Inbox/Documents/*`-verplaatsingen, nog los van deze sessie) staat nog steeds ongecommit in de working tree; Sander gaf aan die apart te willen beoordelen.

## Next steps

- Bij de eerstvolgende sessie: git-status opnieuw bekijken, de losse inboxronde-wijzigingen apart committen zodra Sander akkoord geeft.
- Verifiëren dat de gepatchte `~/transcribe_inbox.sh` bij de eerstvolgende automatische run (volgende audio-capture) daadwerkelijk een GL-001-conforme bestandsnaam produceert.

## Cross-links

- `[[2026-08-14-16-35_hermes_gratis-binnen-bestaande-stack]]`
