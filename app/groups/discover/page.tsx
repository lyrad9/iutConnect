import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { GroupNavigation } from "../GroupNavigation";
import GroupsDiscoverLayout from "./GroupsDiscoverLayout";

export const metadata = {
  title: "Découvrir des groupes",
  description: "Explorez et rejoignez de nouveaux groupes",
};

export default async function GroupsDiscoverPage() {
  await getRequiredUser();

  return (
    <div className="px-4 py-6 md:py-8">
      <GroupNavigation currentPage="discover" />
      <GroupsDiscoverLayout />
    </div>
  );
}
