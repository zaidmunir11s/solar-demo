"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteLead } from "@/app/leads/actions";
import { TrashIcon } from "@/components/icons";
import { ErrorAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { runAction } from "@/lib/action-error";

export function DeleteLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;

    startTransition(async () => {
      const result = await runAction(() => deleteLead(leadId));
      if (result.status !== "success") {
        setError(result.status === "error" ? result.message : "Could not delete the lead.");
        return;
      }
      router.push("/leads");
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="danger"
        onClick={handleDelete}
        disabled={isPending}
      >
        <TrashIcon />
        {isPending ? "Deleting…" : "Delete lead"}
      </Button>
      {error ? <ErrorAlert message={error} /> : null}
    </div>
  );
}
