import { AddLeadForm } from "@/components/add-lead-form";
import { LeadBoard } from "@/components/lead-board";
import { ErrorAlert } from "@/components/ui/alert";
import { requireUser } from "@/lib/supabase/server";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const { supabase } = await requireUser();

  // No user_id filter is needed: the SELECT policy on public.leads restricts
  // this query to rows where auth.uid() = user_id.
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <ErrorAlert message="Could not load your leads. Please refresh the page." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Leads
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {leads.length === 0
            ? "No leads yet. Add your first one below."
            : `${leads.length} lead${leads.length === 1 ? "" : "s"} in your pipeline.`}
        </p>
      </div>

      <AddLeadForm />

      <LeadBoard leads={leads} />
    </div>
  );
}
