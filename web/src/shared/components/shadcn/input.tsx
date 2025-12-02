import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { InputSize } from "./form";

export interface InputIconProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
>;

interface InputProps extends React.ComponentProps<"input">, InputIconProps {
  variant?: "default" | "error";
  readonly inputSize?: InputSize;
  // label prop kept (no floating behavior now) — remove if unused elsewhere
  label?: string;
  containerClassName?: string;

   onValueChange?: (value: string) => void;

    childProps?: any;

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
      onChange,        
      onValueChange,
      ...rest            
    },
    ref
  ) => {
    const variantStyles = {
      default:
        "border-greyscale-border-default focus-visible:border-primary-surface-default focus-visible:ring-primary-surface-default/20",
      error:
        "border-error-border-default bg-error-surface-subtle focus-visible:border-error-surface-default focus-visible:ring-error-surface-default/20",
    };

    const inputSizes = {
      xs: "h-7 px-2 py-1 text-xs",
      sm: "h-8 px-3 py-1.5 text-sm",
      md: "h-9 px-3 py-2 text-sm",
      lg: "h-10 px-4 py-2.5 text-base",
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      onChange?.(e);                    
      onValueChange?.(e.target.value);   
    };

    const element = (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        onChange={handleChange}          
        className={cn(
          "file:text-foreground placeholder:text-greyscale-text-caption selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-white text-greyscale-text-title shadow-xs transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-greyscale-surface-disabled/20",
          "focus-visible:ring-[3px]",
          variantStyles[variant],
          inputSizes[inputSize],
          startIcon && "pl-10",
          endIcon && "pr-10",
          className
        )}
        {...rest}                         
      />
    );

    if (!startIcon && !endIcon) return element;

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {startIcon && (
          <div
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-greyscale-text-subtle pointer-events-none [&>svg]:w-5 [&>svg]:h-5"
          >
            {startIcon}
          </div>
        )}
        {element}
        {endIcon && (
          <div
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-greyscale-text-subtle [&>svg]:w-5 [&>svg]:h-5"
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
