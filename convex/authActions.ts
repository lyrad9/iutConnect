import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { signIn } from "./auth";
import { api, internal } from "./_generated/api";
/**
 * Action pour authentifier un utilisateur avec magic link après vérification des identifiants universitaires
 */
export const universityAuthAction = action({
  args: {
    matricule: v.string(),
    password: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // 1. Vérifier si l'utilisateur existe déjà dans notre base de données à partir du matricule
      const existingUser = await ctx.runQuery(
        internal.users.getUserByRegistrationNumber,
        {
          registrationNumber: args.matricule,
        }
      );
      if (existingUser) {
        throw new Error("Cet utilisateur existe déjà");
      }

      const { matricule, password, email } = args;

      const baseUrl =
        process.env.CONVEX_ENV === "development"
          ? "http://localhost:3000"
          : (process.env.SITE_URL as string);
      // Appel à l'API de vérification des identifiants universitaires
      const verifyResponse = await fetch(`${baseUrl}/api/verify-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
        },
        body: JSON.stringify({
          registrationNumber: matricule,
          password,
        }),
      });
      console.log(verifyResponse);

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(
          error.message || "Échec de la vérification des identifiants"
        );
      }

      const userData = await verifyResponse.json();
      console.log("userData", userData);
      if (!userData.success) {
        throw new Error(
          userData.message || "Échec de la vérification des identifiants"
        );
      }

      // 2. Envoi du magic link
      const result = await ctx.runAction(api.auth.signIn, {
        provider: "custom-profile",
        params: {
          email: email,
          password: userData.user.password,
          registrationNumber: userData.user.registrationNumber,
          firstName: userData.user.firstName,
          lastName: userData.user.lastName,
          fonction: userData.user.fonction,
          fieldOfStudy: userData.user.fieldOfStudy ?? undefined,
          level: userData.user.level ?? undefined,
          classroom: userData.user.classroom ?? undefined,
          phoneNumber: userData.user.phoneNumber ?? undefined,
          flow: "signUp",
        },
      });

      return {
        success: true,
        message:
          "Un email avec un lien de connexion a été envoyé à votre adresse",
      };
    } catch (error: any) {
      console.error("Erreur lors de l'authentification:", error);
      return {
        success: false,
        message:
          error.message ||
          "Une erreur s'est produite lors de l'authentification",
      };
    }
  },
});

/**
 * Action pour envoyer un email de confirmation d'inscription
 */
export const sendRegistrationConfirmationEmail = internalAction({
  args: {
    user: v.object({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    try {
      // Construire l'URL de l'API en utilisant l'URL de déploiement ou localhost en développement
      const baseUrl =
        process.env.CONVEX_ENV === "development"
          ? "http://localhost:3000"
          : (process.env.SITE_URL as string);
      const response = await fetch(`${baseUrl}/api/send-registration-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ user: args.user }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to send email: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Error in sendRegistrationConfirmationEmail action:",
        error
      );
      throw error;
    }
  },
});
