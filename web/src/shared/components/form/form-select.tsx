import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../shadcn/select";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Select>, "children">,
    FormElementProps<TFieldValues> {
  options: Option[];
  placeholder?: string;
}

export const FormSelect = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  label,
  inputSize = "md",
  wrapperClassName,
  options,
  placeholder = "Choose...",
  ...rest
}: FormSelectProps<TFieldValues>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: fieldName, control });

  return (
    <FormElementWrapper
      control={control}
      fieldName={fieldName}
      label={label}
      inputSize={inputSize}
      wrapperClassName={wrapperClassName}
    >
      <Select value={value} onValueChange={onChange} {...rest}>
        <SelectTrigger
          size={inputSize === "md" ? "default" : "sm"}
          className={error ? "border-destructive" : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <SelectItem
                key={opt.value}
                value={opt.value}
                data-selected={isSelected ? "true" : undefined}
                aria-selected={isSelected}
              >
                {opt.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormElementWrapper>
  );
};
