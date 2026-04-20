import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/$locale/privacy-policy")({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw notFound(); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}/privacy-policy`;
    const altPath = `/${locale === "en" ? "es" : "en"}/privacy-policy`;
    const { meta, links } = buildMeta({
      title: locale === "es" ? "Política de privacidad — MatchLiveNow" : "Privacy Policy — MatchLiveNow",
      description: locale === "es" ? "Cómo MatchLiveNow maneja tus datos." : "How MatchLiveNow handles your data.",
      path, altPath, locale,
    });
    return { meta, links };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { locale } = Route.useLoaderData();
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-12 sm:px-6 prose-invert">
      <h1>{locale === "es" ? "Política de privacidad" : "Privacy Policy"}</h1>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "MatchLiveNow recopila datos mínimos para operar el sitio: cookies de preferencia (idioma, país), análisis agregado y registros de clics en enlaces de afiliados. No vendemos tus datos personales."
          : "MatchLiveNow collects minimal data to operate the site: preference cookies (language, country), aggregate analytics, and affiliate click logs. We do not sell your personal data."}
      </p>
      <h2>{locale === "es" ? "Cookies" : "Cookies"}</h2>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "Usamos cookies esenciales para guardar tu idioma y país. Las cookies de análisis y publicidad solo se activan después de tu consentimiento."
          : "We use essential cookies to remember your language and country. Analytics and advertising cookies activate only after you consent."}
      </p>
      <h2>{locale === "es" ? "Anuncios" : "Advertising"}</h2>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "Mostramos anuncios a través de Google AdSense y enlaces de afiliados de socios de streaming, VPN y apuestas."
          : "We display ads via Google AdSense and affiliate links from streaming, VPN and betting partners."}
      </p>
    </article>
  );
}
