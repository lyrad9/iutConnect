import React, { useEffect, useRef, useState } from "react";
import { Send, BadgeCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PostCommentType, PostType } from "../post/post-card";
import { LoadingComment } from "./LoadingCommment";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Comment } from "./comment";
import { SmartAvatar } from "../smart-avatar";
import { useRouter } from "next/navigation";
export function CommentsList({
  postId,
  showComments,
  setCommentsCount,
}: {
  postId: string;
  showComments: boolean;
  setCommentsCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();
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
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      setCommentsCount((prev) => prev - 1);
      setCommentText(commentText); // Restaurer le texte
    }
  };
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
    return <LoadingComment />;
  }

  return (
    <>
      {showComments && (
        <div key={postId} className="border-t p-4">
          {/* Formulaire de commentaire */}
          <div className="mb-4 flex gap-2">
            <SmartAvatar
              avatar={currentUser?.profilePicture as string | undefined}
              name={`${currentUser?.firstName} ${currentUser?.lastName}`}
              size="sm"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-col items-start gap-1">
                {currentUser?.username && (
                  <p className="text-xs font-medium text-muted-foreground">
                    @{currentUser?.username}
                  </p>
                )}
                <p className="text-sm">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  className="min-h-[30px] resize-none flex-1"
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
              {results.length > 2 ? (
                <ScrollArea className="space-y-4 h-[300px] py-5 pr-5">
                  <div className="space-y-4">
                    {results.map((comment) => (
                      <Comment
                        key={comment?.id}
                        comment={comment as PostCommentType}
                      />
                    ))}
                  </div>

                  {/*   <div ref={loaderRef} className="h-10" /> */}
                  {isLoading && <LoadingComment />}
                </ScrollArea>
              ) : (
                <div className="space-y-4 pt-5 pr-5">
                  <div className="space-y-4">
                    {results.map((comment) => (
                      <Comment
                        key={comment?.id}
                        comment={comment as PostCommentType}
                      />
                    ))}
                  </div>

                  {/*    <div ref={loaderRef} className="h-10" /> */}
                  {isLoading && <LoadingComment />}
                </div>
              )}
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
