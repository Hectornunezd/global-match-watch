
ALTER TABLE public.fixtures REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fixtures;
