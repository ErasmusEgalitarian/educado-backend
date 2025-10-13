import * as React from "react";
import { FieldValues, useController } from "react-hook-form";

import { Button } from "../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import { Input } from "../shadcn/input";
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
  FormMultiSelectProps<any> // Props type - using any for simplicity, you could make it generic
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
      createLabel = "New Entry", //translation fix
      ...multiSelectProps
    }: FormMultiSelectProps<TFieldValues>,
    ref: React.ForwardedRef<MultiSelectRef>
  ) => {
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
        <>
          <MultiSelect
            ref={ref}
            options={options}
            defaultValue={value ?? []}
            onValueChange={onChange}
            onCreateClick={onCreateClick}
            createLabel={createLabel}
            resetOnDefaultValueChange={true}
            {...multiSelectProps}
          />
        </>
      </FormElementWrapper>
    );
  }
);

FormMultiSelect.displayName = "FormMultiSelect";
