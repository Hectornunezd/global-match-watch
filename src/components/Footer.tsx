import { Link } from "@tanstack/react-router";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const m = t(locale);
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-display text-base font-bold text-primary-foreground">
                ML
              </span>
              <span className="font-display text-lg uppercase tracking-wider">
                MatchLive<span className="text-primary">Now</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{m.footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-sm">{m.footer.legal}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to={localeUrl(locale, "/privacy-policy")} className="hover:text-foreground">
                  {locale === "es" ? "Política de privacidad" : "Privacy policy"}
                </Link>
              </li>
              <li>
                <Link to={localeUrl(locale, "/terms")} className="hover:text-foreground">
                  {locale === "es" ? "Términos" : "Terms"}
                </Link>
              </li>
              <li>
                <Link to={localeUrl(locale, "/responsible-gambling")} className="hover:text-foreground">
                  {locale === "es" ? "Juego responsable" : "Responsible gambling"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm">© 2026 MatchLiveNow</h4>
            <p className="mt-3 text-sm text-muted-foreground">{m.footer.built}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
