import { useCallback, useId, useMemo, useRef, useState } from 'react';
import {
  Activity, CheckCircle2, ChevronRight, CircleAlert, CircleDashed, CircleHelp, CirclePause,
  CircleSlash, LayoutGrid, Plug, RefreshCw, Rows3, ShieldAlert, Wrench,
} from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { cockpitWrite } from '../lib/useCockpitWrite';
import type {
  IntegrationItem, IntegrationKind, IntegrationsResponse, IntegrationUsage,
  IntegrationUsageResponse, OverallStatus, UsageMeter,
} from '../lib/integrations';
import { IntegrationMark } from '../components/IntegrationMark';
import { ConnectionsView } from './ConnectionsView';
import { StackView } from './StackView';
import './integrations.css';

// Zes statuskleuren uit het ontwerp van 2026-08-11 (groen/oranje/rood/blauw/
// grijs/donkergrijs), plus `retired`. Elke status heeft een EIGEN glyph: kleur
// is nooit het enige signaal (WCAG 1.4.1) en in het compacte tabelbeeld staan
// zeven statussen onder elkaar die op één blik uit elkaar moeten vallen.
const STATUS: Record<OverallStatus, { label: string; icon: typeof Activity }> = {
  working: { label: 'Werkend', icon: CheckCircle2 },
  action_needed: { label: 'Actie nodig', icon: CircleAlert },
  broken: { label: 'Verbroken', icon: ShieldAlert },
  planned: { label: 'Gepland', icon: CircleDashed },
  not_checked: { label: 'Niet gecontroleerd', icon: CircleHelp },
  paused: { label: 'Gepauzeerd', icon: CirclePause },
  retired: { label: 'Gestopt', icon: CircleSlash },
};

// Eén bron voor de typelabels: gebruikt door het filter én door de Type-kolom.
const KIND_LABEL: Record<IntegrationKind, string> = {
  mcp: 'MCP',
  api: 'API',
  webhook: 'Webhook',
  'data-source': 'Databron',
  software: 'Software',
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

// Statussen waar niets aan te doen valt: dan blijft de actiekolom in de tabel
// leeg. Het vinkje in de statuskolom is het hele verhaal — precies zoals de
// referentie een verbonden connector alleen een vinkje geeft.
const SETTLED: ReadonlySet<OverallStatus> = new Set<OverallStatus>(['working', 'paused', 'retired']);

type ViewMode = 'table' | 'cards';
const VIEW_KEY = 'mypka-intg-view-v1';

/**
 * Onthoudt de gekozen weergave tussen sessies. Zelfde localStorage-patroon als
 * lib/useCollapsed.ts: valt stil terug op in-memory als opslag geweigerd wordt
 * (privémodus), zodat de pagina nooit op storage kan crashen.
 */
function useViewMode(): [ViewMode, (next: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === 'cards' ? 'cards' : 'table';
    } catch {
      return 'table';
    }
  });
  const choose = useCallback((next: ViewMode) => {
    setMode(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* opslag niet beschikbaar — keuze geldt alleen deze sessie */
    }
  }, []);
  return [mode, choose];
}

export function IntegrationsView() {
  const [revision, setRevision] = useState(0);
  const { data, loading, error } = useFetch<IntegrationsResponse>(`/api/cockpit/integrations?r=${revision}`);
  // Tegoedstand is een LOSSE read: valt de leverancier weg, dan mist alleen de
  // meter — de rest van de pagina blijft staan. Bij 'Nu veilig controleren'
  // (revision++) halen we hem vers op i.p.v. uit de servercache van 5 minuten.
  const { data: usageData } = useFetch<IntegrationUsageResponse>(
    `/api/cockpit/integrations/usage${revision ? `?refresh=1&r=${revision}` : ''}`,
  );
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [view, setView] = useViewMode();
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

      <div className="intg-toolbar">
        <div className="intg-filters">
          <label>Type<select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Alle typen</option>
            {(Object.keys(KIND_LABEL) as IntegrationKind[]).map((key) => (
              <option key={key} value={key}>{KIND_LABEL[key]}</option>
            ))}
          </select></label>
          <label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Alle statussen</option>
            {(Object.keys(STATUS) as OverallStatus[]).map((key) => <option key={key} value={key}>{STATUS[key].label}</option>)}
          </select></label>
        </div>
        <div className="intg-viewswitch" role="group" aria-label="Weergave">
          <button
            type="button" className="intg-viewbtn" aria-pressed={view === 'table'}
            onClick={() => setView('table')}
          >
            <Rows3 size={15} aria-hidden="true" />Lijst
          </button>
          <button
            type="button" className="intg-viewbtn" aria-pressed={view === 'cards'}
            onClick={() => setView('cards')}
          >
            <LayoutGrid size={15} aria-hidden="true" />Kaarten
          </button>
        </div>
      </div>

      {items.length > 0 && (view === 'table' ? (
        <IntegrationTable
          items={items}
          usage={usageData?.usage}
          checkingId={checkingId}
          onCheck={runChecks}
          onConnect={() => reveal(connectPanel)}
        />
      ) : (
        <div className="intg-grid">
          {items.map((item) => <IntegrationCard
            key={item.integrationId}
            item={item}
            usage={usageData?.usage[item.integrationId]}
            checking={checkingId === item.integrationId}
            onCheck={() => runChecks(item.integrationId)}
            onConnect={() => reveal(connectPanel)}
            onDetails={() => reveal(technicalPanel)}
          />)}
        </div>
      ))}
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

// ---------------------------------------------------------------------------
// Compacte lijstweergave (standaard)
// ---------------------------------------------------------------------------
// Een ECHTE <table>: 34 koppelingen × vier vergelijkbare velden is tabeldata,
// en een schermlezer krijgt er rij/kolom-navigatie en kolomkoppen bij cadeau.
// De kaart is niet weggegooid maar verhuisd naar twee plekken: de Kaarten-
// weergave (schakelaar hierboven) en de uitklap per rij, die exact hetzelfde
// detailblok toont. Zo is de tabel het overzicht en de kaart het detail —
// zonder dat één van beide een tweede, af te drijven kopie van de ander wordt.

function IntegrationTable({ items, usage, checkingId, onCheck, onConnect }: {
  items: IntegrationItem[];
  usage?: Record<string, IntegrationUsage>;
  checkingId: string | null;
  onCheck: (integrationId: string) => void;
  onConnect: () => void;
}) {
  return (
    // `tabIndex=0` + `role="region"` + label: de wrap is een scroll-container
    // (`overflow-x:auto`, integrations.css). Bij normale zoom is er nooit
    // overflow, maar bij 200-400% (WCAG 1.4.10 Reflow) kan de tabel wél
    // horizontaal gaan scrollen — en een scrollregio zonder tabstop is dan
    // onbereikbaar met het toetsenbord (SC 2.1.1). De focusring komt van de
    // globale `:focus-visible` in index.css en verschijnt dus alleen bij
    // toetsenbordfocus, niet bij een muisklik.
    <div
      className="intg-table-wrap"
      tabIndex={0}
      role="region"
      aria-label="Koppelingentabel, horizontaal scrollbaar"
    >
      <table className="intg-table">
        <caption className="sr-only">
          Koppelingen en software — {items.length} regels. Activeer een naam om de technische details uit te klappen.
        </caption>
        {/* De kolombreedtes horen bij `table-layout:fixed` (zie integrations.css):
            zonder colgroup zou de browser terugvallen op de min-content-breedte
            van de inhoud en de tabel breder maken dan zijn kader toelaat. */}
        <colgroup>
          <col className="intg-col-name" />
          <col className="intg-col-kind" />
          <col className="intg-col-status" />
          <col className="intg-col-action" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Koppeling</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col"><span className="sr-only">Actie</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <IntegrationRow
              key={item.integrationId}
              item={item}
              usage={usage?.[item.integrationId]}
              checking={checkingId === item.integrationId}
              onCheck={() => onCheck(item.integrationId)}
              onConnect={onConnect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntegrationRow({ item, usage, checking, onCheck, onConnect }: {
  item: IntegrationItem;
  usage?: IntegrationUsage;
  checking: boolean;
  onCheck: () => void;
  onConnect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const meta = STATUS[item.overallStatus];
  const Icon = meta.icon;
  // Alleen een randaccent waar er écht iets mis is (§2.3: hooguit één luid
  // moment per view). Werkende rijen blijven rustig — dat is de winst van de
  // compacte weergave.
  const alert = item.overallStatus === 'broken' ? ' intg-row--broken'
    : item.overallStatus === 'action_needed' ? ' intg-row--warn' : '';
  return (
    <>
      <tr className={`intg-row${alert}`}>
        <td className="intg-td-name">
          <button
            type="button"
            className="intg-row-toggle"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((x) => !x)}
          >
            <ChevronRight size={14} className={`intg-row-chevron${open ? ' is-open' : ''}`} aria-hidden="true" />
            <IntegrationMark integrationId={item.integrationId} name={item.name} />
            <span className="intg-row-title">{item.name}</span>
          </button>
        </td>
        <td className="intg-td-kind">{KIND_LABEL[item.kind]}</td>
        <td className="intg-td-status">
          <span className={`intg-state intg-state--${item.overallStatus}`}>
            <Icon size={15} aria-hidden="true" />
            <span className="intg-state-label">{meta.label}</span>
          </span>
        </td>
        <td className="intg-td-action">
          {!SETTLED.has(item.overallStatus) && (
            <IntegrationAction item={item} checking={checking} onCheck={onCheck} onConnect={onConnect} compact />
          )}
        </td>
      </tr>
      <tr className="intg-row-detail" id={detailId} hidden={!open}>
        <td colSpan={4}>
          <p className="intg-detail-purpose">{item.purpose}</p>
          <IntegrationDetails item={item} usage={usage} />
        </td>
      </tr>
    </>
  );
}

// ---------------------------------------------------------------------------
// Gedeelde bouwstenen — één bron voor kaart én uitgeklapte rij
// ---------------------------------------------------------------------------

function IntegrationDetails({ item, usage }: { item: IntegrationItem; usage?: IntegrationUsage }) {
  const latest = item.observations.reduce<string | null>(
    (value, row) => !value || row.checked_at > value ? row.checked_at : value, null,
  );
  return (
    <div className="intg-details">
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
      {usage && <UsagePanel usage={usage} />}
      <div className="intg-next"><strong>Volgende actie</strong><span>{item.nextAction}</span></div>
    </div>
  );
}

function IntegrationAction({ item, checking, onCheck, onConnect, onDetails, compact }: {
  item: IntegrationItem;
  checking: boolean;
  onCheck: () => void;
  onConnect: () => void;
  /** Alleen de kaart heeft een "Details bekijken"-uitweg; de rij klapt zelf uit. */
  onDetails?: () => void;
  compact?: boolean;
}) {
  const cls = `intg-action${compact ? ' intg-action--row' : ''}`;
  const size = compact ? 14 : 16;
  if (item.overallStatus === 'not_checked') {
    return (
      <button className={cls} type="button" onClick={onCheck} disabled={checking}>
        <RefreshCw size={size} className={checking ? 'is-spinning' : ''} aria-hidden="true" />
        {checking ? 'Controleren…' : 'Nu controleren'}
      </button>
    );
  }
  if (item.overallStatus === 'planned') {
    return <button className={cls} type="button" onClick={onConnect}><Plug size={size} aria-hidden="true" />Koppelen</button>;
  }
  if (item.overallStatus === 'action_needed') {
    return <button className={cls} type="button" onClick={onConnect}><Wrench size={size} aria-hidden="true" />Aansluiting voltooien</button>;
  }
  if (item.overallStatus === 'broken') {
    return <button className={`${cls} intg-action--urgent`} type="button" onClick={onConnect}><Wrench size={size} aria-hidden="true" />Probleem oplossen</button>;
  }
  if (!onDetails) return null;
  return <button className={`${cls} intg-action--secondary`} type="button" onClick={onDetails}>Details bekijken</button>;
}

function IntegrationCard({ item, usage, checking, onCheck, onConnect, onDetails }: {
  item: IntegrationItem;
  usage?: IntegrationUsage;
  checking: boolean;
  onCheck: () => void;
  onConnect: () => void;
  onDetails: () => void;
}) {
  const meta = STATUS[item.overallStatus];
  const Icon = meta.icon;
  return (
    <article className={`intg-card intg-status--${item.overallStatus}`}>
      <div className="intg-card-top">
        <span className="intg-kind">{KIND_LABEL[item.kind]}</span>
        <span className="intg-badge"><Icon size={14} aria-hidden="true" />{meta.label}</span>
      </div>
      <h2 className="intg-card-title">
        <IntegrationMark integrationId={item.integrationId} name={item.name} />
        {item.name}
      </h2>
      <p>{item.purpose}</p>
      <IntegrationDetails item={item} usage={usage} />
      <IntegrationAction item={item} checking={checking} onCheck={onCheck} onConnect={onConnect} onDetails={onDetails} />
    </article>
  );
}

// Kleurregel (afspraak met Sander): groen zolang er ruim tegoed is, oranje zodra
// de helft van het pakket bereikt is, rood als het op is. Bij een leverancier
// zonder pakketgrootte kunnen we geen helft berekenen — dan alleen groen/rood.
function level(meter: UsageMeter): 'ok' | 'warn' | 'out' {
  if (meter.remaining <= 0) return 'out';
  if (meter.pct !== null && meter.pct <= 50) return 'warn';
  return 'ok';
}

const LEVEL_LABEL = { ok: 'ruim tegoed', warn: 'helft bereikt', out: 'tegoed op' } as const;
const nl = new Intl.NumberFormat('nl-NL');

function UsageBar({ label, meter }: { label: string; meter: UsageMeter }) {
  const state = level(meter);
  const width = meter.pct === null ? 100 : Math.min(100, Math.max(0, meter.pct));
  const text = meter.plan
    ? `${nl.format(meter.remaining)} van ${nl.format(meter.plan)} ${label.toLowerCase()} over`
    : `${nl.format(meter.remaining)} ${label.toLowerCase()} over`;
  return (
    <div className={`intg-usage-row intg-usage--${state}`}>
      <div className="intg-usage-line">
        <span>{label}</span>
        <strong>{nl.format(meter.remaining)}{meter.plan ? ` / ${nl.format(meter.plan)}` : ''}</strong>
      </div>
      <div
        className="intg-usage-bar"
        role="meter"
        aria-valuenow={meter.pct ?? meter.remaining}
        aria-valuemin={0}
        aria-valuemax={meter.pct === null ? meter.remaining : 100}
        aria-label={`${text} — ${LEVEL_LABEL[state]}`}
      >
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function UsagePanel({ usage }: { usage: IntegrationUsage }) {
  if (!usage.ok) {
    const why = usage.reason === 'no-key' ? 'geen sleutel ingesteld'
      : usage.reason === 'unauthorized' ? 'sleutel geweigerd'
      : usage.reason === 'timeout' ? 'leverancier reageerde niet op tijd'
      : 'leverancier onbereikbaar';
    return <div className="intg-usage"><p className="intg-usage-off">Tegoed niet op te halen — {why}.</p></div>;
  }
  return (
    <div className="intg-usage">
      <div className="intg-usage-head">
        <strong>Tegoed {usage.provider}</strong>
        {usage.periodEnd && <span>t/m {new Date(usage.periodEnd).toLocaleDateString('nl-NL')}</span>}
      </div>
      {usage.credits && <UsageBar label="Credits" meter={usage.credits} />}
      {usage.tokens && <UsageBar label="Tokens" meter={usage.tokens} />}
      <p className="intg-usage-foot">
        {usage.fetchedAt ? `Stand van ${new Date(usage.fetchedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}` : ''}
        {usage.cached ? ' (uit buffer)' : ''}
      </p>
    </div>
  );
}
