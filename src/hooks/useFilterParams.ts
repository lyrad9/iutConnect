"use client";

import { useQueryStates } from "nuqs";
import {
  parseAsString,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsIsoDate,
} from "nuqs";

// Définir les catégories disponibles
const categories = [
  "Social",
  "Academic",
  "Career",
  "Sports",
  "Cultural",
  "Networking",
] as string[];

// Définir les options de tri disponibles
const sortOptions = ["date-asc", "date-desc", "popular"] as string[];

export function useEventFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      // Texte de recherche
      q: parseAsString.withDefault(""),

      // Catégories sélectionnées (tableau de chaînes)
      categories: parseAsArrayOf(
        parseAsStringEnum<(typeof categories)[number]>(categories)
      ),

      // Option de tri
      sort: parseAsStringEnum<(typeof sortOptions)[number]>(
        sortOptions
      ).withDefault("date-desc"),

      // Dates de filtrage (début et fin)
      dateFrom: parseAsIsoDate,
      dateTo: parseAsIsoDate,
    },
    {
      shallow: true, // Ne déclenche pas de navigation complète
      throttleMs: 500, // Limite les mises à jour fréquentes
    }
  );

  // Fonctions d'aide pour mettre à jour les filtres
  const updateSearch = (query: string) => {
    setFilters({ ...filters, q: query });
  };

  const toggleCategory = (category: (typeof categories)[number]) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    setFilters({
      ...filters,
      categories: newCategories.length ? newCategories : null,
    });
  };

  const setDateRange = (from: Date | null, to: Date | null) => {
    setFilters({ ...filters, dateFrom: from, dateTo: to });
  };

  const setSortOption = (sort: (typeof sortOptions)[number]) => {
    setFilters({ ...filters, sort });
  };

  const resetFilters = () => {
    setFilters({
      q: "",
      categories: null,
      sort: "date-desc",
      dateFrom: null,
      dateTo: null,
    });
  };

  return {
    filters,
    updateSearch,
    toggleCategory,
    setDateRange,
    setSortOption,
    resetFilters,
    // Exposer les constantes pour les composants
    availableCategories: categories,
    availableSortOptions: sortOptions,
  };
}
