---
name: feedback-transcriptie-alleen-bij-gezien
description: "Content (podcasts, video's, etc.) alleen automatisch transcriberen/opnemen in het tweede brein nadat Sander het daadwerkelijk heeft geconsumeerd, nooit blanket vooraf op basis van abonnement/beschikbaarheid"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 613d861b-99db-4f30-9f32-d5926e099072
  modified: 2026-08-19T11:46:55.523Z
---

Transcribeer of importeer content pas automatisch in het tweede brein nadat Sander 'm daadwerkelijk heeft gezien/gehoord (bevestigd via afspeelstatus of een handmatige markering) — nooit blanket vooraf, alleen omdat hij ergens op geabonneerd is of iets beschikbaar is.

**Why:** Vastgelegd 2026-08-19 tijdens het bouwen van de podcast-integratie ([[project_mypka_cockpit]]). Sander's eigen woorden: blanket transcriberen van een heel podcast-archief zou "allemaal onzin in mijn tweede brein" opleveren "waarvan ik niet eens weet dat het erin zit" — dat noemt hij slordig. Het tweede brein moet weerspiegelen wat hij daadwerkelijk heeft geconsumeerd, niet wat toevallig in een feed of abonnementenlijst staat.

**How to apply:** Bij elke toekomstige contentbron (podcasts, YouTube, artikelen, nieuwe library-modules) geldt: de trigger voor automatisch importeren/transcriberen is "geconsumeerd" (afgeluisterd/gezien/gelezen), niet "beschikbaar" of "geabonneerd". Al bestaande, bewust-aangevraagde archieven (zoals de eerder getranscribeerde Dartpraat-afleveringen) vallen hier niet onder — die zijn destijds expliciet aangevraagd, geen ongevraagde bulk. Zie ook [[project_mypka_cockpit]] voor de concrete implementatie (event-gedreven transcriptietrigger op afspeelstatus).
