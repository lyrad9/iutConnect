"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  User as UserIcon,
  Check,
  BadgeCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  Video,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn, formatEventDate, formattedTime } from "@/src/lib/utils";
import { eventTypes } from "@/src/components/utils/const/event-type";
import { Id } from "@/convex/_generated/dataModel";
import { PostAuthorType } from "@/src/components/shared/post/post-card";
// Type pour l'événement de groupe
type GroupEventType = {
  id: string;
  name: string;
  description: string;
  photo?: string;
  startDate: number;
  endDate?: number;
  startTime?: string;
  endTime?: string;
  locationType: "on-site" | "online";
  locationDetails: string;
  eventType: string;
  author: PostAuthorType;
  target?: string;
  createdAt: number;
  participants?: Id<"users">[];
  allowsParticipants: boolean;
  isCancelled: boolean;
};

/**
 * Contenu du tooltip pour les événements
 */
const EventTooltipContent = ({ event }: { event: GroupEventType }) => (
  <div className="space-y-2 max-w-xs">
    <div className="font-semibold">{event.name}</div>
    <div className="text-sm text-muted-foreground">{event.description}</div>
    <div className="flex items-center gap-2 text-xs">
      <Calendar className="h-3 w-3" />
      <span>
        {
          formatEventDate(
            event.startDate,
            event.startTime,
            event.endDate,
            event.endTime
          ).text
        }
      </span>
    </div>
    <div className="flex items-center gap-2 text-xs">
      {event.locationType === "online" ? (
        <Globe className="h-3 w-3" />
      ) : (
        <MapPin className="h-3 w-3" />
      )}
      <span>{event.locationDetails}</span>
    </div>
    {event.target && (
      <div className="flex items-center gap-2 text-xs">
        <UserIcon className="h-3 w-3" />
        <span>{event.target}</span>
      </div>
    )}
  </div>
);

/**
 * Carte d'événement pour les groupes
 */
export function GroupEventCard({ event }: { event: GroupEventType }) {
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

  // Obtenir le type d'événement
  const eventTypeInfo = Object.values(eventTypes).find(
    (type) => type.content === event.eventType
  );

  // Vérifier si l'événement est annulé
  const isEventCancelled = event.isCancelled;

  return (
    <Card className="pt-0 relative overflow-x-hidden group hover:shadow-lg transition-shadow">
      {isEventCancelled && (
        <div className="z-50 absolute inset-0 flex items-center justify-center bg-muted-foreground/40">
          <Badge className="absolute left-2 top-2 bg-destructive text-white">
            <AlertCircle className="mr-1 h-4 w-4" />
            Annulé
          </Badge>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        {/* Image de couverture de l'événement */}
        <img
          src={event.photo || "/placeholder.svg"}
          alt={event.name}
          className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <Badge
          className={`absolute bottom-3 left-3 ${eventTypeInfo?.color} ${eventTypeInfo?.textColor}`}
        >
          {eventTypeInfo?.icon}
          <span className="ml-1">{eventTypeInfo?.content}</span>
        </Badge>

        {/* Bouton pour voir l'événement */}
        <Link href={`/events/${event.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/80 p-0 hover:bg-black/60 transition-colors"
          >
            <ExternalLink className="size-4" />
            <span className="sr-only">Voir l&apos;événement</span>
          </Button>
        </Link>
      </div>

      {/* Contenu de l'événement */}
      <CardContent>
        {/* Titre avec tooltip pour desktop */}
        <div className="lg:block hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/events/${event.id}`}>
                <h2 className="text-xl md:text-lg sm:text-base mb-2 hover:underline cursor-pointer truncate">
                  {event.name}
                </h2>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <EventTooltipContent event={event} />
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Titre pour mobile */}
        <div className="lg:hidden">
          <Link href={`/events/${event.id}`}>
            <h2 className="text-xl md:text-lg sm:text-base mb-2 hover:underline cursor-pointer truncate">
              {event.name}
            </h2>
          </Link>
        </div>

        {/* Informations de l'événement */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {/* Date et heure */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className={cn(isLive && "text-green-600 font-medium")}>
              {formattedDate}
            </span>
          </div>

          {/* Heure */}
          {formattedTimeEvent && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formattedTimeEvent}</span>
            </div>
          )}

          {/* Localisation */}
          <div className="flex items-center gap-2">
            {event.locationType === "online" ? (
              <Video className="h-4 w-4" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="truncate">{event.locationDetails}</span>
          </div>

          {/* Public cible */}
          {event.target && (
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="truncate">{event.target}</span>
            </div>
          )}
        </div>

        {/* Informations de l'auteur */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={event.author.profilePicture} />
            <AvatarFallback className="text-xs">
              {event.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">{event.author.name}</span>
            {event.author.isAdmin && (
              <BadgeCheck className="h-3 w-3 text-blue-500" />
            )}
          </div>
        </div>
      </CardContent>

      {/* Pied de carte avec actions */}
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{event.participants?.length || 0} participant(s)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{relativeDate}</span>
          <Link href={`/events/${event.id}`}>
            <Button size="sm" variant="outline">
              Voir détails
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
