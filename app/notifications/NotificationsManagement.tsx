"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Toast } from "@/src/components/ui/toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NotificationsList } from "./NotificationsList";
import {
  Bell,
  BadgePlus,
  MessageSquare,
  Heart,
  Group,
  Calendar,
  UserPlus,
  Users,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Authenticated } from "convex/react";
import UnreadCountNotification from "./UnreadCountNotification";

/**
 * Notifications page
 * Displays user notifications with tabs for filtering by type
 */
export default function NotificationsManagement() {
  /*   const currentUser = useQuery(api.users.currentUser); */
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="sticky">
      <div className="w-full lg:h-20 sm:h-34 md:h-30 sticky top-14 z-60  bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30  py-4 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold">Notifications</div>
              <p className="text-sm">
                Reste informé sur les nouveautés de la plateforme
              </p>
            </div>
          </div>

          <UnreadCountNotification />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 h-auto p-1 bg-muted/50 rounded-none border-b w-full">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">All</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="like"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Likes</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="comment"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comments</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="group"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groups</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="event"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Events</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="request"
            className="data-[state=active]:bg-background py-2"
          >
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Requests</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="p-4 container mx-auto max-w-5xl">
          <TabsContent value="all" className="mt-0">
            <NotificationsList
              filter="all"

              /*   onRefresh={handleRefresh} */
            />
          </TabsContent>
          <TabsContent value="like" className="mt-0">
            <NotificationsList
              filter="like"

              /*   onRefresh={handleRefresh} */
            />
          </TabsContent>
          <TabsContent value="comment" className="mt-0">
            <NotificationsList filter="comment" />
          </TabsContent>
          <TabsContent value="group" className="mt-0">
            <NotificationsList filter="group" />
          </TabsContent>
          <TabsContent value="event" className="mt-0">
            <NotificationsList filter="event" />
          </TabsContent>
          <TabsContent value="request" className="mt-0">
            <NotificationsList filter="request" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
