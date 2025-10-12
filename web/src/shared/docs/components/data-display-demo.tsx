import { mdiTable, mdiViewGrid } from "@mdi/js";
import Icon from "@mdi/react";
import { BookOpen, Star } from "lucide-react";

import { Badge } from "@/shared/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";

// Sample data type for examples
interface SampleCourse {
  documentId: string;
  title: string;
  categories: string[];
  rating: number;
  hours: number;
}

const DataDisplayDemo = () => {
  const sampleGridRender = (course: SampleCourse) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-[#28363E]">
          <BookOpen className="h-5 w-5" />
          <CardTitle className="truncate" title={course.title}>
            {course.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {course.categories.map((cat, index) => (
            <Badge key={`${cat}-${String(index)}`} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{course.rating}</span>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">{course.hours} hours</p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          DataDisplay Component
        </h2>
        <p className="text-muted-foreground text-lg">
          A flexible, high-performance data display component that supports both
          table and grid view modes with automatic or manual pagination,
          sorting, and filtering.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">
          The DataDisplay component is a powerful solution for displaying
          collections of data. It integrates TanStack Table for robust table
          functionality and provides a flexible grid view for card-based
          layouts. The component automatically handles data fetching,
          pagination, sorting, and filtering with both client-side and
          server-side rendering modes.
        </p>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Key Features</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>Dual view modes: Table and Grid with seamless switching</li>
            <li>
              Automatic render mode detection (client vs server) based on data
              size
            </li>
            <li>Built-in search, sorting, and column filtering</li>
            <li>Responsive pagination with customizable page sizes</li>
            <li>Full integration with TanStack Table for advanced features</li>
            <li>Strapi-compatible API integration</li>
            <li>Loading states and error handling</li>
          </ul>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Basic Usage</h3>

        <div className="space-y-6">
          {/* Table Only */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Icon path={mdiTable} size={0.9} />
              Table View Only
            </h4>
            <p className="text-muted-foreground text-sm">
              Use when you only need a traditional table layout with sorting and
              filtering capabilities.
            </p>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<DataDisplay
  queryKey={['courses']}
  urlPath="/courses"
  columns={courseColumns}
  allowedViewModes="table"
  initialPageSize={20}
  fields={["title", "difficulty"]}
  populate={["course_categories"]}
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Grid Only */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Icon path={mdiViewGrid} size={0.9} />
              Grid View Only
            </h4>
            <p className="text-muted-foreground text-sm">
              Use when you want a card-based layout, perfect for showcasing
              items with images or rich content.
            </p>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<DataDisplay
  queryKey={['courses']}
  urlPath="/courses"
  columns={courseColumns} // Still needed for sorting
  allowedViewModes="grid"
  gridItemRender={(course) => <CourseCard course={course} />}
  initialPageSize={20}
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Both Modes */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Icon path={mdiTable} size={0.9} />
              <Icon path={mdiViewGrid} size={0.9} />
              Both Modes with Switcher
            </h4>
            <p className="text-muted-foreground text-sm">
              Provide users with the flexibility to switch between table and
              grid views based on their preference.
            </p>
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <pre className="overflow-x-auto text-sm">
                  <code className="font-mono">{`<DataDisplay
  queryKey={['courses']}
  urlPath="/courses"
  columns={courseColumns}
  allowedViewModes="both"
  gridItemRender={(course) => <CourseCard course={course} />}
  initialPageSize={20}
/>`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Column Definitions */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Column Definitions</h3>
        <p className="text-muted-foreground leading-relaxed">
          Columns are defined using TanStack Table&apos;s{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            ColumnDef
          </code>{" "}
          type. They control how data is displayed, sorted, and filtered in
          table view. Even in grid-only mode, columns are required for sorting
          and filtering functionality.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Example Column Definition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`import { type ColumnDef } from "@tanstack/react-table";

export const createCourseColumns = (): ColumnDef<Course>[] => {
  return [
    {
      accessorKey: "title",
      header: "Course Name",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium">{course.title}</span>
          </div>
        );
      },
      meta: {
        sortable: true,        // Enable sorting
        filterable: true,      // Enable filtering
        visibleByDefault: true, // Show by default
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: ({ row }) => {
        const categories = row.original.categories ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <Badge key={cat.id} variant="secondary">
                {cat.name}
              </Badge>
            ))}
          </div>
        );
      },
      meta: {
        sortable: false,       // Relations often can't be sorted
        filterable: true,
        visibleByDefault: true,
      },
    },
  ];
};`}</code>
            </pre>
          </CardContent>
        </Card>

        <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Column Definition Properties</p>
          <ul className="text-muted-foreground ml-6 list-disc space-y-1 text-sm">
            <li>
              <strong className="text-foreground">accessorKey</strong> - The key
              in your data object to access
            </li>
            <li>
              <strong className="text-foreground">header</strong> - Column
              header text or component
            </li>
            <li>
              <strong className="text-foreground">cell</strong> - Custom render
              function for the cell content
            </li>
            <li>
              <strong className="text-foreground">meta</strong> - Custom
              metadata for column behavior (sortable, filterable, visibility)
            </li>
            <li>
              <strong className="text-foreground">id</strong> - Optional unique
              identifier (required for columns without accessorKey)
            </li>
          </ul>
        </div>
      </section>

      {/* Grid Render Function */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Grid Render Function</h3>
        <p className="text-muted-foreground leading-relaxed">
          When using grid or both modes, you must provide a{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            gridItemRender
          </code>{" "}
          function that defines how each item should be displayed in the grid
          view.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Example Grid Render Function
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle className="truncate">{course.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {course.categories?.map((cat) => (
            <Badge key={cat.id} variant="outline">
              {cat.name}
            </Badge>
          ))}
        </div>
        <StarRating rating={course.rating} className="mt-2" />
      </CardContent>
      <CardFooter>
        <Button variant="secondary">View Course</Button>
      </CardFooter>
    </Card>
  );
};

// Usage in DataDisplay
<DataDisplay
  gridItemRender={(course) => <CourseCard course={course} />}
  // ... other props
/>`}</code>
            </pre>

            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
              <p className="text-sm font-medium">Preview Example</p>
              <div className="mt-3">
                {sampleGridRender({
                  documentId: "1",
                  title: "Introduction to React",
                  categories: ["Web Development", "Frontend"],
                  rating: 4.8,
                  hours: 12,
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Render Modes */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Render Modes & Performance</h3>
        <p className="text-muted-foreground leading-relaxed">
          DataDisplay uses the{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            usePaginatedData
          </code>{" "}
          hook internally, which supports three render modes to optimize
          performance based on dataset size.
        </p>

        <div className="bg-blue-500/10 border-blue-500/20 rounded-lg border p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            📚 Deep Dive into Render Modes
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            For a comprehensive explanation of render modes (auto, client,
            server), performance implications, and usage examples, see the{" "}
            <strong>usePaginatedData</strong> documentation page in this demo.
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Auto Mode (Recommended)</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Automatically detects optimal mode based on data size.
                    Default threshold: 10,000 items.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Client Mode</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Fetches all data once. Instant sorting/filtering. Best for{" "}
                    &lt; 1,000 items.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm">Server Mode</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    API call per operation. Handles massive datasets. Best for{" "}
                    &gt; 1,000 items.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium mb-2">
                  Configuring Render Mode:
                </p>
                <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                  <code className="font-mono">{`<DataDisplay
  config={{
    renderMode: "auto",          // "auto" | "client" | "server"
    clientModeThreshold: 50,     // Optional: Override threshold
  }}
  // ... other props
/>`}</code>
                </pre>
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
              <thead className="bg-muted/50 border-border border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Prop
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Required
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
                      queryKey
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      string | readonly unknown[]
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Unique key for React Query caching
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      urlPath
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      string
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-red-600">Yes</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    API endpoint path to fetch data from
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      columns
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      ColumnDef&lt;T&gt;[]
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-red-600">Yes</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Column definitions for table/sorting
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      allowedViewModes
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      &quot;table&quot; | &quot;grid&quot; | &quot;both&quot;
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-red-600">Yes</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Which view modes to enable
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      gridItemRender
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      (item: T) =&gt; ReactNode
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">
                      If grid enabled
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Function to render each grid item
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      initialPageSize
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      number
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Items per page (default: 20)
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      fields
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      string[]
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Strapi fields to select
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      populate
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      string | string[]
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Strapi relations to populate
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      config
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      UsePaginatedDataConfig
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Render mode and threshold config
                  </td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-sm font-mono">
                      emptyState
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-muted-foreground text-sm font-mono">
                      ReactNode
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-muted-foreground text-sm">No</span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    Custom empty state component
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Real-world Example */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">Complete Real-World Example</h3>
        <p className="text-muted-foreground leading-relaxed">
          Here&apos;s a full example showing how DataDisplay is used in the
          Course Overview page of this application.
        </p>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
              <code className="font-mono">{`import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DataDisplay } from "@/shared/data-display/data-display";
import { createCourseColumns } from "../lib/course-columns";
import { CourseCard } from "../components/course-card";

const CourseOverviewPage = () => {
  const navigate = useNavigate();

  // Create columns with dependencies
  const courseColumns = useMemo(
    () => createCourseColumns({ t, navigate }),
    [t, navigate]
  );

  // Memoize grid render function
  const courseCard = useCallback(
    (course) => <CourseCard course={course} />,
    []
  );

  return (
    <Card>
      <CardContent>
        <DataDisplay
          urlPath="/courses"
          columns={courseColumns}
          queryKey={["courses"]}
          allowedViewModes="both"
          gridItemRender={courseCard}
          fields={["title", "difficulty", "description"]}
          populate={["course_categories"]}
          initialPageSize={20}
          config={{
            renderMode: "client",
            clientModeThreshold: 50,
          }}
        />
      </CardContent>
    </Card>
  );
};`}</code>
            </pre>
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
                1. Memoize Columns and Render Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Prevent unnecessary re-renders by memoizing your columns and
                grid render functions.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`const columns = useMemo(() => createColumns(), [dependencies]);
const gridRender = useCallback((item) => <Card {...item} />, []);`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                2. Use Proper Query Keys for Cache Invalidation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Provide meaningful query keys to enable proper cache
                invalidation when data changes.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`queryKey={["courses"]} // Can invalidate with queryClient.invalidateQueries(["courses"])`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                3. Optimize Field Selection with Strapi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-3">
                Only fetch the fields you need to reduce payload size and
                improve performance.
              </p>
              <pre className="bg-muted/50 overflow-x-auto rounded-lg border p-4 text-sm">
                <code className="font-mono">{`fields={["title", "description", "difficulty"]}
populate={["course_categories"]} // Only populate needed relations`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                4. Choose Appropriate Render Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Use &quot;auto&quot; mode for flexibility, or explicitly set
                based on your data size:
              </p>
              <ul className="text-muted-foreground ml-6 mt-2 list-disc space-y-1 text-sm">
                <li>&lt; 100 items: Use client mode for best UX</li>
                <li>
                  100-1000 items: Use auto mode with appropriate threshold
                </li>
                <li>&gt; 1000 items: Use server mode for performance</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Integration with TanStack Table */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold">
          Integration with TanStack Table
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          DataDisplay uses TanStack Table v8 under the hood, which means you get
          access to all its powerful features including column visibility,
          advanced filtering, and custom cell renderers. The component handles
          all the complex state management for you.
        </p>

        <div className="bg-blue-500/10 border-blue-500/20 rounded-lg border p-4">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            📚 Learn More
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            For advanced customization and features, refer to the{" "}
            <a
              href="https://tanstack.com/table/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              TanStack Table documentation
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
};

export default DataDisplayDemo;
