// SettingsView.tsx — runtime cockpit settings (Hub-module toggles + reorder).
//
// Two independent controls per module:
//   1. A real <button role="switch" aria-checked> — show/hide the section on the
//      Hub (Space/Enter, screen-reader-announced, focus-ringed).
//   2. Up/Down move buttons — reorder where the section sits on the Hub. The Hub
//      renders modules in this saved order. Reordering never changes visibility,
//      and toggling never changes order — the two write paths are independent.
//
// State persists to mypka-cockpit.db (module_prefs table) through GET/PUT
// /api/cockpit/settings — the SAME local-write pattern as the planner's settings,
// so it survives a mypka.db regen and never touches canonical markdown. Default:
// everything ON, catalogue order.
//
// ACCESSIBILITY: reorder is keyboard-first. Each move button is a real <button>
// (Tab to reach, Space/Enter to activate), labelled with where it moves the
// module ("Move Open Invoices up"), and disabled at the list ends (aria-disabled
// via the native `disabled` attr). After a move, focus follows the moved row's
// button so a keyboard user can move the same item again without re-Tabbing.
// An aria-live region announces the new position. No drag is required.
import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, Check, ChevronUp, ChevronDown, Sun, Moon, Monitor, Languages } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import {
  saveModulePrefs,
  saveModuleOrder,
  type CockpitSettingsResponse,
  type ModuleCatalogueEntry,
} from '../lib/cockpitExtras';
import { useTheme, type ThemePref } from '../lib/theme';
import { useT, useLocale, type Locale, type TranslationKey } from '../lib/i18n';
import { PageHeader } from '../components/PageHeader';
import './settings.css';

export function SettingsView() {
  const t = useT();
  const { data, loading, error } = useFetch<CockpitSettingsResponse>('/api/cockpit/settings');
  // Theme is a client-only presentation preference (localStorage; applied pre-paint
  // by the index.html bootstrap). The hook here drives the switch + keeps the live
  // System listener owned at the shell level (App.tsx) in sync.
  const { pref: themePref, resolved: themeResolved, setPref: setThemePref } = useTheme();
  // Language is the SAME kind of preference as theme: client-only, localStorage,
  // applied pre-paint by /theme-bootstrap.js. Deliberately NOT part of the
  // /api/cockpit/settings round-trip — this page promises "saved on this machine
  // only", and a fetch would resolve after first paint (flash of the wrong copy).
  const { locale, setLocale } = useLocale();

  // Local working copies, seeded from the fetch and updated optimistically.
  const [modules, setModules] = useState<Record<string, boolean>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [liveMsg, setLiveMsg] = useState<string>('');

  // Refs to each row's up button so we can move focus to the row after a move.
  const moveBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // After a move, the key whose move-button should regain focus once re-rendered.
  const refocusKey = useRef<string | null>(null);
  const refocusDir = useRef<'up' | 'down'>('up');

  useEffect(() => {
    if (data?.modules) setModules(data.modules);
    if (data?.order) setOrder(data.order);
  }, [data]);

  // Move focus back to the moved row's button after the reorder re-renders.
  useEffect(() => {
    if (!refocusKey.current) return;
    const btn = moveBtnRefs.current[`${refocusKey.current}:${refocusDir.current}`];
    if (btn && !btn.disabled) {
      btn.focus();
    } else {
      // Button became disabled (moved to an end) — focus the opposite control.
      const alt = moveBtnRefs.current[`${refocusKey.current}:${refocusDir.current === 'up' ? 'down' : 'up'}`];
      alt?.focus();
    }
    refocusKey.current = null;
  }, [order]);

  // Build the rendered rows: catalogue entries indexed by key, ordered by `order`.
  // Guarded — when the settings fetch is still loading or failed, `data` is null
  // and the Hub-modules section renders its own loading/error state; the Theme
  // section (client-only) is unaffected and always available.
  const byKey = new Map<string, ModuleCatalogueEntry>((data?.catalogue ?? []).map((m) => [m.key, m]));
  const rows = order
    .map((key) => byKey.get(key))
    .filter((m): m is ModuleCatalogueEntry => m != null);

  const themeOptions: { value: ThemePref; labelKey: TranslationKey; icon: typeof Sun }[] = [
    { value: 'light', labelKey: 'settings.themeLight', icon: Sun },
    { value: 'dark', labelKey: 'settings.themeDark', icon: Moon },
    { value: 'system', labelKey: 'settings.themeSystem', icon: Monitor },
  ];

  // Language labels are ENDONYMS on purpose — "Nederlands" reads "Nederlands" in
  // the English UI too, the way every real language switcher does it. They live in
  // the dictionary (identical in both locales) so they stay editable in one place.
  const localeOptions: { value: Locale; labelKey: TranslationKey }[] = [
    { value: 'en', labelKey: 'settings.languageEnglish' },
    { value: 'nl', labelKey: 'settings.languageDutch' },
  ];

  function surfaceSaveError(kind: string, message?: string) {
    setSaveState('error');
    setSaveError(
      kind === 'disabled'
        ? t('settings.errDisabled')
        : kind === 'auth'
          ? t('settings.errAuth')
          // A server-supplied message is passed through verbatim: it comes from the
          // Express layer, which is English-only for now (see the i18n scope note).
          : kind === 'error' && message
            ? message
            : t('settings.errGeneric'),
    );
  }

  async function toggle(key: string) {
    const next = { ...modules, [key]: !modules[key] };
    setModules(next); // optimistic
    setSaveState('saving');
    setSaveError(null);
    const result = await saveModulePrefs({ [key]: next[key] });
    if (result.kind === 'ok') {
      setModules(result.data.modules); // authoritative server map
      setSaveState('saved');
      window.setTimeout(() => setSaveState('idle'), 1600);
    } else {
      setModules((m) => ({ ...m, [key]: !next[key] })); // revert
      surfaceSaveError(result.kind, result.kind === 'error' ? result.message : undefined);
    }
  }

  async function move(key: string, dir: 'up' | 'down') {
    const i = order.indexOf(key);
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= order.length) return; // at an end — no-op

    const prev = order;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]]; // swap with neighbour
    setOrder(next); // optimistic
    refocusKey.current = key; // keep focus on the moved row after re-render
    refocusDir.current = dir;

    const label = byKey.get(key)?.label ?? key;
    setLiveMsg(
      t(dir === 'up' ? 'settings.movedUp' : 'settings.movedDown', {
        label,
        position: j + 1,
        total: next.length,
      }),
    );
    setSaveState('saving');
    setSaveError(null);

    const result = await saveModuleOrder(next);
    if (result.kind === 'ok') {
      setOrder(result.data.order); // authoritative server order
      setSaveState('saved');
      window.setTimeout(() => setSaveState('idle'), 1600);
    } else {
      setOrder(prev); // revert
      surfaceSaveError(result.kind, result.kind === 'error' ? result.message : undefined);
    }
  }

  return (
    <div className="settings">
      <PageHeader
        title={t('settings.title')}
        icon={SlidersHorizontal}
        subtitle={t('settings.subtitle')}
      />

      {/* ---- Appearance: theme + UI language --------------------------------
          Two rows, one section, one visual language: both are segmented radiogroups
          reusing .theme-segmented / .theme-option (no new tokens, no new CSS). Both
          are client-only preferences persisted to localStorage and applied
          pre-paint by /theme-bootstrap.js. */}
      <section className="settings-section" aria-labelledby="settings-appearance">
        <h2 className="settings-section-title" id="settings-appearance">{t('settings.appearance')}</h2>
        <div className="settings-row settings-row--theme">
          <div className="settings-row-text">
            <span className="settings-row-label">{t('settings.theme')}</span>
            <span className="settings-row-hint">
              {themePref === 'system'
                ? t('settings.themeHintSystem', {
                    theme: t(themeResolved === 'light' ? 'settings.themeValueLight' : 'settings.themeValueDark'),
                  })
                : t('settings.themeHintFixed', {
                    theme: t(themePref === 'light' ? 'settings.themeValueLight' : 'settings.themeValueDark'),
                  })}
            </span>
          </div>
          <div
            className="theme-segmented"
            role="radiogroup"
            aria-label={t('settings.themeAria')}
          >
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = themePref === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className="theme-option"
                  data-active={active}
                  onClick={() => setThemePref(opt.value)}
                >
                  <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                  <span>{t(opt.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="settings-row settings-row--theme">
          <div className="settings-row-text">
            <span className="settings-row-label">{t('settings.language')}</span>
            <span className="settings-row-hint">{t('settings.languageHint')}</span>
          </div>
          <div
            className="theme-segmented"
            role="radiogroup"
            aria-label={t('settings.languageAria')}
          >
            {localeOptions.map((opt) => {
              const active = locale === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className="theme-option"
                  data-active={active}
                  // lang on the option itself: a screen reader then pronounces
                  // "Nederlands" with Dutch phonetics inside the English UI.
                  lang={opt.value}
                  onClick={() => setLocale(opt.value)}
                >
                  <Languages size={15} strokeWidth={1.5} aria-hidden="true" />
                  <span>{t(opt.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {loading && (
        <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>
      )}
      {(error || !data) && !loading && (
        <p className="view-error">{t('settings.hubLoadError')} {error || ''}</p>
      )}

      {data && (
      <section className="settings-section" aria-labelledby="settings-hub-modules">
        <h2 className="settings-section-title" id="settings-hub-modules">{t('settings.hubModules')}</h2>
        <ol className="settings-list">
          {rows.map((m, idx) => {
            const enabled = modules[m.key] ?? true;
            const isFirst = idx === 0;
            const isLast = idx === rows.length - 1;
            return (
              <li className="settings-row" key={m.key}>
                {/* m.label / m.hint come from the SERVER module catalogue and are
                    English-only for now — see the i18n scope note in lib/i18n/en.ts. */}
                <div className="settings-reorder" role="group" aria-label={t('settings.reorderAria', { label: m.label })}>
                  <button
                    type="button"
                    className="settings-move"
                    ref={(el) => { moveBtnRefs.current[`${m.key}:up`] = el; }}
                    onClick={() => move(m.key, 'up')}
                    disabled={isFirst}
                    aria-label={t('settings.moveUp', { label: m.label })}
                  >
                    <ChevronUp size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="settings-move"
                    ref={(el) => { moveBtnRefs.current[`${m.key}:down`] = el; }}
                    onClick={() => move(m.key, 'down')}
                    disabled={isLast}
                    aria-label={t('settings.moveDown', { label: m.label })}
                  >
                    <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
                <div className="settings-row-text">
                  <span className="settings-row-label">{m.label}</span>
                  <span className="settings-row-hint">{m.hint}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={t(enabled ? 'settings.moduleShown' : 'settings.moduleHidden', { label: m.label })}
                  className="settings-switch"
                  data-on={enabled}
                  onClick={() => toggle(m.key)}
                >
                  <span className="settings-switch-track" aria-hidden="true">
                    <span className="settings-switch-thumb" />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="settings-status" role="status" aria-live="polite">
          {saveState === 'saving' && <span className="settings-status-saving">{t('settings.saving')}</span>}
          {saveState === 'saved' && (
            <span className="settings-status-saved">
              <Check size={14} strokeWidth={2} aria-hidden="true" /> {t('settings.saved')}
            </span>
          )}
          {saveState === 'error' && saveError && (
            <span className="settings-status-error">{saveError}</span>
          )}
        </div>

        {/* Dedicated reorder announcer — separate from the save status so a move
            announcement isn't clobbered by "Saving…/Saved". */}
        <div className="sr-only" role="status" aria-live="polite">{liveMsg}</div>
      </section>
      )}
    </div>
  );
}
