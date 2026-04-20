import { createFileRoute, Outlet, useParams, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = useParams({ from: "/$locale" });
  const loc = locale as Locale;
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={loc} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer locale={loc} />
      <CookieConsent locale={loc} />
    </div>
  );
}
