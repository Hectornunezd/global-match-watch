import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { isLocale, type Locale, localeUrl } from "@/lib/i18n";
import { buildMeta, jsonLdScript } from "@/lib/seo";
import { BLOG_POSTS, formatBlogDate, getBlogPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/$locale/blogs/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: ({ params }) => {
    const locale = params.locale as Locale;
    const post = getBlogPost(params.slug, locale);
    if (!post) throw notFound();
    return { locale, post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, post } = loaderData;
    const content = locale === "es" ? post.es : post.en;
    const slug = locale === "es" ? post.slug_es : post.slug_en;
    const altSlug = locale === "es" ? post.slug_en : post.slug_es;
    const path = `/${locale}/blogs/${slug}`;
    const altPath = `/${locale === "en" ? "es" : "en"}/blogs/${altSlug}`;
    const ogImage = `https://matchlivenow.com${post.cover}`;
    const { meta, links } = buildMeta({
      title: content.title,
      description: content.excerpt,
      path,
      altPath,
      locale,
      ogImage,
      ogType: "article",
      keywords: content.keywords,
    });
    return {
      meta,
      links,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: content.title,
          description: content.excerpt,
          image: ogImage,
          datePublished: post.date,
          dateModified: post.date,
          author: { "@type": "Organization", name: post.author },
          publisher: {
            "@type": "Organization",
            name: "MatchLiveNow",
            logo: {
              "@type": "ImageObject",
              url: "https://matchlivenow.com/favicon.ico",
            },
          },
          mainEntityOfPage: `https://matchlivenow.com${path}`,
        }),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { locale, post } = Route.useLoaderData();
  const content = locale === "es" ? post.es : post.en;
  return (
    <article>
      <header className="border-b border-border bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to={localeUrl(locale, "/blogs")}
            className="font-display text-xs uppercase tracking-[0.2em] text-primary hover:underline"
          >
            ◂ {locale === "es" ? "Volver al blog" : "Back to blog"}
          </Link>
          <h1 className="mt-4 font-display text-3xl uppercase leading-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{content.excerpt}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {formatBlogDate(post.date, locale, "long")} {" "}
            · {post.author}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="aspect-[16/9] w-full overflow-hidden border border-border bg-black">
          <img
            src={post.cover}
            alt={content.title}
            width={1280}
            height={720}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground">
          <p className="text-lg text-muted-foreground">{content.intro}</p>

          <ol className="space-y-8">
            {content.steps.map((step: { title: string; body: string }, i: number) => (
              <li key={i} className="border-l-2 border-primary pl-5">
                <h2 className="font-display text-xl uppercase leading-tight text-foreground sm:text-2xl">
                  {step.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="border-t border-border pt-6 text-muted-foreground">{content.outro}</p>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
            {locale === "es" ? "Más guías" : "More guides"}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {BLOG_POSTS.filter(
              (p) => (locale === "es" ? p.slug_es : p.slug_en) !== (locale === "es" ? post.slug_es : post.slug_en),
            ).map((p) => {
              const c = locale === "es" ? p.es : p.en;
              const s = locale === "es" ? p.slug_es : p.slug_en;
              return (
                <Link
                  key={s}
                  to="/$locale/blogs/$slug"
                  params={{ locale, slug: s }}
                  className="block border border-border bg-card p-4 transition-colors hover:border-primary"
                >
                  <h3 className="font-display text-base uppercase leading-tight text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.excerpt}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
