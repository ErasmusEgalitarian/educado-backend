import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { InputSize } from "./form";

export interface InputIconProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface InputProps extends React.ComponentProps<"input">, InputIconProps {
  variant?: "default" | "error";
  readonly inputSize?: InputSize;
  // label prop kept (no floating behavior now) — remove if unused elsewhere
  label?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "default",
      inputSize = "md",
      startIcon,
      endIcon,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "border-[#c1cfd7] focus-visible:border-[#35a1b1] focus-visible:ring-[#35a1b1]/20",
      error:
        "border-[#ff0000] bg-[#ff0000]/10 focus-visible:border-[#ff0000] focus-visible:ring-[#ff0000]/20",
    };

    const inputSizes = {
      xs: "h-6 px-2 py-1 text-sm",
      sm: "h-8 px-2.5 py-1.5 text-sm",
      md: "h-10 px-3 py-2 text-base",
      lg: "h-12 px-4 py-3 text-lg",
    };

    const element = (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-[#628397] selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-base text-[#141b1f] shadow-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#c1cfd7]/20",
          "focus-visible:ring-[3px]",
          variantStyles[variant],
          inputSizes[inputSize],
          startIcon && "pl-10",
          endIcon && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (!startIcon && !endIcon) {
      return element;
    }

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {startIcon && (
          <div
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6879] pointer-events-none [&>svg]:w-5 [&>svg]:h-5"
          >
            {startIcon}
          </div>
        )}
        {element}
        {endIcon && (
          <div
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4e6879] [&>svg]:w-5 [&>svg]:h-5"
          >
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
