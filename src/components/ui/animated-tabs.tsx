"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import { LucideIcon } from "lucide-react";

export interface AnimatedTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className,
  tabClassName,
  activeTabClassName,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(
    controlledActiveTab || defaultTab || tabs[0]?.id
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Handle controlled state
  useEffect(() => {
    if (
      controlledActiveTab !== undefined &&
      controlledActiveTab !== activeTab
    ) {
      setActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab, activeTab]);

  useEffect(() => {
    const container = containerRef.current;

    if (container && activeTab) {
      const activeTabElement = activeTabRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;

        const clipLeft = offsetLeft + 16;
        const clipRight = offsetLeft + offsetWidth + 16;

        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div
      className={cn(
        "relative bg-secondary/50 border border-primary/10 mx-auto flex w-fit flex-col items-center rounded-full py-2 px-4",
        className
      )}
    >
      <div
        ref={containerRef}
        className="absolute z-10 w-full overflow-hidden [clip-path:inset(0px_75%_0px_0%_round_17px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="relative flex w-full justify-center bg-primary">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex h-8 items-center rounded-full p-3 text-sm font-medium text-primary-foreground",
                tabClassName
              )}
              tabIndex={-1}
            >
              {/* Afficher l'icone en version mobile et le texte en version desktop */}

              {tab.icon && (
                <div className="[@media(min-width:470px)]:hidden">
                  {tab.icon}
                </div>
              )}

              <div className="[@media(min-width:470px)]:block hidden">
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex w-full justify-center">
        {tabs.map(({ id, label, icon }, index) => {
          const isActive = activeTab === id;

          return (
            <button
              key={index}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTabChange(id)}
              className={cn(
                "flex h-8 items-center cursor-pointer rounded-full p-3 text-sm font-medium text-muted-foreground",
                isActive && "text-foreground",
                isActive && activeTabClassName
              )}
            >
              {icon && (
                <div className="[@media(min-width:470px)]:hidden">{icon}</div>
              )}

              <div className="[@media(min-width:470px)]:block hidden">
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
