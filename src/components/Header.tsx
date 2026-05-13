import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchBox } from "./SearchBox";

export function Header({ locale, altPath }: { locale: Locale; altPath?: string }) {
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--surface)]">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to={localeUrl(locale)}
          className="font-display text-lg uppercase tracking-wider text-foreground sm:text-xl"
        >
          MATCH<span className="mx-0.5 text-primary">[·LIVE]</span>NOW
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} altPath={altPath} />
          <SearchBox locale={locale} />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground/90 hover:text-primary"
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7h18M3 13h18M3 19h18" strokeLinecap="square" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen MLN menu overlay */}
      {open && (
        <div className="fixed inset-0 top-[57px] z-50 overflow-y-auto bg-[var(--background)]">
          <MenuRow>
            <MenuLink to={localeUrl(locale)} onClick={() => setOpen(false)}>
              {locale === "es" ? "HOME" : "HOME"}
            </MenuLink>
          </MenuRow>


          <MenuRow>
            <MenuLink to={localeUrl(locale)} onClick={() => setOpen(false)}>
              {locale === "es" ? "EN VIVO" : "LIVE"}
            </MenuLink>
          </MenuRow>

          <MenuRow>
            <MenuLink to={localeUrl(locale) + "#upcoming"} onClick={() => setOpen(false)}>
              {locale === "es" ? "PROGRAMACIÓN" : "SCHEDULE"}
            </MenuLink>
          </MenuRow>

          <MenuRow>
            <MenuLink to={localeUrl(locale)} onClick={() => setOpen(false)}>
              {locale === "es" ? "APUESTAS" : "BETS"}
            </MenuLink>
          </MenuRow>

          <MenuRow last>
            <span className="block px-6 py-6 font-display text-xs uppercase tracking-wider text-muted-foreground sm:px-12">
              {t(locale).hero.subtitle}
            </span>
          </MenuRow>
        </div>
      )}
    </header>
  );
}


function MenuRow({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`border-t border-primary ${last ? "border-b" : ""}`}>{children}</div>
  );
}

function MenuLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-6 py-6 font-display text-4xl font-bold uppercase leading-none text-primary transition-colors hover:bg-primary/5 sm:px-12 sm:py-8 sm:text-6xl"
    >
      {children}
    </Link>
  );
}
