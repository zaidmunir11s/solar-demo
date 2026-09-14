"use client";

import { useOptimistic } from "react";

import { InboxIcon } from "@/components/icons";
import { LeadCard } from "@/components/lead-card";
import { STATUS_STYLES } from "@/components/status-badge";
import { ErrorAlert } from "@/components/ui/alert";
import { cn } from "@/lib/cn";
import { useLeadStatus } from "@/lib/use-lead-status";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/types";

type StatusChange = { leadId: string; status: LeadStatus };

export function LeadBoard({ leads }: { leads: Lead[] }) {
  // Moves the card to its new column straight away. React replaces this with
  // the server's version once the revalidated page arrives, and reverts it if
  // the update failed.
  const [optimisticLeads, applyOptimistic] = useOptimistic(
    leads,
    (current, change: StatusChange) =>
      current.map((lead) =>
        lead.id === change.leadId ? { ...lead, status: change.status } : lead,
      ),
  );

  const { setStatus, error } = useLeadStatus((leadId, status) =>
    applyOptimistic({ leadId, status }),
  );

  return (
    <div className="space-y-4">
      {error ? <ErrorAlert message={error} /> : null}

      <div className="grid items-start gap-4 md:grid-cols-3">
        {LEAD_STATUSES.map((status) => {
          const column = optimisticLeads.filter((lead) => lead.status === status);

          return (
            <section
              key={status}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70 p-3",
                "before:absolute before:inset-x-0 before:top-0 before:h-1",
                STATUS_STYLES[status].accent,
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1 pt-1">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span
                    className={cn("size-2 rounded-full", STATUS_STYLES[status].dot)}
                  />
                  {LEAD_STATUS_LABELS[status]}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 ring-inset">
                  {column.length}
                </span>
              </div>

              {column.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center">
                  <InboxIcon className="size-5 text-slate-300" />
                  <p className="text-sm text-slate-400">No leads</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {column.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onStatusChange={setStatus} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
