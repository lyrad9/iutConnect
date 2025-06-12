"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Globe,
  MoreHorizontal,
  Users,
  User as UserIcon,
  Check,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn, getInitialsFromName } from "@/src/lib/utils";
import { eventTypes } from "@/src/components/utils/const/event-type";

// Type pour l'événement
export interface EventType {
  id: string;
  name: string;
  description: string;
  photo: string;
  startDate: number;
  endDate?: number;
  location: {
    type: "on-site" | "online";
    value: string;
  };
  eventType: string;
  author: {
    id: string;
    name: string;
    username?: string | null;
    profilePicture?: string | null;
    isAdmin?: boolean;
  };
  group?: {
    id: string;
    name: string;
    profilePicture?: string | null;
  };
  participantsCount: number;
  allowsParticipants: boolean;
  isParticipating?: boolean;
}

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps) {
  // État pour suivre la participation
  const [isParticipating, setIsParticipating] = useState(
    event.isParticipating || false
  );
  // État pour le nombre de participants
  const [participantsCount, setParticipantsCount] = useState(
    event.participantsCount
  );

  // Mutation pour participer à un événement (à implémenter côté Convex)
  const toggleParticipation = useMutation(
    api.eventParticipants?.toggleParticipation as any
  );

  // Formater la date de début de l'événement au format complet
  const formattedStartDate = format(
    new Date(event.startDate),
    "dd MMMM yyyy 'à' HH'h'mm",
    { locale: fr }
  );

  // Formater la date relative (il y a X jours)
  const relativeDate = formatDistanceToNow(new Date(event.startDate), {
    addSuffix: true,
    locale: fr,
  });

  // Traiter la participation à l'événement
  const handleParticipation = async () => {
    try {
      // Mettre à jour l'interface utilisateur immédiatement
      if (isParticipating) {
        setParticipantsCount((prevCount) => Math.max(prevCount - 1, 0));
      } else {
        setParticipantsCount((prevCount) => prevCount + 1);
      }
      setIsParticipating(!isParticipating);

      // Appeler l'API pour mettre à jour la base de données
      if (toggleParticipation) {
        await toggleParticipation({
          eventId: event.id,
          status: !isParticipating ? "attending" : "declined",
        });
      }
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      console.error("Erreur lors de la participation à l'événement:", error);
      if (isParticipating) {
        setParticipantsCount((prevCount) => prevCount + 1);
      } else {
        setParticipantsCount((prevCount) => Math.max(prevCount - 1, 0));
      }
      setIsParticipating(isParticipating);
    }
  };

  // Obtenir le type d'événement
  const eventTypeLabel =
    eventTypes[event.eventType as keyof typeof eventTypes] || "Autre";

  // Vérifier si l'événement est créé par un administrateur de groupe
  const isGroupAdminEvent = event.group && event.author.isAdmin;

  return (
    <Card className="overflow-hidden">
      {/* En-tête de la carte avec les informations de l'auteur */}
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Avatar de l'auteur ou du groupe si c'est une publication de groupe par un admin */}
            <Avatar className="size-10">
              {isGroupAdminEvent ? (
                // Pour les événements de groupe créés par un admin, on affiche l'avatar du groupe
                <AvatarImage
                  src={event.group?.profilePicture || "/placeholder.svg"}
                  alt={event.group?.name}
                />
              ) : (
                // Pour les événements normaux, on affiche l'avatar de l'utilisateur
                <AvatarImage
                  src={event.author.profilePicture || undefined}
                  alt={event.author.name}
                />
              )}

              {/* Fallback en cas d'absence d'image */}
              <AvatarFallback
                className={cn(
                  isGroupAdminEvent && event.group
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {isGroupAdminEvent && event.group
                  ? getInitialsFromName(event.group.name)
                  : getInitialsFromName(event.author.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              {/* Affichage du nom d'utilisateur si disponible (pour Strategy A) */}
              {event.author.username && !isGroupAdminEvent && (
                <div className="text-sm text-muted-foreground">
                  @{event.author.username}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Nom principal (groupe pour admin events, auteur pour le reste) */}
                <Link
                  href={
                    isGroupAdminEvent && event.group
                      ? `/groups/${event.group.id}`
                      : `/profile/${event.author.id}`
                  }
                  className="font-semibold hover:underline"
                >
                  {isGroupAdminEvent && event.group
                    ? event.group.name
                    : event.author.name}
                </Link>

                {/* Badge pour les administrateurs */}
                {event.author.isAdmin && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0 border-primary text-primary"
                  >
                    Admin
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {/* Date relative */}
                <span>{relativeDate}</span>

                {/* Afficher le nom de l'auteur si c'est un événement de groupe par un admin */}
                {isGroupAdminEvent && (
                  <>
                    <span>•</span>
                    <span>Créé par {event.author.name}</span>
                  </>
                )}

                {/* Afficher le groupe si ce n'est pas un événement de groupe par un admin */}
                {event.group && !isGroupAdminEvent && (
                  <>
                    <span>•</span>
                    <Link
                      href={`/groups/${event.group.id}`}
                      className="hover:underline"
                    >
                      {event.group.name}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu d'actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Plus d'options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Signaler</DropdownMenuItem>
              <DropdownMenuItem>Partager</DropdownMenuItem>
              <DropdownMenuItem>Ajouter au calendrier</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Contenu de l'événement */}
      <CardContent className="pt-4">
        {/* Image de couverture de l'événement */}
        <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
          <img
            src={event.photo || "/placeholder.svg"}
            alt={event.name}
            className="size-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute right-2 top-2" variant="secondary">
            {eventTypeLabel}
          </Badge>
        </div>

        {/* Titre et description */}
        <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 mb-4">
          {event.description}
        </CardDescription>

        {/* Détails de l'événement */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <div>
              {formattedStartDate}
              {event.endDate && (
                <>
                  {" - "}
                  {format(new Date(event.endDate), "HH'h'mm", { locale: fr })}
                </>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div className="flex items-center gap-2 text-sm">
            {event.location.type === "on-site" ? (
              <MapPin className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Globe className="size-4 shrink-0 text-muted-foreground" />
            )}
            <span className="line-clamp-1">
              {event.location.value}
              {event.location.type === "online" && (
                <Link
                  href={event.location.value}
                  className="ml-1 text-primary hover:underline"
                >
                  (Accéder)
                </Link>
              )}
            </span>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 shrink-0 text-muted-foreground" />
            <span>
              {participantsCount} participant
              {participantsCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Pied de carte avec actions */}
      <CardFooter className="flex justify-between border-t pt-4">
        {/* Bouton de participation si l'événement accepte les participants */}
        {event.allowsParticipants ? (
          <Button
            variant={isParticipating ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={handleParticipation}
          >
            {isParticipating ? (
              <>
                <Check className="size-4" />
                Je participe
              </>
            ) : (
              <>
                <UserIcon className="size-4" />
                Participer
              </>
            )}
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" disabled className="gap-1">
                <Users className="size-4" />
                Participation fermée
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              L'organisateur n'accepte pas les inscriptions pour cet événement.
            </TooltipContent>
          </Tooltip>
        )}

        {/* Bouton de partage */}
        <Button variant="ghost" size="sm">
          Partager
        </Button>
      </CardFooter>
    </Card>
  );
}
