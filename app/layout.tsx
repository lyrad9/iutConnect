import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import { NavigationWrapper } from "@/src/components/layout/navigation-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ConvexClientProvider from "./ConvexClientProvider";
/* import { Geist, Geist_Mono } from "next/font/google";
import { Anek_Telugu } from "next/font/google"; */
import { cn } from "@/src/lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { CircleCheckIcon, CircleX } from "lucide-react";
import { Toaster as Sonner } from "sonner";

import { NotificationProvider } from "@/src/components/contexts/notification-context";

const inter = Inter({ subsets: ["latin"] });
/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const AnekTelugu = Anek_Telugu({
  subsets: ["latin"],
  variable: "--font-caption",
}); */
export const metadata: Metadata = {
  title: "UniConnect - University Social Network",
  description:
    "Connect with students, join groups, and stay updated with campus events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          /*  geistSans.variable,
          geistMono.variable,
          AnekTelugu.variable, */
          "antialiased size-full bg-background font-sans  text-foreground"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NuqsAdapter>
            <ConvexAuthNextjsServerProvider>
              <ConvexClientProvider>
                <NotificationProvider>
                  <NavigationWrapper>{children}</NavigationWrapper>

                  <Sonner
                    toastOptions={{
                      classNames: {
                        closeButton: "",
                        title: "text-sm",
                        default: "text-blue-500",
                        icon: "",
                        success:
                          "border-green-400 dark:border-green-200 border border-green-400 bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300",
                        error:
                          "border-red-400 dark:border-red-200 border-2 border-red-400 bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300",
                      },
                    }}
                    closeButton
                    className=""
                    icons={{
                      info: <CircleX className="size-5" />,
                      error: <CircleX className="size-5" />,
                      success: <CircleCheckIcon className="" />,
                    }}
                  />
                </NotificationProvider>
              </ConvexClientProvider>
            </ConvexAuthNextjsServerProvider>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
