import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { SideEventLinkProps } from "../../utils/types";
import { eventTypes } from "../../utils/const/event-type";

/**
 * Composant pour un lien d'événement dans la barre latérale
 */
export function EventLink({
  id,
  name,
  date,
  location,
  type,
  photo,
  locationType,
}: SideEventLinkProps) {
  // Récupérer les styles et l'icône en fonction du type d'événement
  const { color, textColor, icon } =
    eventTypes[type as keyof typeof eventTypes] || eventTypes.social;
  console.log(new Date(1753225200000));
  console.log(new Date(Date.now()));
  console.log(new Date(1753225200000) > new Date(Date.now()));

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <Link href={`/events/${id}`} className="flex items-start gap-2">
        {/* Photo de l'événement ou icône par défaut */}
        {photo ? (
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className={`${color} ${textColor}`}>
              {icon}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center ${color} ${textColor} flex-shrink-0`}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1">
            <span>{name}</span>
            {/* Afficher l'icône du type d'événement à côté du nom */}
            {/*  <span className={`text-xs ${textColor}`}>{icon}</span> */}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{date} •</span>
            {locationType === "on-site" ? (
              <span className="text-xs text-muted-foreground">{location}</span>
            ) : (
              <span className="underline text-xs text-muted-foreground">
                {location}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Button>
  );
}
