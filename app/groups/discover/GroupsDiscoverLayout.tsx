"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { FileQuestion } from "lucide-react";
import DiscoverGroupsList from "./_components/discover-groups-list";
import { api } from "@/convex/_generated/api";
import { useGroupFilters } from "@/src/hooks/useGroupFilters";
import { SearchFilterSection } from "@/src/components/shared/search-filter-section";
import { HeaderGroupsEvents } from "@/src/components/layout/header-groups-events";

/**
 * Composant principal pour découvrir les groupes
 * Gère l'état des filtres et de la recherche via l'URL
 */
export default function GroupsDiscoverLayout() {
  // Récupérer les filtres depuis l'URL avec nuqs
  const { filters, updateSearchTerm, updateCategories, availableCategories } =
    useGroupFilters();

  // Vérifier s'il y'a des groupes dans la plateforme
  const hasGroups = useQuery(api.forums.hasGroups);

  if (hasGroups === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex flex-col justify-center items-center"
        title="Aucun groupe trouvé"
        icons={[FileQuestion]}
        description="Il n'y a pas de groupes à découvrir dans la plateforme"
      />
    );
  }

  return (
    <div className="container px-4 py-6 md:py-8 mx-auto">
      {/* En-tête avec titre */}
      <HeaderGroupsEvents
        title="Découvrir des Groupes"
        description="Rejoignez des communautés d'intérêt à l'université"
      />

      {/* Section de recherche et filtrage */}
      <SearchFilterSection
        searchTerm={filters.searchTerm || ""}
        onSearchChange={updateSearchTerm}
        filterOptions={availableCategories}
        selectedFilters={filters.categories || []}
        onFiltersChange={updateCategories}
        searchPlaceholder="Rechercher un groupe par nom..."
        filterLabel="Filtrer par catégorie:"
      />

      {/* Liste des groupes avec filtres */}
      <DiscoverGroupsList
        searchTerm={filters.searchTerm || ""}
        selectedCategories={filters.categories || []}
      />
    </div>
  );
}
