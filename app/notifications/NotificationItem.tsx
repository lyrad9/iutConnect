"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { notificationTypes } from "@/src/components/utils/const/notifications-type";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { SmartAvatar } from "@/src/components/shared/smart-avatar";
import { NotificationActions } from "./_components/NotificationActions";
import { useNotification } from "@/src/components/contexts/notification-context";

/**
 * Interface for notification data from Convex
 */
export type NotificationData = {
  // Augmented data
  sender?: {
    id: Id<"users">;
    name: string;
    avatar?: string;
    username: string;
  };
} & Doc<"notifications">;
export default function NotificationItem({
  notification,
}: {
  notification: NotificationData;
}) {
  const [, setTick] = useState(0);
  const { openApprovalDialog, openContentDialog } = useNotification();

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

  const { icon, color, borderColor } = notificationTypes[
    notificationType as keyof typeof notificationTypes
  ] || {
    icon: null,
    color: "bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300",
    borderColor: "border-gray-500 dark:border-gray-300",
  };

  // Format the time as "X minutes/hours/days ago"
  const formattedTime = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: fr,
  });

  // Update time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1); // Force re-render to update time
    }, 60_000); // Every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`p-4 rounded-lg ${
        isRead ? "bg-background" : "bg-muted/50"
      } transition-all hover:bg-muted cursor-pointer`}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <SmartAvatar
            avatar={sender?.avatar}
            name={sender?.name}
            className="size-10 relative"
          />
          <div
            className={`flex absolute -bottom-1 -right-2 border-[0.5px] items-center justify-center size-5 rounded-full ${color} ${borderColor} flex-shrink-0`}
          >
            {icon}
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${sender?.username || sender?.id}`}
              className="font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {sender?.name || "User"}
            </Link>
            <span className="text-muted-foreground line-clamp-3 max-w-lg break-all">
              {title}
            </span>
          </div>
          {content && (
            <p className="text-sm bg-background p-3 rounded-md border">
              {content}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{formattedTime}</p>

          {/* Action buttons for specific notification types */}
          {(notificationType === "request" ||
            (notificationType === "group" &&
              targetType === "contentApproval")) && (
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (notificationType === "request") {
                    openApprovalDialog(notification);
                  } else if (
                    notificationType === "group" &&
                    targetType === "contentApproval"
                  ) {
                    openContentDialog(notification);
                  }
                }}
              >
                Voir les détails
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 justify-items-center">
          <div className="col-span-1">
            <NotificationActions notificationId={_id} />
          </div>
          {!isRead && (
            <div className="col-span-1 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
