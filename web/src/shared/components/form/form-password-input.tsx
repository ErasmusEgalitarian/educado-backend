import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import * as React from "react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";

import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";

import { FormElementWrapper } from "./form-element-wrapper";

import type { FormElementProps } from "../shadcn/form";

interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentProps<typeof Input>, "inputSize" | "label">,
    FormElementProps<TFieldValues> {}

export const FormPasswordInput = <TFieldValues extends FieldValues>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  ...inputProps
}: FormInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);

  const icon = (
    <Button
      variant="blank"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        setShowPassword((s) => !s);
      }}
    >
      <Icon
        path={showPassword ? mdiEyeOutline : mdiEyeOffOutline}
        size={1}
        color="#A1ACB2"
      />
    </Button>
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
      childProps={inputProps}
    >
      <Input
        type={showPassword ? "text" : "password"}
        inputSize={inputSize}
        label={label}
        endIcon={icon}
      />
    </FormElementWrapper>
  );
};
