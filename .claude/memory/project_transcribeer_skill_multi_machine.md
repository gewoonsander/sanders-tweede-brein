---
name: project-transcribeer-skill-multi-machine
description: "/transcribeer-skill (YouTube-kennis ophalen) staat nu op zowel Mac Mini als MacBook Air, met automatische SSH-delegatie naar de Mac Mini voor de Whisper-terugval"
metadata: 
  node_type: memory
  type: project
  originSessionId: fa0ae155-7c90-421a-9ffe-4fd359477ccf
  modified: 2026-08-16T09:47:53.342Z
---

De `/transcribeer`-skill (Daedalus, `~/.claude/skills/transcribeer/` — `SKILL.md`, `transcribeer.py`, `config.json`) haalt YouTube-kennis op: ondertitels eerst via `youtube-transcript-api` (snel, geen download), Whisper large-v3 als terugval bij video's zonder ondertitels. Resultaat komt altijd in `PKM/Documents/YouTube-Kennis/`.

Op 2026-08-16 is dit uitgebreid naar meerdere machines, naar aanleiding van Sanders vraag hoe YouTube-transcriptie op de Mac Mini ("het werkpaard") terecht moet komen als hij vanaf een andere Mac werkt.

**Why:** Globale skills (`~/.claude/skills/`) zijn per-machine geïnstalleerd, niet automatisch gesynchroniseerd — de skill stond alleen op de Mac Mini (laatst gebruikt 10 juli), en bestond helemaal niet op de MacBook Air. `uv` (vereist om het script te draaien) ontbrak daar ook. Zie [[feedback_machine_identiteit_verifieren]] voor het bredere patroon: machine-lokale status/tooling is nooit vanzelfsprekend overal aanwezig.

**Wat er nu staat (op zowel Mac Mini als MacBook Air, checksums identiek):**
- `uv` geïnstalleerd op de MacBook Air (was al aanwezig op de Mac Mini).
- `transcribeer.py` uitgebreid: de Whisper-terugval draait lokaal als `whisper`+`ffmpeg` aanwezig zijn, en anders automatisch via SSH (`bash -s -- <video_id> <taal>` met het pipeline-script over stdin) naar `whisper_host` uit `config.json` (default `macmini`). Geen wijziging nodig aan hoe je de skill aanroept — dezelfde `uv run transcribeer.py "<url>"`.
- Het snelle ondertitel-pad heeft geen Mac Mini nodig en werkt overal lokaal.
- `config.json` heeft een nieuwe sleutel `whisper_host` (default `"macmini"`).
- `AGENTS.md` regel 86 (transcribeer-skill routing-tabel) bijgewerkt om dit te reflecteren.
- Getest: ondertitel-pad werkt (video mfEjyTvBWIo, ICOR with Tom, Engelse ondertitels, 1.5 sec). SSH-plumbing voor de remote Whisper-terugval apart geverifieerd (argv + stdin-script via `ssh macmini bash -s --`), maar een volledige end-to-end Whisper-run via SSH is nog niet in de praktijk getest — pas dat als eerstvolgende keer een video zonder ondertitels langskomt.

**How to apply:** Bij nieuwe machines waarop Sander wil kunnen transcriberen: kopieer `~/.claude/skills/transcribeer/` (3 bestanden) + installeer `uv`. Bij wijzigingen aan `transcribeer.py`/`config.json`/`SKILL.md`: altijd naar alle machines syncen (nu Mac Mini + MacBook Air), anders raken de kopieën uit sync zoals eerder al gebeurde met `Expansions/audio-transcribe/transcribe_inbox.sh` (zie sessielog `2026-08-14-19-56_hermes_audio-transcribe-naming-fix-close-session`).
