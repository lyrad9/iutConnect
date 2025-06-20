import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import {
  Search,
  Home,
  Compass,
  Users,
  Plus,
  ChevronRight,
  Shield,
} from "lucide-react";

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
      <Button
        suppressHydrationWarning
        asChild
        size="sm"
        className="bg-primary h-8 gap-1 w-full"
      >
        <Link href="/groups/create">
          <Plus className="h-3.5 w-3.5" />
          <span>Créer un groupe</span>
        </Link>
      </Button>
    </div>
  );
}

// Composant de navigation principale des groupes
import NavigationGroup from "@/src/components/navigation/site/groups/navigation-group";

// Composant pour afficher les groupes gérés
function ManagedGroups() {
  // Données fictives pour la démonstration
  const managedGroups = [
    { id: 1, name: "Développement Web" },
    { id: 2, name: "Intelligence Artificielle" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-medium">Groupes gérés</h3>
        <Link
          href="/groups/managed"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="space-y-1 px-2">
        {managedGroups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Shield className="h-4 w-4 text-blue-500" />
            <span>{group.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Composant pour afficher les groupes dont l'utilisateur est membre
function MemberGroups() {
  // Données fictives pour la démonstration
  const memberGroups = [
    { id: 3, name: "Réseau Social Universitaire" },
    { id: 4, name: "Design UI/UX" },
    { id: 5, name: "Cybersécurité" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-medium">Vos abonnements</h3>
        <Link
          href="/groups/subscribed"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="space-y-1 px-2">
        {memberGroups.map((group) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Users className="h-4 w-4 text-green-500" />
            <span>{group.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
      <ManagedGroups />
      <div className="px-4 py-2">
        <div className="h-px bg-border" />
      </div>
      <MemberGroups />
    </aside>
  );
}
