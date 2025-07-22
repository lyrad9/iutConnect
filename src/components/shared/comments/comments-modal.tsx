"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PostCommentType } from "../post/post-card";
import { Comment } from "./comment";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { LoadingComment } from "./LoadingCommment";
import { SmartAvatar } from "../smart-avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | Id<"posts">;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}

export function CommentsModal({
  isOpen,
  onClose,
  postId,
  setCommentsCount,
}: CommentsModalProps) {
  const router = useRouter();
  const currentUser = useQuery(api.users.currentUser);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // État pour le texte du commentaire
  const [commentText, setCommentText] = useState("");

  // Récupérer les commentaires du post
  const { results, status, isLoading, loadMore } = usePaginatedQuery(
    api.comments.getCommentsByPostId,
    { postId: postId as Id<"posts"> },
    { initialNumItems: 15 }
  );

  // Mutation pour commenter un post
  const commentPost = useMutation(api.comments.createComment);

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
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      setCommentsCount((prev) => prev - 1);
      toast.error("Erreur lors de l'envoi du commentaire");
    }
  };
  const loadMoreRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(8),
  });

  // Ajuster la hauteur de la zone de commentaire automatiquement
  const adjustTextareaHeight = () => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = "auto";
      commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [commentText]);

  // Focus sur la zone de texte à l'ouverture de la modal
  useEffect(() => {
    if (isOpen && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[70vh]">
        <DialogHeader className="p-4 border-b sticky top-0 z-10 bg-background">
          <DialogTitle>Commentaires</DialogTitle>
        </DialogHeader>

        {/* Conteneur de commentaires avec défilement */}
        <ScrollArea className=" h-[200px] flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {results && results.length > 0 ? (
              <>
                {results.map((comment) => (
                  <Comment
                    key={comment?.id}
                    comment={comment as PostCommentType}
                  />
                ))}
                <div
                  ref={loadMoreRef}
                  className="h-10 flex justify-center items-center mt-6"
                >
                  {status === "LoadingMore" && <LoadingComment />}
                </div>
              </>
            ) : isLoading ? (
              <LoadingComment />
            ) : (
              <p className="text-center text-sm text-muted-foreground p-4">
                Aucun commentaire. Soyez le premier à commenter !
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Zone de saisie de commentaire */}
        <div className="p-4 border-t mt-auto sticky bottom-0 bg-background">
          <div className="flex gap-3">
            <SmartAvatar
              avatar={currentUser?.profilePicture as string | undefined}
              name={`${currentUser?.firstName} ${currentUser?.lastName}`}
              size="sm"
            />
            <div className="flex-1 flex gap-2">
              <textarea
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitComment();
                  }
                }}
                placeholder="Écrire un commentaire..."
                className="flex-shrink-1 min-h-[40px] max-h-[200px] resize-none flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                rows={1}
              />
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0 self-end h-10 w-10"
                onClick={submitComment}
                disabled={!commentText.trim()}
              >
                <Send className="size-5" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
