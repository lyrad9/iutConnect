"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookmarkCard } from "./BookmarkCard";
import { BookmarkPlus, LoaderCircle, BookmarkX, Filter } from "lucide-react";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { PostCommentType } from "@/src/components/shared/post/post-card";
import { BookMarksLoadingSkeletons } from "./BookMarksLoadingSkeletons";

/**
 * Liste des favoris avec pagination infinie et filtrage
 * Affiche les publications sauvegardées par l'utilisateur dans une grille responsive
 */
export function BookMarksList() {
  const router = useRouter();
  // Requête paginée pour récupérer les favoris
  const {
    results: favorites,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.favorites.getUserFavorites,
    {},
    { initialNumItems: 10 }
  );

  // Hook pour le scroll infini
  const loadMoreRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(8),
  });

  // Mutation pour supprimer tous les favoris
  const clearAllFavorites = useMutation(api.favorites.removeAllFavorites);

  // Gère la suppression de tous les favoris
  const handleClearAll = async () => {
    try {
      await clearAllFavorites();
      router.refresh();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de tous les favoris:",
        error
      );
    }
  };

  return (
    <div className="">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <BookmarkPlus className="size-7 text-primary" />
          <h1 className="text-2xl font-bold">Mes Favoris</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleClearAll}
              className="whitespace-nowrap"
            >
              <BookmarkX className="mr-2 h-4 w-4" />
              Tout supprimer
            </Button>
          )}
        </div>
      </div>
      {/* Grille de favoris */}
      {favorites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {favorites.map((bookmark) => {
              const safeComments = bookmark.comments.filter(
                (c) => c.author !== undefined
              ) as PostCommentType[];
              return (
                <BookmarkCard
                  key={bookmark.id}
                  favoritePost={{ ...bookmark, comments: safeComments }}
                />
              );
            })}
          </div>
          <div
            ref={loadMoreRef}
            className="h-10 flex justify-center items-center mt-6"
          >
            {status === "LoadingMore" && <BookMarksLoadingSkeletons />}
          </div>
        </>
      ) : isLoading ? (
        <BookMarksLoadingSkeletons />
      ) : (
        <EmptyState
          title="Aucun favori"
          description="Vous n'avez pas encore ajouté de publications à vos favoris. Cliquez sur l'icône de signet sur une publication pour l'ajouter ici."
          icons={[BookmarkX]}
          className="max-w-full"
        />
      )}
    </div>
  );
}
