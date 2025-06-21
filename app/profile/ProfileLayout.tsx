"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  MailIcon,
  LinkIcon,
  PenSquare,
  User2,
  BookOpen,
  Users,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { ProfileFriends } from "@/app/profile/_components/profile-friends";
import { ProfilePhotos } from "@/app/profile/_components/profile-photos";
import { About } from "./_components/about";
import { EditProfileBtn } from "./_components/edit-profile-btn";
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
    <div className="container px-4 py-6 md:py-8">
      <div className="space-y-6">
        <UserInfo />

        {/* Utiliser le composant TabsUnderline */}
        <TabsUnderline
          tabs={tabs}
          defaultTab="posts"
          showIconsOnlyOnMobile={true}
        />
      </div>
      <EditProfilModal />
    </div>
  );
}
