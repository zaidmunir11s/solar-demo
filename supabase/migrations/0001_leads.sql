-- Solar CRM demo: leads table + Row Level Security.
-- Run this once against your Supabase project (SQL Editor or `supabase db push`).

-- 1. Status is constrained by the database, not by the UI.
create type public.lead_status as enum ('new', 'contacted', 'signed');

-- 2. Leads table. Every lead belongs to exactly one auth.users row.
create table public.leads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  name       text not null check (char_length(trim(name)) between 1 and 200),
  email      text check (email is null or char_length(email) <= 200),
  phone      text check (phone is null or char_length(phone) <= 50),
  status     public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_user_id_created_at_idx
  on public.leads (user_id, created_at desc);

-- 3. Keep updated_at honest.
create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- 4. Row Level Security. Without a matching policy, no row is visible or
--    writable - the default is deny.
alter table public.leads enable row level security;

-- SELECT: a user only ever sees rows they own. This is what makes
-- /leads/<someone-elses-id> return nothing instead of another user's data.
create policy "leads_select_own"
  on public.leads for select
  to authenticated
  using (auth.uid() = user_id);

-- INSERT: the new row must be owned by the caller. Submitting another user's
-- id as user_id fails the WITH CHECK and the insert is rejected.
create policy "leads_insert_own"
  on public.leads for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE: USING decides which rows may be updated (only your own), WITH CHECK
-- decides what the row may look like afterwards (still your own), so ownership
-- cannot be handed over to another user.
create policy "leads_update_own"
  on public.leads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE: only your own leads.
create policy "leads_delete_own"
  on public.leads for delete
  to authenticated
  using (auth.uid() = user_id);

-- Note: the `anon` role is granted no policy at all, so a signed out visitor
-- reads and writes nothing, even with the public anon key.
