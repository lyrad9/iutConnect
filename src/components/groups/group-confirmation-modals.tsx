"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGroupModal } from "@/src/components/contexts/group-modal-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function DeleteGroupModal() {
  const { isDeleteModalOpen, groupIdToDelete, closeDeleteModal } =
    useGroupModal();
  const deleteGroup = useMutation(api.forums.deleteGroup);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!groupIdToDelete) return;

    setIsDeleting(true);
    try {
      await deleteGroup({ groupId: groupIdToDelete });
      toast.success("Groupe supprimé avec succès");
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error);
      toast.error("Erreur lors de la suppression du groupe");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">
            Supprimer le groupe
          </DialogTitle>
          <DialogDescription className="text-center">
            Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est
            irréversible et tous les messages, publications et événements
            associés seront également supprimés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LeaveGroupModal() {
  const { isLeaveModalOpen, groupIdToLeave, closeLeaveModal } = useGroupModal();
  const leaveGroup = useMutation(api.forums.leaveGroup);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    if (!groupIdToLeave) return;

    setIsLeaving(true);
    try {
      await leaveGroup({ groupId: groupIdToLeave });
      toast.success("Vous avez quitté le groupe");
      closeLeaveModal();
    } catch (error) {
      console.error("Erreur lors de la sortie du groupe:", error);
      toast.error("Erreur lors de la sortie du groupe");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Dialog open={isLeaveModalOpen} onOpenChange={closeLeaveModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center text-xl">
            Quitter le groupe
          </DialogTitle>
          <DialogDescription className="text-center">
            Êtes-vous sûr de vouloir quitter ce groupe ? Si c&apos;est un groupe
            privé, vous devrez demander à nouveau l&apos;autorisation pour le
            rejoindre.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={closeLeaveModal}
            disabled={isLeaving}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeave}
            disabled={isLeaving}
          >
            {isLeaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              "Quitter le groupe"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
