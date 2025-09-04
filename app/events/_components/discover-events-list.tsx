"use client";
import React, { useRef, useEffect, useState } from "react";
import { FileQuestion } from "lucide-react";
import { EventCard } from "@/src/components/shared/event/event-card";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { ScrollToTop } from "@/src/components/ui/scroll-to-top";

/**
 * État d'affichage lors du chargement
 */
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

export default function DiscoverEventsList({
  searchTerm,
  selectedCategories,
}: {
  searchTerm: string;
  selectedCategories: string[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.events.getDiscoverEvents,
    {
      searchTerm: searchTerm,
      eventTypes: selectedCategories,
    },
    { initialNumItems: 12 }
  );

  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "200px",
  });

  // Déterminer si des filtres sont appliqués
  const isFiltering = searchTerm !== "" || selectedCategories.length > 0;

  return (
    <div ref={containerRef}>
      {/* Liste des événements */}
      <div className="space-y-8">
        {results && results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {/* Element de référence pour l'intersection observer */}
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
              isFiltering
                ? "Aucun événement ne correspond à votre recherche. Essayez d'autres critères."
                : "Il n'y a pas encore d'événements à découvrir."
            }
            icons={[FileQuestion]}
          />
        )}
      </div>

      {/* Bouton de retour en haut de page */}
      <ScrollToTop />
    </div>
  );
}
