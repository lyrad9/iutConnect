import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { eventTypes } from "@/src/components/utils/const/event-type";

export function useEventFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      searchTerm: parseAsString.withDefault(""),
      eventTypes: parseAsArrayOf(parseAsString),
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

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      eventTypes: [],
    });
  };

  return {
    filters,
    updateSearchTerm,
    updateEventTypes,
    resetFilters,
    availableCategories: Object.values(eventTypes).map((type) => type.content),
  };
}
