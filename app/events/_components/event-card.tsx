"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventType } from "@/src/components/utils/types";
import { Badge } from "@/src/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export default function EventCard({ event }: { event: EventType }) {
  return (
    <Link
      key={event.id}
      href={`/events/${event.id}`}
      className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="size-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-background/80">
              {event.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-md border bg-background text-center">
            <span className="text-xs uppercase text-muted-foreground">
              {new Date(event.date).toLocaleString("default", {
                month: "short",
              })}
            </span>
            <span className="text-lg font-bold">
              {new Date(event.date).getDate()}
            </span>
          </div>

          <div>
            <h3 className="line-clamp-1 font-semibold group-hover:underline">
              {event.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(event.endDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>{event.attendeesCount} participants</span>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant={event.attending ? "outline" : "default"}
            className={cn(
              "w-full",
              event.attending && "border-primary text-primary"
            )}
            onClick={(e) => {
              e.preventDefault();
              // Handle attendance toggle
            }}
          >
            {event.attending ? "Je participe" : "Participer"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
