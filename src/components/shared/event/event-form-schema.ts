import { z } from "zod";
import { imageFileValidator } from "@/src/lib/image-file-validator";

// Schéma de validation pour un événement
export const eventFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  startDate: z.string().min(1, "La date de début est requise"),
  startTime: z.string(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z
    .object({
      type: z.enum(["on-site", "online"]),
      value: z
        .string({ required_error: "L'adresse ou le lien est requis" })
        .min(1, "L'adresse ou le lien est requis"),
    })
    .refine(
      (data) => {
        // Si type n'est pas "online", la validation passe toujours
        if (data.type !== "online") return true;

        // Si type est "online", vérifier que c'est une URL valide
        try {
          new URL(data.value);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "L'adresse ou le lien est invalide",
        path: ["value"],
      }
    )
    .refine(
      (data) => {
        // Si type n'est pas "online", la validation passe toujours
        if (data.type !== "online") return true;

        // Si type est "online", vérifier que l'URL commence par https://
        return data.value.includes("https://");
      },
      {
        message: "L'adresse ou le lien doit commencer par https://",
        path: ["value"],
      }
    ),
  eventType: z.string().min(1, "Le type d'événement est requis"),
  collaborators: z.array(z.string()),
  photo: imageFileValidator.optional(),
  allowsParticipants: z.boolean().default(true),
  target: z.string().optional(),
  groupId: z.string().optional(), // Ajout du groupId optionnel
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
