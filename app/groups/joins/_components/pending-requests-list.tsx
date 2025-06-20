"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Loader2, Clock, Eye, XCircle, LockKeyhole, Globe } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { EmptyState } from "@/src/components/ui/empty-state";

export default function PendingRequestsList() {
  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);

  // Récupérer les demandes en attente
  const pendingRequests = useQuery(api.forums.getUserPendingRequests);

  // Mutation pour annuler une demande d'adhésion
  const cancelRequest = useMutation(api.forums.cancelGroupJoinRequest);

  // Fonction pour annuler une demande d'adhésion
  const handleCancelRequest = async (groupId: Id<"forums">) => {
    try {
      await cancelRequest({ groupId });
      toast.success("Demande d'adhésion annulée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande:", error);
      toast.error("Erreur lors de l'annulation de la demande");
    }
  };

  // Afficher un loader pendant le chargement
  /*   if (pendingRequests === undefined) {
    return (
      <Card className="border border-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Demandes en attente
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
 */
  return (
    <Card className="border border-muted/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Demandes en attente
          {pendingRequests && pendingRequests.length > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {pendingRequests.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!pendingRequests || pendingRequests.length === 0 ? (
          <EmptyState
            title="Aucune demande en attente"
            description="Vous n'avez pas de demandes d'adhésion en attente"
            icons={[Clock]}
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card
                key={request.id}
                className="overflow-hidden border border-muted/40"
              >
                <div className="relative h-24 w-full bg-gradient-to-br from-muted/30 to-muted/10">
                  <img
                    src={request.group.coverPhoto || "/placeholder.svg"}
                    alt={`${request.group.name} couverture`}
                    className="h-full w-full object-cover"
                  />

                  {/* Badge de confidentialité */}
                  <div className="absolute top-2 right-2">
                    {request.group.confidentiality === "private" ? (
                      <div className="flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                        <LockKeyhole className="h-3 w-3" />
                        Privé
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                        <Globe className="h-3 w-3" />
                        Public
                      </div>
                    )}
                  </div>

                  <div className="absolute -bottom-6 left-3 h-12 w-12 overflow-hidden rounded-full border-2 border-background bg-background">
                    <img
                      src={request.group.profilePicture || "/placeholder.svg"}
                      alt={`${request.group.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="pt-8 px-4 pb-4">
                  <h3 className="font-semibold line-clamp-1">
                    {request.group.name}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Demande envoyée{" "}
                    {formatDistanceToNow(new Date(request.requestAt || 0), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/groups/${request.group._id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleCancelRequest(request.group._id as Id<"forums">)
                      }
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
