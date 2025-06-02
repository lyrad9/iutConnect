import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ItemsEvents } from "./items-events";
import Link from "next/link";
import ItemsSite from "./items-site";
import { ItemsGroups } from "./items-groups";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { eventTypes } from "../../utils/const/event-type";
import { SideEventLinkProps } from "../../utils/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { CalendarPlus } from "lucide-react";
export function NavigationContent() {
  const pathname = usePathname();
  const content = useMemo(() => {
    if (pathname === "/") {
      return <ItemsSite />;
    }
    if (pathname === "/groups") {
      return <ItemsGroups />;
    }
    if (pathname === "/events") {
      return <ItemsEvents />;
    }
    return null;
  }, [pathname]);
  return <div className="px-4">{content}</div>;
}

/**
 * Composant pour afficher les groupes créés par l'utilisateur dans la barre laterale
 * @returns
 */
export function YoursGroups() {
  const groups = [
    {
      id: 1,
      name: "Computer Science",
      avatar: "/placeholder.svg",
      members: 100,
    },
    {
      id: 2,
      name: "Photography Club",
      avatar: "/placeholder.svg",
      members: 100,
    },
  ];
  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase font-medium mb-2 px-4">Vos groupes</h3>
      <div className="flex flex-col gap-1">
        {groups.map((group) => (
          <GroupLink
            key={group.id}
            name={group.name}
            avatar={group.avatar}
            memberCount={group.members}
          />
        ))}
      </div>
    </div>
  );
}
/**
 * Composant pour un lien de groupe dans la barre latérale
 */
export const GroupLink = ({
  name,
  avatar,
  memberCount,
}: {
  name: string;
  avatar: string;
  memberCount: number;
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <Link
        href={`/groups/${name.toLowerCase().replace(/\s+/g, "-")}`}
        className="flex items-start gap-2"
      >
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">
            {memberCount} members
          </span>
        </div>
      </Link>
    </Button>
  );
};

/**
 * Composant pour un lien d'événement dans la barre latérale
 */
function EventLink({ id, name, date, location, type }: SideEventLinkProps) {
  // Récupérer les styles et l'icône en fonction du type d'événement
  const { color, textColor, icon } = eventTypes[type];

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <Link href={`/events/${id}`} className="flex items-start gap-2">
        {/* Avatar personnalisé avec couleur et icône selon le type d'événement */}
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center ${color} ${textColor} flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">
            {date} • {location}
          </span>
        </div>
      </Link>
    </Button>
  );
}

/**
 * Composant pour afficher les événements créés par l'utilisateur dans la barre laterale
 */
export function YoursEvents() {
  const events = [
    {
      id: "1",
      name: "End of Term Party",
      date: "2024-05-15",
      location: "Campus",
      type: "social",
    },
    {
      id: "2",
      name: "Campus Hackathon",
      date: "2024-05-22",
      location: "Campus",
      type: "academic",
    },
  ];
  return (
    <div className="mt-6">
      <div className="flex mb-2 px-4 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Vos évènements</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-violet-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 rounded-full"
              >
                <CalendarPlus className="h-4 w-4" />
                <span className="sr-only">Add event</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Créer un nouvel événement</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col gap-1">
        {events.map((event) => (
          <EventLink
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            type={event.type as keyof typeof eventTypes}
          />
        ))}
      </div>
      <Link
        href="/events/all"
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Voir tous vos évènements
      </Link>
    </div>
  );
}

/**
 * Composant pour afficher les évènements à venir de la plateforme
 * @returns
 */
export function UpcomingEvents() {
  const upcomingEvents = [
    {
      id: "1",
      name: "End of Term Party",
      date: "2024-05-15",
      location: "Campus",
      type: "social",
    },
    {
      id: "2",
      name: "Campus Hackathon",
      date: "2024-05-22",
      location: "Campus",
      type: "academic",
    },
  ];
  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase font-medium mb-2 px-4">
        Evènements à venir
      </h3>
      <div className="flex flex-col gap-1">
        {upcomingEvents.map((event) => (
          <EventLink
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            type={event.type as keyof typeof eventTypes}
          />
        ))}
        <Link
          href="/events/all"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Voir tous les évènements
        </Link>
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les groupes suggérés dans la barre laterale
 */
export function SuggestGroups() {
  const suggestGroups = [
    {
      id: 1,
      name: "Computer Science",
      avatar: "/placeholder.svg",
      members: 100,
    },
    {
      id: 2,
      name: "Photography Club",
      avatar: "/placeholder.svg",
      members: 100,
    },
  ];
  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase font-medium mb-2 px-4">
        Groupes suggérés
      </h3>
      <div className="flex flex-col gap-1">
        {suggestGroups.map((group) => (
          <GroupLink
            key={group.id}
            name={group.name}
            avatar={group.avatar}
            memberCount={group.members}
          />
        ))}
      </div>
    </div>
  );
}

export function SuggestEvents() {
  const suggestEvents = [
    {
      id: "1",
      name: "End of Term Party",
      date: "2024-05-15",
      location: "Campus",
      type: "social",
    },
  ];
  return (
    <div className="mt-6">
      <h3 className="text-xs uppercase font-medium mb-2 px-4">
        Évènements suggérés
      </h3>
      <div className="flex flex-col gap-1">
        {suggestEvents.map((event) => (
          <EventLink
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            type={event.type as keyof typeof eventTypes}
          />
        ))}
      </div>
    </div>
  );
}
