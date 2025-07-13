"use client";

import React, { ReactNode } from "react";
import { Control } from "react-hook-form";
import { MapPin, Calendar } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { EventFormValues } from "./event-form-schema";
import { cn } from "@/src/lib/utils";
import { Badge } from "../../ui/badge";

type EventLocationSelectorProps = {
  control: Control<EventFormValues>;
  linkIcon?: ReactNode;
};

export function EventLocationSelector({
  control,
  linkIcon,
}: EventLocationSelectorProps) {
  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name="location.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lieu de l&apos;événement</FormLabel>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={field.value === "on-site" ? "default" : "outline"}
                size="sm"
                onClick={() => field.onChange("on-site")}
                className="flex-1"
              >
                <MapPin className="mr-1 size-4" />
                Sur place
              </Button>
              <Button
                type="button"
                variant={field.value === "online" ? "default" : "outline"}
                size="sm"
                onClick={() => field.onChange("online")}
                className="flex-1"
              >
                <Calendar className="mr-1 size-4" />
                En ligne
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location.value"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex items-center gap-2">
                {linkIcon && (
                  <Badge className="rounded-full size-8 bg-accent">
                    {linkIcon}
                  </Badge>
                )}
                <div
                  className={cn(
                    "relative flex-1",
                    linkIcon && "flex items-center"
                  )}
                >
                  {linkIcon && (
                    /*     absolute left-3 top-1/2 -translate-y-1/2 */
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      https://
                    </span>
                  )}
                  <Input
                    placeholder={
                      control._formValues.location?.type === "on-site"
                        ? "Adresse du lieu"
                        : "Lien de connexion"
                    }
                    {...field}
                    className={cn(
                      "bg-background/50 border-border/50",
                      linkIcon && "pl-16"
                    )}
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
