import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { corsRouter } from "convex-helpers/server/cors";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
const http = httpRouter();

auth.addHttpRoutes(http);

// Envelopper avec corsRouter pour appliquer CORS à toutes les routes
const cors = corsRouter(http, {
  allowedOrigins: ["*"], // ou spécifiez votre domaine
  allowedHeaders: ["Content-Type", "Digest", "Authorization"],
  browserCacheMaxAge: 86400,
  // Ajoutez "Authorization"
  // methods: ["GET", "POST", "PUT", "DELETE"],
});

// Exemple de route pour l'upload de fichiers
cors.route({
  path: "/uploadPostImagesInHome",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        {
          status: 405,
        }
      );
    }
    // Extraire les données du formulaire

    const formData = await request.formData();
    const content = formData.get("content") as string;
    const attachments = formData.getAll("attachments") as File[];

    const attachmentIds: string[] = [];

    // Stocker chaque image
    try {
      for (const attachment of attachments) {
        const storageId = await ctx.storage.store(attachment);
        attachmentIds.push(storageId);
      }

      // Sauvegarder le post avec les images
      const postId = await ctx.runMutation(api.posts.createPostInHome, {
        content,
        attachmentIds,
      });

      return new Response(
        JSON.stringify({ success: true, postId })
        /* , {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      } */
      );
    } catch (error: any) {
      console.error("Erreur lors de la création du post:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
        }),
        {
          status: 500,
        }
      );
    }
  }),
});

export default http;
