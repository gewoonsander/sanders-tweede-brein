---
name: feedback-gmail-links
description: Bij mailbox-overzichten altijd klikbare Gmail-links toevoegen per mail
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a8786e47-7622-44cd-adbf-5b76d6840fa0
  modified: 2026-08-17T11:38:06.123Z
---

Bij het presenteren van een mailbox-overzicht altijd klikbare links naar de betreffende e-mails toevoegen — zonder uitzondering, ook bij losse ad-hoc vragen (niet alleen bij een formeel "mailbox-overzicht").

**Why:** Sander wil direct kunnen doorklikken naar een mail om zelf dingen na te zoeken, zonder zelf te hoeven zoeken. Op 2026-08-17 opnieuw gecorrigeerd nadat een pakketjes-overzicht zonder links werd gepresenteerd — herhaaldelijk gecorrigeerd, dus dit geldt hard, ook buiten expliciete "overzicht"-vragen.

**How to apply:** Gmail thread-links volgen het format `https://mail.google.com/mail/u/0/#inbox/[thread_id]`. De thread-IDs komen uit de `search_threads`/`get_thread` tools. Verwerk dit bij elke keer dat een specifieke e-mail wordt genoemd of samengevat — overzicht, deellijst, follow-up, of los antwoord op een vraag.
