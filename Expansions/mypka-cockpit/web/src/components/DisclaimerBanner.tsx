import { ShieldCheck } from 'lucide-react';
import { useT } from '../lib/i18n';

// Mandatory, prominent. Reference-range framing, NOT diagnosis. Calm, not alarmist.
export function DisclaimerBanner() {
  const t = useT();
  return (
    <div
      role="note"
      className="flex items-start gap-sm rounded-panel border border-border bg-surface-1 px-md py-sm"
    >
      <ShieldCheck size={20} strokeWidth={1.5} className="mt-[2px] shrink-0 text-marker-text" aria-hidden="true" />
      <p className="text-meta leading-relaxed text-fg-muted">
        <span className="font-[520] text-fg">{t('disclaimer.lead')}</span>{' '}
        {t('disclaimer.body')}
      </p>
    </div>
  );
}
