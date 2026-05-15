import type { Channel } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { ChannelCard } from "./ChannelCard";
import { VPNUpsell } from "./VPNUpsell";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

const COUNTRY_NAMES: Record<string, { en: string; es: string }> = {
  USA: { en: "United States", es: "Estados Unidos" },
  GBR: { en: "United Kingdom", es: "Reino Unido" },
  CAN: { en: "Canada", es: "Canadá" },
  AUS: { en: "Australia", es: "Australia" },
  MEX: { en: "Mexico", es: "México" },
  ESP: { en: "Spain", es: "España" },
  ARG: { en: "Argentina", es: "Argentina" },
  COL: { en: "Colombia", es: "Colombia" },
  BRA: { en: "Brazil", es: "Brasil" },
  FRA: { en: "France", es: "Francia" },
  DEU: { en: "Germany", es: "Alemania" },
  ITA: { en: "Italy", es: "Italia" },
  JPN: { en: "Japan", es: "Japón" },
  KOR: { en: "South Korea", es: "Corea del Sur" },
  IND: { en: "India", es: "India" },
  SAU: { en: "Saudi Arabia", es: "Arabia Saudita" },
  QAT: { en: "Qatar", es: "Catar" },
  PRT: { en: "Portugal", es: "Portugal" },
  NLD: { en: "Netherlands", es: "Países Bajos" },
  AUT: { en: "Austria", es: "Austria" },
  SWE: { en: "Sweden", es: "Suecia" },
  FIN: { en: "Finland", es: "Finlandia" },
  NOR: { en: "Norway", es: "Noruega" },
  DNK: { en: "Denmark", es: "Dinamarca" },
  SVN: { en: "Slovenia", es: "Eslovenia" },
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
