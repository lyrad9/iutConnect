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
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  startDate: z.string().min(1, "La date de début est requise"),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.object({
    type: z.enum(["on-site", "online"]),
    //url
    value: z
      .string({ required_error: "L'adresse ou le lien est requis" })
      .min(1, "L'adresse ou le lien est requis")
      .url({ message: "L'adresse ou le lien est invalide" })
      .refine((url) => url.includes("https://"), {
        message: "L'adresse ou le lien doit commencer par https://",
      }),
  }),
  eventType: z.string().min(1, "Le type d'événement est requis"),
  collaborators: z.array(z.string()),
  photo: z.instanceof(File).optional(),
  allowsParticipants: z.boolean().default(true),
  target: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
