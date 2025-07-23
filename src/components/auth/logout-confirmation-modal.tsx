"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de confirmation pour la déconnexion d'un utilisateur
 */
export function LogoutConfirmationModal({
  isOpen,
  onClose,
}: LogoutConfirmationModalProps) {
  const { signOut } = useAuthActions();
  const router = useRouter();

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-up");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            Confirmation de déconnexion
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
