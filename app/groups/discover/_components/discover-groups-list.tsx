"use client";
import React, { useRef, useEffect, useState } from "react";
import { Search, ArrowUp, FileQuestion } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { GroupCard } from "@/app/groups/discover/_components/group-card";
import { SelectorChips } from "@/src/components/ui/selector-chips";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/src/components/ui/button";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";
import { Skeleton } from "@/src/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Id } from "@/convex/_generated/dataModel";

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

  // Référence pour l'élément d'intersection observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
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
  console.log("results", results);
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
  /* if(results) */
  // Déterminer si des filtres sont appliqués
  const isFiltering =
    debouncedSearchTerm !== "" || selectedCategories.length > 0;
  // A partir du tableau results, extraire un tableau qui contient seulement les groupes dont l'utilisateur n'est pas dans la liste des membres
  const groupsWithoutCurrentUser = results.filter(
    (group) => !group.members.includes(currentUser?._id as Id<"users">)
  );
  console.log("groupsWithoutCurrentUser", groupsWithoutCurrentUser);
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

      {/* Section de recherche */}
      <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un groupe par nom..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtres par catégories */}
        <div className="mx-auto w-full">
          <p className="mb-2 text-sm font-medium">Filtrer par catégorie:</p>
          <SelectorChips
            options={GROUP_MAIN_CATEGORIES}
            onChange={handleCategoriesChange}
            className="rounded-xl border-muted/60"
          />
        </div>
      </div>

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
