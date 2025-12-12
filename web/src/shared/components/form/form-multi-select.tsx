import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import {
  MultiSelect,
  MultiSelectOption,
  MultiSelectGroup,
  MultiSelectRef,
} from "../shadcn/multi-select";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";



interface FormMultiSelectProps<TFieldValues extends FieldValues>
  extends Omit<
      React.ComponentProps<typeof MultiSelect>,
      "inputSize" | "label" | "onValueChange" | "defaultValue" | "onCreate"
    >,
    FormElementProps<TFieldValues> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onCreateClick?: () => void;
  createLabel?: string;
}

export const FormMultiSelect = React.forwardRef<
  MultiSelectRef, // Ref type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FormMultiSelectProps<any>
>(
  <TFieldValues extends FieldValues>(
    {
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
      onCreateClick,
      createLabel,
      ...multiSelectProps
    }: FormMultiSelectProps<TFieldValues>,
    ref: React.ForwardedRef<MultiSelectRef>
  ) => {
    const {
      field: { value, onChange },
    } = useController({ name: fieldName, control });

   // Create a merged ref callback that handles both form field ref and forwarded ref
    const mergedRef = React.useCallback(
      (instance: MultiSelectRef | null) => {
        // Handle forwarded ref
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      },
      [ref]
    );

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
        childProps={{ ref: mergedRef } as Record<string, unknown>}
      >
        <MultiSelect
          options={options}
          defaultValue={value ?? []}
          onValueChange={onChange}
          onCreateClick={onCreateClick}
          createLabel={createLabel}
          resetOnDefaultValueChange={true}
          {...multiSelectProps}
        /> </FormElementWrapper>
    );
  }
);

FormMultiSelect.displayName = "FormMultiSelect";