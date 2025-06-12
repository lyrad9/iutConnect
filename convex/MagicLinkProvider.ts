import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
export const MagicLinkProvider = Email({
  id: "magic-link",
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  from: "IUT-social-university-network<mbakopngako@gmail.com>",
  async sendVerificationRequest({ identifier: email, provider, token, url }) {
    // Définis une API pour le processus d'envoi d'email
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_URL;
    try {
      const response = await fetch(`${baseUrl}/api/send-magic-link`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          url,
          token: token,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'envoi de l'email: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du magic link:", error);
      throw new Error("Échec de l'envoi du lien de connexion");
    }
  },
});
