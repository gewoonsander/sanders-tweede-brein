// specBuilder.ts — the tiny node/edge accumulator every converter builds on.
//
// Extracted from sopDiagrams.ts in fase 2 (tsk-2026-08-21-001) so the three
// document-specific fase-1 converters and the generic parser share ONE builder
// instead of two copies drifting apart. Behaviour is unchanged from fase 1 —
// this is a move, not a rewrite.
import type { DiagramEdge, DiagramNode, DiagramNodeKind } from './diagramTypes';

/**
 * Warning/error targets are reached over the dashed exception path. Reading the
 * edge kind off the TARGET means a converter never has to remember to pass
 * `'exception'` by hand for the paths that are, by definition, exceptional.
 */
export function edgeKindFor(target: DiagramNodeKind): DiagramEdge['kind'] {
  return target === 'warning' || target === 'error' ? 'exception' : 'flow';
}

/** Small builder so the converters read as the shape they describe. */
export class SpecBuilder {
  readonly nodes: DiagramNode[] = [];
  readonly edges: DiagramEdge[] = [];
  private seq = 0;

  node(n: Omit<DiagramNode, 'id'> & { id?: string }): DiagramNode {
    const node: DiagramNode = { ...n, id: n.id ?? `n${this.seq++}` };
    this.nodes.push(node);
    return node;
  }

  link(
    source: DiagramNode,
    target: DiagramNode,
    label?: string,
    kind?: DiagramEdge['kind'],
    enter?: DiagramEdge['enter'],
  ): void {
    this.edges.push({
      id: `e:${source.id}->${target.id}`,
      source: source.id,
      target: target.id,
      label,
      kind: kind ?? edgeKindFor(target.kind),
      enter,
    });
  }
}
