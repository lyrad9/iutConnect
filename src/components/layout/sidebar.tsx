import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { NavigationItems } from "@/src/components/navigation/site/navigation-config";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import GroupesContentSidebar from "./groups-content-sidebar";
import SidebarNavigationContent from "../navigation/site/sidebar-navigation-content";
import EventsContentSidebar from "./events-content-sidebar";
import { SmartAvatar } from "../shared/smart-avatar";
import { CalendarCheck, Compass, Home, Layers } from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.currentUser);

  // Exclure le chemin /groups/create
  const isValidGroupsPage =
    pathname.startsWith("/groups") && pathname !== "/groups/create";
  const isValidEventsPage =
    pathname.startsWith("/events") && pathname !== "/events/create";

  if (isValidGroupsPage) {
    return <GroupesContentSidebar className={className} />;
  }
  if (isValidEventsPage) {
    return <EventsContentSidebar className={className} />;
  }
  if (pathname === "/profile" || pathname === "/groups/create") {
    return;
  }

  // Raccourcis pour l'utilisateur
  const shortcuts = [
    {
      label: "Fil d'actualité groupes",
      href: "/groups",
      icon: <Layers className="h-4 w-4 mr-2" />,
    },
    {
      label: "Découvrir des groupes",
      href: "/groups/discover",
      icon: <Compass className="h-4 w-4 mr-2" />,
    },
    {
      label: "Événements à venir",
      href: "/events/upcoming",
      icon: <CalendarCheck className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <aside
      className={cn(
        "flex-col w-64 border-r pt-6 pb-12 items-stretch overflow-y-auto",
        className
      )}
    >
      {/* Profil utilisateur */}
      {currentUser && (
        <div className="px-4 mb-6">
          <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30 border border-border/50">
            <SmartAvatar
              avatar={currentUser?.profilePicture || undefined}
              name={`${currentUser?.firstName} ${currentUser?.lastName}`}
              size="lg"
              className="mb-3"
            />
            <h3 className="font-medium text-base">
              {currentUser?.firstName} {currentUser?.lastName}
            </h3>
            {currentUser?.username && (
              <p className="text-sm text-muted-foreground">
                @{currentUser.username}
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="w-full mt-3">
              <Link href="/profile">Voir mon profil</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation principale */}
      <div className="flex flex-col gap-2 px-2">
        {NavigationItems.map((item) => {
          if (item.hasNotifications)
            return (
              <NotificationLink
                key={item.href}
                pathname={pathname}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            );
          /*    if (item.hasMessages)
            return (
              <MessageLink
                key={item.href}
                pathname={pathname}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ); */
          return (
            <Link
              key={item.href}
              href={item.href as string}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Contenu de la navigation latérale */}
      <SidebarNavigationContent />

      {/* Mes raccourcis */}
      <div className="mt-6 px-4">
        <h3 className="px-2 mb-2 text-xs font-medium uppercase text-muted-foreground">
          Mes raccourcis
        </h3>
        <div className="flex flex-col gap-1">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="flex items-center text-sm py-1.5 px-2 rounded-md hover:bg-muted"
            >
              {shortcut.icon}
              <span>{shortcut.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
{
  /* <span>{item.label}</span>
{item.notifications && (
  <Badge variant="secondary" className="ml-auto">
    {item.notifications}
  </Badge>
)} */
}
export function NotificationLink({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
}) {
  const unreadCount = useQuery(api.notifications.getUnreadCount) || 0;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        pathname === href
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
      {unreadCount > 0 && (
        <Badge variant="secondary" className="ml-auto">
          {unreadCount > 40 ? "40+" : unreadCount}
        </Badge>
      )}
    </Link>
  );
}

export function MessageLink({
  href,
  icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        pathname === href
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
