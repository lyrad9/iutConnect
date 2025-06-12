import { Button } from "@/src/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function AuthBtn() {
  const { signIn } = useAuthActions();
  return (
    <Button
      variant="outline"
      onClick={() => signIn("google", { redirectTo: "/" })}
    >
      Login
    </Button>
  );
}
