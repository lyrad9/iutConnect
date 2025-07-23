"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarX } from "lucide-react";
import OwnedEventsList from "./owned-event-list";

export default function OwnedEventLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasOwnedEvents = useQuery(api.events.hasOwnedEventsPage);

  if (hasOwnedEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Vous n'avez pas d'évènements créés"
      />
    );
  }

  return <OwnedEventsList />;
}
