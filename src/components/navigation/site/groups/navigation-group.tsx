import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Shield, Users } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

/**
 * Élément de navigation avec icône et label
 */
export function NavigationItem({
  href,
  icon,
  label,
  isActive,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

/**
 * Navigation principale des groupes
 */
export default function NavigationGroup() {
  const pathname = usePathname();

  // Définition des éléments de navigation
  const navItems = [
    {
      href: "/groups",
      icon: <Home className="h-4 w-4" />,
      label: "Fil d'actualité",
    },
    {
      href: "/groups/discover",
      icon: <Compass className="h-4 w-4" />,
      label: "Explorer des groupes",
    },
    /*   {
      href: "/groups/suggest",
      icon: <Compass className="h-4 w-4" />,
      label: "Groupes suggérés",
    }, */
    {
      href: "/groups/joins",
      icon: <Users className="h-4 w-4" />,
      label: "Vos groupes",
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
