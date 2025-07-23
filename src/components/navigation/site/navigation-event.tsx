import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Clock, Compass, Layers } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { NavigationItem } from "./groups/navigation-group";

/**
 * Navigation principale des événements
 */
export default function NavigationEvent() {
  const pathname = usePathname();

  // Définition des éléments de navigation
  const navItems = [
    {
      href: "/events",
      icon: <Compass className="h-4 w-4" />,
      label: "Explorer",
    },
    {
      href: "/events/owned",
      icon: <Calendar className="h-4 w-4" />,
      label: "Mes événements",
    },
    {
      href: "/events/upcoming",
      icon: <Clock className="h-4 w-4" />,
      label: "À venir",
    },
    {
      href: "/events/attended",
      icon: <Layers className="h-4 w-4" />,
      label: "Participés",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-sm font-medium">Navigation</h3>
      </div>
      <nav className="space-y-1 px-2">
        {navItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
}
