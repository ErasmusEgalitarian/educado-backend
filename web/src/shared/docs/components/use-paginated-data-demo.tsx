import { useState } from "react";

import { Badge } from "@/shared/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn/select";

const UsePaginatedDataDemo = () => {
  const [selectedMode, setSelectedMode] = useState<string>("auto");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          usePaginatedData Hook
        </h2>
        <p className="text-muted-foreground text-lg">
          A powerful React hook for fetching and managing paginated data with
          automatic optimization based on dataset size and usage patterns.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">
          The{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            usePaginatedData
          </code>{" "}
          hook is a versatile data-fetching solution that intelligently handles
          pagination, sorting, and filtering. It can operate in two modes:
          integrated with TanStack Table or standalone for simpler use cases
          like dropdowns and lists.
        </p>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Key Features</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>Automatic render mode detection (client vs server)</li>
            <li>Support for both integrated and standalone usage modes</li>
            <li>Intelligent caching with React Query</li>
            <li>Strapi-compatible API integration</li>
            <li>Built-in pagination state management</li>
            <li>Optimized for performance with placeholderData</li>
          </ul>
        </div>
      </section>

      {/* Usage Modes */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Usage Modes</h3>
        <p className="text-muted-foreground leading-relaxed">
          The hook supports two distinct usage patterns, each optimized for
          different scenarios.
        </p>

        <div className="space-y-4">
          {/* Integrated Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integrated Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Use this when integrating with TanStack Table. The parent
                component manages all table state (pagination, sorting,
                filtering) and passes it to the hook.
              </p>

              <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium">When to use:</p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                  <li>Building data tables with sorting and filtering</li>
                  <li>Using the DataDisplay component</li>
                  <li>Need full TanStack Table features</li>
                </ul>
              </div>

              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`const table = useReactTable({
  data,
  columns,
  state: {
    pagination,
    sorting,
    columnFilters,
    globalFilter,
  },
  // ... other table options
});

const { data, isLoading, extendedPagination } = usePaginatedData({
  mode: "integrated",
  urlPath: "/courses",
  queryKey: ["courses"],
  tableState: {
    pagination: table.getState().pagination,
    sorting: table.getState().sorting,
    columnFilters: table.getState().columnFilters,
    globalFilter: table.getState().globalFilter,
  },
  fields: ["title", "difficulty"],
  populate: ["course_categories"],
  config: {
    renderMode: "auto",
    clientModeThreshold: 50,
  },
});`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Standalone Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Standalone Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Use this for simpler use cases where you don&apos;t need full
                table functionality. The hook manages its own pagination state
                internally.
              </p>

              <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
                <p className="mb-2 text-sm font-medium">When to use:</p>
                <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
                  <li>Fetching data for dropdowns or select inputs</li>
                  <li>Simple paginated lists without sorting</li>
                  <li>Loading all items at once (with client mode)</li>
                  <li>Building custom pagination UIs</li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Example: Dropdown/Multi-Select
                </p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`// Fetch all categories for a multi-select
const { data, isLoading, error } = usePaginatedData({
  mode: "standalone",
  queryKey: ["course-categories"],
  urlPath: "/course-categories",
  fields: ["name"],
  config: {
    renderMode: "client", // Fetch all at once
  },
});

// Use in FormMultiSelect
<FormMultiSelect
  control={form.control}
  fieldName="categories"
  label="Categories"
  disabled={isLoading || !!error}
  options={data.map((category) => ({
    label: category.name,
    value: category.documentId,
  }))}
/>`}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Example: Paginated List with Manual Controls
                </p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`const {
  data,
  isLoading,
  extendedPagination,
  setPagination,
} = usePaginatedData({
  mode: "standalone",
  urlPath: "/users",
  initialPageSize: 25,
  config: {
    renderMode: "server", // Server-side pagination
  },
});

// Custom pagination controls
<button
  onClick={() =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex - 1,
    }))
  }
  disabled={extendedPagination.pageIndex === 0}
>
  Previous
</button>
<span>
  Page {extendedPagination.pageIndex + 1} of{" "}
  {extendedPagination.totalPages}
</span>
<button
  onClick={() =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }))
  }
  disabled={
    extendedPagination.pageIndex ===
    extendedPagination.totalPages - 1
  }
>
  Next
</button>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Render Modes - The Core Feature */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Render Modes (Core Feature)</h3>
        <p className="text-muted-foreground leading-relaxed">
          The hook&apos;s most powerful feature is its ability to automatically
          optimize data fetching based on dataset size. This happens
          transparently and can dramatically improve performance.
        </p>

        <div className="bg-yellow-500/10 border-yellow-500/20 mb-4 rounded-lg border p-4">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
            ⚡ Performance Impact
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Choosing the right render mode can mean the difference between a
            snappy interface and a sluggish one. The hook defaults to{" "}
            <strong>&quot;auto&quot;</strong> mode which intelligently decides
            for you.
          </p>
        </div>

        {/* Interactive Selector */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              Interactive Mode Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Select a mode:</span>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Mode</SelectItem>
                  <SelectItem value="client">Client Mode</SelectItem>
                  <SelectItem value="server">Server Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedMode === "auto" && (
              <div className="space-y-3 rounded-lg border bg-white p-4 dark:bg-slate-950">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary">Recommended</Badge>
                  <Badge variant="outline">Default</Badge>
                </div>
                <h4 className="font-semibold">Auto Mode</h4>
                <p className="text-muted-foreground text-sm">
                  Automatically detects the optimal mode based on total item
                  count. Makes an initial detection query to check dataset size,
                  then switches to either client or server mode.
                </p>

                <div className="bg-muted/30 space-y-2 rounded p-3">
                  <p className="text-sm font-medium">How it works:</p>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1 text-sm">
                    <li>Makes a lightweight API call fetching just 1 item</li>
                    <li>Checks the total count from response metadata</li>
                    <li>
                      If total ≤ threshold (default: 10,000): switches to client
                      mode
                    </li>
                    <li>If total &gt; threshold: uses server mode</li>
                  </ol>
                </div>

                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`config: {
  renderMode: "auto",
  clientModeThreshold: 50, // Use client if ≤ 50 items
}`}</code>
                </pre>

                <div className="bg-green-500/10 border-green-500/20 rounded border p-3">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ Best for:
                  </p>
                  <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                    <li>Unknown or variable dataset sizes</li>
                    <li>Most production scenarios</li>
                    <li>
                      When you want optimal performance without manual tuning
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {selectedMode === "client" && (
              <div className="space-y-3 rounded-lg border bg-white p-4 dark:bg-slate-950">
                <Badge variant="secondary">Small Datasets</Badge>
                <h4 className="font-semibold">Client Mode</h4>
                <p className="text-muted-foreground text-sm">
                  Fetches ALL data in a single API call and handles sorting,
                  filtering, and pagination in the browser using TanStack Table.
                </p>

                <div className="bg-muted/30 space-y-2 rounded p-3">
                  <p className="text-sm font-medium">Process:</p>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1 text-sm">
                    <li>Single API request fetches entire dataset</li>
                    <li>Data is cached in React Query</li>
                    <li>TanStack Table handles all operations in-memory</li>
                    <li>
                      No additional API calls for sorting, filtering, or
                      pagination
                    </li>
                  </ol>
                </div>

                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`config: {
  renderMode: "client",
}
// Default threshold: 10,000 items`}</code>
                </pre>

                <div className="space-y-3">
                  <div className="bg-green-500/10 border-green-500/20 rounded border p-3">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      ✓ Advantages:
                    </p>
                    <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                      <li>
                        <strong>Instant operations</strong> - Sorting and
                        filtering happen immediately
                      </li>
                      <li>
                        <strong>Reduced server load</strong> - Only one API call
                      </li>
                      <li>
                        <strong>Better UX</strong> - No loading states when
                        changing pages/filters
                      </li>
                      <li>
                        <strong>Offline capable</strong> - Data cached locally
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-500/10 border-red-500/20 rounded border p-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      ✗ Limitations:
                    </p>
                    <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                      <li>
                        <strong>Memory usage</strong> - Entire dataset in
                        browser memory
                      </li>
                      <li>
                        <strong>Initial load time</strong> - Slower first load
                        for large datasets
                      </li>
                      <li>
                        <strong>Not suitable for huge datasets</strong> - Can
                        cause browser slowdown
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 border-blue-500/20 rounded border p-3">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    💡 Recommended for:
                  </p>
                  <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                    <li>Datasets with &lt; 1,000 items</li>
                    <li>Dropdowns and select inputs (fetch all options)</li>
                    <li>Reference data that rarely changes</li>
                    <li>When users frequently filter/sort the same data</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedMode === "server" && (
              <div className="space-y-3 rounded-lg border bg-white p-4 dark:bg-slate-950">
                <Badge variant="secondary">Large Datasets</Badge>
                <h4 className="font-semibold">Server Mode</h4>
                <p className="text-muted-foreground text-sm">
                  Makes API requests for each page, sort, or filter operation.
                  The server handles all data processing and returns only the
                  requested page.
                </p>

                <div className="bg-muted/30 space-y-2 rounded p-3">
                  <p className="text-sm font-medium">Process:</p>
                  <ol className="text-muted-foreground ml-4 list-decimal space-y-1 text-sm">
                    <li>
                      API call includes pagination, sorting, filtering params
                    </li>
                    <li>
                      Server processes query and returns single page of results
                    </li>
                    <li>
                      Each user action (page change, sort, filter) triggers new
                      API call
                    </li>
                    <li>TanStack Table manages UI state only</li>
                  </ol>
                </div>

                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`config: {
  renderMode: "server",
}
// Forces server-side processing`}</code>
                </pre>

                <div className="space-y-3">
                  <div className="bg-green-500/10 border-green-500/20 rounded border p-3">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      ✓ Advantages:
                    </p>
                    <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                      <li>
                        <strong>Handles massive datasets</strong> - Millions of
                        rows no problem
                      </li>
                      <li>
                        <strong>Low memory footprint</strong> - Only current
                        page in memory
                      </li>
                      <li>
                        <strong>Fast initial load</strong> - Fetches only first
                        page
                      </li>
                      <li>
                        <strong>Always up-to-date</strong> - Fresh data on each
                        request
                      </li>
                    </ul>
                  </div>

                  <div className="bg-red-500/10 border-red-500/20 rounded border p-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      ✗ Limitations:
                    </p>
                    <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                      <li>
                        <strong>Loading states</strong> - Brief loading on each
                        page/sort/filter
                      </li>
                      <li>
                        <strong>Network dependency</strong> - Requires server
                        connection
                      </li>
                      <li>
                        <strong>Server load</strong> - More API calls
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 border-blue-500/20 rounded border p-3">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    💡 Recommended for:
                  </p>
                  <ul className="text-muted-foreground ml-4 mt-1 list-disc space-y-1 text-sm">
                    <li>Datasets with &gt; 1,000 items</li>
                    <li>Frequently updated data</li>
                    <li>User-generated content (posts, comments, etc.)</li>
                    <li>Complex filtering or search requirements</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mode Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Client Mode
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Server Mode
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Auto Mode
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">API Calls</td>
                    <td className="px-4 py-3 text-sm">1 (fetch all)</td>
                    <td className="px-4 py-3 text-sm">Many (per action)</td>
                    <td className="px-4 py-3 text-sm">1 + depends on size</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Sort/Filter Speed
                    </td>
                    <td className="px-4 py-3 text-sm">Instant</td>
                    <td className="px-4 py-3 text-sm">Network delay</td>
                    <td className="px-4 py-3 text-sm">Depends on mode</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Memory Usage
                    </td>
                    <td className="px-4 py-3 text-sm">High (all data)</td>
                    <td className="px-4 py-3 text-sm">Low (1 page)</td>
                    <td className="px-4 py-3 text-sm">Optimized</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">
                      Initial Load
                    </td>
                    <td className="px-4 py-3 text-sm">Slower</td>
                    <td className="px-4 py-3 text-sm">Faster</td>
                    <td className="px-4 py-3 text-sm">Optimized</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium">Best For</td>
                    <td className="px-4 py-3 text-sm">&lt; 1K items</td>
                    <td className="px-4 py-3 text-sm">&gt; 1K items</td>
                    <td className="px-4 py-3 text-sm">Unknown size</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Return Values */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Return Values</h3>
        <p className="text-muted-foreground leading-relaxed">
          The hook returns an object with several properties for managing your
          data.
        </p>

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
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      data
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">T[]</code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Array of data items for current page
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      isLoading
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      boolean
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    True only on initial load
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      isFetching
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      boolean
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    True during any fetch operation
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      error
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      Error | null
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Error object if request failed
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      extendedPagination
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      ExtendedPagination
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Pagination metadata (pageIndex, pageSize, totalItems,
                    totalPages)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      setPagination
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      Function
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Update pagination (standalone mode only)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      refetch
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      Function
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Manually trigger a data refetch
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      resolvedMode
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm">
                      &quot;client&quot; | &quot;server&quot; | null
                    </code>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    The actual mode being used (null during detection)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Real-World Examples</h3>

        <div className="space-y-4">
          {/* Example 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Example 1: Multi-Select with Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                From the Course Editor - fetches all categories for a
                multi-select dropdown. Uses client mode to load all options at
                once.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`const {
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

// Use in form
<FormMultiSelect
  control={form.control}
  fieldName="categories"
  label={t("courseManager.categories")}
  disabled={categoriesLoading || !!categoriesError}
  options={data.map((category) => ({
    label: category.name,
    value: category.documentId,
  }))}
/>`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Example 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Example 2: DataDisplay Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Used internally by the DataDisplay component to power both table
                and grid views with automatic mode detection.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`// Inside DataDisplay component
const { data, isLoading, error, extendedPagination, resolvedMode } =
  usePaginatedData<T>({
    mode: "integrated",
    queryKey,
    urlPath,
    fields,
    populate,
    config,
    tableState: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
  });

// resolvedMode tells you which mode is active
console.log(\`Using \${resolvedMode} mode\`);`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Best Practices</h3>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                1. Use Auto Mode by Default
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Let the hook automatically optimize for your dataset size.
                Override only when you have specific requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                2. Provide Meaningful Query Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Query keys enable proper cache management and invalidation.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`// Good - specific and invalidatable
queryKey: ["course-categories"]
queryKey: ["courses", { status: "published" }]

// Bad - generic or missing
queryKey: ["data"]
// No queryKey (defaults to URL)`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                3. Optimize Strapi Field Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Only fetch the fields you need to reduce payload size.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`// Only fetch needed fields
fields: ["name", "description"]
populate: ["categories"] // Only populate required relations`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                4. Handle Loading and Error States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Always handle loading and error states for better UX.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`const { data, isLoading, error, refetch } = usePaginatedData({
  // ... config
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorDisplay error={toAppError(error)} />;

return <YourComponent data={data} />;`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration with DataDisplay */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Integration with DataDisplay</h3>
        <p className="text-muted-foreground leading-relaxed">
          The{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            DataDisplay
          </code>{" "}
          component uses this hook internally in integrated mode. When you
          configure DataDisplay, you&apos;re actually configuring
          usePaginatedData under the hood.
        </p>

        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`// DataDisplay config maps to usePaginatedData config
<DataDisplay
  config={{
    renderMode: "auto",          // → usePaginatedData config.renderMode
    clientModeThreshold: 50,     // → usePaginatedData config.clientModeThreshold
  }}
  // ... other props
/>`}</code>
            </pre>
          </CardContent>
        </Card>

        <div className="bg-muted/30 rounded-lg border p-4">
          <p className="text-sm">
            <strong>See also:</strong> The DataDisplay component documentation
            for examples of how this hook is used in table and grid views.
          </p>
        </div>
      </section>
    </div>
  );
};

export default UsePaginatedDataDemo;
