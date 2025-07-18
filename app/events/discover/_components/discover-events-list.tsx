"use client";
import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, FileQuestion } from "lucide-react";
import { EventCard } from "@/src/components/shared/event/event-card";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/src/components/ui/button";
import { eventTypes } from "@/src/components/utils/const/event-type";
import { Skeleton } from "@/src/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "@/src/components/ui/empty-state";
import { SearchFilterSection } from "@/src/components/ui/search-filter-section";

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

export default function DiscoverEventsList() {
  /* console.log(new Date(Date.now())); */
  console.log(
    new Date(1752706800000).toDateString(),
    new Date(Date.now()).toDateString()
  );
  console.log(
    new Date(1752706800000).toDateString() > new Date(Date.now()).toDateString()
  );
  // États pour les filtres de recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Référence pour l'élément d'intersection observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Requête paginée pour les événements
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.events.getDiscoverEvents,
    {
      searchTerm: debouncedSearchTerm,
      eventTypes: selectedCategories,
    },
    { initialNumItems: 12 }
  );
  // Trier les évènements par date de début
  const sortedResults = results?.sort((a, b) => a.startDate - b.startDate);

  // Debouncer pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Gérer le défilement pour l'intersection observer
  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;
    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);

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

  // Gérer le changement des catégories sélectionnées
  const handleCategoriesChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  // Déterminer si des filtres sont appliqués
  const isFiltering =
    debouncedSearchTerm !== "" || selectedCategories.length > 0;

  // Obtenir les types d'événements pour le filtre
  const eventTypeOptions = Object.keys(eventTypes).map((key) => key);

  return (
    <div className="container px-4 py-6 md:py-8 mx-auto" ref={containerRef}>
      {/* En-tête avec titre */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Découvrir des Événements
        </h1>
        <p className="mt-2 text-muted-foreground">
          Trouvez des événements qui pourraient vous intéresser
        </p>
      </div>

      {/* Section de recherche et filtre */}
      <SearchFilterSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={eventTypeOptions}
        selectedFilters={selectedCategories}
        onFiltersChange={handleCategoriesChange}
        searchPlaceholder="Rechercher un événement par nom..."
        filterLabel="Filtrer par type d'événement:"
      />

      {/* Liste des événements */}
      <div className="space-y-8">
        {sortedResults && sortedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedResults.map((event) => (
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
