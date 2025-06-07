import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";

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
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_APP_URL
          : "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/send-registration-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
