"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Badge } from "@/src/components/ui/badge";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
export default function PendingRequestsList() {
  const [, setTick] = useState(0);
  // Récupérer les demandes en attente
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.forums.getUserPendingRequests,
    {},
    {
      initialNumItems: 10,
    }
  );
  // Mutation pour annuler une demande d'adhésion
  const cancelRequest = useMutation(api.forums.cancelGroupJoinRequest);
  // Référence pour l'élément d'intersection observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;
    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);

  // Update time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1); // Force re-render to update time
    }, 60_000); // Every minute
    return () => clearInterval(interval);
  }, []);

  // Fonction pour annuler une demande d'adhésion
  const handleCancelRequest = async (groupId: Id<"forums">) => {
    try {
      await cancelRequest({ groupId });
      toast.success("Votre demande d'adhésion a été annulée");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande:", error);
      toast.error("Erreur lors de l'annulation de la demande");
    }
  };

  return (
    <div className="lg:sticky lg:top-14 lg:max-h-[calc(100svh-3.5rem)] lg:overflow-x-hidden lg:pb-24 lg:overflow-y-auto lg:items-stretch lg:h-screen w-full scrollbar-hide">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Demandes en attente
            {results && results.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                {results.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {results && results.length > 0 ? (
              <>
                {results.map((request) => (
                  <Card key={request?.id} className="overflow-hidden pb-6 pt-0">
                    <div className="relative h-24 w-full bg-gradient-to-br from-muted/30 to-muted/10">
                      <img
                        src={request?.group.coverPhoto || "/placeholder.svg"}
                        alt={`${request?.group.name} couverture`}
                        className="h-full w-full object-cover"
                      />

                      {/* Badge de confidentialité */}
                      <div className="absolute top-2 right-2">
                        {request?.group.confidentiality === "private" ? (
                          <Badge>
                            {" "}
                            <LockKeyhole className="h-3 w-3" />
                            Privé
                          </Badge>
                        ) : (
                          <Badge>
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        )}
                      </div>

                      <div className="absolute -bottom-8 left-3 size-20 overflow-hidden rounded-full border-2 border-background bg-background">
                        <SmartAvatar
                          avatar={request?.group.profilePicture}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-3 px-4">
                      <h3 className="font-semibold line-clamp-1">
                        <Link
                          href={`/groups/${request?.group._id}`}
                          className="hover:underline"
                        >
                          {request?.group.name}
                        </Link>
                      </h3>

                      <p className="mt-1 text-xs text-muted-foreground ">
                        Demande envoyée{" "}
                        {formatDistanceToNow(
                          new Date(request?.requestAt || 0),
                          {
                            addSuffix: true,
                            locale: fr,
                          }
                        )}
                      </p>
                    </div>
                    <CardFooter className="px-3">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() =>
                          handleCancelRequest(
                            request?.group._id as Id<"forums">
                          )
                        }
                      >
                        Annuler la demande
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <div ref={loaderRef} className="h-10" />
                {isLoading && (
                  <Loader2 className="animate-spin size-7 mx-auto " />
                )}
              </>
            ) : isLoading ? (
              <Loader2 className="animate-spin size-4 mx-auto text-primary" />
            ) : (
              <EmptyState
                title="Aucune demande en attente"
                description="Vous n'avez pas de demandes d'adhésion en attente"
                icons={[Clock]}
                className="py-8"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
