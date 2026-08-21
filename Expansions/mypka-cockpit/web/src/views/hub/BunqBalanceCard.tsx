// BunqBalanceCard.tsx — the Hub's bunq balance module.
//
// Mirrors OpenInvoicesCard's structure 1:1 (loading → available:false → empty →
// list), because that is the precedent this whole connector follows.
//
// TWO THINGS THIS CARD DOES DIFFERENTLY, BOTH DELIBERATE:
//
//  1. IT NAMES WHY IT IS EMPTY. The server distinguishes 'not-configured',
//     'lan-hidden', 'no-user-id' and 'error', and each gets its own honest
//     empty state. A bank card that just shows nothing is worse than useless —
//     the reader cannot tell "no money" from "not connected" from "hidden".
//
//  2. IT LABELS SANDBOX DATA. When BUNQ_ENV is sandbox the numbers are fake.
//     Showing a fake balance that looks real is the single worst failure mode
//     this card has, so the badge is not optional decoration.
//
// Rows do NOT link anywhere: a monetary account has no note in the vault. There
// is no total either — Sander chose "every account on its own row" in the design.
import { Landmark, EyeOff, AlertTriangle, Wallet } from 'lucide-react';
import { useFetch } from '../../lib/useCockpit';
import { ModuleEmptyState } from '../../components/ui';
import type { BunqAccount, BunqBalanceResponse } from '../../lib/cockpitExtras';
import { useT, intlLocale } from '../../lib/i18n';
import { useTNodes } from '../../lib/i18n/rich';

function formatAmount(amount: number | null, currency: string): string {
  if (amount == null) return '—';
  try {
    return new Intl.NumberFormat(intlLocale(), { style: 'currency', currency }).format(amount);
  } catch {
    // Unknown currency code → bare number + raw code (never throws on the Hub).
    return `${amount.toFixed(2)} ${currency}`;
  }
}

// A shortened IBAN: enough to recognise the account, not the whole number on
// screen for anyone glancing at the Hub.
function shortIban(iban: string | null): string | null {
  if (!iban) return null;
  const clean = iban.replace(/\s+/g, '');
  if (clean.length <= 8) return clean;
  return `${clean.slice(0, 4)}…${clean.slice(-4)}`;
}

function AccountRow({ account }: { account: BunqAccount }) {
  // Negative balances read in the error register — the same "loudest first"
  // logic the invoices card uses for overdue.
  const state = account.balance != null && account.balance < 0 ? 'negative' : 'normal';
  const iban = shortIban(account.iban);

  return (
    <div role="listitem" className="hub-balance" data-state={state}>
      <span className="hub-balance-glyph" aria-hidden="true">
        <Wallet size={15} strokeWidth={1.5} />
      </span>
      <span className="hub-balance-main">
        <span className="hub-balance-name">{account.description ?? iban ?? '—'}</span>
        <span className="hub-balance-sub">
          {iban && <span className="hub-balance-iban">{iban}</span>}
          {account.status && account.status !== 'ACTIVE' && (
            <span className="hub-balance-status">{account.status}</span>
          )}
        </span>
      </span>
      <span className="hub-balance-amount" data-state={state}>
        {formatAmount(account.balance, account.currency)}
      </span>
    </div>
  );
}

function CardShell({ children, badge }: { children: React.ReactNode; badge?: React.ReactNode }) {
  const t = useT();
  return (
    <section className="hub-section">
      <header className="hub-section-head">
        <h2 className="hub-section-title">
          <Landmark size={15} strokeWidth={1.5} aria-hidden="true" />
          {t('bunq.title')}
          {badge}
        </h2>
        <p className="hub-section-hint">{t('bunq.hint')}</p>
      </header>
      {children}
    </section>
  );
}

export function BunqBalanceCard() {
  const t = useT();
  const tn = useTNodes();
  const { data } = useFetch<BunqBalanceResponse>('/api/cockpit/bunq/balance');

  // Still loading (or a settled error) — render nothing; the Hub stays calm and
  // the section appears once data settles (the OpenInvoicesCard posture).
  if (!data) return null;

  if (!data.available) {
    // Each reason gets its own honest state. Never a silent gap: a bank card
    // that renders blank when it is actually misconfigured is a trap.
    if (data.reason === 'lan-hidden') {
      return (
        <CardShell>
          <ModuleEmptyState title={t('bunq.lanHiddenTitle')} icon={EyeOff}>
            {tn('bunq.lanHiddenBody', {
              loopback: <span className="font-mono">127.0.0.1</span>,
              flag: <span className="font-mono">BUNQ_ALLOW_LAN=1</span>,
              env: <span className="font-mono">Team Knowledge/.env</span>,
            })}
          </ModuleEmptyState>
        </CardShell>
      );
    }

    if (data.reason === 'no-user-id') {
      return (
        <CardShell>
          <ModuleEmptyState title={t('bunq.noUserIdTitle')} icon={AlertTriangle}>
            {tn('bunq.noUserIdBody', {
              cmd: <span className="font-mono">npm run setup:bunq</span>,
            })}
          </ModuleEmptyState>
        </CardShell>
      );
    }

    if (data.reason === 'error') {
      return (
        <CardShell>
          <ModuleEmptyState title={t('bunq.errorTitle')} icon={AlertTriangle}>
            {t('bunq.errorBody')}
          </ModuleEmptyState>
        </CardShell>
      );
    }

    // 'not-configured' — and the safe default for any reason a future server
    // sends that this build does not know about yet.
    return (
      <CardShell>
        <ModuleEmptyState title={t('bunq.notSetUpTitle')} icon={Landmark}>
          {tn('bunq.notSetUpBody', {
            cmd: <span className="font-mono">npm run setup:bunq</span>,
          })}
        </ModuleEmptyState>
      </CardShell>
    );
  }

  // Sandbox numbers are fake. Say so, every time, right next to the title.
  const badge =
    data.environment === 'sandbox' ? (
      <span className="hub-balance-badge">{t('bunq.sandboxBadge')}</span>
    ) : undefined;

  return (
    <CardShell badge={badge}>
      {data.items.length === 0 ? (
        <p className="hub-empty">{t('bunq.empty')}</p>
      ) : (
        <div className="hub-balances" role="list">
          {data.items.map((account) => (
            <AccountRow key={account.accountId ?? account.iban ?? account.description} account={account} />
          ))}
        </div>
      )}
    </CardShell>
  );
}
