/* import { z } from "zod"; */
import { z } from "zod";

// Validateur personnalisé pour les fichiers
export const fileValidator = z
  .any()
  .refine((file) => file, {
    message: "Le fichier est requis",
  })
  .refine((file) => file instanceof File, {
    message: "Le fichier doit être valide",
  });

// Schéma de validation pour un post simple
export const postFormSchema = z
  .object({
    content: z.string().optional(),
    attachments: z
      .array(
        fileValidator
          .refine((file) => file.size <= 1024 * 1024, {
            message: "La taille de l'image doit être inférieure à 1Mo",
          })
          .refine(
            (file) =>
              !file?.type ||
              ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                file?.type
              ),
            {
              message:
                "Seuls les formats .jpg, .jpeg, .png et .webp sont acceptés.",
            }
          )
      )
      .max(10, { message: "Maximum 10 images autorisées" })
      .optional(),
  })
  .refine(
    (data) => data.content || (data.attachments && data.attachments.length > 0),
    {
      message: "Le contenu ou au moins une image est requis",
      path: ["content"],
    }
  );

export type PostFormValues = z.infer<typeof postFormSchema>;
