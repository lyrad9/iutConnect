"use client";

import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";

/**
 * Hook personnalisé pour gérer les filtres de groupes via l'URL
 * Utilise nuqs pour stocker l'état de la recherche et des filtres dans l'URL
 *
 * Ce hook permet de:
 * - Stocker et récupérer les paramètres de recherche et filtrage dans l'URL
 * - Partager facilement des liens avec des filtres pré-appliqués
 * - Conserver les filtres lors de la navigation (retour/avant du navigateur)
 * - Synchroniser l'état entre les composants parent et enfant
 *
 * @example
 * ```tsx
 * // Dans un composant layout
 * const {
 *   filters,              // État actuel des filtres
 *   updateSearchTerm,     // Fonction pour mettre à jour le terme de recherche
 *   updateCategories,     // Fonction pour mettre à jour les catégories sélectionnées
 *   resetFilters,         // Fonction pour réinitialiser tous les filtres
 *   availableCategories   // Liste des catégories disponibles
 * } = useGroupFilters();
 *
 * // Utilisation avec un composant de recherche
 * <SearchFilterSection
 *   searchTerm={filters.searchTerm || ""}
 *   onSearchChange={updateSearchTerm}
 *   filterOptions={availableCategories}
 *   selectedFilters={filters.categories || []}
 *   onFiltersChange={updateCategories}
 * />
 *
 * // Transmission des filtres à un composant enfant
 * <DiscoverGroupsList
 *   searchTerm={filters.searchTerm || ""}
 *   selectedCategories={filters.categories || []}
 * />
 * ```
 *
 * @returns Un objet contenant les filtres actuels et les fonctions pour les mettre à jour
 */
export function useGroupFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      // Terme de recherche
      searchTerm: parseAsString.withDefault(""),

      // Catégories sélectionnées (tableau de chaînes)
      categories: parseAsArrayOf(parseAsString),
    },
    {
      shallow: false, // Pour permettre le rendu côté serveur
      throttleMs: 500, // Limite les mises à jour fréquentes
    }
  );

  /**
   * Met à jour le terme de recherche
   * @param term Le nouveau terme de recherche
   */
  const updateSearchTerm = (term: string) => {
    setFilters({ ...filters, searchTerm: term || null });
  };

  /**
   * Met à jour les catégories sélectionnées
   * @param selected Le tableau des catégories sélectionnées
   */
  const updateCategories = (selected: string[]) => {
    setFilters({
      ...filters,
      categories: selected.length > 0 ? selected : null,
    });
  };

  /**
   * Réinitialise tous les filtres à leur valeur par défaut
   */
  const resetFilters = () => {
    setFilters({
      searchTerm: null,
      categories: null,
    });
  };

  return {
    filters,
    updateSearchTerm,
    updateCategories,
    resetFilters,

    // Exposer les constantes pour les composants
    availableCategories: GROUP_MAIN_CATEGORIES,
  };
}
