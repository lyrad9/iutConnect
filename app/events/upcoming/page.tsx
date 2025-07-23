import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { EventNavigation } from "../EventNavigation";
import UpcomingEventsLayout from "./UpcomingEventsLayout";

export const metadata = {
  title: "Événements à venir",
  description: "Découvrez les événements à venir prochainement",
};

export default async function UpcomingEventsPage() {
  await getRequiredUser();

  return (
    <div className="px-4 py-6 md:py-8">
      <EventNavigation currentPage="upcoming" />
      <UpcomingEventsLayout />
    </div>
  );
}
