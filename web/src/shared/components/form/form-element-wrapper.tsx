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
/* The intention of this component, is to wrap form elements (inputs, selects, etc.) with reusable
 * logic for labels, descriptions, error messages, and wiring up react-hook-form.
 * It has however become difficult to type properly. Should probably be rewritten or removed in future.
 */

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
                 ? (() => {
                    // Build props safely, only attaching handlers that the child supports
                    const mergedProps: Partial<TChildProps> = {
                      ...children.props,
                      ...(childProps ?? ({} as Partial<TChildProps>)),
                    };

                    // Always wire in standard form props when not overridden
                    (mergedProps as Record<string, unknown>).name = field.name;
                    (mergedProps as Record<string, unknown>).onBlur =
                      field.onBlur;
                    (mergedProps as Record<string, unknown>)["aria-required"] =
                      isRequired;
                    (mergedProps as Record<string, unknown>).variant =
                      variantProp;
                    (mergedProps as Record<string, unknown>)["data-error"] =
                      hasError;

                    // If child uses onValueChange (e.g., MultiSelect), don't attach value/onChange from RHF.
                    const usesOnValueChange =
                      "onValueChange" in
                        (children.props as Record<string, unknown>) ||
                      !!(
                        childProps && "onValueChange" in (childProps as object)
                      );

                    if (!usesOnValueChange) {
                      // Standard inputs/selects: attach value and onChange unless childProps override
                      const childProvidedValue = !!(
                        childProps && "value" in (childProps as object)
                      );
                      if (!childProvidedValue) {
                        (mergedProps as Record<string, unknown>).value =
                          field.value ?? "";
                      }

                      const childProvidedOnChange = !!(
                        childProps && "onChange" in (childProps as object)
                      );
                      if (!childProvidedOnChange) {
                        (mergedProps as Record<string, unknown>).onChange =
                          field.onChange;
                      }
                    }

                    // onValueChange: only attach if the child supports it already or childProps provided it
                    const childHasOnValueChange =
                      "onValueChange" in
                        (children.props as Record<string, unknown>) ||
                      !!(
                        childProps && "onValueChange" in (childProps as object)
                      );
                    if (childHasOnValueChange) {
                      (mergedProps as Record<string, unknown>).onValueChange =
                        childProps && "onValueChange" in (childProps as object)
                          ? (childProps as Record<string, unknown>)
                              .onValueChange
                          : field.onChange;
                    }

                    // ref: prefer child's provided ref (via childProps) if present, else RHF ref
                    const childProvidedRef = !!(
                      childProps &&
                      "ref" in (childProps as Record<string, unknown>)
                    );
                    (mergedProps as Record<string, unknown>).ref =
                      childProvidedRef
                        ? (childProps as Record<string, unknown>).ref
                        : field.ref;

                    return React.cloneElement(children, mergedProps);
                  })()
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
