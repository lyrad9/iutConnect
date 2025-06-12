import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un mot de passe aléatoire
 * @param length Longueur du mot de passe (défaut: 10)
 * @returns Mot de passe généré
 */
export function generatePassword(length: number = 10): string {
  const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijkmnopqrstuvwxyz";
  const numberChars = "23456789";
  const specialChars = "!@#$%^&*_-+=";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // S'assurer que le mot de passe a au moins un caractère de chaque type
  let password =
    getRandomChar(uppercaseChars) +
    getRandomChar(lowercaseChars) +
    getRandomChar(numberChars) +
    getRandomChar(specialChars);

  // Remplir le reste du mot de passe avec des caractères aléatoires
  for (let i = 4; i < length; i++) {
    password += getRandomChar(allChars);
  }

  // Mélanger les caractères pour éviter un schéma prévisible
  return shuffleString(password);
}

/**
 * Récupère un caractère aléatoire dans une chaîne
 */
function getRandomChar(characters: string): string {
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

/**
 * Mélange une chaîne de caractères
 */
function shuffleString(str: string): string {
  const array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

/**
 * Génère les initiales à partir d'un nom
 * @param name Nom complet
 * @returns Initiales (maximum 2 caractères)
 */
export function getInitialsFromName(name: string): string {
  if (!name) return "??";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  // Prendre la première lettre du premier et du dernier nom
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
