"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarX } from "lucide-react";
import UpcomingEventsList from "./UpcomingEventsList";

export default function UpcomingEventLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasUpcomingEvents = useQuery(api.events.hasUpcomingEventsPage);

  if (hasUpcomingEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Il n'y a pas d'évènements nouveaux dans la plateforme"
      />
    );
  }

  return <UpcomingEventsList />;
}
