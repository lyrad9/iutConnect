import { v } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  internalQuery,
  action,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  USER_FUNCTIONS,
  UserFunctionType,
} from "../src/components/utils/const/user-functions";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
// Définition des types de permissions
type UserPermission =
  | "COMMENT"
  | "LIKE"
  | "CREATE_GROUP"
  | "CREATE_POST_IN_GROUP"
  | "CREATE_EVENT"
  | "CREATE_POST"
  | "CREATE_USER"
  | "ALL";

/**
 * Recherche des utilisateurs par nom, prénom ou email
 * Utilise l'indexation Convex pour des performances optimisées
 */
export const selectCollaborators = query({
  args: {
    searchQuery: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) return null;

    const limit = args.limit || 20;
    const searchTerm = args.searchQuery?.toLowerCase().trim();

    if (!searchTerm) {
      // Retourner tous les utilisateurs si aucun terme de recherche n'est fourni
      const users = await ctx.db.query("users").take(limit);
      return (
        users.map((user) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePicture,
          email: user.email,
        })) || []
      ).filter((user) => user.id !== userId);
    }

    // Recherche sur le champ email
    const emailResults = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) => q.search("email", searchTerm))
      .collect();
    // Recherche sur le prénom
    const firstNameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_firstName", (q) =>
        q.search("firstName", searchTerm)
      )
      .collect();

    // Recherche sur le nom
    const lastNameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_lastName", (q) =>
        q.search("lastName", searchTerm)
      )
      .collect();

    // Fusionner les résultats et supprimer les doublons (par _id)
    const allResults = [
      ...emailResults,
      ...firstNameResults,
      ...lastNameResults,
    ];
    const uniqueResults = Object.values(
      allResults.reduce(
        (acc, user) => {
          acc[user._id] = user;
          return acc;
        },
        {} as Record<Id<"users">, (typeof allResults)[number]>
      )
    );

    return Promise.all(
      uniqueResults
        .map((user) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePicture,
          email: user.email,
        }))
        .filter((user) => user.id !== userId) || []
    );
  },
});

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
/**
 * Récupérer un utilisateur à partir de son matricule
 */
export const getUserByRegistrationNumber = internalQuery({
  args: { registrationNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_registrationNumber", (q) =>
        q.eq("registrationNumber", args.registrationNumber)
      )
      .first();
  },
});

/**
 * Récupère un utilisateur à partir de son email
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

/**
 * Vérifie si un email ou un matricule existe déjà
 */
export const checkUserExists = query({
  args: {
    email: v.string(),
    registrationNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Vérifier l'email
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // Vérifier le matricule
    const userByRegistrationNumber = await ctx.db
      .query("users")
      .withIndex("by_registrationNumber", (q) =>
        q.eq("registrationNumber", args.registrationNumber)
      )
      .first();

    return {
      emailExists: !!userByEmail,
      registrationNumberExists: !!userByRegistrationNumber,
    };
  },
});

/**
 * Liste tous les utilisateurs (pour les administrateurs)
 */
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) return null;
    // recuperer les images du storage convex
    const profilePicture = user.profilePicture
      ? await ctx.storage.getUrl(user.profilePicture as Id<"_storage">)
      : undefined;
    const coverPhoto = user.coverPhoto
      ? await ctx.storage.getUrl(user.coverPhoto as Id<"_storage">)
      : undefined;
    // Exclure le password et le matricule
    const { password, registrationNumber, ...userWithoutSensitiveData } = user;
    return {
      ...userWithoutSensitiveData,
      profilePicture,
      coverPhoto,
    };
  },
});

/**
 * Get user's personal information for profile editing
 * Only returns fields that can be displayed or edited in profile
 */
/**
 * Récupère les informations personnelles de l'utilisateur connecté pour l'édition du profil
 * Inclut les données de base, les réseaux sociaux, les compétences, centres d'intérêt,
 * formations et expériences professionnelles
 */
export const getUserPersonalInformation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not found");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not authenticated");
    }
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username || null,
      phoneNumber: user.phoneNumber || null,
      isPhoneNumberHidden: user.isPhoneNumberHidden || false,
      bio: user.bio || null,
      town: user.town || null,
      address: user.address || null,
      fonction: user.fonction,
      fieldOfStudy: user.fieldOfStudy || null,
      classroom: user.classroom || null,
      socialNetworks: user.socialNetworks || [],
      skills: user.skills || [],
      interests: user.interests || [],
      education: user.education || [],
      workExperience: user.workExperience || [],
      role: user.role,
    };
  },
});

/**
 * Get user's profile and cover images
 */
export const getUserImages = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userImages: {
      profilePicture: string | null;
      coverPhoto: string | null;
    } = {
      profilePicture: null,
      coverPhoto: null,
    };
    // Retourner les urls à partir des Id de storage
    if (user.profilePicture) {
      userImages.profilePicture = await ctx.storage.getUrl(
        user.profilePicture as Id<"_storage">
      );
    }
    if (user.coverPhoto) {
      userImages.coverPhoto = await ctx.storage.getUrl(
        user.coverPhoto as Id<"_storage">
      );
    }
    return userImages;
  },
});

/**
 * Update user's personal information
 */
/**
 * Mise à jour des informations personnelles de l'utilisateur
 * Gère les champs de base, réseaux sociaux, compétences, centres d'intérêt,
 * formations et expériences professionnelles
 */
export const updateUserPersonalInfo = mutation({
  args: {
    username: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    isPhoneNumberHidden: v.optional(v.boolean()),
    town: v.optional(v.string()),
    address: v.optional(v.string()),
    bio: v.optional(v.string()),
    socialNetworks: v.optional(
      v.array(
        v.object({
          network: v.string(),
          link: v.string(),
        })
      )
    ),
    profilePicture: v.optional(v.string()),
    coverPhoto: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    education: v.optional(
      v.array(
        v.object({
          institution: v.string(),
          diploma: v.string(),
          startDate: v.number(),
          endDate: v.optional(v.number()),
        })
      )
    ),
    workExperience: v.optional(
      v.array(
        v.object({
          company: v.string(),
          jobTitle: v.string(),
          startDate: v.number(),
          endDate: v.optional(v.number()),
          location: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Construire l'objet de mise à jour avec seulement les champs fournis
    const update: any = {};

    // Vérifier chaque champ et l'ajouter à l'objet de mise à jour s'il est défini
    if (args.username !== undefined) update.username = args.username;
    if (args.phoneNumber !== undefined) update.phoneNumber = args.phoneNumber;
    if (args.isPhoneNumberHidden !== undefined)
      update.isPhoneNumberHidden = args.isPhoneNumberHidden;
    if (args.town !== undefined) update.town = args.town;
    if (args.address !== undefined) update.address = args.address;
    if (args.bio !== undefined) update.bio = args.bio;
    if (args.socialNetworks !== undefined)
      update.socialNetworks = args.socialNetworks;
    if (args.profilePicture !== undefined)
      update.profilePicture = args.profilePicture;
    if (args.coverPhoto !== undefined) update.coverPhoto = args.coverPhoto;
    if (args.skills !== undefined) update.skills = args.skills;
    if (args.interests !== undefined) update.interests = args.interests;
    if (args.education !== undefined) update.education = args.education;
    if (args.workExperience !== undefined)
      update.workExperience = args.workExperience;

    update.updatedAt = Date.now();

    // Mettre à jour l'utilisateur
    await ctx.db.patch(user._id, update);

    return { success: true };
  },
});

/**
 * Update user's profile picture
 */
export const updateUserProfileImage = mutation({
  args: {
    profilePicture: v.optional(v.string()),
    coverPhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not authenticated");
    }

    const update: any = {
      updatedAt: Date.now(),
    };

    if (args.profilePicture !== undefined) {
      update.profilePicture = args.profilePicture;
    }

    if (args.coverPhoto !== undefined) {
      update.coverPhoto = args.coverPhoto;
    }

    await ctx.db.patch(user._id, update);

    return { success: true };
  },
});

/**
 * Delete old file from storage
 */
export const deleteOldUserImage = action({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Supprimer l'image du stockage Convex
      await ctx.storage.delete(args.storageId);
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return { success: false, error: "Échec de la suppression de l'image" };
    }
  },
});

/**
 * Recherche des utilisateurs pour les ajouter comme membres d'un groupe
 * Utilise l'indexation Convex pour des performances optimisées
 */
export const getMembersForAddGroup = query({
  args: {
    searchQuery: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    const limit = args.limit || 20;
    const searchTerm = args.searchQuery?.toLowerCase().trim();

    if (!searchTerm) {
      // Retourner quelques utilisateurs récents si aucun terme de recherche
      /* const users = await ctx.db
        .query("users")
        .filter((q) => q.neq(q.field("_id"), userId))
        .order("desc")
        .take(limit);

      return users.map((user) => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName}`,
        email: user.email,
      })); */
      // Je préfère pour l'instant retourner un tableau vide
      return [];
    }

    // Recherche sur le champ email
    const emailResults = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) => q.search("email", searchTerm))
      .filter((q) => q.neq(q.field("_id"), userId as Id<"users">))
      .take(limit);

    // Recherche sur le prénom
    const firstNameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_firstName", (q) =>
        q.search("firstName", searchTerm)
      )
      .filter((q) => q.neq(q.field("_id"), userId as Id<"users">))
      .collect();

    // Recherche sur le nom
    const lastNameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_lastName", (q) =>
        q.search("lastName", searchTerm)
      )
      .filter((q) => q.neq(q.field("_id"), userId as Id<"users">))
      .collect();

    // Fusionner les résultats et supprimer les doublons
    const allResults = [
      ...emailResults,
      ...firstNameResults,
      ...lastNameResults,
    ];

    const uniqueResults = Object.values(
      allResults.reduce(
        (acc, user) => {
          acc[user._id] = user;
          return acc;
        },
        {} as Record<Id<"users">, (typeof allResults)[number]>
      )
    );

    return uniqueResults.map((user) => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName}`,
      email: user.email,
    }));
  },
});

/**
 * Récupère les membres d'un groupe pour l'affichage des avatars
 * @param groupId - ID du groupe
 * @param limit - Nombre maximum de membres à retourner
 */
export const getGroupMembers = query({
  args: {
    groupId: v.id("forums"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const limit = args.limit || 5;
    const totalCount = group.members ? group.members.length : 0;

    // Si pas de membres, retourner un tableau vide
    if (!group.members || group.members.length === 0) {
      return { members: [], totalCount: 0 };
    }

    // Récupérer les informations des membres
    const memberUsers = await Promise.all(
      group.members.slice(0, limit).map(async (memberId) => {
        const user = await ctx.db.get(memberId);
        if (!user) return null;

        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePicture
            ? await ctx.storage.getUrl(user.profilePicture as Id<"_storage">)
            : null,
        };
      })
    );

    return {
      members: memberUsers.filter(Boolean),
      totalCount,
    };
  },
});
