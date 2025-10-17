"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Control,
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/shadcn/label";

import Icon from "@mdi/react";
import { mdiInformationOutline } from "@mdi/js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

// Size for inputs. Both for form elements, but also input primitives themselves
export type InputSize = "xs" | "sm" | "md" | "lg";

/* -------------- Custom interface for all form-xxx components -------------- */
interface FormElementProps<TFieldValues extends FieldValues> {
  readonly inputSize?: InputSize;
  // RHF wiring
  readonly control: Control<TFieldValues>;
  readonly fieldName: FieldPath<TFieldValues>;

  // Container-level (FormItem) styling, not the input element itself
  readonly wrapperClassName?: string;

  // Cross-input UI metadata
  readonly label?: string;
  readonly labelAction?: React.ReactNode;
  readonly description?: string | string[];
  readonly isRequired?: boolean; // visual + aria; validation lives in schema
  readonly hintTooltip?: string;
}

/* ------------------------------- Shadcn Form ------------------------------ */

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("", className)} {...props} />
    </FormItemContext.Provider>
  );
}

type FormLabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  inputSize?: InputSize;
  // Visually indicate if required. Does not enforce, use validation for that.
  required?: boolean;
  // Override the default asterisk with custom content
  requiredIndicator?: React.ReactNode;
  // If provided, show an info icon with this text as a tooltip
  hintTooltip?: string;
};

function FormLabel({
  inputSize = "md",
  className,
  required,
  requiredIndicator,
  hintTooltip,
  children,
  ...props
}: FormLabelProps) {
  const { error, formItemId } = useFormField();

  const textSize = {
    xs: "font-[600] text-[12px]",
    sm: "font-[600] text-[16px]",
    md: "font-[600] text-[16px]",
    lg: "font-[600] text-[24px]",
  };

  const hintIconSize = {
    xs: "16px",
    sm: "20px",
    md: "24px",
    lg: "28px",
  };

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      data-required={!!required}
      className={cn(
        "data-[error=true]:text-destructive mb-1",
        textSize[inputSize],
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {/* Visual indicator for required fields */}
      {required ? (
        <span aria-hidden="true" className="text-destructive">
          {requiredIndicator ?? "*"}
        </span>
      ) : null}
      {/* Screen reader only text to indicate required fields */}
      {required ? <span className="sr-only"> (required)</span> : null}
      {/* Tooltip for additional info */}
      {hintTooltip && (
        <Tooltip>
          <TooltipTrigger>
            <Icon
              className="text-blue-500"
              path={mdiInformationOutline}
              size={hintIconSize[inputSize]}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{hintTooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

/* -------- For showing a description as string, or a list of bullets ------- */

function FormDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  // If children is an array of strings, render a small bullet list; otherwise a paragraph
  const isStringArray =
    Array.isArray(children) &&
    (children as unknown[]).every((c: unknown) => typeof c === "string");

  if (isStringArray) {
    const items = children as string[];
    return (
      <ul
        data-slot="form-description"
        id={formDescriptionId}
        className={cn(
          "text-muted-foreground mt-1 space-y-1 text-xs",
          className
        )}
      >
        {items.map((item) => (
          <li
            key={item}
            className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/* ----------------- For showing error messages below inputs ---------------- */

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
export type { FormElementProps };
