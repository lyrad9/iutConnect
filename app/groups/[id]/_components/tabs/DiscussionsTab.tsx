"use client";

import { EmptyState } from "@/src/components/ui/empty-state";
import { MessageSquare } from "lucide-react";

/**
 * Onglet "Discussions" pour afficher les discussions du groupe
 * Pour l'instant, ce composant affiche simplement un état vide
 */
export function DiscussionsTab() {
  return (
    <EmptyState
      title="Aucune discussion pour le moment"
      description="Les discussions du groupe seront affichées ici."
      icons={[MessageSquare]}
    />
  );
}
