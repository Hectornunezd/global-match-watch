
-- Teams
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_football_id INTEGER UNIQUE,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  slug_en TEXT NOT NULL UNIQUE,
  slug_es TEXT NOT NULL UNIQUE,
  country_code TEXT NOT NULL,
  flag_url TEXT,
  group_letter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_teams_slug_en ON public.teams(slug_en);
CREATE INDEX idx_teams_slug_es ON public.teams(slug_es);
CREATE INDEX idx_teams_group ON public.teams(group_letter);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams are publicly readable" ON public.teams FOR SELECT USING (true);

-- Fixtures
CREATE TABLE public.fixtures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_football_id INTEGER UNIQUE,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  competition TEXT NOT NULL DEFAULT 'FIFA World Cup 2026',
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','finished','postponed')),
  home_score INTEGER,
  away_score INTEGER,
  venue TEXT,
  city TEXT,
  round TEXT,
  slug_en TEXT NOT NULL UNIQUE,
  slug_es TEXT NOT NULL UNIQUE,
  meta_title_en TEXT,
  meta_title_es TEXT,
  meta_description_en TEXT,
  meta_description_es TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_fixtures_match_date ON public.fixtures(match_date);
CREATE INDEX idx_fixtures_status ON public.fixtures(status);
CREATE INDEX idx_fixtures_slug_en ON public.fixtures(slug_en);
CREATE INDEX idx_fixtures_slug_es ON public.fixtures(slug_es);

ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fixtures are publicly readable" ON public.fixtures FOR SELECT USING (true);

-- Countries
CREATE TABLE public.countries (
  code TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  slug_en TEXT NOT NULL UNIQUE,
  slug_es TEXT NOT NULL UNIQUE,
  language_default TEXT NOT NULL DEFAULT 'en' CHECK (language_default IN ('en','es')),
  flag_emoji TEXT,
  meta_title_en TEXT,
  meta_title_es TEXT,
  meta_description_en TEXT,
  meta_description_es TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_countries_slug_en ON public.countries(slug_en);
CREATE INDEX idx_countries_slug_es ON public.countries(slug_es);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Countries are publicly readable" ON public.countries FOR SELECT USING (true);

-- Channels
CREATE TABLE public.channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('tv','streaming','free','paid')),
  channel_url TEXT,
  logo_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  affiliate_url TEXT,
  affiliate_partner TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_channels_country ON public.channels(country_code);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Channels are publicly readable" ON public.channels FOR SELECT USING (true);

-- Affiliate clicks
CREATE TABLE public.affiliate_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fixture_id UUID REFERENCES public.fixtures(id) ON DELETE SET NULL,
  country_code TEXT,
  affiliate_partner TEXT,
  channel_name TEXT,
  page_type TEXT CHECK (page_type IN ('match','team','country','home')),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_clicks_clicked_at ON public.affiliate_clicks(clicked_at);

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record clicks" ON public.affiliate_clicks FOR INSERT WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_fixtures_updated_at
BEFORE UPDATE ON public.fixtures
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
