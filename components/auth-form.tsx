"use client";

import Link from "next/link";
import { useActionState } from "react";

import { SunIcon } from "@/components/icons";
import { ErrorAlert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { IDLE, type ActionState } from "@/lib/types";

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  footer: { text: string; linkLabel: string; href: string };
};

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  action,
  footer,
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, IDLE);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
            <SunIcon className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </Field>

            <Field label="Password" htmlFor="password" hint="min. 6 characters">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </Field>

            {state.status === "error" ? <ErrorAlert message={state.message} /> : null}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Please wait…" : submitLabel}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {footer.text}{" "}
          <Link
            href={footer.href}
            className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700"
          >
            {footer.linkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
