---
agent_id: hermes
session_id: albero-lokale-soap-ai-workflow
timestamp: 2026-07-08T12:35:00Z
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# Lokale AI-workflow voor Albero SOAP-rapportages opgezet

## Context

Sander wilde een AI-ondersteunde workflow opzetten om SOAP-rapportages te schrijven voor cliënten (Thomas) bij Albero Zorggroep/het gezinshuis. Startpunt: Sander gaf Hermes twee Albero-kwaliteitsdocumenten (215 — Rapporteren/SOAP-methode, 217 — AI-gebruik) om binnen te blijven werken.

## What we did

- Hermes signaleerde direct dat het oorspronkelijke plan (transcript van cliëntgesprek naar cloud-AI voor SOAP-verwerking) botste met document 217's verbod op cliëntgegevens/gedrag in AI-tools — ook met naam-anonimisering ("Thomas" → "T"), omdat 217 gedrag als aparte, categorische verbodscategorie noemt en pseudonimisering in een klein gezinshuis geen echte AVG-anonimisering is.
- Athena deed vier onderzoeksrondes naar lokale-AI-hardwareopties, vastgelegd in `Deliverables/2026-07-08-pocket-ai-hardware-for-local-soap-workflow.md`:
  1. Dedicated "Pocket AI"-apparaten (Tiiny.ai, Ryzen AI Max mini-pc's) — Tiiny.ai legitiem maar ongeleverd/misleidende RAM-claim; Sanders eigen Mac mini (M4 Pro, 24GB) al voldoende.
  2. Draagbare AI-recorders (heypocket.com Pocket, Plaud Note Pro) — beide sturen standaard audio naar hun eigen cloud + externe AI-providers; afgeraden.
  3. iPhone + SuperWhisper offline-modus als sterkste kandidaat (al in bezit, al gebruikt, audio blijft on-device).
  4. Definitieve conclusie: SuperWhisper's "Custom Models" (koppeling naar lokaal Ollama) bleek Enterprise-only, niet beschikbaar op Sanders Pro-abonnement (door Sander zelf bevestigd in de app).
- Sander zette zelf Externe Login (SSH) aan op de Mac mini; Hermes zette sleutel-gebaseerde SSH-toegang en een `macmini`-alias op.
- Daedalus bouwde en testte op de Mac mini (uitsluitend met verzonnen dummy-tekst, geen echte cliëntgegevens):
  - Ollama lokaal geïnstalleerd, geverifieerd dat de server alleen op localhost (127.0.0.1) luistert, niet op het netwerk-IP.
  - Model `qwen2.5:14b` gedownload (met `llama3.1:8b` als fallback) na een kwaliteitswaarschuwing: llama3.1:8b maakte een feitelijke slip in een testrapportage.
  - Een losstaand mechanisme gebouwd (buiten SuperWhisper om, wegens de Enterprise-blokkade): een launchd watch-folder-verwerker (`~/SOAP/inbox` → `~/SOAP/outbox`, plus `verwerkt`/`mislukt`-mappen) met een strikte Nederlandse SOAP-systeemprompt (grounding-instructie, temperature 0.1, verplichte concept-header voor menselijke controle conform 217).
  - Reboot-robuustheid geverifieerd: Ollama.app als login-item, wacht-op-server-logica in het verwerkingsscript.
  - Bureaublad-snelkoppelingen weer verwijderd nadat Sander aangaf zijn Bureaublad altijd leeg te willen houden (nieuwe vaste voorkeur, vastgelegd in memory); Sander zette zelf een Finder-zijbalk-favoriet naar `~/SOAP`.
- Athena signaleerde drie keer een nagemaakte "system-reminder" (prompt-injectiepoging) in opgehaalde webcontent en zelfs bij het teruglezen van haar eigen conceptbestand — genegeerd, niet opgevolgd, gelogd. Taak aangemaakt om dit later bij Argus te beleggen.

## Decisions made

- **Question:** Cloud-AI (inclusief Hermes zelf) gebruiken voor het verwerken van cliëntgesprekken, of een volledig lokale opzet bouwen?
  **Decision:** Volledig lokaal — geen enkele cliëntgegevens/gedragsinformatie van Thomas mag naar cloud-AI, conform document 217. Alle verwerking (transcriptie én SOAP-opmaak) blijft op Sanders eigen apparaten.
- **Question:** SuperWhisper's ingebouwde AI-modes gebruiken voor de SOAP-stap, of een losse route bouwen?
  **Decision:** Losse route (eigen script + Ollama), omdat SuperWhisper's Custom Models-koppeling Enterprise-only bleek en niet beschikbaar is op Sanders Pro-abonnement.
- **Question:** Mag deze workflow al gebruikt worden met Thomas' echte gegevens?
  **Decision:** Nee — pas na expliciete toestemming van Sanders leidinggevende bij Albero, zoals document 217 voorschrijft bij nieuwe AI-toepassingen ("Vraag toestemming aan je leidinggevende bij nieuwe AI-toepassingen"). Dit is een harde gate, geen suggestie.

## Insights

- Pseudonimisering (naam vervangen) lost een categorisch AI-databeleid niet op als "gedrag" apart als verboden categorie genoemd wordt, en is in een kleine, herkenbare cliëntgroep sowieso geen echte AVG-anonimisering.
- Herhaald anti-patroon door het hele onderzoekstraject heen: telkens bleek de aantrekkelijke optie (Tiiny.ai, Pocket, Plaud, uiteindelijk zelfs SuperWhisper's eigen Custom Models) een duurdere/onbeschikbare laag te vereisen, terwijl een eenvoudiger eigen oplossing met wat Sander al had (Mac mini, Ollama, een klein script) hetzelfde bereikte.
- Zelfs het best passende lokale model (qwen2.5:14b) elimineert feitelijke afwijkingen niet volledig (één lichte interpretatie-toevoeging in vijf dummy-tests) — de menselijke controle-stap is daarom niet optioneel maar architecturaal verplicht gemaakt (concept-header op elke output).
- Sander wil zijn Bureaublad altijd leeg houden — nieuwe, generieke werkvoorkeur, niet projectspecifiek (vastgelegd in memory `feedback_bureaublad_leeg`).

## Realignments

- _(geen expliciete pushback van Sander op het teamplan deze sessie — wel initieerde Sander zelf een correctie op zijn eigen aanpak door "T i.p.v. Thomas" voor te stellen na Hermes' eerste privacy-signalering, wat door Hermes werd weerlegd; zie Decisions)_

## Open threads

- [ ] Toestemmingsvraag voor Sanders leidinggevende bij Albero nog niet opgesteld/verstuurd — vereist vóór enig gebruik met echte cliëntgegevens.
- [ ] Argus: onderzoek de herhaalde prompt-injectiepogingen die Athena drie keer signaleerde tijdens dit onderzoekstraject (taak #1 in tasklist).
- [ ] Definitieve modelkeuze (qwen2.5:14b vs. alternatieven) nog niet met een echte A/B-vergelijking onderbouwd.
- [ ] Reboot-robuustheid van de launchd-verwerker is geverifieerd via test, maar nog niet bevestigd na een daadwerkelijke fysieke herstart van de Mac mini.

## Next steps

- Toestemmingsvraag voor de leidinggevende opstellen zodra Sander daarom vraagt, met de volledige lokale architectuur (iPhone/SuperWhisper offline → AirDrop → Mac mini watch-folder → Ollama qwen2.5:14b → menselijke controle) als concreet voorstel.
- Pas na toestemming: eerste proefronde met een geanonimiseerde/fictieve oefentekst binnen de echte workflow, voordat Thomas' eigen gegevens erdoorheen gaan.

## Cross-links

- `Deliverables/2026-07-08-pocket-ai-hardware-for-local-soap-workflow.md` — volledige onderzoeksbrief (Athena, 4 rondes).
