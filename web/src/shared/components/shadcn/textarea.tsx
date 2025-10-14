import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { InputSize } from "./form";

function Textarea({
  className,
  variant = "default",
  inputSize = "md",
  ...props
}: React.ComponentProps<"textarea"> & { variant?: "default" | "error" } & {
  inputSize?: InputSize;
}) {
  const variantStyles = {
    default:
      "border-greyscale-border-lighter focus-visible:border-primary-surface-default focus-visible:ring-primary-surface-default/20",
    error:
      "border-error-border-default bg-error-surface-subtle focus-visible:border-error-surface-default focus-visible:ring-error-surface-default/20",
  };
  const inputSizes = {
    xs: "p-2 text-sm",
    sm: "p-3 text-sm",
    md: "p-4 text-base",
    lg: "p-5 text-lg",
  };
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-greyscale-text-caption text-greyscale-text-title dark:bg-input/30 block min-h-24 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 !resize-y",
        variantStyles[variant],
        inputSizes[inputSize],
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
