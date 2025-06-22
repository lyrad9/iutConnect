"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { GroupMembersAvatars } from "@/src/components/groups/group-members-avatars";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Calendar,
  Eye,
  Globe,
  Info,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  PenSquare,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { InviteMemberDialog } from "./invite-member-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { selectGroupProps } from "@/app/groups/[id]/_components/GroupLayout";
import { useGroupModal } from "@/src/components/contexts/group-modal-context";
/**
 * Composant pour afficher les informations d'un groupe
 * Inspiré du composant UserInfo mais adapté pour les groupes
 */
export function GroupInfo({ group }: selectGroupProps) {
  const { openLeaveModal, openDeleteModal } = useGroupModal();

  // Récupérer l'utilisateur connecté pour vérifier s'il est admin
  const currentUser = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur est admin du groupe
  const isAdmin = group.authorId === currentUser?._id;

  // Annuler une demande de rejoindre un groupe
  const cancelGroupJoinRequest = useMutation(api.forums.cancelGroupJoinRequest);
  // Faire une demande de rejoindre un groupe pour un groupe  privé
  const requestGroupJoin = useMutation(api.forums.requestGroupJoin);
  // Rejoindre un groupe public
  const joinPublicGroup = useMutation(api.forums.joinPublicGroup);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Fonction pour rejoindre un groupe en focntion de la confidentialité du groupe
  const joinGroup = async () => {
    if (group.confidentiality === "public") {
      // Rejoindre le groupe
      setIsLoading(true);
      try {
        await joinPublicGroup({ groupId: group._id as Id<"forums"> });
        toast.success("Vous êtes désormais membre du groupe");
      } catch (error) {
        toast.error("Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Demander à rejoindre le groupe
      setIsLoading(true);
      try {
        if (group.requestStatus) {
          await cancelGroupJoinRequest({ groupId: group._id as Id<"forums"> });
          toast.success("Demande de rejoindre le groupe annulée");
        } else {
          await requestGroupJoin({ groupId: group._id as Id<"forums"> });
          toast.success("Demande de rejoindre le groupe envoyée");
        }
      } catch (error) {
        toast.error("Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative rounded-xl bg-muted overflow-hidden">
      {/* Photo de couverture */}
      <div className="h-48 overflow-hidden md:h-72">
        <img
          src={group.coverPhoto || "/placeholder.svg"}
          alt={`Couverture du groupe ${group.name}`}
          className="w-full h-full object-cover"
        />
        {/*  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" /> */}
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-3 w-full">
            {/* Nom du groupe et badge de catégorie */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {group.name}
              </h1>
              <Badge variant="secondary" className="bg-primary/15">
                {group.mainCategory}
              </Badge>

              {/* Badge de visibilité */}
              <Badge
                variant="outline"
                className="ml-1 flex items-center gap-1 bg-background/80"
              >
                {group.confidentiality === "public" ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Privé
                  </>
                )}
              </Badge>
            </div>

            {/* Description courte */}
            <p className="text-muted-foreground max-w-2xl">
              {group.description}
            </p>

            {/* Statistiques du groupe */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {group.members.length || 0} membres
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {group.postsCount || 0} publications
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {group.eventsCount || 0} événements
              </div>
            </div>

            {/* Avatars des membres */}
            <GroupMembersAvatars
              groupId={group._id}
              membersCount={group.members.length || 0}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 self-start">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {}}
                >
                  <PenSquare className="h-4 w-4" />
                  Modifier
                </Button>
                <InviteMemberDialog />
              </>
            )}
            {!isAdmin &&
              !group.members.includes(currentUser?._id as Id<"users">) && (
                <Button
                  variant={group.requestStatus ? "outline" : "default"}
                  className="flex items-center gap-2"
                  onClick={joinGroup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4" />
                  ) : (
                    <>
                      {group.requestStatus ? (
                        "Annuler la demande"
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span>Rejoindre</span>
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}
            {!isAdmin &&
              group.members.includes(currentUser?._id as Id<"users">) && (
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => openLeaveModal(group._id as Id<"forums">)}
                >
                  Quitter le groupe
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
