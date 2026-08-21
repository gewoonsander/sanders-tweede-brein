// SopDiagramCanvas.tsx — the heavy React Flow chunk for procedure diagrams.
//
// Lazy-loaded by SopDiagram.tsx so @xyflow/react never lands in the FileView
// critical bundle: opening a markdown file must stay as cheap as it is today,
// and the diagram only exists once the reader asks for it.
//
// Deliberately modelled on MiniGraphCanvas (the knowledge graph) rather than a
// second renderer: same library, same edge vocabulary (--graph-edge solid /
// --graph-edge-dash for exception paths), same manual zoom controls, same
// MOTION_OK gate on every camera tween. What differs is the layout — a
// procedure is a sequence, so positions come from the deterministic grid in
// diagramLayout.ts instead of a force simulation.
//
// READ-ONLY: nothing here writes, navigates, drags, connects or selects. The
// prose below the canvas remains the source of record; the diagram is a view of
// it, and a keyboard user can reach every card without touching the diagram at
// all.
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from '@xyflow/react';
import { Maximize, Minus, Plus } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { KIND_LABEL, type DiagramSpec } from './diagramTypes';
import { layoutBounds, layoutSpec } from './diagramLayout';
import { StepNode, type StepNodeData } from './StepNode';

// Module scope, never inline — a fresh object each render forces React Flow to
// re-initialise every node (the same perf rule MiniGraphCanvas follows).
const nodeTypes: NodeTypes = { step: StepNode };

const MOTION_OK =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mirrors --graph-fit-duration; 0 under prefers-reduced-motion (camera snaps). */
const FIT_DURATION = MOTION_OK ? 520 : 0;

/** Top padding when framing the head of the diagram, in flow units. */
const TOP_PAD = 32;

interface BuiltFlow {
  nodes: Node<StepNodeData>[];
  edges: Edge[];
}

function buildFlow(spec: DiagramSpec): BuiltFlow {
  const positions = layoutSpec(spec.nodes);
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));

  const nodes: Node<StepNodeData>[] = spec.nodes.map((n) => ({
    id: n.id,
    type: 'step',
    position: positions.get(n.id) ?? { x: 0, y: 0 },
    data: { kind: n.kind, label: n.label, when: n.when, detail: n.detail },
    // The accessible name spells out the semantic the glyph carries, so the
    // meaning never depends on seeing the icon or its colour.
    ariaLabel: [
      KIND_LABEL[n.kind],
      n.when && n.when !== KIND_LABEL[n.kind] ? n.when : null,
      n.label,
      n.detail && n.detail !== n.label ? n.detail : null,
    ]
      .filter(Boolean)
      .join('. '),
    draggable: false,
    selectable: false,
    connectable: false,
  }));

  const edges: Edge[] = spec.edges.map((e) => {
    const source = byId.get(e.source);
    const target = byId.get(e.target);
    // Only edges that leave the spine rightwards use the side handles. An edge
    // that REJOINS the spine (target.col < source.col) drops out of the branch
    // and enters the next card from the top like any other spine edge —
    // entering from the left made smoothstep detour far to the left of the
    // spine before doubling back, which read as a stray line.
    //
    // A converter can override the guess with `enter`, which the sub-procedure
    // fan-out needs: see DiagramEdge.enter for why crossing a sibling's face is
    // not a cosmetic problem there but a wrong sentence.
    const inferred = source && target ? target.col > source.col : false;
    const sideways = e.enter ? e.enter === 'side' : inferred;
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: sideways ? 'branch' : null,
      targetHandle: sideways ? 'branch' : null,
      type: 'smoothstep',
      className: `dg-edge dg-edge--${e.kind}`,
      label: e.label,
      labelShowBg: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 13,
        height: 13,
        // Matches the resting stroke token; CSS cannot reliably reach the
        // generated <marker> fill, so the token is resolved here (the same
        // workaround MiniGraphCanvas documents). One ink for both kinds: the
        // arrowhead is what makes the line directional, so it has to clear the
        // same 3:1 non-text floor as the stroke it terminates (SC 1.4.11).
        color: 'var(--diagram-edge)',
      },
    };
  });

  return { nodes, edges };
}

function CanvasInner({ spec }: { spec: DiagramSpec }) {
  const { setViewport, fitView, zoomIn, zoomOut } = useReactFlow();
  const { nodes, edges } = useMemo(() => buildFlow(spec), [spec]);
  const bounds = useMemo(() => layoutBounds(spec.nodes), [spec.nodes]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  /**
   * Frame the HEAD of the diagram at 1:1 rather than fitting the whole thing.
   * A 25-step procedure fitted into a panel lands around 0.2 zoom, where no
   * label is readable — the same reason the knowledge graph centres on its
   * focus instead of fitting. "Pas in beeld" stays one button away.
   */
  const frameTop = useCallback(
    (duration: number) => {
      const pane = rootRef.current;
      const paneW = pane?.clientWidth ?? bounds.width;
      const x = Math.max(TOP_PAD, (paneW - bounds.width) / 2);
      setViewport({ x, y: TOP_PAD, zoom: 1 }, { duration });
    },
    [setViewport, bounds.width],
  );

  const fitAll = useCallback(() => {
    fitView({ padding: 0.12, duration: FIT_DURATION, minZoom: 0.15 });
  }, [fitView]);

  // Frame once per spec. requestAnimationFrame so the pane has a measured box.
  useEffect(() => {
    const raf = requestAnimationFrame(() => frameTop(0));
    return () => cancelAnimationFrame(raf);
  }, [frameTop, spec.id]);

  // Re-frame when the container resizes (inline → fullscreen is a new mount,
  // but the fullscreen box only settles after its flex height resolves).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    let lastW = 0;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box || box.width === 0) return;
      if (Math.abs(box.width - lastW) < 1) return;
      lastW = box.width;
      frameTop(0);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [frameTop]);

  return (
    <div ref={rootRef} className="dg-flow-root">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={() => frameTop(0)}
        // Cards are focusable so a keyboard user can read the procedure card by
        // card; they are not selectable, draggable or connectable, because
        // nothing in this view mutates anything.
        nodesFocusable
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesFocusable={false}
        edgesReconnectable={false}
        panOnScroll={false}
        zoomOnScroll
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} className="dg-bg" />
        <Controls
          position="bottom-right"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          className="dg-controls"
        >
          <ControlButton onClick={() => zoomIn({ duration: FIT_DURATION })} aria-label="Inzoomen" title="Inzoomen">
            <Plus size={14} strokeWidth={1.75} aria-hidden="true" />
          </ControlButton>
          <ControlButton onClick={() => zoomOut({ duration: FIT_DURATION })} aria-label="Uitzoomen" title="Uitzoomen">
            <Minus size={14} strokeWidth={1.75} aria-hidden="true" />
          </ControlButton>
          <ControlButton onClick={fitAll} aria-label="Hele diagram in beeld" title="Hele diagram in beeld">
            <Maximize size={14} strokeWidth={1.75} aria-hidden="true" />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

export interface SopDiagramCanvasProps {
  spec: DiagramSpec;
}

export default function SopDiagramCanvas({ spec }: SopDiagramCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner spec={spec} />
    </ReactFlowProvider>
  );
}
