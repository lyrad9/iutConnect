import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
/**
 * Ajouter un post aux favoris
 */
export const addToFavorites = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not authentificated");
    }
    const userId = user._id;

    // Vérifier si le post existe
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Vérifier si ce post est déjà dans les favoris
    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    if (existingFavorite) {
      throw new Error("Cette publication est déjà dans vos favoris");
    }

    // Ajouter aux favoris
    await ctx.db.insert("favorites", {
      userId: userId,
      postId: args.postId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Supprimer un post des favoris
 */
export const removeFromFavorites = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not authentificated");
    }

    const userId = user._id;

    // Trouver l'enregistrement de favori
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    if (!favorite) {
      throw new Error("Cette publication n'est pas dans vos favoris");
    }

    // Supprimer des favoris
    await ctx.db.delete(favorite._id);

    return { success: true };
  },
});

/**
 * Supprimer tous les favoris d'un utilisateur
 */
export const removeAllFavorites = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not authentificated");
    }

    const userId = user._id;

    // Récupérer tous les favoris de l'utilisateur
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .collect();

    // Supprimer chaque favori
    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }
  },
});

/**
 * Vérifier si un post est dans les favoris de l'utilisateur
 */
export const isFavorite = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return false;
    }

    // Vérifier si ce post est dans les favoris
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", userId as Id<"users">).eq("postId", args.postId)
      )
      .first();

    return !!favorite as boolean;
  },
});

/**
 * Obtenir tous les posts favoris de l'utilisateur
 */
export const getUserFavorites = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);

    // Paginer les favoris de l'utilisateur
    const favoritesPage = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .order("desc") // Optionnel, selon l'ordre souhaité
      .paginate(paginationOpts);

    // Pour chaque favori de la page, récupérer les détails du post
    const posts = [];
    for (const favorite of favoritesPage.page) {
      const post = await ctx.db.get(favorite.postId);
      if (post) {
        const author = await ctx.db.get(post.authorId);
        if (!author) continue;
        let group = undefined;
        if (post.groupId) {
          group = await ctx.db.get(post.groupId);
        }
        const isLiked = post.likes.includes(userId as Id<"users">);
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_target", (q) => q.eq("targetType", "post"))
          .filter((q) => q.eq(q.field("targetId"), post._id))
          .order("desc")
          .collect();
        const commentsWithAuthor = await Promise.all(
          comments.map(async (comment) => {
            const { _id, ...commentWithout } = comment;
            const commentAuthor = await ctx.db.get(comment.authorId);
            return {
              // Sans _id
              id: _id,
              ...commentWithout,
              author: commentAuthor
                ? {
                    id: commentAuthor._id,
                    name: `${commentAuthor.firstName} ${commentAuthor.lastName}`,
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
        posts.push({
          id: post._id,
          author: {
            id: author._id,
            name: `${author.firstName} ${author.lastName}`,
            username: author.username,
            profilePicture: author.profilePicture,
            isAdmin: author.role === "ADMIN" || author.role === "SUPERADMIN",
          },
          content: post.content,
          medias: medias as string[],
          createdAt: favorite.createdAt,
          likes: post.likes.length,
          isLiked,
          comments: commentsWithAuthor,
          commentsCount: post.comments.length,
          isGroupPost: !!post.groupId,
          favoriteId: favorite._id,
          group: group
            ? {
                id: group._id,
                name: group.name,
                profilePicture: group.profilePicture,
                creator: group.authorId,
              }
            : undefined,
        });
      }
    }

    // Retourner la page paginée, en gardant la structure attendue par Convex
    return {
      ...favoritesPage,
      page: posts.sort((a, b) => b.createdAt - a.createdAt),
    };
  },
});

export const hasFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .first();
    return !!favorites;
  },
});
