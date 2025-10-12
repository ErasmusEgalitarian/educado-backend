import { mdiRefresh } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

import { ErrorBoundary } from "../../components/error/error-boundary";
import { ErrorDisplay } from "../../components/error/error-display";
import { createAppError } from "../../lib/error-utilities";
import { AppError } from "../../types/app-error";

const RefreshIcon = () => <Icon path={mdiRefresh} size={1} />;

const ErrorDemo = () => {
  const [mutationError, setMutationError] = useState<AppError | undefined>(
    undefined
  );
  const [boundaryKey, setBoundaryKey] = useState(0);

  // Sample errors for demonstration
  const networkError = createAppError(
    "network",
    "Network Error",
    "Unable to connect to the server. Please check your internet connection.",
    {
      status: 0,
      details: "Failed to fetch resource from https://api.example.com/data",
    }
  );

  const validationError = createAppError(
    "validation",
    "Validation Error",
    "The form contains invalid data. Please review and correct the highlighted fields.",
    {
      status: 422,
      details: JSON.stringify(
        {
          errors: [
            { field: "email", message: "Invalid email format" },
            {
              field: "password",
              message: "Password must be at least 8 characters",
            },
          ],
        },
        null,
        2
      ),
    }
  );

  const authError = createAppError(
    "auth",
    "Authentication Required",
    "Your session has expired. Please log in again to continue.",
    {
      status: 401,
    }
  );

  const serverError = createAppError(
    "server",
    "Server Error",
    "An unexpected error occurred on the server. Our team has been notified.",
    {
      status: 500,
      details: "Internal Server Error: Database connection timeout",
    }
  );

  // Simulate mutation error
  const simulateMutationError = () => {
    setMutationError(validationError);
  };

  // Reset mutation
  const resetMutation = () => {
    setMutationError(undefined);
    toast.success("Mutation reset successfully");
  };

  // Component that throws error for ErrorBoundary demo
  const BuggyComponent = () => {
    throw new Error("This is a simulated error thrown by a component!");
  };

  const triggerBoundaryError = () => {
    setBoundaryKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Error Handling</h2>
        <p className="text-muted-foreground text-lg">
          Comprehensive error handling system with standardized error types,
          conversion utilities, and display components.
        </p>
      </div>

      {/* AppError Overview */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">AppError Type</h3>
        <p className="text-muted-foreground leading-relaxed">
          The{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            AppError
          </code>{" "}
          interface is a standardized error format used throughout the
          application. It provides a consistent structure for handling errors
          from various sources (API calls, network failures, validation errors,
          etc.).
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AppError Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`interface AppError {
  type: "network" | "validation" | "auth" | "server" | "unknown";
  status?: number;
  title: string;
  message: string;
  details?: string;
  stack?: string;
  request?: {
    url: string;
    method?: string;
    body?: unknown;
  };
  originalError?: unknown;
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Error Types</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong className="text-foreground">network</strong> - Connection
              failures, timeout errors
            </li>
            <li>
              <strong className="text-foreground">validation</strong> - Form
              validation, invalid input
            </li>
            <li>
              <strong className="text-foreground">auth</strong> - Authentication
              and authorization errors
            </li>
            <li>
              <strong className="text-foreground">server</strong> - 5xx server
              errors
            </li>
            <li>
              <strong className="text-foreground">unknown</strong> - Unexpected
              or unclassified errors
            </li>
          </ul>
        </div>
      </section>

      {/* Error Utilities */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Error Utilities</h3>
        <p className="text-muted-foreground leading-relaxed">
          The error utilities provide functions to convert any error type into a
          standardized{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            AppError
          </code>
          . This ensures consistent error handling across the application.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Utility Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <code className="bg-muted text-foreground rounded px-2 py-1 text-sm font-mono">
                toAppError(error: unknown): AppError | undefined
              </code>
              <p className="text-muted-foreground mt-2 text-sm">
                Converts any error type (ApiError, Error, Response, string) into
                a standardized AppError. Returns undefined if error is
                null/undefined.
              </p>
            </div>

            <div>
              <code className="bg-muted text-foreground rounded px-2 py-1 text-sm font-mono">
                createAppError(type, title, message, options?)
              </code>
              <p className="text-muted-foreground mt-2 text-sm">
                Creates a custom AppError for specific scenarios with full
                control over all properties.
              </p>
            </div>

            <div>
              <code className="bg-muted text-foreground rounded px-2 py-1 text-sm font-mono">
                getMutationError(error: unknown): AppError
              </code>
              <p className="text-muted-foreground mt-2 text-sm">
                Helper specifically for React Query mutations. Converts mutation
                errors to AppError.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`import { toAppError } from "@/shared/lib/error-utilities";

// In a query or mutation
const { data, error, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});

// Convert error to AppError
const appError = toAppError(error);

// Use in ErrorDisplay
<ErrorDisplay error={appError} variant="card" />`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* ErrorDisplay Component */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">ErrorDisplay Component</h3>
        <p className="text-muted-foreground leading-relaxed">
          The ErrorDisplay component provides three variants for displaying
          errors: page, card, and bar. Each variant is designed for different
          use cases.
        </p>

        <div className="space-y-6">
          {/* Bar Variant */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Bar Variant</h4>
            <p className="text-muted-foreground text-sm">
              Compact inline error display. Ideal for form errors or inline
              notifications.
            </p>
            <ErrorDisplay error={networkError} variant="bar" />
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<ErrorDisplay 
  error={appError} 
  variant="bar" 
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Card Variant */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Card Variant</h4>
            <p className="text-muted-foreground text-sm">
              Contained error display with optional actions. Perfect for
              section-level errors or failed data loads.
            </p>
            <ErrorDisplay
              error={validationError}
              variant="card"
              actions={[
                {
                  label: "Retry",
                  onClick: () => toast.info("Retry clicked"),
                  variant: "primary",
                },
                {
                  label: "Dismiss",
                  onClick: () => toast.info("Dismissed"),
                  variant: "outline",
                },
              ]}
            />
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<ErrorDisplay 
  error={appError} 
  variant="card"
  actions={[
    {
      label: "Retry",
      onClick: handleRetry,
      variant: "primary",
    },
  ]}
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Page Variant */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Page Variant</h4>
            <p className="text-muted-foreground text-sm">
              Full-page error display. Best for critical errors or failed page
              loads.
            </p>
            <div className="rounded-lg border">
              <ErrorDisplay
                error={serverError}
                variant="page"
                actions={[
                  {
                    label: "Go Home",
                    onClick: () => toast.info("Navigate to home"),
                    variant: "primary",
                  },
                ]}
              />
            </div>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<ErrorDisplay 
  error={appError} 
  variant="page"
  fullHeight
  actions={[
    {
      label: "Go Home",
      onClick: () => navigate("/"),
      variant: "primary",
    },
  ]}
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mutation Error Handling */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Handling Mutation Errors</h3>
        <p className="text-muted-foreground leading-relaxed">
          Common pattern for handling errors in React Query mutations with reset
          functionality.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Example</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={simulateMutationError}>
                Simulate Mutation Error
              </Button>
              <Button variant="outline" onClick={resetMutation}>
                Reset Mutation
              </Button>
            </div>

            {mutationError && (
              <ErrorDisplay
                error={mutationError}
                variant="bar"
                actions={[
                  {
                    label: "Dismiss",
                    onClick: resetMutation,
                  },
                ]}
              />
            )}

            <div className="bg-muted/30 rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Code Example</p>
              <pre className="overflow-x-auto text-sm">
                <code className="font-mono">{`const createMutation = useMutation({
  mutationFn: createCourse,
  onSuccess: () => {
    toast.success("Course created!");
  },
});

const mutationError = toAppError(createMutation.error);

// In your component
{mutationError && (
  <ErrorDisplay
    error={mutationError}
    variant="bar"
    actions={[
      {
        label: "Dismiss",
        onClick: () => createMutation.reset(),
      },
    ]}
  />
)}`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ErrorBoundary */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">ErrorBoundary Component</h3>
        <p className="text-muted-foreground leading-relaxed">
          React Error Boundary that catches JavaScript errors anywhere in the
          child component tree and displays them using the ErrorDisplay
          component.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`import { ErrorBoundary } from "@/shared/components/error/error-boundary";

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <CustomErrorUI error={error} onRetry={reset} />
  )}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interactive Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Click the button below to trigger a component error. The
              ErrorBoundary will catch it and display an error UI with recovery
              options.
            </p>

            <Button
              onClick={triggerBoundaryError}
              variant="destructive"
              icon={RefreshIcon}
              iconPlacement="left"
            >
              Trigger Error Boundary
            </Button>

            <div className="min-h-[200px] rounded-lg border">
              <ErrorBoundary
                key={boundaryKey}
                onError={(error, errorInfo) => {
                  console.error("ErrorBoundary caught:", error, errorInfo);
                }}
              >
                {boundaryKey > 0 ? (
                  <BuggyComponent />
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">
                      No error yet. Click the button above to trigger an error.
                    </p>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">💡 Best Practices</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>Place ErrorBoundary at route level or around major features</li>
            <li>Use onError callback to log errors to monitoring services</li>
            <li>Provide meaningful recovery actions (retry, go home, etc.)</li>
            <li>
              ErrorBoundary only catches render errors, not async or event
              handler errors
            </li>
          </ul>
        </div>
      </section>

      {/* All Error Types */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">All Error Types</h3>
        <p className="text-muted-foreground leading-relaxed">
          Overview of all error types with their visual representations.
        </p>

        <div className="space-y-4">
          <ErrorDisplay error={networkError} variant="card" />
          <ErrorDisplay error={validationError} variant="card" />
          <ErrorDisplay error={authError} variant="card" />
          <ErrorDisplay error={serverError} variant="card" />
          <ErrorDisplay
            error={createAppError(
              "unknown",
              "Unknown Error",
              "An unexpected error occurred. Please try again."
            )}
            variant="card"
          />
        </div>
      </section>

      {/* Props Reference */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">ErrorDisplay Props</h3>
        <div className="border-border overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-border border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Prop
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Default
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      error
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      AppError | undefined
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">-</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    The error to display
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      variant
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      &quot;page&quot; | &quot;card&quot; | &quot;bar&quot;
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      &quot;card&quot;
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Display variant
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      actions
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      ErrorAction[]
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      []
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Action buttons (retry, dismiss, etc.)
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      showDetails
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      boolean
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      false
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Show technical details in bar variant
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      fullHeight
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      boolean
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      false
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Take full viewport height (page variant only)
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      className
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      string
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">-</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Custom className for styling
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorDemo;
