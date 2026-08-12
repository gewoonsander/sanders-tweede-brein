import { useMemo, useRef, useState } from 'react';
import { Activity, CheckCircle2, CircleAlert, CircleDashed, Plug, RefreshCw, ShieldAlert, Wrench } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { cockpitWrite } from '../lib/useCockpitWrite';
import type { IntegrationItem, IntegrationsResponse, OverallStatus } from '../lib/integrations';
import { ConnectionsView } from './ConnectionsView';
import { StackView } from './StackView';
import './integrations.css';

const STATUS: Record<OverallStatus, { label: string; icon: typeof Activity }> = {
  working: { label: 'Werkend', icon: CheckCircle2 },
  action_needed: { label: 'Actie nodig', icon: CircleAlert },
  broken: { label: 'Verbroken', icon: ShieldAlert },
  planned: { label: 'Gepland', icon: CircleDashed },
  not_checked: { label: 'Niet gecontroleerd', icon: CircleDashed },
  paused: { label: 'Gepauzeerd', icon: CircleDashed },
  retired: { label: 'Gestopt', icon: CircleDashed },
};

const DATA_ROLE = {
  source: 'Bron', destination: 'Bestemming', processor: 'Verwerking',
  presentation: 'Presentatie', vault: 'Kluis',
} as const;
const SYNC_DIRECTION = {
  none: 'Geen', import: 'Import naar myPKA', export: 'Export vanuit myPKA',
  bidirectional: 'Tweerichtingsvoorstel',
} as const;
const CONFLICT_POLICY = {
  'canonical-wins': 'Canonieke bron wint', 'manual-review': 'Handmatig beoordelen',
} as const;

export function IntegrationsView() {
  const [revision, setRevision] = useState(0);
  const { data, loading, error } = useFetch<IntegrationsResponse>(`/api/cockpit/integrations?r=${revision}`);
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [checking, setChecking] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkError, setCheckError] = useState('');
  const connectPanel = useRef<HTMLDetailsElement>(null);
  const technicalPanel = useRef<HTMLDetailsElement>(null);

  const items = useMemo(() => (data?.integrations ?? []).filter((item) =>
    (kind === 'all' || item.kind === kind) && (status === 'all' || item.overallStatus === status),
  ), [data, kind, status]);

  const checked = data?.integrations.filter((x) => x.overallStatus === 'working').length ?? 0;
  const total = data?.integrations.length ?? 0;
  const progress = total ? Math.round((checked / total) * 100) : 0;

  const runChecks = async (integrationId?: string) => {
    setChecking(true); setCheckError('');
    setCheckingId(integrationId ?? null);
    const body = integrationId ? { integrationIds: [integrationId] } : {};
    const result = await cockpitWrite<IntegrationsResponse>('/api/cockpit/integrations/check', 'POST', body);
    if (result.kind === 'ok') setRevision((x) => x + 1);
    else setCheckError(result.kind === 'auth' ? 'Je sessie is verlopen.' : 'De veilige controle kon niet worden voltooid.');
    setChecking(false); setCheckingId(null);
  };

  const reveal = (panel: React.RefObject<HTMLDetailsElement>) => {
    if (!panel.current) return;
    panel.current.open = true;
    panel.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panel.current.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
  };

  if (loading) return <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>;
  if (error || !data) return <p className="view-error">Het koppelingendashboard kon niet laden. {error || ''}</p>;

  return (
    <div className="intg">
      <header className="intg-head">
        <div>
          <h1><Activity size={23} aria-hidden="true" /> Koppelingen &amp; software</h1>
          <p>Verwachting uit GL-018, gecombineerd met secretvrij bewijs op <strong>{data.machine.label}</strong>.</p>
        </div>
        <button className="intg-check" type="button" onClick={() => runChecks()} disabled={checking}>
          <RefreshCw size={16} className={checking ? 'is-spinning' : ''} aria-hidden="true" />
          {checking ? 'Controleren…' : 'Nu veilig controleren'}
        </button>
      </header>

      {checkError && <p className="intg-error" role="alert">{checkError}</p>}

      <section className="intg-summary" aria-label="Samenvatting koppelingen">
        <div className="intg-progress"><strong>{progress}%</strong><span>bewezen werkend</span></div>
        {(Object.keys(STATUS) as OverallStatus[]).map((key) => (
          <div className={`intg-stat intg-status--${key}`} key={key}>
            <strong>{data.summary[key] ?? 0}</strong><span>{STATUS[key].label}</span>
          </div>
        ))}
      </section>

      <div className="intg-filters">
        <label>Type<select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="all">Alle typen</option><option value="mcp">MCP</option><option value="api">API</option>
          <option value="webhook">Webhook</option><option value="data-source">Databron</option><option value="software">Software</option>
        </select></label>
        <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Alle statussen</option>
          {(Object.keys(STATUS) as OverallStatus[]).map((key) => <option key={key} value={key}>{STATUS[key].label}</option>)}
        </select></label>
      </div>

      <div className="intg-grid">
        {items.map((item) => <IntegrationCard
          key={item.integrationId}
          item={item}
          checking={checkingId === item.integrationId}
          onCheck={() => runChecks(item.integrationId)}
          onConnect={() => reveal(connectPanel)}
          onDetails={() => reveal(technicalPanel)}
        />)}
      </div>
      {!items.length && <p className="intg-empty">Geen koppelingen passen bij deze filters.</p>}

      <details className="intg-panel" ref={connectPanel}>
        <summary><Plug size={18} aria-hidden="true" /> Software koppelen of herstellen</summary>
        <div className="intg-panel-body"><ConnectionsView embedded /></div>
      </details>

      <details className="intg-panel" ref={technicalPanel}>
        <summary><Wrench size={18} aria-hidden="true" /> Technische details: sleutels en MCP-servers</summary>
        <div className="intg-panel-body"><StackView embedded /></div>
      </details>
    </div>
  );
}

function IntegrationCard({ item, checking, onCheck, onConnect, onDetails }: {
  item: IntegrationItem;
  checking: boolean;
  onCheck: () => void;
  onConnect: () => void;
  onDetails: () => void;
}) {
  const meta = STATUS[item.overallStatus];
  const Icon = meta.icon;
  const latest = item.observations.reduce<string | null>((value, row) => !value || row.checked_at > value ? row.checked_at : value, null);
  return (
    <article className={`intg-card intg-status--${item.overallStatus}`}>
      <div className="intg-card-top">
        <span className="intg-kind">{item.kind}</span>
        <span className="intg-badge"><Icon size={14} aria-hidden="true" />{meta.label}</span>
      </div>
      <h2>{item.name}</h2>
      <p>{item.purpose}</p>
      <dl>
        <div><dt>Eigenaar</dt><dd>{item.owner}</dd></div>
        <div><dt>Rol</dt><dd>{DATA_ROLE[item.dataRole]}</dd></div>
        <div><dt>Richting</dt><dd>{SYNC_DIRECTION[item.syncDirection]}</dd></div>
        <div><dt>Conflict</dt><dd>{CONFLICT_POLICY[item.conflictPolicy]}</dd></div>
        <div><dt>Kosten</dt><dd>{item.costModel}</dd></div>
        <div><dt>Apparaten</dt><dd>{item.expectedDevices.join(', ') || 'n.v.t.'}</dd></div>
        <div><dt>Laatste controle</dt><dd>{latest ? new Date(latest).toLocaleString('nl-NL') : 'nog niet'}</dd></div>
      </dl>
      {item.observations.length > 0 && (
        <details><summary>Controlebewijs ({item.observations.length})</summary>
          <ul>{item.observations.map((row) => <li key={row.probe_id}><code>{row.probe_id}</code> — {row.status} · {row.evidence_code}</li>)}</ul>
        </details>
      )}
      <div className="intg-next"><strong>Volgende actie</strong><span>{item.nextAction}</span></div>
      {item.overallStatus === 'not_checked' ? (
        <button className="intg-action" type="button" onClick={onCheck} disabled={checking}>
          <RefreshCw size={16} className={checking ? 'is-spinning' : ''} aria-hidden="true" />
          {checking ? 'Controleren…' : 'Nu controleren'}
        </button>
      ) : item.overallStatus === 'planned' ? (
        <button className="intg-action" type="button" onClick={onConnect}><Plug size={16} aria-hidden="true" />Koppelen</button>
      ) : item.overallStatus === 'action_needed' ? (
        <button className="intg-action" type="button" onClick={onConnect}><Wrench size={16} aria-hidden="true" />Aansluiting voltooien</button>
      ) : item.overallStatus === 'broken' ? (
        <button className="intg-action intg-action--urgent" type="button" onClick={onConnect}><Wrench size={16} aria-hidden="true" />Probleem oplossen</button>
      ) : (
        <button className="intg-action intg-action--secondary" type="button" onClick={onDetails}>Details bekijken</button>
      )}
    </article>
  );
}
