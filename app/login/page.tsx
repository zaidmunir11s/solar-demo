import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/app/auth/actions";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to see your leads."
      submitLabel="Log in"
      action={signIn}
      footer={{ text: "No account yet?", linkLabel: "Sign up", href: "/signup" }}
    />
  );
}
