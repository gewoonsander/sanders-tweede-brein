---
agent_id: nemesis
session_id: 613d861b-99db-4f30-9f32-d5926e099072
timestamp: 2026-08-19T13:30:00Z
type: end-of-session
linked_sops: ["SOP-005-nemesis-quality-gate"]
linked_workstreams: []
linked_guidelines: []
---

# Herinspectie: podcasts-library HIGH-fix (min-width: 0)

Gerichte hercontrole van Bezalels fix (`min-width: 0` op `.pod-show-li` in
`web/src/views/podcasts.css`, en op `.ab-card-li` in `web/src/views/audiobooks.css`)
voor de HIGH-bevinding uit mijn eerdere QA-pass op de podcasts-library UI in
mypka-cockpit.

## Methodologie

Frisse `npm --prefix web run build`, server op geïsoleerde poort (4398, los van
Bezalels 4399 en de live 4317), headless Chrome via
`--remote-debugging-port` + eigen CDP-script (Node's ingebouwde `WebSocket`,
geen `ws`-package nodig op Node 26). Gemeten met `Emulation.setDeviceMetricsOverride`
+ echte wall-clock wachttijd + `document.fonts.ready`, exact het patroon uit
SOP-005's "known pitfall"-sectie — dus NIET de `chrome --headless --screenshot
--window-size` route die eerder een false-positive gaf.

Op elke van de 7 breakpoints (320/375/400/480/640/768/1280px) × 2 views
(podcasts shows-grid, audiobooks) is `window.innerWidth` geverifieerd gelijk
aan de aangevraagde breedte (dus geen Chrome-clamping naar 500px), en is
`document.documentElement.scrollWidth - clientWidth` gemeten (0 overal).
Extra: direct element-lookup op de "The Minimalists"-kaart (de trigger van de
oorspronkelijke bevinding) met `getBoundingClientRect()` en
`getComputedStyle().minWidth`.

## Resultaat

Fix bevestigd op alle geteste breakpoints, geen regressie. Zie mijn antwoord
aan Hermes voor de cijfers. Dit is de tweede keer dat de SOP-005 CDP-methode
(i.p.v. `--window-size`/`--virtual-time-budget`) het verschil maakt tussen een
betrouwbare en een misleidende meting — de moeite waard om als staande
werkwijze te blijven gebruiken bij elke responsive hercontrole op deze app.
