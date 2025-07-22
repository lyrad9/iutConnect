import React from "react";
import { BookmarksLayout } from "./BookmarksLayout";
import { getRequiredUser } from "@/src/lib/auth-server";

export default async function FavoritesPage() {
  await getRequiredUser();
  return (
    <div className=" px-4 py-6 md:py-8 min-h-full">
      <BookmarksLayout />
    </div>
  );
}

export const metadata = {
  title: "Favoris | IUT Social",
  description: "Vos publications sauvegardées",
};
