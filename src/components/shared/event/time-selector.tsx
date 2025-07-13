"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { ScrollArea } from "@/src/components/ui/scroll-area";

interface TimeSelectorProps {
  value?: string;
  onChange?: (time: string) => void;
  minTime?: string; // Format "HH:MM"
  className?: string;
}

/**
 * Composant de sélection d'heures avec intervalles de 15 minutes
 */
export function TimeSelector({
  value,
  onChange,
  minTime,
  className,
}: TimeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value || "");

  // Générer toutes les heures possibles par intervalles de 15 minutes
  const generateTimeOptions = () => {
    const times = [];
    const now = new Date();
    const today = new Date().setHours(0, 0, 0, 0);
    const currentTime =
      minTime && isToday(minTime)
        ? minTime
        : `${String(now.getHours()).padStart(2, "0")}:${String(Math.ceil(now.getMinutes() / 15) * 15).padStart(2, "0")}`;

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = String(h).padStart(2, "0");
        const minute = String(m).padStart(2, "0");
        const timeString = `${hour}:${minute}`;

        // Vérifier si l'heure est passée pour aujourd'hui
        const isDisabled = isToday(minTime) && timeString < currentTime;

        times.push({
          value: timeString,
          label: formatTimeLabel(timeString),
          disabled: isDisabled,
        });
      }
    }
    return times;
  };

  // Vérifier si une date est aujourd'hui
  const isToday = (time?: string) => {
    if (!time) return false;
    const now = new Date();
    const today = new Date().toDateString();
    return today === now.toDateString();
  };

  // Formater l'heure pour l'affichage (format 24h)
  const formatTimeLabel = (time: string) => {
    return time;
  };

  // Mise à jour de la valeur sélectionnée
  useEffect(() => {
    setSelectedTime(value || "");
  }, [value]);

  // Gérer la sélection d'une heure
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    onChange?.(time);
    setOpen(false);
  };

  const timeOptions = generateTimeOptions();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background/50 border-border/50",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 opacity-70" />
            {selectedTime
              ? formatTimeLabel(selectedTime)
              : "Sélectionner l'heure"}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <ScrollArea className="h-60">
          <div className="grid grid-cols-3 gap-1 p-2">
            {timeOptions.map((time) => (
              <Button
                key={time.value}
                variant={selectedTime === time.value ? "default" : "ghost"}
                onClick={() => !time.disabled && handleSelectTime(time.value)}
                className={cn(
                  "justify-center",
                  time.disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={time.disabled}
                size="sm"
              >
                {time.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
