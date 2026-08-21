// diagramLayout.ts — grid (col, row) → React Flow pixel positions.
//
// Deliberately NOT d3-force. The knowledge graph is a constellation and wants a
// physics layout; a procedure is a sequence and wants a deterministic one. The
// same document must draw identically every time it is opened, so the layout is
// a pure function of the spec — no simulation, no seed, no settling frames.
//
// The dimensions mirror EXISTING tokens rather than inventing new ones:
//   NODE_W  = --graph-node-w-0 (200px), the width the diagram cards are set to
//             in cockpit.css. Kept in sync here the same way MiniGraphCanvas
//             keeps FOCUS_FALLBACK_W in sync with the same token.
//   COL_GAP / ROW_H are pure whitespace, sized off the --space-* ramp
//             (--space-lg = 24px): 200 + 24×2.5 = 260, and 24×4 = 96.
import type { DiagramNode } from './diagramTypes';

/** Mirrors --graph-node-w-0. Change both together. */
export const NODE_W = 200;
/** Column pitch: node width + 2.5 × --space-lg of gutter. */
export const COL_PITCH = 260;
/** Row pitch: 4 × --space-lg. Comfortably clears a 2-line card (max ~76px). */
export const ROW_PITCH = 96;

export interface Point { x: number; y: number; }

/**
 * Grid → pixels. Columns are normalised so the left-most column lands at x=0,
 * which lets a converter use a negative column for a left-hand fork without the
 * canvas needing to know.
 */
export function layoutSpec(nodes: DiagramNode[]): Map<string, Point> {
  const minCol = nodes.reduce((m, n) => Math.min(m, n.col), 0);
  const minRow = nodes.reduce((m, n) => Math.min(m, n.row), 0);
  const out = new Map<string, Point>();
  for (const n of nodes) {
    out.set(n.id, {
      x: (n.col - minCol) * COL_PITCH,
      y: (n.row - minRow) * ROW_PITCH,
    });
  }
  return out;
}

/** The bounding box of a laid-out spec, used to frame the camera on open. */
export function layoutBounds(nodes: DiagramNode[]): { width: number; height: number } {
  const minCol = nodes.reduce((m, n) => Math.min(m, n.col), 0);
  const maxCol = nodes.reduce((m, n) => Math.max(m, n.col), 0);
  const minRow = nodes.reduce((m, n) => Math.min(m, n.row), 0);
  const maxRow = nodes.reduce((m, n) => Math.max(m, n.row), 0);
  return {
    width: (maxCol - minCol) * COL_PITCH + NODE_W,
    height: (maxRow - minRow) * ROW_PITCH + ROW_PITCH,
  };
}
