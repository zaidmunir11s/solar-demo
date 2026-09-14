import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Next.js proxy (previously called middleware).
 *
 * Two jobs:
 *  1. Refresh the Supabase auth cookies, because Server Components cannot
 *     write cookies themselves.
 *  2. Send signed out visitors to /login and signed in users away from the
 *     auth pages.
 *
 * This is a convenience/UX layer, NOT the security boundary. Every page and
 * every server action re-checks the user, and Row Level Security in Postgres
 * is what actually keeps one user's leads away from another.
 */
export default async function proxy(request: NextRequest) {
  const { url, publishableKey } = getSupabaseEnv();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!user && pathname.startsWith("/leads")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthPage) {
    const leadsUrl = request.nextUrl.clone();
    leadsUrl.pathname = "/leads";
    return NextResponse.redirect(leadsUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets and image files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
