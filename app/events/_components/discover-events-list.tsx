"use client";
import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, FileQuestion } from "lucide-react";
import { EventCard } from "@/src/components/shared/event/event-card";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { Button } from "@/src/components/ui/button";

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
  /* console.log(new Date(Date.now())); */
  /* console.log(
    new Date(1752706800000).toDateString(),
    new Date(Date.now()).toDateString()
  );
  console.log(
    new Date(1752706800000).toDateString() > new Date(Date.now()).toDateString()
  ); */

  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Gérer l'affichage du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton quand on descend de plus de 500px
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour revenir en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-60"
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={scrollToTop}
              aria-label="Retour en haut"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
