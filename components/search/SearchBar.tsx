"use client";

import { ChangeEvent } from "react";
import { useSearch } from "@/hooks/useSearchParams";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  const { query, setQuery } = useSearch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value, {
      throttleMs: 500,
      history: "push",
      shallow: false,
    });
  };

  const clearSearch = () => {
    setQuery(null);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="pl-8"
          value={query || ""}
          onChange={handleChange}
        />
      </div>
      {query && (
        <Button variant="outline" size="sm" onClick={clearSearch}>
          Effacer
        </Button>
      )}
    </div>
  );
}
