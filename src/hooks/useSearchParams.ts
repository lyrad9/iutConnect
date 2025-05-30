"use client";

import { useQueryState, parseAsString, parseAsInteger } from "nuqs";

export function useSearch() {
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  return { query, setQuery };
}

export function usePagination() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      history: "push",
      shallow: false,
    })
  );
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(5).withOptions({
      history: "push",
      shallow: false,
    })
  );

  return {
    page,
    setPage,
    limit,
    setLimit,
  };
}
