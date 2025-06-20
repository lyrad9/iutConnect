export const GROUP_MAIN_CATEGORIES = [
  "Academique",
  "Technologique",
  "Sport",
  "Social",
  "Autre",
];

/* export type GroupMainCategoryType =
  (typeof GROUP_MAIN_CATEGORIES)[keyof typeof GROUP_MAIN_CATEGORIES]; */

export type GroupMainCategoryType = (typeof GROUP_MAIN_CATEGORIES)[number];
