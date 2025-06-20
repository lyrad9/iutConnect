"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NotificationData } from "./NotificationItem";
import { useState } from "react";
import { getInitials } from "@/src/lib/utils";

export function DialogContentApproval({
  open,
  onOpenChange,
  notification,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: NotificationData;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Extraction de l'expéditeur et des données de contenu à partir de la notification
  const { sender } = notification;

  // Gestion des actions d'approbation de contenu
  const handleAction = async (action: "accept" | "decline") => {
    setIsLoading(true);
    try {
      // TODO: Implémenter les mutations Convex quand elles seront prêtes
      // Pour l'approbation des publications:
      // if (notification.targetType === "post" && notification.postId) {
      //   await processPostApprovalRequest({
      //     postId: notification.postId,
      //     action: action === "accept" ? "approve" : "reject",
      //     moderatorId: currentUser._id
      //   });
      // }
      // Pour l'approbation des événements:
      // if (notification.targetType === "event" && notification.eventId) {
      //   await processEventApprovalRequest({
      //     eventId: notification.eventId,
      //     action: action === "accept" ? "approve" : "reject"
      //   });
      // }

      toast({
        title: action === "accept" ? "Contenu approuvé" : "Contenu refusé",
        description: `Vous avez ${
          action === "accept" ? "approuvé" : "refusé"
        } le contenu.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors du traitement de votre action.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approbation de contenu</DialogTitle>
          <DialogDescription>
            {sender?.name} a soumis un contenu pour approbation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={sender?.avatar || "/placeholder.svg"}
                alt={sender?.name || "Utilisateur"}
              />
              <AvatarFallback>
                {getInitials(sender?.name || "Utilisateur")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{sender?.name}</p>
              <p className="text-xs text-muted-foreground">
                A soumis un contenu pour approbation
              </p>
            </div>
          </div>

          {/* Détails du contenu selon le type de cible */}
          {(notification.postId || notification.eventId) && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Détails du contenu</h4>
              {notification.targetType === "post" && (
                <p className="text-sm">
                  Le contenu de la publication sera affiché ici lorsque le
                  backend sera pleinement intégré
                </p>
              )}
              {notification.targetType === "event" && (
                <p className="text-sm">
                  Les détails de l&apos;événement seront affichés ici lorsque le
                  backend sera pleinement intégré
                </p>
              )}
            </div>
          )}

          {notification.content && (
            <div className="bg-background p-3 rounded-md border">
              <p className="text-sm">{notification.content}</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => handleAction("decline")}
              disabled={isLoading}
            >
              Refuser
            </Button>
            <Button onClick={() => handleAction("accept")} disabled={isLoading}>
              Approuver
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
