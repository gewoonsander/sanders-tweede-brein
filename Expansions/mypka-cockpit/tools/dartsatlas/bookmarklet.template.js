// bookmarklet.template.js — the wrapper around extract.mjs.
//
// build-bookmarklet.mjs replaces the /*__EXTRACT__*/ marker with the body of
// extract.mjs (export keywords stripped) and emits bookmarklet.txt + install.html.
//
// What it does when Sander clicks it on a Darts Atlas page he opened himself:
//   1. reads the DOM that is already in front of him (no network call — ever),
//   2. builds the export envelope,
//   3. downloads it as dartsatlas-<stamp>-<page>.json,
//   4. shows a toast with the counts and a "copy JSON" fallback button.
//
// It never navigates, never follows the pager, never touches another URL. One
// click = one page. That is the whole point: Darts Atlas's ToU allows manual
// retrieval for personal use and forbids automated/robotic retrieval.

(function () {
  'use strict';

  /*__EXTRACT__*/

  var TOAST_ID = '__dartsatlas_export_toast__';

  function toast(title, lines, tone, jsonForCopy) {
    var old = document.getElementById(TOAST_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var colors = { ok: '#137a3f', warn: '#8a5a00', error: '#a4262c' };
    var box = document.createElement('div');
    box.id = TOAST_ID;
    box.setAttribute('style', [
      'position:fixed', 'top:16px', 'right:16px', 'z-index:2147483647',
      'max-width:380px', 'padding:14px 16px', 'border-radius:10px',
      'background:#12151a', 'color:#f2f4f7',
      'border-left:5px solid ' + (colors[tone] || colors.ok),
      'box-shadow:0 8px 30px rgba(0,0,0,.45)',
      'font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'white-space:pre-wrap',
    ].join(';'));

    var h = document.createElement('div');
    h.setAttribute('style', 'font-weight:700;margin-bottom:6px;font-size:14px');
    h.textContent = title;
    box.appendChild(h);

    var body = document.createElement('div');
    body.setAttribute('style', 'opacity:.9');
    body.textContent = lines.join('\n');
    box.appendChild(body);

    var row = document.createElement('div');
    row.setAttribute('style', 'margin-top:10px;display:flex;gap:8px');
    box.appendChild(row);

    function button(label, handler) {
      var b = document.createElement('button');
      b.textContent = label;
      b.setAttribute('style', [
        'cursor:pointer', 'border:0', 'border-radius:6px', 'padding:6px 10px',
        'background:#2b3038', 'color:#f2f4f7', 'font:12px/1 inherit',
      ].join(';'));
      b.onclick = handler;
      row.appendChild(b);
      return b;
    }

    if (jsonForCopy) {
      var copy = button('Kopieer JSON', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(jsonForCopy).then(function () {
            copy.textContent = 'Gekopieerd ✓';
          }, function () {
            copy.textContent = 'Kopiëren geblokkeerd';
          });
        } else {
          copy.textContent = 'Kopiëren niet beschikbaar';
        }
      });
    }
    button('Sluiten', function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    });

    document.body.appendChild(box);
    setTimeout(function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    }, 20000);
    return box;
  }

  function stamp(iso) {
    return String(iso).replace(/[-:]/g, '').replace(/\.\d+Z$/, '').replace(/Z$/, '');
  }

  function buildFilename(env) {
    var parts = ['dartsatlas', stamp(env.capturedAt), env.pageType];
    if (env.view && env.view.status) parts.push(env.view.status);
    parts.push('p' + ((env.view && env.view.page) || 1));
    parts.push(env.player && env.player.id ? env.player.id : 'unknown');
    return parts.join('-') + '.json';
  }

  function download(text, filename) {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      if (a.parentNode) a.parentNode.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  }

  try {
    var env = extractFromDocument(document, String(location.href));

    if (!env.pageType) {
      toast('Geen Darts Atlas-pagina die ik ken', [
        'Werkt op:',
        '· /players/<id>/rankings',
        '· /players/<id>/tournaments',
        '· /tournaments/<id>/player_stats/<jouw-id>',
      ], 'error');
      return;
    }

    if (!env.recordCount) {
      toast('Niets gevonden op deze pagina', [
        'Pagina herkend als: ' + env.pageType,
        'Maar er stonden 0 resultaten in. Is de pagina helemaal geladen?',
      ], 'warn');
      return;
    }

    var json = JSON.stringify(env, null, 2);
    var filename = buildFilename(env);
    download(json, filename);

    var lines = [
      env.recordCount + ' records uit ' + env.pageType,
      'Bestand: ' + filename,
    ];
    if (env.pagination && env.pagination.totalPages > 1) {
      lines.push('Pagina ' + env.pagination.current + ' van ' + env.pagination.totalPages +
        " — open de andere pagina's zelf en klik hier opnieuw.");
    }
    lines.push('Verplaats het bestand naar de watch-map en draai: npm run darts:import');
    toast('Darts Atlas geëxporteerd', lines, 'ok', json);
  } catch (err) {
    toast('Export mislukt', [String((err && err.message) || err)], 'error');
  }
})();
