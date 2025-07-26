"use client";

import React from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EventCard } from "@/src/components/shared/event/event-card";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/src/components/ui/empty-state";

type OwnedEventsListProps = {
  searchTerm: string;
  selectedEventTypes: string[];
  selectedRole: string;
};

// État d'affichage lors du chargement
function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
    </div>
  );
}

export default function OwnedEventsList({
  searchTerm,
  selectedEventTypes,
  selectedRole,
}: OwnedEventsListProps) {
  // Requête pour récupérer les événements de l'utilisateur avec pagination
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.events.getOwnedEvents,
    {
      searchTerm,
      eventTypes: selectedEventTypes,
      role: selectedRole,
    },
    { initialNumItems: 9 }
  );

  // Utiliser le hook useInfiniteScroll pour la pagination infinie
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "200px",
  });

  // Vérifier si des filtres sont appliqués
  const areFiltersActive =
    searchTerm !== "" ||
    selectedEventTypes.length > 0 ||
    selectedRole !== "all";

  return (
    <div className="space-y-8">
      {results && results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {/* Élément de référence pour l'intersection observer */}
          <div ref={loaderRef} className="h-10" />
          {isLoading && <LoadingState />}
        </>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState
          className="mx-auto w-full"
          title="Aucun événement trouvé"
          description={
            areFiltersActive
              ? "Aucun événement ne correspond à votre recherche. Essayez d'autres critères."
              : "Vous n'avez pas d'événements à venir ou passés."
          }
          icons={[FileQuestion]}
        />
      )}
    </div>
  );
}
