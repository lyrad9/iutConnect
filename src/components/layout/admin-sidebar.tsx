"use client";

import type * as React from "react";
import {
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Shield,
  Bell,
  Settings,
  Home,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/src/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admins",
      icon: BarChart3,
    },
    {
      title: "Gestion des utilisateurs",
      url: "/admins/users",
      icon: Users,
    },
    {
      title: "Gestion des groupes",
      url: "/admins/groups",
      icon: MessageSquare,
    },
    {
      title: "Gestion des événements",
      url: "/admins/events",
      icon: Calendar,
    },
    {
      title: "Gestion des admins",
      url: "/admins/admins",
      icon: Shield,
    },
    {
      title: "Notifications",
      url: "/admins/notifications",
      icon: Bell,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Settings className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Administration</span>
                  <span className="truncate text-xs">
                    Réseau Social Universitaire
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home />
                <span>Retour au site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
