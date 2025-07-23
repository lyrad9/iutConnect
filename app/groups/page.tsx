import React from "react";
import { getRequiredUser } from "@/src/lib/auth-server";
import { GroupNavigation } from "./GroupNavigation";
import NewFeedGroupsLayout from "./NewFeedGroupsLayout";

export const metadata = {
  title: "Fil d'actualité des groupes",
  description: "Découvrez les dernières activités de vos groupes",
};

export default async function GroupsFeedPage() {
  await getRequiredUser();

  return (
    <div className="px-4 py-6 md:py-8">
      <GroupNavigation currentPage="feed" />
      <NewFeedGroupsLayout />
    </div>
  );
}
