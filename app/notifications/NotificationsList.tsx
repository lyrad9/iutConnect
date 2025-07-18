"use client";

import { useEffect, useRef } from "react";
import NotificationItem from "./NotificationItem";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { LoadingNotifications } from "./LoadingNotifications";
import { EmptyState } from "@/src/components/ui/empty-state";

interface NotificationListProps {
  filter?: "all" | "like" | "comment" | "event" | "group" | "request";
}

export function NotificationsList({
  filter = "all",

  /* onRefresh, */
}: NotificationListProps) {
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.notifications.getUserNotifications,
    {
      type: filter,
    },
    { initialNumItems: 10 }
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;
    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);
  // Handle notification action (e.g., accepting a group request)

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
              /*  onAction={handleAction} */
            />
          ))}
          {/*    <div ref={loaderRef} className="h-10" />
                {isLoading && <LoadingNotifications />} */}
          {/* Loading indicator for infinite scroll */}
          {status === "CanLoadMore" && (
            <div
              ref={loaderRef}
              className="py-4 flex justify-center items-center text-muted-foreground text-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
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
