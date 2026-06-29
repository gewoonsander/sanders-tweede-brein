---
name: feedback-gmail-links
description: Bij mailbox-overzichten altijd klikbare Gmail-links toevoegen per mail
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a8786e47-7622-44cd-adbf-5b76d6840fa0
---

Bij het presenteren van een mailbox-overzicht altijd klikbare links naar de betreffende e-mails toevoegen.

**Why:** Sander wil direct kunnen doorklikken naar een mail zonder zelf te hoeven zoeken.

**How to apply:** Gmail thread-links volgen het format `https://mail.google.com/mail/u/0/#inbox/[thread_id]`. De thread-IDs komen uit de `search_threads` tool. Verwerk dit in elk overzicht, ook bij deellijsten of follow-up categorieën.
