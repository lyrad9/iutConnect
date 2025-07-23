import React from "react";

import { getRequiredUser } from "@/src/lib/auth-server";
import DiscoverEventLayout from "./DiscoverEventLayout";

export const metadata = {
  title: "Découvrir des Événements",
  description:
    "Explorez et découvrez des événements qui pourraient vous intéresser",
};

export default async function DiscoverEventsPage() {
  await getRequiredUser();
  return (
    <div className="px-4 py-6 md:py-8">
      <DiscoverEventLayout />
    </div>
  );
}
