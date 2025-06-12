import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import { NavigationWrapper } from "@/src/components/layout/navigation-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import ConvexClientProvider from "./ConvexClientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { Anek_Telugu } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
const inter = Inter({ subsets: ["latin"] });
const geistSans = Geist({
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
});
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
          geistSans.variable,
          geistMono.variable,
          AnekTelugu.variable,
          "antialiased size-full bg-background font-sans text-foreground"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NuqsAdapter>
            <ConvexAuthNextjsServerProvider>
              <ConvexClientProvider>
                <NavigationWrapper>{children}</NavigationWrapper>
              </ConvexClientProvider>
            </ConvexAuthNextjsServerProvider>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
