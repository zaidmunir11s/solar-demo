# Zonnestroom CRM (demo)

A small CRM for a fictional solar panel installer, built as a take-home demo.
A signed in user can add leads and move them through **New → Contacted →
Signed**. Each lead has its own page at `/leads/<uuid>`.

The point of the demo is user-level data isolation: a user only ever sees and
edits their own leads, including when they change the lead id in the URL or
call the server action directly. See [SECURITY.md](SECURITY.md).

## Tech stack

- Next.js 16 (App Router, Server Components, Server Actions) + TypeScript
- Supabase: Postgres, Auth, Row Level Security
- `@supabase/ssr` for cookie-based sessions
- Tailwind CSS v4
- Deployed on Vercel

## Project layout

| Path | What it does |
| --- | --- |
| `supabase/migrations/0001_leads.sql` | `leads` table, enum, trigger, RLS policies |
| `lib/supabase/server.ts` | per-request Supabase client + `requireUser()` |
| `lib/types.ts` | `Lead`, `LeadStatus`, the minimal `Database` type, `ActionState` |
| `proxy.ts` | refreshes auth cookies, redirects (UX, not the security boundary) |
| `app/auth/actions.ts` | sign up / log in / log out server actions |
| `app/leads/actions.ts` | create / update status / delete server actions |
| `app/leads/page.tsx` | fetches the user's leads, renders the board |
| `app/leads/[id]/page.tsx` | single lead page, not-found for leads you do not own |
| `app/leads/[id]/not-found.tsx` | shared "Lead not found" screen (missing *and* not yours) |
| `app/leads/loading.tsx`, `app/leads/[id]/loading.tsx` | instant loading skeletons |
| `components/lead-board.tsx` | client board, optimistic status moves via `useOptimistic` |
| `components/lead-detail.tsx` | client lead page, optimistic badge + dropdown |
| `components/lead-card.tsx`, `status-select.tsx`, `status-badge.tsx` | presentational pieces |
| `components/add-lead-form.tsx`, `auth-form.tsx` | forms built on `useActionState` |
| `components/ui/` | Button, Field/Input/Select, ErrorAlert - the shared primitives |
| `components/icons.tsx` | inline icon set |
| `lib/use-lead-status.ts` | shared optimistic status-change behaviour |
| `lib/action-error.ts` | keeps a failed server action from rejecting uncaught |
| `lib/cn.ts` | class-name joiner |

## Environment variables

Copy `.env.example` to `.env.local` and fill in both values from the Supabase
dashboard (Project Settings → API Keys):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key, e.g. sb_publishable_…>
```

Both are public by design. The `service_role` key is not used and must never be
added here. `.env.local` is gitignored.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run the contents of
   `supabase/migrations/0001_leads.sql` once.
   (With the Supabase CLI linked to the project: `supabase db push`.)
3. **Authentication → Sign In / Providers → Email**: turn **Confirm email**
   off, so the two test accounts can log in immediately. Password reset, OAuth
   and email verification flows are intentionally not part of this demo.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Other commands:

```bash
pnpm build          # production build (also runs the TypeScript check)
pnpm lint
```

## How authentication works

- Sign up and log in are server actions that call
  `supabase.auth.signUp` / `signInWithPassword`. `@supabase/ssr` writes the
  session as httpOnly cookies.
- `proxy.ts` runs on every request, refreshes those cookies and redirects
  signed out visitors away from `/leads`.
- Server code always identifies the user with `supabase.auth.getUser()`, which
  verifies the JWT with Supabase, rather than `getSession()`, which only reads
  the cookie.
- After signing up or logging in the user lands on `/leads`; logging out
  returns to `/login`.

## Security / RLS

Short version: `leads.user_id` defaults to `auth.uid()`, RLS is enabled on the
table, and the four policies (`select`, `insert`, `update`, `delete`) all
require `auth.uid() = user_id`. The database — not React, not the proxy — is
what stops cross-user access.

Full explanation, including why changing the lead ID in the URL cannot bypass
it: [SECURITY.md](SECURITY.md).

## Testing account A vs account B

Two accounts are needed. Sign up two of your own email addresses, or use the
seeded demo accounts (password `TestAccount#2026`):
`accounta@solardemo.test` and `accountb@solardemo.test`.

1. Log in as **Account A**, add a lead ("Lead A").
2. Open that lead and copy its id from the URL.
3. Log out. Log in as **Account B**, add a lead ("Lead B").
4. Confirm B's board shows only Lead B.
5. Paste A's lead id into the URL: `/leads/<lead A id>` → 404 page, no data.
6. Log out, log back in as A, and do the mirror check with B's lead id.

To test past the UI, from the browser console while logged in as B:

```js
await fetch("/leads/<lead A id>").then((r) => r.status); // 404
```

Or straight against the API with B's session (RLS applies there too):

```bash
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/leads?id=eq.<lead A id>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer <account B access token>"
# -> []
```

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as
   environment variables (Production + Preview). They are inlined at build
   time, so they must be set before the build.
3. Deploy. No extra Supabase configuration is required for the deployed URL,
   because this demo uses password auth only — there are no OAuth or email
   redirect URLs to allow-list.

## Limitations

This is a demo, deliberately kept small. No password reset, no OAuth, no roles
or teams, no search, filtering, pagination or analytics. Leads are private to a
single user; there is no sharing model.
