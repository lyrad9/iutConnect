import React from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  Search,
  User,
  Menu,
  Home,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ModeToggle } from "@/src/components/mode-toggle";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import SiteSheet from "./site-sheet";
import { NotificationsDropdown } from "../notifications/notifictions-dropdown";

import { AuthDropdown } from "../auth/auth-dropdown";
import AuthBtn from "../auth/auth-btn";
import MenuBtn from "../navigation/menu-btn";

import { SearchBar } from "../search/SearchBar";
import { Skeleton } from "../ui/skeleton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="px-4 flex h-16 items-center justify-between gap-2">
        {/* Partie gauche: Logo et menu mobile */}
        {/*   <div className="flex items-center gap-2"> */}

        <Link href="/" className="shrink-0 flex items-center space-x-2">
          <span className="font-bold text-lg">iutSocial</span>
        </Link>
        {/*   </div> */}

        {/* Partie centrale: Barre de recherche */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Partie droite: Actions et profil */}
        <div className="flex items-center gap-1">
          <MenuBtn />
          <div className="md:hidden block">
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center"
            >
              <Search className=" size-4" />
            </Button>
          </div>

          {/* Notifications (utilisateur authentifié) */}
          <Authenticated>
            <NotificationsDropdown />
            {/* <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/messages">
                <MessageSquare className="size-5" />
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  5
                </span>
                <span className="sr-only">Messages</span>
              </Link>
            </Button> */}
          </Authenticated>
          <AuthLoading>
            <Skeleton className="w-10 h-10 rounded-full" />
          </AuthLoading>
          {/* Switch thème */}
          <ModeToggle />
          {/* Profil utilisateur ou bouton de connexion */}
          <Authenticated>
            <AuthDropdown />
          </Authenticated>
          <Unauthenticated>
            <AuthBtn />
          </Unauthenticated>
          <AuthLoading>
            <Skeleton className="w-10 h-10 rounded-full" />
          </AuthLoading>
        </div>
      </div>
    </header>
  );
}
