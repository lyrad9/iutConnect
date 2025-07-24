"use client";

import React from "react";
import { Calendar, User2, BookOpen, Users, CalendarDays } from "lucide-react";
import { About } from "./_components/about";
import EditProfilModal from "./_components/edit-profil-modal";
import UserInfo from "./_components/UserInfo";
import TabsUnderline, { TabItem } from "@/src/components/ui/tab2";

export function ProfileLayout() {
  // Définir les onglets avec leur contenu
  const tabs: TabItem[] = [
    {
      id: "posts",
      label: "Publications",
      icon: BookOpen,
      content: (
        <div className="mt-6">
          <p className="text-center text-muted-foreground">
            Aucune publication pour le moment
          </p>
        </div>
      ),
    },
    {
      id: "about",
      label: "À propos",
      icon: User2,
      content: (
        <div className="mt-6">
          <About />
        </div>
      ),
    },
    {
      id: "events",
      label: "Événements",
      icon: CalendarDays,
      badge: {
        content: "0",
        variant: "secondary",
      },
      content: (
        <div className="mt-6">
          <p className="text-center text-muted-foreground">
            Aucun événement pour le moment
          </p>
        </div>
      ),
    },
    {
      id: "groups",
      label: "Groupes",
      icon: Users,
      content: (
        <div className="mt-6">
          <p className="text-center text-muted-foreground">
            Aucun groupe pour le moment
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className=" mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <UserInfo />

        {/* Utiliser le composant TabsUnderline avec les nouvelles options */}
        <TabsUnderline
          tabs={tabs}
          defaultTab="posts"
          fullWidth={true}
          className="mt-8"
          showIconsOnlyOnMobile={true}
        />
      </div>
      <EditProfilModal />
    </div>
  );
}
