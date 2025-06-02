import { z } from "zod";

// Schéma de validation pour un post simple
export const postFormSchema = z
  .object({
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
  })
  .refine(
    (data) => data.content || (data.attachments && data.attachments.length > 0),
    {
      message: "Le contenu ou au moins une image est requis",
      path: ["content"],
    }
  );

export type PostFormValues = z.infer<typeof postFormSchema>;
