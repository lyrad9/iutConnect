import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { cn, getInitials } from "@/src/lib/utils";
import { PostCommentType } from "../post/post-card";
import { useState } from "react";

import { likeComment, unlikeComment } from "@/convex/comments";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "../../ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function Comment({ comment }: { comment: PostCommentType }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  // Mutation pour aimer un commentaire
  const likeCommentMutation = useMutation(api.comments.likeComment);
  // Mutation pour ne plus aimer un commentaire
  const unlikeCommentMutation = useMutation(api.comments.unlikeComment);
  const handleLikeComment = async (commentId: string) => {
    try {
      setIsLiked(!isLiked);
      /*  setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsComment(true); */
      if (isLiked) {
        await unlikeCommentMutation({
          commentId: commentId as Id<"comments">,
        });
        router.refresh();
      } else {
        await likeCommentMutation({ commentId: commentId as Id<"comments"> });
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur lors de l'aimation du commentaire:", error);
    }
  };
  return (
    <div key={comment.id} className="flex gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={comment?.author?.profilePicture || undefined}
          alt={comment?.author?.name}
        />
        <AvatarFallback className="bg-primary dark:bg-white text-white dark:text-primary font-bold">
          {getInitials(comment?.author?.name as string)}
        </AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="rounded-xl bg-muted p-3">
          {/* Affichage du nom d'utilisateur si disponible */}
          {comment?.author?.username && (
            <div className="text-xs text-muted-foreground">
              @{comment?.author?.username}
            </div>
          )}
          <div className="font-medium">{comment?.author?.name}</div>
          <p className="text-sm text-muted-foreground max-w-lg break-all">
            {comment.content}
          </p>
        </div>
        <div className="w-full mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <button
            className={cn(
              "hover:text-destructive",
              comment.isLiked ? "text-destructive" : "text-muted-foreground"
            )}
            onClick={() => handleLikeComment(comment.id)}
          >
            J&apos;aime
          </button>
          <button className="hover:text-foreground">Répondre</button>
          <span>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
          {comment.likes.length > 0 && (
            <div className="space-x-2 ml-auto flex justify-center">
              <span className="text-xs">{comment.likes.length}</span>
              <Heart className="size-4 fill-destructive text-destructive" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
