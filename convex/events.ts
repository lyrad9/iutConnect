import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { filter } from "convex-helpers/server/filter";
import { getEventEndTimestamp } from "@/src/lib/utils";

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
      photo: v.optional(v.string()),
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
    if (user.role === "USER" && !user.permissions.includes("CREATE_EVENT")) {
      return {
        error: "Vous n'êtes pas autorisé à créer un événement",
        code: "UNAUTHORIZED",
      };
    }
    // Créer un évènement
    const eventId = await ctx.db.insert("events", {
      authorId: userId,
      createdAt: Date.now(),
      // Si allowsParticipants est définie ajouter le createur et les co-organisateurs sinon undefined
      participants: event.allowsParticipants
        ? ([userId, ...(event.collaborators ?? [])] as Id<"users">[])
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
      photo: event.photo as Id<"_storage"> | undefined,
      allowsParticipants: event.allowsParticipants ?? false,
      comments: [],
      likes: [],
      target: event.target,
      isCancelled: false,
    });
    // Appeler le scheduler pour notifier les utilsiateurs et ajouter l'auteur et les co-organisateurs comme participants
    await ctx.scheduler.runAfter(
      5,
      internal.scheduledevents.createScheduledEvent,
      { eventId }
    );
  },
});

// Participer à un évènement
export const suscribeToEvent = mutation({
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
        createdAt: Date.now(),
      });
      // Appeler le scheduler pour créer la notification de participation à un évènement
      await ctx.scheduler.runAfter(
        5,
        internal.notifications.suscribeToEventNotification,
        {
          eventId,
          userId,
        }
      );
    }
  },
});

// Se désinscrire d'un évènement
export const unsubscribeFromEvent = mutation({
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
        participants: (event.participants as Id<"users">[]).filter(
          (id) => id !== userId
        ),
      });
    }
    // Supprimer le participant de la table des participants
    const participant = await ctx.db
      .query("eventParticipants")
      .filter((q) =>
        q.and(
          q.eq(q.field("eventId"), eventId),
          q.eq(q.field("userId"), user._id)
        )
      )
      .first();
    if (participant) {
      await ctx.db.delete(participant._id);
    }
  },
});

/**
 * Supprime un événement et ses données associées
 */
export const deleteEvent = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Événement non trouvé");
    }

    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
    const isAuthor = event.authorId === userId;
    const isCollaborator = event.collaborators?.includes(userId);

    if (!isAuthor && !isAdmin && !isCollaborator) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cet événement");
    }

    // Supprimer les participations à l'événement
    const participations = await ctx.db
      .query("eventParticipants")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const participation of participations) {
      await ctx.db.delete(participation._id);
    }

    // Supprimer les commentaires liés à l'événement
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_target", (q) =>
        q.eq("targetType", "event").eq("targetId", args.eventId)
      )
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Supprimer les notifications liées à l'événement
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    // Enfin, supprimer l'événement lui-même
    await ctx.db.delete(args.eventId);
  },
});

/**
 * Marque un événement comme annulé
 */
export const cancelEvent = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Événement non trouvé");
    }

    // Vérifier que l'utilisateur est l'auteur ou un administrateur
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
    const isAuthor = event.authorId === userId;
    const isCollaborator = event.collaborators?.includes(userId);

    if (!isAuthor && !isAdmin && !isCollaborator) {
      throw new Error("Vous n'êtes pas autorisé à annuler cet événement");
    }

    // Marquer l'événement comme annulé
    await ctx.db.patch(args.eventId, { isCancelled: true });
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
 * Récupère les événements à découvrir pour l'utilisateur connecté
 * Filtre les événements qui ne sont pas passés et auxquels l'utilisateur ne participe pas
 */
export const getDiscoverEvents = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.string(),
    eventTypes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = (await getAuthUserId(ctx)) as Id<"users">;
    const now = Date.now();

    // Construction de la requête de base
    let baseQuery;
    if (args.searchTerm) {
      // On ne met que les filtres supportés dans withSearchIndex
      baseQuery = ctx.db.query("events").withSearchIndex(
        "search_events",
        (q) => q.search("name", args.searchTerm)
        /*   .eq("isCancelled", false) */
      );
    } else {
      baseQuery = ctx.db.query("events").withIndex("by_start_date", (q) => q); // Pas de filtre ici, on filtre après
    }

    // Utilisation de filter (convex-helpers) pour appliquer les filtres avancés
    const eventsQuery = filter(baseQuery, async (event) => {
      const startTimestamp = getEventEndTimestamp({
        startDate: event.startDate,
        startTime: event.startTime,
        endDate: event.endDate,
        endTime: event.endTime,
      });
      const canParticipate = event.allowsParticipants
        ? !event.participants?.includes(userId)
        : event.authorId !== userId && !event.collaborators?.includes(userId);
      return (
        canParticipate &&
        startTimestamp > now &&
        (args.eventTypes.length === 0 ||
          args.eventTypes.includes(event.eventType)) &&
        !event.isCancelled
      );
    });

    // Pagination et tri
    const eventsPage = await eventsQuery.paginate(args.paginationOpts);

    const enrichedEvents = await Promise.all(
      eventsPage.page.map(async (event) => {
        const author = await ctx.db.get(event.authorId);
        let group = undefined;
        if (event.groupId) {
          group = await ctx.db.get(event.groupId);
        }
        const participantsCount = event.participants?.length ?? 0;

        const isParticipating =
          event.allowsParticipants &&
          (event.participants?.includes(userId) as boolean);

        return {
          id: event._id,
          name: event.name,
          description: event.description,
          photo: event.photo
            ? ((await ctx.storage.getUrl(
                event.photo as Id<"_storage">
              )) as string)
            : undefined,
          startDate: event.startDate,
          endDate: event.endDate,
          startTime: event.startTime,
          endTime: event.endTime,
          createdAt: event.createdAt,
          location: {
            type: event.locationType,
            value: event.locationDetails,
          },
          eventType: event.eventType,
          target: event.target,
          author: {
            id: author?._id as Id<"users">,
            name: `${author?.firstName} ${author?.lastName}`,
            username: author?.username,
            profilePicture: author?.profilePicture
              ? ((await ctx.storage.getUrl(
                  author?.profilePicture as Id<"_storage">
                )) as string)
              : undefined,
            isAdmin: author?.role === "ADMIN" || author?.role === "SUPERADMIN",
          },

          group: group
            ? {
                id: group._id as Id<"forums">,
                name: group.name,
                profilePicture: group.profilePicture
                  ? ((await ctx.storage.getUrl(
                      group.profilePicture as Id<"_storage">
                    )) as string)
                  : undefined,
              }
            : undefined,
          participantsCount,
          allowsParticipants: event.allowsParticipants ?? false,
          isParticipating,
          isCancelled: event.isCancelled as boolean,
        };
      })
    );

    return {
      ...eventsPage,
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

    const events = await ctx.db
      .query("events")
      .withIndex("by_author", (q) => q.eq("authorId", userId as Id<"users">))
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
