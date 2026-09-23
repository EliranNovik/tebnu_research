-- Run this in the Supabase SQL editor after creating the project.
-- Enable Email auth in Authentication → Providers.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  questionnaire_version text not null default '1.0',
  language text not null default 'en',
  device_type text,
  user_agent text,
  submitted_at timestamptz not null default now()
);

create table if not exists public.survey_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  event text not null,
  question_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin',
  active boolean not null default true
);

alter table public.survey_responses enable row level security;
alter table public.survey_events enable row level security;
alter table public.admins enable row level security;

-- No public policies. The Node API uses the service role key, which bypasses RLS.
-- The browser anon key cannot read or write these tables.

-- After creating an admin user in Authentication, insert their user id:
-- insert into public.admins (id, role, active) values ('USER_UUID', 'admin', true);

-- Live dashboard updates. Safe to run more than once.
do $$
begin
  alter publication supabase_realtime add table public.survey_responses;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.survey_events;
exception
  when duplicate_object then null;
end $$;
