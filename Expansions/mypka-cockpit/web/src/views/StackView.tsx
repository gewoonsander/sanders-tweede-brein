// StackView.tsx — the Software-stack page (#/stack).
//
// WHAT THIS IS (and why it is not the Connections page)
//   Connections answers a narrow question: which task/calendar tools feed the
//   planner? This page answers the wide one: what software is this myPKA wired
//   to at all? Firecrawl, Perplexity and the n8n MCP endpoint have no "my tasks"
//   list, so they can never show up there — yet they are unmistakably part of
//   the stack. Two honest sections, both read-only:
//
//     1. Stored keys — every key NAME in Team Knowledge/.env, labelled with the
//        connector that claims it, or plainly marked as unlinked.
//     2. MCP servers — everything declared in the repo's .mcp.json, with the
//        ${VAR} names each one references.
//
// READ-ONLY BY DESIGN. No delete, no rotate, no save. Key management already has
// a home on #/connections; duplicating it here would mean two write paths to the
// same file. The page links there instead.
//
// NEVER A CONFIGURED BADGE ON AN MCP ${VAR}. Those placeholders resolve in the
// shell/launcher environment that starts the assistant, which this server cannot
// inspect. Showing green/red there would be a guess dressed up as a fact — they
// render as neutral informational chips.
import { Layers, KeyRound, Server, Terminal, Globe, Circle } from 'lucide-react';
import { useFetch } from '../lib/useCockpit';
import { useT } from '../lib/i18n';
import { useTNodes } from '../lib/i18n/rich';
import { hrefFor } from '../lib/router';
import type {
  StackResponse, StackEnvKey, StackMcpServer, StackMcpTransport,
} from '../lib/stack';
import './stack.css';

const CONNECTIONS_HREF = hrefFor({ name: 'connections' });
const INTEGRATIONS_HREF = hrefFor({ name: 'integrations' });

export function StackView({ embedded = false }: { embedded?: boolean }) {
  const t = useT();
  const tn = useTNodes();
  const { data, loading, error } = useFetch<StackResponse>('/api/cockpit/stack');

  if (loading) {
    return <div className="list-skeleton" aria-busy="true"><div className="skeleton-block" /></div>;
  }
  if (error || !data) return <p className="view-error">{t('stack.loadError')} {error || ''}</p>;

  const { envKeys, mcp } = data;
  // Only worth explaining the gate when it actually changes what the user sees:
  // with the master switch off, a connector-claimed key cannot be recognised.
  const gateOff = !data.connectorsEnabled && envKeys.length > 0;

  return (
    <div className={`stk ${embedded ? 'stk--embedded' : ''}`}>
      {!embedded && <header className="stk-head">
        <h1 className="stk-title">
          <Layers size={22} strokeWidth={1.5} aria-hidden="true" /> {t('stack.title')}
        </h1>
        <p className="stk-sub">
          {tn('stack.sub', {
            connections: <a className="stk-link" href={CONNECTIONS_HREF}>{t('stack.subConnections')}</a>,
            register: <a className="stk-link" href={INTEGRATIONS_HREF}>{t('stack.subRegister')}</a>,
            envPath: <span className="font-mono">{data.envPath}</span>,
            mcpPath: <span className="font-mono">{data.mcpPath}</span>,
          })}
        </p>
      </header>}

      <section className="stk-section" aria-labelledby="stk-keys-title">
        <div className="stk-section-head">
          <h2 className="stk-section-title" id="stk-keys-title">{t('stack.keysTitle')}</h2>
          {envKeys.length > 0 && (
            <span className="stk-count">
              {t(envKeys.length === 1 ? 'stack.keysCountOne' : 'stack.keysCountOther', { count: envKeys.length })}
            </span>
          )}
        </div>

        {gateOff && <p className="stk-note" role="status">{t('stack.gateOff')}</p>}

        {envKeys.length === 0 ? (
          <p className="stk-empty">{t('stack.keysEmpty')}</p>
        ) : (
          <ul className="stk-rows">
            {envKeys.map((k) => <EnvKeyRow key={k.key} entry={k} mcpPath={data.mcpPath} />)}
          </ul>
        )}

        <p className="stk-hint">
          {tn('stack.manageHint', {
            connections: <a className="stk-link" href={CONNECTIONS_HREF}>{t('stack.subConnections')}</a>,
          })}
        </p>
      </section>

      <section className="stk-section" aria-labelledby="stk-mcp-title">
        <div className="stk-section-head">
          <h2 className="stk-section-title" id="stk-mcp-title">{t('stack.mcpTitle')}</h2>
          {mcp.servers.length > 0 && (
            <span className="stk-count">
              {t(mcp.servers.length === 1 ? 'stack.mcpCountOne' : 'stack.mcpCountOther', { count: mcp.servers.length })}
            </span>
          )}
        </div>

        {/* Absent/unreadable config and a config with zero servers are different
            facts, so they get different sentences — neither is an error state. */}
        {mcp.servers.length === 0 ? (
          <p className="stk-empty">
            {tn(mcp.available ? 'stack.mcpEmpty' : 'stack.mcpMissing', {
              mcpPath: <span className="font-mono">{data.mcpPath}</span>,
            })}
          </p>
        ) : (
          <>
            <ul className="stk-rows">
              {mcp.servers.map((s) => <McpServerRow key={s.id} server={s} />)}
            </ul>
            <p className="stk-hint">{t('stack.mcpRefsNote')}</p>
          </>
        )}
      </section>
    </div>
  );
}

// ---- Stored keys ------------------------------------------------------------

function EnvKeyRow({ entry, mcpPath }: { entry: StackEnvKey; mcpPath: string }) {
  const t = useT();
  const tn = useTNodes();

  const meta = entry.role === 'connector'
    ? entry.connectors.length === 1
      ? t('stack.roleConnector', { label: entry.connectors[0].label })
      : t('stack.roleConnectorMulti', { labels: entry.connectors.map((c) => c.label).join(', ') })
    : entry.role === 'system'
      ? t('stack.roleSystem')
      : t('stack.roleUnlinked');

  const badgeKey = entry.role === 'connector'
    ? 'stack.badgeConnector'
    : entry.role === 'system' ? 'stack.badgeSystem' : 'stack.badgeUnlinked';

  return (
    <li className={`stk-row stk-row--${entry.role}`}>
      <KeyRound size={16} strokeWidth={1.5} aria-hidden="true" className="stk-row-icon" />
      <div className="stk-row-text">
        <span className="stk-row-name font-mono">{entry.key}</span>
        <span className="stk-row-meta">
          {meta}
          {!entry.configured && <> · {t('stack.keyEmptyValue')}</>}
        </span>
        {/* A NAME match against .mcp.json — never a claim that the MCP server
            reads its value from this vault. Those resolve elsewhere. */}
        {entry.mcpRefs.length > 0 && (
          <span className="stk-row-meta stk-row-meta--quiet">
            {tn('stack.mcpNameMatch', {
              mcpPath: <span className="font-mono">{mcpPath}</span>,
            }, { servers: entry.mcpRefs.join(', ') })}
          </span>
        )}
      </div>
      <span className={`stk-badge stk-badge--${entry.role}`}>{t(badgeKey)}</span>
    </li>
  );
}

// ---- MCP servers ------------------------------------------------------------

const TRANSPORT_LABEL = {
  http: 'stack.mcpTransportHttp',
  sse: 'stack.mcpTransportSse',
  stdio: 'stack.mcpTransportStdio',
} as const satisfies Record<StackMcpTransport, string>;

function McpServerRow({ server }: { server: StackMcpServer }) {
  const t = useT();
  const Icon = server.transport === 'stdio' ? Terminal : Globe;

  return (
    <li className="stk-row stk-row--mcp">
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" className="stk-row-icon" />
      <div className="stk-row-text">
        <span className="stk-row-name">
          {server.link ? (
            <a
              className="stk-link"
              href={server.link}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t('stack.mcpOpen', { id: server.id })}
            >
              {server.id}
            </a>
          ) : server.id}
        </span>
        <span className="stk-row-meta">
          {t(TRANSPORT_LABEL[server.transport])}
          {server.target && <> · <span className="font-mono">{server.target}</span></>}
        </span>
        {server.envRefs.length > 0 && (
          <span className="stk-row-refs">
            <span className="stk-row-refs-label">{t('stack.mcpRefs')}</span>
            {server.envRefs.map((name) => (
              // Deliberately NOT a status pill: no configured/not-configured
              // state, because the cockpit cannot verify it (see file header).
              <span className="stk-chip font-mono" key={name}>
                <Circle size={7} strokeWidth={2} aria-hidden="true" />
                {name}
              </span>
            ))}
          </span>
        )}
      </div>
      <span className="stk-badge stk-badge--mcp">
        <Server size={12} strokeWidth={1.75} aria-hidden="true" /> MCP
      </span>
    </li>
  );
}
