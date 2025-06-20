import { z } from "zod";
// Validateur personnalisé pour les fichiers
const fileValidator = z
  .any()
  /*   .refine((file) => file, {
    message: "L'image est requise",
  }) */
  .refine((file) => file instanceof File, {
    message: "Le fichier doit être valide",
  });
// Schéma de validation pour un événement
export const eventFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'événement est requis"),
  description: z.string().min(1, "La description est requise"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  location: z.object({
    type: z
      .enum(["on-site", "online"], {
        required_error: "Le type d'emplacement est requis",
      })
      .refine((value) => value === "on-site" || value === "online", {
        message: "L'emplacement doit être soit sur place, soit en ligne",
      }),
    value: z.string().min(1, "L'emplacement est requis"),
  }),
  eventType: z.string().min(1, "Le type d'événement est requis"),
  collaborators: z.array(z.string()).optional().default([]),
  photo: fileValidator.refine((file) => file && file.size <= 2024 * 2024, {
    message: "La taille de l'image doit être inférieure à 2Mo",
  }),
  allowsParticipants: z.boolean().default(true),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
