import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale, t } from "@/lib/i18n";
import { getTeamBySlug } from "@/lib/data";
import { MatchCard } from "@/components/MatchCard";
import { buildMeta, jsonLdScript, sportsTeamJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/$locale/team/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: async ({ params }) => {
    const data = await getTeamBySlug({ data: { slug: params.slug, locale: params.locale as "en" | "es" } });
    if (!data.team) throw notFound();
    return { ...data, locale: params.locale as Locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.team) return {};
    const t = loaderData.team;
    const locale = loaderData.locale;
    const name = locale === "es" ? t.name_es : t.name_en;
    const slug = locale === "es" ? t.slug_es : t.slug_en;
    const altSlug = locale === "es" ? t.slug_en : t.slug_es;
    const path = `/${locale}/team/${slug}`;
    const altPath = `/${locale === "es" ? "en" : "es"}/team/${altSlug}`;
    const title = locale === "es" ? `${name} en el Mundial 2026 — Calendario y canales` : `${name} at the World Cup 2026 — Schedule & Channels`;
    const description = locale === "es"
      ? `Calendario completo, resultados y canales para ver a ${name} en el Mundial FIFA 2026.`
      : `Full schedule, results and channels for ${name} at the FIFA World Cup 2026.`;
    const { meta, links } = buildMeta({ title, description, path, altPath, locale });
    return {
      meta,
      links,
      scripts: [jsonLdScript(sportsTeamJsonLd(name, `https://matchlivenow.com${path}`, t.flag_url ?? undefined))],
    };
  },
  component: TeamPage,
});

function TeamPage() {
  const { team, upcoming, past, locale } = Route.useLoaderData();
  const m = t(locale);
  const name = locale === "es" ? team.name_es : team.name_en;
  return (
    <>
      <section className="border-b border-border gradient-hero">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-10 sm:px-6">
          {team.flag_url ? <img src={team.flag_url} alt="" className="h-16 w-24 rounded-md object-cover sm:h-20 sm:w-32" /> : null}
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {m.sections.group} {team.group_letter}
            </span>
            <h1 className="mt-1 font-display text-3xl uppercase sm:text-5xl">{name}</h1>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {upcoming.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl">{m.sections.upcomingFor}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {upcoming.map((f) => <MatchCard key={f.id} fixture={f} locale={locale} />)}
            </div>
          </section>
        )}
        {past.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl">{m.sections.pastResults}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {past.map((f) => <MatchCard key={f.id} fixture={f} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
