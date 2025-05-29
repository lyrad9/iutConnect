import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NavigationWrapper } from "@/components/layout/navigation-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NuqsAdapter>
            <NavigationWrapper>{children}</NavigationWrapper>
          </NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
