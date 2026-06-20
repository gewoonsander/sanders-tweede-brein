---
agent_id: larry
session_id: youtube-samenvatting-en-backup-protocol-fix
timestamp: 2026-06-21T00:28:00+02:00
type: close-session
linked_sops: []
linked_workstreams: []
linked_guidelines: []
---

# YouTube-samenvatting, Facebook-publicatie en herstel van het backup-protocol

## Context

Korte vervolgsessie op de eerdere sessie van vandaag. Sander bevestigde dat hij de twee ADC-verslagen al op Facebook had gezet en verwachtte dat de git-backup automatisch zou zijn gebeurd na het sluiten van de vorige sessie — dat was niet het geval, dus dat is gerepareerd. Daarna een losse vraag over het samenvatten van een YouTube-video.

## What we did

- Larry werkte de status van beide ADC-verslagen bij naar "gepubliceerd" nadat Sander bevestigde dat ze al op Facebook stonden.
- Larry voerde de ontbrekende git-backup van de vorige sessie alsnog uit: commit + push naar GitHub (commit `01165bb`).
- Larry constateerde dat het close-session protocol in `AGENTS.md` geen verplichte git-backup-stap bevatte, en heeft dat toegevoegd als nieuwe paragraaf ("Close-session git backup (mandatory final step)") zodat dit voortaan automatisch gebeurt zonder dat Sander erom moet vragen.
- Sander vroeg of Larry een transcript van een YouTube-link kan vinden en samenvatten; Larry probeerde dit eerst via `WebFetch` (kreeg geen transcript, JS-rendering) en via de browser-tab met `ytInitialPlayerResponse` + de timedtext-API (leverde een lege response op — vermoedelijk rate-limiting of een gewijzigd caption-formaat). Sander plakte uiteindelijk het volledige transcript zelf in de chat.
- Larry vatte de video samen ("I Talk to My Phone. Saved in Local Folder. Claude Links my Thoughts for Me.") — een opzet om via iOS Shortcuts audio op te nemen en automatisch te laten landen in een lokale Team Inbox-map voor verwerking door Claude (Whisper.cpp + FFmpeg).
- Sander wilde dit niet nu, maar later oppakken — Larry legde dit vast als toekomstige actie in `PKM/Journal/2026/06/2026-06-21.md`.

## Decisions made

- **Question:** Moet de git-backup na elke sessie automatisch gebeuren, of alleen op verzoek?
  **Decision:** Automatisch, als vaste laatste stap van het close-session protocol — vastgelegd in `AGENTS.md`, geen aparte vraag meer nodig.

## Insights

- YouTube's caption-ophaalroute via `ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks[].baseUrl` + `&fmt=json3` gaf een lege 200-response in deze sessie — methode is niet 100% betrouwbaar gebleken (mogelijk rate-limiting, gewijzigde caption-beschikbaarheid, of een wijziging in YouTube's frontend). Geen volledige verklaring gevonden; bij een volgende poging eerst checken of de video sowieso ondertiteling heeft, en anders gewoon de gebruiker om het transcript vragen (zoals nu gebeurde).
- Eerdere sessie-afsluitingen deden wél een git-backup, maar dat stond nergens canoniek vastgelegd in `AGENTS.md` — alleen impliciet via een gewoonte in eerdere commits. Nu gecodificeerd.

## Realignments

- Sander corrigeerde de aanname dat de git-backup een vaste, automatische stap was — die was in werkelijkheid niet gedocumenteerd. Protocol is nu aangepast zodat de aanname klopt voor toekomstige sessies.

## Open threads

- [ ] iPhone Shortcuts → Team Inbox audio-capture opzet (zie journal-entry 2026-06-21) — Sander wil dit later zelf inrichten, geen haast.
- [ ] YouTube-transcript-ophaalmethode verder testen/robuust maken voor toekomstige verzoeken (huidige poging gaf lege response).

## Next steps

- Bij een volgend YouTube-samenvattingsverzoek: eerst proberen via de browser-caption-route, bij falen direct de gebruiker vragen om het transcript te plakken (geen tijd verliezen aan herhaalde mislukte pogingen).
- Close-session voert vanaf nu altijd automatisch de git-backup uit (zie bijgewerkte `AGENTS.md`).

## Cross-links

- `[[2026-06-21-00-14_larry_n8n-verbouwingbus-dart-checkout-methode-adc-verslagen]]` — vorige sessie vandaag, waar de backup-stap oorspronkelijk gemist werd.
