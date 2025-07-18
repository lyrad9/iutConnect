import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

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
export function getInitials(name: string): string {
  if (!name) return "??";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  // Prendre la première lettre du premier et du dernier nom
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getEventTimeTimestamp(dateTs: number, time?: string | null): number {
  const dt = new Date(dateTs);
  if (time) {
    const [h, m] = time.split(":").map(Number);
    dt.setHours(h, m, 0, 0); // règle heures/minutes localement :contentReference[oaicite:1]{index=1}
  } else {
    dt.setHours(0, 0, 0, 0); // par défaut : minuit local
  }
  return dt.getTime();
}

export function getEventEndTimestamp(event: {
  startDate: number;
  startTime?: string | null;
  endDate?: number;
  endTime?: string | null;
}): number {
  if (event.endDate != null) {
    return getEventTimeTimestamp(event.endDate, event.endTime ?? null);
  }
  return getEventTimeTimestamp(event.startDate, event.startTime ?? null);
}
/**
 * Formate une date d'événement en fonction de critères spécifiques
 * @param startDate Date de début de l'événement
 * @param startTime Heure de début
 * @param endTime Heure de fin (optionnelle)
 * @returns Texte formaté décrivant la date et l'heure, et si l'événement est en direct
 */
export function formatEventDate(
  startDate: number | Date,
  startTime: string,
  endDate?: number | Date | null,
  endTime?: string | null
): { text: string; isLive: boolean } {
  // Créer les objets Date pour le début et la fin
  const startDateObj = new Date(startDate);
  const endDateObj = endDate != null ? new Date(endDate) : startDateObj;

  const now = new Date();

  // Créer les DateTime complets (date + heure)
  const startDateTime = createDateWithTime(startDateObj, startTime);

  // Déterminer la Date de fin + heure
  let endDateTime: Date;

  if (endDate != null) {
    // Fin sur un autre jour (ou le même)
    if (endTime) {
      // Heure de fin définie
      endDateTime = createDateWithTime(endDateObj, endTime);
    } else {
      // Pas d'heure de fin : se termine à minuit du jour de fin
      const midnightEnd = new Date(endDateObj);
      midnightEnd.setHours(24, 0, 0, 0);
      endDateTime = midnightEnd;
    }
  } else if (endTime) {
    // Même jour, heure de fin fournie
    endDateTime = createDateWithTime(startDateObj, endTime);
  } else {
    // Pas de date/heure de fin : se termine à minuit du jour de début
    const midnightStart = new Date(startDateObj);
    midnightStart.setHours(24, 0, 0, 0);
    endDateTime = midnightStart;
  }

  // Déterminer si l'événement est en cours
  const isLive = isWithinInterval(now, {
    start: startDateTime,
    end: endDateTime,
  });

  // Si en cours, priorité à l'affichage "En cours"
  if (isLive) {
    return { text: "En cours", isLive: true };
  }

  // Gestion des cas où début et fin sont le même jour
  const sameDay =
    startDateObj.getFullYear() === endDateObj.getFullYear() &&
    startDateObj.getMonth() === endDateObj.getMonth() &&
    startDateObj.getDate() === endDateObj.getDate();

  // Cas : événement d'un seul jour (même jour)
  if (sameDay) {
    const formattedDate = isToday(startDateObj)
      ? "Aujourd'hui"
      : isTomorrow(startDateObj)
        ? "Demain"
        : format(startDateObj, "dd MMMM yyyy", { locale: fr });

    return {
      text: formatTimeRangeText(formattedDate, startTime, endTime),
      isLive: false,
    };
  }

  // Cas : événement sur plusieurs jours
  // Inclure le jour de la semaine dans le rendu
  const formattedStartDate = format(startDateObj, "EEEE d MMMM yyyy", {
    locale: fr,
  });
  const formattedEndDate = format(endDateObj, "EEEE d MMMM yyyy", {
    locale: fr,
  });

  let text: string;
  text = `${formattedStartDate} au ${formattedEndDate}`;

  return { text, isLive: false };
}

/**
 * Crée un objet Date avec une heure spécifique
 */
function createDateWithTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate;
}

export const formattedTime = (startTime: string, endTime?: string) => {
  if (endTime) {
    return `${startTime} : ${endTime}`;
  }
  return `à partir de ${startTime}`;
};

/**
 * Ajoute des heures à une date
 */
function addHours(date: Date, hours: number): Date {
  const newDate = new Date(date);
  newDate.setHours(date.getHours() + hours);
  return newDate;
}

/**
 * Formate le texte avec la plage horaire
 */
function formatTimeRangeText(
  prefix: string,
  startTime: string,
  endTime?: string | null
): string {
  if (endTime) {
    return `${prefix}`;
  } else {
    return `${prefix}`;
  }
}

/**
 * Vérifie si un événement est passé
 * @param startDate Date de début de l'événement
 * @param startTime Heure de début (obligatoire)
 * @returns true si l'événement est passé
 */
export function isEventPast(
  startDate: number | Date,
  startTime: string
): boolean {
  const date = new Date(startDate);
  const eventDateTime = createDateWithTime(date, startTime);
  return isPast(eventDateTime);
}

/**
 * Formatte une date pour l'affichage
 * @param date Date à formater
 * @returns Date formatée
 */
export function formatDate(date: Date | number): string {
  return format(new Date(date), "dd MMM yyyy", { locale: fr });
}
