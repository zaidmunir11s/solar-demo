import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeftIcon } from "@/components/icons";
import { LeadDetail } from "@/components/lead-detail";
import { requireUser } from "@/lib/supabase/server";

export const metadata = { title: "Lead" };

export default async function LeadDetailPage({
  params,
}: PageProps<"/leads/[id]">) {
  const { id } = await params;
  const { supabase } = await requireUser();

  // *** This is the data isolation point for /leads/<id>. ***
  //
  // The query filters on the lead id only. Ownership is enforced one level
  // deeper, by the RLS SELECT policy (auth.uid() = user_id), so a lead that
  // belongs to another user is simply not in the result set for this caller.
  // maybeSingle() then yields null and we render the not-found page - the
  // response is identical to a lead id that does not exist at all, so nothing
  // about the other user's data leaks, not even its existence.
  //
  // An invalid uuid makes Postgres return an error, which lands here as well.
  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !lead) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeftIcon className="size-4" />
        Back to leads
      </Link>

      <LeadDetail lead={lead} />
    </div>
  );
}
