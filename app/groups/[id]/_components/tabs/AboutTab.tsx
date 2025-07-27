"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";

import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { Search, Globe, Lock, Shield, Users } from "lucide-react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { EmptyState } from "@/src/components/ui/empty-state";
import { selectGroupProps } from "../GroupLayout";

/**
 * Onglet "À propos" pour afficher les informations détaillées du groupe
 * et la liste des membres avec pagination infinie et recherche
 */
export function AboutTab({ group }: selectGroupProps) {
  // État pour la recherche de membres
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Référence pour l'intersection observer
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Requête paginée pour les membres du groupe
  const {
    results: members,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.forums.paginatedGroupMembers,
    {
      forumId: group._id,
      search: debouncedSearchTerm,
    },
    { initialNumItems: 10 }
  );

  // Debouncer pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Intersection observer pour le chargement infini
  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;

    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(5);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);

  return (
    <div className="space-y-6 px-2 md:px-16">
      {/* À propos du groupe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary"></span>À propos du
            groupe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Description longue */}
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {group.about || "Aucune description détaillée disponible."}
            </p>
          </div>

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Catégorie</h3>
              <Badge variant="secondary" className="bg-primary/15">
                {group.mainCategory}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Visibilité</h3>
              {group.visibility === "visible" ? (
                <p>Tout le monde peut voir le groupe</p>
              ) : (
                <p>
                  Ce groupe n&apos;apparaitra pas dans la recherche et ne sera
                  visible que par les membres du groupe
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Créé le</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(group._creationTime).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Intérêts</h3>
              <div className="flex flex-wrap gap-2">
                {group.interests && group.interests.length > 0 ? (
                  group.interests.map((interest: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-primary/5"
                    >
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Aucun intérêt spécifié
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des membres */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary"></span>
            Membres du groupe
          </CardTitle>

          {/* Recherche de membres */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un membre..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && members.length === 0 ? (
            <MembersLoadingSkeleton />
          ) : members.length > 0 ? (
            <div className="space-y-4">
              {/* Administrateurs */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Administrateurs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members
                    .filter((member) => member._id === group.authorId)
                    .map((admin) => (
                      <MemberCard
                        key={admin._id}
                        member={admin}
                        isAdmin={true}
                      />
                    ))}
                </div>
              </div>

              {/* Membres réguliers */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Membres
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members
                    .filter((member) => member._id !== group.authorId)
                    .map((member) => (
                      <MemberCard
                        key={member._id}
                        member={member}
                        isAdmin={false}
                      />
                    ))}
                </div>
              </div>

              {/* Élément de référence pour l'intersection observer */}
              {status === "CanLoadMore" && (
                <div ref={loaderRef} className="h-10 flex justify-center">
                  {isLoading && <Skeleton className="h-10 w-32" />}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="Aucun membre trouvé"
              description={
                debouncedSearchTerm
                  ? "Aucun membre ne correspond à votre recherche."
                  : "Ce groupe n'a pas encore de membres."
              }
              icons={[Users]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Carte pour afficher un membre du groupe
 */
function MemberCard({ member, isAdmin }: { member: any; isAdmin: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
      <SmartAvatar
        avatar={member.avatar}
        name={member.name}
        size="md"
        className="size-10 border border-border"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{member.name}</p>
          {isAdmin && (
            <Badge variant="secondary" className="bg-primary/15 text-xs">
              Admin
            </Badge>
          )}
        </div>
        {member.email && (
          <p className="text-xs text-muted-foreground truncate">
            {member.email}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Squelette de chargement pour la liste des membres
 */
function MembersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Squelette pour les administrateurs */}
      <div>
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>

      {/* Squelette pour les membres */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  );
}
