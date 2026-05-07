import { Link } from "@tanstack/react-router";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const m = t(locale);
  return (
    <footer className="mt-16 border-t border-primary/40 bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <span className="font-display text-lg uppercase tracking-wider text-foreground">
              MATCH<span className="mx-0.5 text-primary">[·LIVE]</span>NOW
            </span>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              LAKE ELSINORE, CALIFORNIA
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              CONTACTO@MLN.COM | +52 333 333 3333
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-primary">
              [ {m.footer.legal} ]
            </h4>
            <ul className="mt-3 space-y-2 text-xs uppercase tracking-wider text-muted-foreground">
              <li>
                <Link to={localeUrl(locale, "/privacy-policy")} className="hover:text-primary">
                  {locale === "es" ? "Política de privacidad" : "Privacy policy"}
                </Link>
              </li>
              <li>
                <Link to={localeUrl(locale, "/terms")} className="hover:text-primary">
                  {locale === "es" ? "Términos" : "Terms"}
                </Link>
              </li>
              <li>
                <Link to={localeUrl(locale, "/responsible-gambling")} className="hover:text-primary">
                  {locale === "es" ? "Juego responsable" : "Responsible gambling"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-primary">[ FOLLOW US ]</h4>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              © 2026 ORIVANA S.A. DE C.V. ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
