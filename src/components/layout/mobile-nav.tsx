"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  Home,
  Users,
  Calendar,
  Search,
  PlusSquare,
  User,
  BookmarkPlus,
} from "lucide-react";
import { CreateContentModal } from "../shared/create-content-modal";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface MobileNavProps {
  className?: string;
}

export default function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const currentUser = useQuery(api.users.currentUser);

  // Vérifier si l'utilisateur a les permissions nécessaires
  const canCreateContent =
    currentUser?.permissions.some((p) =>
      ["CREATE_POST", "CREATE_EVENT", "ALL"].includes(p)
    ) ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPERADMIN";

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
      type: "button",
      icon: <PlusSquare className="h-6 w-6" />,
      action: () => setIsCreateModalOpen(true),
      disabled: !canCreateContent,
    },
    {
      href: "/groups",
      icon: <Users className="size-5" />,
    },
    {
      href: "/events",
      icon: <Calendar className="size-5" />,
      label: "Events",
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
          item.type === "button" ? (
            <button
              key={`button-${index}`}
              onClick={item.action}
              disabled={item.disabled}
              className={cn(
                "flex items-center justify-center",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {item.icon}
              </div>
            </button>
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

      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
