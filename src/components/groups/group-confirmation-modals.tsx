"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useGroupModal } from "@/src/components/contexts/group-modal-context";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
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
    <AlertDialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est
            irréversible et tous les messages, publications et événements
            associés seront également supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <Button
            variant="destructive"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
    <AlertDialog open={isLeaveModalOpen} onOpenChange={closeLeaveModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quitter le groupe</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir quitter ce groupe ? Si c&apos;est un groupe
            privé, vous devrez demander à nouveau l&apos;autorisation pour le
            rejoindre.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLeaving}>Annuler</AlertDialogCancel>
          <Button
            variant="destructive"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
