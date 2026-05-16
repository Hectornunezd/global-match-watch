import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/$locale/partners")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) throw notFound();
  },
  loader: ({ params }) => ({ locale: params.locale as Locale }),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const locale = loaderData.locale;
    const path = `/${locale}/partners`;
    const altPath = `/${locale === "en" ? "es" : "en"}/partners`;
    const { meta, links } = buildMeta({
      title:
        locale === "es"
          ? "Socios y divulgación de afiliados — MatchLiveNow"
          : "Partners & Affiliate Disclosure — MatchLiveNow",
      description:
        locale === "es"
          ? "Información sobre nuestros socios de streaming, VPN y apuestas, y nuestra divulgación legal de afiliados."
          : "Information about our streaming, VPN and betting partners, plus our legal affiliate disclosure.",
      path,
      altPath,
      locale,
    });
    return { meta, links };
  },
  component: PartnersPage,
});

function PartnersPage() {
  const { locale } = Route.useLoaderData();
  const es = locale === "es";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-10 border-b border-primary/40 pb-6">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">
          [ {es ? "Transparencia" : "Transparency"} ]
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-foreground sm:text-5xl">
          {es ? "Socios y afiliados" : "Partners & Affiliates"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {es
            ? "Última actualización: 16 de mayo de 2026"
            : "Last updated: May 16, 2026"}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "1. Divulgación de afiliados" : "1. Affiliate disclosure"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "MatchLiveNow.com es un sitio independiente operado con fines informativos y de entretenimiento. Participamos en programas de marketing de afiliados con plataformas de streaming, redes de televisión, proveedores de VPN y operadores de apuestas deportivas regulados. Cuando haces clic en un enlace marcado como afiliado y completas una acción cualificada (suscripción, registro, compra, depósito), podemos recibir una comisión sin coste adicional para ti."
            : "MatchLiveNow.com is an independent website operated for informational and entertainment purposes. We participate in affiliate marketing programs with streaming platforms, TV networks, VPN providers and licensed sports-betting operators. When you click an affiliate-tagged link and complete a qualifying action (subscription, sign-up, purchase, deposit), we may earn a commission at no extra cost to you."}
        </p>
        <p className="text-muted-foreground">
          {es
            ? "Esta divulgación cumple con la Guía de la Comisión Federal de Comercio de EE. UU. (FTC) sobre el uso de endosos y testimonios en publicidad (16 CFR Part 255), la Ley General de Publicidad española (Ley 34/1988), la Ley de Servicios de la Sociedad de la Información (LSSI 34/2002), la Directiva 2005/29/CE sobre prácticas comerciales desleales y el Reglamento (UE) 2019/2161 (Directiva Omnibus)."
            : "This disclosure complies with the U.S. Federal Trade Commission Guides Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255), the EU Unfair Commercial Practices Directive 2005/29/EC, the Omnibus Directive (EU) 2019/2161, and equivalent consumer-protection regulations in the United Kingdom (CAP Code), Canada (Competition Act) and Australia (ACL)."}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "2. Cómo identificamos los enlaces" : "2. How we label links"}
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            {es
              ? "Cada enlace de afiliado lleva el atributo rel=\"sponsored nofollow\" según las directrices de Google."
              : "Every affiliate link carries the rel=\"sponsored nofollow\" attribute per Google's webmaster guidelines."}
          </li>
          <li>
            {es
              ? "Los botones de canales, VPN y apuestas incluyen una etiqueta visible (\"Ad\", \"Patrocinado\" o \"Afiliado\")."
              : "Channel, VPN and betting buttons include a visible label (\"Ad\", \"Sponsored\" or \"Affiliate\")."}
          </li>
          <li>
            {es
              ? "Una nota de divulgación aparece en el pie de cada página del sitio."
              : "A disclosure note appears in the footer of every page on the site."}
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "3. Independencia editorial" : "3. Editorial independence"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "Las relaciones de afiliados no influyen en qué partidos cubrimos, cómo describimos los canales o qué proveedores recomendamos. El listado de cada partido se basa en disponibilidad pública de retransmisión por país; los logotipos y marcas de cada cadena pertenecen a sus respectivos titulares y se usan a efectos informativos."
            : "Affiliate relationships do not influence which matches we cover, how we describe channels, or which providers we recommend. Each match listing is based on publicly available broadcast availability by country; broadcaster logos and trademarks belong to their respective owners and are used for informational purposes only."}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "4. Programas y socios" : "4. Programs and partners"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "Trabajamos directamente con marcas y a través de las siguientes redes de afiliación. La lista puede cambiar sin previo aviso."
            : "We work directly with brands and through the following affiliate networks. This list may change without notice."}
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <PartnerBlock
            title={es ? "Streaming y TV" : "Streaming & TV"}
            items={[
              "DAZN",
              "fuboTV",
              "Sling TV",
              "Paramount+",
              "Peacock",
              "Hulu + Live TV",
              "Apple TV+ / MLS Season Pass",
              "Movistar Plus+",
              "Sky / NOW TV",
              "Disney+ / Star+",
            ]}
          />
          <PartnerBlock
            title="VPN"
            items={["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "Proton VPN", "Private Internet Access"]}
          />
          <PartnerBlock
            title={es ? "Apuestas deportivas (18+ / 21+)" : "Sports betting (18+ / 21+)"}
            items={[
              "bet365",
              "Betway",
              "William Hill",
              "Codere",
              "Caliente.mx",
              "Betsson",
              "DraftKings",
              "FanDuel",
            ]}
          />
          <PartnerBlock
            title={es ? "Redes de afiliación" : "Affiliate networks"}
            items={["Impact.com", "Awin", "CJ Affiliate", "Rakuten Advertising", "PartnerStack", "ShareASale"]}
          />
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "5. Publicidad gráfica" : "5. Display advertising"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "Mostramos publicidad gráfica mediante Google AdSense. Google y sus socios pueden usar cookies para servir anuncios basados en visitas previas a este y otros sitios web. Puedes desactivar la personalización en "
            : "We serve display ads via Google AdSense. Google and its partners may use cookies to serve ads based on prior visits to this and other sites. You can opt out of personalized advertising at "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-primary underline-offset-4 hover:underline"
          >
            adssettings.google.com
          </a>
          .
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "6. Juego responsable" : "6. Responsible gambling"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "Las apuestas conllevan riesgo financiero y pueden causar adicción. Solo personas mayores de 18 años (21 en EE. UU. y según jurisdicción) pueden registrarse en operadores legales en su país. Si tú o alguien cercano necesita ayuda, contacta con: Jugar Bien (España) 900 81 08 25 · Juego Responsable (México) · GambleAware.org (Reino Unido) · 1-800-GAMBLER (EE. UU.)."
            : "Betting involves financial risk and can be addictive. Only persons aged 18+ (21+ in the U.S. and where required by local law) may register with licensed operators in their jurisdiction. If you or someone you know needs help: GambleAware.org (UK) · 1-800-GAMBLER (US) · ConnexOntario 1-866-531-2600 (Canada) · Gambling Help Online (AU) · Jugar Bien 900 81 08 25 (Spain)."}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "7. Marcas y derechos" : "7. Trademarks & rights"}
        </h2>
        <p className="text-muted-foreground">
          {es
            ? "FIFA, FIFA World Cup, World Cup 2026 y los emblemas asociados son marcas registradas de la Fédération Internationale de Football Association. MatchLiveNow no está afiliada, patrocinada ni respaldada por la FIFA ni por ninguna federación o cadena de televisión. Todas las demás marcas pertenecen a sus respectivos titulares."
            : "FIFA, FIFA World Cup, World Cup 2026 and associated emblems are trademarks of the Fédération Internationale de Football Association. MatchLiveNow is not affiliated with, sponsored by or endorsed by FIFA, any football federation or any broadcaster. All other trademarks belong to their respective owners."}
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
          {es ? "8. Contacto" : "8. Contact"}
        </h2>
        <p className="text-muted-foreground">
          {es ? "Para consultas de afiliación, prensa o derechos, escribe a " : "For partnership, press or rights inquiries, write to "}
          <a
            href="mailto:partners@matchlivenow.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            partners@matchlivenow.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}

function PartnerBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-border bg-card/40 p-4">
      <h3 className="font-display text-sm uppercase tracking-wider text-primary">
        [ {title} ]
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it}>· {it}</li>
        ))}
      </ul>
    </div>
  );
}
