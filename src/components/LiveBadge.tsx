import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function LiveBadge({ locale }: { locale: Locale }) {
  const m = t(locale);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-2 py-0.5 text-[11px] font-bold tracking-wider text-[var(--success)]">
      <span className="live-pulse h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
      {m.labels.live}
    </span>
  );
}
