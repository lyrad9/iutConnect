
import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { api } from "./_generated/api";
export const createPostInHome = mutation({
  args: {
    content: v.string(),
    attachmentIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { content, attachmentIds } = args;
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("User not authentificatede");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    if (user.role === "USER" && !user.permissions.includes("CREATE_POST")) {
      return {
        error: "Vous n'êtes pas autorisé à créer un post",
        code: "UNAUTHORIZED",
      };
    }
    // Insérer le post dans la base de données
    const postId = await ctx.db.insert("posts", {
      content,
      medias: attachmentIds,
      authorId: userId,
      createdAt: Date.now(),
      likes: [],
      comments: [],
    });
    // Envoyer une notification à tous les utilsateurs sauf à lui meme
    const users = await ctx.db.query("users").collect();
    const usersToNotify = users.filter((user) => user._id !== userId);
    for (const notifiedUser of usersToNotify) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: notifiedUser._id,
        title: Un nouveau post a été publié par ${user.firstName} ${user.lastName},
        isRead: false,
        notificationType: "post",
        postId: postId,
        targetType: "post",
        createdAt: Date.now(),
      });
    }

    return postId;
  },
});

// Liker un post
export const likePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    await ctx.db.patch(postId, { likes: [...post.likes, userId] });

    // ENvoyer une notification au proprietaire du post
    const postAuthor = await ctx.db.get(post.authorId);
    if (postAuthor && postAuthor._id !== user._id) {
      await ctx.db.insert("notifications", {
        senderId: userId,
        recipientId: postAuthor._id,
        title: a aimé votre post,
        isRead: false,
        notificationType: "like",
        postId: postId,
        targetType: "post",
        createdAt: Date.now(),
      });
    }
  },
});

// Unliker un post
export const unlikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { postId } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    await ctx.db.patch(postId, {
      likes: post.likes.filter((id) => id !== userId),
    });

    // Supprimer la notification si elle existe
    const existingLikeNotification = await ctx.db
      .query("notifications")
      .withIndex("by_type_post_sender", (q) =>
        q
          .eq("notificationType", "like")
          .eq("postId", postId)
          .eq("senderId", userId)
      )
      .unique();
    if (existingLikeNotification) {
      await ctx.db.delete(existingLikeNotification._id);
    }
  },
});

export const getPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    /* const user = await ctx.db.get(userId as Id<"users">);
    if (!user) {
      throw new ConvexError("User not found");
    } */
    const posts = await ctx.db
      .query("posts")
      /*   .withIndex("by_creation_date") */
      .order("desc")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "approved"),
          q.eq(q.field("status"), undefined)
        )
      )
      .paginate(args.paginationOpts);

    const enrichedPosts = await Promise.all(
      posts.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        let group = undefined;
        if (post.groupId) {
          group = await ctx.db.get(post.groupId);
        }
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_target", (q) => q.eq("targetType", "post"))
          .filter((q) => q.eq(q.field("targetId"), post._id))
          .order("desc")
          .collect();
        const commentsWithAuthor = await Promise.all(
          comments.map(async (comment) => {
            const commentAuthor = await ctx.db.get(comment.authorId);
            return {
              ...comment,
              author: commentAuthor
                ? {
                    id: commentAuthor._id,
                    name: ${commentAuthor.firstName} ${commentAuthor.lastName},
                    username: commentAuthor.username,
                    profilePicture: commentAuthor.profilePicture,
                    role: commentAuthor.role,
                    isAdmin:
                      commentAuthor.role === "ADMIN" ||
                      commentAuthor.role === "SUPERADMIN",
                  }
                : undefined,
              isLiked: comment.likes.includes(userId as Id<"users">),
            };
          })
        );
        // Get files stored in convex with serving files
        const medias = await Promise.all(
          post.medias.map((media) =>
            ctx.storage.getUrl(media as Id<"_storage">)
          )
        );
        // Check if post is favourite
        const isFavorite = await ctx.db
          .query("favorites")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", userId as Id<"users">).eq("postId", post._id)
          )
          .unique();

        return {
          id: post._id,
          type: "post" as const,
          data: {
            ...post,
            medias: medias,
            author: {
              id: author?._id,
              name: ${author?.firstName} ${author?.lastName},
              username: author?.username || null,
              profilePicture: author?.profilePicture,
              role: author?.role,
              isAdmin:
                author?.role === "ADMIN" || author?.role === "SUPERADMIN",
            },

            group: group
              ? {
                  id: group._id,
                  name: group.name,
                  profilePicture: group.profilePicture,
                  creator: group.authorId,
                }
              : undefined,
            comments: commentsWithAuthor,
            commentsCount: post.comments.length,
          },
          createdAt: post.createdAt,
          isLiked: post.likes.includes(userId as Id<"users">),
          isFavorite: !!isFavorite,
        };
      })
    );

    return {
      ...posts,
      page: enrichedPosts,
    };
  },
});