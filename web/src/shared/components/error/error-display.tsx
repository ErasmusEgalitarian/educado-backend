import {
  mdiWifiOff,
  mdiAlertCircle,
  mdiShieldAlert,
  mdiServerNetwork,
  mdiCloseCircle,
  mdiChevronDown,
  mdiChevronUp,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { AppError } from "@/shared/types/app-error";

import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert";
import { Button } from "../shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible";

interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost" | "destructive";
}

interface ErrorDisplayProps {
  error: AppError | undefined;
  variant?: "page" | "card" | "bar";
  /** Actions like retry, reset mutation, go home, etc. */
  actions?: ErrorAction[];
  /** Show technical details (defaults to false) */
  showDetails?: boolean;
  /** Custom className for additional styling */
  className?: string;
  /** For page variant: whether to take full viewport height (default: false) */
  fullHeight?: boolean;
}

const errorIconPaths = {
  network: mdiWifiOff,
  validation: mdiAlertCircle,
  auth: mdiShieldAlert,
  server: mdiServerNetwork,
  unknown: mdiCloseCircle,
};

export const ErrorDisplay = ({
  error,
  variant = "card",
  actions = [],
  showDetails = false,
  className,
  fullHeight = false,
}: ErrorDisplayProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Early return null if no error is provided
  if (error == undefined) return null;

  const iconPath = errorIconPaths[error.type];

  const getErrorJson = () => {
    return JSON.stringify(
      {
        type: error.type,
        status: error.status,
        title: error.title,
        message: error.message,
        details: error.details,
        stack: error.stack,
        request: error.request,
        originalError: error.originalError,
      },
      null,
      2,
    );
  };

  // Page variant - full page error
  if (variant === "page") {
    return (
      <div
        className={cn(
          "flex items-center justify-center p-4",
          fullHeight && "min-h-screen",
          className,
        )}
      >
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-[#d8eff3] p-6">
              <Icon path={iconPath} size={2} className="text-[#d62b25]" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance text-[#141b1f]">
              {error.title}
            </h1>
            <p className="text-[#4e6879] text-pretty">{error.message}</p>
            {error.status !== undefined && (
              <p className="text-sm text-[#628397]">
                Error Code: {error.status}
              </p>
            )}
          </div>

          <Collapsible
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-[#4e6879] hover:text-[#246670]"
              >
                <span className="text-sm">Technical Details</span>
                <Icon
                  path={isDetailsOpen ? mdiChevronUp : mdiChevronDown}
                  size={0.8}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="rounded-lg bg-[#28363e] p-4 text-left max-h-96 overflow-auto">
                <pre className="text-xs font-mono text-[#87ced9] whitespace-pre-wrap break-all">
                  {getErrorJson()}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {actions.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    action.onClick();
                  }}
                  variant={action.variant ?? "primary"}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Card variant - contained error display
  if (variant === "card") {
    return (
      <Card className={cn("w-full border-[#c1cfd7]", className)}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-[#d8eff3] p-2">
              <Icon path={iconPath} size={1} className="text-[#d62b25]" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-balance text-[#141b1f]">
                {error.title}
              </CardTitle>
              <CardDescription className="text-pretty text-[#4e6879]">
                {error.message}
              </CardDescription>
              {error.status !== undefined && (
                <p className="text-xs text-[#628397]">
                  Error Code: {error.status}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Collapsible
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-[#4e6879] hover:text-[#246670] h-9"
              >
                <span className="text-sm">Technical Details</span>
                <Icon
                  path={isDetailsOpen ? mdiChevronUp : mdiChevronDown}
                  size={0.7}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="rounded-md bg-[#28363e] p-3 max-h-64 overflow-auto">
                <pre className="text-xs font-mono text-[#87ced9] whitespace-pre-wrap break-all">
                  {getErrorJson()}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>

        {actions.length > 0 && (
          <CardFooter className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.onClick();
                }}
                variant={action.variant ?? "outline"}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </CardFooter>
        )}
      </Card>
    );
  }

  // Bar variant - compact inline error
  return (
    <Alert
      variant="destructive"
      className={cn(
        "bg-error-surface-default/10 border-error-surface-default",
        className,
      )}
    >
      <Icon path={iconPath} size={0.7} className="text-error-surface-default" />
      <AlertTitle className="text-sm font-semibold text-error-surface-default">
        {error.title}
      </AlertTitle>
      <AlertDescription className="space-y-2 text-error-surface-default">
        <p className="text-pretty">{error.message}</p>
        {error.status !== undefined && (
          <p className="text-xs opacity-80">Error Code: {error.status}</p>
        )}
        {showDetails && error.details !== undefined && (
          <p className="text-xs font-mono opacity-80 break-all">
            {error.details}
          </p>
        )}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  action.onClick();
                }}
                variant={action.variant ?? "outline"}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Convenience wrapper for common retry action
export const ErrorDisplayWithRetry = ({
  error,
  variant = "card",
  onRetry,
  additionalActions = [],
  ...props
}: Omit<ErrorDisplayProps, "actions"> & {
  onRetry?: () => void;
  additionalActions?: ErrorAction[];
}) => {
  const actions: ErrorAction[] = onRetry
    ? [
        { label: "Try Again", onClick: onRetry, variant: "primary" as const },
        ...additionalActions,
      ]
    : additionalActions;

  return (
    <ErrorDisplay
      error={error}
      variant={variant}
      actions={actions}
      {...props}
    />
  );
};
