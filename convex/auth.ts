import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { api, internal } from "./_generated/api";
import { MutationCtx } from "./_generated/server";
import CustomProfile from "./CustomProfile";
import { ConvexError, v } from "convex/values";
import { redirect } from "next/navigation";
import { actionGeneric } from "convex/server";
import { Id } from "./_generated/dataModel";

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
    async createOrUpdateUser(
      ctx: MutationCtx,
      args: {
        existingUserId?: Id<"users"> | null;
        type: string;
        provider: { id: string };
        profile: Record<string, any>;
      }
    ): Promise<Id<"users">> {
      // ① on explicite le type de retour
      const { existingUserId, provider, profile } = args;

      if (existingUserId) {
        return existingUserId; // OK
      }

      // >>> Provider Google
      if (provider.id === "google") {
        const existingUser = await ctx.runQuery(api.users.getUserByEmail, {
          email: profile.email as string,
        });

        if (existingUser) {
          // Mettre d'abord à jour l'utilisateur
          await ctx.db.patch(existingUser._id, {
            updatedAt: Date.now(),
          });
          return existingUser._id; // ici _id est bien Id<"users">
        }
        if (profile.email === "mbakopngako@gmail.com") {
          return ctx.db.insert("users", {
            email: profile.email as string,
            firstName: profile.name as string,
            /*   profilePicture: profile.image as string, */
            role: "SUPERADMIN",
            permissions: ["ALL"],
            isOnline: true,
            createdAt: Date.now(),
          });
        }
        throw new Error("Veuillez vous inscrire d'abord avec votre email");
      }

      // >>> Provider Custom
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

        // Si l'email existe déjà
        const existingUser = await ctx.runQuery(api.users.getUserByEmail, {
          email: email as string,
        });
        if (existingUser) {
          return existingUser._id;
        }

        // Sinon on crée l'utilisateur
        const baseData = {
          email: email as string,
          registrationNumber: registrationNumber as string,
          password: password as string,
          lastName: lastName as string,
          firstName: firstName as string,
          interests: [] as string[],
          socialNetworks: [] as any[],
          phoneNumber: phoneNumber as string,
          permissions: ["COMMENT", "LIKE", "CREATE_POST_IN_GROUP"] as string[],
          role: "USER" as const,
          isOnline: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Étudiant ou autre fonction
        if (fonction === "Etudiant") {
          return ctx.db.insert("users", {
            ...baseData,
            fieldOfStudy: fieldOfStudy as string,
            classroom: classroom as string,
            fonction: "Etudiant",
          });
        } else {
          return ctx.db.insert("users", {
            ...baseData,
            fonction: fonction as string,
          });
        }
      }

      // ② on gère le cas "aucun provider connu" pour éviter un `undefined`
      throw new Error(`Provider non géré : ${provider.id}`);
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
