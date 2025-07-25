import { z } from "zod";
import { GROUP_MAIN_CATEGORIES } from "@/src/components/utils/const/group-main-categories";
import { imageFileValidator } from "@/src/lib/image-file-validator";

// Schéma de validation pour le formulaire de création de groupe
export const groupFormSchema = z.object({
  // Nom du groupe (requis, entre 3 et 50 caractères)
  name: z
    .string({ required_error: "Le nom du groupe est requis" })
    .min(3, { message: "Le nom du groupe doit contenir au moins 3 caractères" })
    .max(50, {
      message: "Le nom du groupe ne peut pas dépasser 50 caractères",
    }),

  // Description brève (requis, max 100 mots)
  description: z
    .string({ required_error: "La description est requise" })
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(
      500,
      "La description ne peut pas dépasser 500 caractères (environ 100 mots)"
    )
    .refine(
      (value) => {
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 100;
      },
      {
        message: "La description ne peut pas dépasser 100 mots",
      }
    ),

  // Description détaillée (optionnel, max 500 mots)
  about: z
    .string()
    .max(
      2500,
      "La description détaillée ne peut pas dépasser 2500 caractères (environ 500 mots)"
    )
    .refine(
      (value) => {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 500;
      },
      {
        message: "La description détaillée ne peut pas dépasser 500 mots",
      }
    )
    .optional(),

  // Centres d'intérêt (entre 1 et 5)
  interests: z
    .array(z.string())
    .min(1, "Veuillez ajouter au moins un centre d'intérêt")
    .max(5, "Vous ne pouvez pas ajouter plus de 5 centres d'intérêt"),

  // Catégorie principale
  mainCategory: z.enum(
    ["Academique", "Technologique", "Sport", "Social", "Autre"],
    { message: "La catégorie est requise" }
  ),

  // Confidentialité
  confidentiality: z.enum(["public", "private"]),

  // Visibilité
  visibility: z.enum(["visible", "masked"]),

  // Approbation des publications
  requiresPostApproval: z.boolean().default(true),

  // Image de profil qui est un file (optionnel)
  profilePicture: imageFileValidator.optional(),

  // Image de couverture (optionnel)
  coverPhoto: imageFileValidator.optional(),

  // Membres (optionnel)
  members: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        email: z.string().optional(),
      })
    )
    .default([]),
});

// Type dérivé du schéma
export type GroupFormValues = z.infer<typeof groupFormSchema>;

// Valeurs par défaut pour le formulaire
export const defaultGroupFormValues: Partial<GroupFormValues> = {
  name: undefined,
  description: undefined,
  about: undefined,
  mainCategory: undefined,
  confidentiality: "public",
  visibility: "visible",
  requiresPostApproval: true,
  members: [],
  interests: [],
};
