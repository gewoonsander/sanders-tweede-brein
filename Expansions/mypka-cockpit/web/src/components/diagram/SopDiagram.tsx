// SopDiagram.tsx — the eager, lightweight wrapper FileView imports.
//
// Owns the section chrome (heading, one-line summary, glyph legend, fullscreen
// toggle) and the React.lazy boundary that keeps @xyflow/react out of the
// reading page's critical bundle. The heavy canvas loads only once a reader
// actually presses "Visualiseer".
//
// The prose stays on the page underneath this panel. That is the accessibility
// contract as much as an editorial one: the diagram is a second view of the
// document, never the only way to get at it (the knowledge graph makes the same
// promise in MiniGraph.tsx).
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRightLeft,
  CircleCheck,
  CircleDot,
  CircleX,
  GitBranch,
  ListChecks,
  Maximize2,
  Minimize2,
  Split,
  TriangleAlert,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { KIND_LABEL, SHAPE_LABEL, type DiagramNodeKind, type DiagramSpec } from './diagramTypes';
import './diagram.css';

const SopDiagramCanvas = lazy(() => import('./SopDiagramCanvas'));

const LEGEND_ICON: Record<DiagramNodeKind, LucideIcon> = {
  start: CircleDot,
  step: ListChecks,
  decision: GitBranch,
  branch: Split,
  handoff: ArrowRightLeft,
  warning: TriangleAlert,
  error: CircleX,
  end: CircleCheck,
};

/** Legend order = reading order of the procedure, not alphabetical. */
const LEGEND_ORDER: DiagramNodeKind[] = [
  'start',
  'step',
  'decision',
  'branch',
  'handoff',
  'warning',
  'error',
  'end',
];

function Legend({ spec }: { spec: DiagramSpec }) {
  const present = new Set(spec.nodes.map((n) => n.kind));
  const kinds = LEGEND_ORDER.filter((k) => present.has(k));
  return (
    <ul className="dg-legend">
      {kinds.map((kind) => {
        const Icon = LEGEND_ICON[kind];
        return (
          <li key={kind} className="dg-legend-item" data-kind={kind}>
            <Icon size={13} strokeWidth={1.75} aria-hidden="true" />
            {KIND_LABEL[kind]}
          </li>
        );
      })}
      <li className="dg-legend-item dg-legend-item--edge">
        <span className="dg-legend-dash" aria-hidden="true" />
        Uitzonderingspad
      </li>
    </ul>
  );
}

export interface SopDiagramProps {
  spec: DiagramSpec;
  /** Rendered as the panel's id so the toggle can own aria-controls. */
  id: string;
}

export function SopDiagram({ spec, id }: SopDiagramProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // A REF to the open button, not `document.activeElement` at open time. The
  // button is unmounted while the dialog is up, so an activeElement snapshot
  // would point at a detached node by the time we tried to focus it back —
  // focus would silently land on <body>. Verified 2026-08-21 via CDP.
  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const wasFullscreen = useRef(false);

  const closeFullscreen = useCallback(() => {
    const motionOk =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setClosing(true);
    window.setTimeout(() => {
      setFullscreen(false);
      setClosing(false);
    }, motionOk ? 350 : 100);
  }, []);

  // Scroll-lock the page behind the overlay (the app's `body.overlay-open`
  // convention). Without it a wheel event the canvas does not consume scrolls
  // the page underneath the fixed overlay.
  useEffect(() => {
    if (!fullscreen) return;
    document.body.classList.add('overlay-open');
    return () => document.body.classList.remove('overlay-open');
  }, [fullscreen]);

  // Dialog a11y: move focus in, trap Tab, Escape closes, focus returns to the
  // trigger on unmount. Same contract as MiniGraph's fullscreen overlay.
  // Focus returns to the trigger AFTER the dialog has unmounted and the open
  // button is back in the tree — same commit, so the ref is live again.
  useEffect(() => {
    if (wasFullscreen.current && !fullscreen) openBtnRef.current?.focus();
    wasFullscreen.current = fullscreen;
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusables = (): HTMLElement[] =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"]), .react-flow__node',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    (focusables()[0] ?? dialog).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeFullscreen();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [fullscreen, closeFullscreen]);

  const summaryId = `${id}-summary`;

  return (
    <section className="dg-section" id={id} aria-label={`Diagram van ${spec.title}`}>
      <div className="dg-header">
        {/* The notation badge sits OUTSIDE the <h2> on purpose: inside it, the
            badge text is concatenated into the heading's accessible name
            ("Inboxen verwerkenBeslisboom") — which is exactly what a screen
            reader would then announce. */}
        <div className="dg-heading">
          <h2 className="dg-title">
            <Workflow size={15} strokeWidth={1.5} aria-hidden="true" /> {spec.title}
          </h2>
          <span className="dg-shape">{SHAPE_LABEL[spec.shape]}</span>
        </div>
        {!fullscreen && (
          <button
            type="button"
            ref={openBtnRef}
            className="dg-control"
            onClick={() => setFullscreen(true)}
            aria-label="Diagram schermvullend openen"
            title="Schermvullend"
          >
            <Maximize2 size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="dg-summary" id={summaryId}>
        {spec.summary} De volledige tekst staat hieronder — het diagram is een
        weergave daarvan, niet de bron.
      </p>

      <Legend spec={spec} />

      {fullscreen ? (
        <div className="dg-canvas dg-canvas--parked" aria-hidden="true">
          <span className="dg-parked-note">Diagram staat schermvullend open</span>
        </div>
      ) : (
        <div
          className="dg-canvas"
          role="group"
          aria-label={`Stroomschema van ${spec.title}`}
          aria-describedby={summaryId}
        >
          <Suspense fallback={<div className="dg-canvas-fallback" aria-busy="true" />}>
            <SopDiagramCanvas spec={spec} />
          </Suspense>
        </div>
      )}

      {fullscreen &&
        createPortal(
          <div
            ref={dialogRef}
            className="dg-fullscreen"
            data-closing={closing ? 'true' : undefined}
            role="dialog"
            aria-modal="true"
            aria-label={`Diagram van ${spec.title}, schermvullend`}
          >
            <div className="dg-fullscreen-bar">
              <div className="dg-heading">
                <h2 className="dg-title">
                  <Workflow size={15} strokeWidth={1.5} aria-hidden="true" /> {spec.title}
                </h2>
                <span className="dg-shape">{SHAPE_LABEL[spec.shape]}</span>
              </div>
              <button
                type="button"
                className="dg-control"
                onClick={closeFullscreen}
                aria-label="Schermvullend diagram sluiten"
                title="Sluiten"
              >
                <Minimize2 size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <div className="dg-fullscreen-canvas">
              <Suspense fallback={<div className="dg-canvas-fallback" aria-busy="true" />}>
                <SopDiagramCanvas spec={spec} />
              </Suspense>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
