---
title: Huddle Platform Research + Huddle-Specialist Hire Brief
date: 2026-07-14
author: Athena
type: hire-research + platform-knowledge-digest
status: living-document
last_verified: 2026-07-14
next_review: 2026-10-14
review_cadence: quarterly
---

# Huddle Platform Research & "Huddle-specialist" Hire Brief

## Changelog

- **2026-07-14** — Initial research pass (Athena). Full digest below. Next scheduled refresh: 2026-10-14 per [[SOP-014-refresh-platform-specialist-knowledge]].

**Primary source:** [help.thehuddle.nl/nl](https://help.thehuddle.nl/nl/) — Huddle's official Dutch-language help center. 12 categories, ~106 published articles as of 2026-07-14. This brief is built from ~55 articles read directly, covering every category, weighted toward onboarding, community/engagement, courses, events, admin/moderation, notifications, and Plug&Pay integration per the brief.

**Methodology note:** Platform mechanics (how a feature works, what steps a setting requires) are necessarily single-sourced against Huddle's own documentation — there is no independent second documentation source for a vendor's own product, so this is treated as authoritative rather than flagged as a verification gap. Where a claim is money-relevant or decision-relevant (subscription tier gating), it was cross-checked against Huddle's official pricing page (`thehuddle.nl/tarieven`) and one independent third-party review aggregator, both cited in §13. Any place where the help center itself was silent, incomplete, or contradicted the pricing page is flagged explicitly in §14 (Gaps) rather than filled in with inference.

---

## Part 1 — Platform Knowledge Digest

### 1. What Huddle Is

Huddle is a white-label-ish (own domain, own branding) platform for building "een professionele community en leeromgeving onder je eigen merk" (a professional community and learning environment under your own brand) — aimed at coaches, trainers, experts, and entrepreneurs turning knowledge into scalable online programs with an engaged community layered on top. *(Source: [Huddle uitgelegd](https://help.thehuddle.nl/nl/articles/15516266-huddle-uitgelegd))*

Six pillars, all under one roof: **Community**, **E-learning**, **Events**, a native **mobile app** (iOS/Android), **gamification/engagement tooling**, and a growing set of **AI features** (course generation, transcription, the "Huddle Coach" tutor).

### 2. Onboarding & Instance Setup (admin-side)

**Installing a new Huddle** *(Source: [Starten met Huddle: jouw Huddle installeren](https://help.thehuddle.nl/nl/articles/3084336-starten-met-huddle-jouw-huddle-installeren))*:
1. Activate via the personalized link in the welcome email.
2. Enter community name + subdomain (starts on `.thehuddle.nl`, changeable later).
3. Confirm email address.
4. Set username/password — auto-redirected into the new instance.
5. Toggle active components: **Products** on by default; **Community** optional; **Events** only available on Premium/Ultimate.
6. Upload logo + brand colors (all adjustable later).
7. Enter the admin panel via the gear icon (top right) for further configuration.

**Setting up the community after install** *(Source: [Starten met Huddle: Jouw Huddle opzetten](https://help.thehuddle.nl/nl/articles/9431504-starten-met-huddle-jouw-huddle-opzetten))* — a 7-step sequence: admin dashboard → general info → design → create products (via categories) → create community channels (an "introduction channel" is explicitly recommended to "lower the threshold for members to actively participate") → grant user access (manual / Plug&Pay / self-registration) → configure access levels (Premium/Ultimate; auto-created when a new product is made).

**AI-assisted setup**: a "Video: Online programma maken met AI" walkthrough claims a full product can be built in ~30 minutes using AI to draft course content, generate images, auto-transcribe video, and wire up dripping/certificates. *(Source: [Video: Online programma maken met AI](https://help.thehuddle.nl/nl/articles/11461925-video-online-programma-maken-met-ai))*

### 3. Getting Members In (the actual onboarding-flow surface)

Seven distinct access-granting mechanisms exist *(Source: [Hoe krijgen nieuwe gebruikers toegang tot mijn Huddle?](https://help.thehuddle.nl/nl/articles/9526612-hoe-krijgen-nieuwe-gebruikers-toegang-tot-mijn-huddle), cross-checked against the dedicated articles for each method)*:

1. **Plug&Pay integration** — automatic user creation + access-level assignment on purchase/form-submit (see §12).
2. **Third-party marketing tools** — e.g. ActiveCampaign/MailBlue form submissions auto-add members.
3. **Invitation links** — admin-generated URL, optional usage cap and expiry date, optional pre-attached access levels. Created under Users > Manage > Invite. *(Source: [Gebruikers toevoegen via een uitnodigingslink](https://help.thehuddle.nl/nl/articles/13140395-gebruikers-toevoegen-via-een-uitnodigingslink))*
4. **Manual add** — admin panel, name + email + access level.
5. **Bulk CSV import** — mandatory columns `email`, `firstname`, `lastname`; invalid rows highlighted and skipped with an emailed failure report; choose whether to email login credentials. *(Source: [Gebruikers importeren in jouw Huddle](https://help.thehuddle.nl/nl/articles/8596432-gebruikers-importeren-in-jouw-huddle))*
6. **Self-registration** — Settings > Accessibility > "allow visitors to create an account." Either a visible register button on the login page, or a hidden direct URL: `https://[domain].huddlecommunity.com/login#register`. New self-registered users can be auto-assigned a default access level. *(Source: [Gebruikers zelf laten registreren op jouw Huddle](https://help.thehuddle.nl/nl/articles/8597110-gebruikers-zelf-laten-registreren-op-jouw-huddle))*
7. **Public access** — make the Huddle publicly browsable without login, gating only specific content via access levels.

**First-touch member communication**: the **welcome email** (Settings > Email, type "Welcome email") is sent automatically to users created via Plug&Pay, Zapier, or manual-add-with-credentials-email. It is a one-shot, non-resendable email — "cannot be manually resent to existing members." Community name pulls from General Settings; a live preview (eye icon) is available before saving. Delivery to a specific user can be audited under that user's profile > Emails tab. *(Source: [Welkomstmail aanpassen](https://help.thehuddle.nl/nl/articles/9679951-welkomstmail-aanpassen))* — this is the single highest-leverage onboarding touchpoint documented and the natural anchor for any onboarding video/flow work.

**Login troubleshooting** members hit most often *(Source: [Ik kan als gebruiker niet inloggen in Huddle](https://help.thehuddle.nl/nl/articles/9000312-ik-kan-als-gebruiker-niet-inloggen-in-huddle))*: wrong URL (each Huddle has its own domain — use the centralized login portal, not a guessed URL), wrong email (multiple emails in play), wrong password (reset flow), and expired magic-login-links (15-minute expiry, auto-reissued).

### 4. Access Levels ("Toegangsniveaus") — the permission backbone

This is the single most load-bearing concept for anything involving Plug&Pay tier-mapping. Cross-referenced across 6 articles, all internally consistent:

- **What they are**: a gate — content tagged with an access level is only visible to users holding that level. *(Source: [Toegangsniveaus uitgelegd](https://help.thehuddle.nl/nl/articles/8596604-toegangsniveaus-uitgelegd))*
- **What they can gate**: products (courses), individual modules, individual lesson pages (only for pages not nested in a module), channels, groups, and events.
- **Availability**: Premium & Ultimate only — Lite has no access-level system at all.
- **Creating one**: Settings > Toegangsniveaus > + Nieuw toegangsniveau > name it > save > optionally set as default-for-new-users > optionally set duration > attach content under "Gekoppelde content" > assign to users individually via their profile's Toegang tab. *(Source: [Toegangsniveau aanmaken](https://help.thehuddle.nl/nl/articles/13513708-toegangsniveau-aanmaken))*
- **Temporary access levels**: four modes — always active (default), start-date-triggered, N-days-from-grant, or a fixed date range. Used for trials, cohort launches, and time-boxed challenges. Admins can extend/adjust per-user via the Access tab. Premium/Ultimate only. *(Source: [Werken met tijdelijke toegangsniveaus](https://help.thehuddle.nl/nl/articles/8596766-werken-met-tijdelijke-toegangsniveaus))*
- **Granular gating**: a course-level access level is "leading" and cannot be overridden by a module-level access level below it — module/lesson-level access levels are for offering *partial* free previews or upsell add-ons underneath an already-purchased course, not for widening access beyond the course level. *(Source: [Product afschermen met toegangsniveaus](https://help.thehuddle.nl/nl/articles/8597743-product-afschermen-met-toegangsniveaus), [Toegang geven tot een losse module](https://help.thehuddle.nl/nl/articles/9538465-toegang-geven-tot-een-losse-module))*
- **Lesson-page-level gating** exists only for standalone pages not inside a module. *(Source: [Toegangsniveau koppelen aan een lespagina](https://help.thehuddle.nl/nl/articles/15504873-toegangsniveaus-koppelen-aan-een-lespagina))*

### 5. E-learning / Courses

**Content hierarchy**: Product → Modules ("chapters") → Pages ("lessons"), each page mixing text, video, audio, images, and downloadable attachments. *(Source: [De e-learning uitgelegd](https://help.thehuddle.nl/nl/articles/15081798-de-e-learning-uitgelegd), [Een cursus maken in Huddle](https://help.thehuddle.nl/nl/articles/8601329-een-cursus-maken-in-huddle))*

**Creating a course**: gear icon → Producten → Product toevoegen → name + type "online cursus" → (Premium/Ultimate) optionally mark private, which auto-creates an associated access level → build modules/pages → configure the **Gegevens** tab (name, URL, category, description, author, USPs, FAQ) and the **Toegang** tab (publish now/scheduled, access-level gating).

**Dripping** (staggered content release): per-module or per-lesson granularity; daily or weekly cadence; three trigger anchors — course-start date, publish date, or access-level-activation date; per-user start-date overrides available; requires every module to have ≥1 lesson; Premium/Ultimate only. *(Source: [Dripping: lessen gedeeltelijk laten vrijkomen](https://help.thehuddle.nl/nl/articles/8601384-dripping-lessen-gedeeltelijk-laten-vrijkomen))* Dripping notifications are a separate opt-in toggle at course level (Dripping tab > "Send notifications"), customizable email template with `:firstname`/`:lastname`/`:course`/`:lesson` variables, member-level channel prefs (push/email/none) — and importantly they only fire for content unlocked *after* the member already has access, never for content available at enrollment, and simultaneous multi-lesson releases collapse into one notification. *(Source: [Dripping notificaties instellen](https://help.thehuddle.nl/nl/articles/15068291-dripping-notificaties-instellen))*

**Quizzes** (Ultimate only): 3 question types (multiple choice — supports 0, 1, or multiple correct answers; open text — exact-match or fuzzy; true/false); configurable pass/fail scoring threshold, timer, retake permission, immediate feedback, answer-review; linked into a course via a dedicated "Quiz" page type; results viewable at E-learning > Quizzen > Statistieken. *(Source: [Een quiz aanmaken](https://help.thehuddle.nl/nl/articles/8600468-een-quiz-aanmaken))*

**Certificates** (Premium/Ultimate): built at E-learning > Certificaten, with variable-personalization (first name, course name, date), uploaded/drawn signature, logo, and a fixed set of templates (no custom templates). Attach to a course via the course's Certificaat setting. Three send triggers: manual (per-user, via the envelope icon in the participants list), auto-on-all-lessons-viewed, or auto-on-all-quizzes-passed. Members see their certificates on their own profile; admins see them under a user's Certificaten tab. *(Source: [Een certificaat aanmaken en versturen](https://help.thehuddle.nl/nl/articles/8594016-een-certificaat-aanmaken-en-versturen))*

**Huddle Coach**: an AI tutor scoped strictly to a Huddle's own published text content (lesson text + auto-generated video/audio transcripts) — explicitly does **not** use the open internet, cannot see draft/scheduled courses, cannot bypass a member's own access restrictions, cannot read attachments/non-text media, and is not trained on community conversations. Answers adapt to the user's current context (course overview vs. specific lesson). Tone/name is customizable; multi-language support. Accessible via a button, with text/voice/attachment input. *(Source: [De Huddle Coach uitgelegd](https://help.thehuddle.nl/nl/articles/13348963-de-huddle-coach-uitgelegd))* — **this is a Premium/Ultimate feature per the official pricing table (§13); the article itself doesn't state the tier gate explicitly, worth flagging as a minor documentation gap (§14).**

**Video Library**: centralized media hub (Products > Video Library) supporting direct upload + Vimeo sync + YouTube/iframe embedding, folder organization, search/filter/sort, a trash/restore flow, and AI-generated transcripts/summaries on uploaded video. *(Source: [De Videobibliotheek uitgelegd](https://help.thehuddle.nl/nl/articles/15082604-de-videobibliotheek-uitgelegd))*

**Product categories**: Producten > Categorie toevoegen; products get assigned to a category for member-facing filtering/discovery. *(Source: [Je producten verdelen in categorieën](https://help.thehuddle.nl/nl/articles/8593829-je-producten-verdelen-in-categorieen))*

**Not deep-dived but present in the help center** (exists, not read in full for this brief — flag for on-demand lookup): bestanden-als-product, media toevoegen aan e-learning, video/audio transcript-generation-with-AI articles, werken met iFrame codes, een product inplannen (scheduled publish), een auteur toevoegen, notities maken bij lespagina's.

### 6. Community & Engagement

**Structure**: Channels are "the foundation" of the community; channels are organized into categories. Two channel types exist and **cannot be changed after creation**: **Timeline** (general posts — text/image/video) and **Moodboard** (image-highlight format). Channel visibility options: homepage-visible, access-level-gated, or "closed" (admin/moderator-post-only, presumably member-read). *(Source: [De community uitgelegd](https://help.thehuddle.nl/nl/articles/9833115-de-community-uitgelegd), [Een kanaal aanmaken](https://help.thehuddle.nl/nl/articles/8591953-een-kanaal-aanmaken))*

**AI channel suggestions**: on by default, no setup required — as a member composes a post, Huddle analyzes the draft text and surfaces matching channels (only ones the member can access) at the top of the channel picker; never forces a choice; admins can disable it in Community Settings. *(Source: [AI-kanaalsuggesties uitgelegd](https://help.thehuddle.nl/nl/articles/15922880-ai-kanaalsuggesties-uitgelegd))*

**Posts**: text, images, video, emoji, voice messages; feed sortable by recent/newest/followed/popular/scheduled(admin-only); posts can be pinned, moved between channels, closed to replies, or deleted; posts can be **scheduled** for future auto-publish via a scheduling button, with the scheduled datetime editable up until it fires. *(Source: [De community uitgelegd](https://help.thehuddle.nl/nl/articles/9833115-de-community-uitgelegd), [Een gesprek inplannen](https://help.thehuddle.nl/nl/articles/13106567-een-gesprek-inplannen))*

**Polls**: attached via the + icon on a new post; requires accompanying written text (poll alone isn't sufficient); configurable: allow answer changes, allow member-added options, show who-voted-what, allow multi-select, end date. **Cannot be edited once posted** — verify before publishing. *(Source: [Een poll aanmaken in de community](https://help.thehuddle.nl/nl/articles/9460307-een-poll-aanmaken-in-de-community))*

**Header ("Koptekst")**: an optional ≤100-character profile subtitle shown wherever a member's name appears (profile, posts, DMs) — LinkedIn-headline analog. *(Source: [Koptekst uitgelegd](https://help.thehuddle.nl/nl/articles/14818348-koptekst-uitgelegd))*

**Member Directory ("Ledenoverzicht")**: opt-in feature (Leden > Aanzetten). List view (sorted by recent activity) or map view (locations fuzzed to a 1km radius for privacy). Only members with public profiles appear. Up to 3 profile fields shown/filterable per member; access-level-gated visibility available. *(Source: [Het ledenoverzicht uitgelegd](https://help.thehuddle.nl/nl/articles/13968088-het-ledenoverzicht-uitgelegd), [Het ledenoverzicht inschakelen](https://help.thehuddle.nl/nl/articles/15129134-het-ledenoverzicht-inschakelen))*

**Profile fields**: admin-managed under Members > (⋮) > Manage Profile Fields — activate stock fields or create custom ones (name, icon, field type); drag-to-reorder; only the first 3 completed+public fields surface in the directory by default; new fields trigger member notifications nudging profile completion. *(Source: [Profielvelden aanmaken en beheren](https://help.thehuddle.nl/nl/articles/13968158-profielvelden-aanmaken-en-beheren))*

**Groups**: user-created channels (as opposed to admin-created channels) — deliberately decentralized to build member ownership/investment. Members manage via a "Groepen" nav button and "Mijn groepen"; can create public or invite-only private groups with title/description/emoji. Admins can edit/delete any group, gate private groups by access level, or disable the entire feature. **Ultimate-only per the official pricing table** — the community article itself doesn't state this tier gate explicitly (flagged in §14). *(Source: [Groepen in jouw community](https://help.thehuddle.nl/nl/articles/8592181-groepen-in-jouw-community))*

**Gamification**: points awarded for posting/replying/receiving reactions, admin-configurable point values, rising "levels." Leaderboard shows the top 10 most active members over a trailing 30 days (admins can exclude admin/mod accounts); leaderboard members get a trophy badge. Login streaks — 3+ consecutive days earns a "flame" icon next to the username. Whole system can be disabled. *(Source: [Scorepunten & het leaderboard](https://help.thehuddle.nl/nl/articles/9471144-scorepunten-het-leaderboard))*

**Private messages**: 1:1 DMs via the chat icon; attachments/photos/video/GIFs supported; red-badge + push + email notification options; private-profile members cannot receive DMs; admins can disable the entire feature (Settings > Accessibility) — the docs explicitly caution this "reduces member interaction and community connection." *(Source: [Privéberichten uitgelegd](https://help.thehuddle.nl/nl/articles/8592700-priveberichten-uitgelegd))*

**Announcements**: dashboard + product-overview banner; title, description, optional CTA button+URL, access-level targeting, preview before publish. **Hard cap: one announcement per day.** Ultimate sends an automatic push notification to eligible members. *(Source: [Een aankondiging plaatsen](https://help.thehuddle.nl/nl/articles/11991525-een-aankondiging-plaatsen))*

### 7. Events

Premium/Ultimate only (Lite has no events module). Create via Events > Nieuw: image, name, description, date (surfaces on the community calendar), an info/registration link, a participants-only link+button-text. Public events = one-click join; private events = invite-only or access-request, with access-level auto-entry configurable. Admins can invite individuals or a whole access-level cohort; "allow user invitations" lets attendees invite others. Auto push+email at event start; email content customizable at Settings > Emails. *(Source: [Een evenement aanmaken in jouw Huddle](https://help.thehuddle.nl/nl/articles/8592099-een-evenement-aanmaken-in-jouw-huddle))*

**Recurring events**: "Herhaalt" field — none / daily / weekly-on-day / monthly-on-position / weekdays-only / custom (frequency+interval+end condition: never / after N occurrences / on a date). Huddle pre-generates a rolling window of future instances and tops it up as events occur. **Each occurrence is fully independent** — its own chat, its own participant list, separate registration required per occurrence. *(Source: [Een terugkerend evenement instellen](https://help.thehuddle.nl/nl/articles/15846814-een-terugkerend-evenement-instellen))*

Events can be duplicated (article exists: [Een evenement dupliceren](https://help.thehuddle.nl/nl/articles/11999592-een-evenement-dupliceren), not deep-dived).

### 8. Notifications & Re-engagement Automation

**Channels**: in-app, email, push, desktop. Triggers include: new conversations (from admin/mod or peer), DMs, mentions, replies-to-followed-threads, event/group invitations, event-start reminders, digest emails, announcements, and inactivity/incomplete-course nudges. Per-notification-type push/email toggles live in member notification settings. Email throttling: max one notification email per conversation per 12 hours (mentions within that window batch into one email). Channel-level muting is available. Admins can globally disable push for user-created conversations, or require an email alert on new registrations. *(Source: [Notificaties uitgelegd](https://help.thehuddle.nl/nl/articles/8592271-notificaties-uitgelegd))*

**Digest** (Premium/Ultimate): weekly or monthly roundup of trending community activity; customizable send day/time, subject, intro copy; auto-send toggle; access-level targeting; optional leaderboard/events inclusion. **Hard floor: only sends if ≥3 new messages posted in the period** — quiet communities simply get no digest that cycle. *(Source: [Digest](https://help.thehuddle.nl/nl/articles/8594084-digest-recente-activiteit-van-jouw-huddle-naar-leden-versturen-per-mail))*

**Three built-in lifecycle reminder automations**, all sharing the identical 7-day / +30-day / +30-day (3 total nudges) cadence and all customizable at Settings > Email + toggle-able at Settings > Notifications, and all skipping banned/deleted users:
- **Inactive user reminder** — fires for users inactive 7 days to 3 months; cycle resets on re-login. *(Source: [Herinnering voor inactieve gebruikers](https://help.thehuddle.nl/nl/articles/13130962-herinnering-voor-inactieve-gebruikers))*
- **Incomplete course reminder** — targets users with 0–90% course progress and 7–30 days since last lesson view; only nudges on the most-recently-viewed incomplete course. *(Source: [Herinnering voor onvoltooide cursus](https://help.thehuddle.nl/nl/articles/13130957-herinnering-voor-onvoltooide-cursus))*
- **Never-logged-in reminder** — targets accounts 7 days–3 months old that have never logged in; stops permanently on first login. *(Source: [Herinnering voor niet-ingelogde gebruikers](https://help.thehuddle.nl/nl/articles/13130601-herinnering-voor-niet-ingelogde-gebruikers))*

Note: if a user is due both an incomplete-course nudge and an inactivity nudge, the inactivity one is delayed by a day to avoid double-messaging same-day — this level of sequencing detail was only found in the inactive-user article, i.e. single-sourced within the help center itself; treat as **Medium confidence**, worth a live test before relying on it operationally.

### 9. Admin & Moderation

**Roles** — three tiers: regular member (no elevated rights, no badge); **Moderator** (delete/close community posts, create events, view all products — but no admin-panel access); **Administrator** (everything a moderator can do, plus full admin-panel access). *(Source: [Administrators en moderators rollen](https://help.thehuddle.nl/nl/articles/9419984-administrators-en-moderators-rollen))*

**Badges**: default badges auto-display next to admin/mod names; custom badge images uploadable per role (recommended 16×16px) at Settings > Badges. *(Source: [Badges voor admins & moderators](https://help.thehuddle.nl/nl/articles/13348904-badges-voor-admins-moderators))*

**User list management**: filter by access level with AND/OR combination logic; bulk-select to assign/remove access levels, delete, ban, or export-to-CSV-via-email. **Bulk actions are irreversible** — the docs explicitly warn to verify before executing. *(Source: [Filteren in je gebruikerslijst](https://help.thehuddle.nl/nl/articles/9565388-filteren-in-je-gebruikerslijst), [Bulkacties toepassen op gebruikers](https://help.thehuddle.nl/nl/articles/9669896-bulkacties-toepassen-op-gebruikers))*

### 10. Design & Branding

Design > General: primary brand color, menu background color, main logo (350×90px), app logo (60×60px), favicon (128×128px), Apple touch icon (180×180px). A separate login-page design article exists ([Het design bepalen van jouw loginpagina](https://help.thehuddle.nl/nl/articles/8602154-het-design-bepalen-van-jouw-loginpagina), not deep-dived). *(Source: [Het design bepalen van jouw Huddle](https://help.thehuddle.nl/nl/articles/8602216-het-design-bepalen-van-jouw-huddle))*

### 11. Settings Grab-Bag (member-experience-relevant)

- **Homepage**: Settings > Homepage — choose "Dashboard" (activity/events/recent-products feed, with an option to redirect access-less users straight to Products) or "E-learning" (products-first view, in-progress items surfaced first). Setting is instance-wide, not per-member. *(Source: [Bepalen wat er op de homepage staat](https://help.thehuddle.nl/nl/articles/9522601-bepalen-wat-er-op-de-homepage-staat))*
- **Menu items**: Settings > Menu — rename any default nav item (Home, Events, etc.); add exactly one custom item (name + URL) — e.g. link out to a marketing/sales page. *(Source: [Menu-items beheren](https://help.thehuddle.nl/nl/articles/11875227-menu-items-beheren))*
- **Custom terminology**: Settings > Translations — relabel terms across E-learning, Events, Groups (e.g. "Pages" → "Baking Lessons"). This is how Sander could rebrand generic Huddle nouns into Dart-Buddies-specific language. *(Source: [Eigen termen gebruiken](https://help.thehuddle.nl/nl/articles/9440119-eigen-termen-gebruiken))*
- **Optional Features** (Settings > Optionele functies): five independently toggleable feature groups — E-learning, Community, Gamification, Events, Groups — each bundling several sub-capabilities (e.g. Groups toggle is separate from core Community, so you can keep Community on and Groups off). *(Source: [Optionele functies](https://help.thehuddle.nl/nl/articles/9440053-optionele-functies))*
- **Privacy**: search-engine indexing opt-in (public Huddles only), participant-visibility-on-products toggle, and a member-facing privacy statement (Account > Privacy). *(Source: [Privacy instellingen](https://help.thehuddle.nl/nl/articles/9669954-privacy-instellingen))*
- **Cookie notice**: Settings > Cookies — "simple" vs "blocking" popup style, custom title/copy, plus a separate cookie-policy-statement page; only mandatory if analytical/marketing cookies are in use (functional-only cookies don't require it). *(Source: [Cookiemelding instellen](https://help.thehuddle.nl/nl/articles/9795818-cookiemelding-instellen))*

### 12. Huddle App (mobile)

Free iOS/Android app, full feature parity claimed for community browsing/posting, DMs, course consumption (fullscreen/PiP video, speed control, progress tracking, screen-lock audio playback for meditation/yoga-style use, Chromecast/AirPlay casting), events calendar, in-app notification bell, profile/account management. **Explicitly mobile/tablet-only — no desktop/web equivalent of the app itself** (web access is via browser, separately). Language toggle (Dutch/English only) via flag icon on login screen or Account settings — **UI chrome only, member-generated content is never auto-translated**, and web vs. app language prefs are set independently (device-language-driven on mobile). Credential changes (email/password) live under profile > hamburger menu > Login; password changes apply across all Huddles tied to that email, both app and browser. *(Source: [De Huddle app gebruiken](https://help.thehuddle.nl/nl/articles/8596961-de-huddle-app-gebruiken), [Taal aanpassen in de Huddle app](https://help.thehuddle.nl/nl/articles/9521930-taal-aanpassen-in-de-huddle-app), [Hoe kan ik mijn inloggegevens wijzigen in de Huddle app?](https://help.thehuddle.nl/nl/articles/9749219-hoe-kan-ik-mijn-inloggegevens-wijzigen-in-de-huddle-app))*

**White-label app** ("branded app" with Sander's own name/icon instead of the generic Huddle app) is mentioned once, in passing, as a limited/upcoming offer ("Limited spots available this year") — **this is a single-source, unverified, possibly-stale claim.** Do not represent this as a currently-available, generally-purchasable feature without confirming directly with Huddle. Flagged in §14.

### 13. Integrations, Including Plug&Pay (Sander's Stack)

**Connecting Plug&Pay to Huddle**: Plug&Pay account > Plugins > Huddle block > Koppelen → enter Huddle domain → "Inloggen bij Huddle" (OAuth-style login) → "Verbinden" to finalize. *(Source: [Plug&Pay koppelen met Huddle](https://help.thehuddle.nl/nl/articles/3080953-plug-pay-koppelen-met-huddle))*

**Granting access on purchase**: configured per-Plug&Pay-product under its **Koppelingen** tab. For one-time purchases, trigger = "Factuur aangemaakt" (invoice created) or "Bestelling betaald" (order paid); action = "Huddle" → assign access level(s) or just create the user. Available access levels mirror Huddle's own tier: full access-level assignment on Premium/Ultimate Huddle plans; **Lite Huddle plans can only add a user, not assign access levels** (consistent with §4 — Lite has no access-level system at all). Form submissions work the same way with a "Formulier verzonden" trigger, useful for free lead-magnet access. *(Source: [Toegang geven tot Huddle met Plug&Pay](https://help.thehuddle.nl/nl/articles/13486750-toegang-geven-tot-huddle-met-plug-pay))*

**Revoking access on cancellation**: same Koppelingen tab, two triggers — "Abonnement geannuleerd" (cancelled-but-still-active-until-renewal) or "Abonnement beëindigd" (subscription actually ended/inactive) → action = Huddle → remove specified access level(s). Full account deletion is a separate manual step, not automated by this flow. *(Source: [Toegang verwijderen in Huddle met Plug&Pay](https://help.thehuddle.nl/nl/articles/13486765-toegang-verwijderen-in-huddle-met-plug-pay))*

**In-Huddle checkout** (Premium/Ultimate): a product's Access tab gets a "Sales" button linking to an existing or newly-created Plug&Pay product/checkout; a member without access sees a buy button in-place, checks out, and returns to Huddle with access already granted. Optional separate sales-page URL under the product's Data tab for pre-purchase context. *(Source: [Direct afrekenen binnen Huddle met Plug&Pay](https://help.thehuddle.nl/nl/articles/10155285-direct-afrekenen-binnen-huddle-met-plug-pay))*

**Self-service subscription management**: members reach the Plug&Pay Customer Portal via profile > Account > Purchases — view/manage subscriptions, invoices, billing cycle, payment method, cancellations. Requires the Customer Portal to be active on the Plug&Pay side and the integration to be live; **exclusive to Plug&Pay Premium/Ultimate plans** (a Plug&Pay-side gate, separate from Huddle's own tiers — don't conflate the two). Admins can get an email alert on member-initiated cancellations. *(Source: [Huddle leden hun abonnement laten beheren via het Klantenportaal](https://help.thehuddle.nl/nl/articles/9562194-huddle-leden-hun-abonnement-laten-beheren-via-het-klantenportaal))*

**Other integrations** (present, lighter-touch coverage):
- **Vimeo** — direct video upload from within Huddle synced back to a Vimeo account (Starter tier+); optional bulk-sync of existing Vimeo library; AI transcript/summary generation on synced video. *(Source: [Huddle koppelen met Vimeo](https://help.thehuddle.nl/nl/articles/8592314-huddle-koppelen-met-vimeo))*
- **ActiveCampaign/MailBlue** — access-level changes auto-subscribe/unsubscribe members from specific mailing lists via API key connection; triggers downstream automated emails in MailBlue. *(Source: [Huddle koppelen aan ActiveCampaign/MailBlue](https://help.thehuddle.nl/nl/articles/15888323-huddle-koppelen-aan-activecampaign-mailblue))*
- **Zapier** — free-tier integration (100 executions/month on Zapier's free plan); triggers = "New Member," "New Event Member"; action = "Create User" with access-level assignment. Two more specific recipe articles exist (zap-on-new-user, zap-on-event-signup) not deep-dived.
- **Global Automations** — an internal if-this-then-that rule builder (trigger: access-level change/completion/quiz-result/certificate/event-registration/account-creation/login; action: grant/revoke access level, send a DM, sync to ActiveCampaign, or fire a webhook). **Explicitly stated to be in closed beta** — not confirmed generally available. Treat any Sander workflow depending on this as speculative until GA is confirmed. *(Source: [Globale automatiseringen toevoegen](https://help.thehuddle.nl/nl/articles/15729143-globale-automatiseringen-toevoegen))*
- **Webhooks** (outbound action calls) — article exists, not deep-dived.
- **Google Analytics + Custom JavaScript** — settings-level hooks exist under Settings > Integraties; not deep-dived (lower priority per the brief).

### 14. Subscription Tiers (Lite / Premium / Ultimate) — Cross-Verified

The help center itself has **no single canonical tier-comparison article** — the one settings article that mentions tiers ([Jouw abonnement op Huddle](https://help.thehuddle.nl/nl/articles/9675368-jouw-abonnement-op-huddle)) covers only billing management (upgrade/downgrade/cancel), not feature scope. Feature-tier gating had to be reconstructed by cross-referencing ~10 separate help articles that each mention "requires Premium/Ultimate" in passing, plus the official pricing page and one independent review-aggregator search, per Athena's dual-source escalation rule for money-relevant claims. **Confidence: High** — official pricing page and a third-party review site independently agree on the shape of the tier matrix; the two sources diverge only on the exact monthly € price points, flagged below.

| Feature | Lite | Premium | Ultimate |
|---|---|---|---|
| Community channels | 3 | 6 | Unlimited |
| E-learning courses (products) | 1 | 5 | Unlimited |
| Admin logins | 1 | 3 | Unlimited |
| Max members | 100 | 500 | Unlimited |
| Access levels | none | 5 | Unlimited |
| Events module | — | ✓ | ✓ |
| Content dripping | — | ✓ | ✓ |
| Certificates | — | ✓ | ✓ |
| Weekly/monthly digest | — | ✓ | ✓ |
| AI course generator | — | ✓ | ✓ |
| Huddle Coach (AI tutor) | — | ✓ | ✓ |
| Custom domain | — | ✓ | ✓ |
| Premium support | — | ✓ | ✓ |
| Quiz/testing module | — | — | ✓ |
| Community Groups | — | — | ✓ |
| Banner ads slot | — | — | ✓ |

*(Sources: [thehuddle.nl/tarieven](https://www.thehuddle.nl/tarieven/) — official pricing page, fetched 2026-07-14; corroborated by third-party review aggregation via web search, same date, independently agreeing on relative tier shape.)*

**Pricing discrepancy — flagged, not resolved**: the official pricing page (`thehuddle.nl/tarieven`) shows Lite/Premium/Ultimate at €15 / €59 / €125 per month; an independent review-site search summary quoted €15 / €49 / €97 per month "with annual billing" (~20% annual discount). These are plausibly the same numbers viewed monthly-vs-annual-equivalent, but this wasn't confirmed by toggling the actual pricing page's billing switch. **Do not quote a specific Premium/Ultimate price to Sander or in a member-facing document without re-verifying live on `thehuddle.nl/tarieven` at time of use** — pricing pages change and this brief is not the source of truth for current pricing.

### 15. Troubleshooting Collection (member-facing self-service)

5 articles exist covering: user login failure (deep-dived, §3), admin login failure, changing your Huddle profile, changing your username, changing your Huddle password. Only the user-login article was deep-dived; the other four are straightforward account-settings walkthroughs, lower priority for this brief, readable on demand.

### 16. Gaps, Unknowns, and Things NOT to Assume

Explicitly surfacing per the brief's request — do not treat these as "probably works like X":

1. **No canonical tier-feature-comparison page inside the help center itself.** Reconstructed from scattered mentions + the external pricing page (§13). If Huddle changes tier boundaries, the help articles won't necessarily get updated in sync — re-verify before committing to a member-facing claim.
2. **White-label/branded mobile app** is mentioned exactly once, in passing, with vague "limited spots this year" language, no dedicated article, no pricing, no application process documented. Treat as unverified until confirmed directly with Huddle support.
3. **Global Automations is in closed beta** per Huddle's own docs — don't build a Dart Buddies workflow (e.g. auto-DM on course completion) assuming this is live/GA without checking current beta status first.
4. **The Huddle Coach's exact tier gate isn't stated in its own article** — inferred from the pricing table only (Premium/Ultimate). Minor inconsistency between the feature article and the pricing page; not contradictory, just incomplete on the feature-article side.
5. **~50 of ~106 published articles were not deep-dived** in this pass (full list of untouched titles is in each section above, e.g. iFrame embedding, custom JS, Google Analytics, most Zapier recipe articles, 4 of 5 troubleshooting articles, several e-learning "extra functies" articles). These exist and can be pulled on demand — this brief prioritized onboarding/community/courses/events/admin/notifications/Plug&Pay per Hermes's brief, not full 100% coverage.
6. **No developer/API documentation was found** in the help center beyond the consumer-facing webhook and Zapier articles — if Sander ever wants deeper custom automation, this may require a direct support conversation with Huddle, not a docs lookup.
7. **No article addresses GDPR/data-export specifics** beyond a two-sentence "Privacy Statement" mention — insufficient to answer any compliance question with confidence.

---

## Part 2 — SOP-001 Hire-Research Answers: "Huddle-specialist"

### What would the best-in-world version of this role actually do, day to day?

The best version of this role behaves like an internal platform SME embedded at a SaaS-heavy agency — not a generalist community manager, but someone whose entire job is "does the platform actually do X, and how exactly." Day to day: fields quick lookup questions from other specialists ("can Huddle gate a single lesson without gating the whole module?" → yes, see §4/§5 above, with the exact tab name); maintains a living internal map of Huddle's feature surface as it evolves (help centers change silently — re-checking key articles periodically is part of the job, not a one-time task); drafts onboarding-flow specs and admin-setup checklists that are literally traceable back to specific settings screens and tab names, not vibes; and flags the moment a request implies a Huddle capability that isn't actually documented, rather than guessing plausibly. The world-class version treats "I checked the docs and this isn't documented" as a valid and valuable answer, not a failure.

### Core competencies

1. **Docs-first, not memory-first.** Every factual claim about a Huddle feature traces to a specific help-center article and, ideally, an exact UI path (tab name, settings location) — not "I believe Huddle can do this."
2. **Tier-awareness.** Nearly every advanced Huddle feature (access levels, dripping, quizzes, digest, groups, certificates) is gated by Lite/Premium/Ultimate. A competent answer to "can Huddle do X" always includes "on which plan," because Dart Buddies' actual plan determines what's real for Sander, not what the docs describe as theoretically possible.
3. **Distinguishing GA from beta/unclear.** Correctly flags features like Global Automations (closed beta) or the white-label app (vaguely documented, unclear availability) as not-yet-reliable, rather than presenting them at the same confidence level as core, stable features.
4. **Structural fluency in Huddle's content model.** Fluent in the Product → Module → Page hierarchy, the access-level gating logic (course-level is "leading," can't be widened by module-level), and the distinction between admin-created Channels and member-created Groups — these are the recurring traps where a shallow answer gets the mechanics backwards.
5. **Plug&Pay-Huddle boundary awareness.** Knows precisely which side of the Plug&Pay/Huddle integration governs which behavior (e.g., the Customer Portal's Premium/Ultimate gate is a *Plug&Pay* plan gate, separate from Huddle's own Premium/Ultimate gate) — conflating the two stacks is a classic error this role must never make.

### Anti-patterns to explicitly avoid

- **Confident guessing.** The single worst failure mode: answering "yes, Huddle can do that" from general SaaS-platform intuition rather than a verified doc lookup. This is exactly the anti-pattern the hiring brief called out, and it's the number one thing that would make this role worse than useless — worse than no specialist at all, because it produces false confidence downstream in onboarding videos or flow designs.
- **Treating the help center as static.** Vendor docs change. A stale answer confidently delivered as current is a subtler version of the same failure.
- **Feature-tourism without tier-checking.** Describing a capability (e.g., "you can gate individual lessons") without immediately noting it requires Premium/Ultimate — this leads to Sander or another specialist designing a flow around a feature Dart Buddies' actual plan may not include.
- **Scope creep into business/product decisions.** This role supplies facts, not recommendations about which tier to buy, which features to enable, or how the community should be structured. That's Sander's or another specialist's call.
- **Writing final-facing content.** This role is not a copywriter or video scriptwriter — it supplies verified platform facts *to* whoever is doing that work (Hermes routing to a future content/video specialist, or Sander directly), it doesn't produce the finished onboarding video script itself.

### Deliverables this role should produce

- **Feature capability lookups** — fast, cited, tier-aware answers to "can Huddle do X" for other specialists or Sander, format: capability → yes/no/partial → exact UI path → tier gate → source article link.
- **Onboarding-flow specs** — step-by-step, docs-grounded descriptions of what a new Dart Buddies member actually experiences and what admin-side levers exist at each step (welcome email, self-registration vs. invite-link vs. Plug&Pay-triggered creation, first-login state) — for someone else (a video/content specialist) to turn into a script or visual flow.
- **Admin/moderation setup checklists** — e.g., "here's every access-level, notification, and moderation setting relevant to launching a new course tier" — grounded in exact settings paths.
- **Gap flags** — proactively surfacing when Sander's ask depends on an undocumented, beta, or unclear capability (per §16 above), before anyone builds around it.
- **World-class vs. adequate**: adequate output answers the literal question asked. World-class output answers the question *and* flags the adjacent tier-gate or gotcha nobody asked about but that will bite Sander in three weeks (e.g., "yes you can gate that lesson — but note the course-level access level is always leading, so a member without the course access level won't see it regardless of the lesson-level setting").

### Boundaries this role should hold

- Does not make product or business decisions (which tier to buy, whether to enable Groups, how to structure channels) — surfaces facts and tradeoffs, hands the decision back to Sander.
- Does not write final onboarding video scripts, marketing copy, or member-facing content — that's a content/video specialist's job; this role supplies the verified raw material.
- Does not guess at undocumented behavior and present it as fact — explicitly says "not documented, needs direct confirmation with Huddle support" when the help center is silent.
- Does not treat third-party review sites or forum posts as equivalent-confidence sources to Huddle's own docs for platform-mechanics questions — external sources are fine for pricing/market-positioning cross-checks (as done in §13) but not for "how does this feature actually work."

### Name candidates

- **Compass** — no collision; evokes "the thing that tells you where things actually are in the platform," fits a role whose entire value is orientation-through-documentation.
- **Ledger** — no collision; evokes systematic, verified record-keeping — fits the "docs-grounded, cite-your-source" operating principle.
- **Sherpa** — no collision; evokes a guide who knows the terrain cold and gets others through it safely — fits the "answers questions for other specialists" day-to-day function.
