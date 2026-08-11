#!/usr/bin/env node
// build-bookmarklet.mjs — turns extract.mjs + bookmarklet.template.js into
//   · bookmarklet.txt   the raw `javascript:` URL to paste into a bookmark
//   · install.html      a local page with a drag-me-to-the-bookmarks-bar link
//
// Run:  node tools/dartsatlas/build-bookmarklet.mjs
//   or: npm run darts:bookmarklet   (from the Cockpit root)
//
// Re-run this after ANY edit to extract.mjs — the bookmarklet carries a frozen
// copy of the extraction logic, so an un-rebuilt bookmarklet silently keeps
// exporting the old shape.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTRACT = path.join(__dirname, 'extract.mjs');
const TEMPLATE = path.join(__dirname, 'bookmarklet.template.js');
const OUT_TXT = path.join(__dirname, 'bookmarklet.txt');
const OUT_HTML = path.join(__dirname, 'install.html');

/**
 * Strip comments conservatively: only whole lines that are a line comment or sit
 * inside a block comment. Never touches code lines, so a `//` inside a regex
 * literal (e.g. /^\/players\//) survives untouched. Blank lines go too.
 */
function stripComments(src) {
  const out = [];
  let inBlock = false;
  for (const line of src.split('\n')) {
    const t = line.trim();
    if (inBlock) {
      if (t.includes('*/')) inBlock = false;
      continue;
    }
    if (t.startsWith('/*')) {
      if (!t.includes('*/')) inBlock = true;
      continue;
    }
    if (t.startsWith('//') || t === '') continue;
    out.push(t);
  }
  return out.join('\n');
}

const extractSrc = fs.readFileSync(EXTRACT, 'utf8');
const templateSrc = fs.readFileSync(TEMPLATE, 'utf8');

// Line-anchored on purpose: the template's own header comment MENTIONS the
// marker, and a plain String.replace would splice the extractor into that
// comment (producing a file that parses as garbage from line 2 onward).
const MARKER = /^[ \t]*\/\*__EXTRACT__\*\/[ \t]*$/m;
if (!MARKER.test(templateSrc)) {
  throw new Error('bookmarklet.template.js mist een regel die alleen /*__EXTRACT__*/ bevat');
}

// extract.mjs is an ES module; a bookmarklet is a plain script. Dropping the
// `export ` prefix turns each declaration into a local of the IIFE — which is
// exactly what the wrapper needs.
const inlined = stripComments(extractSrc).replace(/^export\s+/gm, '');
const residue = inlined.split('\n').filter((l) => /^\s*(import|export)\s/.test(l));
if (residue.length) {
  throw new Error(
    'extract.mjs bevat nog module-statements die een bookmarklet niet kan uitvoeren:\n  ' + residue.join('\n  '),
  );
}

const code = stripComments(templateSrc.replace(MARKER, () => inlined));
const url = 'javascript:' + encodeURIComponent(code);

// Fail the build rather than shipping a bookmarklet that throws on click.
try {
  // eslint-disable-next-line no-new-func
  new Function(code);
} catch (err) {
  fs.writeFileSync(path.join(__dirname, '.bookmarklet-broken.js'), code, 'utf8');
  throw new Error(
    `de gegenereerde bookmarklet is geen geldige JavaScript: ${err.message}\n` +
    `  (de kapotte build staat in tools/dartsatlas/.bookmarklet-broken.js)`,
  );
}

fs.writeFileSync(OUT_TXT, url + '\n', 'utf8');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const html = `<!doctype html>
<meta charset="utf-8">
<title>Darts Atlas → myPKA — bookmarklet installeren</title>
<style>
  body { font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 46rem; margin: 3rem auto; padding: 0 1.5rem; color: #1c1f24; }
  .bm { display: inline-block; padding: .7rem 1.1rem; border-radius: 8px; background: #12151a; color: #fff; text-decoration: none; font-weight: 700; }
  code { background: #f1f3f5; padding: .1rem .35rem; border-radius: 4px; }
  ol li { margin-bottom: .5rem; }
  .warn { border-left: 4px solid #a4262c; background: #fdf3f4; padding: .8rem 1rem; border-radius: 0 6px 6px 0; }
</style>
<h1>Darts Atlas → myPKA</h1>
<p>Sleep de knop hieronder naar je bladwijzerbalk (Cmd+Shift+B als die verborgen is).</p>
<p><a class="bm" href="${escapeHtml(url)}">Darts → myPKA</a></p>
<ol>
  <li>Open je eigen pagina op dartsatlas.com: <code>/players/&lt;jouw-id&gt;/tournaments</code> of <code>/rankings</code>.</li>
  <li>Klik de bladwijzer. Er wordt een JSON-bestand gedownload.</li>
  <li>Verplaats dat bestand naar de watch-map (of laat het in Downloads staan — de importer kijkt daar ook).</li>
  <li>Draai <code>npm run darts:import</code> vanuit de Cockpit-map.</li>
</ol>
<p class="warn"><strong>Eén klik = één pagina.</strong> De bookmarklet haalt nooit zelf een andere pagina op. Bij meerdere pagina&rsquo;s blader je zelf verder en klik je opnieuw — dat is precies wat de Darts Atlas Terms of Use wél toestaan.</p>
<p>Gegenereerd door <code>build-bookmarklet.mjs</code> — niet met de hand bewerken.</p>
`;
fs.writeFileSync(OUT_HTML, html, 'utf8');

console.log(`✓ bookmarklet.txt  (${url.length} tekens)`);
console.log(`✓ install.html     — open dit bestand in je browser en sleep de knop naar de bladwijzerbalk`);
console.log(`  ${OUT_HTML}`);
