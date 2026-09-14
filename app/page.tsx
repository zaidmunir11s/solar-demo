import Link from "next/link";
import { redirect } from "next/navigation";

import { SunIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const STEPS = [
  { title: "New", description: "Leads from the website and comparison sites." },
  { title: "Contacted", description: "First call or quote has gone out." },
  { title: "Signed", description: "Installation is booked in." },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/leads");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
          <SunIcon className="size-6" />
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Zonnestroom CRM
        </h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          A small lead tracker for a solar panel installer. Every user sees only
          their own leads.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className={buttonClasses("primary", "px-5 py-2.5")}>
            Log in
          </Link>
          <Link
            href="/signup"
            className={buttonClasses("secondary", "px-5 py-2.5")}
          >
            Sign up
          </Link>
        </div>

        <ul className="mt-14 grid gap-3 text-left sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="text-xs font-medium text-slate-400">
                Stage {index + 1}
              </span>
              <h2 className="mt-1 font-medium text-slate-900">{step.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{step.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
