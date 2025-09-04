"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarX } from "lucide-react";
import CurrentEventsList from "./CurrentEventsList";

export default function CurrentEventsLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasCurrentEvents = useQuery(api.events.hasCurrentEventsPage);
  /*  const currentEvents = useQuery(api.events.getCurrentEvents);
  console.log("currentEvents", currentEvents); */
  if (hasCurrentEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Il n'y a pas d'évènements en cours"
      />
    );
  }

  return <CurrentEventsList />;
}
