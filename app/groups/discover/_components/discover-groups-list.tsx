"use client";
import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, FileQuestion } from "lucide-react";
import { GroupCard } from "@/app/groups/discover/_components/group-card";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/src/components/ui/button";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";
import { Skeleton } from "@/src/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Id } from "@/convex/_generated/dataModel";
import { SearchFilterSection } from "@/src/components/ui/search-filter-section";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";

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

export default function DiscoverGroupsList() {
  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);

  // États pour les filtres de recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Référence pour le conteneur
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Requête paginée pour les groupes
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.forums.getDiscoverUserGroups,
    {
      searchTerm: debouncedSearchTerm,
      categories: selectedCategories,
    },
    { initialNumItems: 12 }
  );

  // Debouncer pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Utiliser le hook useInfiniteScroll pour la pagination infinie
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

  // Gérer le changement des catégories sélectionnées
  const handleCategoriesChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  // Gérer le changement du terme de recherche
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Déterminer si des filtres sont appliqués
  const isFiltering =
    debouncedSearchTerm !== "" || selectedCategories.length > 0;

  // Filtrer les groupes dont l'utilisateur n'est pas membre
  const groupsWithoutCurrentUser = results.filter(
    (group) => !group.members.includes(currentUser?._id as Id<"users">)
  );

  return (
    <div className="container px-4 py-6 md:py-8 mx-auto" ref={containerRef}>
      {/* En-tête avec titre */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Découvrir des Groupes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Rejoignez des communautés d&apos;intérêt à l&apos;université
        </p>
      </div>

      {/* Section de recherche et filtrage avec le composant SearchFilterSection */}
      <SearchFilterSection
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterOptions={GROUP_MAIN_CATEGORIES}
        selectedFilters={selectedCategories}
        onFiltersChange={handleCategoriesChange}
        searchPlaceholder="Rechercher un groupe par nom..."
        filterLabel="Filtrer par catégorie:"
      />

      {/* Liste des groupes */}
      <div className="space-y-8">
        {groupsWithoutCurrentUser && groupsWithoutCurrentUser.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupsWithoutCurrentUser.map((group) => (
                <GroupCard key={group.id} group={group} />
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
            title="Aucun groupe trouvé"
            description={
              isFiltering
                ? "Aucun groupe ne correspond à votre recherche. Essayez d'autres critères."
                : "Il n'y a pas encore de groupes disponibles à découvrir."
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
