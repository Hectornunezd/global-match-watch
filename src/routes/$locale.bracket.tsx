import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { isLocale } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/bracket")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
    throw redirect({
      to: "/$locale/liguilla",
      params: { locale: params.locale },
      statusCode: 301,
    });
  },
  component: () => null,
});
