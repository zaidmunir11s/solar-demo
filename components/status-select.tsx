"use client";

import { Select } from "@/components/ui/field";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";

type StatusSelectProps = {
  leadId: string;
  value: LeadStatus;
  onChange: (status: LeadStatus) => void;
  label?: string;
  className?: string;
};

/**
 * Presentational only. It never calls the server itself, so the board and the
 * lead page can each own their own optimistic state around it.
 */
export function StatusSelect({
  leadId,
  value,
  onChange,
  label = "Status",
  className,
}: StatusSelectProps) {
  const selectId = `status-${leadId}`;

  return (
    <div className={className}>
      <label className="sr-only" htmlFor={selectId}>
        {label}
      </label>
      <Select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value as LeadStatus)}
        className="py-1.5 text-sm"
      >
        {LEAD_STATUSES.map((option) => (
          <option key={option} value={option}>
            {LEAD_STATUS_LABELS[option]}
          </option>
        ))}
      </Select>
    </div>
  );
}
