---
name: feedback-machine-identiteit-verifieren
description: "Altijd hostname/system_profiler checken voordat iets beweerd wordt over welke Mac een sessie draait, nooit aannemen op basis van gebruikelijk werkstation"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fa0ae155-7c90-421a-9ffe-4fd359477ccf
  modified: 2026-08-16T09:11:54.289Z
---

Voordat ik iets beweer over welke fysieke machine een sessie draait (bv. "dit staat aan op de Mac Mini"), moet ik dat verifiëren met `hostname` en/of `system_profiler SPHardwareDataType` — nooit aannemen op basis van Sanders gebruikelijke werkstation.

**Why:** Op 2026-08-16 beweerde ik dat SuperWhisper-status gold voor "deze Mac Mini", terwijl de sessie in werkelijkheid op Sanders MacBook Air draaide (`MacBook-Air-van-Sander-2.local`). Ik nam dat aan omdat de Mac Mini zijn gebruikelijke werkstation is ([[user_sander_profiel]]), zonder te checken. Extra complicatie: sommige status (zoals de SuperWhisper-toggle) staat per werkmap in `/tmp` opgeslagen, dus zelfs een correcte hostname-check op de huidige machine zegt niets over andere machines — dat vereist een sessie die daadwerkelijk op die andere machine draait.

**How to apply:** Bij elke vraag of bewering over "welke Mac", "staat dit aan op de Mac Mini/MacBook", of machine-specifieke instellingen/bestanden: eerst `hostname`/`system_profiler` draaien, dan pas antwoorden. Machine-lokale status (zoals `/tmp`-bestanden) kan alleen gecontroleerd worden vanaf een sessie die op díe machine actief is.
