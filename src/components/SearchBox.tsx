import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Locale } from "@/lib/i18n";
import { localeUrl } from "@/lib/i18n";

interface SearchFixture {
  id: string;
  match_date: string;
  status: string;
  slug_en: string;
  slug_es: string;
  home_team: { name_en: string; name_es: string; country_code: string };
  away_team: { name_en: string; name_es: string; country_code: string };
}

export function SearchBox({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [all, setAll] = useState<SearchFixture[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Lazy-fetch fixtures on first open
  useEffect(() => {
    if (!open || all !== null || loading) return;
    setLoading(true);
    supabase
      .from("fixtures")
      .select(
        "id,match_date,status,slug_en,slug_es,home_team:teams!fixtures_home_team_id_fkey(name_en,name_es,country_code),away_team:teams!fixtures_away_team_id_fkey(name_en,name_es,country_code)"
      )
      .order("match_date", { ascending: true })
      .limit(500)
      .then(({ data }) => {
        setAll((data ?? []) as unknown as SearchFixture[]);
        setLoading(false);
      });
  }, [open, all, loading]);

  const query = q.trim().toLowerCase();
  const results =
    query.length >= 1 && all
      ? all
          .filter((f) => {
            const hay = [
              f.home_team.name_en,
              f.home_team.name_es,
              f.away_team.name_en,
              f.away_team.name_es,
              f.home_team.country_code,
              f.away_team.country_code,
            ]
              .join(" ")
              .toLowerCase();
            return hay.includes(query);
          })
          .slice(0, 8)
      : [];

  const openSearch = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label="Search"
        onClick={openSearch}
        className="text-foreground/90 hover:text-primary"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="square" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[88vw] max-w-md border border-primary bg-[var(--surface)] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="square" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={locale === "es" ? "Buscar equipo o partido..." : "Search team or match..."}
              className="w-full bg-transparent font-display text-sm uppercase tracking-wider text-foreground outline-none placeholder:text-muted-foreground/70"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear"
                className="text-muted-foreground hover:text-primary"
              >
                ×
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">
                {locale === "es" ? "Cargando..." : "Loading..."}
              </p>
            )}
            {!loading && query.length === 0 && (
              <p className="px-4 py-6 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">
                {locale === "es" ? "Escribe el nombre de un equipo" : "Type a team name"}
              </p>
            )}
            {!loading && query.length > 0 && results.length === 0 && (
              <p className="px-4 py-6 text-center font-display text-xs uppercase tracking-wider text-muted-foreground">
                {locale === "es" ? "Sin resultados" : "No results"}
              </p>
            )}
            <ul>
              {results.map((f) => {
                const slug = locale === "es" ? f.slug_es : f.slug_en;
                const home = locale === "es" ? f.home_team.name_es : f.home_team.name_en;
                const away = locale === "es" ? f.away_team.name_es : f.away_team.name_en;
                const date = new Date(f.match_date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                  day: "2-digit",
                  month: "short",
                  timeZone: "UTC",
                });
                return (
                  <li key={f.id} className="border-t border-border first:border-t-0">
                    <Link
                      to={localeUrl(locale, slug)}
                      onClick={() => {
                        setOpen(false);
                        setQ("");
                      }}
                      className="flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-primary/10"
                    >
                      <span className="font-display text-sm font-bold uppercase leading-tight text-foreground">
                        {home} <span className="text-primary">[VS]</span> {away}
                      </span>
                      <span className="shrink-0 font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        {f.status === "live" ? (locale === "es" ? "EN VIVO" : "LIVE") : date}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
