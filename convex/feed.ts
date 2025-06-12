import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Doc } from "./_generated/dataModel";

/**
 * Récupère les publications et événements pour le flux social avec pagination
 * Combine les posts, les événements et les publications de groupes
 * Trie les résultats par date de création
 */
export const getFeedItems = query({
  args: {
    paginationOpts: paginationOptsValidator,
    // Filtres optionnels
    userId: v.optional(v.id("users")),
    includeEvents: v.optional(v.boolean()),
    includePosts: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Paramètres par défaut
    const includeEvents = args.includeEvents ?? true;
    const includePosts = args.includePosts ?? true;

    // Tableau pour stocker tous les éléments du flux
    const feedItems: Array<{
      id: string;
      type: "post" | "event";
      data: any;
      createdAt: number;
    }> = [];

    // Récupérer les posts si demandé
    if (includePosts) {
      // Récupérer les posts
      const posts = await ctx.db
        .query("posts")
        .withIndex("by_creation_date")
        .order("desc")
        .filter((q) => q.eq(q.field("status"), "approved"))
        .paginate(args.paginationOpts);

      // Récupérer les informations détaillées pour chaque post
      const enrichedPosts = await Promise.all(
        posts.page.map(async (post) => {
          // Récupérer les données de l'auteur
          const author = await ctx.db.get(post.authorId);

          // Récupérer les informations du groupe si le post appartient à un groupe
          let group = undefined;
          if (post.groupId) {
            group = await ctx.db.get(post.groupId);
          }

          // Construire l'objet post enrichi
          return {
            id: post._id,
            type: "post" as const,
            data: {
              ...post,
              author: author
                ? {
                    id: author._id,
                    name: `${author.firstName} ${author.lastName}`,
                    username: author.username || null,
                    profilePicture: author.profilePicture,
                    role: author.role,
                    isAdmin:
                      author.role === "ADMIN" || author.role === "SUPERADMIN",
                  }
                : {
                    id: "deleted",
                    name: "Utilisateur supprimé",
                    isAdmin: false,
                  },
              group: group
                ? {
                    id: group._id,
                    name: group.name,
                    profilePicture: group.profilePicture,
                  }
                : undefined,
            },
            createdAt: post.createdAt,
          };
        })
      );

      feedItems.push(...enrichedPosts);
    }

    // Récupérer les événements si demandé
    if (includeEvents) {
      const events = await ctx.db
        .query("events")
        .withIndex("by_creation_date", (q) => q.gt("createdAt", 0))
        .order("desc")
        .filter((q) => q.eq(q.field("status"), "approved"))
        .paginate(args.paginationOpts);

      // Récupérer les informations détaillées pour chaque événement
      const enrichedEvents = await Promise.all(
        events.page.map(async (event) => {
          // Récupérer les données de l'auteur
          const author = await ctx.db.get(event.authorId);

          // Récupérer les informations du groupe si l'événement appartient à un groupe
          let group = undefined;
          if (event.groupId) {
            group = await ctx.db.get(event.groupId);
          }

          // Nombre de participants
          const participantsCount = event.participants
            ? event.participants.length
            : 0;

          // Construire l'objet événement enrichi
          return {
            id: event._id,
            type: "event" as const,
            data: {
              ...event,
              author: author
                ? {
                    id: author._id,
                    name: `${author.firstName} ${author.lastName}`,
                    username: author.username || null,
                    profilePicture: author.profilePicture,
                    role: author.role,
                    isAdmin:
                      author.role === "ADMIN" || author.role === "SUPERADMIN",
                  }
                : {
                    id: "deleted",
                    name: "Utilisateur supprimé",
                    isAdmin: false,
                  },
              group: group
                ? {
                    id: group._id,
                    name: group.name,
                    profilePicture: group.profilePicture,
                  }
                : undefined,
              participantsCount,
            },
            createdAt: event.createdAt,
          };
        })
      );

      feedItems.push(...enrichedEvents);
    }

    // Trier tous les éléments par date de création (plus récents en premier)
    feedItems.sort((a, b) => b.createdAt - a.createdAt);

    // Limiter le nombre d'éléments à la pagination demandée
    const paginatedItems = feedItems.slice(0, args.paginationOpts.numItems);

    // Déterminer si nous avons plus de données
    const isDone = feedItems.length <= args.paginationOpts.numItems;

    // Générer un curseur pour la pagination
    // Pour simplifier, utilisons la date du dernier élément comme curseur
    const lastItem = paginatedItems[paginatedItems.length - 1];
    const continueCursor = isDone
      ? null
      : lastItem
        ? String(lastItem.createdAt)
        : null;

    return {
      page: paginatedItems,
      isDone,
      continueCursor,
    };
  },
});
