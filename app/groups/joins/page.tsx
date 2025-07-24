import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { GroupNavigation } from "../GroupNavigation";
import JoinGroupsLayout from "./JoinGroupsLayout";

export const metadata = {
  title: "Mes groupes",
  description: "Gérez vos groupes et demandes d'adhésion",
};

export default async function JoinGroupsPage() {
  await getRequiredUser();

  return (
    <div className="px-4 py-6 md:py-8 space-y-4">
      <GroupNavigation currentPage="joins" />
      <JoinGroupsLayout />
    </div>
  );
}
