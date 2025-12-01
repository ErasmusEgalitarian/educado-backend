/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

import { GlobalLoader } from "@/shared/components/global-loader";
import { Button } from "@/shared/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

const GlobalLoaderDemo = () => {
  const [showFullHeight, setShowFullHeight] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          GlobalLoader Component
        </h2>
        <p className="text-muted-foreground text-lg">
          A consistent loading indicator component with multiple variants for
          different use cases throughout the application.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">
          The GlobalLoader component provides a unified way to display loading
          states across the application. It features three variants optimized
          for different scenarios: a simple spinner, an inline loader with text,
          and a full container layout.
        </p>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Key Features</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>Three variants: spinner, inline, and container</li>
            <li>Consistent spinning animation using MDI icons</li>
            <li>Customizable messages and descriptions</li>
            <li>Optional full-height viewport mode</li>
            <li>Integrates seamlessly with Card component</li>
          </ul>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Variants</h3>

        <div className="space-y-6">
          {/* Spinner Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spinner Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                A simple spinning icon. Use this when you need a minimal loading
                indicator.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">Preview:</p>
                <div className="bg-muted/50 flex items-center justify-center rounded-lg border p-8">
                  <GlobalLoader variant="spinner" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Code:</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<GlobalLoader variant="spinner" />`}</code>
                </pre>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Custom Size:</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<GlobalLoader variant="spinner" size={2} />`}</code>
                </pre>
                <div className="bg-muted/50 flex items-center justify-center rounded-lg border p-8">
                  <GlobalLoader variant="spinner" size={2} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inline Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inline Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Spinner with a message next to it. Perfect for inline loading
                states within components.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">Preview:</p>
                <div className="bg-muted/50 flex items-center justify-center rounded-lg border p-8">
                  <GlobalLoader variant="inline" message="Loading data..." />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Code:</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<GlobalLoader 
  variant="inline" 
  message="Loading data..." 
/>`}</code>
                </pre>
              </div>

              <div className="bg-blue-500/10 border-blue-500/20 rounded border p-3 text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400">
                  💡 Use Case
                </p>
                <p className="text-muted-foreground mt-1">
                  Great for showing loading state within buttons, form sections,
                  or list items.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Container Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Container Variant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Full container with centered spinner, title, and optional
                description. Best for page-level or card-level loading states.
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium">Preview (Basic):</p>
                <div
                  className="bg-muted/50 rounded-lg border"
                  style={{ minHeight: "200px" }}
                >
                  <GlobalLoader
                    variant="container"
                    message="Loading course data..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Code (Basic):</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<GlobalLoader 
  variant="container" 
  message="Loading course data..." 
/>`}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Preview (With Description):
                </p>
                <div
                  className="bg-muted/50 rounded-lg border"
                  style={{ minHeight: "250px" }}
                >
                  <GlobalLoader
                    variant="container"
                    title="Loading Course Data"
                    description="Please wait while we fetch your courses and their details..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Code (With Description):</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<GlobalLoader 
  variant="container" 
  title="Loading Course Data"
  description="Please wait while we fetch your courses..."
/>`}</code>
                </pre>
              </div>

              <div className="bg-blue-500/10 border-blue-500/20 rounded border p-3 text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400">
                  💡 Full Height Mode
                </p>
                <p className="text-muted-foreground mt-1">
                  Add <code className="bg-muted rounded px-1">fullHeight</code>{" "}
                  prop to center content in the full viewport. Useful for
                  page-level loading.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setShowFullHeight(true);
                  }}
                >
                  See Full Height Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Props Reference */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Props Reference</h3>
        <div className="border-border overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Property
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
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      variant
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    "spinner" | "inline" | "container"
                  </td>
                  <td className="px-4 py-3 text-sm">"spinner"</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Display variant
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      message
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Text for inline variant or title for container
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      title
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Title for container variant (overrides message)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      description
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Description text for container variant
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      fullHeight
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">boolean</td>
                  <td className="px-4 py-3 text-sm">false</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Use full viewport height (container variant only)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      size
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">number</td>
                  <td className="px-4 py-3 text-sm">1</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Size multiplier for the spinner icon
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                      className
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">string</td>
                  <td className="px-4 py-3 text-sm">-</td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Additional CSS classes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Real-World Usage Patterns</h3>
        <p className="text-muted-foreground leading-relaxed">
          Here are two common patterns used in the Educado application for
          handling loading states with TanStack Query.
        </p>

        <div className="space-y-4">
          {/* Pattern 1: Blocking Page-Level Loading */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Pattern 1: Blocking Page-Level Loading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                When fetching critical data that blocks the entire page (e.g.,
                editing a course requires the course data to be loaded first).
                This pattern is used in the Course Editor page.
              </p>

              <div className="bg-yellow-500/10 border-yellow-500/20 rounded border p-3 text-sm">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">
                  📌 Use Case
                </p>
                <p className="text-muted-foreground mt-1">
                  The user is editing a course. We need the course data fetched
                  to pre-fill the form, including possible relations. Without
                  this data, the page cannot function.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Implementation:</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`// Fetch the course data with TanStack Query
const { 
  data: queryCourse, 
  error: queryError, 
  isLoading: queryIsLoading, 
  refetch 
} = useQuery({
  ...CourseQueryFunction(actualCourseId ?? ""),
  enabled: isEditMode, // Only run query in edit mode
});

// Handle loading and error states before rendering
const getSectionComponent = () => {
  // Error state - show error with retry action
  if (queryError) {
    const appError = toAppError(queryError);
    console.error("Error loading course:", appError);

    return (
      <ErrorDisplay
        error={appError}
        variant="page"
        actions={[
          {
            label: t("common.retry"),
            onClick: () => void refetch(),
            variant: "primary",
          },
        ]}
      />
    );
  }

  // Loading state - show loader
  if (queryIsLoading && isEditMode) {
    return (
      <GlobalLoader
        variant="container"
        message={\`\${t("common.loading")} \${t("courses.course").toLowerCase()}...\`}
      />
    );
  }

  // Data is ready - render the form
  return <CourseEditorForm course={queryCourse} />;
};`}</code>
                </pre>
              </div>

              <div className="bg-green-500/10 border-green-500/20 rounded border p-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  ✓ Why This Works
                </p>
                <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                  <li>Blocks the entire section until data is ready</li>
                  <li>Clear error handling with retry option</li>
                  <li>User understands what's happening (loading message)</li>
                  <li>Prevents partial/broken UI states</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pattern 2: Card-Level Loading Boundary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Pattern 2: Card-Level Loading Boundary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                When fetching supplementary data for a form (e.g., categories
                for a multi-select). Uses the Card component's built-in loading
                and error states to create a boundary layer.
              </p>

              <div className="bg-yellow-500/10 border-yellow-500/20 rounded border p-3 text-sm">
                <p className="font-medium text-yellow-700 dark:text-yellow-400">
                  📌 Use Case
                </p>
                <p className="text-muted-foreground mt-1">
                  In the Course Editor, categories are a separate relation in
                  Strapi. When editing, we need to query all available
                  categories to populate a multi-select dropdown. This uses
                  usePaginatedData (which wraps TanStack Query).
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Implementation:</p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`// Fetch categories with usePaginatedData hook
const {
  data,
  error: categoriesError,
  isLoading: categoriesLoading,
  refetch: refetchCategories,
} = usePaginatedData<CourseCategory>({
  mode: "standalone",
  queryKey: ["course-categories"],
  urlPath: "/course-categories",
  fields: ["name"],
  config: {
    renderMode: "client", // Fetch all categories at once
  },
});

// Pass loading/error states to Card component
<Card
  isLoading={categoriesLoading}
  error={toAppError(categoriesError)}
  loadingProps={{
    message: t("common.loading") + "...",
    description: "Please wait while we fetch the available course categories...",
  }}
  errorProps={{
    actions: [
      {
        label: t("common.retry"),
        onClick: () => void refetchCategories(),
        variant: "primary",
      },
    ],
  }}
>
  <Form {...form}>
    {/* Form content with categories multi-select */}
    <FormMultiSelect
      control={form.control}
      fieldName="categories"
      label={t("categories.categories")}
      disabled={categoriesLoading || !!categoriesError}
      options={data.map((category) => ({
        label: category.name,
        value: category.documentId,
      }))}
    />
  </Form>
</Card>`}</code>
                </pre>
              </div>

              <div className="bg-green-500/10 border-green-500/20 rounded border p-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  ✓ Why This Works
                </p>
                <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                  <li>
                    Card component creates a visual boundary for the
                    loading/error state
                  </li>
                  <li>GlobalLoader is automatically used inside the Card</li>
                  <li>
                    ErrorDisplay is automatically shown if there's an error
                  </li>
                  <li>Easy to catch errors during rapid development</li>
                  <li>
                    Can be refined later to show spinner only on the input
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border-blue-500/20 rounded border p-3 text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-400">
                  💡 Development Note
                </p>
                <p className="text-muted-foreground mt-1">
                  Currently blocks the entire Card to catch errors during fast
                  development. Can later be changed to only show a spinner on
                  the multi-select input and display errors below the form.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration with Card */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">
          Integration with Card Component
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          The Card component has built-in support for GlobalLoader through its{" "}
          <code className="bg-muted rounded px-1.5 py-0.5">isLoading</code> prop
          and{" "}
          <code className="bg-muted rounded px-1.5 py-0.5">loadingProps</code>.
        </p>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm font-medium">Example:</p>
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`<Card
  isLoading={isLoading}
  loadingProps={{
    message: "Loading data...",
    description: "Please wait while we fetch your information.",
  }}
>
  {/* Card content */}
</Card>`}</code>
            </pre>
            <p className="text-muted-foreground text-sm">
              When <code className="bg-muted rounded px-1">isLoading</code> is
              true, the Card automatically renders a GlobalLoader with container
              variant instead of the children.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Best Practices</h3>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                1. Choose the Right Variant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                <li>
                  <strong>spinner</strong> - Minimal loading indicator in tight
                  spaces
                </li>
                <li>
                  <strong>inline</strong> - Loading state within a component or
                  list item
                </li>
                <li>
                  <strong>container</strong> - Page or card-level loading with
                  context
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                2. Provide Clear Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Always provide informative messages that tell users what's being
              loaded. Use i18n translations for consistency.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                3. Pair with Error Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Always handle the error state alongside loading. Use ErrorDisplay
              component with retry actions for better UX.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                4. Use Card Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Leverage the Card component's built-in loading/error support for
              cleaner code and consistent boundaries.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Full Height Modal */}
      {showFullHeight && (
        <div className="fixed inset-0 z-50 bg-background">
          <GlobalLoader
            variant="container"
            fullHeight
            title="Full Height Example"
            description="This loader takes up the entire viewport height and centers the content vertically and horizontally."
          />
          <Button
            variant="outline"
            className="fixed top-4 right-4"
            onClick={() => {
              setShowFullHeight(false);
            }}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default GlobalLoaderDemo;
