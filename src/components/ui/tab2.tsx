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
}

export default function TabsUnderline({
  tabs,
  defaultTab,
  className,
  showIconsOnlyOnMobile = false,
}: TabsUnderlineProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0]?.id} className={className}>
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {tab.icon && (
                <tab.icon
                  className={`-ms-0.5 me-1.5 opacity-60 ${
                    showIconsOnlyOnMobile ? "md:hidden" : ""
                  }`}
                  size={16}
                  aria-hidden="true"
                />
              )}
              {tab.label}
              {tab.badge && (
                <Badge
                  className={
                    tab.badge.variant === "secondary"
                      ? "bg-primary/15 ms-1.5 min-w-5 px-1"
                      : "ms-1.5"
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
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
