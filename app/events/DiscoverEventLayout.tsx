"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import DiscoverEventsList from "./_components/discover-events-list";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarX } from "lucide-react";
import { useEventFilters } from "@/src/hooks/useEventFilters";
import { SearchFilterSection } from "@/src/components/shared/search-filter-section";
import { HeaderGroupsEvents } from "@/src/components/layout/header-groups-events";
export default function DiscoverEventLayout() {
  const {
    filters,
    updateSearchTerm,
    updateEventTypes,
    resetFilters,
    availableCategories,
  } = useEventFilters();

  // Vérifier si l'utilisateur a des favoris
  const hasDiscoverEvents = useQuery(api.events.hasDiscoverEventsPage);

  if (hasDiscoverEvents === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex justify-center items-center flex-col"
        title="Aucun évènement trouvé"
        icons={[CalendarX]}
        description="Il n'y a pas d'évènements à découvrir dans la plateforme"
      />
    );
  }

  return (
    <div className="container px-4 py-6 md:py-8 mx-auto">
      {/* En-tête avec titre */}
      <HeaderGroupsEvents
        title="Découvrir des Événements"
        description="Rejoignez des communautés d'intérêt à l'université"
      />
      <SearchFilterSection
        searchTerm={filters.searchTerm}
        onSearchChange={updateSearchTerm}
        filterOptions={availableCategories}
        selectedFilters={filters.eventTypes || []}
        onFiltersChange={updateEventTypes}
        searchPlaceholder="Rechercher un évènement par nom..."
        filterLabel="Filtrer par catégorie:"
      />
      <DiscoverEventsList
        searchTerm={filters.searchTerm}
        selectedCategories={filters.eventTypes || []}
      />
    </div>
  );
}
