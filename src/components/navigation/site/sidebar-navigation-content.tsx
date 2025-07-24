"use client";
import React, { useRef, useEffect } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import LoadingOwnedGroups from "../loading";
import { LoadingEvents } from "../loading";
import { GroupLink } from "./item-group-link";
import { EventLink } from "./item-event-link";
import { useInfiniteScroll } from "@/src/hooks/use-infinite-scroll";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { eventTypes } from "../../utils/const/event-type";

export default function SidebarNavigationContent() {
  const isAdmin = useQuery(api.forums.isUserAdminOfGroup);
  const isMember = useQuery(api.forums.isUserMemberOfGroup);
  console.log("isMember", isMember);
  return (
    <>
      {isAdmin && <OwnedGroups />}
      {isMember && <JoinedGroups />}
    </>
  );
}

/**
 * Composant pour afficher les groupes gérés par l'utilisateur dans la sidebar
 */
export function OwnedGroups() {
  // Récupérer les groupes gérés par l'utilisateur avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.forums.getManagedGroups,
    {},
    { initialNumItems: 5 }
  );

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "100px",
  });

  return (
    <div className="mt-6 px-4">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">
          Groupes que vous gérez
        </h3>
        <Link
          href="/groups/joins"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          voir tout
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
            {status === "CanLoadMore" && (
              <div ref={loaderRef} className="h-4" />
            )}
            {isLoading && <LoadingOwnedGroups />}
          </>
        ) : isLoading ? (
          <LoadingOwnedGroups />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Aucun groupe créé</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les groupes auxquels l'utilisateur appartient
 */
export function JoinedGroups() {
  // Récupérer les groupes rejoins par l'utilisateur avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.forums.sidebarGetUserGroups,
    {},
    { initialNumItems: 5 }
  );

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "100px",
  });

  return (
    <div className="mt-6 px-4">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Vos groupes rejoins</h3>
        <Link
          href="/groups/joined"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          voir tout
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
            {status === "CanLoadMore" && (
              <div ref={loaderRef} className="h-4" />
            )}
            {isLoading && <LoadingOwnedGroups />}
          </>
        ) : isLoading ? (
          <LoadingOwnedGroups />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Aucun groupe rejoint
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les événements créés par l'utilisateur dans la barre laterale
 */
export function OwnedEvents() {
  // Récupérer les événements créés par l'utilisateur avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.events.getUserEventsSidebar,
    {},
    { initialNumItems: 5 }
  );

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "100px",
  });

  return (
    <div className="mt-6 px-4">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Vos évènements crées</h3>

        <Link
          href="/events/created"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          voir tout
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>

      <div className="flex flex-col gap-1 px-2">
        {results && results.length > 0 ? (
          <>
            {results.slice(0, 10).map((event) => (
              <EventLink
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                type={event.type as keyof typeof eventTypes}
                photo={event.photo}
                locationType={event.locationType}
              />
            ))}
            {status === "CanLoadMore" && (
              <div ref={loaderRef} className="h-4" />
            )}
            {isLoading && <LoadingEvents />}
          </>
        ) : isLoading ? (
          <LoadingEvents />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Aucun événement créé
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les évènements à venir de la plateforme
 */
export function UpcomingEvents() {
  // Récupérer les événements à venir avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.events.getUpcomingEventsSidebar,
    {},
    { initialNumItems: 5 }
  );

  // Utiliser le hook useInfiniteScroll pour gérer le chargement progressif
  const loaderRef = useInfiniteScroll({
    loading: isLoading,
    hasMore: status === "CanLoadMore",
    onLoadMore: () => loadMore(6),
    rootMargin: "100px",
  });

  return (
    <div className="mt-6 px-4">
      <div className="flex mb-2 px-2 items-center justify-between">
        <h3 className="text-xs uppercase font-medium">Evènements à venir</h3>
        <Link
          href="/events"
          className="text-xs text-muted-foreground hover:text-primary flex items-center"
        >
          voir tout
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {results && results.length > 0 ? (
          <>
            {results.slice(0, 10).map((event) => (
              <EventLink
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                type={event.type as keyof typeof eventTypes}
                photo={event.photo}
                locationType={event.locationType}
              />
            ))}
            {status === "CanLoadMore" && (
              <div ref={loaderRef} className="h-4" />
            )}
            {isLoading && <LoadingEvents />}
          </>
        ) : isLoading ? (
          <LoadingEvents />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Aucun événement à venir
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
