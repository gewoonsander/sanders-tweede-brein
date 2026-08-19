// taskFrontmatter.js — a MINIMAL frontmatter reader for markdown task files.
//
// WHY NOT A YAML LIBRARY
// The cockpit server has four dependencies (better-sqlite3, express, imapflow,
// node-ical) and deliberately no YAML parser. Task frontmatter is a tiny, fully
// known subset — scalars, inline arrays, nulls, and `#` comments — written from
// one template (Team Knowledge/tasks/_template.md) by our own SOPs. Parsing that
// subset by hand is ~60 lines and adds no supply-chain surface. This is the same
// call regen-mypka-db.py's governance-doc pass makes for header-bullet metadata.
//
// WHAT IT HANDLES (everything the task template emits)
//   key: value            scalar
//   key: "quoted value"   quotes stripped, ALWAYS a string (never coerced)
//   key: null             -> null   (the JS null, not the string "null")
//   key:                  -> null   (empty value)
//   key: []               -> []     (empty array)
//   key: [a, b, "c d"]    -> ['a','b','c d']
//   key: 3                -> 3      (unquoted pure integer becomes a number)
//   key: true / false     -> boolean
//   # comment             skipped (the task template is FULL of these)
//
// WHAT IT DELIBERATELY DOES NOT HANDLE
//   Nested maps, block scalars (`|`, `>`), multi-line arrays (`- item` on its own
//   line), anchors, dates-as-objects. None appear in a task file. An unrecognized
//   line is SKIPPED, never a throw — constraint 4 of the plan: one malformed line
//   must cost one field, never the whole page.
//
// CONTRACT: parseTaskFrontmatter(text) -> { fm, body }. Never throws. A file with
// no frontmatter yields { fm: {}, body: <the whole text> } — an honest empty read
// rather than an error the caller has to branch on.

// Turn ONE raw scalar token into its JS value. `quotedIsString` guards the case
// that matters most: a quoted "3" is the string '3', an unquoted 3 is the number.
function coerceScalar(raw) {
  const s = String(raw).trim();
  if (s === '') return null;

  // Quoted -> always a string, verbatim between the quotes.
  const q = s.match(/^"(.*)"$/s) || s.match(/^'(.*)'$/s);
  if (q) return q[1];

  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return Number(s);
  return s;
}

// Split an inline-array body ("a, b, \"c, d\"") on commas that sit OUTSIDE quotes,
// so a quoted element containing a comma survives intact.
function splitInlineArray(inner) {
  const out = [];
  let cur = '';
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === ',') { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter((x) => x !== '');
}

/**
 * parseTaskFrontmatter(text) -> { fm, body }
 * Never throws. Unknown/malformed lines are skipped, not fatal.
 */
export function parseTaskFrontmatter(text) {
  const src = typeof text === 'string' ? text : '';
  // Frontmatter must OPEN on the very first line (allowing a UTF-8 BOM).
  const lines = src.replace(/^﻿/, '').split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return { fm: {}, body: src };

  // Find the closing fence.
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) return { fm: {}, body: src }; // unterminated block — treat as none

  const fm = {};
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue; // blank or comment
    if (line !== line.trimStart()) continue;                 // indented -> nested, skipped

    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];

    // Strip a trailing ` # comment` — but only when it is OUTSIDE quotes and
    // outside brackets, so a '#' inside a title or a tag survives.
    if (!/^["'[]/.test(value)) {
      const hash = value.indexOf(' #');
      if (hash >= 0) value = value.slice(0, hash);
    }
    value = value.trim();

    const arr = value.match(/^\[(.*)\]$/s);
    fm[key] = arr ? splitInlineArray(arr[1]).map(coerceScalar) : coerceScalar(value);
  }

  return { fm, body: lines.slice(end + 1).join('\n') };
}

export default parseTaskFrontmatter;
