"use client";
import { useEffect, useRef } from "react";

import Link from "next/link";
import { eventTypes } from "../../utils/const/event-type";

import { ChevronRight } from "lucide-react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import LoadingOwnedGroups from "../loading";
import { LoadingEvents } from "../loading";
import { GroupLink } from "./item-group-link";
import { EventLink } from "./item-event-link";

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
 * Composant pour afficher les groupes gérés par l'utilisateur dans la barre laterale
 */
export function OwnedGroups() {
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
            <div ref={loaderRef} className="h-10" />
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
 * Composant pour afficher les événements créés par l'utilisateur dans la barre laterale
 */
export function OwnedEvents() {
  // Récupérer les événements créés par l'utilisateur avec pagination
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.events.getUserEvents,
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
              />
            ))}
            <div ref={loaderRef} className="h-10" />
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
    api.events.getUpcomingEvents,
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
        <h3 className="text-xs uppercase font-medium">Evènements à venir</h3>
        <Link
          href="/events/upcoming"
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
              />
            ))}
            <div ref={loaderRef} className="h-10" />
            {isLoading && <LoadingOwnedGroups />}
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
