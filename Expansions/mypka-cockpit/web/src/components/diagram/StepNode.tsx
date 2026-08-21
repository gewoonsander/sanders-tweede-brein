// StepNode.tsx — the custom React Flow node for a procedure diagram.
//
// One card shape for every node kind; `kind` changes only the GLYPH and, for the
// three signal kinds, which existing token paints the left edge. There is no
// per-step hue and no colour-only meaning: the glyph carries the semantic and
// the aria-label spells it out in words (WCAG 2.2 §1.4.1 — never colour alone).
//
// Glyph vocabulary is Harmonia's, verbatim from her 2026-08-19 review:
//   Workflow (the process), ListChecks (action/step), GitBranch (decision),
//   Split (branch outcome), ArrowRightLeft (handoff to a specialist),
//   CircleDot (start), CircleCheck (end), TriangleAlert (warning), CircleX (blocked).
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  ArrowRightLeft,
  CircleCheck,
  CircleDot,
  CircleX,
  GitBranch,
  ListChecks,
  Split,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { KIND_LABEL, type DiagramNodeKind } from './diagramTypes';

const KIND_ICON: Record<DiagramNodeKind, LucideIcon> = {
  start: CircleDot,
  step: ListChecks,
  decision: GitBranch,
  branch: Split,
  handoff: ArrowRightLeft,
  warning: TriangleAlert,
  error: CircleX,
  end: CircleCheck,
};

export interface StepNodeData extends Record<string, unknown> {
  kind: DiagramNodeKind;
  label: string;
  when?: string;
  detail?: string;
}

function StepNodeImpl({ data }: NodeProps) {
  const d = data as StepNodeData;
  const Icon = KIND_ICON[d.kind];

  return (
    <div
      className="dg-node"
      data-kind={d.kind}
      // The full source sentence on hover. The same text is in the node's
      // ariaLabel (set in SopDiagramCanvas), so a tooltip is never the only
      // route to it.
      title={d.detail ? `${d.label} — ${d.detail}` : d.label}
    >
      {/* Layout anchors for the edges; never visible, never focusable. */}
      <Handle type="target" position={Position.Top} className="dg-handle" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="dg-handle" isConnectable={false} />
      <Handle
        type="source"
        position={Position.Right}
        id="branch"
        className="dg-handle"
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="branch"
        className="dg-handle"
        isConnectable={false}
      />

      <span className="dg-node-when">
        <Icon size={13} strokeWidth={1.75} className="dg-node-icon" aria-hidden="true" />
        <span className="dg-node-when-text">{d.when ?? KIND_LABEL[d.kind]}</span>
      </span>
      <span className="dg-node-label">{d.label}</span>
    </div>
  );
}

export const StepNode = memo(StepNodeImpl);
