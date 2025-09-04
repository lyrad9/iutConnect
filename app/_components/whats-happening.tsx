"use client";
import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Dot, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function WhatsHappening() {
  // Récupérer les 5 derniers événements en cours
  const currentEvents = useQuery(api.events.getLastCurrentEvents);

  // Limiter à 5 événements maximum
  const displayEvents = currentEvents?.slice(0, 5) || [];

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Événements en cours</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/events/ongoing">Voir tout</Link>
        </Button>
      </div>
      <div className="p-4">
        {displayEvents.length > 0 ? (
          <div className="space-y-4">
            {displayEvents.map((event) => (
              <div key={event._id} className="space-y-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{event.eventType}</span>
                  <Dot className="size-4" />
                  <span>
                    {formatDistanceToNow(new Date(event.startDate), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
                <Link
                  href={`/events/${event._id}`}
                  className="block font-semibold hover:underline"
                >
                  {event.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {event.participants
                    ? `${event.participants.length} participants`
                    : "Aucun participant"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Aucun événement en cours</p>
          </div>
        )}
      </div>
    </div>
  );
}
