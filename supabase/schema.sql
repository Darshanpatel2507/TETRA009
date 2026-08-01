-- =====================================================================
-- Nirog — Supabase schema
--
-- Three tables: patients, risk_assessments, referrals.
-- Realtime publication is enabled on risk_assessments so the dashboard
-- can show new rows live (see supabase/realtime.sql).
--
-- This file is safe to run repeatedly (idempotent CREATE IF NOT EXISTS).
-- =====================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------
-- patients
-- -----------------------------------------------------------------
create table if not exists public.patients (
  id          uuid        primary key default gen_random_uuid(),
  full_name   text        not null,
  age         int         not null check (age > 0 and age < 130),
  sex         char(1)     not null check (sex in ('M','F')),
  village     text,
  phone       text,
  portal_type text        default 'community',
  family_code text,
  relationship text,
  created_at  timestamptz not null default now()
);

-- Idempotent upgrades for pre-existing deployments
alter table public.patients add column if not exists portal_type text default 'community';
alter table public.patients add column if not exists family_code text;
alter table public.patients add column if not exists relationship text;

-- -----------------------------------------------------------------
-- risk_assessments
-- `scores`, `factors`, `gap_labs`, `specialist`, `decision` are JSONB
-- because the schemas are rich and app-driven. The minimal column-
-- level checks we can do at the DB are: band ∈ {low,moderate,high,critical}.
-- -----------------------------------------------------------------
create table if not exists public.risk_assessments (
  id           uuid        primary key default gen_random_uuid(),
  patient_id   uuid        not null references public.patients(id) on delete cascade,
  assessed_at  timestamptz not null default now(),
  band         text        not null check (band in ('low','moderate','high','critical')),
  scores       jsonb       not null,
  factors      jsonb       not null,
  gap_labs     jsonb       not null,
  specialist   jsonb       not null,
  decision     jsonb       not null,
  confidence   text        not null check (confidence in ('lab-confirmed','screened')),
  notes        text
);
create index if not exists risk_assessments_patient_id_idx on public.risk_assessments(patient_id);
create index if not exists risk_assessments_assessed_at_idx on public.risk_assessments(assessed_at desc);

-- -----------------------------------------------------------------
-- referrals
-- -----------------------------------------------------------------
create table if not exists public.referrals (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references public.patients(id) on delete cascade,
  assessment_id uuid        not null references public.risk_assessments(id) on delete cascade,
  specialist    text        not null,
  status        text        not null default 'pending' check (status in ('pending','sent','completed')),
  created_at    timestamptz not null default now(),
  notes         text
);
create index if not exists referrals_patient_id_idx on public.referrals(patient_id);

-- -----------------------------------------------------------------
-- RLS — anon key is public, so we lock down everything to nothing
-- by default. The seed script uses the service-role key (bypasses RLS)
-- and the app is run unauthenticated for this pass — so we allow
-- anon read/write on the three tables. Tighten with policies in
-- production.
-- -----------------------------------------------------------------
alter table public.patients         enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.referrals        enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where polname = 'anon_all_patients') then
    create policy anon_all_patients on public.patients for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'anon_all_risk_assessments') then
    create policy anon_all_risk_assessments on public.risk_assessments for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'anon_all_referrals') then
    create policy anon_all_referrals on public.referrals for all to anon using (true) with check (true);
  end if;
end $$;
