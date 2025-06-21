"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Loader2,
  Search,
  Users,
  MoreVertical,
  LogOut,
  Eye,
  Globe,
  LockKeyhole,
  Trash2,
  Earth,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useDebounce } from "use-debounce";
import { GroupMembers } from "../../discover/_components/group-card";
import { Badge } from "@/src/components/ui/badge";
import LoadingPendingRequests from "./Loading";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";

export default function JoinedGroupsList() {
  // États pour la recherche et le filtre
  const [rawTerm, setRawTerm] = useState("");
  const [searchQuery] = useDebounce(rawTerm, 400);
  const [filterType, setFilterType] = useState<"all" | "admin" | "member">(
    "all"
  );
  // Référence pour l'élément d'intersection observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);

  // Requête paginée pour récupérer les groupes rejoints
  const {
    results: joinedGroups,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.forums.getUserGroups,
    {
      searchTerm: searchQuery,
      filterType: filterType,
    },
    {
      initialNumItems: 10,
    }
  );
  console.log("joinedGroups", joinedGroups);
  // Mutation pour quitter un groupe
  const leaveGroup = useMutation(api.forums.leaveGroup);
  // Mutation pour supprimer un groupe
  const deleteGroup = useMutation(api.forums.deleteGroup);

  // Fonction pour supprimer un groupe
  const handleDeleteGroup = async (groupId: Id<"forums">) => {
    try {
      await deleteGroup({ groupId });
      toast.success("Groupe supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du groupe:", error);
      toast.error("Erreur lors de la suppression du groupe");
    }
  };
  // Fonction pour quitter un groupe
  const handleLeaveGroup = async (groupId: Id<"forums">) => {
    try {
      await leaveGroup({ groupId });
      toast.success("Vous ne faites plus partie de ce groupe");
    } catch (error) {
      console.error("Erreur lors de la sortie du groupe:", error);
      toast.error("Erreur lors de la sortie du groupe");
    }
  };

  // Filtrer les groupes en fonction de la recherche et du type de filtre
  /*   const filteredGroups = joinedGroups
    .filter((group) => {
      // Filtrer par terme de recherche
      if (
        debouncedSearchTerm &&
        !group.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtrer par type (admin ou membre)
      if (filterType === "admin" && group.authorId !== currentUser?._id) {
        return false;
      } else if (
        filterType === "member" &&
        group.authorId === currentUser?._id
      ) {
        return false;
      }

      return true;
    })
    // Trier par date de rejointe (joinedAt)
    .sort((a, b) => {
      // Récupérer les dates de joinedAt depuis groupMembers
      const aJoinedAt = a.joinedAt || 0;
      const bJoinedAt = b.joinedAt || 0;
      return bJoinedAt - aJoinedAt;
    }); */

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Mes groupes
          {joinedGroups.length > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {joinedGroups.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Filtres et recherche */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un groupe..."
              className="pl-9"
              value={rawTerm}
              onChange={(e) => setRawTerm(e.target.value)}
            />
          </div>
          <Select
            /*   value={filterType} */
            onValueChange={(value) =>
              setFilterType(value as "all" | "admin" | "member")
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

        <div className="space-y-4">
          {joinedGroups && joinedGroups.length > 0 ? (
            <>
              {joinedGroups.map((group) => (
                <Card key={group._id} className="overflow-hidden pt-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image de couverture (visible seulement sur mobile) */}
                    <div className="relative h-32 w-full md:hidden bg-gradient-to-br from-muted/30 to-muted/10">
                      <img
                        src={group.coverPhoto || "/placeholder.svg"}
                        alt={`${group.name} couverture`}
                        className="h-full w-full object-cover"
                      />

                      {/* Badge de confidentialité */}
                      <div className="absolute top-2 right-2">
                        {group.confidentiality === "private" ? (
                          <Badge>
                            <LockKeyhole className="h-3 w-3" />
                            Privé
                          </Badge>
                        ) : (
                          <Badge>
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Image de profil (visible seulement sur mobile) */}
                    <div className="md:hidden relative -mt-6 mx-auto h-16 w-16 overflow-hidden rounded-full border-4 border-background bg-background">
                      <SmartAvatar
                        avatar={group.profilePicture}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Contenu du groupe */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Image de profil (visible seulement sur desktop) */}
                          <div className="hidden md:block h-12 w-12 overflow-hidden rounded-full border border-muted bg-background">
                            <SmartAvatar
                              avatar={group.profilePicture}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold line-clamp-1">
                              {group.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center flex-wrap">
                              {group.authorId === currentUser?._id
                                ? "Vous êtes administrateur"
                                : "Membre"}
                              {group.authorId === currentUser?._id ? (
                                <>
                                  <span className="mx-1">•</span>
                                  Crée{" "}
                                  {formatDistanceToNow(
                                    new Date(group._creationTime as number),
                                    {
                                      addSuffix: true,
                                      locale: fr,
                                    }
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="mx-1">•</span>
                                  Rejoint{" "}
                                  {formatDistanceToNow(
                                    new Date(group.joinedAt as number),
                                    {
                                      addSuffix: true,
                                      locale: fr,
                                    }
                                  )}
                                </>
                              )}
                              <span className="mx-1">•</span>
                              {/*Afficher la confidentialité du groupe avec icône */}
                              {group.confidentiality === "public" && (
                                <>
                                  <Earth className="size-3 mr-1" />
                                  <span>public</span>
                                </>
                              )}
                              {group.confidentiality === "private" && (
                                <>
                                  <Lock className="size-3 mr-1" />
                                  <span>privé</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Menu d'actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/groups/${group._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Afficher le groupe
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {group.authorId !== currentUser?._id && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  handleLeaveGroup(group._id as Id<"forums">)
                                }
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Quitter le groupe
                              </DropdownMenuItem>
                            )}
                            {group.authorId === currentUser?._id && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  handleDeleteGroup(group._id as Id<"forums">)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer le groupe
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/*    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p> */}

                      <div className="mt-4 flex items-center justify-between">
                        <GroupMembers
                          groupId={group._id}
                          membersCount={group.membersCount || 0}
                        />

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/groups/${group._id}`}>
                            Afficher le groupe
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <div ref={loaderRef} className="h-10" />
              {isLoading && (
                <Loader2 className="animate-spin size-7 mx-auto " />
              )}
              {/*    {status === "LoadingMore" && (
                <div className="flex justify-center p-4">
                  <Loader2 className="size-7 animate-spin text-muted-foreground" />
                </div>
              )} */}
            </>
          ) : isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingPendingRequests key={index} />
              ))}
            </>
          ) : (
            <EmptyState
              title={rawTerm ? "Aucun résultat" : "Aucun groupe"}
              description={
                rawTerm
                  ? "Aucun groupe ne correspond à votre recherche"
                  : "Vous n'avez rejoint aucun groupe"
              }
              icons={[Users]}
              className="py-8"
            />
          )}
        </div>

        {/* Bouton pour charger plus */}
        {/*    {status === "CanLoadMore" && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => loadMore(5)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Charger plus"
              )}
            </Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
