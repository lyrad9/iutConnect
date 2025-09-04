"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export type NavigationItem = {
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
};

export type NavigationSection = {
  label: string;
  items?: NavigationItem[];
};

interface NavigationBreadcrumbProps {
  sections: NavigationSection[];
  currentSection: string;
  currentItem?: string;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Composant de navigation avec fil d'Ariane et menu déroulant pour mobile
 * Affiche un fil d'Ariane standard avec un select pour la navigation sur mobile
 */
export function NavigationBreadcrumb({
  sections,
  currentSection,
  currentItem,
  className,
  icon,
}: NavigationBreadcrumbProps) {
  const router = useRouter();

  // Trouver la section actuelle
  const activeSection = sections.find(
    (section) => section.label === currentSection
  );

  // Trouver l'élément actif dans la section active
  const activeItem = activeSection?.items?.find(
    (item) => item.value === currentItem
  );

  // Gérer le changement de sélection
  const handleSelectChange = (value: string) => {
    const allItems = sections.flatMap((section) => section.items);
    const selectedItem = allItems?.find((item) => item?.value === value);

    if (selectedItem) {
      router.push(selectedItem.href);
    }
  };

  return (
    <div className={className}>
      {/* <div className="lg:hidden w-full mb-4">
        <Select
          defaultValue={activeItem?.value || activeSection?.items[0]?.value}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-full relative pl-9">
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center ps-3 text-muted-foreground">
                {icon}
              </div>
            )}
            <SelectValue placeholder="Sélectionner une option" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectGroup key={section.label}>
                <SelectLabel>{section.label}</SelectLabel>
                {section.items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            {sections.map((section, index) => {
              const isLastSection = index === sections.length - 1;
              const sectionItem = section.items?.[0]; // Utiliser le premier élément comme lien de la section

              return (
                <React.Fragment key={section.label}>
                  <BreadcrumbItem>
                    {isLastSection ? (
                      <Select
                        defaultValue={
                          activeItem?.value || section.items?.[0]?.value
                        }
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger
                          className="h-8 border-none bg-transparent hover:bg-accent px-2 -ml-2 font-medium"
                          aria-label={`Select ${section.label}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {section.items?.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <BreadcrumbLink
                        href={sectionItem?.href}
                        className="font-medium"
                      >
                        {section.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLastSection && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
