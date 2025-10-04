import * as React from "react";
import { FieldValues } from "react-hook-form";

import { Input, InputIconProps } from "../shadcn/input";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Input>, "inputSize" | "title">,
    FormElementProps<TFieldValues>,
    InputIconProps {
  readonly type?: "text" | "email";
  readonly label?: string;
}

export const FormInput = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  type = "text",
  startIcon,
  endIcon,
  ...inputProps
}: FormInputProps<TFieldValues>) => {
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
      childProps={inputProps}
    >
      <Input
        type={type}
        inputSize={inputSize}
        label={label}
        startIcon={startIcon}
        endIcon={endIcon}
      />
    </FormElementWrapper>
  );
};
