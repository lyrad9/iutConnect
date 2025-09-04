import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { GroupCreateBtn } from "../shared/forums/group-create-btn";
import NavigationGroup from "@/src/components/navigation/site/groups/navigation-group";
import {
  JoinedGroups,
  OwnedGroups,
} from "@/src/components/navigation/site/sidebar-navigation-content";
// Composant d'en-tête avec titre et recherche
function GroupsHeader() {
  return (
    <div className="px-4 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Groupes</h2>
        <p className="text-sm text-muted-foreground">
          Découvrez et rejoignez des communautés
        </p>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un groupe..."
          className="pl-8 bg-background rounded-full"
        />
      </div>
      <GroupCreateBtn className="w-full" />
    </div>
  );
}

// Composant de navigation principale des groupes

// Contenu à afficher quand on est dans /groups
export default function GroupesContentSidebar({
  className,
}: {
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r pt-6 pb-12 items-stretch overflow-y-auto",
        className
      )}
    >
      <GroupsHeader />
      <NavigationGroup />
      <div className="px-4 py-2">
        <div className="h-px bg-border" />
      </div>
      <OwnedGroups />
      {/*  <ManagedGroups /> */}
      <div className="px-4 py-2">
        <div className="h-px bg-border" />
      </div>
      <JoinedGroups />
    </aside>
  );
}
