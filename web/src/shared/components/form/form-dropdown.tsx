import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import { Button } from "../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../shadcn/dropdown-menu";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface Option {
  label: string;
  value: string;
}

interface FormDropdownProps<TFieldValues extends FieldValues>
  extends FormElementProps<TFieldValues> {
  options: Option[];
  placeholder?: string;
  label?: string;
  startIcon?: React.ReactNode;
}

export const FormDropdown = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  options,
  placeholder = "Choose...",
  label,
  startIcon,
  ...wrapperProps
}: FormDropdownProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: fieldName, control });

  const selected = options.find((opt) => opt.value === value);

  return (
    <FormElementWrapper
      control={control}
      fieldName={fieldName}
      label={label}
      {...wrapperProps}
      childProps={{ value }}
    >
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={error ? "border-destructive" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {startIcon}
                <span className="truncate">
                  {selected ? selected.label : placeholder}
                </span>
              </div>
              <span
                aria-hidden
                className={
                  "ml-2 transition-transform duration-150 ease-in-out " +
                  (open ? "rotate-180" : "rotate-0")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => {
                onChange(opt.value);
              }}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </FormElementWrapper>
  );
};
