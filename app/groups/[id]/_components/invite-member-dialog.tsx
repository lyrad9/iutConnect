"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { UserPlus, Search, X, Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Skeleton } from "@/src/components/ui/skeleton";

/**
 * Dialogue pour inviter des membres à rejoindre le groupe
 */
export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Récupérer les utilisateurs correspondant à la recherche
  const searchResults = useQuery(api.users.selectCollaborators, {
    searchQuery: searchTerm,
    limit: 10,
  });

  // Gérer la sélection/désélection d'un utilisateur
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Envoyer les invitations aux utilisateurs sélectionnés
  const handleInvite = () => {
    // Logique pour envoyer les invitations
    console.log("Invitations envoyées à:", selectedUsers);
    setOpen(false);
    setSelectedUsers([]);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter des membres
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter des membres</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez des utilisateurs à inviter dans ce
            groupe.
          </DialogDescription>
        </DialogHeader>

        {/* Recherche d'utilisateurs */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom ou email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Utilisateurs sélectionnés */}
        {selectedUsers.length > 0 && (
          <div className="mt-2">
            <Label className="text-xs font-medium">Sélectionnés</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedUsers.map((userId) => {
                const user = searchResults?.find((u) => u.id === userId);
                return (
                  <Badge
                    key={userId}
                    variant="secondary"
                    className="flex items-center gap-1 pl-1 pr-2 py-1"
                  >
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user?.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => toggleUserSelection(userId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        <ScrollArea className="h-[200px] mt-2">
          {searchResults === undefined ? (
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          ) : searchResults === null || searchResults.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground p-4">
              {searchTerm
                ? "Aucun utilisateur trouvé"
                : "Commencez à taper pour rechercher des utilisateurs"}
            </p>
          ) : (
            <div className="space-y-1">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer ${
                    selectedUsers.includes(user.id) ? "bg-accent/30" : ""
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedUsers([]);
              setSearchTerm("");
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleInvite}
            disabled={selectedUsers.length === 0}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Inviter {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
