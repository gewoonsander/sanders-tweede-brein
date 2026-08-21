// markdownShapes.ts — the small, shared markdown-reading helpers the three
// fase-1 converters (sopDiagrams.ts) are built from.
//
// SCOPE: these are STRUCTURE readers, not a parser. They answer narrow
// questions — "which `## Stap N` sections does this document have", "what are
// the rows of this table", "which arrow lines sit inside this fenced block" —
// and a converter composes them into a shape.
//
// Fase 1 (tsk-2026-08-19-003) composed them by hand, per pilot document.
// Fase 2 (tsk-2026-08-21-001) added genericParser.ts, which composes the SAME
// helpers behind a cascade of heuristics so any SOP or Workstream gets a
// diagram. These readers did not change for it — only `withoutFrontmatter` and
// `frontmatterBlock` moved in, from sopDiagrams.ts.
//
// Everything here is pure and fence-aware: a `#` or a `|` inside a ``` block is
// never mistaken for a heading or a table row.

export interface MdSection {
  /** Heading text with the leading #'s and whitespace removed. */
  heading: string;
  /** Everything until the next heading at this level or shallower. */
  body: string;
}

/**
 * Drop the YAML frontmatter block so headings, lists and tables inside it are
 * never read as document structure. Lived privately in sopDiagrams.ts through
 * fase 1; promoted here in fase 2 because the generic parser needs the same
 * guarantee and two copies of "where does the body start" is one too many.
 */
export function withoutFrontmatter(md: string): string {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('\n---', 3);
  if (end < 0) return md;
  const after = md.indexOf('\n', end + 1);
  return after < 0 ? '' : md.slice(after + 1);
}

/**
 * The raw frontmatter block (without the `---` fences), or '' when there is
 * none. Used by the Workstream parser to read `owners:`, which is the only
 * place several Workstreams name their specialists explicitly.
 */
export function frontmatterBlock(md: string): string {
  if (!md.startsWith('---')) return '';
  const end = md.indexOf('\n---', 3);
  if (end < 0) return '';
  const first = md.indexOf('\n');
  return first < 0 || first > end ? '' : md.slice(first + 1, end + 1);
}

/**
 * Split `md` into the sections introduced by headings of exactly `level`.
 * A shallower heading closes the current section (so a `## ` ends a `### ` run).
 */
export function headingSections(md: string, level: number): MdSection[] {
  const out: MdSection[] = [];
  let current: { heading: string; body: string[] } | null = null;
  let inFence = false;

  const flush = () => {
    if (current) out.push({ heading: current.heading, body: current.body.join('\n') });
    current = null;
  };

  for (const line of md.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence) {
      const m = /^(#{1,6})\s+(.*)$/.exec(line);
      if (m) {
        const depth = m[1].length;
        if (depth === level) {
          flush();
          current = { heading: m[2].trim(), body: [] };
          continue;
        }
        if (depth < level) {
          flush();
          continue;
        }
      }
    }
    if (current) current.body.push(line);
  }
  flush();
  return out;
}

/**
 * Every pipe-table row in `body`, separator rows dropped, cells trimmed. The
 * header row IS returned (callers usually drop it) so a caller can verify the
 * table is the one it expects before trusting the rows.
 */
export function tableRows(body: string): string[][] {
  const rows: string[][] = [];
  let inFence = false;
  for (const raw of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const line = raw.trim();
    if (!line.startsWith('|') || !line.endsWith('|') || line.length < 3) continue;
    const cells = line.slice(1, -1).split('|').map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // the |---|---| rule
    rows.push(cells);
  }
  return rows;
}

/** The contents of each fenced code block in `body`, in document order. */
export function fencedBlocks(body: string): string[] {
  const blocks: string[] = [];
  let inFence = false;
  let buf: string[] = [];
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      if (inFence) { blocks.push(buf.join('\n')); buf = []; }
      inFence = !inFence;
      continue;
    }
    if (inFence) buf.push(line);
  }
  return blocks;
}

export interface ArrowPair { left: string; right: string; }

/** `Label   → Destination` pairs, one per line that contains an arrow. */
export function arrowPairs(text: string): ArrowPair[] {
  const out: ArrowPair[] = [];
  for (const line of text.split(/\r?\n/)) {
    const i = line.indexOf('→');
    if (i < 0) continue;
    const left = line.slice(0, i).replace(/^[-*\s]+/, '').trim();
    const right = line.slice(i + 1).trim();
    if (!left || !right) continue;
    out.push({ left, right });
  }
  return out;
}

/**
 * Top-level ordered-list items (`1. `, `2. `…). Continuation lines and nested
 * content are folded into the same item, so a multi-line step stays one step.
 * Fence-aware, so a numbered line inside a code block is not an item.
 */
export function orderedItems(body: string): string[] {
  const items: string[] = [];
  let buf: string[] | null = null;
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence ? /^(\d+)\.\s+(.*)$/.exec(line) : null;
    if (m) {
      if (buf) items.push(buf.join(' ').trim());
      buf = [m[2]];
      continue;
    }
    if (buf === null) continue;
    if (!inFence && line.trim() === '') { items.push(buf.join(' ').trim()); buf = null; continue; }
    buf.push(line.trim());
  }
  if (buf) items.push(buf.join(' ').trim());
  return items.filter(Boolean);
}

/** Top-level unordered bullets (`- `, `* `), one string each. Fence-aware. */
export function bulletItems(body: string): string[] {
  const items: string[] = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^[-*]\s+(.*)$/.exec(line);
    if (m && m[1].trim()) items.push(m[1].trim());
  }
  return items;
}

/**
 * Markdown inline syntax → plain text. Wikilinks resolve to their display text,
 * links to their label, emphasis and code fences to the bare words. Whitespace
 * collapses. Everything a diagram label should not be showing.
 */
export function plain(text: string): string {
  return text
    .replace(/!\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A diagram label: plain text, truncated on a word boundary. `max` is a
 * character budget, not a pixel one — the node also 2-line-clamps in CSS, so
 * this is about keeping the label a LABEL, not about fitting the box exactly.
 */
export function shortLabel(text: string, max = 58): string {
  const clean = plain(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const head = space > Math.floor(max / 2) ? cut.slice(0, space) : cut;
  return `${head.replace(/[\s,;:—–-]+$/, '')}…`;
}

/**
 * The first clause of a sentence — used where the source writes "Do X. Then Y."
 * and only "Do X" belongs on the card (the whole sentence lives in `detail`).
 */
export function firstClause(text: string, max = 58): string {
  const clean = plain(text);
  // `:` is in the stop set on purpose: the SOPs write "Kies exact één
  // categorie:" and then enumerate. The lead-in is the label; the enumeration
  // belongs in `detail`. `12:00` survives — there is no space after that colon.
  const stop = clean.search(/(?:[.;:]\s)|(?:\s—\s)/);
  const head = stop > 14 ? clean.slice(0, stop) : clean;
  return shortLabel(head, max);
}

/**
 * Upper-case the first letter. The SOPs often continue a sentence after a colon
 * ("Output for Phase 1: a list of…"), and that fragment becomes a card label —
 * a card label starts with a capital.
 */
export function sentenceCase(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
