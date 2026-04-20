import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/$locale/responsible-gambling")({
  beforeLoad: ({ params }) => { if (!isLocale(params.locale)) throw notFound(); },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}/responsible-gambling`;
    const altPath = `/${locale === "en" ? "es" : "en"}/responsible-gambling`;
    const { meta, links } = buildMeta({
      title: locale === "es" ? "Juego responsable — MatchLiveNow" : "Responsible Gambling — MatchLiveNow",
      description: locale === "es" ? "Recursos de juego responsable." : "Responsible gambling resources.",
      path, altPath, locale,
    });
    return { meta, links };
  },
  component: RGPage,
});

function RGPage() {
  const { locale } = Route.useLoaderData();
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-12 sm:px-6 prose-invert">
      <h1>{locale === "es" ? "Juego responsable" : "Responsible Gambling"}</h1>
      <p className="text-muted-foreground">
        {locale === "es"
          ? "Las apuestas deben ser una forma de entretenimiento, no de ingresos. Apuesta solo lo que puedas permitirte perder."
          : "Gambling should be a form of entertainment, not income. Only bet what you can afford to lose."}
      </p>
      <ul className="text-muted-foreground">
        <li>BeGambleAware — <a href="https://www.begambleaware.org" rel="noopener noreferrer">begambleaware.org</a></li>
        <li>Gamblers Anonymous — <a href="https://www.gamblersanonymous.org" rel="noopener noreferrer">gamblersanonymous.org</a></li>
        <li>{locale === "es" ? "FEJAR (España) — fejar.org" : "GamCare (UK) — gamcare.org.uk"}</li>
      </ul>
    </article>
  );
}
