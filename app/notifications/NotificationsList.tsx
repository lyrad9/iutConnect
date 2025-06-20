"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import NotificationItem, { NotificationData } from "./NotificationItem";
import { notificationTypes } from "@/src/components/utils/const/notifications-type";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { LoadingNotifications } from "./LoadingNotifications";
import { EmptyState } from "@/src/components/ui/empty-state";

// Mock notifications data for demo purposes
// In a real implementation, this would come from the Convex API

interface NotificationListProps {
  filter?: "all" | "like" | "comment" | "event" | "group" | "request";

  /*   onRefresh?: () => void; */
}

/**
 * Component to display a list of notifications with infinite scroll
 * Can be filtered by type and has real-time updates
 * Currently using mock data - will be replaced with Convex API
 */
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

  // Show empty state if no notifications
  /*   if (results.length === 0) {
    return (
      <div className="text-center py-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">No notifications to display</p>
      </div>
    );
  }
 */
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
