import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/types";

import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * The client is built per request from the user's auth cookies, so every query
 * it makes runs as that user and is filtered by Row Level Security.
 *
 * Wrapped in React cache() so the layout, the page and any action within the
 * same request share one client instead of rebuilding it each time.
 */
export const createClient = cache(async () => {
  // cookies() is awaited first so the caller is treated as a dynamic route
  // before anything else can throw.
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. Refreshing the session is
          // handled by proxy.ts, so this can be safely ignored.
        }
      },
    },
  });
});

/**
 * Returns the signed in user, or redirects to /login.
 *
 * Uses getUser(), which verifies the JWT with the Supabase Auth server -
 * getSession() only reads the cookie and must not be trusted on the server.
 *
 * Also cached per request: /leads renders both the layout and the page, and
 * without this that would be two round-trips to Supabase for the same user.
 */
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
});
