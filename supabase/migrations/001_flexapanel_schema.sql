-- FlexaPanel Supabase schema
-- Run this file once in Supabase SQL Editor or with `supabase db push`.

create extension if not exists pgcrypto;

create table if not exists public.flexapanel_records (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.flexapanel_records replica identity full;

create index if not exists flexapanel_records_updated_at_idx
on public.flexapanel_records (updated_at desc);

create index if not exists flexapanel_records_value_gin_idx
on public.flexapanel_records using gin (value);

alter table public.flexapanel_records enable row level security;

drop policy if exists "flexapanel_anon_select" on public.flexapanel_records;
drop policy if exists "flexapanel_anon_insert" on public.flexapanel_records;
drop policy if exists "flexapanel_anon_update" on public.flexapanel_records;
drop policy if exists "flexapanel_anon_delete" on public.flexapanel_records;

-- This project currently uses the public anon key from a browser-only app.
-- For maximum production security, move writes to Supabase Edge Functions with service-role secrets.
create policy "flexapanel_anon_select"
on public.flexapanel_records
for select
to anon
using (true);

create policy "flexapanel_anon_insert"
on public.flexapanel_records
for insert
to anon
with check (true);

create policy "flexapanel_anon_update"
on public.flexapanel_records
for update
to anon
using (true)
with check (true);

create policy "flexapanel_anon_delete"
on public.flexapanel_records
for delete
to anon
using (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists flexapanel_records_set_updated_at on public.flexapanel_records;
create trigger flexapanel_records_set_updated_at
before update on public.flexapanel_records
for each row execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'flexapanel_records'
  ) then
    alter publication supabase_realtime add table public.flexapanel_records;
  end if;
end $$;