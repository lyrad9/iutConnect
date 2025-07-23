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
} from "lucide-react";

/**
 * Composant de navigation pour les pages d'événements
 * Utilise le composant NavigationBreadcrumb pour afficher la navigation
 */
export function EventNavigation({ currentPage }: { currentPage: string }) {
  // Définir les sections de navigation
  const eventSections: NavigationSection[] = [
    {
      label: "Événements",
      /*  items: [
        {
          label: "à découvrir",
          value: "discover",
          href: "/events",
          icon: <Compass className="h-4 w-4" />,
        },
      ], */
    },
    {
      label: "Catégorieees",
      items: [
        {
          label: "à découvrir",
          value: "discover",
          href: "/events",
          icon: <Compass className="h-4 w-4" />,
        },
        {
          label: "à venir",
          value: "upcoming",
          href: "/events/upcoming",
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
    <NavigationBreadcrumb
      sections={eventSections}
      currentSection="Catégories"
      currentItem={currentPage}
      className="mb-6"
      icon={<Calendar className="h-4 w-4" />}
    />
  );
}
