import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { NavigationItems } from "@/src/components/navigation/site/navigation-config";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex-col w-64 border-r pt-6 pb-12", className)}>
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

      <div className="mt-6 px-4">
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
          Your Groups
        </h3>
        <div className="flex flex-col gap-1">
          <Link
            href="/groups/computer-science"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-chart-1"></span>
            <span>Computer Science</span>
          </Link>
          <Link
            href="/groups/photography-club"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-chart-2"></span>
            <span>Photography Club</span>
          </Link>
          <Link
            href="/groups/student-union"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-chart-3"></span>
            <span>Student Union</span>
          </Link>
          <Link
            href="/groups/basketball-team"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-chart-4"></span>
            <span>Basketball Team</span>
          </Link>
          <Link
            href="/groups/all"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View all groups
          </Link>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
          Upcoming Events
        </h3>
        <div className="flex flex-col gap-1">
          <Link
            href="/events/end-of-term-party"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md border bg-background text-center">
              <span className="text-[10px] uppercase text-muted-foreground">
                May
              </span>
              <span className="text-xs font-bold">15</span>
            </div>
            <span>End of Term Party</span>
          </Link>
          <Link
            href="/events/hackathon"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md border bg-background text-center">
              <span className="text-[10px] uppercase text-muted-foreground">
                May
              </span>
              <span className="text-xs font-bold">22</span>
            </div>
            <span>Campus Hackathon</span>
          </Link>
          <Link
            href="/events/all"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View all events
          </Link>
        </div>
      </div>
    </aside>
  );
}
