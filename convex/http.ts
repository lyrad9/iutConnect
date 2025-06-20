import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { corsRouter } from "convex-helpers/server/cors";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

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

// Nouvel endpoint combiné pour gérer à la fois l'image de profil et l'image de couverture
cors.route({
  path: "/uploadUserImages",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Vérifier la méthode de requête
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Méthode non autorisée" }),
        { status: 405 }
      );
    }

    // Vérifier l'authentification
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      /*  return new Response(
        JSON.stringify({ success: false, message: "Non autorisé" }),
        { status: 401 }
      ); */
      throw new ConvexError("Unauthorized");
    }

    try {
      const formData = await request.formData();
      console.log(formData);
      const profilePicture = (formData.get("profilePicture") as File) || null;
      const coverPhoto = (formData.get("coverPhoto") as File) || null;

      if (!profilePicture && !coverPhoto) {
        return new Response(
          JSON.stringify({ success: false, message: "Aucune image fournie" }),
          { status: 400 }
        );
      }

      const result: {
        success: boolean;
        profilePictureId?: string;
        coverPhotoId?: string;
        message?: string;
      } = { success: true };

      // Traiter l'image de profil si elle est présente
      if (profilePicture) {
        // Stocker la nouvelle image
        const profilePictureId = await ctx.storage.store(profilePicture);
        result.profilePictureId = profilePictureId;
      }

      // Traiter l'image de couverture si elle est présente
      if (coverPhoto) {
        // Stocker la nouvelle image
        const coverPhotoId = await ctx.storage.store(coverPhoto);
        result.coverPhotoId = coverPhotoId;
      }

      return new Response(JSON.stringify(result), {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } catch (error: any) {
      console.error("Échec du téléchargement des images:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message || "Échec du téléchargement des images",
        }),
        { status: 500 }
      );
    }
  }),
});

cors.route({
  path: "/uploadGroupImages",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Méthode non autorisée" }),
        { status: 405 }
      );
    }
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Unauthorized");
    }
    const user = await ctx.runQuery(api.users.getUserById, {
      userId: userId as Id<"users">,
    });
    if (!user) {
      throw new ConvexError("User not found");
    }
    // Vérifier les permissions de l'utilisateur (si nécessaire)
    if (
      !user.permissions.includes("CREATE_GROUP") &&
      user.role !== "SUPERADMIN" &&
      user.role !== "ADMIN"
    ) {
      throw new Error("You don't have permission to create a group");
    }

    const formData = await request.formData();
    const profilePicture = (formData.get("profilePicture") as File) || null;
    const coverPhoto = (formData.get("coverPhoto") as File) || null;

    if (!profilePicture && !coverPhoto) {
      return new Response(
        JSON.stringify({ success: false, message: "Aucune image fournie" }),
        { status: 400 }
      );
    }

    const result: {
      success: boolean;
      profilePictureId?: string;
      coverPhotoId?: string;
      message?: string;
    } = { success: true };

    if (profilePicture) {
      const profilePictureId = await ctx.storage.store(profilePicture);
      result.profilePictureId = profilePictureId;
    }

    if (coverPhoto) {
      const coverPhotoId = await ctx.storage.store(coverPhoto);
      result.coverPhotoId = coverPhotoId;
    }

    return new Response(JSON.stringify(result));
  }),
});

export default http;
