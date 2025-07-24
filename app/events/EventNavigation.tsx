"use client";

import React from "react";
import {
  NavigationBreadcrumb,
  NavigationSection,
} from "@/src/components/ui/navigation-breadcrumb";
import {
  Calendar,
  Compass,
  Clock,
  CalendarCheck,
  CalendarDays,
  Plus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { EventCreateBtn } from "@/src/components/shared/event/event-create-btn";

/**
 * Composant de navigation pour les pages d'événements
 * Utilise le composant NavigationBreadcrumb pour afficher la navigation
 */
export function EventNavigation({ currentPage }: { currentPage: string }) {
  // Définir les sections de navigation
  const eventSections: NavigationSection[] = [
    {
      label: "Événements",
      items: [
        {
          label: "à découvrir",
          value: "discover",
          href: "/events",
          icon: <Compass className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Catégories",
      items: [
        {
          label: "à découvrir",
          value: "discover",
          href: "/events",
          icon: <Compass className="h-4 w-4" />,
        },
        {
          label: "en cours",
          value: "current",
          href: "/events/ongoing",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "créés",
          value: "owned",
          href: "/events/owned",
          icon: <CalendarCheck className="h-4 w-4" />,
        },
        {
          label: "participés",
          value: "attented",
          href: "/events/attented",
          icon: <CalendarDays className="h-4 w-4" />,
        },
        {
          label: "passés",
          value: "past",
          href: "/events/past",
          icon: <Clock className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="lg:hidden  mb-6 flex flex-row justify-between items-center">
      <NavigationBreadcrumb
        sections={eventSections}
        currentSection="Catégories"
        currentItem={currentPage}
        className=""
        icon={<Calendar className="h-4 w-4" />}
      />
      <EventCreateBtn />
    </div>
  );
}
