/* eslint-disable @typescript-eslint/naming-convention */
import * as React from "react";
import { FieldValues } from "react-hook-form";

import { cn } from "@/shared/lib/utils";

import {
  FormControl,
  FormDescription,
  FormElementProps,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  InputSize,
} from "../shadcn/form";

interface FormElementWrapperProps<
  TFieldValues extends FieldValues,
  TChildProps extends Record<string, unknown> = Record<string, unknown>,
> extends FormElementProps<TFieldValues> {
  readonly children: React.ReactElement<TChildProps>;
  readonly inputSize?: InputSize;
  readonly childProps?: Partial<TChildProps>;
}

export const FormElementWrapper = <
  TFieldValues extends FieldValues,
  TChildProps extends Record<string, unknown> = Record<string, unknown>,
>({
  control,
  fieldName,
  inputSize = "md",
  wrapperClassName,
  label,
  labelAction,
  description,
  isRequired,
  hintTooltip,
  children,
  childProps,
}: FormElementWrapperProps<TFieldValues, TChildProps>) => {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        // Determine variant to pass to child input component
        let variantProp: unknown = "default" as const;
        if (childProps && "variant" in (childProps as object)) {
          variantProp = (childProps as Record<string, unknown>).variant;
        } else if (hasError) {
          variantProp = "error" as const;
        }

        return (
          <FormItem className={cn("", wrapperClassName)}>
            {label != null && label !== "" && (
              <div className="flex items-center">
                <FormLabel
                  required={isRequired}
                  hintTooltip={hintTooltip}
                  inputSize={inputSize}
                >
                  {label}
                </FormLabel>
                {labelAction}
              </div>
            )}
            <FormControl>
              {React.isValidElement(children)
                ? React.cloneElement(children, {
                    ...children.props,
                    ...childProps,
                    name: field.name,
                    value:
                      childProps && "value" in (childProps as object)
                        ? (childProps as Record<string, unknown>).value
                        : (field.value ?? ""),
                    onChange:
                      childProps && "onChange" in (childProps as object)
                        ? (childProps as Record<string, unknown>).onChange
                        : field.onChange,
                    onValueChange:
                      childProps && "onValueChange" in (childProps as object)
                        ? (childProps as Record<string, unknown>).onValueChange
                        : field.onChange, // Use field.onChange as fallback for components like MultiSelect
                    onBlur: field.onBlur,
                    ref: field.ref,
                    "aria-required": isRequired,
                    // Forward error state via variant and data attribute (if the child supports it)
                    variant: variantProp,
                    "data-error": hasError,
                  })
                : null}
            </FormControl>
            {description != undefined && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
