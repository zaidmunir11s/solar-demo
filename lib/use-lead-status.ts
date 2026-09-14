"use client";

import { useState, useTransition } from "react";

import { updateLeadStatus } from "@/app/leads/actions";
import { runAction } from "@/lib/action-error";
import type { LeadStatus } from "@/lib/types";

/**
 * Shared status-change behaviour for the board and the lead page.
 *
 * The optimistic update is applied inside the transition, so React shows it
 * immediately and rolls it back automatically if the server render that
 * follows disagrees. `applyOptimistic` is supplied by the caller because the
 * board owns a list of leads while the lead page owns a single one.
 */
export function useLeadStatus(
  applyOptimistic: (leadId: string, status: LeadStatus) => void,
) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function setStatus(leadId: string, status: LeadStatus) {
    setError(null);

    startTransition(async () => {
      applyOptimistic(leadId, status);

      const result = await runAction(() => updateLeadStatus(leadId, status));
      if (result.status === "error") {
        setError(result.message);
      }
    });
  }

  return { setStatus, error, isPending };
}
