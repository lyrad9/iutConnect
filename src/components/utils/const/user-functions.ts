// Définition des fonctions d'utilisateur
export const USER_FUNCTIONS = {
  STUDENT: "Etudiant",
  PROFESSOR: "Professeur",
  ACCOUNTANT: "Comptable",
  HR: "Ressources Humaines",
  OTHER: "Autre",
} as const;

export type UserFunctionType =
  (typeof USER_FUNCTIONS)[keyof typeof USER_FUNCTIONS];

// Définition des niveaux d'étude
export const STUDY_LEVELS = {
  LEVEL_I: "I",
  LEVEL_II: "II",
  LEVEL_III: "III",
  LEVEL_IV: "IV",
} as const;

export type StudyLevelType = (typeof STUDY_LEVELS)[keyof typeof STUDY_LEVELS];

// Définition des filières
export const DEPARTMENTS = {
  GL: {
    code: "GL",
    name: "Génie Logiciel",
    classes: {
      [STUDY_LEVELS.LEVEL_I]: ["GL1A", "GL1B", "GL1C"],
      [STUDY_LEVELS.LEVEL_II]: ["GL2A", "GL2B", "GL2C"],
      [STUDY_LEVELS.LEVEL_III]: ["GL3A", "GL3B", "GL3C"],
      [STUDY_LEVELS.LEVEL_IV]: ["GL4A", "GL4B", "GL4C"],
    },
  },
  ASR: {
    code: "ASR",
    name: "Administration Sécurité et Réseau",
    classes: {
      [STUDY_LEVELS.LEVEL_I]: ["ASR1A", "ASR1B", "ASR1C"],
      [STUDY_LEVELS.LEVEL_II]: ["ASR2A", "ASR2B", "ASR2C"],
      [STUDY_LEVELS.LEVEL_III]: ["ASR3A", "ASR3B", "ASR3C"],
      [STUDY_LEVELS.LEVEL_IV]: ["ASR4A", "ASR4B", "ASR4C"],
    },
  },
  MGT: {
    code: "MGT",
    name: "Management",
    classes: {
      [STUDY_LEVELS.LEVEL_I]: ["MGT1A", "MGT1B"],
      [STUDY_LEVELS.LEVEL_II]: ["MGT2A", "MGT2B"],
      [STUDY_LEVELS.LEVEL_III]: ["MGT3A", "MGT3B"],
      [STUDY_LEVELS.LEVEL_IV]: ["MGT4A", "MGT4B"],
    },
  },
  COM: {
    code: "COM",
    name: "Communication",
    classes: {
      [STUDY_LEVELS.LEVEL_I]: ["COM1A", "COM1B"],
      [STUDY_LEVELS.LEVEL_II]: ["COM2A", "COM2B"],
      [STUDY_LEVELS.LEVEL_III]: ["COM3A", "COM3B"],
      [STUDY_LEVELS.LEVEL_IV]: ["COM4A", "COM4B"],
    },
  },
} as const;

export type DepartmentCode = keyof typeof DEPARTMENTS;

// Fonction utilitaire pour obtenir toutes les classes d'un niveau donné
export function getClassesByLevel(level: StudyLevelType): string[] {
  const allClasses: string[] = [];

  Object.values(DEPARTMENTS).forEach((department) => {
    allClasses.push(...department.classes[level]);
  });

  return allClasses;
}

// Fonction utilitaire pour obtenir la filière à partir d'une classe
export function getDepartmentFromClass(
  className: string
): DepartmentCode | null {
  const departmentCode = className.substring(0, className.length - 2);

  return (
    (Object.keys(DEPARTMENTS).find(
      (code) => code === departmentCode
    ) as DepartmentCode) || null
  );
}

// Fonction utilitaire pour obtenir le niveau à partir d'une classe
export function getLevelFromClass(className: string): StudyLevelType | null {
  const levelNumber = className.charAt(className.length - 2);

  switch (levelNumber) {
    case "1":
      return STUDY_LEVELS.LEVEL_I;
    case "2":
      return STUDY_LEVELS.LEVEL_II;
    case "3":
      return STUDY_LEVELS.LEVEL_III;
    case "4":
      return STUDY_LEVELS.LEVEL_IV;
    default:
      return null;
  }
}
