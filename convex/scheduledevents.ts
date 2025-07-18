import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const createScheduledEvent = internalMutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const { eventId } = args;
    const event = await ctx.db.get(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const author = await ctx.db.get(event.authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    // Enregistrer l'auteur dans la table des participants
    await ctx.db.insert("eventParticipants", {
      eventId,
      userId: author._id,
      createdAt: Date.now(),
    });
    // Enregistrer les co-organisateurs dans la table des participants
    const collaborators = event.collaborators;
    if (collaborators) {
      await Promise.all(
        collaborators.map((collaborator) =>
          ctx.db.insert("eventParticipants", {
            eventId,
            userId: collaborator,
            createdAt: Date.now(),
          })
        )
      );
    }

    // Envoyer une notification à tous les utilsateurs sauf à lui même
    const users = await ctx.db.query("users").collect();
    const usersToNotify = users.filter((user) => user._id !== author._id);
    await Promise.all(
      usersToNotify.map((notifiedUser) =>
        ctx.db.insert("notifications", {
          title: `Un nouvel événement a été créé: ${event.name}`,
          content: event.collaborators?.includes(notifiedUser._id)
            ? "Vous avez été choisi comme co-organisateur"
            : undefined,
          isRead: false,
          notificationType: "event",
          senderId: author._id,
          recipientId: notifiedUser._id,
          createdAt: Date.now(),
          eventId: eventId,
          targetType: "event",
        })
      )
    );
  },
});
