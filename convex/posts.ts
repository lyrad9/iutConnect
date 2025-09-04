import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { filter } from "convex-helpers/server/filter";
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
    if (
      user.role === "USER" &&
      !user.permissions.includes("CREATE_POST_IN_GROUP")
    ) {
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
        title: `Un nouveau post a été publié par ${user.firstName} ${user.lastName}`,
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
        title: "a aimé votre post",
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    /* const user = await ctx.db.get(userId as Id<"users">);
    if (!user) {
      throw new ConvexError("User not found");
    } */
    // utiliser filter de convex pour ne garder que les posts dpnt l'utilisateur est membre parmi les posts de groupes
    const postsQuery = filter(await ctx.db.query("posts"), async (post) => {
      if (post.groupId) {
        const membership = await ctx.db
          .query("groupMembers")
          .withIndex("by_user_and_group", (q) =>
            q
              .eq("userId", userId as Id<"users">)
              .eq("groupId", post.groupId as Id<"forums">)
              .eq("groupType", "forum")
              .eq("status", "accepted")
          )
          .unique();
        return !!membership;
      }
      return true;
    })
      .order("desc")
      .filter((q) =>
        q.or(
          // Pour les posts de groupes
          q.eq(q.field("status"), "approved"),
          // Pour les posts normaux
          q.eq(q.field("status"), undefined)
        )
      );

    const result = await postsQuery.paginate(args.paginationOpts);
    const enrichedPosts = await Promise.all(
      result.page.map(async (post) => {
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
                    name: `${commentAuthor.firstName} ${commentAuthor.lastName}`,
                    username: commentAuthor.username,
                    profilePicture: commentAuthor.profilePicture
                      ? ((await ctx.storage.getUrl(
                          commentAuthor.profilePicture as Id<"_storage">
                        )) as string)
                      : undefined,
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
              id: author?._id as Id<"users">,
              name: `${author?.firstName} ${author?.lastName}`,
              username: author?.username || null,
              profilePicture: author?.profilePicture
                ? ((await ctx.storage.getUrl(
                    author.profilePicture as Id<"_storage">
                  )) as string)
                : undefined,
              role: author?.role,
              isAdmin:
                author?.role === "ADMIN" || author?.role === "SUPERADMIN",
            },

            group: group
              ? {
                  id: group._id,
                  name: group.name,
                  profilePicture: group.profilePicture
                    ? ((await ctx.storage.getUrl(
                        group.profilePicture as Id<"_storage">
                      )) as string)
                    : undefined,
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
      ...result,
      page: enrichedPosts,
    };
  },
});

export const createGroupPost = mutation({
  args: {
    content: v.string(),
    attachmentIds: v.array(v.string()),
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const { content, attachmentIds, groupId } = args;
    const userId = await getAuthUserId(ctx);
    const group = await ctx.db.get(groupId);
    if (userId === null) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    // Vérifier que le groupe existe

    if (!group) {
      throw new ConvexError("Group not found");
    }

    // Vérifier que l'utilisateur est membre du groupe
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q.eq("userId", userId).eq("groupId", groupId).eq("groupType", "forum")
      )
      .unique();

    if (!membership) {
      throw new ConvexError(
        "You must be a member of this group to create posts"
      );
    }
    // Vérifier que l'utilisateur a la permission de créer des posts
    if (
      group.requiresPostApproval &&
      (!user.permissions.includes("CREATE_POST_IN_GROUP") ||
        !user.permissions.includes("ALL")) &&
      user.role === "USER"
    ) {
      return {
        error: "Vous n'êtes pas autorisé à créer un post dans ce groupe",
        code: "UNAUTHORIZED",
      };
    }

    // Insérer le post dans la base de données
    const postId = await ctx.db.insert("posts", {
      content,
      medias: attachmentIds,
      authorId: userId,
      groupId: groupId,
      createdAt: Date.now(),
      likes: [],
      comments: [],
    });
    // Appeler le scheduler pour notifier les membres du groupe de la création du post
    await ctx.scheduler.runAfter(
      5,
      internal.scheduledPosts.createScheduledGroupPost,
      { groupId, userId, postId }
    );
    return postId;
  },
});

export const getGroupPostsById = query({
  args: {
    groupId: v.id("forums"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authenticated");
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
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
        const group = await ctx.db.get(args.groupId);

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
                    name: `${commentAuthor.firstName} ${commentAuthor.lastName}`,
                    username: commentAuthor.username,
                    profilePicture: commentAuthor.profilePicture
                      ? ((await ctx.storage.getUrl(
                          commentAuthor.profilePicture as Id<"_storage">
                        )) as string)
                      : undefined,
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
              id: author?._id as Id<"users">,
              name: `${author?.firstName} ${author?.lastName}`,
              username: author?.username || null,
              profilePicture: author?.profilePicture
                ? ((await ctx.storage.getUrl(
                    author.profilePicture as Id<"_storage">
                  )) as string)
                : undefined,
              role: author?.role,
              isAdmin:
                author?.role === "ADMIN" || author?.role === "SUPERADMIN",
            },
            group: group
              ? {
                  id: group._id,
                  name: group.name,
                  profilePicture: group.profilePicture
                    ? ((await ctx.storage.getUrl(
                        group.profilePicture as Id<"_storage">
                      )) as string)
                    : undefined,
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

export const getAllGroupPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("User not authenticated");
    }

    // Récupérer tous les posts qui ont un groupId (posts de groupes)
    const postsQuery = ctx.db
      .query("posts")

      .order("desc")
      .filter(
        (q) =>
          q.or(
            // Pour les posts de groupes approuvés
            q.eq(q.field("status"), "approved"),
            // Pour les posts de groupes sans statut (par défaut approuvés)
            q.eq(q.field("status"), undefined)
          ) && q.neq(q.field("groupId"), undefined)
      );
    const filterPosts = filter(postsQuery, async (post) => {
      const membership = await ctx.db
        .query("groupMembers")
        .withIndex("by_user_and_group", (q) =>
          q
            .eq("userId", userId as Id<"users">)
            .eq("groupId", post.groupId as Id<"forums">)
            .eq("groupType", "forum")
            .eq("status", "accepted")
        )
        .unique();
      return !!membership;
    });

    const result = await filterPosts.paginate(args.paginationOpts);

    const enrichedPosts = await Promise.all(
      result.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        const group = await ctx.db.get(post.groupId as Id<"forums">);

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
              id: comment._id,
              ...comment,
              author: commentAuthor
                ? {
                    id: commentAuthor._id,
                    name: `${commentAuthor.firstName} ${commentAuthor.lastName}`,
                    username: commentAuthor.username,
                    profilePicture: commentAuthor.profilePicture
                      ? ((await ctx.storage.getUrl(
                          commentAuthor.profilePicture as Id<"_storage">
                        )) as string)
                      : undefined,
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
              id: author?._id as Id<"users">,
              name: `${author?.firstName} ${author?.lastName}`,
              username: author?.username || null,
              profilePicture: author?.profilePicture
                ? ((await ctx.storage.getUrl(
                    author.profilePicture as Id<"_storage">
                  )) as string)
                : undefined,
              role: author?.role,
              isAdmin:
                author?.role === "ADMIN" || author?.role === "SUPERADMIN",
            },
            group: group
              ? {
                  id: group._id,
                  name: group.name,
                  profilePicture: group.profilePicture
                    ? ((await ctx.storage.getUrl(
                        group.profilePicture as Id<"_storage">
                      )) as string)
                    : undefined,
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
      ...result,
      page: enrichedPosts,
    };
  },
});
