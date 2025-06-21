"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import Link from "next/link";

import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { eventTypes } from "../../utils/const/event-type";
import { SideEventLinkProps } from "../../utils/types";

import { ChevronRight } from "lucide-react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import LoadingOwnedGroups from "../loading";

export default function SidebarNavigationContent() {
  const isAdmin = useQuery(api.forums.isUserAdminOfGroup);
  const isMember = useQuery(api.forums.isUserMemberOfGroup);
  console.log("isMember", isMember);
  return (
    <>
      {isAdmin && <OwnedGroups />}
      {isMember && <JoinedGroups />}
      {/*     <JoinedGroups />
      <YoursEvents />
      <UpcomingEvents /> */}
    </>
  );
}

/**
 * Composant pour afficher les groupes gérés par l'utilisateur dans la barre laterale
 */
export function OwnedGroups() {
  const user = useQuery(api.users.currentUser);
  // Récupérer les groupes gérés par l'utilisateur avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.forums.getManagedGroups,
    {},
    { initialNumItems: 5 }
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;
    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);

  return (
    <div className="mt-6">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-bold">Groupes que vous gérez</h3>
        <Link
          href="/groups/managed"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {results && results.length > 0 ? (
          <>
            {results.slice(0, 10).map((group) => (
              <GroupLink
                key={group._id}
                id={group._id}
                name={group.name}
                avatar={group.avatar}
                memberCount={group.membersCount}
              />
            ))}
            <div ref={loaderRef} className="h-10" />
            {isLoading && <LoadingOwnedGroups />}
          </>
        ) : isLoading ? (
          <LoadingOwnedGroups />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Aucun groupe géré</p>
            <Button variant="outline" className="text-xs">
              Créer un groupe
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les groupes dont l'utilisateur est membre dans la barre laterale
 */
export function JoinedGroups() {
  // Récupérer les groupes dont l'utilisateur est membre avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.forums.sidebarGetUserGroups,
    {},
    { initialNumItems: 5 }
  );
  console.log("joinedGroupes", results);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "CanLoadMore" || isLoading) return;
    const observed = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore(6);
        }
      },
      { rootMargin: "200px" }
    );

    if (observed) {
      observer.observe(observed);
    }

    return () => {
      if (observed) {
        observer.unobserve(observed);
      }
    };
  }, [status, isLoading, loadMore]);

  return (
    <div className="mt-6">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-bold">Groupes que vous suivez</h3>
        <Link
          href="/groups/joins"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {results && results.length > 0 ? (
          <>
            {results.slice(0, 10).map((group) => (
              <GroupLink
                key={group._id}
                id={group._id}
                name={group.name}
                avatar={group.avatar}
                memberCount={group.membersCount}
              />
            ))}
            <div ref={loaderRef} className="h-10" />
            {isLoading && <LoadingOwnedGroups />}
          </>
        ) : isLoading ? (
          <LoadingOwnedGroups />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Aucun groupe</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour un lien de groupe dans la barre latérale
 */
export const GroupLink = ({
  id,
  name,
  avatar,
  memberCount,
}: {
  id: string;
  name: string;
  avatar?: string | null;
  memberCount: number;
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-muted-foreground h-auto py-2"
      asChild
    >
      <Link href={`/groups/${id}`} className="flex items-start gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span>{name}</span>
          <span className="text-xs text-muted-foreground">
            {memberCount} membres
          </span>
        </div>
      </Link>
    </Button>
  );
};

/**
 * Composant pour un lien d'événement dans la barre latérale
 */
function EventLink({
  id,
  name,
  date,
  location,
  type,
  photo,
}: SideEventLinkProps) {
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
        {/* Photo de l'événement ou icône par défaut */}
        {photo ? (
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className={`${color} ${textColor}`}>
              {icon}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center ${color} ${textColor} flex-shrink-0`}
          >
            {icon}
          </div>
        )}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1">
            <span>{name}</span>
            {/* Afficher l'icône du type d'événement à côté du nom */}
            <span className={`text-xs ${textColor}`}>{icon}</span>
          </div>
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
  // Récupérer les événements créés par l'utilisateur avec pagination
  const userEvents = useQuery(api.events.getUserEvents, {
    paginationOpts: { numItems: 10 },
  });

  // Si pas de données ou chargement en cours
  if (!userEvents?.page || userEvents.page.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Vos évènements</h3>

        <Link
          href="/events"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        {userEvents.page.map((event) => (
          <EventLink
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            type={event.type as keyof typeof eventTypes}
            photo={event.photo}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les évènements à venir de la plateforme
 */
export function UpcomingEvents() {
  // Récupérer les événements à venir avec pagination
  const upcomingEvents = useQuery(api.events.getUpcomingEvents, {
    paginationOpts: { numItems: 10 },
  });

  // Si pas de données ou chargement en cours
  if (!upcomingEvents?.page || upcomingEvents.page.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Evènements à venir</h3>
        <Link
          href="/events"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          Tout voir
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        {upcomingEvents.page.map((event) => (
          <EventLink
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            type={event.type as keyof typeof eventTypes}
            photo={event.photo}
          />
        ))}
      </div>
    </div>
  );
}
