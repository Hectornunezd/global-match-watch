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
    <div className="flex flex-wrap gap-2 pb-2">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wider transition-colors ${
          active === null
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground hover:border-primary"
        }`}
      >
        {m.sections.allGroups}
      </button>
      {groups.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`shrink-0 rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wider transition-colors ${
            active === g
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:border-primary"
          }`}
        >
          {m.sections.group} {g}
        </button>
      ))}
    </div>
  );
}
