"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { USER_FUNCTIONS } from "@/src/components/utils/const/user-functions";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

// Définition du schéma de validation Zod
const formSchema = z.object({
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  registrationNumber: z
    .string()
    .min(5, "Le matricule doit contenir au moins 5 caractères"),
  phoneNumber: z
    .string()
    .min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres"),
  function: z.string().min(2, "Veuillez sélectionner une fonction"),
});

type FormValues = z.infer<typeof formSchema>;

// Liste des fonctions disponibles pour le personnel
const staffFunctions = [
  { id: USER_FUNCTIONS.PROFESSOR, label: "Professeur" },
  { id: USER_FUNCTIONS.ACCOUNTANT, label: "Comptable" },
  { id: USER_FUNCTIONS.HR, label: "Ressources Humaines" },
  { id: USER_FUNCTIONS.ADMIN_STAFF, label: "Personnel Administratif" },
];

export function StaffRegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useMutation(api.users.registerUser);

  // Initialiser le formulaire avec React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      registrationNumber: "",
      phoneNumber: "",
      function: "",
    },
  });

  // Fonction de soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Enregistrer l'utilisateur dans la base de données
      const userId = await registerUser({
        ...values,
      });

      // Traiter la réponse
      setRegistrationSuccess(true);

      // Réinitialiser le formulaire
      form.reset();

      // Rediriger après un délai
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (err) {
      setError(
        (err as Error).message ||
          "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Inscription réussie</AlertTitle>
        <AlertDescription className="text-green-700">
          Votre demande d&apos;inscription a été envoyée avec succès. Vous
          recevrez un email de confirmation. Vous serez redirigé vers la page de
          connexion dans quelques secondes.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Entrez votre adresse email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez votre matricule" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Entrez votre numéro de téléphone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="function"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fonction</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre fonction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {staffFunctions.map((staffFunction) => (
                    <SelectItem key={staffFunction.id} value={staffFunction.id}>
                      {staffFunction.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            "S&apos;inscrire"
          )}
        </Button>
      </form>
    </Form>
  );
}
