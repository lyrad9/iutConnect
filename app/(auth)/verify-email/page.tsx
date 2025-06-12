"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/src/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

export default function VerifyEmailPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Récupérer l'email et le token depuis les paramètres d'URL
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleConfirmation = async () => {
    if (!email || !token) {
      setError("Informations de vérification incomplètes");
      return;
    }

    try {
      setIsLoading(true);
      // Appel à la fonction signIn de Convex
      await signIn("custom-profile", {
        email,
        code: token,
        flow: "email-verification",
      }).then((res) => {
        router.push("/");
      });
    } catch (error: any) {
      console.error("Erreur de vérification:", error);
      setError(error.message || "Échec de la vérification");
      setIsLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <Card className="max-w-md w-full">
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Informations incomplètes</h1>
            <p className="text-sm text-destructive mt-2">
              Le token de vérification ou l&apos;email n&apos;est pas fourni.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/sign-up")}
              className="w-full focus:ring-offset-2"
            >
              Retour à la page d&apos;inscription
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg w-full">
      <div className="p-6 space-y-4">
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-2xl font-bold">Confirmer votre inscription</h1>
          </CardTitle>
          <CardDescription>
            <p className="text-sm text-muted-foreground mt-2">
              Vérifiez votre identité avant de continuer
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-2 border-destructive" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground">
            <p>
              Si cette adresse email ne vous appartient pas, ne confirmez pas
              cette connexion et fermez cette page.
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmation}
            disabled={isLoading}
            className="focus:ring-offset-2 flex-1 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {/* Chargement... */}
              </>
            ) : (
              "Connecté en tant que " + email
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
