"use client";

import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { User } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EventFormValues } from "./event-form-schema";
import MultipleSelector, { Option } from "@/src/components/ui/multiselect";

type EventCollaboratorSelectorProps = {
  control: Control<EventFormValues>;
};

export function EventCollaboratorSelector({
  control,
}: EventCollaboratorSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { field } = useController({
    name: "collaborators",
    control,
  });

  // Get all collaborators for initial display and search results
  const searchResults = useQuery(api.users.selectCollaborators, {
    searchQuery: searchQuery.length > 2 ? searchQuery : undefined,
    limit: 20,
  });

  // Convert the current selected collaborators to Option format
  /*  const selectedCollaborators = useQuery(
    api.users.selectCollaborators,
    field.value && field.value.length > 0
      ? { limit: field.value.length }
      : { limit: 0 }
  ); */

  // Transform searchResults to options format for MultipleSelector
  const collaboratorOptions = searchResults
    ? searchResults.map((collab) => ({
        value: collab.id,
        label: collab.name,
        email: collab.email,
        avatar: collab.avatar,
      }))
    : [];

  // Transform selected collaborator IDs to Option format
  const selectedOptions = searchResults
    ? searchResults
        .filter((collab) => field.value.includes(collab.id))
        .map((collab) => ({
          value: collab.id,
          label: collab.name,
          email: collab.email,
          avatar: collab.avatar,
        }))
    : [];

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    return collaboratorOptions;
  };

  // Handle change
  const handleChange = (selected: Option[]) => {
    field.onChange(selected.map((option) => option.value));
  };

  return (
    <FormField
      control={control}
      name="collaborators"
      render={() => (
        <FormItem>
          <FormLabel>Coorganisateurs</FormLabel>
          <MultipleSelector
            value={selectedOptions}
            options={collaboratorOptions}
            placeholder="Rechercher des personnes..."
            emptyIndicator={
              <p className="p-2 text-sm text-muted-foreground text-center">
                Aucun résultat trouvé.
              </p>
            }
            loadingIndicator={
              <div className="flex items-center justify-center p-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  Chargement...
                </span>
              </div>
            }
            onSearchSync={
              searchQuery.length > 2 ? () => collaboratorOptions : undefined
            }
            onSearch={handleSearch}
            onChange={handleChange}
            triggerSearchOnFocus={true}
            delay={400}
            className="bg-background/50 border-border/50"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
