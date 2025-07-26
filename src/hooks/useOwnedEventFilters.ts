import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { eventTypes } from "@/src/components/utils/const/event-type";

export function useOwnedEventFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      searchTerm: parseAsString.withDefault(""),
      eventTypes: parseAsArrayOf(parseAsString),
      role: parseAsString.withDefault("all"),
    },
    {
      shallow: false,
      throttleMs: 500,
    }
  );

  const updateSearchTerm = (term: string) => {
    setFilters({
      searchTerm: term,
    });
  };

  const updateEventTypes = (types: string[]) => {
    setFilters({
      eventTypes: types,
    });
  };

  const updateRole = (role: string) => {
    setFilters({
      role: role,
    });
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      eventTypes: [],
      role: "all",
    });
  };
  return {
    filters,
    updateSearchTerm,
    updateEventTypes,
    updateRole,
    resetFilters,
    availableCategories: Object.values(eventTypes).map((type) => type.content),
  };
}
