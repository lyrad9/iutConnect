import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createScheduledGroupPost = internalMutation({
  args: {
    groupId: v.id("forums"),
    userId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { groupId, userId, postId } = args;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Envoyer une notification aux membres du groupe
    const groupMembers = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) =>
        q.eq("groupId", groupId).eq("groupType", "forum")
      )
      .collect();
    for (const member of groupMembers) {
      if (member.userId !== userId) {
        await ctx.db.insert("notifications", {
          senderId: userId,
          recipientId: member.userId,
          title: `Nouveau post dans ${group.name} par ${user.firstName} ${user.lastName}`,
          isRead: false,
          notificationType: "post",
          postId: postId,
          targetType: "post",
          createdAt: Date.now(),
        });
      }
    }
  },
});
