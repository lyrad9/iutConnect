"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { GroupInfo } from "./GroupInfo";
import TabsUnderline, { TabItem } from "@/src/components/ui/tab2";
import { AboutTab } from "./tabs/AboutTab";
import { DiscussionsTab } from "./tabs/DiscussionsTab";
import { EventsTab } from "./tabs/EventsTab";
import {
  BookOpen,
  CalendarDays,
  MessageSquare,
  Users,
  Lock,
} from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";

export type selectGroupProps = {
  group: Doc<"forums"> & {
    postsCount: number;
    eventsCount: number;
    requestStatus: boolean;
  };
};

/**
 * Layout principal pour la page d'un groupe
 * Affiche les informations du groupe et les onglets de contenu
 */
export function GroupLayout({ id }: { id: string }) {
  // Récupérer les données du groupe depuis Convex
  const group = useQuery(api.forums.getGroupById, {
    forumId: id as Id<"forums">,
  });
  const currentUser = useQuery(api.users.currentUser);
  if (
    group?.visibility === "masked" &&
    !group.members.includes(currentUser?._id as Id<"users">)
  ) {
    return (
      <EmptyState
        title="Groupe masqué"
        description="Ce groupe n'est pas visible pour ceux qui ne sont pas membres"
        icons={[Lock]}
        className="max-w-full min-h-screen flex flex-col justify-center items-center"
      />
    );
  }

  // Si le groupe est en cours de chargement
  if (group === undefined) {
    return <GroupLayoutSkeleton />;
  }

  // Si le groupe n'existe pas
  if (group === null) {
    return (
      <EmptyState
        title="Groupe introuvable"
        description="Ce groupe n'existe pas ou a été supprimé"
        icons={[Users]}
      />
    );
  }

  // Définir les onglets avec leur contenu
  const tabs: TabItem[] = [
    {
      id: "about",
      label: "À propos",
      icon: Users,
      content: <AboutTab group={group} />,
    },
    {
      id: "discussions",
      label: "Discussions",
      icon: MessageSquare,
      /*     badge: {
        content: "0",
        variant: "secondary",
      }, */
      content: (
        <DiscussionsTab
          groupId={group._id}
          profilImageGroup={group.profilePicture}
        />
      ),
    },
    {
      id: "events",
      label: "Événements",
      icon: CalendarDays,
      /*   badge: {
        content: "0",
        variant: "secondary",
      }, */
      content: <EventsTab groupId={group._id} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Informations du groupe */}
      <GroupInfo group={group} />

      {/* Onglets de contenu */}
      <TabsUnderline
        tabs={tabs}
        defaultTab="about"
        fullWidth={true}
        className="mt-8"
      />
    </div>
  );
}

/**
 * Squelette de chargement pour le layout du groupe
 */
function GroupLayoutSkeleton() {
  return (
    <div className="space-y-6">
      {/* Squelette pour les informations du groupe */}
      <div className="relative rounded-xl bg-muted overflow-hidden">
        {/* Cover photo */}
        <div className="h-48 overflow-hidden md:h-72">
          <Skeleton className="h-full w-full object-cover" />
        </div>

        <div className="p-4 md:p-6">
          {/* Titre et informations */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-2 w-full">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-2xl mb-4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Squelette pour les onglets */}
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex gap-4 pb-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="mt-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
