import { z } from "zod";

// Schéma de validation pour un événement
export const eventFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'événement est requis"),
  description: z.string().min(1, "La description est requise"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  location: z.object({
    type: z.enum(["onsite", "online"], {
      required_error: "Le type d'emplacement est requis",
    }),
    value: z.string().min(1, "L'emplacement est requis"),
  }),
  eventType: z.string().min(1, "Le type d'événement est requis"),
  collaborators: z.array(z.string()).optional().default([]),
  photo: z.string().min(1, "La photo est requise"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
