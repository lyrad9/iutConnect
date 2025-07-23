"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import PastEventsList from "./past-events-list";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarX } from "lucide-react";
export default function PastEventLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasPastEvents = useQuery(api.events.hasPastEventsPage);

  if (hasPastEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Pas d'évènement passés"
      />
    );
  }

  return <PastEventsList />;
}
