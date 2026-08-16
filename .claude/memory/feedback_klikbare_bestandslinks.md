---
name: feedback-klikbare-bestandslinks
description: Altijd file://-links geven bij genoemde lokale bestanden/mappen zodat Sander er direct naartoe kan
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 53fc71f0-5736-4668-85e5-4bbb126ff9b9
  modified: 2026-08-16T11:10:29.928Z
---

Wanneer een specifiek bestand of een specifieke map op Sanders schijf wordt genoemd (Downloads, Mediahub, Team Inbox, externe schijven, etc.), krijgt die vermelding altijd een klikbare Markdown-link met een `file://`-URI naar het absolute pad, zodat Sander er direct naartoe kan springen.

**Why:** Tijdens een Downloads-opruimronde noemde Hermes losse bestandsnamen in platte tekst (bijv. "paspoort Sander voor Mollie.jpeg", "Atom.app"). Sander moest die dan zelf opzoeken. Canonieke spec staat in [[GL-021-klikbare-bestandslinks]].

**How to apply:** Elke keer dat een antwoord een concreet lokaal bestand of map noemt — niet alleen bij opruimrondes, ook bij losse verwijzingen elders. Formaat: `[naam](file:///absoluut/pad)`, spaties percent-encoded, mappen met trailing slash. Geldt naast (niet i.p.v.) `[[wikilinks]]` voor myPKA-notities.
