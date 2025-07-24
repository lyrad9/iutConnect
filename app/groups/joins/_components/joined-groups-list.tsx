"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Earth,
  Globe,
  LockKeyhole,
  Search,
  Users,
  Lock,
  MoreVertical,
  Eye,
  LogOut,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useDebounce } from "use-debounce";
import { GroupMembersAvatars } from "@/src/components/groups/group-members-avatars";
import { Badge } from "@/src/components/ui/badge";
import LoadingPendingRequests from "./Loading";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { useGroupModal } from "@/src/components/contexts/group-modal-context";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { Id } from "@/convex/_generated/dataModel";

export default function JoinedGroupsList() {
  // États pour la recherche et le filtre
  const [rawTerm, setRawTerm] = useState("");
  const [searchQuery] = useDebounce(rawTerm, 400);
  const [filterType, setFilterType] = useState<"all" | "admin" | "member">(
    "all"
  );

  // Récupérer l'utilisateur connecté
  const currentUser = useQuery(api.users.currentUser);
  // Utiliser le contexte des modales
  const { openLeaveModal, openDeleteModal } = useGroupModal();

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

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "200px",
  });

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
                                  openLeaveModal(group._id as Id<"forums">)
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
                                  openDeleteModal(group._id as Id<"forums">)
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer le groupe
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <GroupMembersAvatars
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

              {/* Référence pour l'infinite scroll */}
              {status === "CanLoadMore" && (
                <div
                  ref={loaderRef}
                  className="py-4 flex justify-center items-center text-muted-foreground text-sm"
                >
                  {isLoading && (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                  )}
                  <span>
                    {isLoading
                      ? "Chargement..."
                      : "Faire défiler pour voir plus"}
                  </span>
                </div>
              )}
            </>
          ) : isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingPendingRequests key={index} />
              ))}
            </>
          ) : (
            <EmptyState
              title="Aucun groupe trouvé"
              description={
                searchQuery || filterType !== "all"
                  ? "Essayez de modifier vos critères de recherche"
                  : "Vous n'avez pas encore rejoint de groupes"
              }
              icons={[Users]}
              className="py-16"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
