import React from "react";
import { PlusIcon, LucideIcon } from "lucide-react";
/* import { Accordion as AccordionPrimitive } from "@radix-ui/react-accordion"; */
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/src/components/ui/accordion";

export interface AccordionSubheaderItem {
  id: string;
  icon: LucideIcon;
  title: string;
  sub: string;
  content: React.ReactNode;
}

interface AccordionWithSubheaderProps {
  items: AccordionSubheaderItem[];
  defaultValue?: string;
  className?: string;
  title?: string;
  onChange?: (value: string) => void;
}

export function AccordionWithSubheader({
  items,
  defaultValue,
  className = "",
  title,
  onChange,
}: AccordionWithSubheaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={defaultValue}
        onValueChange={onChange}
      >
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <span className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <item.icon size={16} className="opacity-60" />
                  </span>
                  <span className="flex flex-col space-y-1">
                    <span>{item.title}</span>
                    {item.sub && (
                      <span className="text-sm font-normal">{item.sub}</span>
                    )}
                  </span>
                </span>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
