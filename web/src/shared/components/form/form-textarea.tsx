import * as React from "react";
import { FieldValues } from "react-hook-form";

import { Textarea } from "../shadcn/textarea";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface FormTextareaProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Textarea>, "label" | "inputSize">,
    FormElementProps<TFieldValues> {}

export const FormTextarea = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  ...textareaProps
}: FormTextareaProps<TFieldValues>) => {
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
      childProps={textareaProps}
    >
      <Textarea {...textareaProps} />
    </FormElementWrapper>
  );
};
