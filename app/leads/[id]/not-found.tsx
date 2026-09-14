import Link from "next/link";

import { ArrowLeftIcon, InboxIcon } from "@/components/icons";

/**
 * Rendered when the lead does not exist *for the signed in user*. That covers
 * a deleted lead, a typo, and a lead belonging to someone else - deliberately
 * the same screen for all three, so nothing is revealed about other accounts.
 */
export default function LeadNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
      <InboxIcon className="size-8 text-slate-300" />
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Lead not found</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        This lead does not exist, or it is not one of yours.
      </p>
      <Link
        href="/leads"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 underline underline-offset-4"
      >
        <ArrowLeftIcon className="size-4" />
        Back to leads
      </Link>
    </div>
  );
}
