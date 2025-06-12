import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function LoginBtn() {
  const { signIn } = useAuthActions();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingGoogle(true);
      /* setError(""); */

      // Utiliser le provider Google
      const a = await signIn("google", { redirectTo: "/" });
      console.log(a);
    } catch (error: any) {
      console.error("Erreur de connexion Google:", error);
      /* setError(error.message || "Erreur de connexion avec Google"); */
      setIsLoadingGoogle(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="text-blue-600 hover:underline"
      type="button"
    >
      Google
    </button>
  );
}
