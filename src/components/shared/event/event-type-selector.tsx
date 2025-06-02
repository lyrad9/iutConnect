"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { eventTypes } from "../../utils/const/event-type";
import { EventFormValues } from "./event-form-schema";

type EventTypeSelectorProps = {
  control: Control<EventFormValues>;
};

export function EventTypeSelector({ control }: EventTypeSelectorProps) {
  return (
    <FormField
      control={control}
      name="eventType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type d&apos;événement</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue placeholder="Sélectionnez un type d'événement" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(eventTypes).map(([key, { content }]) => (
                  <SelectItem key={key} value={key}>
                    {content}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
