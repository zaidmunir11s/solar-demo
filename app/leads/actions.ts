"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/supabase/server";
import { LEAD_STATUSES, type ActionState, type LeadStatus } from "@/lib/types";

/**
 * All three actions below talk to Supabase through a client built from the
 * caller's own auth cookies. That means every statement runs as that user and
 * the RLS policies on public.leads apply:
 *
 *   insert -> with check (auth.uid() = user_id)
 *   update -> using (auth.uid() = user_id) with check (auth.uid() = user_id)
 *   delete -> using (auth.uid() = user_id)
 *
 * No action accepts a user_id from the client, and no action can reach a row
 * that belongs to someone else, even when the caller posts an arbitrary
 * lead id straight to the server action.
 *
 * Because RLS filters rather than rejects, "not yours" and "does not exist"
 * both arrive here as zero affected rows. Every write therefore returns the
 * affected ids via .select() and treats an empty result as a failure, so the
 * UI never reports success for a row the caller could not touch.
 */

function optionalText(formData: FormData, field: string): string | null {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function createLead(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { status: "error", message: "Name is required." };
  }

  // user_id is intentionally not part of this insert. Postgres fills it from
  // the column default auth.uid(), and the insert policy verifies it.
  const { error } = await supabase.from("leads").insert({
    name,
    email: optionalText(formData, "email"),
    phone: optionalText(formData, "phone"),
  });

  if (error) {
    return { status: "error", message: "Could not save the lead. Please try again." };
  }

  revalidatePath("/leads");
  return { status: "success" };
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
): Promise<ActionState> {
  const { supabase } = await requireUser();

  if (!LEAD_STATUSES.includes(status)) {
    return { status: "error", message: "Unknown status." };
  }

  // No .eq("user_id", ...) here on purpose: the update policy already limits
  // this statement to rows owned by the caller. A lead id belonging to another
  // user simply matches zero rows.
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId)
    .select("id");

  if (error) {
    return { status: "error", message: "Could not update the status. Please try again." };
  }
  if (data.length === 0) {
    return { status: "error", message: "Lead not found." };
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  return { status: "success" };
}

export async function deleteLead(leadId: string): Promise<ActionState> {
  const { supabase } = await requireUser();

  // Same reasoning as the update: the delete policy scopes the statement to
  // the caller's own rows, and .select() tells us whether one was actually
  // removed. Without it, deleting a lead you do not own would delete nothing
  // and still look like a success.
  const { data, error } = await supabase
    .from("leads")
    .delete()
    .eq("id", leadId)
    .select("id");

  if (error) {
    return { status: "error", message: "Could not delete the lead. Please try again." };
  }
  if (data.length === 0) {
    return { status: "error", message: "Lead not found." };
  }

  revalidatePath("/leads");
  return { status: "success" };
}
