import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0A0A0F" },
      { name: "color-scheme", content: "dark" },
      { name: "format-detection", content: "telephone=no" },
      { name: "mylead-verification", content: "98f2d3fe2bf7dc0c6541894d5faab5ab" },
      { name: "impact-site-verification", content: "7b366caa-12fc-4f37-b629-e2e5a0e91ecc" },
      { title: "MatchLiveNow — Watch the FIFA World Cup 2026 Live" },
      { name: "description", content: "MatchLiveNow: find every TV channel and streaming service for the FIFA World Cup 2026 — live, free and paid options for every country." },
      { name: "application-name", content: "MatchLiveNow" },
      { name: "apple-mobile-web-app-title", content: "MatchLiveNow" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:site_name", content: "MatchLiveNow" },
      { property: "og:title", content: "MatchLiveNow — Where to Watch Every Match" },
      { property: "og:description", content: "Find every TV channel and streaming service for the FIFA World Cup 2026 in your country." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MatchLiveNow — Where to Watch Every Match" },
      { name: "twitter:description", content: "Every channel and stream for the FIFA World Cup 2026, in your country." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap",
      },
    ],
    scripts: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-TQH64JKYC5",
      },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-TQH64JKYC5');`,
      },
      {
        children: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7313535-6ee4-45ea-8c3b-8c00d2ad44631.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    const existing = document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (existing) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7422798753725684";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  return <Outlet />;
}
