"use client";

import { EmptyState } from "@/src/components/ui/empty-state";
import { CalendarDays } from "lucide-react";

/**
 * Onglet "Événements" pour afficher les événements du groupe
 * Pour l'instant, ce composant affiche simplement un état vide
 */
export function EventsTab() {
  return (
    <EmptyState
      title="Aucun événement pour le moment"
      description="Les événements du groupe seront affichés ici."
      icons={[CalendarDays]}
    />
  );
}
