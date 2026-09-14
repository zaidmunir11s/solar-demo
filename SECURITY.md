# Security: how user data isolation works

The whole point of this demo is that account A can never reach account B's
leads. This document explains where that is enforced.

## 1. How users are associated with leads

`public.leads` has a `user_id uuid not null references auth.users (id)` column
with the default `auth.uid()`.

`auth.uid()` is derived from the JWT that Supabase attaches to the request, so
the owner of a lead is decided by the database from the caller's verified
session - never by anything the browser sends.

The application never sends a `user_id`. The TypeScript `Insert`/`Update` types
in [`lib/types.ts`](lib/types.ts) deliberately do not contain the field, so the
code cannot even express it.

## 2. Row Level Security is the boundary

`alter table public.leads enable row level security;` makes the default *deny*:
without a policy that matches, a row is invisible and unwritable. The four
policies live in
[`supabase/migrations/0001_leads.sql`](supabase/migrations/0001_leads.sql) and
are all granted to the `authenticated` role only - the `anon` role has no
policy, so a signed out visitor with the public publishable key gets nothing.

### SELECT

```sql
create policy "leads_select_own" on public.leads for select
  to authenticated using (auth.uid() = user_id);
```

Every read is rewritten by Postgres to include `auth.uid() = user_id`. The
application code does not need a `user_id` filter, and forgetting one cannot
open a hole.

### INSERT

```sql
create policy "leads_insert_own" on public.leads for insert
  to authenticated with check (auth.uid() = user_id);
```

`WITH CHECK` is evaluated against the row being written. Posting somebody
else's uuid as `user_id` fails the check and the insert is rejected.

### UPDATE

```sql
create policy "leads_update_own" on public.leads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

`USING` decides which rows may be updated - only your own. `WITH CHECK` decides
what the row may look like afterwards - still your own. So a user can neither
modify another user's lead nor hand one of their own leads to another user.

### DELETE

```sql
create policy "leads_delete_own" on public.leads for delete
  to authenticated using (auth.uid() = user_id);
```

## 3. Why changing the lead ID in the URL does not help

`/leads/[id]` runs this query
([`app/leads/[id]/page.tsx`](app/leads/%5Bid%5D/page.tsx)):

```ts
const { data: lead, error } = await supabase
  .from("leads")
  .select("*")
  .eq("id", id)
  .maybeSingle();

if (error || !lead) {
  notFound();
}
```

The query filters on the lead id only. Ownership is applied one level deeper by
the SELECT policy, so a lead belonging to another user is not in the result set
for this caller: `maybeSingle()` returns `null` and the page renders the normal
404.

The response for "someone else's lead" and "no such lead" is therefore
identical - not even the existence of the other user's lead is leaked.

## 4. Server actions

The three lead actions in [`app/leads/actions.ts`](app/leads/actions.ts)
(`createLead`, `updateLeadStatus`, `deleteLead`) build their Supabase client
from the caller's own auth cookies, so they run as that user and the same
policies apply. Calling `updateLeadStatus("<lead id of another user>", "signed")`
directly matches zero rows and returns "Lead not found".

They also start with `requireUser()`, which calls `supabase.auth.getUser()` -
that verifies the JWT against the Supabase Auth server, unlike `getSession()`,
which only reads the cookie.

## 5. What is *not* a security control here

- `proxy.ts` redirects signed out visitors to `/login`. That is UX. It is not
  relied on for data protection; bypassing it still gets you nothing.
- Grouping and rendering in React. The filtering that matters happens in
  Postgres.

## 6. Keys

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are used.
Both are public by design and safe in the browser, because RLS decides what the
key may read or write. The `service_role` key bypasses RLS and is not used
anywhere in this project.
