import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t, localeUrl } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";

const COOKIE_NAME = "consent_v1";

function readConsent(): "all" | "essential" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return (m?.[1] as "all" | "essential" | null) ?? null;
}

function writeConsent(v: "all" | "essential") {
  document.cookie = `${COOKIE_NAME}=${v}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function CookieConsent({ locale }: { locale: Locale }) {
  const m = t(locale);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(readConsent() === null);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-border bg-card p-4 shadow-2xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h3 className="text-base">{m.cookies.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {m.cookies.body}{" "}
            <Link to={localeUrl(locale, "/privacy-policy")} className="underline hover:text-primary">
              {m.cookies.privacy}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              writeConsent("essential");
              setShow(false);
            }}
            className="rounded-md border border-border px-3 py-2 text-xs font-bold uppercase tracking-wider hover:border-primary"
          >
            {m.cookies.essential}
          </button>
          <button
            onClick={() => {
              writeConsent("all");
              setShow(false);
            }}
            className="rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            {m.cookies.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
