import type { ActionState } from "@/lib/types";

/**
 * Runs a server action from a client component and never lets it reject.
 *
 * A server action can fail before it reaches our code - lost connection, or a
 * new deployment that no longer knows the action id of the page the user still
 * has open. Without this, that rejection surfaces as an uncaught error instead
 * of a message the user can act on.
 */
export async function runAction(
  action: () => Promise<ActionState>,
): Promise<ActionState> {
  try {
    return await action();
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please reload the page and retry.",
    };
  }
}
