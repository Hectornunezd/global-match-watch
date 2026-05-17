import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { isLocale, type Locale, localeUrl } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const Route = createFileRoute("/$locale/blogs")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}/blogs`;
    const altPath = `/${locale === "en" ? "es" : "en"}/blogs`;
    const { meta, links } = buildMeta({
      title: locale === "en"
        ? "World Cup 2026 Blog — Guides to Watch Every Match"
        : "Blog del Mundial 2026 — Guías para ver cada partido",
      description: locale === "en"
        ? "Step-by-step guides on how to watch the FIFA World Cup 2026 live from your country — free streams, paid options, and watch-party tips."
        : "Guías paso a paso para ver el Mundial FIFA 2026 en vivo desde tu país — transmisiones gratis, opciones de pago y tips para tu reunión.",
      path,
      altPath,
      locale,
    });
    return { meta, links };
  },
  component: BlogsIndex,
});

function BlogsIndex() {
  const { locale } = Route.useLoaderData();
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
          MATCH<span className="text-primary">[·LIVE]</span>NOW · {locale === "es" ? "BLOG" : "BLOG"}
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-none text-foreground sm:text-6xl">
          {locale === "es" ? "Guías del Mundial 2026" : "World Cup 2026 Guides"}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          {locale === "es"
            ? "Todo lo que necesitas para preparar, encontrar y disfrutar cada partido del Mundial — paso a paso."
            : "Everything you need to prepare for, find and enjoy every World Cup match — step by step."}
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => {
            const slug = locale === "es" ? post.slug_es : post.slug_en;
            const content = locale === "es" ? post.es : post.en;
            return (
              <Link
                key={slug}
                to="/$locale/blogs/$slug"
                params={{ locale, slug }}
                className="group flex flex-col border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                  <img
                    src={post.cover}
                    alt={content.title}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <span className="font-display text-[10px] uppercase tracking-[0.2em] text-primary">
                    {new Date(post.date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <h2 className="font-display text-xl uppercase leading-tight text-foreground group-hover:text-primary">
                    {content.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{content.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1 font-display text-xs uppercase tracking-wider text-primary">
                    {locale === "es" ? "Leer ▸" : "Read ▸"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
