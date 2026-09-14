import type { ComponentProps, ReactNode } from "react";

import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const CONTROL_CLASSES = cn(
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
  "placeholder:text-slate-400 transition",
  "focus:border-slate-400 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900/20",
  "disabled:cursor-not-allowed disabled:bg-slate-50",
);

/** Label + control wrapper, so every form field looks and behaves the same. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline justify-between text-sm font-medium text-slate-700"
      >
        {label}
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL_CLASSES, className)} {...props} />;
}

/**
 * The native arrow is drawn by the browser hard against the border and cannot
 * be moved with padding, so it is switched off and replaced with our own.
 */
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(CONTROL_CLASSES, "cursor-pointer appearance-none pr-10", className)}
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
