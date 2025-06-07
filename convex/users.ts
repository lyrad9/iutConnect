import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  USER_FUNCTIONS,
  UserFunctionType,
} from "../src/components/utils/const/user-functions";
import { sendUserRegistrationApprovedEmail } from "@/app/(auth)/register/sendUserRegistrationApprovedEmail";
import { generatePassword } from "@/src/lib/utils";
import { internal } from "./_generated/api";
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
 * Récupère un utilisateur par son ID
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
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
 * Enregistre un nouvel utilisateur avec le statut "pending"
 */
export const registerUser = mutation({
  args: {
    lastName: v.string(),
    firstName: v.string(),
    email: v.string(),
    registrationNumber: v.string(),
    phoneNumber: v.string(),
    function: v.string(),
    department: v.optional(v.string()),
    classroom: v.optional(v.string()),
    level: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Vérifier si l'utilisateur existe déjà
    const { emailExists, registrationNumberExists } = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect()
      .then((users) => ({
        emailExists: users.length > 0,
        registrationNumberExists: false,
      }));

    if (emailExists) {
      throw new Error("Cet email est déjà utilisé.");
    }

    // Vérifier le matricule
    const registrationNumberCheck = await ctx.db
      .query("users")
      .withIndex("by_registrationNumber", (q) =>
        q.eq("registrationNumber", args.registrationNumber)
      )
      .collect();

    if (registrationNumberCheck.length > 0) {
      throw new Error("Ce matricule est déjà utilisé.");
    }

    // Vérifier que la fonction est valide
    // Vérification simplifiée - nous acceptons toute fonction valide comme chaîne
    if (!Object.values(USER_FUNCTIONS).includes(args.function as any)) {
      throw new Error("Fonction utilisateur invalide.");
    }

    // Définir les permissions de base selon la fonction
    const permissions: UserPermission[] =
      args.function === USER_FUNCTIONS.STUDENT
        ? ["COMMENT", "LIKE"]
        : ["COMMENT", "LIKE", "CREATE_GROUP"];

    // Créer le nouvel utilisateur
    const userId = await ctx.db.insert("users", {
      lastName: args.lastName,
      firstName: args.firstName,
      email: args.email,
      registrationNumber: args.registrationNumber,
      phoneNumber: args.phoneNumber,
      function: args.function as UserFunctionType,
      fieldOfStudy: args.department,
      classroom: args.classroom,
      level: args.level,
      status: "pending",
      role: "USER",
      permissions,
      isOnline: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Envoyer l'email de confirmation d'inscription
    await ctx.scheduler.runAfter(
      0,
      internal.authActions.sendRegistrationConfirmationEmail,
      {
        user: {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
        },
      }
    );

    return userId;
  },
});

/**
 * Mutation interne appelée par approveUserAction pour approuver un utilisateur
 * Le hashage du mot de passe est fait dans l'action
 */
export const approveUserMutation = internalMutation({
  args: {
    userId: v.id("users"),
    hashedPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Récupérer l'utilisateur
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    // Vérifier que l'utilisateur est en attente
    if (user.status !== "pending") {
      throw new Error("Cet utilisateur a déjà été traité.");
    }

    // Mettre à jour l'utilisateur avec le mot de passe déjà haché
    await ctx.db.patch(args.userId, {
      status: "active",
      password: args.hashedPassword,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Cette fonction n'est plus recommandée, utilisez approveUserAction à la place
 * (conservée pour compatibilité, mais marquée comme obsolète)
 */
export const approveUser = mutation({
  args: {
    userId: v.id("users"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Récupérer l'utilisateur
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    // Vérifier que l'utilisateur est en attente
    if (user.status !== "pending") {
      throw new Error("Cet utilisateur a déjà été traité.");
    }

    // Juste stocker le mot de passe en texte brut (NON SÉCURISÉ!)
    // Uniquement pour compatibilité temporaire, à remplacer par approveUserAction
    await ctx.db.patch(args.userId, {
      status: "active",
      password: args.password, // Non sécurisé! Utilisez approveUserAction à la place
      updatedAt: Date.now(),
    });

    console.warn(
      "ATTENTION: Utilisation de approveUser sans hachage de mot de passe. Utilisez approveUserAction à la place."
    );
    return { success: true };
  },
});

/**
 * Rejette un utilisateur en attente et le supprime
 */
export const rejectUser = mutation({
  args: {
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Récupérer l'utilisateur
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    // Vérifier que l'utilisateur est en attente
    if (user.status !== "pending") {
      throw new Error("Cet utilisateur a déjà été traité.");
    }

    // Mettre à jour le statut de l'utilisateur à "inactive"
    await ctx.db.patch(args.userId, {
      status: "inactive",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Liste les utilisateurs en attente de validation
 */
export const getPendingUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
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
