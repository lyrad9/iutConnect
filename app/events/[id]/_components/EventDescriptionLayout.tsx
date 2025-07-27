"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  CalendarDays,
  ArrowLeft,
  ExternalLink,
  Video,
  Building,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useRouter } from "next/navigation";
import { Separator } from "@/src/components/ui/separator";
import { ScrollToTop } from "@/src/components/ui/scroll-to-top";

/**
 * Layout pour afficher la description complète d'un événement
 */
export function EventDescriptionLayout({ eventId }: { eventId: string }) {
  const router = useRouter();

  // Récupérer les données de l'événement
  const event = useQuery(api.events.getEventById, {
    eventId: eventId as Id<"events">,
  });

  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);

  // Si l'événement est en cours de chargement
  if (event === undefined) {
    return <EventDescriptionSkeleton />;
  }

  // Si l'événement n'existe pas
  if (event === null) {
    return (
      <EmptyState
        title="Événement introuvable"
        description="Cet événement n'existe pas ou a été supprimé"
        icons={[CalendarDays]}
      />
    );
  }

  // Vérifier si l'utilisateur est participant
  const isParticipant = event.participants.find(
    (p) => p?.id === currentUser?._id
  );

  // Formater les dates
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formatTime = (time: string) => {
    return time.replace(":", "h");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bouton retour */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      {/* En-tête de l'événement */}
      <Card className="overflow-hidden">
        {/* Image de couverture */}
        {event.photo && (
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={event.photo}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="space-y-4">
            {/* Titre et badges */}
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {event.name}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {event.eventType}
                </Badge>
                {event.isCancelled && (
                  <Badge variant="destructive" className="text-xs">
                    Annulé
                  </Badge>
                )}
                {isParticipant && (
                  <Badge variant="default" className="text-xs">
                    Inscrit
                  </Badge>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date et heure */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {format(startDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                </div>

                {event.startTime && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Localisation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {event.locationType === "online" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {event.locationType === "online" ? "En ligne" : "Sur place"}
                  </span>
                </div>

                <div className="text-sm text-foreground">
                  {event.locationDetails}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          <Separator />

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Organisateur */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Organisateur
              </h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={event.author?.profilePicture as string | undefined}
                  />
                  <AvatarFallback>
                    {event.author?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{event.author?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.author?.role === "ADMIN" ||
                    event.author?.role === "SUPERADMIN"
                      ? "Administrateur"
                      : "Organisateur"}
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Participants
              </h4>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {event.participants?.length || 0} participant(s)
                </span>
              </div>
            </div>

            {/* Cible */}
            {event.target && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Public cible
                </h4>
                <p className="text-sm">{event.target}</p>
              </div>
            )}
          </div>

          {/* Collaborateurs */}
          {event.collaborators && event.collaborators.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Collaborateurs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {event.collaborators.map((collaboratorId) => (
                    <Badge
                      key={collaboratorId?.id}
                      variant="outline"
                      className="text-xs"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Collaborateur
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            {event.locationType === "online" && event.locationDetails && (
              <Button
                variant="outline"
                onClick={() => window.open(event.locationDetails, "_blank")}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Rejoindre l&apos;événement
              </Button>
            )}

            {event.allowsParticipants &&
              !isParticipant &&
              !event.isCancelled && (
                <Button className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Participer
                </Button>
              )}

            {isParticipant && (
              <Button variant="destructive" className="flex-1">
                Se désinscrire
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bouton de retour en haut de page */}
      <ScrollToTop />
    </div>
  );
}

/**
 * Squelette de chargement pour la description d'événement
 */
function EventDescriptionSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-10 w-24" />

      <Card className="overflow-hidden">
        <Skeleton className="h-64 md:h-80 w-full" />

        <CardHeader className="pb-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
