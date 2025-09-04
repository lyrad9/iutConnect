import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { EventNavigation } from "../EventNavigation";
import PastEventLayout from "./_components/PastEventLayout";

export const metadata = {
  title: "Événements passés",
  description: "Historique des événements passés",
};

export default async function PastEventsPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8 space-y-4">
      <EventNavigation currentPage="past" />
      <PastEventLayout />
    </div>
  );
}
