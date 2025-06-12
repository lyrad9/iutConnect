import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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
      photo: v.string(),
      location: v.object({
        value: v.string(),
        type: v.union(v.literal("online"), v.literal("on-site")),
      }),
      eventType: v.string(),
      collaborators: v.optional(v.array(v.string())),
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
      participants: [],
      locationType: event.location.type,
      locationDetails: event.location.value,
      startDate: new Date(event.startDate).getTime(),
      endDate: event.endDate ? new Date(event.endDate).getTime() : undefined,
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
    });

    // Envoyer une notification à tous les utilsateurs sauf à lui meme
    const users = await ctx.db.query("users").collect();
    const usersToNotify = users.filter(
      (user) => user._id !== userId && !event.collaborators.includes(user._id)
    );
    await Promise.all(
      usersToNotify.map((notifiedUser) =>
        ctx.db.insert("notifications", {
          title: `Un nouvel événement a été créé: ${event.name}`,
          content: event.collaborators.includes(notifiedUser._id)
            ? "Vous avez été choisi comme co-organisateur"
            : undefined,
          isRead: false,
          notificationType: "new_event",
          senderId: userId,
          recipientId: notifiedUser._id,
          createdAt: Date.now(),
          targetId: eventId,
          targetType: "event",
        })
      )
    );
  },
});
