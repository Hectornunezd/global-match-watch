import type { Channel } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { ChannelCard } from "./ChannelCard";
import { VPNUpsell } from "./VPNUpsell";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

const COUNTRY_NAMES: Record<string, { en: string; es: string }> = {
  US: { en: "United States", es: "Estados Unidos" },
  GB: { en: "United Kingdom", es: "Reino Unido" },
  CA: { en: "Canada", es: "Canadá" },
  AU: { en: "Australia", es: "Australia" },
  MX: { en: "Mexico", es: "México" },
  ES: { en: "Spain", es: "España" },
  AR: { en: "Argentina", es: "Argentina" },
  CO: { en: "Colombia", es: "Colombia" },
  BR: { en: "Brazil", es: "Brasil" },
  FR: { en: "France", es: "Francia" },
  DE: { en: "Germany", es: "Alemania" },
  IT: { en: "Italy", es: "Italia" },
  JP: { en: "Japan", es: "Japón" },
  KR: { en: "South Korea", es: "Corea del Sur" },
  IN: { en: "India", es: "India" },
  SA: { en: "Saudi Arabia", es: "Arabia Saudita" },
  QA: { en: "Qatar", es: "Catar" },
};

interface Props {
  channels: Channel[];
  countryCode: string;
  locale: Locale;
}

export function WhereToWatch({ channels, countryCode, locale }: Props) {
  const m = t(locale);
  const country = COUNTRY_NAMES[countryCode]?.[locale] ?? countryCode;

  if (channels.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-4 text-2xl">
          {m.sections.whereToWatch} <span className="text-primary">{country}</span>
        </h2>
        <VPNUpsell
          locale={locale}
          countryWithFreeStream="United Kingdom"
          countryCode={countryCode}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-2xl">
          {m.sections.whereToWatch} <span className="text-primary">{country}</span>
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {channels.length} {channels.length === 1 ? "option" : "options"}
        </span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            locale={locale}
            pageType="home"
            countryCode={countryCode}
          />
        ))}
      </div>
      <AffiliateDisclosure locale={locale} className="mt-3" />
    </section>
  );
}
