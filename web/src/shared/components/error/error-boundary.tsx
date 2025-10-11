import React, { Component, ErrorInfo, ReactNode } from "react";

import { toAppError } from "@/shared/lib/error-utilities";
import { AppError } from "@/shared/types/app-error";

import { ErrorDisplay } from "./error-display";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback UI - if not provided, uses default ErrorDisplay */
  fallback?: (error: AppError, reset: () => void) => ReactNode;
  /** Callback when error is caught */
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  /** Custom reset handler - called when user clicks retry */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: AppError | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 * Converts errors to AppError format and displays them using ErrorDisplay
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={(error, reset) => <CustomErrorUI error={error} onRetry={reset} />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    // Convert the error to AppError format
    return { error: toAppError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Convert to AppError and call onError callback if provided
    const appError = toAppError(error);

    // Add component stack to details
    const componentStack = `Component Stack:\n${errorInfo.componentStack ?? ""}`;
    const hasDetails =
      appError.details !== undefined && appError.details.trim() !== "";
    const enhancedError: AppError = {
      ...appError,
      details: hasDetails
        ? `${String(appError.details)}\n\n${componentStack}`
        : componentStack,
    };

    this.props.onError?.(enhancedError, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): React.ReactElement | null {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error !== null) {
      // Use custom fallback if provided
      if (fallback !== undefined) {
        return <>{fallback(error, this.handleReset)}</>;
      }

      // Default error display
      return (
        <ErrorDisplay
          error={error}
          variant="page"
          actions={[
            {
              label: "Try Again",
              onClick: this.handleReset,
              variant: "primary",
            },
            {
              label: "Go Home",
              onClick: () => {
                window.location.href = "/";
              },
              variant: "outline",
            },
          ]}
        />
      );
    }

    return <>{children}</>;
  }
}

/**
 * Hook-based alternative for using error boundaries
 * Wraps children in ErrorBoundary with sensible defaults
 */
interface WithErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
}

export const WithErrorBoundary: React.FC<WithErrorBoundaryProps> = ({
  children,
  onError,
}) => {
  return <ErrorBoundary onError={onError}>{children}</ErrorBoundary>;
};
