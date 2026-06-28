// audiobooksApi.js — read-only server queries for the Audiobooks module.
//
// The `audiobooks` table uses `asin` as PK (not the library-foundation `slug`).
// It does NOT participate in library_registry / the generic library viewer; it
// gets its own dedicated endpoint family so the frontend can render rich
// audiobook-specific fields: cover_url, percent_complete, is_finished, rating.
//
// READ-ONLY: every statement is a SELECT against the read-only db (db.js opens
// it readonly + query_only). Degrades gracefully when the `audiobooks` table is
// absent — all endpoints return { available: false } and the frontend shows a
// calm empty state, never a 500.
//
// Mounted by server.js via registerAudiobooksRoutes(app, { safe }).
import db from './db.js';

function audiobooksTableExists() {
  try {
    const row = db
      .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'audiobooks'`)
      .get();
    return !!row;
  } catch {
    return false;
  }
}

// Parse a comma-or-pipe-delimited genre string into a de-duplicated, sorted
// list of unique genre tokens. Audible genres arrive as "Genre A, Genre B,
// Genre A, …" (often many repeats from sub-category nesting).
function parseGenres(raw) {
  if (!raw) return [];
  // Split on comma, trim, de-duplicate, sort.
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const unique = Array.from(new Set(parts));
  return unique.sort();
}

// Shape one DB row for the client: parse genres; coerce numeric fields that
// SQLite may return as TEXT due to column affinity.
function shapeRow(row) {
  return {
    asin: row.asin ?? null,
    title: row.title ?? null,
    subtitle: row.subtitle ?? null,
    authors: row.authors ?? null,
    narrators: row.narrators ?? null,
    series_title: row.series_title ?? null,
    series_sequence: row.series_sequence ?? null,
    genres: parseGenres(row.genres),
    runtime_length_min: row.runtime_length_min != null ? Number(row.runtime_length_min) : null,
    is_finished: row.is_finished === 'True' || row.is_finished === true || row.is_finished === 1,
    percent_complete: row.percent_complete != null ? Number(row.percent_complete) : null,
    rating: row.rating != null ? Number(row.rating) : null,
    num_ratings: row.num_ratings != null ? Number(row.num_ratings) : null,
    date_added: row.date_added ?? null,
    release_date: row.release_date ?? null,
    cover_url: row.cover_url ?? null,
    purchase_date: row.purchase_date ?? null,
  };
}

// ── (a) List all audiobooks (the card grid) ──────────────────────────────────
// Optional query params: ?q=<text>&genre=<genre>&status=finished|in-progress|unstarted
export function listAudiobooks({ q, genre, status } = {}) {
  if (!audiobooksTableExists()) return { available: false, audiobooks: [] };

  let rows = db
    .prepare(
      `SELECT asin, title, subtitle, authors, narrators, series_title, series_sequence,
              genres, runtime_length_min, is_finished, percent_complete, rating, num_ratings,
              date_added, release_date, cover_url, purchase_date
       FROM audiobooks
       ORDER BY is_finished ASC, percent_complete DESC, date_added DESC, title COLLATE NOCASE ASC`,
    )
    .all()
    .map(shapeRow);

  // Text search (title, authors, series)
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((r) => {
      const hay = [r.title, r.authors, r.series_title, r.subtitle]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }

  // Genre facet (partial match against the parsed genres array)
  if (genre && genre.trim()) {
    const g = genre.trim().toLowerCase();
    rows = rows.filter((r) => r.genres.some((gen) => gen.toLowerCase() === g));
  }

  // Status facet: finished | in-progress | unstarted
  if (status && status.trim()) {
    if (status === 'finished') {
      rows = rows.filter((r) => r.is_finished);
    } else if (status === 'in-progress') {
      rows = rows.filter((r) => !r.is_finished && r.percent_complete != null && r.percent_complete > 0);
    } else if (status === 'unstarted') {
      rows = rows.filter((r) => !r.is_finished && (r.percent_complete == null || r.percent_complete === 0));
    }
  }

  return { available: true, total: rows.length, audiobooks: rows };
}

// ── (b) One audiobook by ASIN ─────────────────────────────────────────────────
export function getAudiobook(asin) {
  if (!audiobooksTableExists()) return { available: false, found: false };
  const row = db
    .prepare(`SELECT * FROM audiobooks WHERE asin = ? LIMIT 1`)
    .get(asin);
  if (!row) return { available: true, found: false };
  return { available: true, found: true, audiobook: shapeRow(row) };
}

// ── Route registration ────────────────────────────────────────────────────────
export function registerAudiobooksRoutes(app, { safe }) {
  // List all audiobooks (supports ?q=, ?genre=, ?status= query params).
  app.get('/api/cockpit/audiobooks', safe((req) =>
    listAudiobooks({
      q: req.query.q,
      genre: req.query.genre,
      status: req.query.status,
    }),
  ));
  // One audiobook by ASIN.
  app.get('/api/cockpit/audiobooks/:asin', safe((req) => getAudiobook(req.params.asin)));
}
