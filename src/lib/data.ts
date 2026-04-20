import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: string;
  name_en: string;
  name_es: string;
  slug_en: string;
  slug_es: string;
  country_code: string;
  flag_url: string | null;
  group_letter: string | null;
}

export interface Fixture {
  id: string;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  venue: string | null;
  city: string | null;
  round: string | null;
  slug_en: string;
  slug_es: string;
  meta_title_en: string | null;
  meta_title_es: string | null;
  meta_description_en: string | null;
  meta_description_es: string | null;
  home_team: Team;
  away_team: Team;
}

export interface Channel {
  id: string;
  country_code: string;
  channel_name: string;
  channel_type: string;
  channel_url: string | null;
  logo_url: string | null;
  is_free: boolean;
  affiliate_url: string | null;
  affiliate_partner: string | null;
  sort_order: number;
}

export interface Country {
  code: string;
  name_en: string;
  name_es: string;
  slug_en: string;
  slug_es: string;
  language_default: string;
  flag_emoji: string | null;
  meta_title_en: string | null;
  meta_title_es: string | null;
  meta_description_en: string | null;
  meta_description_es: string | null;
}

const FIXTURE_SELECT = `
  id, match_date, status, home_score, away_score, venue, city, round,
  slug_en, slug_es, meta_title_en, meta_title_es, meta_description_en, meta_description_es,
  home_team:teams!fixtures_home_team_id_fkey(id,name_en,name_es,slug_en,slug_es,country_code,flag_url,group_letter),
  away_team:teams!fixtures_away_team_id_fkey(id,name_en,name_es,slug_en,slug_es,country_code,flag_url,group_letter)
`;

function setCache(seconds: number) {
  try {
    setResponseHeader(
      "Cache-Control",
      `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 4}`
    );
  } catch {
    /* not in request context */
  }
}

export const getHomepageData = createServerFn({ method: "GET" }).handler(async () => {
  setCache(60);
  const { data: live } = await supabase
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .eq("status", "live")
    .order("match_date", { ascending: true });
  const { data: upcoming } = await supabase
    .from("fixtures")
    .select(FIXTURE_SELECT)
    .in("status", ["scheduled"])
    .order("match_date", { ascending: true })
    .limit(24);
  return {
    live: (live ?? []) as unknown as Fixture[],
    upcoming: (upcoming ?? []) as unknown as Fixture[],
  };
});

export const getFixtureBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; locale: "en" | "es" }) => input)
  .handler(async ({ data }) => {
    setCache(120);
    const column = data.locale === "es" ? "slug_es" : "slug_en";
    const { data: fixture } = await supabase
      .from("fixtures")
      .select(FIXTURE_SELECT)
      .eq(column, data.slug)
      .maybeSingle();
    if (!fixture) return { fixture: null, channels: [], related: [] };
    const f = fixture as unknown as Fixture;
    const { data: channels } = await supabase
      .from("channels")
      .select("*")
      .order("sort_order", { ascending: true });
    const { data: related } = await supabase
      .from("fixtures")
      .select(FIXTURE_SELECT)
      .eq("round", f.round ?? "")
      .neq("id", f.id)
      .order("match_date", { ascending: true })
      .limit(6);
    return {
      fixture: f,
      channels: (channels ?? []) as unknown as Channel[],
      related: (related ?? []) as unknown as Fixture[],
    };
  });

export const getTeamBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; locale: "en" | "es" }) => input)
  .handler(async ({ data }) => {
    setCache(3600);
    const column = data.locale === "es" ? "slug_es" : "slug_en";
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq(column, data.slug)
      .maybeSingle();
    if (!team) return { team: null, upcoming: [], past: [] };
    const t = team as unknown as Team;
    const { data: matches } = await supabase
      .from("fixtures")
      .select(FIXTURE_SELECT)
      .or(`home_team_id.eq.${t.id},away_team_id.eq.${t.id}`)
      .order("match_date", { ascending: true });
    const all = (matches ?? []) as unknown as Fixture[];
    const now = Date.now();
    return {
      team: t,
      upcoming: all.filter((m) => new Date(m.match_date).getTime() >= now),
      past: all.filter((m) => new Date(m.match_date).getTime() < now),
    };
  });

export const getCountryBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string; locale: "en" | "es" }) => input)
  .handler(async ({ data }) => {
    setCache(3600);
    const column = data.locale === "es" ? "slug_es" : "slug_en";
    const { data: country } = await supabase
      .from("countries")
      .select("*")
      .eq(column, data.slug)
      .maybeSingle();
    if (!country) return { country: null, channels: [], fixtures: [] };
    const c = country as unknown as Country;
    const { data: channels } = await supabase
      .from("channels")
      .select("*")
      .eq("country_code", c.code)
      .order("sort_order", { ascending: true });
    const { data: fixtures } = await supabase
      .from("fixtures")
      .select(FIXTURE_SELECT)
      .order("match_date", { ascending: true })
      .limit(50);
    return {
      country: c,
      channels: (channels ?? []) as unknown as Channel[],
      fixtures: (fixtures ?? []) as unknown as Fixture[],
    };
  });

export const getAllSlugs = createServerFn({ method: "GET" }).handler(async () => {
  const [{ data: fixtures }, { data: teams }, { data: countries }] = await Promise.all([
    supabase.from("fixtures").select("slug_en,slug_es,updated_at"),
    supabase.from("teams").select("slug_en,slug_es"),
    supabase.from("countries").select("slug_en,slug_es"),
  ]);
  return { fixtures: fixtures ?? [], teams: teams ?? [], countries: countries ?? [] };
});
