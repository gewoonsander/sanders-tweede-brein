// i18n/rich.tsx — translation for strings that carry INLINE MARKUP.
//
// Some copy genuinely needs emphasis or a link in the middle of a sentence:
//   "Add a <strong>Note</strong> to capture a fresh thought, …"
// Splitting that into three keys ("Add a" / "Note" / "to capture…") is the
// classic i18n mistake: Dutch reorders the clause and the fragments no longer
// compose. So the whole sentence stays ONE key with named slots —
//   'Add a {note} to capture a fresh thought, …'
// — and the call site supplies a ReactNode per slot. The translator moves the
// slot wherever Dutch grammar wants it; the markup follows.
//
// Same `{brace}` syntax as the plain `t()`, so a string can be promoted from
// plain to rich (or demoted) without touching the dictionary.
import { Fragment, type ReactNode } from 'react';
import { translate, useLocale, type TranslationKey, type TranslationVars } from './index';

const PLACEHOLDER = /\{(\w+)\}/g;

export type TNodesFunction = (
  key: TranslationKey,
  parts: Record<string, ReactNode>,
  vars?: TranslationVars,
) => ReactNode;

/**
 * useTNodes — like `useT()`, but each `{slot}` may resolve to a ReactNode.
 *
 *   const tn = useTNodes();
 *   <p>{tn('board.emptySub', { note: <strong>{t('board.note')}</strong> })}</p>
 *
 * Slots not present in `parts` fall through to plain `vars` interpolation (done
 * by `translate`), and an unmatched `{slot}` is left verbatim — a visible
 * `{slot}` is a bug report, an empty gap is a silent one.
 */
export function useTNodes(): TNodesFunction {
  const { locale } = useLocale();
  return (key, parts, vars) => {
    const template = translate(locale, key, vars);
    const out: ReactNode[] = [];
    let cursor = 0;
    let slot = 0;
    PLACEHOLDER.lastIndex = 0;
    for (let m = PLACEHOLDER.exec(template); m !== null; m = PLACEHOLDER.exec(template)) {
      const name = m[1];
      if (!Object.prototype.hasOwnProperty.call(parts, name)) continue; // left verbatim
      if (m.index > cursor) out.push(template.slice(cursor, m.index));
      out.push(<Fragment key={`${name}-${slot++}`}>{parts[name]}</Fragment>);
      cursor = m.index + m[0].length;
    }
    if (cursor < template.length) out.push(template.slice(cursor));
    return out;
  };
}
