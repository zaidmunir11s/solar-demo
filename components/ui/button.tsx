import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger";

const BASE_CLASSES = cn(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-400",
  danger:
    "border border-red-200 bg-white text-red-700 hover:bg-red-50 focus-visible:outline-red-500",
};

/** Shared with <Link>, so links that look like buttons stay in sync. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}
