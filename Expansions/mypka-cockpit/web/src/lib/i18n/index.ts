// i18n/index.ts — the cockpit's UI language layer (English / Dutch).
//
// THE MODEL
//   The user picks one of two LOCALES: 'en' | 'nl'. Default is 'en' — this is an
//   opt-in toggle, not a default-language change, so existing installs keep the
//   English chrome they already know until Sander flips the switch in Settings.
//
// WHY HAND-ROLLED (no react-i18next / i18next / formatjs)
//   Same house rule as the self-hosted fonts: zero CDN requests, zero heavyweight
//   dependencies, small modules that look like the rest of the codebase. This file
//   deliberately mirrors src/lib/theme.ts — a localStorage-backed preference, a
//   pre-paint bootstrap in web/public/theme-bootstrap.js, and a hook the rest of
//   the app reads. ~120 lines beats a 40 kB runtime.
//
// WHY useSyncExternalStore (and not useTheme's plain useState)
//   Theme only has to repaint <html>; CSS does the rest, so per-component state is
//   fine there. A language switch has to re-render EVERY component that renders
//   copy. So the locale lives in one module-level store and every `useT()` /
//   `useLocale()` caller subscribes to it. React 18's useSyncExternalStore gives
//   us that with no provider to thread through the tree and no extra dependency.
//
// PERSISTENCE
//   localStorage under 'cockpit-locale', client-only — exactly like the theme, and
//   exactly what the Settings page promises ("saved on this machine only"). No
//   /api/cockpit/settings round-trip: language must be correct at first paint, and
//   a fetch resolves after paint.
//
// SCOPE
//   UI CHROME ONLY (see lib/strings.ts's original scope note, which this module
//   supersedes). Never user content, never data-derived values, never connector /
//   product proper nouns (Todoist, ClickUp, Jortt, iCal), never file paths.
//   Server-emitted strings (Express connector messages) are English-only for now.
import { useCallback, useSyncExternalStore } from 'react';

import { en, type TranslationKey } from './en';
import { nl } from './nl';

export type { TranslationKey } from './en';

export type Locale = 'en' | 'nl';

export const LOCALE_STORAGE_KEY = 'cockpit-locale';

export const LOCALES: readonly Locale[] = ['en', 'nl'];

/** The locale the cockpit falls back to for any key Dutch hasn't translated. */
export const DEFAULT_LOCALE: Locale = 'en';

const DICTIONARIES: Record<Locale, Partial<Record<TranslationKey, string>>> = { en, nl };

/** Interpolation values. Numbers are stringified with the plain `String()` rule —
 *  locale-aware number/date formatting is a separate concern (Intl at the call
 *  site), not something the dictionary should try to own. */
export type TranslationVars = Record<string, string | number>;

export type TFunction = (key: TranslationKey, vars?: TranslationVars) => string;

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v);
}

/** The stored preference, or 'en' when unset/invalid. */
export function readLocalePref(): Locale {
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(raw)) return raw;
  } catch {
    /* storage unavailable (private mode / disabled) — fall through to default */
  }
  return DEFAULT_LOCALE;
}

/** Paint the locale onto <html lang>. The pre-paint bootstrap already did this on
 *  load; this keeps it correct after a live switch (screen readers and hyphenation
 *  both key off `lang`). */
export function applyLocale(locale: Locale): void {
  document.documentElement.setAttribute('lang', locale);
}

const PLACEHOLDER = /\{(\w+)\}/g;

/** Replace `{name}` placeholders. An unknown placeholder is left verbatim rather
 *  than blanked — a visible `{foo}` in the UI is a bug report; an empty gap isn't. */
export function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(PLACEHOLDER, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/**
 * Look a key up in `locale`, falling back to English, then to the key itself.
 * The key-as-last-resort never fires in practice (TranslationKey is `keyof typeof
 * en`, so TypeScript rejects unknown keys at compile time) — it exists so a
 * dictionary hole can never render as a blank string.
 */
export function translate(locale: Locale, key: TranslationKey, vars?: TranslationVars): string {
  const template = DICTIONARIES[locale]?.[key] ?? en[key] ?? key;
  return interpolate(template, vars);
}

// ---- The store -----------------------------------------------------------
// Module-level so every subscriber sees the same locale and re-renders together.

let currentLocale: Locale = DEFAULT_LOCALE;
let hydrated = false;

function ensureHydrated(): Locale {
  if (!hydrated) {
    currentLocale = readLocalePref();
    hydrated = true;
  }
  return currentLocale;
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Locale {
  return ensureHydrated();
}

/** The locale in effect right now, outside React (announcers, imperative helpers). */
export function getLocale(): Locale {
  return ensureHydrated();
}

/** Persist + apply + notify every subscriber. */
export function setLocale(next: Locale): void {
  ensureHydrated();
  if (next === currentLocale) return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* storage unavailable — the in-memory value below still switches the UI */
  }
  currentLocale = next;
  applyLocale(next);
  listeners.forEach((fn) => fn());
}

// ---- Dates & numbers -----------------------------------------------------
// The dictionary holds words; Intl holds formats. Every `toLocaleDateString` /
// `toLocaleTimeString` call in the app routes through here so a Dutch cockpit
// reads "ma 4 aug 2026" instead of "Mon, 4 Aug 2026".
const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', nl: 'nl-NL' };

/** The BCP-47 tag to hand to Intl / toLocaleDateString for the given locale
 *  (defaults to the locale in effect). Components that call `useT()` re-render on
 *  a locale switch, so reading the current locale here stays in sync. */
export function intlLocale(locale: Locale = getLocale()): string {
  return INTL_LOCALE[locale];
}

/** Non-reactive translate, for code that runs outside a component (e.g. the
 *  planner's aria-live announcement builders). Components must use `useT()` so
 *  they re-render when the locale flips. */
export function translateNow(key: TranslationKey, vars?: TranslationVars): string {
  return translate(getLocale(), key, vars);
}

/**
 * useLocale — the Settings switch's hook, shaped like `useTheme()`.
 *   locale    — the current locale ('en' | 'nl')
 *   setLocale — persist a new locale, repaint <html lang>, re-render every consumer
 */
export function useLocale(): { locale: Locale; setLocale: (next: Locale) => void } {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { locale, setLocale };
}

/**
 * useT — the translation hook every component uses.
 *   const t = useT();
 *   <span>{t('common.save')}</span>
 *   <span>{t('settings.movedTo', { label, position: 2, total: 7 })}</span>
 */
export function useT(): TFunction {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return useCallback((key: TranslationKey, vars?: TranslationVars) => translate(locale, key, vars), [locale]);
}
