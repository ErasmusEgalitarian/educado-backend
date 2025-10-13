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
      "border-geryscale-border-lighter focus-visible:border-[#35a1b1] focus-visible:ring-[#35a1b1]/20",
    error:
      "border-error-border-default bg-error-surface-subtle focus-visible:border-[#ff0000] focus-visible:ring-[#ff0000]/20",
  };
  const inputSizes = {
    xs: "h-6 px-2 py-1 text-sm",
    sm: "h-8 px-2.5 py-1.5 text-sm",
    md: "h-10 px-3 py-2 text-base",
    lg: "h-12 px-4 py-3 text-lg",
  };
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variantStyles[variant],
        inputSizes[inputSize],
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
