import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageFileValidator = z
  .instanceof(File, { message: "L'image est requise" })
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: `L’image ne doit pas dépasser ${MAX_IMAGE_SIZE / 1024 / 1024} Mo`,
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Formats autorisés : JPG, PNG, WebP",
  });
