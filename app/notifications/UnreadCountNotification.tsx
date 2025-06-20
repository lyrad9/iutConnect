import { Button } from "@/src/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UnreadCountNotification() {
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  // Mark all as read mutation
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  // Handle mark all as read button click
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button
      variant="outline"
      className="gap-2 shadow-sm hover:shadow"
      onClick={handleMarkAllAsRead}
      disabled={unreadCount === 0}
    >
      Mark all as read
      {unreadCount > 0 && (
        <span className="bg-primary text-white text-xs py-0.5 px-2 rounded-full">
          {unreadCount}
        </span>
      )}
    </Button>
  );
}
