// ConnectionsView.tsx — connect your task / project / calendar tools.
//
// ONE GENERIC FLOW, no tool gets a privileged box:
//   * "Connected" — whatever is currently live (or stored awaiting wiring).
//   * "Connect a tool" — type the tool's name. If the cockpit ships a connector
//     for it (matched against the registry), its exact key fields appear. Any
//     other name falls through to the universal path: store the key under a
//     derived name, then ask your LLM assistant to write the connector — it
//     references the key by NAME only and never sees the value.
// Keys are stored once in `Team Knowledge/.env` on this machine (0600, never
// echoed back, no read-back endpoint). Everything pulled in is read-only, with
// a deep link back to the tool for editing.
import { useCallback, useMemo, useState } from 'react';
import {
  ArrowRight, CalendarDays, Check, CircleDashed, Copy, KeyRound, ListTodo, Mail, Plug, Sparkles, Terminal, Trash2,
} from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { useT, type TranslationKey } from '../lib/i18n';
import { useTNodes } from '../lib/i18n/rich';
import { cockpitWrite } from '../lib/useCockpitWrite';
import {
  clearConnectorKey, saveConnectorKey,
  type ConnectorInfo, type ConnectorsResponse,
} from '../lib/connectors';
import './connections.css';

export function ConnectionsView() {
  const t = useT();
  const tn = useTNodes();
  const [refresh, setRefresh] = useState(0);
  const { data, loading, error } = useFetch<ConnectorsResponse>(`/api/cockpit/connectors?r=${refresh}`);
  const reload = useCallback(() => setRefresh((n) => n + 1), []);

  if (loading) {
    return (
      <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>
    );
  }
  if (error || !data) return <p className="view-error">{t('cnx.loadError')} {error || ''}</p>;

  const connected = data.connectors.filter((c) => c.configured);
  const customKeys = data.customKeys ?? [];

  return (
    <div className="cnx">
      <header className="cnx-head">
        <h1 className="cnx-title"><Plug size={22} strokeWidth={1.5} aria-hidden="true" /> {t('cnx.title')}</h1>
        <p className="cnx-sub">
          {tn('cnx.sub', {
            path: <span className="font-mono">{data.envPath}</span>,
            readOnly: <strong>{t('cnx.readOnly')}</strong>,
          })}
        </p>
      </header>

      <CoverageStrip connectors={data.connectors} />

      {(connected.length > 0 || customKeys.length > 0) && (
        <section className="cnx-section">
          <h2 className="cnx-section-title">{t('cnx.connected')}</h2>
          <div className="cnx-connected">
            {connected.map((c) => (
              <ConnectedCard key={c.id} connector={c} onChanged={reload} />
            ))}
            {customKeys.map((k) => (
              <StoredKeyCard key={k} envKey={k} onChanged={reload} />
            ))}
          </div>
          {/* Visible whenever at least one stored key awaits its connector OR at
              least one connector is configured — i.e. exactly when this section
              renders. The hand-off references keys by NAME only, never values. */}
          <WireAssistantCard />
        </section>
      )}

      <section className="cnx-section">
        <h2 className="cnx-section-title">{t('cnx.connectATool')}</h2>
        <ConnectCard connectors={data.connectors} onChanged={reload} />
      </section>
    </div>
  );
}

// ---- Coverage: do you have each basic surface connected? --------------------------
// Per the owner's spec: call it out when at least one CALENDAR connection or at
// least one TASK/PM tool is missing (email shown as the third, optional lane).
function CoverageStrip({ connectors }: { connectors: ConnectorInfo[] }) {
  const t = useT();
  const has = (cat: ConnectorInfo['category']) =>
    connectors.some((c) => c.category === cat && c.configured);
  const lanes: { cat: ConnectorInfo['category']; icon: typeof ListTodo; labelKey: TranslationKey; missingKey: TranslationKey }[] = [
    { cat: 'tasks', icon: ListTodo, labelKey: 'cnx.laneTasks', missingKey: 'cnx.laneTasksMissing' },
    { cat: 'calendar', icon: CalendarDays, labelKey: 'cnx.laneCalendar', missingKey: 'cnx.laneCalendarMissing' },
    { cat: 'email', icon: Mail, labelKey: 'cnx.laneEmail', missingKey: 'cnx.laneEmailMissing' },
  ];
  const anyMissing = lanes.some((l) => !has(l.cat));
  if (!anyMissing) return null;
  return (
    <div className="cnx-coverage" role="status">
      {lanes.map(({ cat, icon: Icon, labelKey, missingKey }) => {
        const okHere = has(cat);
        return (
          <div key={cat} className={`cnx-coverage-lane ${okHere ? 'is-ok' : ''}`}>
            {okHere
              ? <Check size={14} strokeWidth={2} aria-hidden="true" />
              : <CircleDashed size={14} strokeWidth={1.5} aria-hidden="true" />}
            <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
            <span className="cnx-coverage-label">{t(labelKey)}</span>
            {!okHere && <span className="cnx-coverage-note">{t(missingKey)}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ---- Connected state -------------------------------------------------------------

function ConnectedCard({ connector, onChanged }: { connector: ConnectorInfo; onChanged: () => void }) {
  const t = useT();
  const Icon = connector.kind === 'calendar' ? CalendarDays : ListTodo;
  const disconnect = useCallback(async () => {
    // Removing every stored key fully disconnects the tool.
    for (const k of connector.keys) {
      if (k.configured) await clearConnectorKey(k.key);
    }
    onChanged();
  }, [connector, onChanged]);

  return (
    <div className="cnx-conn">
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" className="cnx-conn-icon" />
      <div className="cnx-conn-text">
        <span className="cnx-conn-name">{connector.label}</span>
        <span className="cnx-conn-meta">
          {t('cnx.metaReadOnly', { kind: t(connector.kind === 'calendar' ? 'cnx.kindCalendar' : 'cnx.kindTasks') })}
        </span>
      </div>
      <span className="cnx-badge"><Check size={12} strokeWidth={2} aria-hidden="true" /> {t('cnx.live')}</span>
      <button
        type="button"
        className="cnx-clear"
        onClick={disconnect}
        aria-label={t('cnx.disconnect', { label: connector.label })}
      >
        <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

// A key stored via the universal path, no connector module yet — the visible
// "awaiting wiring" state so a half-connected tool never disappears.
function StoredKeyCard({ envKey, onChanged }: { envKey: string; onChanged: () => void }) {
  const t = useT();
  const tn = useTNodes();
  const remove = useCallback(async () => {
    const res = await clearConnectorKey(envKey);
    if (res.kind === 'ok') onChanged();
  }, [envKey, onChanged]);

  return (
    <div className="cnx-conn cnx-conn--pending">
      <KeyRound size={16} strokeWidth={1.5} aria-hidden="true" className="cnx-conn-icon" />
      <div className="cnx-conn-text">
        <span className="cnx-conn-name font-mono">{envKey}</span>
        <span className="cnx-conn-meta">
          {/* The quoted sentence is the literal prompt the user pastes to an AI
              assistant — it stays ENGLISH in both locales on purpose. */}
          {tn('cnx.keyStoredAsk', { quote: <em>{t('cnx.keyStoredQuote', { key: envKey })}</em> })}
        </span>
      </div>
      <span className="cnx-badge cnx-badge--pending">{t('cnx.awaitingConnector')}</span>
      <button
        type="button"
        className="cnx-clear"
        onClick={remove}
        aria-label={t('cnx.remove', { label: envKey })}
      >
        <Trash2 size={13} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

// ---- Wire-assistant hand-off -------------------------------------------------------
// POST /api/cockpit/connectors/wire-assistant: the server writes a self-contained
// wiring brief (key NAMES only, never values) and — on macOS — opens Terminal with
// the user's Claude CLI pointed at it. Elsewhere (launched:false) we surface the
// exact command to copy-run manually. Rides the standard write stack, so a 503
// 'disabled' degrades to the calm read-only notice, never an alarm.

interface WireAssistantResult {
  ok: true;
  launched: boolean;
  command: string;
  requestPath: string;
}

function WireAssistantCard() {
  const t = useT();
  const [state, setState] = useState<'idle' | 'working' | 'launched' | 'manual' | 'disabled' | 'error'>('idle');
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const run = useCallback(async () => {
    setState('working');
    setCopied(false);
    const res = await cockpitWrite<WireAssistantResult>('/api/cockpit/connectors/wire-assistant', 'POST');
    if (res.kind === 'ok') {
      if (res.data.launched) {
        setState('launched');
      } else {
        setCommand(res.data.command);
        setState('manual');
      }
    } else if (res.kind === 'disabled') {
      setState('disabled');
    } else {
      setMessage(res.kind === 'error' ? res.message : t('cnx.wireError'));
      setState('error');
    }
  }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / non-secure context) — the <code>
      // block stays selectable, so manual copy still works. No alarm.
    }
  }, [command]);

  return (
    <div className="cnx-wire">
      <button
        type="button"
        className="cnx-save cnx-save--wide"
        onClick={run}
        disabled={state === 'working'}
      >
        <Terminal size={14} strokeWidth={1.5} aria-hidden="true" />
        {t(state === 'working' ? 'cnx.preparing' : 'cnx.letClaudeWire')}
      </button>
      <p className="cnx-hint cnx-wire-hint">{t('cnx.wireHint')}</p>

      {state === 'launched' && (
        <p className="cnx-ok" role="status">{t('cnx.terminalOpened')}</p>
      )}
      {state === 'manual' && (
        <div className="cnx-wire-manual" role="status">
          <p className="cnx-hint">{t('cnx.runThis')}</p>
          <div className="cnx-wire-cmdrow">
            <code className="cnx-wire-code">{command}</code>
            <button
              type="button"
              className="cnx-wire-copy"
              onClick={copy}
              aria-label={t(copied ? 'cnx.copied' : 'cnx.copyCommand')}
              title={t(copied ? 'cnx.copied' : 'cnx.copyCommand')}
            >
              {copied
                ? <Check size={13} strokeWidth={2} aria-hidden="true" />
                : <Copy size={13} strokeWidth={1.5} aria-hidden="true" />}
            </button>
          </div>
        </div>
      )}
      {state === 'disabled' && (
        <p className="cnx-hint" role="status">{t('cnx.wireDisabled')}</p>
      )}
      {state === 'error' && <p className="cnx-error" role="alert">{message}</p>}
    </div>
  );
}

// ---- The one generic connect flow ---------------------------------------------------

function ConnectCard({ connectors, onChanged }: { connectors: ConnectorInfo[]; onChanged: () => void }) {
  const t = useT();
  const tn = useTNodes();
  const [tool, setTool] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [savedAs, setSavedAs] = useState('');

  // Match the typed name against the shipped connectors (label or id, fuzzy).
  const match = useMemo(() => {
    const q = tool.trim().toLowerCase();
    if (!q) return null;
    return connectors.find((c) =>
      c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      || q.includes(c.id.split(':')[0])) ?? null;
  }, [tool, connectors]);

  // Universal path: derive a clean env-key name from the tool name.
  const derivedKey = useMemo(() => {
    const base = tool.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return base ? `${base}_API_KEY`.slice(0, 64) : '';
  }, [tool]);

  const fields: { key: string; label: string; secret: boolean }[] = match
    ? match.keys.map((k) => ({ key: k.key, label: k.label, secret: k.secret }))
    : derivedKey
      ? [{ key: derivedKey, label: t('cnx.genericFieldLabel'), secret: true }]
      : [];

  const ready = fields.length > 0 && fields.every((f) => (values[f.key] ?? '').trim());

  const save = useCallback(async () => {
    if (!ready) return;
    setState('saving');
    for (const f of fields) {
      const res = await saveConnectorKey(f.key, values[f.key]);
      if (res.kind !== 'ok') {
        setState('error');
        setMessage(res.kind === 'disabled'
          ? t('cnx.writesDisabled')
          : res.kind === 'error' ? res.message : t('cnx.saveKeyError'));
        return;
      }
    }
    setSavedAs(match ? match.label : derivedKey);
    setValues({});
    setTool('');
    setState('saved');
    onChanged();
  }, [ready, fields, values, match, derivedKey, onChanged]);

  return (
    <div className="cnx-card">
      <label className="cnx-keylabel" htmlFor="cnx-tool">
        {t('cnx.whichTool')}
      </label>
      <div className="cnx-toolrow">
        <input
          id="cnx-tool"
          className="cnx-input"
          type="text"
          autoComplete="off"
          list="cnx-known-tools"
          placeholder={t('cnx.toolPlaceholder')}
          value={tool}
          onChange={(e) => { setTool(e.target.value); setState('idle'); }}
        />
        <datalist id="cnx-known-tools">
          {connectors.map((c) => <option key={c.id} value={c.label} />)}
        </datalist>
      </div>

      {match && (
        <p className="cnx-hint cnx-hint--ready">
          <Sparkles size={13} strokeWidth={1.5} aria-hidden="true" />
          {/* match.help comes from the server connector registry — English-only for now. */}
          {t(match.keys.length === 1 ? 'cnx.builtInOne' : 'cnx.builtInOther', { help: match.help })}
        </p>
      )}
      {!match && derivedKey && (
        <p className="cnx-hint">
          {tn('cnx.noBuiltIn', {
            key: <span className="font-mono">{derivedKey}</span>,
            // Literal assistant prompt — English in both locales by design.
            quote: <em>{t('cnx.noBuiltInQuote', { tool: tool.trim(), key: derivedKey })}</em>,
          }, { tool: tool.trim() })}
        </p>
      )}

      {fields.map((f) => (
        <div className="cnx-keyrow" key={f.key}>
          <label className="cnx-keylabel" htmlFor={`cnx-${f.key}`}>
            {f.label}
            <span className="cnx-keyname font-mono">{f.key}</span>
          </label>
          <input
            id={`cnx-${f.key}`}
            className="cnx-input"
            type={f.secret ? 'password' : 'text'}
            autoComplete="off"
            placeholder={t(f.secret ? 'cnx.secretPlaceholder' : 'cnx.valuePlaceholder')}
            value={values[f.key] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          />
        </div>
      ))}

      {fields.length > 0 && (
        <button type="button" className="cnx-save cnx-save--wide" onClick={save} disabled={!ready || state === 'saving'}>
          {state === 'saving' ? t('common.saving') : t(match ? 'cnx.connect' : 'cnx.storeKey')}
          <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}

      {state === 'saved' && (
        <p className="cnx-ok" role="status">
          {savedAs && /_API_KEY|_TOKEN|_URL/.test(savedAs)
            ? tn('cnx.keyStoredAs', { key: <span className="font-mono">{savedAs}</span> })
            : t('cnx.connectedNotice', { label: savedAs })}
        </p>
      )}
      {state === 'error' && <p className="cnx-error" role="alert">{message}</p>}
    </div>
  );
}
