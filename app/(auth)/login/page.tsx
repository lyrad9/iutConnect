"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, AtSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useToast } from "@/src/hooks/use-toast";
import { ModeToggle } from "@/src/components/mode-toggle";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Adresse email invalide" })
    .min(1, { message: "L'email est requis" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

// Type pour les données du formulaire
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Initialisation du formulaire avec React Hook Form et validation Zod
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = (data: LoginFormData) => {
    // Ici, vous devrez implémenter la logique d'authentification
    console.log("Tentative de connexion avec:", data);

    // Pour l'instant, on simule une connexion réussie
    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur UniConnect !",
    });

    router.push("/");
  };

  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-2">
      <div className="flex flex-col justify-center space-y-4">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Bienvenue
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Connectez-vous avec votre communauté universitaire. Partagez des
            idées, rejoignez des groupes et restez informé des événements du
            campus.
          </p>
        </div>
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AtSign className="size-5" />
            </div>
            <div>
              <h3 className="font-medium">Restez connecté</h3>
              <p className="text-sm text-muted-foreground">
                Construisez votre réseau avec vos pairs et les enseignants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h3 className="font-medium">Ressources académiques</h3>
              <p className="text-sm text-muted-foreground">
                Accédez aux supports de cours et aux discussions
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Connexion</h2>
          <p className="text-sm text-muted-foreground">
            Entrez votre email ci-dessous pour vous connecter
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-8 pt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m.jordan@university.edu"
                      type="email"
                      {...field}
                    />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Mot de passe</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </Form>

        <div className="mt-4 px-8 text-center text-sm">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/register" className="text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
