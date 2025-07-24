"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "@/src/components/ui/empty-state";
import { CalendarX } from "lucide-react";
import AttentedEventsList from "./attented-events-list";

export default function AttentedEventLayout() {
  const hasAttentedEvents = useQuery(api.events.hasAttentedEventsPage);
  if (hasAttentedEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Il n'y a pas d'évènements auxquels vous participez"
      />
    );
  }

  return <AttentedEventsList />;
}
