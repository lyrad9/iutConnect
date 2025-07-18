"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Globe,
  MoreHorizontal,
  Users,
  User as UserIcon,
  Check,
  BadgeCheck,
  AlertCircle,
  FileDown,
  Trash,
  X,
  ChevronRight,
  Target,
  Clock,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  cn,
  getInitials,
  formatEventDate,
  formatDate,
  formattedTime,
} from "@/src/lib/utils";
import { eventTypes } from "@/src/components/utils/const/event-type";
import { Id } from "@/convex/_generated/dataModel";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

// Type pour l'événement
type EventType = {
  id: string;
  name: string;
  description: string;
  photo?: string;
  startDate: number;
  endDate?: number;
  startTime?: string;
  endTime?: string;
  location: {
    type: "on-site" | "online";
    value: string;
  };
  eventType: string;
  author: {
    id: string;
    name: string;
    username?: string;
    profilePicture?: string;
    isAdmin: boolean;
  };
  group?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  target?: string;
  createdAt: number;
  participantsCount: number;
  allowsParticipants: boolean;
  isParticipating: boolean;
  isCancelled: boolean;
};

export function EventCard({ event }: { event: EventType }) {
  // État pour suivre la participation
  const [isParticipating, setIsParticipating] = useState(
    event.isParticipating || false
  );
  // État pour le nombre de participants
  const [participantsCount, setParticipantsCount] = useState(
    event.participantsCount
  );

  // Récupérer le chemin actuel pour déterminer si on affiche les actions admin
  const pathname = usePathname();
  const showAdminActions =
    pathname?.includes("/events/past") ||
    pathname?.includes("/events/attended") ||
    pathname?.includes("/events/upcoming");

  // Récupérer l'utilisateur courant
  const currentUser = useQuery(api.users.currentUser);
  const isEventOwner = currentUser?._id === event.author.id;

  // Mutations pour les actions
  const subscribeToEvent = useMutation(api.events.suscribeToEvent);
  const unsubscribeFromEvent = useMutation(api.events.unsubscribeFromEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const cancelEvent = useMutation(api.events.cancelEvent);

  // Formater la date relative (il y a X jours)
  const relativeDate = formatDistanceToNow(new Date(event.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  // Formater la date d'événement selon les règles
  const { text: formattedDate, isLive } = formatEventDate(
    event.startDate,
    event.startTime as string,
    event.endDate ?? null,
    event.endTime
  );
  const formattedTimeEvent = formattedTime(
    event.startTime as string,
    event.endTime
  );

  // Traiter la participation à l'événement
  const handleParticipation = async () => {
    try {
      // Mettre à jour l'interface utilisateur immédiatement
      if (isParticipating) {
        setParticipantsCount((prevCount) => Math.max(prevCount - 1, 0));
        setIsParticipating(false);
        await unsubscribeFromEvent({ eventId: event.id as Id<"events"> });
      } else {
        setParticipantsCount((prevCount) => prevCount + 1);
        setIsParticipating(true);
        await subscribeToEvent({ eventId: event.id as Id<"events"> });
      }
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      console.error("Erreur lors de la participation à l'événement:", error);
      if (isParticipating) {
        setParticipantsCount((prevCount) => prevCount + 1);
        setIsParticipating(true);
      } else {
        setParticipantsCount((prevCount) => Math.max(prevCount - 1, 0));
        setIsParticipating(false);
      }
    }
  };

  // Gérer la suppression d'un événement
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent({ eventId: event.id as Id<"events"> });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

  // Gérer l'annulation d'un événement
  const handleCancelEvent = async () => {
    try {
      await cancelEvent({ eventId: event.id as Id<"events"> });
      toast.success("L'événement a été annulé");
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'événement:", error);
    }
  };

  // Gérer l'export des participants
  const handleExportParticipants = async () => {
    // Cette fonction sera implémentée plus tard
    console.log("Exporter les participants de l'événement:", event.id);
  };

  // Obtenir le type d'événement
  const eventTypeInfo =
    eventTypes[event.eventType as keyof typeof eventTypes] || eventTypes.social;

  // Vérifier si l'événement est créé par un administrateur de groupe
  const isGroupAdminEvent = event.group;

  // Vérifier si l'événement est annulé
  const isEventCancelled = event.isCancelled;

  return (
    <Card className="pt-0 relative overflow-x-hidden">
      {/*   {!isEventCancelled && (
        <div className="z-50 absolute inset-0 flex items-center justify-center bg-muted-foreground/40">
          <Badge className="absolute left-2 top-2 bg-destructive text-white">
            <AlertCircle className="mr-1 h-4 w-4" />
            Annulé
          </Badge>
        </div>
      )} */}
      <div className="relative h-48 overflow-hidden">
        {/* Image de couverture de l'événement */}

        <img
          src={event.photo || "/placeholder.svg"}
          alt={event.name}
          className="size-full object-cover"
        />
        <Badge className="absolute bottom-3 left-3" variant="secondary">
          {eventTypeInfo.icon}
          <span className="ml-1">{eventTypeInfo.content}</span>
        </Badge>

        <div className="flex absolute top-2 right-2 z-50">
          {/* Menu d'actions */}
          {/*  {(isEventOwner || showAdminActions) && ( */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-black/80 p-0"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Plus d&apos;options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {event.allowsParticipants && (
                <DropdownMenuItem onClick={handleExportParticipants}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Exporter la liste des participants
                </DropdownMenuItem>
              )}

              {!isEventCancelled && (
                <DropdownMenuItem onClick={handleCancelEvent}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler l&apos;événement
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteEvent}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* )} */}
        </div>
      </div>

      {/* Contenu de l'événement */}
      <CardContent>
        {/* Titre avec popover */}
        <Tooltip>
          <TooltipTrigger asChild>
            <CardTitle className="text-xl mb-2 hover:underline cursor-pointer w-fit">
              {event.name}
            </CardTitle>
          </TooltipTrigger>
          <TooltipContent
            arrowColor="accent"
            className="w-80 p-4 bg-accent"
            side="bottom"
          >
            <h3 className="text-lg font-bold mb-2">{event.name}</h3>

            {/* Groupe si présent */}
            {event.group && (
              <div className="flex items-center gap-2 text-sm mb-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={event.group.profilePicture || "/placeholder.svg"}
                    alt={event.group.name}
                  />
                  <AvatarFallback>
                    {getInitials(event.group.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{event.group.name}</span>
              </div>
            )}

            {/* Description courte */}
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {event.description}
            </p>

            <div className="space-y-2 mb-3">
              {/* Auteur */}
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="size-4 text-muted-foreground" />
                <span>Crée par {event.author.name}</span>
              </div>

              {/* Lieu */}
              <div className="flex items-center gap-2 text-sm">
                {event.location.type === "on-site" ? (
                  <MapPin className="size-4 text-muted-foreground" />
                ) : (
                  <Globe className="size-4 text-muted-foreground" />
                )}
                <span className="line-clamp-1">{event.location.value}</span>
              </div>

              {/* Cible si présente */}
              {event.target && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="size-4 text-muted-foreground" />
                  <span>Pour {event.target}</span>
                </div>
              )}
            </div>

            <Button asChild size="sm" className="w-full">
              <Link href={`/events/${event.id}`}>
                Voir l&apos;événement
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </TooltipContent>
        </Tooltip>

        {/* Détails de l'événement */}
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <div
              className={cn(
                "max-w-md",
                isLive ? "text-destructive font-medium" : ""
              )}
            >
              {formattedDate}
            </div>
          </div>
          {/* Heure */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <span>{formattedTimeEvent}</span>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline"
                >
                  (Accéder)
                </Link>
              )}
            </span>
          </div>

          {/* Participants */}
          {event.allowsParticipants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="size-4 shrink-0 text-muted-foreground" />
              <span>
                {participantsCount} participant
                {participantsCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Pied de carte avec actions */}
      <CardFooter className="">
        {/* Bouton de participation si l'événement accepte les participants */}
        {event.allowsParticipants && (
          <Button
            variant={isParticipating ? "default" : "outline"}
            className={cn(
              "w-full",
              isParticipating && "border-primary text-primary"
            )}
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
        )}
      </CardFooter>
    </Card>
  );
}
