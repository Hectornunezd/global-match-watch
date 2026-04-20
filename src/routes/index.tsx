import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectGeo } from "@/lib/geolocation";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const geo = await detectGeo();
    throw redirect({ to: "/$locale", params: { locale: geo.locale } });
  },
  component: () => null,
});
