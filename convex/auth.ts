import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { api, internal } from "./_generated/api";
import { MutationCtx } from "./_generated/server";
import CustomProfile from "./CustomProfile";
import { ConvexError, v } from "convex/values";
import { redirect } from "next/navigation";
import { actionGeneric } from "convex/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomProfile,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  jwt: {
    durationMs: 1000 * 60 * 60 * 24 * 30, // JWT valide 30 jours
  },
  session: {
    inactiveDurationMs: 1000 * 60 * 60 * 24 * 30, // Session inactive max 30 jours
    totalDurationMs: 1000 * 60 * 60 * 24 * 365, // Session totale max 1 an
  },

  callbacks: {
    async createOrUpdateUser(ctx: MutationCtx, args) {
      const { existingUserId, type, provider, profile } = args;
      if (existingUserId) {
        return existingUserId;
      }
      if (provider.id === "google") {
        const existingUser = await ctx.runQuery(api.users.getUserByEmail, {
          email: args.profile.email as string,
        });
        if (existingUser) {
          return existingUser._id;
        }
        throw new Error("veuiller vous inscrire avec votre email");
      }
      if (provider.id === "custom-profile") {
        const {
          registrationNumber,
          password,
          email,
          firstName,
          lastName,
          fieldOfStudy,
          fonction,
          classroom,
          phoneNumber,
        } = profile;
        // Vérifier si l'email existe déjà dans la base de données
        const existingUser = await ctx.runQuery(api.users.getUserByEmail, {
          email: email as string,
        });
        if (existingUser) {
          return existingUser._id;
        }
        // Créer un nouvel utilisateur
        // L'utilisateur est un étudiant
        if (fonction === "Etudiant") {
          return ctx.db.insert("users", {
            email: email as string,
            registrationNumber: registrationNumber as string,
            password: password as string,
            lastName: lastName as string,
            firstName: args.profile.firstName as string,
            fieldOfStudy: fieldOfStudy as string,
            classroom: classroom as string,
            interests: [],
            socialNetworks: [],
            phoneNumber: phoneNumber as string,
            permissions: ["COMMENT", "LIKE", "CREATE_POST_IN_GROUP"],
            fonction: "Etudiant",
            role: "USER",
            isOnline: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
        return ctx.db.insert("users", {
          email: email as string,
          registrationNumber: registrationNumber as string,
          password: password as string,
          lastName: lastName as string,
          firstName: args.profile.firstName as string,
          interests: [],
          socialNetworks: [],
          phoneNumber: phoneNumber as string,
          permissions: ["COMMENT", "LIKE", "CREATE_POST_IN_GROUP"],
          fonction: fonction as string,
          role: "USER",
          isOnline: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    },
  },
});
/* export const signIn = actionGeneric({
  args: v.any(),
  async handler(ctx, args) {
    try {
      return await ctx.runAction(api.auth.authSignIn, args);
    } catch (err) {
      if (err instanceof ConvexError) {
        return {
          redirect: `http://localhost:3000/sign-up?error=${encodeURI(err.data ?? "Convex error")}`,
        };
      }
      return {
        redirect: `http://localhost:3000/sign-up?error=${encodeURI("Something went wrong")}`,
      };
    }
  },
}); */
