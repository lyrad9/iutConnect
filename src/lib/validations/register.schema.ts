import { z } from "zod";
import {
  DEPARTMENTS,
  STUDY_LEVELS,
  USER_FUNCTIONS,
} from "@/src/components/utils/const/user-functions";

// Validation du numéro de téléphone camerounais (9 chiffres) commencant par 6
const phoneRegex = /^(6)[0-9]{8}$/;

// Schéma commun pour tous les utilisateurs
const baseUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le prénom ne peut pas dépasser 50 caractères" }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
  email: z
    .string()
    .email({ message: "Adresse email invalide" })
    .refine((email) => email.includes("."), {
      message: "L'email doit contenir un point (.)",
    })
    .refine((email) => email.includes("@"), {
      message: "L'email doit contenir un arobase (@)",
    }),
  phoneNumber: z.string().regex(phoneRegex, {
    message:
      "Le numéro de téléphone doit être au format camerounais (9 chiffres commençant par 6)",
  }),
  registrationNumber: z
    .string()
    .min(5, { message: "Le matricule doit contenir au moins 5 caractères" })
    .max(20, { message: "Le matricule ne peut pas dépasser 20 caractères" }),
});

// Schéma spécifique pour les étudiants
export const studentSchema = z.object({
  ...baseUserSchema.shape,
  function: z.literal(USER_FUNCTIONS.STUDENT),
  level: z.enum(
    [
      STUDY_LEVELS.LEVEL_I,
      STUDY_LEVELS.LEVEL_II,
      STUDY_LEVELS.LEVEL_III,
      STUDY_LEVELS.LEVEL_IV,
    ],
    {
      errorMap: () => ({
        message: "Veuillez sélectionner un niveau d'étude valide",
      }),
    }
  ),
  department: z.enum(["GL", "ASR", "MGT", "COM"] as const, {
    errorMap: () => ({ message: "Veuillez sélectionner une filière valide" }),
  }),
  classroom: z.string().min(1, { message: "Veuillez sélectionner une classe" }),
});

// Schéma spécifique pour le personnel
export const staffSchema = z.object({
  ...baseUserSchema.shape,
  function: z.enum(
    [
      USER_FUNCTIONS.PROFESSOR,
      USER_FUNCTIONS.ACCOUNTANT,
      USER_FUNCTIONS.HR,
      USER_FUNCTIONS.OTHER,
    ],
    {
      errorMap: () => ({
        message: "Veuillez sélectionner une fonction valide",
      }),
    }
  ),
});

// Types inférés depuis les schémas Zod
export type StudentFormData = z.infer<typeof studentSchema>;
export type StaffFormData = z.infer<typeof staffSchema>;
