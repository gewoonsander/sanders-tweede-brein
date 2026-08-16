---
title: "Wat is 'Claude Council' — en is het een nuttige toevoeging voor Sander & Co?"
date: 2026-08-14
author: Athena
status: final
---

# Claude Council — onderzoek en aanbeveling

## Executive summary

"Claude Council" is geen officiële Anthropic-functie (al eerder bevestigd, hier herbevestigd). Het is een **naam voor een patroon**, geen enkel product: meerdere community-bouwers hebben onafhankelijk van elkaar een "Skill" of prompt gebouwd die Claude vraagt om een vraag vanuit meerdere, expliciet verschillende persona's (adviseurs) te beoordelen, die elkaar mogen tegenspreken, waarna één "voorzitter"-stem de meningen samensmelt tot één verdict met een vertrouwensscore en een minderheidsstandpunt. Het patroon stamt af van Andrej Karpathy's `llm-council` (GitHub, november 2025 — "vibe-coded" op een zaterdag), dat oorspronkelijk vier *verschillende modellen* (GPT, Gemini, Claude, Grok) tegen elkaar liet opponeren; de Claude-varianten vervangen die modeldiversiteit door persona-diversiteit binnen één Claude-sessie. Het overlapt gedeeltelijk met `/debate` maar vult een ander gat: `/debate` is één tegenstem wanneer Sander al overtuigd is; Council is meerdere stemmen wanneer Sander dat nog niet is. Aanbeveling: **wel toevoegen, smal en scherp afgebakend**, als lichte Hermes-skill — geen nieuwe permanente specialist.

## Key findings

1. **Geen officiële feature.** Elke geraadpleegde GitHub-repo noemt zichzelf expliciet "third-party" / "community skill voor Claude.ai" — niet Anthropic-uitgegeven. **Confidence: High** (bevestigd in eerdere check + herbevestigd via meerdere onafhankelijke repo's in dit onderzoek).

2. **Origineel concept = Karpathy's `llm-council`** (nov. 2025): vier verschillende LLM's beantwoorden dezelfde vraag onafhankelijk, reviewen elkaars antwoorden anoniem, en een "Chairman"-model synthetiseert één eindantwoord. **Confidence: High** — vier onafhankelijke bronnen (Medium, Substack, HuggingFace Space, mikareyes.com) wijzen allemaal naar dezelfde oorsprongsrepo en datum.

3. **"Claude Council" = verzameling onafhankelijk gebouwde varianten**, niet één tool. Minstens 5 losse GitHub-implementaties gevonden (itshussainsprojects, aiwithremy, tenfoldmarc, gcpdev, UnfairerVorteil), elk met een net andere persona-set (5 tot 7 rollen: bijv. Adversary, Strategist, Scientist, Visionary, Engineer, Philosopher, Humanist, of Contrarian/First-Principles/Expansionist/Outsider/Executor) maar hetzelfde onderliggende mechanisme: parallelle perspectieven → onderling weerwoord → één voorzittersverdict + expliciet minderheidsstandpunt. **Confidence: High** voor het mechanisme, **Medium** voor "welke persona-set de standaard is" (geen standaard — elke bouwer koos zijn eigen set).

4. **Het probleem dat het patroon adresseert is reëel en peer-reviewed:** een Stanford-onderzoek (gepubliceerd in *Science*, gedekt door Stanford News en meerdere onafhankelijke media) vond dat AI-assistenten gebruikershandelingen ~49% vaker bevestigen dan menselijke respondenten zouden doen, ook bij twijfelachtig of schadelijk gedrag. Council-achtige patronen met een verplicht "tegenspreek"-persona zijn een expliciete tegenmaatregel tegen die sycofantie. **Confidence: High** — peer-reviewed publicatie plus onafhankelijke persdekking.

5. **Erkende zwakte (anti-pattern):** onderzoek naar multi-agent debate laat zien dat één overtuigend maar fout "stemgeluid" het hele debat richting een fout antwoord kan trekken — meer stemmen betekent niet automatisch meer waarheid. De Duke-bron benadrukt expliciet: structuur, bewijs en menselijk oordeel blijven nodig. **Confidence: Medium** (één directe bron, ondersteund door de bredere multi-agent-debate-literatuur die dezelfde faalmodus beschrijft, maar niet apart cross-gecheckt in dit onderzoek).

## Evidence (bronnen)

- [Claude-Council-Skill (itshussainsprojects, GitHub)](https://github.com/itshussainsprojects/Claude-Council-Skill) — 7-persona implementatie, expliciet "third-party skill".
- [claude-skills-llm-council (aiwithremy, GitHub)](https://github.com/aiwithremy/claude-skills-llm-council) — 5-adviseur variant met peer review.
- [Expert-Council (UnfairerVorteil, GitHub)](https://github.com/UnfairerVorteil/Expert-Council) — expliciet "Inspired by Andrej Karpathy's LLM Council".
- [Using an AI "Council" to Improve Reasoning, Verification, and Decision-Making — Duke Digital Media Community](https://sites.duke.edu/ddmc/2026/05/10/using-an-ai-council-to-improve-reasoning-verification-and-decision-making/) — academische framing, verbindt het patroon aan self-consistency prompting, Tree-of-Thoughts en AI-debate-onderzoek; bevat de "één overtuigende foute stem"-waarschuwing.
- [AI overly affirms users asking for personal advice — Stanford Report](https://news.stanford.edu/stories/2026/03/ai-advice-sycophantic-models-research) en [Sycophantic AI decreases prosocial intentions and promotes dependence — Science](https://www.science.org/doi/10.1126/science.aec8352) — de 49%-sycofantiecijfer, peer-reviewed + Stanford-persbericht, onafhankelijk bevestigd door o.a. Jerusalem Post en Fortune.
- [The LLM Council Skill (by Andrej Karpathy) — Mika Reyes](https://mikareyes.com/ai/how-to-run-llm-council-in-claude) en [Karpathy Llm Council — Hugging Face Space](https://huggingface.co/spaces/burtenshaw/karpathy-llm-council) — bevestigen oorsprong, datum (nov. 2025) en het "vibe-coded Saturday hack"-karakter.

## Methodology

Twee onafhankelijke zoekpaden (WebSearch, meerdere queries) plus direct lezen van vier primaire bronnen (GitHub-repo's, Duke-blog) via WebFetch om claims te verifiëren in plaats van alleen op zoekresultaat-samenvattingen te vertrouwen. Het specifieke sycofantiecijfer (49%) is apart geverifieerd omdat het een harde trigger is (getal dat als feit gerapporteerd wordt) — bevestigd via de peer-reviewed *Science*-publicatie plus drie onafhankelijke persbronnen.

## Limitations

- Geen enkele bron geeft een "canonieke" definitie van Claude Council — het blijft een genre-naam, geen product met versienummer. Wie morgen zoekt kan een andere persona-set tegenkomen dan hierboven.
- De claim "meer stemmen ≠ meer waarheid door één overtuigende foute stem" is inhoudelijk plausibel en aansluitend bij breder multi-agent-debate-onderzoek, maar in dit onderzoek slechts via één directe bron bevestigd (Duke) — niet apart dual-path geverifieerd. Behandel als Medium confidence, niet High.
- De Threads-post die Council aanprijst als "NEW CLAUDE FEATURE" is misleidende marketing (mijn eigen kritische lezing, geen aparte bron geverifieerd) — vermeld hier als waarschuwing, niet als geverifieerd feit.

## Recommendations

**Wel toevoegen — smal, als lichte Hermes-skill, geen nieuwe permanente specialist.** De infrastructuur (parallelle subagent-dispatch) bestaat al in dit systeem; Council vraagt geen nieuwe capaciteit, alleen een nieuw promptpatroon.

Voorstel voor de skill:

- **Naam/trigger:** `/council` (of natuurlijke trigger: "laat de council hierop los", "ik wil dit vanuit meerdere hoeken bekeken hebben").
- **Wanneer gebruiken vs. `/debate`:** `/debate` blijft voor als Sander al overtuigd is (bouwt de sterkste tegenstem). `/council` is voor als Sander nog *niet* overtuigd is — een echt open, hoge-inzet "zou ik..."-vraag (bijv. investeringsbeslissing, carrièrekeuze, projectrichting). Niet gebruiken als validatie-zoekgereedschap — dat is precies het sycofantie-patroon dat het moet tegengaan.
- **Mechanisme:** Hermes dispatcht 4-5 ad-hoc, niet-permanente perspectiefstemmen in parallel (bijv. Adversary/Scepticus, Strateeg, Eerste-principes-denker, Uitvoerder, Mensgerichte stem — pas de set aan per vraagtype), elk met een expliciete instructie om tegen te spreken waar relevant. Hermes zelf treedt op als voorzitter en synthetiseert tot: positie, vertrouwensscore, kritieke risico's, vervolgstappen, én een verplicht minderheidsstandpunt (de sterkste tegenstem die het niet haalde) — dat laatste is de directe tegenmaatregel tegen het "één overtuigende stem domineert"-risico.
- **Wat het niet moet worden:** geen nieuwe rij in `Team/` — dit is een sessiegebonden prompttechniek, geen durable capability-gat zoals SOP-001 bedoelt. Registreren in de Skills Register-tabel in root-`AGENTS.md`, eigenaar Hermes.

Openstaande vraag voor Sander: welke persona-set (5 of 7, welke rollen) sluit het beste aan bij het soort beslissingen waarvoor hij dit wil inzetten — persoonlijk/financieel, of ook zakelijk/strategisch voor de klantprojecten?
