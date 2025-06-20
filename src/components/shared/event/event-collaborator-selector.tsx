"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Control, useController } from "react-hook-form";
import { User, X, Loader2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { EventFormValues } from "./event-form-schema";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "use-debounce";
import { getInitials } from "@/src/lib/utils";

type EventCollaboratorSelectorProps = {
  control: Control<EventFormValues>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function EventCollaboratorSelector({
  control,
  isModalOpen,
  setIsModalOpen,
}: EventCollaboratorSelectorProps) {
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery] = useDebounce(rawQuery, 400); // 🔹 debounce value

  const { field } = useController({
    name: "collaborators",
    control,
  });

  const searchResults = useQuery(
    api.users.selectCollaborators,
    searchQuery.length > 2
      ? { searchQuery, limit: 20 }
      : { searchQuery: undefined, limit: 20 }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawQuery(e.target.value);
  };

  const toggleCollaborator = (id: string) => {
    if (field.value.includes(id)) {
      field.onChange(field.value.filter((collabId) => collabId !== id));
    } else {
      field.onChange([...field.value, id]);
    }
  };

  const saveCollaborators = () => setIsModalOpen(false);
  const removeCollaborator = (id: string) =>
    field.onChange(field.value.filter((collabId) => collabId !== id));
  return (
    <FormField
      control={control}
      name="collaborators"
      render={() => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Coorganisateurs</FormLabel>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-background/50"
            >
              <User className="mr-1 size-4" />
              Ajouter
            </Button>
          </div>

          {field.value.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {searchResults &&
                searchResults.length > 0 &&
                searchResults
                  .filter((c) => field.value.includes(c.id))
                  .map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-sm"
                    >
                      <Avatar className="size-6">
                        <AvatarImage
                          src={collab.avatar ?? "/placeholder.svg"}
                          alt={collab.name}
                        />
                        <AvatarFallback>
                          {getInitials(collab.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{collab.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="h-4 w-4 p-0"
                        onClick={() => removeCollaborator(collab.id)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
            </div>
          )}

          <FormMessage />

          {/* Modal pour les collaborateurs */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter des coorganisateurs</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="relative">
                  <Input
                    placeholder="Rechercher des personnes..."
                    defaultValue={searchQuery}
                    onChange={handleInputChange}
                    className="bg-background/50 border-border/50"
                  />
                  {searchQuery !== rawQuery && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`collab-${collab.id}`}
                          checked={field.value.includes(collab.id)}
                          onCheckedChange={() => toggleCollaborator(collab.id)}
                        />
                        <Label
                          htmlFor={`collab-${collab.id}`}
                          className="flex flex-1 cursor-pointer items-center space-x-2"
                        >
                          <Avatar className="size-7">
                            <AvatarImage
                              src={collab.avatar}
                              alt={collab.name}
                            />
                            <AvatarFallback>
                              {getInitials(collab.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{collab.name}</span>
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      {searchQuery !== rawQuery
                        ? "Recherche en cours..."
                        : searchQuery.length > 0
                          ? "Aucun résultat trouvé"
                          : "Commencez à taper pour rechercher"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="button" onClick={saveCollaborators}>
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </FormItem>
      )}
    />
  );
}
