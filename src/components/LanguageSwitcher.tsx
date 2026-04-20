import { Link, useLocation } from "@tanstack/react-router";
import type { Locale } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";

/**
 * Switches the current URL between /en/... and /es/...
 * For routes with localized slugs (match, country guides), the equivalent slug
 * should be passed via `altPath` to override the default behavior.
 */
export function LanguageSwitcher({
  locale,
  altPath,
}: {
  locale: Locale;
  altPath?: string;
}) {
  const location = useLocation();
  const target = otherLocale(locale);
  const path = altPath ?? location.pathname.replace(/^\/(en|es)/, `/${target}`);
  return (
    <Link
      to={path}
      onClick={() => {
        if (typeof window !== "undefined") {
          const w = window as unknown as { gtag?: (...a: unknown[]) => void };
          w.gtag?.("event", "language_switch", { from: locale, to: target });
        }
      }}
      className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {target}
    </Link>
  );
}
