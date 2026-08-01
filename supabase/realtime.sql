-- Enable realtime postgres_changes on risk_assessments so the
-- dashboard can subscribe to INSERTs and prepend rows live.
alter publication supabase_realtime add table public.risk_assessments;
