"use client";
import { EmptyState } from "@/src/components/ui/empty-state";
import { useQuery } from "convex/react";
import { FileQuestion } from "lucide-react";
import DiscoverGroupsList from "./_components/discover-groups-list";
import { api } from "@/convex/_generated/api";

/**
 * Composant principal pour découvrir les groupes
 */
export default function GroupsDiscoverLayout() {
  // Vérifier s'il y'a des groupes dans la plateforme
  const hasGroups = useQuery(api.forums.hasGroups);

  if (hasGroups === false) {
    return (
      <EmptyState
        className="max-w-full h-screen flex flex-col justify-center items-center"
        title="Aucun groupe trouvé"
        icons={[FileQuestion]}
        description="Il n'y a pas de groupes dans la plateforme"
      />
    );
  }
  return <DiscoverGroupsList />;
}
