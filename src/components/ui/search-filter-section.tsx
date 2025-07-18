"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { SelectorChips } from "@/src/components/ui/selector-chips";

export interface SearchFilterSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterOptions: string[];
  selectedFilters: string[];
  onFiltersChange: (selected: string[]) => void;
  searchPlaceholder?: string;
  filterLabel?: string;
}

/**
 * Composant réutilisable pour la recherche et le filtrage
 */
export function SearchFilterSection({
  searchTerm,
  onSearchChange,
  filterOptions,
  selectedFilters,
  onFiltersChange,
  searchPlaceholder = "Rechercher...",
  filterLabel = "Filtrer par catégorie:",
}: SearchFilterSectionProps) {
  return (
    <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-6">
      {/* Champ de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filtres par catégories */}
      <div className="mx-auto w-full">
        <p className="mb-2 text-sm font-medium">{filterLabel}</p>
        <SelectorChips
          options={filterOptions}
          onChange={onFiltersChange}
          value={selectedFilters}
          className="rounded-xl border-muted/60"
        />
      </div>
    </div>
  );
}
