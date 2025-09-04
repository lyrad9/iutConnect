import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useJoinedGroupsFilters } from "@/src/hooks/useJoinedGroupsFilters";

export default function JoinedSearchFiltersSection() {
  const { filters, updateSearchTerm, updateFilterType } =
    useJoinedGroupsFilters();
  return (
    <>
      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un groupe..."
            className="pl-9"
            value={filters.searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filters.filterType as "all" | "admin" | "member"}
          onValueChange={(value) =>
            updateFilterType(value as "all" | "admin" | "member")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les groupes</SelectItem>
            <SelectItem value="admin">Groupes administrés</SelectItem>
            <SelectItem value="member">Groupes rejoints</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
