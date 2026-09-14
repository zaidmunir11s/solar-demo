import Link from "next/link";

import { SunIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteFooter } from "@/components/site-footer";
import { requireUser } from "@/lib/supabase/server";

export default async function LeadsLayout({ children }: LayoutProps<"/leads">) {
  const { user } = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/leads" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
              <SunIcon className="size-4.5" />
            </span>
            <span className="font-semibold tracking-tight text-slate-900">
              Zonnestroom CRM
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

      <SiteFooter />
    </div>
  );
}
