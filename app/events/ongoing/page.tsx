import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { EventNavigation } from "../EventNavigation";
import CurrentEventsLayout from "./CurrentEventsLayout";

export const metadata = {
  title: "Événements en cours",
  description: "Découvrez les événements qui se déroulent en ce moment",
};

export default async function CurrentEventsPage() {
  await getRequiredUser();

  return (
    <div className="px-4 py-6 md:py-8 space-y-4">
      <EventNavigation currentPage="current" />
      <CurrentEventsLayout />
    </div>
  );
}
