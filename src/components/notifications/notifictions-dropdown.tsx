"use client";

import { useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { notificationTypes } from "../utils/const/notifications-type";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { SmartAvatar } from "../shared/smart-avatar";
import { useNotification } from "../contexts/notification-context";
import { useToast } from "@/src/hooks/use-toast";

/**
 * Composant dropdown pour les notifications
 * Affiche les notifications récentes avec pagination et possibilité de les marquer comme lues
 */
export function NotificationsDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { openApprovalDialog, openContentDialog } = useNotification();

  // Tous les hooks doivent être appelés avant les retours conditionnels
  const markAllAsReadMutation = useMutation(api.notifications.markAllAsRead);
  const unreadCount = useQuery(api.notifications.getUnreadCount) || 0;
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.notifications.getHomeNotifications,
    {},
    { initialNumItems: 5 }
  );
  const maxResults = 40;
  const canLoadMore = status === "CanLoadMore" && results.length < maxResults;
  // Ne pas afficher si déjà sur la page des notifications
  if (pathname === "/notifications") {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount > 40 ? "40+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-120 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={async () => await markAllAsReadMutation({})}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="overflow-y-auto scrollbar-thin h-[250px] py-4 px-1">
          <div className="p-2">
            {results?.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-muted-foreground">
                Aucune notification
              </div>
            ) : (
              results?.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  openApprovalDialog={openApprovalDialog}
                  openContentDialog={openContentDialog}
                />
              ))
            )}

            {status === "LoadingMore" && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="p-2 border-t flex flex-col gap-2">
          {canLoadMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs rounded-sm"
              onClick={() => loadMore(10)}
              /*    disabled={status === "LoadingMore"} */
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
 * Composant pour les éléments de notification individuels dans le dropdown
 */
function NotificationItem({
  notification,
  openApprovalDialog,
  openContentDialog,
}: {
  notification: any;
  openApprovalDialog: (notification: any) => void;
  openContentDialog: (notification: any) => void;
}) {
  const {
    _id,
    sender,
    notificationType,
    title,
    content,
    createdAt,
    isRead,
    targetType,
  } = notification;

  const { icon, color } = notificationTypes[
    notificationType as keyof typeof notificationTypes
  ] || {
    icon: null,
    color: "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300",
  };

  // Formatage de l'heure
  const formattedTime = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div
      className={`p-2 rounded-lg mb-1 ${isRead ? "" : "bg-muted"} cursor-pointer hover:bg-muted/80`}
    >
      <div className="flex items-start gap-3">
        <SmartAvatar
          avatar={sender?.avatar || "/placeholder.svg"}
          name={sender?.name}
          className="h-8 w-8"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm truncate">
              {sender?.name || "Utilisateur"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {title}
            </span>
          </div>

          {content && (
            <p className="text-xs bg-background p-2 rounded-md border mt-1 line-clamp-2">
              {content}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-muted-foreground">{formattedTime}</div>
            {isRead && <CheckCheck className="size-3" />}
            {!isRead && (
              <div className="size-2 rounded-full bg-primary flex-shrink-0" />
            )}
          </div>
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
