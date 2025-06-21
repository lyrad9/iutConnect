import React from "react";
import Link from "next/link";
import { Bell, MessageSquare, Search, User, Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ModeToggle } from "@/src/components/mode-toggle";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import SiteSheet from "./site-sheet";
import { NotificationsDropdown } from "../notifications/notifictions-dropdown";

import { AuthDropdown } from "../auth/auth-dropdown";
import AuthBtn from "../auth/auth-btn";
import { MenuShortcut } from "../ui/menu-shortcut";
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex px-8  h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <SiteSheet />
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">UniConnect</span>
          </Link>
          <div className="hidden md:flex md:flex-1">
            <form className="w-full max-w-[400px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-full bg-muted pl-8 md:w-[300px] lg:w-[400px]"
                />
              </div>
            </form>
          </div>
        </div>
        {/* Insérer le menu shortcut */}
        <MenuShortcut />
        <Authenticated>
          <nav className="flex items-center gap-2">
            <NotificationsDropdown />
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/messages">
                <MessageSquare className="size-5" />
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  5
                </span>
                <span className="sr-only">Messages</span>
              </Link>
            </Button>
            <ModeToggle />
            <AuthDropdown />
          </nav>
        </Authenticated>
        <Unauthenticated>
          <AuthBtn />
        </Unauthenticated>
      </div>
    </header>
  );
}
