# Memory Index

Gegroepeerd per type (progressive disclosure, laag 0). Groeit een categorie voorbij ~15-20 entries of nadert dit bestand ~150 regels, splits dan die categorie naar een eigen `<type>/INDEX.md` met 2-3 regels per memory, en verwijs hier met één regel naartoe.

## Feedback

- [Keuzeopmaak met A/B/C labels](feedback_keuzeopmaak.md) — altijd (A)(B)(C) bij keuzevragen zodat Sander snel kan antwoorden via toetsenbord
- [Gmail links in overzichten en concepten](feedback_gmail_links.md) — altijd klikbare links per mail én per zelfgemaakt conceptmail (thread-ID, #drafts/ voor concepten)
- [Gratis tools voorkeur](feedback_gratis_tools.md) — altijd gratis alternatief eerst; Camtasia + Snagit opgezegd juni 2026
- [Altijd Nederlands, nooit Engels](feedback_taal_nederlands.md) — harde regel, herhaaldelijk gecorrigeerd
- [GL-013: keuzes altijd als A/B/C](feedback_gl013_enkelvoudige_keuzes.md) — harde regel, al 10+ keer gecorrigeerd, extra vangnet naast de myPKA-instructie zelf (mogelijk overlap met [[feedback_keuzeopmaak]] — bij gelegenheid samenvoegen)
- [Grotere klussen naar terminal-sessie](feedback_grotere_klussen_naar_terminal_sessie.md) — bij "kort vs lang"-keuze: leg de lange optie vast als taak i.p.v. meteen te doen
- [Klantcommunicatie: ik, niet wij](feedback_klantcommunicatie_ik_niet_wij.md) — GewoonSander is eenmanszaak, dus altijd "ik/mij" richting klanten, nooit "wij/ons"
- [Verifieer Gmail-verzendstatus zelf](feedback_verifieer_verzendstatus_gmail.md) — bij concepten zelf list_drafts/search_threads checken i.p.v. Sanders melding aan te nemen
- [Geen aannames als feiten](feedback_geen_aannames_als_feiten.md) — verzin geen ongemarkeerde invullingen in verslagen, alleen bronmateriaal
- [Bureaublad altijd leeg](feedback_bureaublad_leeg.md) — nooit snelkoppelingen/bestanden op het Bureaublad zetten, gebruik Finder-zijbalk/Dock i.p.v.
- [Bash-pipes blokkeren onbemande routines](feedback_bash_pipes_onbemande_routines.md) — geplande/scheduled routines mogen geen Bash-commando's met `|`/`&&`/`;` gebruiken voor triviale checks; Write maakt mappen zelf aan
- [ADC-verslag: geen quote-placeholder](feedback_adc_verslag_geen_quote.md) — nooit een quote-van-de-winnaar element opnemen, Sander verwijdert het altijd zelf en er is nooit een quote
- [Todoist-taken: letter + link](feedback_todoist_taaklijst_format.md) — altijd (A)(B)(C) label + klikbare Todoist-link per taak in elk taakoverzicht
- [Machine-identiteit verifiëren](feedback_machine_identiteit_verifieren.md) — altijd hostname/system_profiler checken i.p.v. aannemen welke Mac een sessie draait
- [SuperWhisper-plugin permanent uit](feedback_superwhisper_plugin_uit.md) — bewust uitgeschakeld in ~/.claude/settings.json wegens pop-ups, niet opnieuw voorstellen
- [macmini-SSH niet als fysieke aansluiting behandelen](feedback_macmini_ssh_niet_fysieke_aansluiting_aannemen.md) — Mediahub-werk vanaf MacBook Air kan via `ssh macmini`, niet aannemen dat lokale SSD-aansluiting nodig is
- [Klikbare bestandslinks](feedback_klikbare_bestandslinks.md) — altijd file://-link bij genoemde lokale bestanden/mappen, zie GL-021
- [GL-016: actienummer vóór contextcode](feedback_gl016_nummering_ipv_codes.md) — beslisblokken beginnen met sessiebreed nummer, gevolgd door emoji + 3-letter code, bv. `1 · 🔶 CLS`
- [Kill -9 en databehoud](feedback_kill_processen_databehoud.md) — nooit hele procesboom hard killen bij lopende bestandsverwerking; 2 voice-memo's onherstelbaar verloren op 2026-08-17
- [Sessiestempel bij sessiestart](feedback_sessiestempel_bij_sessiestart.md) — eerste reply begint met datum, tijdstip en onderwerp
- [Sessietitel-formaat](feedback_sessietitel_formaat.md) — `YYYY-MM-DD HH:MM · onderwerp` met de starttijd, gezet bij de eerste reply, niet pas bij close-session
- [Drankjes loggen via chat](feedback_drankjes_loggen_via_chat.md) — meldt hij een drankje, log direct een `- drink:`-regel en regenereer de spiegel
- [Transcriptie alleen bij gezien](feedback_transcriptie_alleen_bij_gezien.md) — nooit blanket transcriberen op basis van abonnement, alleen na daadwerkelijke consumptie (afgeluisterd/gezien)

## Projecten

- [myPKA Cockpit status](project_mypka_cockpit.md) — Todoist awaiting connector, Jortt geblokkeerd (ZZP-plan), Google Agenda Workspace-blokkade
- [SuperWhisper abonnement opzeggen](project_superwhisper_abonnement.md) — op termijn opzeggen als Whisper-automatisering staat (~1 jaar resterend)
- [ADC-verslag: standaard links](project_adc_verslag_template_links.md) — inschrijflink per toernooi + seizoenstand-link altijd toevoegen
- [Dubbele tweede-brein map op Mac mini](project_dubbele_tweede_brein_map.md) — echte map is ~/Documents/sanders-tweede-brein, niet de "Mac mini van Sander"-duplicaat (2026-07-07: memory- en Team-bestanden samengevoegd, rest van duplicaat kan na bevestiging weg)
- [Transcribeer-skill op meerdere machines](project_transcribeer_skill_multi_machine.md) — /transcribeer staat nu op Mac Mini + MacBook Air, Whisper-terugval delegeert via SSH naar whisper_host
- [Mac mini Schermdeling nog aanzetten](project_macmini_schermdeling_aanzetten.md) — herinner Sander zodra sessie op Mac mini draait, éénmalige fysieke bevestiging nodig
- [DaVinci Resolve Studio 20.3.2](project_davinci_resolve_studio.md) — externe scripting-API werkt, Claude Code kan Resolve rechtstreeks aansturen
- [Claude-abonnement tijdelijk op Max](project_claude_abonnement_tijdelijk_max.md) — bewust tijdelijk (camping), rond 2026-09-18 terug naar goedkoper plan
- [Huddle/Dartbuddies automatisering](project_huddle_dartbuddies_automatisering.md) — Huddle heeft geen API/MCP/webhook-events voor content of auto-reply, alleen gebruikersbeheer

## User

- [Sander profiel](user_sander_profiel.md) — ZZP Gewoon Sander + AKP Gezinshuis, tools, twee schermen, werkstijl
- [Woonadres Sander](user_adres.md) — Huismanstraat 34
- [Familienaam-conventie](user_familienaam_conventie.md) — kinderen heten "van Ockenburg" (geen "-Zwaan"), alleen Sander/Marieke voeren de dubbele naam
- [Drinkt alleen zwarte koffie](user_drinkt_alleen_zwarte_koffie.md) — ~99,9% van zijn drankgebruik, nooit naar melk/suiker vragen
- [Dartsnaam Sander Vos](user_dartsnaam_sander_vos.md) — in dartscontext heet hij "Sander Vos" (met z), niet Van Ockenburg-Zwaan
