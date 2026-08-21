// FileView.tsx — the routed "Large" reading page for a raw file.
//
// Replaces the old FileFullscreenOverlay: instead of a fullscreen portal this
// renders IN the routed content column, exactly like opening a journal entry —
// normal cockpit chrome, sidebar visible, browser back works, deep-linkable.
//
// Route: #/file/<encodeURIComponent(src)> -> { name: 'file'; src }.
// The src codec (plain path -> /api/cockpit/file, 'inbox:' prefix ->
// /api/cockpit/inbox-file) lives in lib/router.ts — see "File-route src
// encoding" there. md/txt are fetched as text and rendered through the
// sanitized WikiMarkdown (.note-prose) in a centered reading column; pdf /
// images embed full-width below the header on the same jailed URL. A small
// "Raw" link keeps the native-URL escape hatch. A missing file gets a calm
// not-found state, never a broken embed.
//
// "Visualiseer" sits next to Raw/Discuss and appears when
// components/diagram/sopDiagrams.ts can turn THIS document into diagram data.
// It toggles a React Flow panel above the prose — full width, not inside the
// 68ch reading column — and the prose stays put underneath, because the diagram
// is a view of the document, not a replacement for it.
//
// Since fase 2 (tsk-2026-08-21-001) that is every SOP and every Workstream, via
// the generic parser; three pilot SOPs keep their richer fase-1 converters as
// overrides. Guidelines deliberately still get nothing — see the note on
// documentKind() in sopDiagrams.ts.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Workflow } from 'lucide-react';
import { parseFileSrc, type Route } from '../lib/router';
import { WikiMarkdown } from '../components/WikiMarkdown';
import { DiscussButton } from '../components/DiscussButton';
import { fileIconFor, previewKindFor } from '../components/FolderTree';
import { SopDiagram } from '../components/diagram/SopDiagram';
import { buildDiagramSpec, hasDiagramConverter } from '../components/diagram/sopDiagrams';
import '../components/foldertree.css';

// One panel per page, so a constant id is enough for the toggle's aria-controls.
const DIAGRAM_PANEL_ID = 'file-view-diagram';

function extOf(name: string): string {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(i + 1).toLowerCase() : '';
}

// Map a file-route src/path to the REPO-relative path the discuss endpoint
// expects. The /api/cockpit/file jail convention: 'inbox:' paths ("Team Inbox/…"),
// Deliverables/ paths, and Team Knowledge/ paths are already repo-relative;
// everything else is PKM/-relative (see server.js "Three jails with DIFFERENT base
// conventions").
function repoRelativeFor(src: string, path: string): string {
  if (src.startsWith('inbox:')) return path;
  const norm = path.replace(/\\/g, '/');
  if (norm === 'Deliverables' || norm.startsWith('Deliverables/')) return path;
  if (norm === 'Team Knowledge' || norm.startsWith('Team Knowledge/')) return path;
  return `PKM/${path}`;
}

export function FileView({ route }: { route: Extract<Route, { name: 'file' }> }) {
  const { path, fileUrl } = parseFileSrc(route.src);
  const name = path.split('/').pop() || path;
  const ext = extOf(name);
  const kind = previewKindFor(name);
  const FileIcon = fileIconFor(name);
  const topRef = useRef<HTMLElement | null>(null);

  // md/txt: fetched as text. A 404 flips the calm not-found state below.
  const [text, setText] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const [embedFailed, setEmbedFailed] = useState(false);
  // "Visualiseer" is a toggle, not a route: the prose stays on the page and the
  // diagram opens above it. Closed by default — the reading page is a reading
  // page first, and the heavy React Flow chunk only loads once it is opened.
  const [showDiagram, setShowDiagram] = useState(false);

  useEffect(() => {
    setText(null);
    setNotFound(false);
    setTextError(null);
    setEmbedFailed(false);
    if (kind !== 'text') return;
    let alive = true;
    fetch(fileUrl, { credentials: 'same-origin' })
      .then((r) => {
        if (r.status === 404) {
          if (alive) setNotFound(true);
          return null;
        }
        if (!r.ok) throw new Error(`Server responded ${r.status}`);
        return r.text();
      })
      .then((body) => { if (alive && body !== null) setText(body); })
      .catch((err: unknown) => { if (alive) setTextError((err as Error).message); });
    return () => { alive = false; };
  }, [fileUrl, kind]);

  // Scroll to the top whenever we navigate to a new file.
  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
  }, [route.src]);

  // Navigating to another file must never leave a stale diagram open.
  useEffect(() => { setShowDiagram(false); }, [route.src]);

  // Markdown → diagram data. `null` means either "this file is not a procedure
  // document" or "nothing could read it" — both hide the button entirely, so a
  // missing diagram is the failure mode, never a wrong one.
  //
  // Synchronous on purpose. The whole conversion layer is 20.7 kB minified /
  // 7.9 kB gzip of pure string work over a document that is already in memory;
  // deferring it behind an import() would buy ~4 kB on a bundle served over
  // loopback and cost a loading state, a navigation race, and a button that
  // appears a frame late.
  const diagramSpec = useMemo(
    () => (ext === 'md' && text && hasDiagramConverter(path) ? buildDiagramSpec(path, text) : null),
    [ext, text, path],
  );

  const missing = notFound || embedFailed;

  return (
    <article ref={topRef} className="note-view file-view animate-fade-rise">
      <button type="button" className="back-button" onClick={() => window.history.back()}>
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> Back
      </button>

      <header className="file-view-head">
        {/* Glyph + title are ONE flex child, not two. The header wraps (see
            .file-view-head in foldertree.css), and as separate children the
            18px glyph and the title get line-broken apart — the icon strands on
            a row of its own above the filename. Grouping them is the same move
            .dg-heading makes for the diagram's title + notation badge. */}
        <span className="file-view-heading">
          <span className="file-view-glyph" aria-hidden="true">
            <FileIcon size={18} strokeWidth={1.5} />
          </span>
          <h1 className="file-view-title">{name}</h1>
        </span>
        {!missing && kind !== 'none' && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="file-view-raw"
            title="Open the raw file in a new tab"
          >
            Raw
          </a>
        )}
        {!missing && diagramSpec && (
          <button
            type="button"
            className="file-view-visualise"
            // Disclosure, not a toggle button: this shows/hides a controlled
            // region, so the pairing is aria-expanded + aria-controls
            // (aria-pressed would describe the button's own on/off state).
            aria-expanded={showDiagram}
            aria-controls={DIAGRAM_PANEL_ID}
            onClick={() => setShowDiagram((v) => !v)}
            title={showDiagram ? 'Diagram verbergen' : 'Toon dit document als diagram'}
          >
            <Workflow size={13} strokeWidth={1.75} aria-hidden="true" />
            Visualiseer
          </button>
        )}
        {!missing && <DiscussButton file={repoRelativeFor(route.src, path)} subject={name} />}
      </header>
      <p className="file-view-path">{path}</p>

      {!missing && diagramSpec && showDiagram && (
        <SopDiagram spec={diagramSpec} id={DIAGRAM_PANEL_ID} />
      )}

      {missing && (
        <div className="file-view-reading">
          <p className="note-empty">
            This file could not be found. It may have been moved, renamed, or
            removed since this link was made.
          </p>
        </div>
      )}

      {!missing && kind === 'text' && textError && (
        <div className="file-view-reading">
          <p role="alert" className="ft-preview-note">Could not load the file: {textError}</p>
        </div>
      )}
      {!missing && kind === 'text' && text === null && !textError && (
        <div className="file-view-reading" aria-busy="true">
          <div className="skeleton-block" />
        </div>
      )}
      {!missing && kind === 'text' && text !== null && (
        <div className="file-view-reading">
          {ext === 'md'
            ? <WikiMarkdown body={text} />
            : <pre className="ft-preview-plain">{text}</pre>}
        </div>
      )}

      {!missing && kind === 'image' && (
        <img
          className="file-view-image"
          src={fileUrl}
          alt={name}
          decoding="async"
          onError={() => setEmbedFailed(true)}
        />
      )}
      {!missing && kind === 'pdf' && (
        <iframe
          className="file-view-frame"
          src={fileUrl}
          title={`File: ${name}`}
          onError={() => setEmbedFailed(true)}
        />
      )}

      {!missing && kind === 'none' && (
        <div className="file-view-reading">
          <p className="ft-preview-note">
            No inline view for {ext ? `.${ext}` : 'this file type'}.
          </p>
          <p className="ft-preview-path">{path}</p>
        </div>
      )}
    </article>
  );
}
