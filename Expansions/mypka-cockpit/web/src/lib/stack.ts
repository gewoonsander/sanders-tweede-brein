// stack.ts — types for the Software-stack page (GET /api/cockpit/stack).
//
// DELIBERATELY SEPARATE FROM connectors.ts. The Connections page models ONE
// narrow contract: connectors that emit NormalizedTask / NormalizedEvent items
// for the planner. This page models the WIDER question — every piece of software
// this myPKA is wired to, including tools that will never have a "my tasks"
// list (Firecrawl, Perplexity, an n8n MCP endpoint). Sharing ConnectorInfo here
// would drag the planner's assumptions into a surface that isn't about the
// planner, so the two type sets stay independent on purpose.
//
// SECURITY SHAPE: every field below is secret-free by SERVER construction
// (see server/stackInventory.js) — key NAMES, booleans, transport labels, and
// URLs already stripped of userinfo/query/fragment. There is no write helper in
// this module: the page is read-only, and key management lives on #/connections.

/** Which connector (if any) claims a stored key. */
export interface StackKeyConnector {
  id: string;
  label: string;
}

export type StackKeyRole =
  /** Claimed by a registered planner connector. */
  | 'connector'
  /** A cockpit-operational variable (a setting), not a tool credential. */
  | 'system'
  /** Stored, but no planner connector uses it — the reason this page exists. */
  | 'unlinked';

export interface StackEnvKey {
  /** The key NAME. A value is never transmitted, in any state. */
  key: string;
  role: StackKeyRole;
  /** True when the line resolves to a non-empty value. Boolean only. */
  configured: boolean;
  connectors: StackKeyConnector[];
  /**
   * Ids of .mcp.json servers that reference a placeholder with this SAME NAME.
   * A name match only — MCP placeholders resolve in the shell/launcher
   * environment, which the cockpit cannot inspect. Never render this as proof
   * that the MCP server is configured.
   */
  mcpRefs: string[];
}

export type StackMcpTransport = 'http' | 'sse' | 'stdio';

export interface StackMcpServer {
  /** The key under `mcpServers` in .mcp.json. */
  id: string;
  transport: StackMcpTransport;
  /** URL (http/sse) or `command args` (stdio). Sanitised server-side. */
  target: string;
  /** The server's own origin, when it is an http(s) endpoint. */
  link: string | null;
  /**
   * The ${VAR} NAMES this server references in its env/headers. Informational
   * only — the cockpit cannot verify whether they resolve, so these NEVER get a
   * configured / not-configured badge.
   */
  envRefs: string[];
}

export interface StackMcp {
  /** False when .mcp.json is absent or unreadable — a calm empty section. */
  available: boolean;
  servers: StackMcpServer[];
}

export interface StackResponse {
  /** Repo-relative display path of the key vault. */
  envPath: string;
  /** Repo-relative display path of the MCP config. */
  mcpPath: string;
  /** The connector master gate (CONNECTORS_ENABLED). Off ⇒ no key can read as 'connector'. */
  connectorsEnabled: boolean;
  envKeys: StackEnvKey[];
  mcp: StackMcp;
}
