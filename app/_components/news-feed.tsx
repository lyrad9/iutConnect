"use client";

import React, { useCallback, useEffect, useState } from "react";
import { PostCard } from "@/src/components/shared/post-card";
import { EventCard } from "@/src/components/shared/event/event-card";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// État de chargement des posts
function LoadingState() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border shadow p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
    </div>
  );
}

// État vide
function EmptyState() {
  return (
    <div className="border rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium mb-2">Aucun contenu à afficher</h3>
      <p className="text-muted-foreground">
        Il n&apos;y a pas encore de publications ou d&apos;événements à afficher
        dans votre flux.
      </p>
    </div>
  );
}

export function NewsFeed() {
  const { ref: bottomRef, inView } = useInView();
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [feedItems, setFeedItems] = useState<Array<any>>([]);

  // Récupérer les données du flux social avec pagination
  const feedResults = useQuery(
    api.feed.getFeedItems,
    cursor
      ? {
          paginationOpts: {
            numItems: 10,
            cursor,
          },
        }
      : {
          paginationOpts: {
            numItems: 10,
            cursor: null,
          },
        }
  );

  // Gérer les résultats de la requête
  useEffect(() => {
    if (feedResults) {
      // Ajouter les nouveaux éléments au flux
      setFeedItems((prev) => {
        // Filtrer pour éviter les doublons
        const newItems = feedResults.page.filter(
          (item) => !prev.some((p) => p.id === item.id)
        );
        return [...prev, ...newItems];
      });

      // Mettre à jour le curseur et l'état "hasMore"
      setCursor(feedResults.continueCursor);
      setHasMore(!feedResults.isDone);
    }
  }, [feedResults]);

  // Charger plus d'éléments lorsque l'utilisateur atteint le bas
  useEffect(() => {
    if (inView && hasMore && feedItems.length > 0) {
      // Le curseur est déjà mis à jour, donc la prochaine requête utilisera le nouveau curseur
    }
  }, [inView, hasMore, feedItems.length]);

  // Rendu des cartes en fonction du type
  const renderSocialItem = (item: any) => {
    if (item.type === "post") {
      return (
        <PostCard
          key={item.id}
          post={{
            id: item.id,
            author: item.data.author,
            content: item.data.content,
            medias: item.data.media || [],
            createdAt: item.data.createdAt || item.createdAt,
            likes: item.data.likes?.length || 0,
            isGroupPost: !!item.data.groupId,
            group: item.data.group,
            commentsCount: item.data.commentsCount || 0,
            comments: item.data.comments,
          }}
        />
      );
    } else if (item.type === "event") {
      return (
        <EventCard
          key={item.id}
          event={{
            id: item.id,
            author: item.data.author,
            name: item.data.name,
            description: item.data.description,
            photo: item.data.photo || "/placeholder.svg",
            startDate: item.data.startDate,
            endDate: item.data.endDate,
            location: {
              type: item.data.locationType,
              value: item.data.locationDetails,
            },
            eventType: item.data.eventType,
            participantsCount: item.data.participantsCount || 0,
            allowsParticipants: item.data.allowsParticipants !== false,
            group: item.data.group,
          }}
        />
      );
    }

    return null;
  };

  // Afficher l'état de chargement si aucune donnée n'est disponible
  if (!feedResults) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {feedItems.length > 0 ? (
        <>
          {feedItems.map(renderSocialItem)}
          <div ref={bottomRef} className="h-10">
            {hasMore && <LoadingState />}
          </div>
        </>
      ) : !feedResults ? (
        <LoadingState />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
