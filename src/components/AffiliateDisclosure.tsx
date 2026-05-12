import type { Locale } from "@/lib/i18n";

interface Props {
  locale: Locale;
  variant?: "inline" | "block";
  className?: string;
}

/**
 * FTC-compliant affiliate disclosure shown near affiliate CTAs.
 * Use `inline` (small, single-line) for cards and `block` (boxed) for sections/footers.
 */
export function AffiliateDisclosure({ locale, variant = "inline", className = "" }: Props) {
  const text =
    locale === "es"
      ? "Contiene enlaces de afiliados. Podemos recibir una comisión sin costo adicional para ti."
      : "Contains affiliate links. We may earn a commission at no extra cost to you.";

  if (variant === "inline") {
    return (
      <p
        className={`font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80 ${className}`}
      >
        {text}
      </p>
    );
  }

  return (
    <div
      className={`rounded-md border border-dashed border-border bg-card/40 p-3 text-[11px] uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {text}
    </div>
  );
}
