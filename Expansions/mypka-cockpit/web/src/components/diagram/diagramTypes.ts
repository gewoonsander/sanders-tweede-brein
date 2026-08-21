// diagramTypes.ts — the data contract between the markdown→diagram conversion
// step (sopDiagrams.ts) and the React Flow renderer (SopDiagramCanvas.tsx).
//
// Deliberately renderer-agnostic: a DiagramSpec is plain data with an explicit
// (col, row) grid placement, so the conversion step owns the SHAPE of the
// diagram and the canvas owns only how a node/edge is drawn. That split is what
// lets three structurally different SOPs (decision tree, phased pipeline,
// steps-with-fork) share one canvas without the canvas knowing about any of them.
//
// Design-system note (GL-003 / INKLINE): `kind` is a SHAPE + SEMANTIC concern,
// never a hue-per-type concern. The renderer maps kind → lucide glyph (Harmonia's
// recommended vocabulary) and, for the three signal kinds only, to an existing
// --status-* / --accent-marker token. There is no per-step colour.

/**
 * What a node MEANS in the procedure. Drives glyph + (for the three signal
 * kinds) the single token that is allowed to carry colour.
 *
 *  - `start`     — entry point of the procedure          (CircleDot)
 *  - `step`      — a plain action / numbered step        (ListChecks)
 *  - `decision`  — a branch point; the ONE brass moment  (GitBranch)
 *  - `branch`    — an outcome of a decision              (Split)
 *  - `handoff`   — routed to another specialist          (ArrowRightLeft)
 *  - `warning`   — needs human judgement / parked        (TriangleAlert, --status-warning)
 *  - `error`     — destructive or blocking outcome       (CircleX, --status-error)
 *  - `end`       — the procedure is done                 (CircleCheck)
 */
export type DiagramNodeKind =
  | 'start'
  | 'step'
  | 'decision'
  | 'branch'
  | 'handoff'
  | 'warning'
  | 'error'
  | 'end';

export interface DiagramNode {
  /** Stable within one spec; used as the React Flow node id. */
  id: string;
  kind: DiagramNodeKind;
  /** Short, already-shortened label. Rendered, 2-line clamp. */
  label: string;
  /**
   * The CONDITION under which this node is reached ("Document", "Twijfel",
   * "CRITICAL"). Rendered as a small caption above the label. Carrying the
   * condition inside the card instead of on the edge is deliberate: a decision
   * that fans out to 8 routes would otherwise stack 8 edge labels on top of each
   * other. Edge labels stay reserved for genuine two-way forks.
   */
  when?: string;
  /** Full source sentence. Tooltip + screen-reader detail; never truncated. */
  detail?: string;
  /** Grid column. May be negative (a left fork); layout normalises. */
  col: number;
  /** Grid row, top to bottom. Integers; halves are allowed for centring. */
  row: number;
}

/**
 * `flow` = the normal path (solid, --graph-edge).
 * `exception` = an exception / opt-out path (dashed, --graph-edge-dash) — the
 * vocabulary the knowledge graph already uses for its non-primary edges.
 */
export type DiagramEdgeKind = 'flow' | 'exception';

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  /** Optional edge caption ("missing leeg", "blokkeert"). Kept very short. */
  label?: string;
  kind: DiagramEdgeKind;
}

/** The three shapes fase 1 covers. Recorded so the canvas can announce it. */
export type DiagramShape = 'decision-tree' | 'phased-pipeline' | 'steps-with-fork';

export interface DiagramSpec {
  /** Matches the source document's basename without extension. */
  id: string;
  title: string;
  shape: DiagramShape;
  /** One sentence, read out as the canvas's accessible description. */
  summary: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/** Human-readable shape names (Dutch — the cockpit's Team Knowledge surface). */
export const SHAPE_LABEL: Record<DiagramShape, string> = {
  'decision-tree': 'Beslisboom',
  'phased-pipeline': 'Gefaseerde pipeline',
  'steps-with-fork': 'Stappen met tweesprong',
};

/** Screen-reader name per node kind. Also used in the node's aria-label. */
export const KIND_LABEL: Record<DiagramNodeKind, string> = {
  start: 'Start',
  step: 'Stap',
  decision: 'Beslismoment',
  branch: 'Route',
  handoff: 'Overdracht',
  warning: 'Let op',
  error: 'Blokkerend',
  end: 'Einde',
};
