"use client";
import React, { useRef, useState } from "react";
import { FileQuestion } from "lucide-react";
import { GroupCard } from "@/app/groups/discover/_components/group-card";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Id } from "@/convex/_generated/dataModel";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { ScrollToTop } from "@/src/components/ui/scroll-to-top";

/**
 * Props du composant DiscoverGroupsList
 */
interface DiscoverGroupsListProps {
  searchTerm: string;
  selectedCategories: string[];
}

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

export default function DiscoverGroupsList({
  searchTerm,
  selectedCategories,
}: DiscoverGroupsListProps) {
  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);

  // Référence pour le conteneur
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Requête paginée pour les groupes avec les filtres reçus en props
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.forums.getDiscoverUserGroups,
    {
      searchTerm,
      categories: selectedCategories,
    },
    { initialNumItems: 12 }
  );

  // Utiliser le hook useInfiniteScroll pour la pagination infinie
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
      {/* Liste des groupes */}
      <div className="space-y-8">
        {results && results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((group) => (
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
      <ScrollToTop />
    </div>
  );
}
