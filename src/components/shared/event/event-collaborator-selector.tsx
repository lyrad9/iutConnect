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
import { Collaborator } from "../types";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { debounce } from "lodash";

type EventCollaboratorSelectorProps = {
  control: Control<EventFormValues>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Données fictives pour les collaborateurs en attendant l'intégration avec l'API
const initialCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=1",
    selected: false,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    selected: false,
  },
  {
    id: "3",
    name: "Bob Johnson",
    avatar: "https://i.pravatar.cc/150?img=3",
    selected: false,
  },
  {
    id: "4",
    name: "Alice Brown",
    avatar: "https://i.pravatar.cc/150?img=4",
    selected: false,
  },
];
export function EventCollaboratorSelector({
  control,
  isModalOpen,
  setIsModalOpen,
}: EventCollaboratorSelectorProps) {
  const [collaborators, setCollaborators] =
    useState<Collaborator[]>(initialCollaborators);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { field } = useController({
    name: "collaborators",
    control,
  });

  // Utilisation de la requête searchUsers de Convex (à implémenter)
  // const searchResults = useQuery(api.users.searchUsers,
  //   searchQuery ? { searchQuery, limit: 20 } : null
  // );

  // Fonction debounce pour la recherche
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length > 2) {
        setIsSearching(true);
        // Simuler une recherche asynchrone
        setTimeout(() => {
          // Ici, nous filtrons les collaborateurs locaux
          // À remplacer par l'appel API réel avec searchResults
          const results = initialCollaborators.filter((c) =>
            c.name.toLowerCase().includes(query.toLowerCase())
          );
          setCollaborators(results);
          setIsSearching(false);
        }, 300);
      } else {
        setCollaborators(initialCollaborators);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const toggleCollaborator = (id: string) => {
    setCollaborators((prev) =>
      prev.map((collab) =>
        collab.id === id ? { ...collab, selected: !collab.selected } : collab
      )
    );
  };

  const saveCollaborators = () => {
    const selected = collaborators.filter((c) => c.selected).map((c) => c.id);
    field.onChange(selected);
    setIsModalOpen(false);
  };

  const removeCollaborator = (id: string) => {
    const updatedCollaborators = field.value.filter(
      (collabId) => collabId !== id
    );
    field.onChange(updatedCollaborators);

    // Mise à jour de l'état local
    setCollaborators((prev) =>
      prev.map((collab) =>
        collab.id === id ? { ...collab, selected: false } : collab
      )
    );
  };

  const filteredCollaborators = collaborators.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {collaborators
                .filter((c) => field.value.includes(c.id))
                .map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-sm"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={collab.avatar} alt={collab.name} />
                      <AvatarFallback>
                        {collab.name.substring(0, 2)}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background/50 border-border/50"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {filteredCollaborators.length > 0 ? (
                    filteredCollaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`collab-${collab.id}`}
                          checked={collab.selected}
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
                              {collab.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{collab.name}</span>
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      {isSearching
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
