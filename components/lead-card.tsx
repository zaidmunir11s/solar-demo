import Link from "next/link";

import { MailIcon, PhoneIcon } from "@/components/icons";
import { StatusSelect } from "@/components/status-select";
import type { Lead, LeadStatus } from "@/lib/types";

/** First letters of the lead name, used as a cheap avatar. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type LeadCardProps = {
  lead: Lead;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
};

export function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  return (
    <li className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
          {initials(lead.name)}
        </span>

        <div className="min-w-0 flex-1">
          <Link
            href={`/leads/${lead.id}`}
            className="block truncate font-medium text-slate-900 underline-offset-4 group-hover:underline"
          >
            {lead.name}
          </Link>

          <dl className="mt-1.5 space-y-1 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Email</dt>
              <MailIcon className="size-3.5 shrink-0 text-slate-400" />
              <dd className="truncate">{lead.email ?? "—"}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Phone</dt>
              <PhoneIcon className="size-3.5 shrink-0 text-slate-400" />
              <dd className="truncate">{lead.phone ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <StatusSelect
        leadId={lead.id}
        value={lead.status}
        onChange={(status) => onStatusChange(lead.id, status)}
        className="mt-3"
      />
    </li>
  );
}
