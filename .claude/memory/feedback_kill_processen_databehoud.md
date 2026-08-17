---
name: feedback-kill-processen-databehoud
description: "Wees extreem terughoudend met kill -9 op processen die actief bestanden verwerken/verplaatsen — dataverlies-risico, gebeurd op 2026-08-17"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4fa09299-476d-4821-a4f1-8e2c2ce90b36
  modified: 2026-08-17T12:43:20.962Z
---

Beëindig nooit met `kill -9` een proces (of zijn hele procesboom, inclusief de orkestrerende shell-loop) dat actief bezig is bestanden te verwerken/verplaatsen, zonder eerst te controleren of er een veiligere afsluitroute is (bv. wachten tot een lus-iteratie eindigt, of alleen het diepste kind-proces beëindigen in plaats van de hele boom inclusief de bash-loop zelf).

**Why:** op 2026-08-17 zijn twee voice-memo's van Sander (`Audio-opname 2026-08-17 om 09.05.06.wav` en `10.56.29.wav`, waaronder een net opgenomen notitie) onherstelbaar verloren gegaan tijdens een sessie waarin ik herhaaldelijk vastgelopen Whisper-transcriptieprocessen op de Mac mini met `kill -9` beëindigde (zie sessielog rond [[project_transcribeer_skill_multi_machine]] — de whisper-lock-fix). Het verwerkingsscript (`transcribe_inbox.sh`) logt normaal een expliciete "Opgeslagen:"-regel vóórdat het een bronbestand archiveert, en die regel ontbrak voor beide bestanden — het exacte mechanisme van het dataverlies kon achteraf niet worden gereconstrueerd, maar de timing van mijn `kill -9`-commando's (met name het beëindigen van de hele scriptboom, inclusief de bash-loop zelf, niet alleen het whisper-kindproces) is de meest waarschijnlijke oorzaak. Er was geen kopie op Sanders telefoon (Voice Memos) en geen lokale snapshot/Time Machine-back-up beschikbaar om te herstellen.

**How to apply:** bij het opruimen van vastgelopen processen die onderdeel zijn van een pipeline die bestanden aanmaakt/verplaatst/archiveert (audio-transcriptie, inbox-verwerking, Mediahub-archivering e.d.): eerst het minimale kind-proces beëindigen (niet de hele boom) en de uitkomst controleren voordat verder wordt opgeschaald naar de bredere procesboom. Bij twijfel over een lopende bestandsoperatie: liever laten uitlopen dan hard killen. Dit valt onder de bestaande regel over risicovolle acties (killing processes) uit de systeeminstructies, maar verdient hier extra nadruk omdat het al één keer misging.
