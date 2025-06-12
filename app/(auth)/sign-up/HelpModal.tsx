import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { HelpCircle } from "lucide-react";
export default function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          Aide
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guide d&apos;inscription et de connexion</DialogTitle>
          <DialogDescription>
            Voici comment fonctionne le processus d&apos;inscription et de
            connexion sur notre plateforme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-medium text-sm">
              Pour les nouveaux utilisateurs:
            </h3>
            <ol className="list-decimal ml-5 text-sm text-muted-foreground">
              <li>
                Remplissez le formulaire avec votre matricule universitaire
              </li>
              <li>Utilisez votre mot de passe universitaire</li>
              <li>
                Fournissez une adresse email valide pour recevoir les
                confirmations
              </li>
              <li>Après validation, vous recevrez un email de confirmation</li>
              <li>
                Vous pourrez ensuite vous connecter avec Google lors de vos
                prochaines visites
              </li>
            </ol>
          </div>
          <div>
            <h3 className="font-medium text-sm">
              Pour les utilisateurs existants:
            </h3>
            <p className="text-sm text-muted-foreground">
              Si vous avez déjà un compte, utilisez simplement le bouton
              &quot;Connectez-vous avec Google&quot; pour accéder rapidement à
              votre compte.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
