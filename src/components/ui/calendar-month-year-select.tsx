// @ts-nocheck
import { Calendar } from "@/src/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  DropdownNavProps,
  DropdownProps,
  DayPickerProps,
} from "react-day-picker";
import { cn } from "@/src/lib/utils";
import * as React from "react";

export type CalendarMonthYearSelectProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
} & Omit<DayPickerProps, "selected" | "onSelect">;

export function CalendarMonthYearSelect({
  value,
  onChange,
  label,
  placeholder = "Sélectionner une date",
  minDate,
  maxDate,
  className,
  ...props
}: CalendarMonthYearSelectProps) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <span className="text-sm font-medium mb-1">{label}</span>}
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        className="rounded-md border p-2"
        classNames={{ month_caption: "mx-0" }}
        captionLayout="dropdown"
        defaultMonth={value || new Date()}
        fromDate={minDate}
        toDate={maxDate}
        components={{
          DropdownNav: (props: DropdownNavProps) => (
            <div className="flex w-full items-center gap-2">
              {props.children}
            </div>
          ),
          Dropdown: (props: DropdownProps) => (
            <Select
              value={String(props.value)}
              onValueChange={(val) => {
                if (props.onChange) handleCalendarChange(val, props.onChange);
              }}
            >
              <SelectTrigger className="h-8 w-fit font-medium first:grow">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                {props.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        }}
        {...props}
      />
    </div>
  );
}
