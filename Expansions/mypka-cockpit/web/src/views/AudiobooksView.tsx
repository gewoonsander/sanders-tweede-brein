// AudiobooksView.tsx — the Audiobooks module (library section).
//
// Reads from GET /api/cockpit/audiobooks (server/audiobooksApi.js).
// Each audiobook row in mypka.db carries: asin (PK), title, authors,
// cover_url, percent_complete, is_finished, rating, genres, series_title,
// series_sequence, runtime_length_min, narrators, and more.
//
// The view renders a filterable grid of cover cards. Each card shows:
//   - Cover image (cover_url), fallback icon when absent
//   - Title + authors
//   - Series info when present
//   - Progress bar (percent_complete) or "Finished" badge (is_finished)
//   - Star rating (rating)
//
// Filters: free-text search (title/authors/series) + status facet
// (all / finished / in-progress / unstarted).
//
// Route: #/audiobooks (simple module slug, no item deep-link for now).
import { useMemo, useRef, useEffect, useState } from 'react';
import { Headphones, Search, Star } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { PageHeader } from '../components/PageHeader';
import type { AudiobooksListResponse, Audiobook } from '../lib/cockpitTypes';
import './audiobooks.css';

// Format minutes → "Xh Ym"
function formatRuntime(min: number | null): string | null {
  if (min == null || min <= 0) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Cover image with a fallback icon ─────────────────────────────────────────
function CoverImage({ src, title }: { src: string | null; title: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="ab-cover ab-cover--fallback" aria-hidden="true">
        <Headphones size={32} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      className="ab-cover"
      src={src}
      alt={title ? `Cover of ${title}` : 'Audiobook cover'}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number | null }) {
  const value = Math.min(100, Math.max(0, pct ?? 0));
  return (
    <div className="ab-progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${value}% afgeluisterd`}>
      <div className="ab-progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

// ── Star rating — shows up to 5 half-filled or full stars ────────────────────
function StarRating({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  const display = rating.toFixed(1);
  return (
    <span className="ab-rating" aria-label={`${display} van 5 sterren`}>
      <Star size={12} strokeWidth={1.5} aria-hidden="true" className="ab-rating-star" />
      {display}
    </span>
  );
}

// ── One audiobook card ────────────────────────────────────────────────────────
function AudiobookCard({ book }: { book: Audiobook }) {
  const runtime = formatRuntime(book.runtime_length_min);

  return (
    <li className="ab-card-li">
      <article className="ab-card">
        <div className="ab-card-cover-wrap">
          <CoverImage src={book.cover_url} title={book.title} />
          {book.is_finished && (
            <span className="ab-finished-badge" aria-label="Afgeluisterd">✓</span>
          )}
        </div>
        <div className="ab-card-body">
          <p className="ab-card-title">{book.title ?? '—'}</p>
          {book.authors && <p className="ab-card-authors">{book.authors}</p>}
          {book.series_title && (
            <p className="ab-card-series">
              {book.series_title}
              {book.series_sequence ? ` #${book.series_sequence}` : ''}
            </p>
          )}
          <div className="ab-card-meta">
            {runtime && <span className="ab-meta-chip">{runtime}</span>}
            <StarRating rating={book.rating} />
          </div>
          {!book.is_finished && (
            <div className="ab-progress-wrap">
              <ProgressBar pct={book.percent_complete} />
              <span className="ab-progress-label">
                {book.percent_complete != null && book.percent_complete > 0
                  ? `${Math.round(book.percent_complete)}%`
                  : 'Niet gestart'}
              </span>
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────
export function AudiobooksView() {
  const { data, loading, error } = useFetch<AudiobooksListResponse>('/api/cockpit/audiobooks');
  const topRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { topRef.current?.scrollIntoView({ block: 'start' }); }, []);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'' | 'finished' | 'in-progress' | 'unstarted'>('');

  const books = useMemo(() => data?.audiobooks ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      // Status facet
      if (status === 'finished' && !b.is_finished) return false;
      if (status === 'in-progress' && (b.is_finished || (b.percent_complete ?? 0) === 0)) return false;
      if (status === 'unstarted' && (b.is_finished || (b.percent_complete ?? 0) > 0)) return false;
      // Text search
      if (q) {
        const hay = [b.title, b.authors, b.series_title, b.subtitle]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [books, query, status]);

  const counts = useMemo(() => {
    const finished = books.filter((b) => b.is_finished).length;
    const inProgress = books.filter((b) => !b.is_finished && (b.percent_complete ?? 0) > 0).length;
    return { finished, inProgress, total: books.length };
  }, [books]);

  if (loading) {
    return (
      <div className="ab-view" aria-busy="true">
        <div className="list-skeleton"><div className="skeleton-block" /></div>
      </div>
    );
  }
  if (error) {
    return <div role="alert" className="view-error">Audiobooks konden niet worden geladen: {error}</div>;
  }
  if (!data?.available) {
    return (
      <section className="ab-view">
        <PageHeader title="Audiobooks" icon={Headphones} />
        <div className="library-empty">
          <span className="library-empty-mark" aria-hidden="true">
            <Headphones size={28} strokeWidth={1.5} />
          </span>
          <p className="library-empty-title">Nog geen audiobooks</p>
          <p className="library-empty-sub">
            Zodra de audiobooks-tabel in mypka.db is gevuld verschijnen ze hier.
          </p>
        </div>
      </section>
    );
  }

  const subtitleParts: string[] = [];
  if (counts.total > 0) subtitleParts.push(`${counts.total} boeken`);
  if (counts.finished > 0) subtitleParts.push(`${counts.finished} afgeluisterd`);
  if (counts.inProgress > 0) subtitleParts.push(`${counts.inProgress} bezig`);

  return (
    <section ref={topRef} className="ab-view animate-fade-rise">
      <PageHeader
        title="Audiobooks"
        icon={Headphones}
        subtitle={subtitleParts.join(' · ')}
      />

      {books.length === 0 ? (
        <div className="library-empty">
          <span className="library-empty-mark" aria-hidden="true">
            <Headphones size={28} strokeWidth={1.5} />
          </span>
          <p className="library-empty-title">Geen audiobooks gevonden</p>
          <p className="library-empty-sub">Voeg audiobooks toe aan de collectie om ze hier te zien.</p>
        </div>
      ) : (
        <>
          <div className="filter-bar" role="search">
            <label className="filter-search">
              <Search size={16} strokeWidth={1.5} aria-hidden="true" className="filter-search-icon" />
              <input
                type="search"
                className="filter-search-input"
                placeholder="Zoek op titel, auteur of serie…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Zoek audiobooks"
              />
            </label>
            <label className="filter-facet">
              <span className="filter-facet-label">Status</span>
              <select
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                aria-label="Filter op status"
              >
                <option value="">Alle</option>
                <option value="finished">Afgeluisterd</option>
                <option value="in-progress">Bezig</option>
                <option value="unstarted">Niet gestart</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="library-noresults">Geen audiobooks komen overeen met deze filters.</div>
          ) : (
            <ul className="ab-grid">
              {filtered.map((b) => (
                <AudiobookCard key={b.asin} book={b} />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
