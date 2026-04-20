
# MatchLiveNow.com — Full v1 Build Plan

A bilingual (EN/ES) FIFA World Cup 2026 streaming directory. Read-heavy, edge-cached, optimized for traffic spikes.

## Stack adaptation
Lovable runs on **TanStack Start + Cloudflare Workers** (not Next.js). Functionally equivalent:
- File-based routing in `src/routes/`
- `createServerFn` for server logic, server routes for `/api/*`, sitemaps, robots
- HTTP `Cache-Control` + Cloudflare edge caching replace Next.js ISR (same UX outcome)
- Per-route `head()` for SEO, JSON-LD via `scripts`
- Lovable Cloud (Supabase) for DB and cron-style scheduled functions

## Database (Lovable Cloud)
Tables with RLS (public read, service-role writes):
- **fixtures** — match data, bilingual slugs/meta, status, scores
- **teams** — 48 World Cup teams, bilingual names/slugs, group letter
- **channels** — TV/streaming per country, affiliate URL, free/paid flag
- **countries** — supported countries, bilingual slugs/meta
- **affiliate_clicks** — lightweight tracking (insert-only public)

Indexes on slugs, country_code, match_date, status. Seeded with 48 teams, sample fixtures across all groups, and channels for: USA, UK, Canada, Australia, Mexico, Spain, Argentina, Colombia, Brazil, France, Germany, Italy, Japan, South Korea, India, Saudi Arabia, Qatar.

## Routes
- `/` → redirects to `/en` or `/es` based on geo
- `/$locale/` — Homepage: hero + countdown, Live Now, Upcoming, group filter pills, country selector
- `/$locale/watch-$slug` (EN) and `/$locale/ver-$slug` (ES) — Match page with channels, VPN upsell, betting sidebar, related matches
- `/$locale/team/$slug` — Team page: upcoming + past results
- `/$locale/how-to-watch-world-cup-in-$slug` (EN) / `/$locale/donde-ver-mundial-en-$slug` (ES) — Country guide with full channel list, schedule, FAQ
- `/$locale/privacy-policy`, `/$locale/terms`, `/$locale/responsible-gambling`
- `/sitemap-en.xml`, `/sitemap-es.xml`, `/sitemap-index.xml`, `/robots.txt`
- `/api/track-click` — fire-and-forget affiliate click logging

## Design system
Dark-only theme. Pitch black `#0A0A0F` bg, surface `#111118`, Signal Red `#E63946` accent, success green `#10B981` for live. Barlow Condensed (uppercase) for headings, Inter for body, JetBrains Mono for scores. Card-based layout, 12px radius, subtle borders, pulsing live dot.

## Bilingual (i18n)
- `$locale` route segment, locale-specific slugs in DB (`slug_en` / `slug_es`)
- Translation JSON files (`en.json`, `es.json`) for UI labels
- `hreflang` alternates on every page
- Language switcher links to the equivalent page in the other locale
- Default to Spanish for LATAM + Spain, English elsewhere

## Geolocation
- Read `CF-IPCountry` header server-side, set `user_country` cookie
- Country override dropdown persists per session
- All channel listings filter by detected country

## SEO
- Per-route `head()` with unique title, description, OG, Twitter, canonical, hreflang
- JSON-LD: Organization + WebSite (home), SportsEvent + BroadcastEvent (matches), SportsTeam (teams), FAQPage (country guides)
- Dynamic sitemaps generated from DB
- Edge cache headers (60s home, 120s matches, 1h teams, immutable for legal)

## Monetization
- Affiliate UTM builder (`?utm_source=matchlivenow&utm_medium=affiliate&utm_campaign=worldcup2026&utm_content={page}_{match}_{country}`)
- Placeholder URLs in DB seed (NordVPN, ExpressVPN, bet365, etc.) — swappable later
- VPN upsell banner shown only when no free channel exists in user's country
- Betting sidebar geo-filtered
- 3 AdSlot components per page (leaderboard / rectangle / responsive) — render only after consent + when AdSense client ID env var is set
- GDPR cookie consent banner ("Accept All" / "Essential Only"), persisted to cookie
- GA4 hooks for `affiliate_click`, `country_change`, `language_switch`, `match_filter`, `channel_view` — activate when GA4 measurement ID env var is set

## Performance
- Server-rendered HTML cached at the edge via `Cache-Control: public, s-maxage=...`
- Lazy-loaded images for flags/logos
- Preloaded fonts
- Skeleton states on dynamic sections
- Minimal JS bundle (Tailwind only, no heavy UI libs beyond shadcn)

## Deferred (need from you later)
- Real API-Football key → wire `sync-fixtures` and `sync-live-scores` cron functions
- Real affiliate URLs → swap placeholders in DB
- AdSense publisher ID + GA4 measurement ID → drop into env, slots/tracking go live
