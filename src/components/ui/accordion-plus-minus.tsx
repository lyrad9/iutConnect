import React from "react";
import { PlusIcon } from "lucide-react";
/* import { Accordion as AccordionPrimitive } from "@radix-ui/react-accordion"; */
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/src/components/ui/accordion";
import { cn } from "@/src/lib/utils";
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionPlusMinusProps {
  items: AccordionItem[];
  defaultValue?: string;
  className?: string;
  accordionItemClassName?: string;
  title?: string;
  onChange?: (value: string) => void;
}

export default function AccordionPlusMinus({
  items,
  defaultValue,
  className = "",
  accordionItemClassName = "",
  title,
  onChange,
}: AccordionPlusMinusProps) {
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
          <AccordionItem
            value={item.id}
            key={item.id}
            className={cn("py-2", accordionItemClassName)}
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg]:-order-1 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                {item.title}
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-muted-foreground ps-7 pb-2">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
