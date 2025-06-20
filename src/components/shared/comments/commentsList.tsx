import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  MoreHorizontal,
  MessageSquare,
  Heart,
  Share,
  BookmarkPlus,
  Send,
  BadgeCheck,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

import { cn, getInitials } from "@/src/lib/utils";
import { Textarea } from "@/src/components/ui/textarea";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { likePost, unlikePost } from "@/convex/posts";
import { Id } from "@/convex/_generated/dataModel";
import { PostCommentType, PostType } from "../post/post-card";
import { LoadingComment } from "./LoadingCommment";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Comment } from "./comment";
export function CommentsList({
  postId,
  showComments,
  setCommentsCount,
}: {
  postId: string;
  showComments: boolean;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const currentUser = useQuery(api.users.currentUser);
  console.log("currentUser", currentUser);
  // État pour le texte du commentaire
  const [commentText, setCommentText] = useState("");
  // Recuperr les commentaires du post
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.comments.getCommentsByPostId,
    { postId: postId as Id<"posts"> },
    { initialNumItems: 5 }
  );

  // Mutation pour commenter un post
  const commentPost = useMutation(api.comments.createComment);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Soumettre un commentaire
  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentsCount((prev: number) => prev + 1);
      // Appeler l'API pour persister le commentaire
      if (commentPost) {
        await commentPost({
          targetId: postId as Id<"posts">,
          targetType: "post",
          content: commentText,
        });
        setCommentText("");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      setCommentsCount((prev) => prev - 1);
      setCommentText(commentText); // Restaurer le texte
    }
  };
  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(10);
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [status, isLoading, loadMore]);

  if (!results && isLoading) {
    return <LoadingComment />;
  }

  return (
    <>
      {showComments && (
        <div key={postId} className="border-t p-4">
          {/* Formulaire de commentaire */}
          <div className="mb-4 flex gap-2">
            <Avatar className="size-8">
              {/* Remplacer par l'avatar de l'utilisateur connecté */}
              <AvatarImage
                src={currentUser?.profilePicture}
                alt="Utilisateur connecté"
              />
              <AvatarFallback className="bg-primary dark:bg-white text-white dark:text-primary font-bold">
                {/* Remplacer par les initiales de l'utilisateur connecté */}
                {getInitials(
                  `${currentUser?.firstName} ${currentUser?.lastName}`
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-start gap-1">
                <p className="text-xs font-medium text-muted-foreground">
                  @{currentUser?.username}
                </p>
                <p className="text-sm">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="min-h-[60px] resize-none flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="self-end h-8 w-8"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="size-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Liste des commentaires */}
          {results && results.length > 0 ? (
            <>
              <ScrollArea className="space-y-4 h-[300px] py-5 pr-5">
                <div className="space-y-4">
                  {results.map((comment) => (
                    <Comment
                      key={comment?.id}
                      comment={comment as PostCommentType}
                    />
                  ))}
                </div>

                <div ref={loaderRef} className="h-10" />
                {isLoading && <LoadingComment />}
              </ScrollArea>
            </>
          ) : isLoading ? (
            <LoadingComment />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Aucun commentaire. Soyez le premier à commenter !
            </p>
          )}
        </div>
      )}
    </>
  );
}
