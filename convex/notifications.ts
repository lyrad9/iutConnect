import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { currentUser } from "./users";
import { api } from "./_generated/api";

/**
 * Get paginated notifications for the home dropdown
 * Returns a smaller set of notifications for the dropdown menu
 */
export const getHomeNotifications = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);

    const userId = user?._id as Id<"users">;

    // Build the query for the notifications dropdown
    const notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", userId))
      .order("desc");

    // Fetch paginated results (limited to a max of 20 for the dropdown)
    const paginatedNotifications = await notificationsQuery.paginate(
      args.paginationOpts
    );

    // Load related data for each notification
    const notificationsWithData = await Promise.all(
      paginatedNotifications.page.map(async (notification) => {
        // Get sender info
        const sender = await ctx.db.get(notification.senderId);

        return {
          ...notification,
          sender: sender
            ? {
                id: sender._id,
                name: `${sender.firstName} ${sender.lastName}`,
                avatar: sender.profilePicture,
                username: sender.username || sender.firstName.toLowerCase(),
              }
            : undefined,
        };
      })
    );

    return {
      ...paginatedNotifications,
      page: notificationsWithData,
    };
  },
});

/**
 * Get paginated notifications for a user with filters by type
 */
export const getUserNotifications = query({
  args: {
    type: v.optional(
      v.union(
        v.literal("all"),
        v.literal("like"),
        v.literal("comment"),
        v.literal("event"),
        v.literal("group"),
        v.literal("request")
      )
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    /*  if (!user) {
      throw new Error("User not found");
    } */
    const userId = user?._id as Id<"users">;
    // Build the query
    let notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", userId));

    // Apply type filter if specified
    if (args.type && args.type !== "all") {
      notificationsQuery = notificationsQuery.filter((q) =>
        q.eq(q.field("notificationType"), args.type)
      );
    }

    // Fetch paginated results
    const paginatedNotifications = await notificationsQuery
      .order("desc")
      .paginate(args.paginationOpts);

    // Load related data for each notification
    const notificationsWithData = await Promise.all(
      paginatedNotifications.page.map(async (notification) => {
        // Get sender info
        const sender = await ctx.db.get(notification.senderId);

        /*  // Initialize additional data
        let targetData: any = null;

        // Load specific data based on notification type and target
        if (notification.targetType === "post" && notification.postId) {
          targetData = await ctx.db.get(notification.postId);
        } else if (
          notification.targetType === "event" &&
          notification.eventId
        ) {
          targetData = await ctx.db.get(notification.eventId);
        } else if (
          notification.targetType === "comment" &&
          notification.commentId
        ) {
          targetData = await ctx.db.get(notification.commentId);
        } else if (
          (notification.targetType === "forum" ||
            notification.targetType === "groupMember") &&
          notification.forumId
        ) {
          targetData = await ctx.db.get(notification.forumId);
        } else if (
          notification.targetType === "discussionRoom" &&
          notification.discussionRoomId
        ) {
          targetData = await ctx.db.get(notification.discussionRoomId);
        } */

        return {
          ...notification,
          sender: sender
            ? {
                id: sender._id,
                name: `${sender.firstName} ${sender.lastName}`,
                avatar: sender.profilePicture,
                username: sender.username || sender.firstName.toLowerCase(),
              }
            : undefined,
          /*  targetData, */
        };
      })
    );

    return {
      ...paginatedNotifications,
      page: notificationsWithData,
    };
  },
});

/**
 * Get unread notifications count
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user?._id as Id<"users">;
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) =>
        q.eq("recipientId", userId).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length ?? 0;
  },
});

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user._id as Id<"users">;
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) =>
        q.eq("recipientId", userId).eq("isRead", false)
      )
      .collect();

    // Update each notification
    await Promise.all(
      notifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return notifications.length;
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }
    await ctx.db.delete(args.notificationId);
    return true;
  },
});

// Mutation interne pour créer la notification qu'un membre à rejoint un groupe public à l'admin
export const notifyAdminToJoinPublicGroup = internalMutation({
  args: {
    groupId: v.id("forums"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    const admin = await ctx.db.get(group.authorId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    await ctx.db.insert("notifications", {
      senderId: args.userId,
      recipientId: admin._id,
      notificationType: "request",
      targetType: "forum",
      forumId: args.groupId,
      isRead: false,
      createdAt: Date.now(),
      title: `Un utilisateur a rejoint votre groupe ${group.name}`,
    });
  },
});

// Mutation interne pour créer la notification de demande d'adhésion en attente à l'admin
export const notifyAdminToJoinPrivateGroup = internalMutation({
  args: {
    groupMembersId: v.id("groupMembers"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const groupMember = await ctx.db.get(args.groupMembersId);
    if (!groupMember) {
      throw new Error("Group member not found");
    }
    const group = await ctx.db.get(groupMember.groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    const admin = await ctx.db.get(group.authorId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    await ctx.db.insert("notifications", {
      senderId: args.userId,
      recipientId: admin._id,
      notificationType: "request",
      targetType: "forum",
      groupMemberId: args.groupMembersId,
      forumId: group._id as Id<"forums">,
      isRead: false,
      createdAt: Date.now(),
      title: `Un utilisateur a demandé à rejoindre votre groupe ${group.name}`,
    });
  },
});

// Mutation interne pour supprimer la notification de demande d'adhésion à un groupe
export const deleteGroupJoinRequestNotification = internalMutation({
  args: {
    forumId: v.id("forums"),
    groupMemberId: v.id("groupMembers"),
  },
  handler: async (ctx, args) => {
    // Chercher la notification liée à ce groupe
    const notification = await ctx.db
      .query("notifications")
      .withIndex("by_groupMemberId_groupId_targetType", (q) =>
        q
          .eq("groupMemberId", args.groupMemberId)
          .eq("forumId", args.forumId)
          .eq("targetType", "forum")
      )
      .unique();
    if (!notification) {
      throw new Error("Notification not found");
    }
    await ctx.db.delete(notification._id);
  },
});

// Mutation interne pour créer la notification de participation à un évènement
export const suscribeToEventNotification = internalMutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const author = await ctx.db.get(event.authorId);
    if (!author) {
      throw new Error("Author not found");
    }
    await ctx.db.insert("notifications", {
      senderId: args.userId,
      recipientId: author._id,
      notificationType: "event",
      targetType: "event",
      eventId: event._id as Id<"events">,
      isRead: false,
      createdAt: Date.now(),
      title: `Un utilisateur a rejoint votre évènement ${event.name}`,
    });
  },
});
