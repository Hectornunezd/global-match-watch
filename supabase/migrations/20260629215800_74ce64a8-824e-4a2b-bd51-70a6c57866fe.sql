
-- Insert 32 placeholder teams for Round of 32 bracket slots (TBD pending group stage)
INSERT INTO public.teams (name_en, name_es, slug_en, slug_es, country_code, flag_url, group_letter) VALUES
('Winner Group A', 'Ganador Grupo A', 'winner-group-a', 'ganador-grupo-a', 'TBD', NULL, 'A'),
('Winner Group B', 'Ganador Grupo B', 'winner-group-b', 'ganador-grupo-b', 'TBD', NULL, 'B'),
('Winner Group C', 'Ganador Grupo C', 'winner-group-c', 'ganador-grupo-c', 'TBD', NULL, 'C'),
('Winner Group D', 'Ganador Grupo D', 'winner-group-d', 'ganador-grupo-d', 'TBD', NULL, 'D'),
('Winner Group E', 'Ganador Grupo E', 'winner-group-e', 'ganador-grupo-e', 'TBD', NULL, 'E'),
('Winner Group F', 'Ganador Grupo F', 'winner-group-f', 'ganador-grupo-f', 'TBD', NULL, 'F'),
('Winner Group G', 'Ganador Grupo G', 'winner-group-g', 'ganador-grupo-g', 'TBD', NULL, 'G'),
('Winner Group H', 'Ganador Grupo H', 'winner-group-h', 'ganador-grupo-h', 'TBD', NULL, 'H'),
('Winner Group I', 'Ganador Grupo I', 'winner-group-i', 'ganador-grupo-i', 'TBD', NULL, 'I'),
('Winner Group J', 'Ganador Grupo J', 'winner-group-j', 'ganador-grupo-j', 'TBD', NULL, 'J'),
('Winner Group K', 'Ganador Grupo K', 'winner-group-k', 'ganador-grupo-k', 'TBD', NULL, 'K'),
('Winner Group L', 'Ganador Grupo L', 'winner-group-l', 'ganador-grupo-l', 'TBD', NULL, 'L'),
('Runner-up Group A', 'Segundo Grupo A', 'runnerup-group-a', 'segundo-grupo-a', 'TBD', NULL, 'A'),
('Runner-up Group B', 'Segundo Grupo B', 'runnerup-group-b', 'segundo-grupo-b', 'TBD', NULL, 'B'),
('Runner-up Group C', 'Segundo Grupo C', 'runnerup-group-c', 'segundo-grupo-c', 'TBD', NULL, 'C'),
('Runner-up Group D', 'Segundo Grupo D', 'runnerup-group-d', 'segundo-grupo-d', 'TBD', NULL, 'D'),
('Runner-up Group E', 'Segundo Grupo E', 'runnerup-group-e', 'segundo-grupo-e', 'TBD', NULL, 'E'),
('Runner-up Group F', 'Segundo Grupo F', 'runnerup-group-f', 'segundo-grupo-f', 'TBD', NULL, 'F'),
('Runner-up Group G', 'Segundo Grupo G', 'runnerup-group-g', 'segundo-grupo-g', 'TBD', NULL, 'G'),
('Runner-up Group H', 'Segundo Grupo H', 'runnerup-group-h', 'segundo-grupo-h', 'TBD', NULL, 'H'),
('Runner-up Group I', 'Segundo Grupo I', 'runnerup-group-i', 'segundo-grupo-i', 'TBD', NULL, 'I'),
('Runner-up Group J', 'Segundo Grupo J', 'runnerup-group-j', 'segundo-grupo-j', 'TBD', NULL, 'J'),
('Runner-up Group K', 'Segundo Grupo K', 'runnerup-group-k', 'segundo-grupo-k', 'TBD', NULL, 'K'),
('Runner-up Group L', 'Segundo Grupo L', 'runnerup-group-l', 'segundo-grupo-l', 'TBD', NULL, 'L'),
('Best 3rd Place #1', 'Mejor Tercero #1', 'best-third-1', 'mejor-tercero-1', 'TBD', NULL, NULL),
('Best 3rd Place #2', 'Mejor Tercero #2', 'best-third-2', 'mejor-tercero-2', 'TBD', NULL, NULL),
('Best 3rd Place #3', 'Mejor Tercero #3', 'best-third-3', 'mejor-tercero-3', 'TBD', NULL, NULL),
('Best 3rd Place #4', 'Mejor Tercero #4', 'best-third-4', 'mejor-tercero-4', 'TBD', NULL, NULL),
('Best 3rd Place #5', 'Mejor Tercero #5', 'best-third-5', 'mejor-tercero-5', 'TBD', NULL, NULL),
('Best 3rd Place #6', 'Mejor Tercero #6', 'best-third-6', 'mejor-tercero-6', 'TBD', NULL, NULL),
('Best 3rd Place #7', 'Mejor Tercero #7', 'best-third-7', 'mejor-tercero-7', 'TBD', NULL, NULL),
('Best 3rd Place #8', 'Mejor Tercero #8', 'best-third-8', 'mejor-tercero-8', 'TBD', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Insert 16 Round of 32 fixtures using FIFA's official bracket schedule
WITH t AS (
  SELECT slug_en, id FROM public.teams WHERE country_code = 'TBD'
)
INSERT INTO public.fixtures (home_team_id, away_team_id, competition, match_date, status, venue, city, round, slug_en, slug_es)
SELECT
  (SELECT id FROM t WHERE slug_en = m.home),
  (SELECT id FROM t WHERE slug_en = m.away),
  'FIFA World Cup 2026',
  m.kickoff::timestamptz,
  'scheduled',
  m.venue, m.city, 'Round of 32',
  m.slug_en, m.slug_es
FROM (VALUES
  ('winner-group-a','runnerup-group-b','2026-06-28 16:00:00+00','AT&T Stadium','Dallas','winner-a-vs-runnerup-b-2026-06-28','ganador-a-vs-segundo-b-2026-06-28'),
  ('winner-group-c','best-third-1','2026-06-28 19:00:00+00','Mercedes-Benz Stadium','Atlanta','winner-c-vs-best-third-1-2026-06-28','ganador-c-vs-mejor-tercero-1-2026-06-28'),
  ('winner-group-e','best-third-2','2026-06-28 20:00:00+00','SoFi Stadium','Los Angeles','winner-e-vs-best-third-2-2026-06-28','ganador-e-vs-mejor-tercero-2-2026-06-28'),
  ('winner-group-b','best-third-3','2026-06-28 23:00:00+00','Gillette Stadium','Boston','winner-b-vs-best-third-3-2026-06-28','ganador-b-vs-mejor-tercero-3-2026-06-28'),
  ('winner-group-d','runnerup-group-f','2026-06-29 16:00:00+00','BC Place','Vancouver','winner-d-vs-runnerup-f-2026-06-29','ganador-d-vs-segundo-f-2026-06-29'),
  ('runnerup-group-c','runnerup-group-e','2026-06-29 19:00:00+00','MetLife Stadium','New York / New Jersey','runnerup-c-vs-runnerup-e-2026-06-29','segundo-c-vs-segundo-e-2026-06-29'),
  ('winner-group-f','best-third-4','2026-06-29 20:00:00+00','Lincoln Financial Field','Philadelphia','winner-f-vs-best-third-4-2026-06-29','ganador-f-vs-mejor-tercero-4-2026-06-29'),
  ('winner-group-h','runnerup-group-g','2026-06-29 23:00:00+00','Hard Rock Stadium','Miami','winner-h-vs-runnerup-g-2026-06-29','ganador-h-vs-segundo-g-2026-06-29'),
  ('winner-group-g','best-third-5','2026-06-30 16:00:00+00','BMO Field','Toronto','winner-g-vs-best-third-5-2026-06-30','ganador-g-vs-mejor-tercero-5-2026-06-30'),
  ('runnerup-group-h','runnerup-group-i','2026-06-30 19:00:00+00','SoFi Stadium','Los Angeles','runnerup-h-vs-runnerup-i-2026-06-30','segundo-h-vs-segundo-i-2026-06-30'),
  ('winner-group-i','best-third-6','2026-06-30 20:00:00+00','NRG Stadium','Houston','winner-i-vs-best-third-6-2026-06-30','ganador-i-vs-mejor-tercero-6-2026-06-30'),
  ('winner-group-j','runnerup-group-l','2026-06-30 23:00:00+00','Estadio Azteca','Mexico City','winner-j-vs-runnerup-l-2026-06-30','ganador-j-vs-segundo-l-2026-06-30'),
  ('winner-group-l','runnerup-group-j','2026-07-01 16:00:00+00','Mercedes-Benz Stadium','Atlanta','winner-l-vs-runnerup-j-2026-07-01','ganador-l-vs-segundo-j-2026-07-01'),
  ('runnerup-group-d','runnerup-group-k','2026-07-01 19:00:00+00','Gillette Stadium','Boston','runnerup-d-vs-runnerup-k-2026-07-01','segundo-d-vs-segundo-k-2026-07-01'),
  ('winner-group-k','best-third-7','2026-07-01 20:00:00+00','AT&T Stadium','Dallas','winner-k-vs-best-third-7-2026-07-01','ganador-k-vs-mejor-tercero-7-2026-07-01'),
  ('runnerup-group-a','best-third-8','2026-07-01 23:00:00+00','Estadio BBVA','Monterrey','runnerup-a-vs-best-third-8-2026-07-01','segundo-a-vs-mejor-tercero-8-2026-07-01')
) AS m(home, away, kickoff, venue, city, slug_en, slug_es)
ON CONFLICT (slug_en) DO NOTHING;
