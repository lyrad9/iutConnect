import React from "react";
import { addDays } from "date-fns";

import { Calendar as CalendarPrimitive } from "@/src/components/ui/calendar";

interface CalendarDisabledDateProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (
    date: Date | Date[] | { from: Date; to: Date } | undefined
  ) => void;
  disabled?: {
    from?: Date;
    to?: Date;
    dates?: Date[];
    before?: Date;
    after?: Date;
    dayOfWeek?: number[];
  }[];
  showFooterText?: boolean;
  className?: string;
}

export function CalendarDisabledDate({
  mode = "single",
  selected,
  onSelect,
  disabled,
  showFooterText = false,
  className = "",
}: CalendarDisabledDateProps) {
  const today = new Date();

  // Par défaut, désactiver les dates passées si aucune configuration n'est fournie
  const defaultDisabled = [
    { before: today }, // Dates before today
  ];

  return (
    <div className="w-full">
      <CalendarPrimitive
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        disabled={disabled || defaultDisabled}
        excludeDisabled
        className={`rounded-md border p-2 ${className}`}
      />
      {showFooterText && (
        <p
          className="text-muted-foreground mt-4 text-center text-xs"
          role="region"
          aria-live="polite"
        >
          Les dates grisées ne sont pas disponibles
        </p>
      )}
    </div>
  );
}
