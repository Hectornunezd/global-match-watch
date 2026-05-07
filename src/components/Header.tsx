import { Link } from "@tanstack/react-router";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale, altPath }: { locale: Locale; altPath?: string }) {
  const m = t(locale);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to={localeUrl(locale)} className="font-display text-lg uppercase tracking-wider text-foreground sm:text-xl">
          MATCH<span className="mx-0.5 text-primary">[·LIVE]</span>NOW
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link
            to={localeUrl(locale)}
            className="font-display text-sm uppercase tracking-wider text-muted-foreground hover:text-primary"
          >
            {m.nav.home}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} altPath={altPath} />
        </div>
      </div>
    </header>
  );
}
