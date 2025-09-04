"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { Home, Users, Calendar, User } from "lucide-react";
import { CreateContentButton } from "../shared/create-content-button";

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      icon: <Home className="size-5" />,
    },
    {
      href: "/profile",
      icon: <User className="size-5" />,
    },
    {
      type: "create",
      component: <CreateContentButton variant="primary" iconSize={24} />,
    },
    {
      href: "/groups",
      icon: <Users className="size-5" />,
    },
    {
      href: "/events",
      icon: <Calendar className="size-5" />,
    },
  ];

  return (
    <>
      <nav
        className={cn(
          "bg-background z-50 flex h-16 items-center justify-around border-t",
          className
        )}
      >
        {navItems.map((item, index) =>
          item.type === "create" ? (
            <React.Fragment key={`button-${index}`}>
              {item.component}
            </React.Fragment>
          ) : (
            <Link
              key={item.href}
              href={item.href as string}
              className={cn(
                "flex items-center justify-center",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
            </Link>
          )
        )}
      </nav>
    </>
  );
}
