"use client";

import React from "react";
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

type EventLocationSelectorProps = {
  control: Control<EventFormValues>;
};

export function EventLocationSelector({ control }: EventLocationSelectorProps) {
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
                variant={field.value === "onsite" ? "default" : "outline"}
                size="sm"
                onClick={() => field.onChange("onsite")}
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
              <Input
                placeholder={
                  control._formValues.location?.type === "onsite"
                    ? "Adresse du lieu"
                    : "Lien de connexion"
                }
                {...field}
                className="bg-background/50 border-border/50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
