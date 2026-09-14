import { cn } from "@/lib/cn";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";

/**
 * One place decides what each status looks like, so the badge, the board
 * column header and the lead page can never drift apart.
 */
export const STATUS_STYLES: Record<
  LeadStatus,
  { badge: string; dot: string; accent: string }
> = {
  new: {
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
    dot: "bg-sky-500",
    accent: "before:bg-sky-400",
  },
  contacted: {
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
    accent: "before:bg-amber-400",
  },
  signed: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    accent: "before:bg-emerald-400",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        STATUS_STYLES[status].badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_STYLES[status].dot)} />
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
