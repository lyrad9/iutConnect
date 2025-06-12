import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    // Insérer le post dans la base de données
    const postId = await ctx.db.insert("posts", {
      content,
      medias: attachmentIds,
      authorId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: [],
      status: "pending",
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
        notificationType: "new_post",
        targetId: postId,
        targetType: "post",
        createdAt: Date.now(),
      });
    }

    /* return postId; */
  },
});
