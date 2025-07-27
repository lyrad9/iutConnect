"use client";

import React, { useRef } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PostAuthorType,
  PostCommentType,
  PostCard,
} from "@/src/components/shared/post/post-card";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Skeleton } from "@/src/components/ui/skeleton";
import { MessageSquare, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import { ScrollToTop } from "@/src/components/ui/scroll-to-top";

/**
 * État d'affichage lors du chargement
 */
function LoadingState() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
    </div>
  );
}

/**
 * Layout pour le fil d'actualité des groupes
 * Affiche tous les posts publiés dans les groupes avec pagination infinie
 */
export default function NewFeedGroupsLayout() {
  // Référence pour le conteneur
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Requête paginée pour tous les posts de groupes
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.posts.getAllGroupPosts,
    {},
    { initialNumItems: 10 }
  );

  // Utiliser le hook useInfiniteScroll pour la pagination infinie
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(5),
    rootMargin: "200px",
  });

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Titre de la section */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Fil d&apos;actualité des groupes
        </h2>
      </div>

      {/* Liste des posts */}
      {results && results.length > 0 ? (
        <>
          <div className="space-y-6">
            {results.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  author: post.data.author as PostAuthorType,
                  content: post.data.content,
                  medias: post.data.medias as string[],
                  createdAt: post.createdAt,
                  likes: post.data.likes.length,
                  isLiked: post.isLiked,
                  comments: post.data.comments as PostCommentType[],
                  commentsCount: post.data.commentsCount,
                  group: post.data.group,
                  isGroupPost: !!post.data.group,
                  isFavorite: post.isFavorite,
                }}
              />
            ))}
          </div>

          {/* Element de référence pour l'intersection observer */}
          <div ref={loaderRef} className="h-10" />

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState
          className="mx-auto w-full"
          title="Aucun post de groupe"
          description="Il n'y a pas encore de publications dans les groupes. Rejoignez des groupes pour voir leurs publications ici."
          icons={[MessageSquare]}
        />
      )}

      {/* Bouton de retour en haut de page */}
      <ScrollToTop />
    </div>
  );
}
