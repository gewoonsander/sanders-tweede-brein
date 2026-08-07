/*
 * theme-bootstrap.js — the cockpit's PRE-PAINT PREFERENCE BOOTSTRAP. Runs BEFORE
 * the stylesheet/app so the correct token set AND the correct UI language are on
 * <html> at first paint (no flash of the wrong theme, no flash of the wrong
 * `lang` attribute).
 *
 * It mirrors two modules — keep all three in sync if you touch any of them:
 *   src/lib/theme.ts      — 'cockpit-theme'  -> data-theme + color-scheme
 *   src/lib/i18n/index.ts — 'cockpit-locale' -> <html lang>
 *
 * WHY THIS IS AN EXTERNAL FILE (not an inline <script>):
 *   The cockpit server serves the SPA under a strict CSP (`script-src 'self'`),
 *   which BLOCKS inline scripts (no 'unsafe-inline'). Loaded from /theme-bootstrap.js
 *   it is a same-origin ('self') asset the existing CSP already permits — no nonce,
 *   no per-build hash to drift. Vite copies web/public/* to the dist root verbatim,
 *   and index.html references it with a plain (non-module, non-deferred) <script> so
 *   it executes synchronously in <head> before first paint, exactly as the old inline
 *   script did. Keep this CSP-safe (self-origin) and synchronous if you edit it.
 *
 * The filename stays `theme-bootstrap.js` on purpose: index.html, the CHANGELOG and
 * the CSP note all reference it by that name. Its job just grew.
 */
(function () {
  // ---- Theme: 'light' | 'dark' | 'system' (default 'system') ----------------
  try {
    var pref = localStorage.getItem('cockpit-theme');
    if (pref !== 'light' && pref !== 'dark') pref = 'system';
    var resolved =
      pref === 'system'
        ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        : pref;
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // ---- Language: 'en' | 'nl' (default 'en') ---------------------------------
  // English stays the default so existing installs are untouched until the user
  // opts in via Settings > Appearance > Language.
  try {
    var locale = localStorage.getItem('cockpit-locale');
    if (locale !== 'nl') locale = 'en';
    document.documentElement.setAttribute('lang', locale);
  } catch (e) {
    document.documentElement.setAttribute('lang', 'en');
  }
})();
