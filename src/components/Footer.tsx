import { Link } from "@tanstack/react-router";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

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
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <AffiliateDisclosure locale={locale} variant="block" />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {locale === "es"
              ? "Apuestas solo para mayores de 18 años (21+ en EE. UU.). Sujeto a restricciones por estado/país. Apuesta con responsabilidad."
              : "Betting is 18+ only (21+ in the U.S.). Subject to state/country restrictions. Please gamble responsibly."}
          </p>
        </div>
      </div>
    </footer>
  );
}
