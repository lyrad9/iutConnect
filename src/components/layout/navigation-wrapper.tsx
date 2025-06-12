"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/src/components/layout/header";
import Sidebar from "@/src/components/layout/sidebar";
import MobileNav from "@/src/components/layout/mobile-nav";

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export function NavigationWrapper({ children }: NavigationWrapperProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/sign-up" ||
    pathname === "/verify-email";
  const isAdminPage = pathname.startsWith("/admins");

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="sticky top-14 max-h-[calc(100svh-3.5rem)] overflow-x-hidden pt-10 pb-16 hidden h-screen lg:flex scrollbar-hide" />
        <main className="flex-1 max-lg:px-8 pb-16 lg:pb-0">{children}</main>
      </div>
      <MobileNav className="fixed bottom-0 w-full lg:hidden" />
    </div>
  );
}
