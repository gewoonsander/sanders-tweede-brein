---
name: feedback-bash-pipes-onbemande-routines
description: "Onbemande/geplande routines mogen geen Bash-commando's met pipes of shell-operators (|, &&, ;) gebruiken voor triviale controles — die matchen geen losse Bash-permissieregel en blokkeren de run op een toestemmingsprompt waar niemand is om te bevestigen"
metadata:
  type: feedback
  originSessionId: adc-oost-verslag-ochtend-permissie-2026-08-04
---

Ontdekt bij de dagelijkse `adc-oost-verslag-ochtend`-routine (04-08-2026): de routine stokte elke ochtend op een toestemmingsprompt voor `ls -la ".../ADC/Verslagen/" 2>&1 | head -20`.

**Oorzaak:** losse allow-regels als `Bash(ls *)` en `Bash(head *)` dekken alleen enkelvoudige commando's. Een samengesteld commando met een pipe (`|`) — of `&&`, `;` — matcht geen van beide regels als geheel en vereist expliciete, losse toestemming. Bij een onbemand draaiende routine is er niemand om die te geven, dus de run loopt vast.

**Regel voor elke geplande/onbemande routine (Daedalus, Hermes):**
1. Vermijd triviale existence-checks via Bash (`ls`, `find`, `test -d`) vóór een schrijfactie — de Write-tool maakt ontbrekende mappen zelf aan, dus de check is meestal overbodig.
2. Als een Bash-check echt nodig is, gebruik dan een enkelvoudig commando zonder pipe/operator, of voeg het exacte samengestelde commando expliciet toe aan `.claude/settings.json`'s allow-lijst vóórdat de routine voor het eerst onbemand draait.
3. Bij het opzetten van een nieuwe scheduled routine: loop vooraf één keer interactief door wat de routine waarschijnlijk gaat doen, en keur onderweg alles goed met "Always allow" — dat voorkomt dat de eerste onbemande run al vastloopt.

Toegepast op [[WS-004-facebook-toernooi-verslag]] Fase 4 (04-08-2026): expliciete instructie toegevoegd om de map-check over te slaan.
