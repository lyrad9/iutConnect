"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Earth, Loader2, Users, Lock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { MultiAvatar } from "@/src/components/ui/multi-avatar";
import { GroupMembersAvatars } from "@/src/components/groups/group-members-avatars";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    logoImage?: string;
    membersCount: number;
    type: string;
    confidentiality: "public" | "private";
    joined: boolean;
    requestStatus: boolean;
    author?: {
      id: string;
      name: string;
    } | null;
  };
}

// Composant pour le contenu du tooltip/popover
const GroupTooltipContent = ({ group }: { group: GroupCardProps["group"] }) => (
  <div className="w-full">
    <h3 className="text-lg font-bold mb-2">{group.name}</h3>

    {/* Description courte */}
    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
      {group.description}
    </p>

    <div className="space-y-2 mb-3">
      {/* Auteur si présent */}
      {group.author && (
        <div className="flex items-center gap-2 text-sm">
          <Users className="size-4 text-muted-foreground" />
          <span>Créé par {group.author.name}</span>
        </div>
      )}

      {/* Confidentialité du groupe */}
      <div className="flex items-center gap-2 text-sm">
        {group.confidentiality === "public" ? (
          <Earth className="size-4 text-muted-foreground" />
        ) : (
          <Lock className="size-4 text-muted-foreground" />
        )}
        <span>
          Groupe {group.confidentiality === "public" ? "public" : "privé"}
        </span>
      </div>

      {/* Type de groupe */}
      <div className="flex items-center gap-2 text-sm">
        <Badge variant="secondary" className="h-5">
          {group.type}
        </Badge>
      </div>
    </div>

    <Button asChild size="sm" className="w-full">
      <Link href={`/groups/${group.id}`}>
        Voir le groupe
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </Button>
  </div>
);

export function GroupCard({ group }: GroupCardProps) {
  const [isLoadingPublicGroup, setIsLoadingPublicGroup] = React.useState(false);
  // Loading pour les groupes privés
  const [isLoadingPrivateGroup, setIsLoadingPrivateGroup] =
    React.useState(false);

  // Annuler une demande de rejoindre un groupe
  const cancelGroupJoinRequest = useMutation(api.forums.cancelGroupJoinRequest);
  // Faire une demande de rejoindre un groupe pour un groupe  privé
  const requestGroupJoin = useMutation(api.forums.requestGroupJoin);
  // Rejoindre un groupe public
  const joinPublicGroup = useMutation(api.forums.joinPublicGroup);

  const handleJoinPublicGroup = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation
    e.stopPropagation(); // Empêche la propagation au parent

    setIsLoadingPublicGroup(true);
    try {
      await joinPublicGroup({ groupId: group.id as Id<"forums"> });
      toast.success("Groupe rejoint");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingPublicGroup(false);
    }
  };

  const handleRequestPrivateGroupJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation
    e.stopPropagation(); // Empêche la propagation au parent

    setIsLoadingPrivateGroup(true);

    try {
      // L'utilisaeur a déjà fait une demande, on annule la demande
      if (group.requestStatus) {
        await cancelGroupJoinRequest({ groupId: group.id as Id<"forums"> });
      } else {
        // L'utilisateur fait une demande
        await requestGroupJoin({ groupId: group.id as Id<"forums"> });
        toast.success("Demande de rejoindre le groupe envoyée");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoadingPrivateGroup(false);
    }
  };

  return (
    <Link
      href={`/groups/${group.id}`}
      className="block transition-transform duration-200 hover:scale-[1.02]"
    >
      <Card className="overflow-hidden h-full border border-muted/40 shadow-md hover:shadow-lg transition-all py-0 ">
        <div className="relative h-[170px] w-full bg-gradient-to-br from-muted/30 to-muted/10">
          <img
            src={group.coverImage ?? "/placeholder.svg"}
            alt={`${group.name} couverture`}
            className="size-full object-cover"
          />

          {/* Badge de catégorie */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-sm"
            >
              {group.type}
            </Badge>
          </div>

          <div className="z-60 absolute -bottom-12 left-4 size-24 overflow-hidden border-4 border-background bg-background shadow-lg rounded-full">
            <img
              src={group.logoImage ?? "/placeholder.svg"}
              alt={`${group.name} logo`}
              className="size-full rounded-full object-cover"
            />
          </div>
        </div>

        <CardContent className="pt-10 px-4">
          {/* Titre avec tooltip pour desktop */}
          <div className="lg:block hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-xl font-semibold line-clamp-1 hover:underline cursor-pointer">
                  {group.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent
                arrowColor="accent"
                className="w-80 p-4 bg-accent"
                side="bottom"
              >
                <GroupTooltipContent group={group} />
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Version mobile avec popover */}
          <div className="lg:hidden block">
            <Popover>
              <PopoverTrigger asChild>
                <h3 className="text-xl font-semibold line-clamp-1 hover:underline cursor-pointer">
                  {group.name}
                </h3>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <GroupTooltipContent group={group} />
              </PopoverContent>
            </Popover>
          </div>

          <p className="mt-1 text-muted-foreground text-sm flex items-center gap-1 flex-wrap">
            {group.author && (
              <>
                <span>Créé par {group.author.name}</span>
                <span className="mx-1">•</span>
              </>
            )}

            {/*Afficher la confidentialité du groupe avec icône */}
            {group.confidentiality === "public" && (
              <>
                <Earth className="size-3" />
                <span>public</span>
              </>
            )}
            {group.confidentiality === "private" && (
              <>
                <Lock className="size-3" />
                <span>privé</span>
              </>
            )}
          </p>

          <p className="mt-3 mb-3 line-clamp-2 text-sm text-muted-foreground">
            {group.description}
          </p>

          {/* Affichage des membres avec MultiAvatar */}
          <GroupMembersAvatars
            groupId={group.id}
            membersCount={group.membersCount}
          />
        </CardContent>

        <CardFooter className="p-4 pt-2">
          <motion.div className="w-full" whileTap={{ scale: 0.97 }}>
            {/* En fonction de la confidentialité du groupe on affiche deux boutons défférents */}
            {group.confidentiality === "private" ? (
              <Button
                variant={group.requestStatus ? "outline" : "default"}
                className="w-full"
                onClick={handleRequestPrivateGroupJoin}
                disabled={isLoadingPrivateGroup}
              >
                {isLoadingPrivateGroup ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : group.requestStatus ? (
                  "Annuler la demande"
                ) : (
                  "Rejoindre"
                )}
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={handleJoinPublicGroup}
                disabled={isLoadingPublicGroup}
              >
                {isLoadingPublicGroup ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Rejoindre"
                )}
              </Button>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </Link>
  );
}
