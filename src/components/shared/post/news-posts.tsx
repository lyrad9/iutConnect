"use client";

import React, { useRef, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostCard } from "@/src/components/shared/post/post-card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/ui/empty-state";
import { StickyNote } from "lucide-react";

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

export function NewsPost() {
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.posts.getPosts,
    {},
    { initialNumItems: 10 }
  );

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;

    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(10);
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

  if (!results && isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {results && results.length > 0 ? (
        <>
          {results.map((item: any) => (
            <PostCard
              key={item.id}
              post={{
                id: item.id,
                author: item.data.author,
                content: item.data.content,
                medias: item.data.medias || [],
                createdAt: item.data.createdAt || item.createdAt,
                likes: item.data.likes?.length || 0,
                isGroupPost: !!item.data.groupId,
                group: item.data.group,
                commentsCount: item.data.commentsCount,
                comments: item.data.comments,
                isLiked: item.isLiked,
              }}
            />
          ))}
          <div ref={loaderRef} className="h-10" />
          {isLoading && <LoadingState />}
        </>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState
          title="Aucun post à afficher"
          description="Il n'y a pas de posts dans la plateforme"
          icons={[StickyNote]}
        />
      )}
    </div>
  );
}
