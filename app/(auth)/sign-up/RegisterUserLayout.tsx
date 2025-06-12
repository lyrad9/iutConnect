"use client";
import { useState } from "react";
import { GraduationCap, Briefcase } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/src/components/ui/card";
import HelpModal from "./HelpModal";
import LoginBtn from "./LoginBtn";
import RegisterUserForm from "./RegisterUserForm";

export default function RegisterUserLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <div className="mx-auto grid w-full max-w-[1150px]  md:grid-cols-5 px-10">
      {/* Left column with text and benefits */}
      <div className="flex flex-col justify-center space-y-4 md:col-span-3">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Rejoignez UniConnect
          </h1>
          <p className="text-muted-foreground md:text-xl max-w-md">
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

      <Card className="md:col-span-2 ">
        <div className="space-y-4">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Remplissez vos identifiants universitaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <AlertTitle>Succès</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <RegisterUserForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setError={setError}
              setSuccess={setSuccess}
            />
          </CardContent>

          <CardFooter className="flex items-start flex-col space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte? Connectez-vous avec <LoginBtn />
            </p>

            <HelpModal />
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
