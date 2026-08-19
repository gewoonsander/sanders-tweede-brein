---
name: feedback-gmail-links
description: Bij mailbox-overzichten én bij zelf aangemaakte concepten altijd klikbare Gmail-links toevoegen
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a8786e47-7622-44cd-adbf-5b76d6840fa0
  modified: 2026-08-19T08:01:12.668Z
---

Bij het presenteren van een mailbox-overzicht altijd klikbare links naar de betreffende e-mails toevoegen — zonder uitzondering, ook bij losse ad-hoc vragen (niet alleen bij een formeel "mailbox-overzicht"). Op 2026-08-19 uitgebreid: dit geldt evengoed voor **zelf aangemaakte concepten** (e-mailconcepten via `create_draft`/`update_draft`) — elke keer dat Hermes of een specialist (o.a. Pieter Post) een conceptmail maakt, hoort de rapportage daarvan direct een klikbare link naar dat concept te bevatten. Geldt ook voor andere externe systemen waar iets wordt aangemaakt (bv. Canva-designs, Google Drive-bestanden) — link altijd mee, zoek niet alleen het bestandspad. Voor lokale bestanden geldt hetzelfde principe via [[GL-021-klikbare-bestandslinks]] (file://-links).

**Why:** Sander wil direct kunnen doorklikken naar een mail om zelf dingen na te zoeken, zonder zelf te hoeven zoeken. Op 2026-08-17 opnieuw gecorrigeerd nadat een pakketjes-overzicht zonder links werd gepresenteerd. Op 2026-08-19 expliciet uitgebreid naar concepten: hij wil niet handmatig in Gmail's UI naar een zojuist aangemaakt concept hoeven zoeken. Herhaaldelijk gecorrigeerd/uitgebreid, dus dit geldt hard, ook buiten expliciete "overzicht"-vragen.

**How to apply:**
- Bestaande/ontvangen mails (inbox, verzonden, elk ander label): `https://mail.google.com/mail/u/0/#inbox/[thread_id]`. Thread-ID's komen uit `search_threads`/`get_thread`.
- **Concepten (drafts)**: `https://mail.google.com/mail/u/0/#drafts/[thread_id]`. De `create_draft`/`update_draft`-tools geven alleen een interne `draftId` (formaat `r<cijfers>`) terug — dat is NIET de thread-ID die je in de link nodig hebt. Haal na het aanmaken de echte `threadId` op via `list_drafts` (met een `query` op onderwerp of ontvanger om het juiste concept te vinden) en gebruik die hex-string in de link.
- `/u/0/` gaat uit van Sanders eerste/primaire Google-account; bij twijfel over welk account, vermeld dat er eventueel `/u/1/` etc. nodig is.
- Verwerk dit bij elke keer dat een specifieke e-mail of een specifiek concept wordt genoemd of samengevat — overzicht, deellijst, follow-up, los antwoord, of een "ik heb een concept gemaakt"-melding.
