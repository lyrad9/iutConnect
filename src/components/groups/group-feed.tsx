import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Loader2, MessageSquare } from "lucide-react";
import { EmptyState } from "../ui/empty-state";
import { PostCard } from "../shared/post/post-card";
import { Id } from "@/convex/_generated/dataModel";

export default function GroupFeed({ groupId }: { groupId: Id<"forums"> }) {
  const {
    results: posts,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.posts.getGroupPostsById,
    { groupId },
    { initialNumItems: 10 }
  );
  if (status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <>
      {/* Liste des posts */}

      {posts.length === 0 ? (
        <EmptyState
          title="Aucune publication pour le moment"
          description="Soyez le premier à partager quelque chose avec votre groupe !"
          icons={[MessageSquare]}
          className="max-w-full"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={{
                id: post.id,
                author: {
                  id: post.data.author.id,
                  name: post.data.author.name,
                  username: post.data.author.username || undefined,
                  profilePicture: post.data.author.profilePicture,
                  isAdmin: post.data.author.isAdmin,
                },
                content: post.data.content,
                medias: post.data.medias,
                createdAt: post.createdAt,
                likes: post.data.likes.length,
                isLiked: post.isLiked,
                comments: post.data.comments.map((comment: any) => ({
                  id: comment._id,
                  content: comment.content,
                  createdAt: comment.createdAt,
                  author: comment.author!,
                  likes: comment.likes.length,
                  isLiked: comment.isLiked,
                })),
                commentsCount: post.data.commentsCount,
                group: post.data.group
                  ? {
                      id: post.data.group.id,
                      name: post.data.group.name,
                      profilePicture: post.data.group.profilePicture,
                      creator: post.data.group.creator,
                    }
                  : undefined,
                isGroupPost: !!post.data.groupId,
                isFavorite: post.isFavorite,
              }}
            />
          ))}
        </div>
      )}
      {status === "LoadingMore" && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {/* Bouton "Charger plus" */}
      {status === "CanLoadMore" && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => loadMore(3)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              "Charger plus de publications"
            )}
          </button>
        </div>
      )}

      {/* Indicateur de fin */}
      {status === "Exhausted" && posts.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Vous avez atteint la fin des publications
        </div>
      )}
    </>
  );
}
