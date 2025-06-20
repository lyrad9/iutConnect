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
import { NotificationData } from "../../../app/notifications/NotificationItem";
import { useState } from "react";
import { getInitials } from "@/src/lib/utils";

export function DialogApprovalRequest({
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

  // Extraction de l'expéditeur à partir de la notification
  const { sender } = notification;

  // Gestion des actions pour les demandes d'adhésion au groupe
  const handleAction = async (action: "accept" | "decline") => {
    setIsLoading(true);
    try {
      // TODO: Implémenter la mutation Convex réelle lorsque forums.ts est prêt
      // Pour les demandes d'adhésion au groupe :
      // if (notification.targetType === "groupMember" && notification.groupMemberId) {
      //   await processGroupMembershipRequest({
      //     groupMemberId: notification.groupMemberId,
      //     action: action === "accept" ? "accept" : "reject"
      //   });
      // }

      toast({
        title: action === "accept" ? "Demande acceptée" : "Demande refusée",
        description: `Vous avez ${action === "accept" ? "accepté" : "refusé"} la demande d&apos;adhésion au groupe.`,
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
          <DialogTitle>Demande d&apos;adhésion au groupe</DialogTitle>
          <DialogDescription>
            {sender?.name} souhaite rejoindre le groupe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations utilisateur */}
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
                Souhaite rejoindre
              </p>
            </div>
          </div>

          {/* Informations sur le groupe - Si disponibles dans la notification */}
          {notification.forumId && (
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Détails du groupe</h4>
              <p className="text-sm font-medium">
                Les informations du groupe apparaîtront ici
              </p>
              {notification.content && (
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.content}
                </p>
              )}
            </div>
          )}

          {notification.content && !notification.forumId && (
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
              Accepter
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
