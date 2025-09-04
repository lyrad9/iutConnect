"use client";

import React from "react";
import {
  NavigationBreadcrumb,
  NavigationSection,
} from "@/src/components/ui/navigation-breadcrumb";
import { Users, Compass, UserPlus, Plus } from "lucide-react";

import { GroupCreateBtn } from "@/src/components/shared/forums/group-create-btn";
/**
 * Composant de navigation pour les pages de groupes
 * Utilise le composant NavigationBreadcrumb pour afficher la navigation
 */
export function GroupNavigation({ currentPage }: { currentPage: string }) {
  // Définir les sections de navigation
  const groupSections: NavigationSection[] = [
    {
      label: "Groupes",
      items: [
        {
          label: "Fil d'actualité",
          value: "feed",
          href: "/groups",
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Catégories",
      items: [
        {
          label: "Fil d'actualité",
          value: "feed",
          href: "/groups",
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: "à découvrir",
          value: "discover",
          href: "/groups/discover",
          icon: <Compass className="h-4 w-4" />,
        },
        {
          label: "mes groupes",
          value: "joins",
          href: "/groups/joins",
          icon: <UserPlus className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="lg:hidden  mb-6 flex flex-row justify-between items-center">
      <NavigationBreadcrumb
        sections={groupSections}
        currentSection="Catégories"
        currentItem={currentPage}
        className=""
        icon={<Users className="h-4 w-4" />}
      />
      <GroupCreateBtn />
    </div>
  );
}
