---
agent_id: felix
session_id: 2026-06-28-audiobooks
timestamp: 2026-06-28T12:00:00Z
type: end-of-session
linked_sops: [SOP-003-felix-build-a-component]
linked_workstreams: []
linked_guidelines: [GL-003-design-system]
---

# Audiobooks module — myPKA Cockpit

## What I built

Added a full Audiobooks module to the myPKA Cockpit (`Expansions/mypka-cockpit/`).

### Server (3 changes)

- **`server/audiobooksApi.js`** (new) — read-only Express route handler for the `audiobooks` table. Exposes:
  - `GET /api/cockpit/audiobooks` with optional `?q=`, `?genre=`, `?status=` query params
  - `GET /api/cockpit/audiobooks/:asin` (one book by ASIN)
  - Degrades to `{ available: false }` when the table is absent
  - `shapeRow()` normalises `is_finished` TEXT ("True"/"False") → boolean, parses genres into a de-duplicated array, coerces numeric fields
- **`server/server.js`** — added `import { registerAudiobooksRoutes }` + `registerAudiobooksRoutes(app, { safe })` call, placed directly after `registerLibraryRoutes`

### Frontend (4 changes)

- **`web/src/lib/cockpitTypes.ts`** — added `Audiobook`, `AudiobooksListResponse`, `AudiobookDetailResponse` interfaces
- **`web/src/views/AudiobooksView.tsx`** (new) — filterable cover-grid view:
  - `CoverImage` component: `<img loading="lazy">` with `onError` fallback to Headphones icon; ARIA label on every image
  - `ProgressBar` component: CSS-width progress bar with `role="progressbar"` + `aria-valuenow/min/max`
  - `StarRating` component: filled star icon + numeric display; `aria-label` on the container span
  - `AudiobookCard`: cover, title (2-line clamp), authors, series, runtime chip, rating, progress bar or finished badge
  - Filter bar: free-text search + status select (all / finished / in-progress / unstarted); client-side, no debounce needed at 100 items
  - Subtitle: "102 boeken · N afgeluisterd · M bezig"
- **`web/src/views/audiobooks.css`** (new) — tokens-only styling; `.ab-grid` responsive auto-fill (`minmax(160px, 1fr)`); `.ab-finished-badge` corner overlay; `.ab-progress-fill` transitions width; `@media (max-width: 480px)` forces 2 columns
- **`web/src/lib/moduleRegistry.tsx`** — added `Headphones` icon import, `AudiobooksView` lazy import, entry `{ slug: 'audiobooks', navLabel: 'Audiobooks', navIcon: Headphones, navSection: 'library', View: AudiobooksView }` in the `library` group (after Library, before Outer World)

### Why NOT in library_registry

The `audiobooks` table uses `asin` as PK; it has no `slug`, `body`, `status`, or `tags` columns that the generic LibraryView requires. Registering it in `library_registry` and patching libraryApi.js to handle a non-slug PK would have been more fragile than a dedicated module. The dedicated route is ~120 lines and fully type-safe.

## Build result

`npm run build` in `web/` succeeded in 2.95 s. The pre-existing CSS warning (`-: –;` in cockpit.css) was already present before this session.

## What the next agent should know

- The `audiobooks` table has no `slug` column — any future deep-link (click card → detail) will need to use `asin` as the identifier and extend the router with a new route variant (or a query param on the module slug).
- Genre strings from Audible arrive with many duplicates; `parseGenres()` in `audiobooksApi.js` deduplicates them. If a genre-facet filter is added to the frontend it can use `GET /api/cockpit/audiobooks?genre=<value>` server-side.
- No design-system gaps found; all tokens used are from the existing cockpit.css token set.
