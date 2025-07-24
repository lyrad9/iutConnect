"use client";

import { useRef } from "react";
import NotificationItem from "./NotificationItem";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { LoadingNotifications } from "./LoadingNotifications";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";

interface NotificationListProps {
  filter?: "all" | "like" | "comment" | "event" | "group" | "request";
}

export function NotificationsList({ filter = "all" }: NotificationListProps) {
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.notifications.getUserNotifications,
    {
      type: filter,
    },
    { initialNumItems: 10 }
  );

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "200px",
  });

  // Show loading state
  if (isLoading && !results) {
    return <LoadingNotifications />;
  }

  return (
    <div className="space-y-4">
      {/* Display each notification */}
      {results && results.length > 0 ? (
        <>
          {results.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}

          {/* Loading indicator for infinite scroll */}
          {status === "CanLoadMore" && (
            <div
              ref={loaderRef}
              className="py-4 flex justify-center items-center text-muted-foreground text-sm"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
              )}
              <span>
                {isLoading ? "Chargement..." : "Faire défiler pour voir plus"}
              </span>
            </div>
          )}
        </>
      ) : isLoading ? (
        <LoadingNotifications />
      ) : (
        <EmptyState
          className="max-w-full"
          title="Aucune notification"
          description="Aucune notification à afficher"
          icons={[BellOff]}
        />
      )}
    </div>
  );
}
