import heroTrophy from "@/assets/hero-trophy.jpg";
import matchCover from "@/assets/match-cover.jpg";
import fansWatching from "@/assets/blog-fans-watching.jpg";

export type BlogPost = {
  slug_en: string;
  slug_es: string;
  cover: string;
  date: string; // ISO
  author: string;
  en: {
    title: string;
    excerpt: string;
    intro: string;
    steps: { title: string; body: string }[];
    outro: string;
    keywords: string;
  };
  es: {
    title: string;
    excerpt: string;
    intro: string;
    steps: { title: string; body: string }[];
    outro: string;
    keywords: string;
  };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug_en: "how-to-watch-world-cup-2026-live-from-your-country",
    slug_es: "como-ver-el-mundial-2026-en-vivo-desde-tu-pais",
    cover: heroTrophy,
    date: "2026-05-10",
    author: "MatchLiveNow Team",
    en: {
      title: "How to Watch the FIFA World Cup 2026 Live From Your Country",
      excerpt:
        "A complete step-by-step guide to streaming every World Cup 2026 match — free and paid options for every country.",
      intro:
        "The FIFA World Cup 2026 will be the largest tournament in history with 48 teams and matches played across the USA, Mexico and Canada. Wherever you are, you can watch every game live — you just need to know which channel or streaming service has the rights in your country. This guide walks you through everything, step by step.",
      steps: [
        {
          title: "Step 1 — Confirm your country and language",
          body:
            "Open MatchLiveNow and check the country selector at the top of the page. Broadcast rights change by country, so this is the most important first step. If you're traveling, set the country to the one whose broadcast you want to watch.",
        },
        {
          title: "Step 2 — Find the official broadcaster for the match",
          body:
            "On the match page you'll see every channel and streaming service that carries the game in your country, with a clear FREE or PAID label. Free over-the-air channels (like Telemundo or BBC) work with a simple antenna or their free app; paid options like Fubo, Peacock or Sky usually offer a free trial.",
        },
        {
          title: "Step 3 — Set up your streaming account before kickoff",
          body:
            "Don't wait until five minutes before the match. Create the account, add a payment method if needed, install the app on your TV / phone / laptop, and log in. Big matches see traffic spikes that can delay sign-ups.",
        },
        {
          title: "Step 4 — Test your internet and screen mirroring",
          body:
            "A stable 25 Mbps connection is enough for HD; aim for 50+ Mbps for 4K. If you plan to cast to a TV, do a 30-second test broadcast the day before. Use ethernet over Wi-Fi if you can.",
        },
        {
          title: "Step 5 — If nothing is available in your country, use a VPN",
          body:
            "Some countries don't get a free broadcast for every match. A reputable VPN (NordVPN, ExpressVPN) lets you connect through a country that does — for example, watching Brazil's matches via Globo's free stream. Always check the streaming service's terms.",
        },
      ],
      outro:
        "That's it — you're ready for kickoff. Bookmark MatchLiveNow, set your country once, and every match page will tell you exactly where to watch, whether it's free or paid, and link you straight to the broadcaster.",
      keywords:
        "how to watch World Cup 2026, World Cup 2026 streaming, watch World Cup live, World Cup 2026 channels, free World Cup streaming, World Cup VPN",
    },
    es: {
      title: "Cómo ver el Mundial FIFA 2026 en vivo desde tu país",
      excerpt:
        "Guía completa paso a paso para ver cada partido del Mundial 2026 — opciones gratis y de pago para cada país.",
      intro:
        "El Mundial FIFA 2026 será el torneo más grande de la historia con 48 equipos y partidos en Estados Unidos, México y Canadá. Estés donde estés, puedes ver cada partido en vivo — solo necesitas saber qué canal o servicio de streaming tiene los derechos en tu país. Esta guía te lo explica todo, paso a paso.",
      steps: [
        {
          title: "Paso 1 — Confirma tu país e idioma",
          body:
            "Abre MatchLiveNow y revisa el selector de país en la parte superior. Los derechos de transmisión cambian por país, así que este es el paso más importante. Si estás viajando, ajusta el país al de la transmisión que quieres ver.",
        },
        {
          title: "Paso 2 — Encuentra el canal oficial del partido",
          body:
            "En la página de cada partido verás todos los canales y servicios de streaming que lo transmiten en tu país, con una etiqueta clara de GRATIS o PAGO. Los canales abiertos (como Telemundo o TUDN) funcionan con antena o su app gratuita; opciones de pago como Fubo, ViX Premium o Sky suelen ofrecer prueba gratuita.",
        },
        {
          title: "Paso 3 — Configura tu cuenta de streaming antes del inicio",
          body:
            "No esperes hasta cinco minutos antes del partido. Crea la cuenta, agrega método de pago si hace falta, instala la app en tu TV / teléfono / laptop, e inicia sesión. Los partidos grandes generan picos de tráfico que pueden retrasar los registros.",
        },
        {
          title: "Paso 4 — Prueba tu internet y la conexión a la TV",
          body:
            "Una conexión estable de 25 Mbps basta para HD; apunta a 50+ Mbps para 4K. Si vas a usar Chromecast o AirPlay, haz una prueba de 30 segundos el día antes. Si puedes, usa cable ethernet en vez de Wi-Fi.",
        },
        {
          title: "Paso 5 — Si nada está disponible en tu país, usa una VPN",
          body:
            "Algunos países no tienen transmisión gratuita de todos los partidos. Una VPN confiable (NordVPN, ExpressVPN) te permite conectarte desde un país que sí la tiene — por ejemplo, ver los partidos de Brasil por la señal gratuita de Globo. Revisa siempre los términos del servicio.",
        },
      ],
      outro:
        "Listo — estás preparado para el pitazo inicial. Guarda MatchLiveNow en favoritos, configura tu país una vez y cada página de partido te dirá exactamente dónde ver, si es gratis o de pago, y te llevará directo al canal.",
      keywords:
        "cómo ver el Mundial 2026, Mundial 2026 streaming, ver Mundial en vivo, canales Mundial 2026, ver Mundial gratis, VPN Mundial",
    },
  },
  {
    slug_en: "best-free-streaming-services-for-world-cup-2026",
    slug_es: "mejores-servicios-gratis-para-ver-el-mundial-2026",
    cover: matchCover,
    date: "2026-05-12",
    author: "MatchLiveNow Team",
    en: {
      title: "Best Free Streaming Services for the World Cup 2026",
      excerpt:
        "Where to watch the World Cup 2026 without paying a cent — country by country, step by step.",
      intro:
        "You don't always need a paid subscription to watch the World Cup. Dozens of broadcasters around the world stream matches for free over the air or through their official apps. Here's how to find, set up and use them in five practical steps.",
      steps: [
        {
          title: "Step 1 — Identify the free rights holder in your country",
          body:
            "In Mexico, TUDN and Azteca 7 carry most matches free. In Spain, RTVE airs key games. In the UK it's BBC iPlayer and ITVX. Use the country page on MatchLiveNow to see the free options for every fixture.",
        },
        {
          title: "Step 2 — Install the official app",
          body:
            "Free streams almost always require the broadcaster's own app — BBC iPlayer, RTVE Play, ViX, Telemundo Deportes, Globoplay. Install it on the device you'll watch from and create the free account.",
        },
        {
          title: "Step 3 — Verify location requirements",
          body:
            "Most free apps are geo-restricted. BBC iPlayer requires a UK IP and a TV licence; RTVE Play needs a Spanish IP. If you're abroad, a VPN connected to the country of the broadcaster restores access.",
        },
        {
          title: "Step 4 — Use multiple sources for tournament coverage",
          body:
            "No single broadcaster covers every game for free. Bookmark two or three free apps relevant to your region so you can switch between matches without missing kickoff.",
        },
        {
          title: "Step 5 — Have a paid backup ready for the knockout rounds",
          body:
            "Knockout games sometimes move to pay channels. A free trial on Fubo, Peacock or DAZN gives you a safety net for the final week without committing long-term.",
        },
      ],
      outro:
        "Free coverage of the World Cup 2026 is widely available — you just need to know where to look. MatchLiveNow lists every free broadcaster per country, per match, so you'll never miss a game because you couldn't find the right app.",
      keywords:
        "free World Cup streaming, watch World Cup free, BBC iPlayer World Cup, Telemundo Mundial, RTVE Mundial, free World Cup channels",
    },
    es: {
      title: "Mejores servicios gratis para ver el Mundial 2026",
      excerpt:
        "Dónde ver el Mundial 2026 sin pagar — país por país, paso a paso.",
      intro:
        "No siempre necesitas una suscripción de pago para ver el Mundial. Decenas de canales en todo el mundo transmiten partidos gratis por TV abierta o a través de sus apps oficiales. Aquí te explicamos cómo encontrarlos, configurarlos y usarlos en cinco pasos prácticos.",
      steps: [
        {
          title: "Paso 1 — Identifica al canal gratuito en tu país",
          body:
            "En México, TUDN y Azteca 7 transmiten la mayoría de los partidos gratis. En España, RTVE emite los partidos clave. En Reino Unido son BBC iPlayer e ITVX. Usa la página de tu país en MatchLiveNow para ver las opciones gratuitas de cada partido.",
        },
        {
          title: "Paso 2 — Instala la app oficial",
          body:
            "Las transmisiones gratuitas casi siempre requieren la app del canal — RTVE Play, ViX, Telemundo Deportes, Globoplay, BBC iPlayer. Instálala en el dispositivo desde el que vas a ver y crea la cuenta gratuita.",
        },
        {
          title: "Paso 3 — Verifica los requisitos de ubicación",
          body:
            "La mayoría de las apps gratuitas están bloqueadas por región. BBC iPlayer requiere IP del Reino Unido; RTVE Play necesita IP española. Si estás en el extranjero, una VPN conectada al país del canal te devuelve el acceso.",
        },
        {
          title: "Paso 4 — Usa varias fuentes durante el torneo",
          body:
            "Ningún canal cubre todos los partidos gratis. Guarda dos o tres apps gratuitas relevantes para tu región para poder cambiar entre partidos sin perderte el pitazo inicial.",
        },
        {
          title: "Paso 5 — Ten un respaldo de pago listo para la fase final",
          body:
            "Los partidos de eliminación a veces se mueven a canales de pago. Una prueba gratuita en Fubo, ViX Premium o DAZN te da una red de seguridad para la última semana sin comprometerte a largo plazo.",
        },
      ],
      outro:
        "La cobertura gratuita del Mundial 2026 está al alcance — solo hay que saber dónde mirar. MatchLiveNow lista todos los canales gratuitos por país y por partido, para que nunca te pierdas un juego por no encontrar la app correcta.",
      keywords:
        "ver Mundial gratis, streaming gratis Mundial 2026, Telemundo Mundial, TUDN Mundial, RTVE Mundial, canales gratis Mundial",
    },
  },
  {
    slug_en: "world-cup-2026-watch-party-checklist",
    slug_es: "lista-de-preparacion-para-ver-el-mundial-2026-en-casa",
    cover: fansWatching,
    date: "2026-05-14",
    author: "MatchLiveNow Team",
    en: {
      title: "The Ultimate World Cup 2026 Watch Party Checklist",
      excerpt:
        "Five practical steps to prepare your home, devices and friends for an unforgettable World Cup 2026.",
      intro:
        "A World Cup happens once every four years. Don't let a bad TV setup, slow Wi-Fi or last-minute snack panic ruin the moment. Here's a complete checklist to prepare for the matches that matter — built around the five things that actually go wrong.",
      steps: [
        {
          title: "Step 1 — Lock in your viewing setup a week ahead",
          body:
            "Pick the room, the screen, and the seating. Update your smart TV firmware, log into the streaming apps you'll use, and confirm the picture quality (Full HD minimum, 4K if you have the bandwidth). Mount or angle the screen so no one is craning their neck.",
        },
        {
          title: "Step 2 — Stress-test your internet",
          body:
            "Run a speed test during the same time of day the match will play. Restart your router. If multiple people will stream, hardwire the main TV with ethernet so a teenager's mobile game can't tank the broadcast.",
        },
        {
          title: "Step 3 — Plan the menu and timing around kickoff",
          body:
            "Pick food that survives a 45-minute half — wings, empanadas, nachos, pizza. Prep everything 30 minutes before kickoff. Keep drinks within reach. Nobody should be in the kitchen during a goal.",
        },
        {
          title: "Step 4 — Sort the guest list and seats by team",
          body:
            "Mixing rival fans is fun — but assign seats. Put loud supporters at the edges, families with kids closer to the back, and keep the path to the bathroom clear. Set a no-spoilers rule for anyone watching delayed.",
        },
        {
          title: "Step 5 — Have a backup plan for when something breaks",
          body:
            "Apps crash. Power goes out. Have a second device ready (a tablet on a stand works), the broadcaster's live radio feed bookmarked, and a charged phone with mobile data as a hotspot. Five minutes of preparation saves the night.",
        },
      ],
      outro:
        "A great watch party is 80% preparation and 20% football. Run through this checklist a few days before each match day and you'll spend the actual game enjoying it — not fixing it. ¡Que gane el mejor!",
      keywords:
        "World Cup watch party, World Cup 2026 setup, how to host World Cup, World Cup home viewing, World Cup 2026 checklist",
    },
    es: {
      title: "Lista definitiva para ver el Mundial 2026 en casa",
      excerpt:
        "Cinco pasos prácticos para preparar tu casa, tus aparatos y a tus amigos para un Mundial 2026 inolvidable.",
      intro:
        "Un Mundial pasa solo una vez cada cuatro años. No dejes que un mal televisor, un Wi-Fi lento o un caos de último minuto con la comida arruinen el momento. Aquí tienes una lista completa para preparar los partidos importantes — basada en las cinco cosas que de verdad fallan.",
      steps: [
        {
          title: "Paso 1 — Define tu setup una semana antes",
          body:
            "Elige la sala, la pantalla y los asientos. Actualiza el firmware de tu smart TV, inicia sesión en las apps de streaming que vayas a usar y confirma la calidad de imagen (Full HD mínimo, 4K si tu internet aguanta). Coloca la pantalla para que nadie tenga que estirar el cuello.",
        },
        {
          title: "Paso 2 — Prueba tu internet a fondo",
          body:
            "Haz una prueba de velocidad a la misma hora del partido. Reinicia tu router. Si varias personas van a transmitir, conecta la TV principal por cable ethernet para que el videojuego de un adolescente no tumbe la señal.",
        },
        {
          title: "Paso 3 — Planea el menú según el horario del partido",
          body:
            "Elige comida que aguante 45 minutos — alitas, empanadas, nachos, pizza. Ten todo listo 30 minutos antes del pitazo. Bebidas al alcance de la mano. Nadie debería estar en la cocina cuando cae un gol.",
        },
        {
          title: "Paso 4 — Organiza invitados y asientos por equipo",
          body:
            "Mezclar fans rivales es divertido — pero asigna lugares. Los más gritones en los extremos, las familias con niños atrás, y deja libre el camino al baño. Pon regla de no-spoilers para quien lo vea diferido.",
        },
        {
          title: "Paso 5 — Ten un plan B para cuando algo falle",
          body:
            "Las apps se caen. La luz se va. Ten un segundo dispositivo listo (una tablet sirve), la radio en vivo del canal guardada y un teléfono cargado con datos móviles como hotspot. Cinco minutos de preparación salvan la noche.",
        },
      ],
      outro:
        "Una buena reunión para ver fútbol es 80% preparación y 20% fútbol. Repasa esta lista unos días antes de cada partido y vivirás el juego disfrutándolo — no arreglándolo. ¡Que gane el mejor!",
      keywords:
        "ver Mundial en casa, fiesta Mundial 2026, preparación Mundial 2026, cómo organizar Mundial, lista Mundial 2026",
    },
  },
];

export function getBlogPost(slug: string, locale: "en" | "es"): BlogPost | null {
  return (
    BLOG_POSTS.find((p) => (locale === "es" ? p.slug_es : p.slug_en) === slug) ?? null
  );
}

const BLOG_MONTHS = {
  en: {
    short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  es: {
    short: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    long: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  },
} as const;

export function formatBlogDate(date: string, locale: "en" | "es", style: "short" | "long" = "short") {
  const [yearText, monthText, dayText] = date.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const monthName = BLOG_MONTHS[locale][style][month - 1];

  if (!year || !monthName || !day) return date;
  if (locale === "es") return style === "long" ? `${day} de ${monthName} de ${year}` : `${day} ${monthName} ${year}`;
  return `${monthName} ${day}, ${year}`;
}
