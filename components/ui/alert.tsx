import { AlertIcon } from "@/components/icons";

/** Inline error message used by every form and action. */
export function ErrorAlert({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      <AlertIcon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}
