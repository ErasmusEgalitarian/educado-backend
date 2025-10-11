import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { AppError } from "@/shared/types/app-error";

import { ErrorDisplay } from "../error/error-display";
import { GlobalLoader, GlobalLoaderProps } from "../global-loader";
import { useTranslation } from "react-i18next";

interface CardProps extends React.ComponentProps<"div"> {
  readonly isLoading?: boolean;
  readonly error?: AppError;

  /**
   * Props to pass to the GlobalLoader when isLoading is true
   */
  readonly loadingProps?: Omit<GlobalLoaderProps, "variant">;

  /**
   * Props to pass to ErrorDisplay when error is provided
   */
  readonly errorProps?: {
    readonly actions?: Array<{
      readonly label: string;
      readonly onClick: () => void;
      readonly variant?: "primary" | "outline" | "ghost" | "destructive";
    }>;
    readonly showDetails?: boolean;
  };
  readonly minHeight?: string;
}

function Card({
  className,
  isLoading = false,
  error,
  loadingProps,
  errorProps,
  minHeight = "200px",
  children,
  ...props
}: CardProps) {
  const { t } = useTranslation();
  // If loading, show loader inside card
  if (isLoading) {
    return (
      <div
        data-slot="card"
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-lg",
          className
        )}
        style={{ minHeight }}
        {...props}
      >
        <div className="flex items-center justify-center flex-1 px-6">
          <GlobalLoader
            variant="container"
            message={t("common.loading") + "..."}
            {...loadingProps}
          />
        </div>
      </div>
    );
  }

  // If error, show error display styled as card content
  if (error !== undefined) {
    return (
      <div
        data-slot="card"
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-lg",
          className
        )}
        style={{ minHeight }}
        {...props}
      >
        <div className="px-6">
          <ErrorDisplay
            error={error}
            variant="card"
            actions={errorProps?.actions}
            showDetails={errorProps?.showDetails}
            className="shadow-none border-none"
          />
        </div>
      </div>
    );
  }

  // Normal card rendering
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
