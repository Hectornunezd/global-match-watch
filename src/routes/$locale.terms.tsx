import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/$locale/terms")({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw notFound(); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}/terms`;
    const altPath = `/${locale === "en" ? "es" : "en"}/terms`;
    const { meta, links } = buildMeta({
      title: locale === "es" ? "Términos de servicio — MatchLiveNow" : "Terms of Service — MatchLiveNow",
      description: locale === "es" ? "Términos de uso de MatchLiveNow." : "Terms of use for MatchLiveNow.",
      path, altPath, locale,
    });
    return { meta, links };
  },
  component: TermsPage,
});

function TermsPage() {
  const { locale } = Route.useLoaderData();
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-12 sm:px-6 prose-invert">
      <h1>{locale === "es" ? "Términos" : "Terms"}</h1>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "MatchLiveNow es un directorio informativo. No transmitimos partidos. Los enlaces a canales y servicios de streaming pertenecen a sus respectivos proveedores."
          : "MatchLiveNow is an informational directory. We do not stream matches. Links to channels and streaming services belong to their respective providers."}
      </p>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "Algunos enlaces son de afiliados; podemos recibir una comisión sin costo adicional para ti."
          : "Some links are affiliate links; we may earn a commission at no extra cost to you."}
      </p>
    </article>
  );
}
