"use client";

import { useQueryStates, parseAsString } from "nuqs";

/**
 * Hook personnalisé pour gérer les filtres des groupes rejoints via l'URL
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
 *   updateFilterType,     // Fonction pour mettre à jour le type de filtre
 *   resetFilters,         // Fonction pour réinitialiser tous les filtres
 * } = useJoinedGroupsFilters();
 * ```
 *
 * @returns Un objet contenant les filtres actuels et les fonctions pour les mettre à jour
 */
export function useJoinedGroupsFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      // Terme de recherche
      searchTerm: parseAsString.withDefault(""),

      // Type de filtre (all, admin, member)
      filterType: parseAsString.withDefault("all"),
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
   * Met à jour le type de filtre
   * @param type Le nouveau type de filtre
   */
  const updateFilterType = (type: "all" | "admin" | "member") => {
    setFilters({
      ...filters,
      filterType: type,
    });
  };

  /**
   * Réinitialise tous les filtres à leur valeur par défaut
   */
  const resetFilters = () => {
    setFilters({
      searchTerm: null,
      filterType: "all",
    });
  };

  return {
    filters,
    updateSearchTerm,
    updateFilterType,
    resetFilters,
  };
}
