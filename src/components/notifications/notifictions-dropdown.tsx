"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Bell, Calendar, Heart, MessageCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { notificationTypes } from "../utils/const/notifications-type";
/**
 * Données d'exemple pour les notifications
 */
const notificationsData = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    content: "a aimé votre publication",
    time: "il y a 2 minutes",
    read: false,
  },

  {
    id: 2,
    type: "comment",
    user: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg",
    },
    content: "a commenté votre publication",
    message: "Super projet de recherche !",
    time: "il y a 1 heure",
    read: false,
  },
  {
    id: 3,
    type: "new_event",
    user: {
      name: "Club d'Informatique",
      avatar: "/placeholder.svg",
    },
    content: "a publié un nouvel événement",
    message: "Hackathon ce weekend !",
    time: "il y a 3 heures",
    read: true,
  },
  {
    id: 4,
    type: "group_join_request",
    user: {
      name: "Emily Chen",
      avatar: "/placeholder.svg",
    },
    content: "vous a envoyé une demande de connexion",
    time: "il y a 1 jour",
    read: true,
  },
  {
    id: 5,
    type: "comment",
    user: {
      name: "James Wilson",
      avatar: "/placeholder.svg",
    },
    content: "vous a mentionné dans un commentaire",
    message: "@sconnor as-tu les notes du cours d'hier ?",
    time: "il y a 2 jours",
    read: true,
  },
  {
    id: 6,
    type: "like",
    user: {
      name: "David Garcia",
      avatar: "/placeholder.svg",
    },
    content: "a aimé votre commentaire",
    time: "il y a 3 jours",
    read: true,
  },
  {
    id: 7,
    type: "new_event",
    user: {
      name: "Association des Étudiants",
      avatar: "/placeholder.svg",
    },
    content: "vous a invité à un événement",
    message: "Festival de Printemps sur le campus !",
    time: "il y a 4 jours",
    read: true,
  },
  {
    id: 8,
    type: "group_join_request",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    content: "a demandé à rejoindre votre groupe Les champions de la ligue",
    time: "il y a 2 minutes",
    read: false,
  },
  {
    id: 9,
    type: "new_post",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
    },
    content: "a publié un nouveau post",
    time: "il y a 10 minutes",
    read: false,
  },
];

/**
 * Composant de dropdown pour les notifications
 * Affiche les notifications récentes avec possibilité de charger plus
 */
export function NotificationsDropdown() {
  const pathname = usePathname();
  const [visibleNotifications, setVisibleNotifications] = useState(5);
  const [open, setOpen] = useState(false);

  // Ne pas afficher le dropdown si l'utilisateur est sur la page des notifications
  if (pathname === "/notifications") {
    return null;
  }

  // Nombre de notifications non lues
  const unreadCount = notificationsData.filter(
    (notification) => !notification.read
  ).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7">
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="overflow-y-auto scrollbar-thin h-[200px] py-4 px-1">
          <div className="p-2">
            {notificationsData
              .slice(0, visibleNotifications)
              .map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </div>
        </div>

        <div className="p-2 border-t flex flex-col gap-2">
          {visibleNotifications < notificationsData.length && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs rounded-sm"
              onClick={() => setVisibleNotifications((prev) => prev + 5)}
            >
              Charger plus
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/notifications" onClick={() => setOpen(false)}>
              Voir toutes les notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Composant pour un élément de notification individuel
 */
function NotificationItem({
  notification,
}: {
  notification: (typeof notificationsData)[0];
}) {
  const { type, user, content, message, time, read } = notification;
  const { icon, color } =
    notificationTypes[type as keyof typeof notificationTypes];

  return (
    <div className={`p-2 rounded-lg mb-1 ${read ? "" : "bg-muted"}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
          />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground">{content}</span>
          </div>

          {message && (
            <p className="text-xs text-end bg-background p-2 rounded-md border mt-1 line-clamp-2">
              {message}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        </div>

        <div
          className={`flex items-center justify-center h-6 w-6 rounded-full ${color} flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
