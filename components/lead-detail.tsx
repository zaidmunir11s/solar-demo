"use client";

import { useOptimistic, type ReactNode } from "react";

import { DeleteLeadButton } from "@/components/delete-lead-button";
import { MailIcon, PhoneIcon } from "@/components/icons";
import { StatusBadge } from "@/components/status-badge";
import { StatusSelect } from "@/components/status-select";
import { ErrorAlert } from "@/components/ui/alert";
import { useLeadStatus } from "@/lib/use-lead-status";
import type { Lead, LeadStatus } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("nl-NL", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function LeadDetail({ lead }: { lead: Lead }) {
  // Badge and dropdown read the same optimistic value, so they can never show
  // two different statuses while the update is in flight.
  const [optimisticStatus, applyOptimistic] = useOptimistic(
    lead.status,
    (_current, next: LeadStatus) => next,
  );

  const { setStatus, error } = useLeadStatus((_leadId, status) =>
    applyOptimistic(status),
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {lead.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Added {dateFormat.format(new Date(lead.created_at))}
          </p>
        </div>
        <StatusBadge status={optimisticStatus} />
      </header>

      <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
        <DetailRow label="Email" icon={<MailIcon className="size-4" />}>
          {lead.email ? (
            <a
              href={`mailto:${lead.email}`}
              className="text-slate-900 underline-offset-4 hover:underline"
            >
              {lead.email}
            </a>
          ) : (
            <span className="text-slate-400">Not provided</span>
          )}
        </DetailRow>

        <DetailRow label="Phone" icon={<PhoneIcon className="size-4" />}>
          {lead.phone ? (
            <a
              href={`tel:${lead.phone}`}
              className="text-slate-900 underline-offset-4 hover:underline"
            >
              {lead.phone}
            </a>
          ) : (
            <span className="text-slate-400">Not provided</span>
          )}
        </DetailRow>

        <DetailRow label="Last updated">
          {dateFormat.format(new Date(lead.updated_at))}
        </DetailRow>

        <DetailRow label="Lead ID">
          <code className="font-mono text-xs break-all text-slate-600">
            {lead.id}
          </code>
        </DetailRow>
      </dl>

      <footer className="space-y-4 p-6">
        {error ? <ErrorAlert message={error} /> : null}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">
              Move to another stage
            </p>
            <StatusSelect
              leadId={lead.id}
              value={optimisticStatus}
              onChange={(status) => setStatus(lead.id, status)}
              label="Change status"
            />
          </div>
          <DeleteLeadButton leadId={lead.id} />
        </div>
      </footer>
    </article>
  );
}

function DetailRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white px-6 py-4">
      <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-400 uppercase">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-700">{children}</dd>
    </div>
  );
}
