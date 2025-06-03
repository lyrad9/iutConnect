"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Briefcase } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import { StudentRegistrationForm } from "@/src/components/forms/student-form";
import { StaffRegistrationForm } from "@/src/components/forms/staff-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-5">
      {/* Left column with text and benefits */}
      <div className="flex flex-col justify-center space-y-4 md:col-span-2">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Rejoignez UniConnect
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Créez votre compte et connectez-vous avec votre communauté
            universitaire.
          </p>
        </div>
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h3 className="font-medium">Pour les étudiants</h3>
              <p className="text-sm text-muted-foreground">
                Accédez aux forums de discussion et aux événements de votre
                filière
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h3 className="font-medium">Pour le personnel</h3>
              <p className="text-sm text-muted-foreground">
                Communiquez facilement avec vos étudiants et collègues
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column with registration form */}
      <div className="rounded-lg border bg-card p-6 shadow-sm md:col-span-3">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Créer un compte</h2>
          <p className="text-sm text-muted-foreground">
            Sélectionnez votre profil et remplissez le formulaire
          </p>
        </div>

        {/* Tabs for user type selection */}
        <Tabs defaultValue="student" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 px-8">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="size-4" />
              <span>Étudiant</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Briefcase className="size-4" />
              <span>Personnel</span>
            </TabsTrigger>
          </TabsList>

          {/* Student registration form */}
          <TabsContent value="student" className="pt-4">
            <StudentRegistrationForm />
          </TabsContent>

          {/* Staff registration form */}
          <TabsContent value="staff" className="pt-4">
            <StaffRegistrationForm />
          </TabsContent>
        </Tabs>

        {/* Link to login page */}
        <div className="mt-4 text-center text-sm">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
