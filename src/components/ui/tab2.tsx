"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";

export type TabItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: {
    content: React.ReactNode;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  content: React.ReactNode;
};

interface TabsUnderlineProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  showIconsOnlyOnMobile?: boolean;
  fullWidth?: boolean;
}

export default function TabsUnderline({
  tabs,
  defaultTab,
  className,
  showIconsOnlyOnMobile = false,
  fullWidth = false,
}: TabsUnderlineProps) {
  const [activeTab, setActiveTab] = React.useState<string>(
    defaultTab || tabs[0]?.id
  );

  return (
    <Tabs
      defaultValue={defaultTab || tabs[0]?.id}
      className={cn(
        "w-full",
        fullWidth ? "max-w-full" : "max-w-4xl mx-auto",
        className
      )}
      onValueChange={setActiveTab}
    >
      <div className="border-b overflow-x-auto">
        <ScrollArea className="w-full">
          <TabsList className="h-auto bg-transparent p-0 rounded flex w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "rounded relative h-10 border-b-2 px-2 md:px-4 pb-3 pt-2 font-medium text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:border-b-primary",
                  "flex items-center gap-1 md:gap-2 flex-shrink-0",
                  showIconsOnlyOnMobile
                    ? "flex-1 sm:flex-initial justify-center sm:justify-start"
                    : "flex-1 md:flex-initial"
                )}
              >
                {tab.icon && (
                  <tab.icon
                    className="size-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "transition-all duration-200 whitespace-nowrap",
                    showIconsOnlyOnMobile && "max-sm:sr-only"
                  )}
                >
                  {tab.label}
                </span>
                {tab.badge && (
                  <Badge
                    className={
                      tab.badge.variant === "secondary"
                        ? "bg-primary/15 ms-1 min-w-4 px-1 h-5 flex-shrink-0"
                        : "ms-1 h-5 flex-shrink-0"
                    }
                    variant={tab.badge.variant || "default"}
                  >
                    {tab.badge.content}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className={cn(
            "mt-6 relative",
            activeTab === tab.id ? "animate-in fade-in-50 duration-300" : ""
          )}
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {tab.content}
            </motion.div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
