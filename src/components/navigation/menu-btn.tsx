"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/src/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/src/components/ui/navigation-menu";
import { Users, Calendar, BookmarkPlus, Menu, Bookmark } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MenuBtn() {
  // Ne pas afficher le menusi on est sur la partie admin
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");
  if (isAdminPage) {
    return null;
  }

  return (
    <div className="block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-2 flex items-center gap-1">
              {/*  <Menu className="size-4" /> */}
              Menu
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4">
                <li>
                  <Link
                    href="/groups"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="size-4 text-primary" />
                      <span className="text-sm font-medium">Groupes</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Rejoignez et interagissez avec des groupes thématiques
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="size-4 text-primary" />
                      <span className="text-sm font-medium">Événements</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Découvrez les événements à venir et participez-y
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bookmarks"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className="size-4 text-primary" />
                      <span className="text-sm font-medium">Favoris</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Accédez à vos publications sauvegardées
                    </p>
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
