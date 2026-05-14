import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function GroupFilter({
  locale,
  groups,
  active,
  onChange,
}: {
  locale: Locale;
  groups: string[];
  active: string | null;
  onChange: (g: string | null) => void;
}) {
  const m = t(locale);
  return (
    <div className="flex flex-wrap gap-1.5 pb-2 sm:gap-2">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full border px-2.5 py-1 font-display text-[11px] uppercase tracking-wider backdrop-blur-md transition-colors sm:px-4 sm:py-1.5 sm:text-sm ${
          active === null
            ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_-8px_var(--primary)]"
            : "border-white/10 bg-white/5 text-foreground hover:border-primary hover:bg-primary/10"
        }`}
      >
        {m.sections.allGroups}
      </button>
      {groups.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`shrink-0 rounded-full border px-2.5 py-1 font-display text-[11px] uppercase tracking-wider backdrop-blur-md transition-colors sm:px-4 sm:py-1.5 sm:text-sm ${
            active === g
              ? "border-primary bg-primary/20 text-primary shadow-[0_0_20px_-8px_var(--primary)]"
              : "border-white/10 bg-white/5 text-foreground hover:border-primary hover:bg-primary/10"
          }`}
        >
          {m.sections.group} {g}
        </button>
      ))}
    </div>
  );
}
