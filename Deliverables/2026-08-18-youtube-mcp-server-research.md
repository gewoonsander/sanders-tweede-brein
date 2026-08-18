# YouTube MCP-server voor analytics + upload/scheduling — haalbaarheidsonderzoek

**Onderzoeksvraag:** bestaat er een bruikbare MCP-server voor YouTube waarmee Sander vanuit Claude (1) kanaal-/video-statistieken kan bekijken en (2) video's kan uploaden of plannen voor publicatie?

## Executive summary

**Ja, het kan, maar niet met één volwassen, dominante server** — het landschap bestaat uit kleine, wisselend onderhouden community-projecten (2 tot 563 sterren), niemand daarvan is officieel door Google of Anthropic uitgebracht. Voor **uploaden + inplannen** is er één sterke, actief onderhouden kandidaat (`anwerj/youtube-uploader-mcp`) die het officiële `publishAt`-veld daadwerkelijk blootlegt. Voor **statistieken** moet je onderscheid maken tussen publieke cijfers (Data API, geen probleem) en echte dashboard-cijfers zoals kijktijd/omzet (Analytics API, aparte OAuth-scope, en alleen als eigenaar van het kanaal — niet als beheerder). Eén server (`pauling-ai/youtube-mcp-server`) claimt beide te combineren in 40 tools, maar is net dit jaar gestart, heeft weinig sterren en de README bevat al een verouderd quotacijfer. De populairste server in zoekresultaten (563★, ZubeidHendricks) doet **geen van beide** — enkel leesbare metadata, ondanks een beschrijving die "advanced analytics" belooft.

**Belangrijkste correctie op een veelgehoorde aanname:** de quota-drempel van 1.600 eenheden per upload waar praktisch elke gids (en zelfs een deel van de MCP-server-documentatie) nog naar verwijst, is **niet meer actueel**. Google heeft dit sinds 4 december 2025 verlaagd naar circa 100 eenheden, en sinds 1 juni 2026 loopt `videos.insert` zelfs in een eigen dagbudget van 100 aanroepen, los van de gedeelde pool van 10.000 eenheden. Quota is dus voor normaal gebruik (een paar uploads per dag) waarschijnlijk geen praktisch probleem meer.

## Bevindingen (genummerd, met betrouwbaarheid)

**1. Geen officiële Google- of Anthropic-server voor YouTube.** [Confidence: Medium-High] Google heeft wel 50+ eigen MCP-servers voor Drive, Gmail, Calendar, Ads, BigQuery e.d., maar niet voor YouTube. Alle gevonden servers zijn community-wrappers om de officiële YouTube Data API v3 / Analytics API. Bron: [usecarly.com](https://www.usecarly.com/blog/youtube-mcp/) + bevestigd door afwezigheid in de officiële [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)-registry en Google's eigen MCP-serverlijst.

**2. `status.publishAt` bestaat écht en werkt zoals verwacht.** [Confidence: High — primaire bron] Volgens de officiële YouTube Data API-documentatie kan `publishAt` (ISO 8601) alleen gezet worden als `privacyStatus` op `private` staat; YouTube zet de video automatisch op `public` op het opgegeven tijdstip. Bron: [developers.google.com/youtube/v3/docs/videos/insert](https://developers.google.com/youtube/v3/docs/videos/insert), bevestigd door twee onafhankelijke praktijkgidsen ([vidno.ai](https://vidno.ai/blog/auto-upload-video-youtube-api), [posteverywhere.ai](https://posteverywhere.ai/blog/post-to-youtube-api)).

**3. Van de gecheckte upload-servers legt maar één expliciet `publishAt` bloot als tool-parameter.** [Confidence: Medium] `anwerj/youtube-uploader-mcp` documenteert "scheduled publish times" met public/private/unlisted statussen. `mrchevyceleb/youtube-mcp` heeft wél een `upload_video`-tool, maar de gedocumenteerde parameterlijst (filePath, title, description, tags, categoryId, privacyStatus, playlistId) bevat **geen** publishAt/scheduling-parameter — bevestigd afwezig, niet enkel niet gevonden. Van `pauling-ai`'s upload-tool kon de exacte parameterlijst niet uit de README worden geverifieerd (open vraag, zie Beperkingen).

**4. Quota voor uploads is fors verlaagd, recent (dec 2025 / juni 2026).** [Confidence: Medium-High] Primaire bron: Google's eigen [revision history](https://developers.google.com/youtube/v3/revision_history?hl=en) vermeldt letterlijk een wijziging "from approximately 1600 units to approximately 100 units" (4 dec 2025) en dat `videos.insert` en `search.list` sinds 1 juni 2026 in eigen quotabuckets van 100 aanroepen/dag lopen, los van de gedeelde 10.000-eenheden-pool voor overige endpoints. Twee onafhankelijke secundaire bronnen ([blotato.com](https://www.blotato.com/blog/youtube-api-pricing), [getphyllo.com](https://www.getphyllo.com/post/youtube-api-limits-how-to-calculate-api-usage-cost-and-fix-exceeded-api-quota)) bevestigen dezelfde datum en cijfers. Kanttekening: dit zijn SEO-contentsites, dus de primaire Google-bron draagt het gewicht van deze bevinding, de blogs bevestigen alleen dat het geen eenmalige lees-fout is.

**5. Analytics API ≠ Data API, en dat raakt Sanders opzet.** [Confidence: High] Data API geeft publieke cijfers (view count, like count, comment count) met alleen een API-key. Analytics API geeft echte dashboardcijfers (kijktijd, retentie, subscriber-mutaties, omzet) en vereist OAuth-scopes (`yt-analytics.readonly`, voor omzet ook `yt-analytics-monetary.readonly`). Volgens `pauling-ai`'s README moet het Google-account dat authenticeert **eigenaar** van het kanaal zijn — een beheerdersaccount volstaat niet voor Analytics-data. Twee servers bevestigen dit onderscheid onafhankelijk (`pauling-ai`, `i1s-abhishek/youtube-studio-mcp`).

**6. De populairste server (563★) doet niet wat de beschrijving belooft.** [Confidence: High — geverifieerd op broncode/README] `ZubeidHendricks/youtube-mcp-server` beschrijft zichzelf als "video management, Shorts creation, and advanced analytics", maar de daadwerkelijke README somt 10 tools op die uitsluitend lezen (video's opzoeken, transcripten, kanaal-/playlistinfo) via een simpele API-key, zonder OAuth, zonder upload, zonder analytics. Dit is het duidelijkste voorbeeld in dit onderzoek van "marketing-beschrijving ≠ werkelijke functionaliteit" — controleer altijd de tool-lijst zelf, niet de titel/tagline.

**7. n8n heeft een native YouTube-node, maar zonder scheduling of analytics.** [Confidence: Medium] De ingebouwde node ondersteunt channels/playlists/playlist-items/video's, inclusief "Upload a video", maar de officiële n8n-documentatie noemt geen `publishAt`-parameter en geen analytics-operatie. Praktijk (3 onafhankelijke bronnen: n8n-workflowtemplates, een dev.to-workflowbeschrijving, upload-post.com) laat zien dat gebruikers voor scheduling en analytics de generieke **HTTP Request-node** met OAuth2-credentials tegen de ruwe YouTube API/Analytics API aanroepen — dat werkt, kost alleen wat meer bouwwerk dan een kant-en-klare node.

## Tabel: gevonden MCP-servers

| Server | Sterren | Laatste push | Upload (`videos.insert`) | `publishAt` | Analytics API | Alleen Data API | OAuth vereist |
|---|---|---|---|---|---|---|---|
| [ZubeidHendricks/youtube-mcp-server](https://github.com/ZubeidHendricks/youtube-mcp-server) | 563 | 8 aug 2026 | Nee | Nee | Nee | Ja (10 tools, alleen lezen) | Nee (API-key) |
| [pauling-ai/youtube-mcp-server](https://github.com/pauling-ai/youtube-mcp-server) | 17 | — (feb 2026) | Ja (`youtube_upload_video`) | Niet in README bevestigd | Ja (13 tools) | — | Ja, kanaal-**eigenaar** vereist |
| [i1s-abhishek/youtube-studio-mcp](https://github.com/i1s-abhishek/youtube-studio-mcp) | 11 | 20 apr 2026 | Nee | Nee | Ja (28-daagse kanaal- + video-analytics) | — | Ja (4 scopes) |
| [mrchevyceleb/youtube-mcp](https://github.com/mrchevyceleb/youtube-mcp) | 2 | 14 aug 2026 | Ja (resumable) | Nee — bevestigd afwezig | Ja (`get_analytics`) | — | Ja |
| [anwerj/youtube-uploader-mcp](https://github.com/anwerj/youtube-uploader-mcp) | 50 | 12 jul 2026 | Ja | **Ja** — "scheduled publish times" | Nee | — | Ja |
| Upload-Post MCP (multi-platform) | — | — | Ja (via eigen SaaS-laag) | Ja (`list_scheduled`/`edit_scheduled`) | Ja (`get_analytics`, niet YT-specifiek gedocumenteerd) | — | Eigen API-key (niet Google-OAuth), $16/mnd of gratis tier 10 uploads/mnd |

Sterren/datums via GitHub API (`api.github.com`), 18 augustus 2026.

## Quota/haalbaarheid

- Standaard dagbudget: 10.000 eenheden, gedeeld voor de meeste endpoints. Sinds 1 juni 2026 hebben `videos.insert` én `search.list` een **eigen** dagbudget van 100 aanroepen, los van die 10.000. Praktisch: tot **100 uploads/dag** mogelijk op het gratis niveau — ruim voldoende voor een individueel kanaal.
- Setup: eigen Google Cloud-project, YouTube Data API v3 + YouTube Analytics API inschakelen, OAuth-consentscherm in "Testing"-modus met eigen account als testgebruiker (zelfde patroon dat al werkt voor `sheets_write.py` in dit myPKA — geen aparte verificatie nodig voor persoonlijk gebruik).
- Scopes: `youtube`/`youtube.force-ssl` voor schrijven (upload, thumbnails, ondertitels), `yt-analytics.readonly` voor kijktijd/retentie/subscribers, `yt-analytics-monetary.readonly` erbij voor omzetcijfers.

## Aanbeveling

Twee haalbare routes, geen enkele is zonder wat eigen onderhoud:

- **A — Eén MCP-server die alles doet:** self-host `pauling-ai/youtube-mcp-server` (40 tools, Data + Analytics + Reporting API, inclusief upload). Voordeel: alles binnen Claude, één setup. Nadeel: nieuw project (sinds feb 2026), weinig sterren, nog geen bewezen betrouwbaarheid, en het `publishAt`-gedrag van de upload-tool is niet uit de README te bevestigen — zou eerst getest moeten worden.
- **B — Twee gespecialiseerde servers:** `anwerj/youtube-uploader-mcp` voor upload+schedule (actief, bevestigd `publishAt`) gecombineerd met `i1s-abhishek/youtube-studio-mcp` of `mrchevyceleb/youtube-mcp` voor analytics. Voordeel: elk onderdeel is bij een kleiner, doelgerichter project met duidelijk gedocumenteerd gedrag. Nadeel: twee OAuth-setups, twee servers om te onderhouden.
- **C — n8n-route (al in gebruik bij Sander):** native YouTube-node voor upload, HTTP Request-node met OAuth2 voor `publishAt` en Analytics API. Geen MCP-server nodig, geen extra self-hosting, bewezen n8n-integratie in de huidige stack. Nadeel: geen conversationele toegang vanuit Claude — het wordt een losse workflow, geen "vraag het gewoon aan Claude"-ervaring.

Gegeven Sanders voorkeur voor bewezen, onderhoudsarme tooling (n8n staat al) en zijn regel om geen aannames als feiten te presenteren: **C als eerste stap** (laagste risico, herbruikt bestaande infrastructuur), met **B als vervolgstap** als conversationele toegang vanuit Claude de doorslag geeft — niet A, tenzij Sander eerst zelf `pauling-ai`'s upload-tool test op het daadwerkelijke `publishAt`-gedrag.

## Methodologie

WebSearch (algemeen, GitHub-gericht, mcp.so/Smithery/Glama/PulseMCP-gericht) gecombineerd met WebFetch direct op GitHub README's, ruwe README-bestanden, en `api.github.com` voor harde metadata (sterren, forks, laatste push, licentie) — dat laatste om niet af te gaan op AI-samengevatte beschrijvingen die bleken af te wijken van de werkelijke tool-lijst (zie bevinding 6). Voor het quotacijfer (specifiek getal, tegenstrijdige info tussen bronnen) is de officiële Google revision-history-pagina als primaire bron gebruikt en gecontroleerd tegen twee onafhankelijke secundaire bronnen — dit volgt Athena's escalatieregel voor cijferclaims. **Kanttekening bij protocol:** de tweede, mechanisch onafhankelijke zoekpad (Perplexity-script) kon in deze sessie niet worden aangeroepen — geen Bash-tool beschikbaar in deze uitvoeringsomgeving. In plaats daarvan is de officiële Google-bron rechtstreeks opgehaald (WebFetch) en apart gecontroleerd tegen WebSearch-resultaten van twee onafhankelijke secundaire bronnen; dat geeft geen volledig mechanisch onafhankelijk tweede pad, wat de betrouwbaarheid van het quotacijfer op Medium-High houdt in plaats van High.

## Beperkingen

- `pauling-ai/youtube-mcp-server`'s exacte upload-parameters (met of zonder `publishAt`) konden niet uit de README worden bevestigd — geen broncode geïnspecteerd, alleen documentatie. Open vraag.
- Geen van de servers is door Athena daadwerkelijk geïnstalleerd/getest — dit onderzoek is documentatie-gebaseerd, niet functioneel geverifieerd. Voor een definitief go/no-go zou Daedalus een van de kandidaten lokaal moeten opzetten en het `publishAt`-gedrag met een echte (private) testupload moeten bevestigen.
- Upload-Post MCP se pricing/analytics-diepgang voor specifiek YouTube kon niet volledig bevestigd worden (documentatiepagina gaf een 403 bij directe fetch); wat wél bevestigd is komt van de eigen GitHub-repo-samenvatting.
- Geen sterren/update-datum kunnen achterhaald worden voor Upload-Post MCP zelf (wel voor het onderliggende platform qua pricing).

## Volgende stappen

- Wil je dit verder brengen: ik routeer naar **Daedalus** om optie B of C daadwerkelijk op te zetten (Google Cloud-project, OAuth, eerste testupload met `publishAt`).
- Bewaar dit rapport als naslag zodra je kiest — de tabel en quota-cijfers zijn met datum geprikt (18 augustus 2026) en kunnen na een volgende Google-quotawijziging verouderen.
