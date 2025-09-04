import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import NavigationEvent from "@/src/components/navigation/site/navigation-event";
import {
  OwnedEvents,
  UpcomingEvents,
} from "@/src/components/navigation/site/sidebar-navigation-content";
import { EventCreateBtn } from "../shared/event/event-create-btn";
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
      <EventCreateBtn className="w-full" />
    </div>
  );
}

// Import des composants de navigation et des événements

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
