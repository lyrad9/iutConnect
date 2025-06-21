import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GroupMainCategoryType } from "@/src/components/utils/const/group-main-categories";
import { paginationOptsValidator } from "convex/server";
import { faker } from "@faker-js/faker";
import { internalMutation } from "./_generated/server";
import { filter } from "convex-helpers/server/filter";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";
import { api, internal } from "./_generated/api";

/**
 * Get a forum by ID
 */
export const getById = query({
  args: {
    forumId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.forumId);
  },
});

/**
 * Process a group membership request
 * This function will be completed as part of forum membership management
 */
export const processGroupMembershipRequest = mutation({
  args: {
    groupMemberId: v.id("groupMembers"),
    action: v.union(v.literal("accept"), v.literal("reject")),
    processedById: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the group membership request
    const groupMembership = await ctx.db.get(args.groupMemberId);
    if (!groupMembership) {
      throw new Error("Group membership request not found");
    }

    // Update the group membership status
    await ctx.db.patch(args.groupMemberId, {
      status: args.action === "accept" ? "accepted" : "rejected",
      updatedAt: Date.now(),
    });

    return {
      success: true,
      status: args.action === "accept" ? "accepted" : "rejected",
    };
  },
});

/**
 * Process a post approval request
 * This function will be completed as part of content moderation feature
 */
export const processPostApprovalRequest = mutation({
  args: {
    postId: v.id("posts"),
    action: v.union(v.literal("approve"), v.literal("reject")),
    moderatorId: v.id("users"),
    moderationComment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Update the post status
    await ctx.db.patch(args.postId, {
      status: args.action === "approve" ? "approved" : "rejected",
      moderatorId: args.moderatorId,
      moderationComment: args.moderationComment,
      moderatedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      status: args.action === "approve" ? "approved" : "rejected",
    };
  },
});

/**
 * Process an event approval request
 * This function will be completed as part of content moderation feature
 */
export const processEventApprovalRequest = mutation({
  args: {
    eventId: v.id("events"),
    action: v.union(v.literal("approve"), v.literal("reject")),
    moderatorId: v.id("users"),
    moderationComment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Update the event status
    await ctx.db.patch(args.eventId, {
      status: args.action === "approve" ? "approved" : "rejected",
      moderatorId: args.moderatorId,
      moderationComment: args.moderationComment,
      moderatedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      status: args.action === "approve" ? "approved" : "rejected",
    };
  },
});

/**
 * Crée un nouveau forum (groupe)
 */
export const createForum = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    about: v.optional(v.string()),
    interests: v.array(v.string()),
    mainCategory: v.string(),
    confidentiality: v.union(v.literal("public"), v.literal("private")),
    visibility: v.union(v.literal("visible"), v.literal("masked")),
    requiresPostApproval: v.boolean(),
    profilePicture: v.optional(v.string()),
    coverPhoto: v.optional(v.string()),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Récupérer l'ID de l'utilisateur authentifié
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Vérifier que l'utilisateur existe
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Vérifier les permissions de l'utilisateur (si nécessaire)
    if (
      !user.permissions.includes("CREATE_GROUP") &&
      user.role !== "SUPERADMIN" &&
      user.role !== "ADMIN"
    ) {
      throw new Error("You don't have permission to create a group");
    }

    // Créer le forum
    const forumId = await ctx.db.insert("forums", {
      name: args.name,
      description: args.description,
      about: args.about || "",
      interests: args.interests as [], // Cast nécessaire car les types sont différents
      mainCategory: args.mainCategory as GroupMainCategoryType, // Cast nécessaire car les types sont différents
      status: "active",
      confidentiality: args.confidentiality,
      visibility: args.visibility,
      requiresPostApproval: args.requiresPostApproval,
      authorId: userId,
      profilePicture: args.profilePicture,
      coverPhoto: args.coverPhoto,
      members: [userId, ...args.members], // L'auteur est automatiquement membre
      posts: [],
      createdAt: Date.now(),
    });

    // Ajouter l'auteur comme administrateur du groupe
    await ctx.db.insert("groupMembers", {
      userId: userId,
      groupId: forumId as Id<"forums">,
      groupType: "forum",
      isAdmin: true,
      status: "accepted",
      joinedAt: Date.now(),
      createdAt: Date.now(),
    });

    // Ajouter les membres sélectionnés
    for (const memberId of args.members) {
      await ctx.db.insert("groupMembers", {
        userId: memberId,
        groupId: forumId,
        groupType: "forum",
        isAdmin: false,
        status: "accepted", // Les membres ajoutés lors de la création sont automatiquement acceptés
        joinedAt: Date.now(),
        createdAt: Date.now(),
      });
    }

    return { forumId };
  },
});

/**
 * Récupère la liste des forums découvrables par l'utilisateur avec pagination
 * et filtrage par catégories et recherche textuelle
 */
export const getDiscoverUserGroups = query({
  args: {
    searchTerm: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Récupérer l'ID de l'utilisateur connecté
    const userId = (await getAuthUserId(ctx)) as Id<"users">;

    let groupsQuery;

    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const searchTerm = args.searchTerm.trim();
      groupsQuery = ctx.db
        .query("forums")
        .withSearchIndex("search_name", (q) =>
          q
            .search("name", searchTerm)
            .eq("visibility", "visible")
            .eq("status", "active")
        );
    } else {
      groupsQuery = ctx.db
        .query("forums")
        .withIndex("by_visibility_and_status", (q) =>
          q.eq("visibility", "visible").eq("status", "active")
        );
    }

    // Filtrer par catégorie si spécifié
    // Filtrer par catégorie si spécifié
    if (args.categories && args.categories.length > 0) {
      groupsQuery = groupsQuery.filter((q) =>
        q.or(
          ...(args.categories || []).map((category) =>
            q.eq(q.field("mainCategory"), category)
          )
        )
      );
    }
    // Récupérer les groupes avec pagination
    const groupsPage = await groupsQuery.paginate(args.paginationOpts);
    // Filtrer les groupes où l'utilisateur n'est pas admin (author)
    const filteredGroups = groupsPage.page.filter(
      (group) => group.authorId !== userId
    );

    // Récupérer les informations supplémentaires pour chaque groupe
    const groupsWithDetails = await Promise.all(
      filteredGroups.map(async (group) => {
        // Récupérer l'auteur
        const author = await ctx.db.get(group.authorId);

        // Vérifier si l'utilisateur actuel est membre de ce groupe
        const membership = await ctx.db
          .query("groupMembers")
          .withIndex("by_user_and_group", (q) =>
            q
              .eq("userId", userId as Id<"users">)
              .eq("groupId", group._id)
              .eq("groupType", "forum")
          )
          .first();

        // Transformer les URLs des images
        const profilePictureUrl = group.profilePicture ?? null;
        const coverPhotoUrl = group.coverPhoto ?? null;
        /*    const profilePictureUrl = group.profilePicture
          ? await ctx.storage.getUrl(group.profilePicture as Id<"_storage">)
          : null;
        const coverPhotoUrl = group.coverPhoto
          ? await ctx.storage.getUrl(group.coverPhoto as Id<"_storage">)
          : null; */

        // Compter le nombre total de membres
        const membersCount = group.members ? group.members.length : 0;

        return {
          id: group._id,
          name: group.name,

          description: group.description || "",
          coverImage: coverPhotoUrl,
          logoImage: profilePictureUrl,
          members: group.members,
          membersCount,
          type: group.mainCategory,
          confidentiality: group.confidentiality,
          joined: !!membership && membership.status === "accepted",
          requestStatus: !!membership && membership.status === "pending",
          author: author
            ? {
                id: author._id,
                name: `${author.firstName} ${author.lastName}`,
              }
            : null,
          createdAt: group.createdAt,
        };
      })
    );

    return {
      ...groupsPage,
      page: groupsWithDetails,
    };
  },
});

//Vérifie s'il y'a des groupes dans la plateformes

export const hasGroups = query({
  handler: async (ctx) => {
    const groups = await ctx.db.query("forums").collect();
    return groups.length > 0;
  },
});

export const seedForums = internalMutation(async (ctx) => {
  // Recuperer les utilisateurs aléatoirement
  const randomsUsers = await ctx.db.query("users").collect();
  for (let i = 0; i < 20; i++) {
    // Définir un admin aléatoire
    const admin = randomsUsers[Math.floor(Math.random() * randomsUsers.length)];
    await ctx.db.insert("forums", {
      // Ajoute
      members: [
        admin._id,
        // Définir d'autres membres aléatoirement sauf l'admin
        ...randomsUsers
          .filter((user) => user._id !== admin._id)
          .map((user) => user._id)
          .slice(0, Math.floor(Math.random() * 5)),
      ],
      posts: [], // Ajoute des IDs de posts si besoin
      authorId: admin._id,
      profilePicture: faker.image.avatar(),
      coverPhoto: faker.image.url(),
      name: faker.company.name(),
      description: faker.lorem.words(50),
      about: faker.lorem.words(200),
      interests: [faker.word.noun(), faker.word.noun()],
      mainCategory:
        GROUP_MAIN_CATEGORIES[
          Math.floor(Math.random() * GROUP_MAIN_CATEGORIES.length)
        ],
      status: "active",
      confidentiality: faker.helpers.arrayElement(["public", "private"]),
      visibility: "visible",
      requiresPostApproval: faker.datatype.boolean(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  const forums = await ctx.db.query("forums").collect();
  // Récupérer chaque admin et l'insérer comme membre
  for (const forum of forums) {
    await ctx.db.insert("groupMembers", {
      userId: forum.authorId,
      groupId: forum._id,
      groupType: "forum",
      isAdmin: true,
      status: "accepted",
      joinedAt: Date.now(),
      createdAt: Date.now(),
    });
  }
  // Récupérer chaque membre sauf l'auteur des forums et l'insérer comme membre
  for (const forum of forums) {
    const members = forum.members;
    for (const member of members.filter(
      (member) => member !== forum.authorId
    )) {
      await ctx.db.insert("groupMembers", {
        userId: member,
        groupId: forum._id,
        groupType: "forum",
        isAdmin: false,
        status: "accepted",
        joinedAt: Date.now(),
        createdAt: Date.now(),
      });
    }
  }
});

// Fonction pour annuler la demande de rejoindre un groupe
export const cancelGroupJoinRequest = mutation({
  args: {
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authentificated");
    }

    // Vérifier que le groupe existe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Vérifier si l'utilisateur a une demande d'adhésion en attente
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q.eq("userId", userId as Id<"users">).eq("groupId", args.groupId)
      )
      .first();

    if (!membership) {
      throw new Error("You don't have a pending join request");
    }

    // Supprimer la demande d'adhésion
    await ctx.db.delete(membership._id);
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.deleteGroupJoinRequestNotification,
      {
        forumId: args.groupId,
        groupMemberId: membership._id,
      }
    );
  },
});

// Faire une demande d'adhésion à un groupe
export const requestGroupJoin = mutation({
  args: {
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authentificated");
    }

    // Vérifier que le groupe existe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Vérifier si l'utilisateur est déjà membre du groupe
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q.eq("userId", userId as Id<"users">).eq("groupId", args.groupId)
      )
      .first();

    if (membership) {
      throw new Error("You are already a member of this group");
    }

    // Créer une demande d'adhésion en attente
    const groupMembersId = await ctx.db.insert("groupMembers", {
      userId: userId as Id<"users">,
      groupId: args.groupId,
      groupType: "forum",
      isAdmin: false,
      status: "pending",
      requestAt: Date.now(),
      createdAt: Date.now(),
    });
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.notifyAdminToJoinPrivateGroup,
      {
        groupMembersId: groupMembersId,
        userId: userId as Id<"users">,
      }
    );
  },
});

/**
 * Récupère les groupes dont l'utilisateur est membre
 * @param paginationOpts - Options de pagination
 */
export const sidebarGetUserGroups = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // On récupère tous les groupes avec pagination
    const results = await ctx.db.query("forums").paginate(args.paginationOpts);

    // On filtre côté serveur pour ne garder que les groupes où l'utilisateur est membre mais pas admin
    const filteredPage = results.page.filter(
      (group) =>
        group.members?.includes(userId as Id<"users">) &&
        group.authorId !== userId
    );

    // Enrichissement des données retournées
    return {
      ...results,
      page: await Promise.all(
        filteredPage.map(async (group) => {
          const author = await ctx.db.get(group.authorId);
          return {
            ...group,
            name: group.name,
            membersCount: group.members ? group.members.length : 0,
            /*    avatar: group.profilePicture
              ? ctx.storage.getUrl(group.profilePicture as Id<"_storage">)
              : null, */
            avatar: group.profilePicture ?? null,
          };
        })
      ),
    };
  },
});
// recupérer en fonction de la rechercher et du filtre les groupes de l'utilisateur(groupes administrés, groupes rejoints)
export const getUserGroups = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.optional(v.string()),
    filterType: v.optional(
      v.union(v.literal("admin"), v.literal("member"), v.literal("all"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authentificated");
    }
    const groups = await filter(ctx.db.query("forums"), (group) => {
      // Filtre par nom (recherche)
      const matchesSearch =
        !args.searchTerm ||
        group.name?.toLowerCase().includes(args.searchTerm?.toLowerCase());

      // Filtre par rôle
      let matchesRole = false;
      if (args.filterType === "admin") {
        matchesRole = group.authorId === userId;
      } else if (args.filterType === "member") {
        matchesRole =
          group.authorId !== userId && group.members?.includes(userId);
      } else if (args.filterType === "all") {
        matchesRole =
          group.authorId === userId || group.members?.includes(userId);
      }

      return matchesSearch && matchesRole;
    }).paginate(args.paginationOpts);

    return {
      ...groups,
      page: await Promise.all(
        groups.page.map(async (group) => {
          const author = await ctx.db.get(group.authorId);
          // Recupérer la propriété joinedAt à la table grupMembers
          const joinedAt = await ctx.db
            .query("groupMembers")
            .withIndex("by_user_and_group", (q) =>
              q.eq("userId", userId as Id<"users">).eq("groupId", group._id)
            )
            .first();

          return {
            ...group,
            name: group.name,
            membersCount: group.members ? group.members.length : 0,
            avatar: group.profilePicture ?? null,
            /* avatar: group.profilePicture
              ? await ctx.storage.getUrl(group.profilePicture as Id<"_storage">)
              : null, */
            joinedAt: joinedAt?.joinedAt,
          };
        })
      ),
    };
  },
});

/**
 * Récupère les groupes gérés par l'utilisateur (dont il est admin)
 * @param paginationOpts - Options de pagination
 */
export const getManagedGroups = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Utilisation de la pagination
    const results = await ctx.db
      .query("forums")
      .withIndex("by_author", (q) => q.eq("authorId", userId as Id<"users">))
      .paginate(args.paginationOpts);

    // Enrichissement des données retournées
    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (group) => {
          // Récupérer l'auteur du groupe
          const author = await ctx.db.get(group.authorId);

          return {
            ...group,
            name: group.name,
            membersCount: group.members ? group.members.length : 0,
            /*       avatar: group.profilePicture
              ? ctx.storage.getUrl(group.profilePicture as Id<"_storage">)
              : null, */
            avatar: group.profilePicture ?? null,
            /*   coverPhoto: group.coverPhoto
              ? ctx.storage.getUrl(group.coverPhoto as Id<"_storage">)
              : null, */
          };
        })
      ),
    };
  },
});

// Rejoindre un groupe public
export const joinPublicGroup = mutation({
  args: {
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new Error("User not authentificated");
    }
    const userId = user._id;
    // Vérifier que le groupe existe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Vérifier si le groupe est public
    if (group.confidentiality !== "public") {
      throw new Error("This group is not public");
    }

    // Vérifier si l'utilisateur est déjà membre du groupe
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q.eq("userId", userId as Id<"users">).eq("groupId", args.groupId)
      )
      .first();

    if (membership) {
      throw new Error("You are already a member of this group");
    }
    // L'ajouter à la liste des membres du groupe
    await ctx.db.patch(args.groupId, {
      members: [...(group.members || []), userId as Id<"users">],
    });
    // L'insérer avec un status à accepted
    await ctx.db.insert("groupMembers", {
      userId: userId as Id<"users">,
      groupId: args.groupId,
      groupType: "forum",
      isAdmin: false,
      status: "accepted",
      joinedAt: Date.now(),
      createdAt: Date.now(),
    });
    // Appeler le job pour envoyer la notification à l'admin
    await ctx.scheduler.runAfter(
      0,
      internal.notifications.notifyAdminToJoinPublicGroup,
      {
        groupId: args.groupId,
        userId: userId,
      }
    );
    /*  return { success: true }; */
  },
});
// Vérifier si l'utilisateur est au moins admin d'un groupe(parcourir les groupes et vérifier s'il est auteur)
export const isUserAdminOfGroup = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new ConvexError("User not authentificated");
    }
    const userId = user._id;
    // Parcourir les groupes et vérifier s'il est auteur
    const groups = await ctx.db.query("forums").collect();
    for (const group of groups) {
      if (group.authorId === userId) {
        return true;
      }
    }
    return false;
  },
});

/**
 * Permet à un utilisateur de quitter un groupe
 */
export const leaveGroup = mutation({
  args: {
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("user not authentificated");
    }

    // Vérifier que le groupe existe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("group not found");
    }

    // Vérifier que l'utilisateur n'est pas l'auteur du groupe
    if (group.authorId === userId) {
      throw new ConvexError(
        "You cannot leave a group you are the administrator of"
      );
    }

    // Vérifier que l'utilisateur est membre du groupe
    if (!group.members.includes(userId as Id<"users">)) {
      throw new ConvexError("You are not a member of this group");
    }

    // Récupérer l'adhésion au groupe
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) =>
        q.eq("userId", userId as Id<"users">).eq("groupId", args.groupId)
      )
      .first();

    if (membership) {
      // supprimer l'adhésion de la table groupMembers
      await ctx.db.delete(membership._id);
      // supprimer de la liste des membres
      await ctx.db.patch(args.groupId, {
        members: group.members.filter((id) => id !== userId),
      });
    }

    // Retirer l'utilisateur de la liste des membres du groupe
    await ctx.db.patch(args.groupId, {
      members: group.members.filter((id) => id !== userId),
    });

    return { success: true };
  },
});

// Vérifier si l'utilisateur est membre d'un groupe sauf les groupes dont il est admin
export const isUserMemberOfGroup = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) {
      throw new ConvexError("User not authentificated");
    }
    const userId = user._id;
    // Parcourir les groupes et vérifier s'il est membre
    const groups = await ctx.db.query("forums").collect();
    for (const group of groups.filter((group) => group.authorId !== userId)) {
      if (group.members.includes(userId)) {
        return true;
      }
    }
    return false;
  },
});

/**
 * Récupère les demandes d'adhésion en attente de l'utilisateur
 */

export const getUserPendingRequests = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("User not authentificated");
    }

    // Récupérer les demandes d'adhésion en attente avec pagination
    const pendingMemberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId as Id<"users">))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .paginate(args.paginationOpts);

    // Récupérer les détails des groupes pour chaque demande (page courante)
    const pendingRequests = await Promise.all(
      pendingMemberships.page.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId as Id<"forums">);
        if (!group) {
          return null;
        }

        // Récupérer l'auteur du groupe
        const author = await ctx.db.get(group.authorId);

        return {
          id: membership._id,
          requestAt: membership.requestAt,
          createdAt: membership.createdAt,
          group: {
            _id: group._id,
            name: group.name,
            description: group.description,
            confidentiality: group.confidentiality,

            profilePicture: group.profilePicture,
            coverPhoto: group.coverPhoto,
            /*  profilePicture: group.profilePicture
                  ? await ctx.storage.getUrl(group.profilePicture as Id<"_storage">)
                  : null,
                coverPhoto: group.coverPhoto
                  ? await ctx.storage.getUrl(group.coverPhoto as Id<"_storage">)
                  : null, */
            authorName: author
              ? `${author.firstName} ${author.lastName}`
              : "Inconnu",
          },
        };
      })
    );

    // Filtrer les éléments null (groupes qui n'existent plus)
    return {
      ...pendingMemberships,
      page: pendingRequests.filter(Boolean),
    };
  },
});

//Supprimer un groupe
export const deleteGroup = mutation({
  args: {
    groupId: v.id("forums"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("User not authentificated");
    }
    // Vérifier que l'utilisateur est l'auteur du groupe
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("Group not found");
    }
    if (group.authorId !== userId) {
      throw new ConvexError("You are not the administrator of this group");
    }
    // Supprimer le groupe
    await ctx.db.delete(args.groupId);
    return { success: true };
  },
});
