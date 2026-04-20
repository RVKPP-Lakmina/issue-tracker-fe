"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectFieldOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SelectFieldProps {
  label?: ReactNode;
  triggerId?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function SelectField({
  label,
  triggerId,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  containerClassName,
  labelClassName,
  triggerClassName,
  contentClassName,
}: SelectFieldProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label
          className={cn("text-sm font-medium text-foreground", labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={triggerId} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
