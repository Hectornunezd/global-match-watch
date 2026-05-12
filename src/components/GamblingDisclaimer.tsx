import type { Locale } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { localeUrl } from "@/lib/i18n";

interface Props {
  locale: Locale;
  /** ISO country code of the user, used to surface state/country restrictions. */
  countryCode?: string | null;
  className?: string;
}

/**
 * 18+ / 21+ gambling disclaimer with state and country restrictions notice.
 * Render anywhere odds, sportsbook CTAs, or betting partner links appear.
 */
export function GamblingDisclaimer({ locale, countryCode, className = "" }: Props) {
  const code = (countryCode ?? "").toUpperCase();
  const isUS = code === "US";
  const minAge = isUS ? "21+" : "18+";

  const restrictions =
    locale === "es"
      ? isUS
        ? "Las apuestas deportivas solo están disponibles en estados de EE. UU. donde son legales (p. ej. NJ, PA, NY, MI, CO, AZ). DraftKings, FanDuel y BetMGM no operan en todos los estados."
        : "Las apuestas pueden estar restringidas o prohibidas en tu país o región. Verifica la legislación local antes de registrarte."
      : isUS
        ? "Sports betting is only available in U.S. states where it is legal (e.g. NJ, PA, NY, MI, CO, AZ). DraftKings, FanDuel and BetMGM do not operate in every state."
        : "Betting may be restricted or prohibited in your country or region. Check local laws before signing up.";

  const ageLine =
    locale === "es"
      ? `Solo para mayores de ${minAge}. Apuesta con responsabilidad.`
      : `${minAge} only. Please gamble responsibly.`;

  const helpLabel = locale === "es" ? "Juego responsable" : "Responsible gambling";

  return (
    <div
      className={`rounded-md border border-primary/30 bg-primary/5 p-3 text-[11px] uppercase tracking-wider text-muted-foreground ${className}`}
    >
      <p className="font-bold text-primary">{ageLine}</p>
      <p className="mt-1 normal-case tracking-normal text-muted-foreground">{restrictions}</p>
      <Link
        to={localeUrl(locale, "/responsible-gambling")}
        className="mt-1 inline-block text-primary hover:underline"
      >
        {helpLabel} →
      </Link>
    </div>
  );
}
