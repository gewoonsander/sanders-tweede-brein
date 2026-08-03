---
title: Secrets-beveiliging audit — launchd-agents, .env, git-geschiedenis
status: onderzoek afgerond, actie nog niet uitgevoerd
created: 2026-08-03
tags:
  - beveiliging
  - secrets
  - launchd
  - automatisering
---

# Secrets-beveiliging audit

**Aanleiding:** tijdens het uitzoeken hoe Team Inbox-verwerking (audio/foto's) volledig automatisch te maken, kwam een blootgestelde API-key naar boven in een launchd-plist. Op verzoek van Sander (03-08-2026) grondig uitgezocht wat er nog meer kwetsbaar staat, zodat dit als apart project later (met tijd) aangepakt kan worden. **Niets van onderstaande is al gefixt — dit is puur de inventarisatie.**

**Randvoorwaarde van Sander:** de oplossing moet **laagfrictie** zijn — geen constante pop-ups/toestemmingsvragen die de bestaande lokale automatiseringen (launchd-agents) hinderen. Dat is verwerkt in de aanbevelingen hieronder.

---

## Gevonden risico's

### 1. Anthropic API-key in platte tekst, in twee launchd-plists

- `~/Library/LaunchAgents/nl.gewoonsander.audio-transcribe.plist`
- `~/Library/LaunchAgents/nl.gewoonsander.superwhisper-meeting.plist`

Beide hebben dezelfde key hardcoded in hun `EnvironmentVariables`-dict. Plist-bestanden zijn wereld-leesbaar (`-rw-r--r--`) — elk lokaal proces/gebruiker op de Mac kan ze uitlezen.

**Belangrijk:** dit is dezelfde key in beide bestanden — bij rotatie moet die op **twee plekken** vervangen worden (of, beter, helemaal weggehaald worden ten gunste van optie hieronder).

### 2. Zelfde key, oudere scripts lezen 'm nog via de plist i.p.v. het al-bestaande veilige patroon

Er bestaat al een correcte, laagfrictie oplossing in dit ecosysteem: `~/.config/gewoonsander/env` (bestandsrechten `0600`, dus alleen leesbaar door Sander's account, **niet** in een git-repo). Dit bestand bevat al `ANTHROPIC_API_KEY` en wordt correct gebruikt door het nieuwste script:

- `~/classify_food_inbox.sh` (07-07-2026) — bevat expliciet de comment *"Key komt uit ~/.config/gewoonsander/env (geen plaintext-key in de plist)"* en doet `source "$HOME/.config/gewoonsander/env"`.

De twee **oudere** scripts doen dit nog niet en zijn dus de enige twee die achterlopen op het patroon dat elders al staat:
- `~/transcribe_inbox.sh` (03-07-2026)
- `~/superwhisper_meeting_export.sh` (28-06-2026)

**Dit maakt de fix klein:** geen nieuwe infrastructuur nodig, alleen deze twee scripts + hun plists aanpassen naar het patroon dat `classify_food_inbox.sh` al gebruikt.

### 3. TODOIST_API_KEY zat ooit in git-geschiedenis, en die commit staat op GitHub

- Bestand: `Team Knowledge/.env` (nu `0600`, nu gitignored — dit is de bedoelde, gedocumenteerde opzet, zie §4 hieronder)
- Historie: commit `a1c65c9` (28-06-2026, "Session backup 2026-06-28 15:30") bevatte het bestand mét `CONNECTORS_ENABLED` en `TODOIST_API_KEY`. Commit `e3a48dd` (zelfde dag) heeft het bestand daarna uit tracking gehaald (`git rm --cached` + `.gitignore`-regel toegevoegd).
- **Het probleem:** het weghalen van een bestand uit toekomstige commits verwijdert het niet uit de geschiedenis. Bevestigd: commit `a1c65c9` is een voorouder van `origin/main` — dus die is ooit gepusht naar GitHub (`git@github.com:gewoonsander/sanders-tweede-brein.git`) en staat daar nog steeds in de geschiedenis.
- **Zichtbaarheid van de repo (publiek/privé) is niet gecontroleerd** — geen `gh`-CLI beschikbaar op deze Mac om dat te checken. Los van publiek/privé: de Todoist-key moet als gecompromitteerd behandeld worden.
- **Goed nieuws:** het bestand is sindsdien gegroeid (nu 7 variabelen, zie §4), maar alleen die allereerste 2 (`CONNECTORS_ENABLED`, `TODOIST_API_KEY`) hebben ooit in een commit gezeten. De 5 die later zijn toegevoegd (Calendar iCal URL, Jortt client-id/secret, Firecrawl, Perplexity) zijn **nooit** gecommit — die zijn niet blootgesteld via git.

### 4. Het huidige `Team Knowledge/.env` bevat 7 geheimen — allemaal on-topic voor de mypka-cockpit Expansion

```
CONNECTORS_ENABLED
TODOIST_API_KEY
CALENDAR_ICAL_URL          ← een lekkende iCal-URL geeft ook agenda-inzage, niet alleen "een token"
JORTT_GEWOON_SANDER_CLIENT_ID
JORTT_GEWOON_SANDER_CLIENT_SECRET   ← OAuth-secret voor de boekhoud-koppeling, potentieel het gevoeligste item hier
FIRECRAWL_API_KEY
PERPLEXITY_API_KEY
```

Dit bestand wordt gebruikt door de `Expansions/mypka-cockpit/`-tooling. Er bestaat al een `SECURITY.md` voor die Expansion die expliciet voorschrijft: *"stored locally in Team Knowledge/.env (file mode 0600, gitignored)... a secret value must never appear in an emitted item, a route response, a log line, an error message, or a commit."* — dus de **huidige** staat (0600, gitignored) is precies wat de eigen documentatie voorschrijft. Alleen de oude git-historie (§3) is een afwijking van dat beleid, niet de huidige opzet.

---

## Wat al goed staat (niet opnieuw uitvinden)

- Het `~/.config/gewoonsander/env`-patroon (buiten elke git-repo, `chmod 600`, gesourced door scripts) is al live en werkt voor `classify_food_inbox.sh`.
- `Team Knowledge/.env` staat nu correct in `.gitignore` en heeft de juiste bestandsrechten.
- De mypka-cockpit Expansion heeft al een doordacht, gedocumenteerd beveiligingsbeleid (BYO-key, secrets-by-reference, localhost-only binding, PIN-gate voor LAN-modus).

---

## Aanbevolen acties, geprioriteerd

### Moet (compromittering, ongeacht andere keuzes)
1. **Todoist API-key roteren** in Todoist (Instellingen → Integraties → API-token) — dit ondervangt de git-geschiedenis-blootstelling. Alléén hiermee is de blootstelling zelf niet meer te "ontdoen", maar de key wordt wel waardeloos voor wie 'm al heeft.
2. **Anthropic API-key roteren** bij Anthropic (console.anthropic.com) — staat nu in twee wereld-leesbare plists.

### Zou moeten (opruimen, kan wachten tot er tijd is)
3. `transcribe_inbox.sh` en `superwhisper_meeting_export.sh` ombouwen naar het `~/.config/gewoonsander/env`-patroon (kopiëren van wat `classify_food_inbox.sh` al doet) — daarna de `EnvironmentVariables`-key uit beide plists verwijderen en de agents opnieuw laden (`launchctl unload`/`load`).
4. **Repo-zichtbaarheid checken** op github.com (publiek of privé?) — bepaalt hoe urgent verdere geschiedenis-opschoning is.
5. **Optioneel — git-geschiedenis opschonen** (`git filter-repo` om commit `a1c65c9`'s `.env`-inhoud overal te verwijderen). Dit is een **force-push-operatie** en herschrijft de geschiedenis — expliciete bevestiging vooraf nodig, en pas nuttig *na* rotatie (rotatie is de eigenlijke fix; geschiedenis opschonen is nette huishouding, geen vervanging).

### Kan later — sterker niveau, met bewuste frictie-afweging
6. **macOS Keychain** als opvolger van `~/.config/gewoonsander/env` voor wie echt de volgende stap wil zetten. Belangrijke nuance voor de "geen pop-ups"-eis: Keychain-toegang via de `security`-CLI vraagt in de regel **niet** om bevestiging zodra je bij het aanmaken "Always Allow" kiest voor het aanroepende programma — maar bash-scripts delen allemaal de identiteit `/bin/bash`, dus "Always Allow" voor één script staat het in de praktijk open voor alle bash-scripts. Dat is dus geen fijnmazige controle, maar wél laagfrictie. Per saldo waarschijnlijk niet significant veiliger dan het huidige `.env`-patroon voor dit specifieke gebruik (persoonlijke automatisering op één Mac) — vooral relevant als er ooit niet-vertrouwde software op deze Mac komt te draaien.

---

## Open vragen voor als dit oppakt wordt

- [ ] Is de GitHub-repo publiek of privé?
- [ ] Wil je de Jortt client-secret en de Firecrawl/Perplexity-keys ook preventief roteren, ondanks dat die nooit gecommit zijn (ze hebben wel dezelfde tijd in een `0600`-bestand gestaan als de gecompromitteerde Todoist-key)?
- [ ] Geschiedenis opschonen met `git filter-repo` — wel of niet, en wanneer?
