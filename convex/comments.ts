import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// Liker un commentaire
export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }
    await ctx.db.patch(commentId, { likes: [...comment.likes, userId] });
    // Envoi une notification au propriétaire du commentaire
    const commentAuthor = await ctx.db.get(comment.authorId);
    if (commentAuthor && commentAuthor._id !== user._id) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: commentAuthor._id,
        title: `a aimé votre commentaire: ${comment.content}`,
        isRead: false,
        notificationType: "like",
        commentId: commentId,
        targetType: "comment",
        createdAt: Date.now(),
      });
    }
  },
});

// Unliker un commentaire
export const unlikeComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const { commentId } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new ConvexError("Comment not found");
    }
    await ctx.db.patch(commentId, {
      likes: comment.likes.filter((id) => id !== userId),
    });
    // Supprimer la notification si elle existe
    const existingLikeNotification = await ctx.db
      .query("notifications")
      .withIndex("by_type_comment_sender", (q) =>
        q
          .eq("notificationType", "like")
          .eq("commentId", commentId)
          .eq("senderId", userId)
      )
      .unique();
    if (existingLikeNotification) {
      await ctx.db.delete(existingLikeNotification._id);
    }
  },
});

// Créer un commentaire(sur un post ou évènement)
export const createComment = mutation({
  args: {
    content: v.string(),
    targetId: v.union(v.id("posts"), v.id("events"), v.id("comments")),
    targetType: v.union(
      v.literal("post"),
      v.literal("event"),
      v.literal("comment")
    ),
  },
  handler: async (ctx, args) => {
    const { content, targetId, targetType } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    // Créer le commentaire
    const newComment = await ctx.db.insert("comments", {
      content,
      targetId,
      targetType,
      authorId: userId,
      createdAt: Date.now(),
      likes: [],
    });
    const postAuthor = await ctx.db.get(targetId as Id<"posts">);
    const eventAuthor = await ctx.db.get(targetId as Id<"events">);

    const commentAuthor = await ctx.db.get(targetId as Id<"comments">);
    // Mettre à jour le tableau de commentaires du post ou évènement
    if (targetType === "post" && postAuthor) {
      await ctx.db.patch(targetId as Id<"posts">, {
        comments: [...(postAuthor.comments || []), newComment],
      });
    }
    if (targetType === "event" && eventAuthor) {
      await ctx.db.patch(targetId as Id<"events">, {
        comments: [...(eventAuthor.comments || []), newComment],
      });
    }
    // Envoi une notification au propriétaire du post ou évènement ou auteur du commentaire
    if (
      targetType === "post" &&
      postAuthor &&
      postAuthor.authorId !== user._id
    ) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: postAuthor.authorId,
        title: `a commenté votre post: ${postAuthor.content}`,
        content: content,
        isRead: false,
        notificationType: "comment",
        postId: targetId as Id<"posts">,
        targetType: "post",
        createdAt: Date.now(),
      });
    } else if (
      targetType === "event" &&
      eventAuthor &&
      eventAuthor.authorId !== user._id
    ) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: eventAuthor.authorId,
        title: `a commenté votre évènement: ${eventAuthor.name}`,
        content: content,
        isRead: false,
        notificationType: "comment",
        eventId: targetId as Id<"events">,
        targetType: "event",
        createdAt: Date.now(),
      });
    } else if (
      targetType === "comment" &&
      commentAuthor &&
      commentAuthor.authorId !== user._id
    ) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: commentAuthor.authorId,
        title: `a commenté votre commentaire: ${commentAuthor.content}`,
        content: content,
        isRead: false,
        notificationType: "comment",
        commentId: targetId as Id<"comments">,
        targetType: "comment",
        createdAt: Date.now(),
      });
    }
  },
});

export const getCommentsByPostId = query({
  args: {
    paginationOpts: paginationOptsValidator,
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { postId, paginationOpts } = args;
    const userId = await getAuthUserId(ctx);

    /*   const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    } */
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_target", (q) => q.eq("targetType", "post"))
      .filter((q) => q.eq(q.field("targetId"), postId))
      .order("desc")
      .paginate(paginationOpts);
    const enrichedComments = await Promise.all(
      comments.page.map(async (comment) => {
        const commentAuthor = await ctx.db.get(comment.authorId);
        if (commentAuthor) {
          return {
            ...comment,
            id: comment._id as Id<"comments">,
            isLiked: comment.likes.includes(userId as Id<"users">),
            author: {
              id: commentAuthor?._id,
              name: `${commentAuthor?.firstName} ${commentAuthor?.lastName}`,
              username: commentAuthor?.username,
              profilePicture: commentAuthor?.profilePicture,
              role: commentAuthor?.role,
              isAdmin:
                commentAuthor?.role === "ADMIN" ||
                commentAuthor?.role === "SUPERADMIN",
            },
          };
        }
      })
    );
    return {
      ...comments,
      page: enrichedComments,
    };
  },
});
