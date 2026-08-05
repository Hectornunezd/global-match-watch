ALTER TABLE public.fixtures
  ADD COLUMN IF NOT EXISTS matchday integer,
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'regular';

ALTER TABLE public.fixtures ALTER COLUMN competition SET DEFAULT 'Liga MX Apertura 2026';

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS short_code text,
  ADD COLUMN IF NOT EXISTS stadium text;

CREATE INDEX IF NOT EXISTS fixtures_matchday_idx ON public.fixtures (matchday);
CREATE INDEX IF NOT EXISTS fixtures_competition_idx ON public.fixtures (competition);