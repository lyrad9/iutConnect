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

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const isGroupsPage = pathname.startsWith("/groups");

  if (isGroupsPage) {
    return <GroupesContentSidebar className={className} />;
  }
  if (pathname === "/profile") {
    return;
  }
  return (
    <aside
      className={cn(
        "flex-col w-64 border-r pt-6 pb-12 items-stretch overflow-y-auto",
        className
      )}
    >
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
          if (item.hasMessages)
            return (
              <MessageLink
                key={item.href}
                pathname={pathname}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            );
          return (
            <Link
              key={item.href}
              href={item.href}
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
      <SidebarNavigationContent />
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
