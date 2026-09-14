"use client";

import { useActionState, useEffect, useRef } from "react";

import { createLead } from "@/app/leads/actions";
import { PlusIcon } from "@/components/icons";
import { ErrorAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { IDLE } from "@/lib/types";

export function AddLeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createLead, IDLE);

  // Clear the fields only when the action actually reported success. The
  // action returns a fresh object each time, so two saves in a row both fire.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">New lead</h2>
        <p className="text-sm text-slate-500">
          Only the name is required. The lead starts in New.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name" htmlFor="lead-name">
            <Input
              id="lead-name"
              name="name"
              required
              maxLength={200}
              placeholder="Familie de Vries"
            />
          </Field>

          <Field label="Email" htmlFor="lead-email" hint="optional">
            <Input
              id="lead-email"
              name="email"
              type="email"
              maxLength={200}
              placeholder="naam@voorbeeld.nl"
            />
          </Field>

          <Field label="Phone" htmlFor="lead-phone" hint="optional">
            <Input
              id="lead-phone"
              name="phone"
              maxLength={50}
              placeholder="06 12 34 56 78"
            />
          </Field>
        </div>

        {state.status === "error" ? <ErrorAlert message={state.message} /> : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <PlusIcon />
            {isPending ? "Saving…" : "Add lead"}
          </Button>
        </div>
      </form>
    </section>
  );
}
