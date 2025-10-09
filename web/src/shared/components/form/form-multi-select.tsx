import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import { MultiSelect } from "../shadcn/multi-select";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface FormMultiSelectProps<TFieldValues extends FieldValues>
  extends Omit<
      React.ComponentProps<typeof MultiSelect>,
      "inputSize" | "label" | "onValueChange" | "defaultValue"
    >,
    FormElementProps<TFieldValues> {}

export const FormMultiSelect = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  options,
  ...multiSelectProps
}: FormMultiSelectProps<TFieldValues>) => {
  const {
    field: { value, onChange },
  } = useController({ name: fieldName, control });

  return (
    <FormElementWrapper
      control={control}
      fieldName={fieldName}
      inputSize={inputSize}
      wrapperClassName={wrapperClassName}
      label={label}
      labelAction={labelAction}
      description={description}
      isRequired={isRequired}
      hintTooltip={hintTooltip}
    >
      <MultiSelect
        options={options}
        defaultValue={value ?? []}
        onValueChange={onChange}
        resetOnDefaultValueChange={true}
        {...multiSelectProps}
      />
    </FormElementWrapper>
  );
};
