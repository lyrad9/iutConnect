import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createEventInHome = mutation({
  args: {
    event: v.object({
      name: v.string(),
      description: v.string(),
      startDate: v.string(),
      endDate: v.optional(v.string()),
      startTime: v.optional(v.string()),
      endTime: v.optional(v.string()),
      photo: v.string(),
      location: v.object({
        value: v.string(),
        type: v.union(v.literal("online"), v.literal("on-site")),
      }),
      eventType: v.string(),
      collaborators: v.optional(v.array(v.string())),
      allowsParticipants: v.boolean(),
      target: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { event } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    /*  if (user.role === "USER" || !user.permissions.includes("CREATE_EVENT")) {
      throw new Error("Vous n'êtes pas autorisé à créer un événement");
    } */
    // Créer un évènement
    const eventId = await ctx.db.insert("events", {
      authorId: userId,
      createdAt: Date.now(),
      participants: event.allowsParticipants
        ? ([] as Id<"users">[])
        : undefined,
      locationType: event.location.type,
      locationDetails: event.location.value,
      startDate: new Date(event.startDate).getTime(),
      startTime: event.startTime,
      endDate: event.endDate ? new Date(event.endDate).getTime() : undefined,
      endTime: event.endTime ?? undefined,
      name: event.name,
      description: event.description,
      collaborators:
        (await Promise.all(
          event.collaborators!.map(async (collaboratorId) => {
            const user = await ctx.db.get(collaboratorId as Id<"users">);
            if (!user) {
              throw new Error("User not found");
            }
            return user._id;
          })
        )) ?? undefined,
      eventType: event.eventType,
      photo: event.photo,
      allowsParticipants: event.allowsParticipants ?? false,
      comments: [],
      likes: [],
      target: event.target,
    });

    // Envoyer une notification à tous les utilsateurs sauf à lui meme
    const users = await ctx.db.query("users").collect();
    const usersToNotify = users.filter((user) => user._id !== userId);
    await Promise.all(
      usersToNotify.map((notifiedUser) =>
        ctx.db.insert("notifications", {
          title: `Un nouvel événement a été créé: ${event.name}`,
          content: event.collaborators?.includes(notifiedUser._id)
            ? "Vous avez été choisi comme co-organisateur"
            : undefined,
          isRead: false,
          notificationType: "event",
          senderId: userId,
          recipientId: notifiedUser._id,
          createdAt: Date.now(),
          eventId: eventId,
          targetType: "event",
        })
      )
    );
  },
});

// Participer à un évènement
export const toggleParticipation = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const { eventId } = args;
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authentificated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const event = await ctx.db.get(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.allowsParticipants) {
      await ctx.db.patch(eventId, {
        participants: [...(event.participants as Id<"users">[]), userId],
      });
      // Enregistrer le participant dans la table eventParticipants
      await ctx.db.insert("eventParticipants", {
        eventId,
        userId,
        status: "attending",
        createdAt: Date.now(),
      });
      // Envoi une notification au propriétaire de l'évènement
      const eventAuthor = await ctx.db.get(event.authorId);
      if (eventAuthor && eventAuthor._id !== user._id) {
        await ctx.db.insert("notifications", {
          senderId: userId,
          recipientId: eventAuthor._id,
          title: `est devenu participant à votre évènement`,
          isRead: false,
          notificationType: "event",
          eventId: eventId,
          targetType: "event",
          createdAt: Date.now(),
        });
      }
    }
    /*    else {
      await ctx.db.patch(eventId, {
        participants: (event.participants as Id<"users">[]).filter(
          (id) => id !== userId
        ),
      });
    } */
  },
});

export const getHomeEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_creation_date", (q) => q.gt("createdAt", 0))
      .order("desc")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "approved"),
          q.eq(q.field("status"), undefined)
        )
      )
      .paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      events.page.map(async (event) => {
        const author = await ctx.db.get(event.authorId);
        let group = undefined;
        if (event.groupId) {
          group = await ctx.db.get(event.groupId);
        }
        const participantsCount =
          event.participants?.length ?? "Pas de participants";
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_target", (q) => q.eq("targetType", "event"))
          .filter((q) => q.eq(q.field("targetId"), event._id))
          .collect();

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
              : undefined,
            group: group
              ? {
                  id: group._id,
                  name: group.name,
                  profilePicture: group.profilePicture,
                  creator: group.authorId,
                }
              : undefined,
            participantsCount,
            comments: comments,
            commentsCount: event.comments,
          },
          createdAt: event.createdAt,
        };
      })
    );

    return {
      ...events,
      page: enrichedEvents,
    };
  },
});

/**
 * Récupère les événements créés par l'utilisateur connecté
 * @param paginationOpts - Options de pagination
 */
export const getUserEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: null };
    }

    const events = await ctx.db
      .query("events")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      events.page.map(async (event) => {
        // Formatage de la date pour l'affichage
        const eventDate = new Date(event.startDate);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(eventDate);

        return {
          id: event._id,
          name: event.name,
          date: formattedDate,
          location: event.locationDetails,
          type: event.eventType,
          photo: event.photo,
        };
      })
    );

    return {
      ...events,
      page: enrichedEvents,
    };
  },
});

/**
 * Récupère les événements à venir (date de début > date actuelle)
 * @param paginationOpts - Options de pagination
 */
export const getUpcomingEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date", (q) => q.gt("startDate", now))
      .order("asc") // Du plus proche au plus lointain
      .paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      events.page.map(async (event) => {
        // Formatage de la date pour l'affichage
        const eventDate = new Date(event.startDate);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(eventDate);

        return {
          id: event._id,
          name: event.name,
          date: formattedDate,
          location: event.locationDetails,
          type: event.eventType,
          photo: event.photo,
        };
      })
    );

    return {
      ...events,
      page: enrichedEvents,
    };
  },
});

/**
 * Récupère les événements créés par l'utilisateur connecté
 * @param limit - Nombre maximum d'événements à retourner
 */
/* export const getUserEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: null };
    }

    const events = await ctx.db
      .query("events")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      events.page.map(async (event) => {
        // Formatage de la date pour l'affichage
        const eventDate = new Date(event.startDate);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(eventDate);

        return {
          id: event._id,
          name: event.name,
          date: formattedDate,
          location: event.locationDetails,
          type: event.eventType,
          photo: event.photo,
        };
      })
    );

    return {
      ...events,
      page: enrichedEvents,
    };
  },
});
 */
/**
 * Récupère les événements à venir (date de début > date actuelle)
 * @param limit - Nombre maximum d'événements à retourner
 */
/* export const getUpcomingEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date", (q) => q.gt("startDate", now))
      .order("asc") // Du plus proche au plus lointain
      .paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      events.page.map(async (event) => {
        // Formatage de la date pour l'affichage
        const eventDate = new Date(event.startDate);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(eventDate);

        return {
          id: event._id,
          name: event.name,
          date: formattedDate,
          location: event.locationDetails,
          type: event.eventType,
          photo: event.photo,
        };
      })
    );

    return {
      ...events,
      page: enrichedEvents,
    };
  },
});
 */
