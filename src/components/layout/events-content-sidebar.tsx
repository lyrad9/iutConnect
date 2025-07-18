import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Search, Plus, ChevronRight } from "lucide-react";

// Composant d'en-tête avec titre et recherche
function EventsHeader() {
  return (
    <div className="px-4 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Événements</h2>
        <p className="text-sm text-muted-foreground">
          Découvrez et rejoignez des événements
        </p>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un événement..."
          className="pl-8 bg-background rounded-full"
        />
      </div>
      <Button
        suppressHydrationWarning
        asChild
        size="sm"
        className="bg-primary h-8 gap-1 w-full"
      >
        <Link href="/events/create">
          <Plus className="h-3.5 w-3.5" />
          <span>Créer un événement</span>
        </Link>
      </Button>
    </div>
  );
}

// Import des composants de navigation et des événements
import NavigationEvent from "@/src/components/navigation/site/navigation-event";
import {
  OwnedEvents,
  UpcomingEvents,
} from "@/src/components/navigation/site/sidebar-navigation-content";

// Contenu à afficher quand on est dans /events
export default function EventsContentSidebar({
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
      <EventsHeader />
      <NavigationEvent />

      <div className="px-4 py-2">
        <div className="h-px bg-border" />
      </div>

      {/* Événements créés par l'utilisateur */}
      <OwnedEvents />

      <div className="px-4 py-2">
        <div className="h-px bg-border" />
      </div>

      {/* Événements à venir */}
      <UpcomingEvents />
    </aside>
  );
}
