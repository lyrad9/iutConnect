"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookmarkPlus, BookmarkX } from "lucide-react";
import { EmptyState } from "@/src/components/ui/empty-state";
import { BookMarksList } from "./BookMarksList";

export function BookmarksLayout() {
  // Vérifier si l'utilisateur a des favoris
  const hasFavorites = useQuery(api.favorites.hasFavorites);

  if (hasFavorites === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun favori trouvé"
        icons={[BookmarkX]}
        description="Vous n'avez pas encore ajouté de publications à vos favoris. Cliquez sur l'icône de signet sur une publication pour l'ajouter ici."
      />
    );
  }
  return <BookMarksList />;
}
