"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Skeleton } from "@/src/components/ui/skeleton";
import { CalendarDays, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { ScrollToTop } from "@/src/components/ui/scroll-to-top";
import { GroupEventCard } from "../event-card";
import { PostAuthorType } from "@/src/components/shared/post/post-card";

type EventsTabProps = {
  groupId: Id<"forums">;
};

/**
 * État d'affichage lors du chargement
 */
function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
        ))}
    </div>
  );
}

/**
 * Onglet "Événements" pour afficher les événements du groupe
 */
export function EventsTab({ groupId }: EventsTabProps) {
  // Requête paginée pour les événements du groupe
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.events.getGroupEvents,
    {
      groupId,
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

  return (
    <div className="space-y-6 px-2 md:px-16">
      {/* Titre de la section */}
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Événements du groupe</h2>
      </div>

      {/* Liste des événements */}
      {results && results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((event) => (
              <GroupEventCard
                key={event.id}
                event={{
                  id: event.id,
                  name: event.name,
                  description: event.description,
                  photo: event.photo as string | undefined,
                  startDate: event.startDate,
                  endDate: event.endDate,
                  startTime: event.startTime,
                  endTime: event.endTime,
                  locationType: event.locationType,
                  locationDetails: event.locationDetails,
                  eventType: event.eventType,
                  author: event.author as PostAuthorType,
                  target: event.target,
                  createdAt: event.createdAt,
                  participants: event.participants,
                  allowsParticipants: event.allowsParticipants,
                  isCancelled: event.isCancelled,
                }}
              />
            ))}
          </div>

          {/* Element de référence pour l'intersection observer */}
          <div ref={loaderRef} className="h-10" />

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState
          className="mx-auto w-full"
          title="Aucun événement pour le moment"
          description="Les événements du groupe seront affichés ici."
          icons={[CalendarDays]}
        />
      )}

      {/* Bouton de retour en haut de page */}
      <ScrollToTop />
    </div>
  );
}
