import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { NavigationItems } from "@/src/components/navigation/site/navigation-config";
import { NavigationContent } from "../navigation/site/navigation-content";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col w-64 border-r pt-6 pb-12 items-stretch overflow-y-auto",
        className
      )}
    >
      <div className="flex flex-col gap-2 px-4">
        {NavigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.notifications > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {item.notifications}
              </Badge>
            )}
          </Link>
        ))}
      </div>
      <NavigationContent />
    </aside>
  );
}
