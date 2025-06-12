import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
// Définition du schéma Zod pour la validation du formulaire
const universityAuthSchema = z.object({
  matricule: z.string().min(1, "Le matricule est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
  email: z.string().email("Format d'email invalide"),
});

// Type inféré du schéma Zod
type UniversityAuthFormData = z.infer<typeof universityAuthSchema>;
export default function RegisterUserForm({
  isLoading,
  setIsLoading,
  setError,
  setSuccess,
}: {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}) {
  // Action pour l'authentification universitaire
  const universityAuth = useAction(api.authActions.universityAuthAction);

  // Initialisation du formulaire avec React Hook Form et validation Zod
  const form = useForm<UniversityAuthFormData>({
    resolver: zodResolver(universityAuthSchema),
    defaultValues: {
      matricule: "",
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: UniversityAuthFormData) => {
    console.log(data);
    setIsLoading(true);
    setError("");
    setSuccess("");
    /* try {
      const verifyResponse = await fetch(
        "http://localhost:3000/api/verify-credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({
            registrationNumber: data.matricule,
            password: data.password
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    } */

    try {
      // Appel à l'action d'authentification universitaire
      const result = await universityAuth({
        matricule: data.matricule,
        password: data.password,
        email: data.email,
      });

      if (result.success) {
        setSuccess(result.message);
        // Réinitialiser le formulaire
        form.reset();
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      console.error("Erreur de soumission:", error);
      setError(error.message || "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="matricule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matricule</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe universitaire</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
              <p className="mt-1 text-xs text-gray-500">
                Un lien de connexion sera envoyé à cette adresse
              </p>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {/* Chargement... */}
            </>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    </Form>
  );
}
