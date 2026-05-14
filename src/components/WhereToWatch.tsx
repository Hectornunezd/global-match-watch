import type { Channel } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { ChannelCard } from "./ChannelCard";
import { VPNUpsell } from "./VPNUpsell";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

const COUNTRY_NAMES: Record<string, { en: string; es: string }> = {
  ARG: { en: "Argentina", es: "Argentina" },
  AUS: { en: "Australia", es: "Australia" },
  BEL: { en: "Belgium", es: "Bélgica" },
  BLZ: { en: "Belize", es: "Belice" },
  BOL: { en: "Bolivia", es: "Bolivia" },
  BRA: { en: "Brazil", es: "Brasil" },
  CAN: { en: "Canada", es: "Canadá" },
  CHE: { en: "Switzerland", es: "Suiza" },
  CHL: { en: "Chile", es: "Chile" },
  COL: { en: "Colombia", es: "Colombia" },
  CRI: { en: "Costa Rica", es: "Costa Rica" },
  DEU: { en: "Germany", es: "Alemania" },
  DNK: { en: "Denmark", es: "Dinamarca" },
  ECU: { en: "Ecuador", es: "Ecuador" },
  EGY: { en: "Egypt", es: "Egipto" },
  ESP: { en: "Spain", es: "España" },
  FRA: { en: "France", es: "Francia" },
  GBR: { en: "United Kingdom", es: "Reino Unido" },
  GTM: { en: "Guatemala", es: "Guatemala" },
  GUY: { en: "Guyana", es: "Guyana" },
  HND: { en: "Honduras", es: "Honduras" },
  HRV: { en: "Croatia", es: "Croacia" },
  IND: { en: "India", es: "India" },
  IRL: { en: "Ireland", es: "Irlanda" },
  ITA: { en: "Italy", es: "Italia" },
  JPN: { en: "Japan", es: "Japón" },
  KOR: { en: "South Korea", es: "Corea del Sur" },
  MAR: { en: "Morocco", es: "Marruecos" },
  MEX: { en: "Mexico", es: "México" },
  NIC: { en: "Nicaragua", es: "Nicaragua" },
  NLD: { en: "Netherlands", es: "Países Bajos" },
  NZL: { en: "New Zealand", es: "Nueva Zelanda" },
  PAN: { en: "Panama", es: "Panamá" },
  PER: { en: "Peru", es: "Perú" },
  POL: { en: "Poland", es: "Polonia" },
  PRT: { en: "Portugal", es: "Portugal" },
  PRY: { en: "Paraguay", es: "Paraguay" },
  QAT: { en: "Qatar", es: "Qatar" },
  SAU: { en: "Saudi Arabia", es: "Arabia Saudita" },
  SEN: { en: "Senegal", es: "Senegal" },
  SLV: { en: "El Salvador", es: "El Salvador" },
  SUR: { en: "Suriname", es: "Surinam" },
  TUR: { en: "Turkey", es: "Turquía" },
  URY: { en: "Uruguay", es: "Uruguay" },
  USA: { en: "United States", es: "Estados Unidos" },
  VEN: { en: "Venezuela", es: "Venezuela" },
  ZAF: { en: "South Africa", es: "Sudáfrica" },
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
