"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CalendarX, Search, X } from "lucide-react";
import OwnedEventsList from "./owned-event-list";
import { useOwnedEventFilters } from "@/src/hooks/useOwnedEventFilters";
import { HeaderGroupsEvents } from "@/src/components/layout/header-groups-events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { SelectorChips } from "@/src/components/ui/selector-chips";

export default function OwnedEventLayout() {
  // Récupérer les filtres depuis l'URL avec nuqs
  const {
    filters,
    updateSearchTerm,
    updateEventTypes,
    updateRole,
    resetFilters,
    availableCategories,
  } = useOwnedEventFilters();

  // Vérifier si l'utilisateur a des événements possédés
  const hasOwnedEvents = useQuery(api.events.hasOwnedEventsPage);

  if (hasOwnedEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Vous n'avez pas d'évènements qui vous appartiennent ou où vous participez"
      />
    );
  }

  // Vérifier si des filtres sont appliqués
  const areFiltersActive =
    filters.searchTerm !== "" ||
    (filters.eventTypes && filters.eventTypes.length > 0) ||
    filters.role !== "all";

  return (
    <div className="container px-4 py-6 md:py-8 mx-auto">
      {/* En-tête avec titre */}
      <HeaderGroupsEvents
        title="Mes événements"
        description="Retrouvez tous les événements que vous organisez ou auxquels vous participez"
      />

      {/* Filtres personnalisés */}
      <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-6">
        <div className="flex gap-2 items-center justify-between">
          {/* Barre de recherche */}
          <div className="relative flex-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un événement..."
              className="pl-9"
              value={filters.searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            {filters.searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground"
                onClick={() => updateSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filtre par rôle */}
          <div className="flex-1">
            <Select value={filters.role || "all"} onValueChange={updateRole}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous mes événements</SelectItem>
                <SelectItem value="organizer">
                  Événements que j&apos;organise
                </SelectItem>
                <SelectItem value="coorganizer">
                  Événements où je co-organise
                </SelectItem>
                <SelectItem value="participant">
                  Événements où je participe
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres par type d'événement */}
        <div>
          <p className="mb-2 text-sm font-medium">
            Filtrer par type d&apos;événement:
          </p>
          <SelectorChips
            options={availableCategories}
            onChange={updateEventTypes}
            value={filters.eventTypes || []}
            className="rounded-xl border-muted/60"
          />
        </div>

        {/* Bouton pour réinitialiser les filtres */}
        {areFiltersActive && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Réinitialiser les filtres
              <X className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Liste des événements avec filtres */}
      <OwnedEventsList
        searchTerm={filters.searchTerm || ""}
        selectedEventTypes={filters.eventTypes || []}
        selectedRole={filters.role || "all"}
      />
    </div>
  );
}
