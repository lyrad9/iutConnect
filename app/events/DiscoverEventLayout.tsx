"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import DiscoverEventsList from "./_components/discover-events-list";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarX } from "lucide-react";
export default function DiscoverEventLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasDiscoverEvents = useQuery(api.events.hasDiscoverEventsPage);

  if (hasDiscoverEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Il n'y a pas d'évènements à découvrir dans la plateforme"
      />
    );
  }

  return <DiscoverEventsList />;
}
