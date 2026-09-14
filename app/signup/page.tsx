import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/app/auth/actions";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthForm
      title="Create an account"
      subtitle="Start tracking your own leads."
      submitLabel="Sign up"
      action={signUp}
      footer={{ text: "Already have an account?", linkLabel: "Log in", href: "/login" }}
    />
  );
}
