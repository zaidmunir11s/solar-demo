import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary" className="px-3 py-1.5">
        Log out
      </Button>
    </form>
  );
}
