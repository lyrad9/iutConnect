"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Home, Users, Calendar, Search, PlusSquare } from "lucide-react";

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      icon: <Home className="h-5 w-5" />,
      label: "Feed",
    },
    {
      href: "/search",
      icon: <Search className="h-5 w-5" />,
      label: "Search",
    },
    {
      href: "/create",
      icon: <PlusSquare className="h-6 w-6" />,
      label: "Post",
    },
    {
      href: "/groups",
      icon: <Users className="h-5 w-5" />,
      label: "Groups",
    },
    {
      href: "/events",
      icon: <Calendar className="h-5 w-5" />,
      label: "Events",
    },
  ];

  return (
    <nav
      className={cn(
        "bg-background z-50 flex h-16 items-center justify-around border-t",
        className
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.href === "/create" ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {item.icon}
            </div>
          ) : (
            <>
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}
